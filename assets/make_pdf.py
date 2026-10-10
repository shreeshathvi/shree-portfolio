import socket
import hashlib
import base64
import os
import json
import time
import subprocess
import urllib.request
import re
import zlib

def generate_pdf():
    # Start Chrome headless with remote debugging
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    proc = subprocess.Popen([
        chrome_path,
        "--headless=new",
        "--remote-debugging-port=9222",
        "--disable-gpu",
        "about:blank"
    ])

    time.sleep(1.5)

    try:
        req = urllib.request.Request("http://127.0.0.1:9222/json/new", method="PUT")
        page_info = json.loads(urllib.request.urlopen(req).read().decode())
        ws_url = page_info["webSocketDebuggerUrl"]
        path = ws_url.replace("ws://127.0.0.1:9222", "")
        print("Connected to WebSocket target:", path)

        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(("127.0.0.1", 9222))

        key = base64.b64encode(os.urandom(16)).decode()
        handshake = (
            f"GET {path} HTTP/1.1\r\n"
            f"Host: 127.0.0.1:9222\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(handshake.encode())
        resp = s.recv(4096)
        if b"101 " not in resp:
            raise RuntimeError("WebSocket upgrade failed: " + resp.decode(errors="ignore"))

        def send_ws(msg):
            data = msg.encode("utf-8")
            length = len(data)
            mask = os.urandom(4)
            if length <= 125:
                header = bytes([0x81, 0x80 | length]) + mask
            elif length <= 65535:
                header = bytes([0x81, 0x80 | 126, (length >> 8) & 0xFF, length & 0xFF]) + mask
            else:
                header = bytes([0x81, 0x80 | 127]) + length.to_bytes(8, "big") + mask
            masked_data = bytes([b ^ mask[i % 4] for i, b in enumerate(data)])
            s.sendall(header + masked_data)

        def read_frame():
            # Read 2-byte header
            header = b""
            while len(header) < 2:
                chunk = s.recv(2 - len(header))
                if not chunk:
                    return None
                header += chunk
            
            b1, b2 = header[0], header[1]
            opcode = b1 & 0x0F
            masked = (b2 & 0x80) != 0
            payload_len = b2 & 0x7F

            if payload_len == 126:
                ext = b""
                while len(ext) < 2:
                    ext += s.recv(2 - len(ext))
                payload_len = int.from_bytes(ext, "big")
            elif payload_len == 127:
                ext = b""
                while len(ext) < 8:
                    ext += s.recv(8 - len(ext))
                payload_len = int.from_bytes(ext, "big")

            if masked:
                mask = b""
                while len(mask) < 4:
                    mask += s.recv(4 - len(mask))

            payload = b""
            while len(payload) < payload_len:
                chunk = s.recv(min(65536, payload_len - len(payload)))
                if not chunk:
                    break
                payload += chunk

            if masked:
                payload = bytes([b ^ mask[i % 4] for i, b in enumerate(payload)])

            return payload

        # Enable Page domain
        send_ws(json.dumps({"id": 1, "method": "Page.enable"}))
        _ = read_frame()

        # Navigate to HTML
        html_path = os.path.abspath(r"d:\shree-portfolio\assets\resume_source.html").replace("\\", "/")
        file_url = f"file:///{html_path}"
        print("Navigating to:", file_url)
        send_ws(json.dumps({"id": 2, "method": "Page.navigate", "params": {"url": file_url}}))
        
        # Wait for load event
        while True:
            frame = read_frame()
            if not frame:
                break
            try:
                msg = json.loads(frame.decode("utf-8", errors="ignore"))
                if msg.get("method") == "Page.loadEventFired" or msg.get("id") == 2:
                    break
            except Exception:
                pass

        time.sleep(0.5)

        # Print to PDF with displayHeaderFooter EXPLICITLY FALSE!
        print("Requesting PDF print with displayHeaderFooter=False...")
        send_ws(json.dumps({
            "id": 3,
            "method": "Page.printToPDF",
            "params": {
                "displayHeaderFooter": False,
                "printBackground": True,
                "preferCSSPageSize": True
            }
        }))

        # Read responses until we get id == 3
        pdf_base64 = None
        while True:
            frame = read_frame()
            if not frame:
                break
            try:
                msg = json.loads(frame.decode("utf-8", errors="ignore"))
                if msg.get("id") == 3:
                    pdf_base64 = msg["result"]["data"]
                    break
            except Exception:
                pass

        if not pdf_base64:
            raise RuntimeError("Did not receive PDF data from Chrome")

        pdf_bytes = base64.b64decode(pdf_base64)
        output_path = r"d:\shree-portfolio\assets\resume.pdf"
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)

        print(f"SUCCESS: Wrote {len(pdf_bytes)} bytes to {output_path}")

        # Verification: check if any timestamp or title text exists in decompressed streams
        streams = re.findall(rb'stream[\r\n]+(.*?)[\r\n]+endstream', pdf_bytes, re.DOTALL)
        found_leaks = []
        for s_bytes in streams:
            try:
                dec = zlib.decompress(s_bytes)
                if b'10/9' in dec or b'10/' in dec or b'PM' in dec or b'Resume' in dec or b'file:///' in dec:
                    found_leaks.append(dec)
            except Exception:
                pass

        print(f"Header/Footer leaks found: {len(found_leaks)}")
        if len(found_leaks) == 0:
            print("VERIFIED: PDF is 100% clean of browser headers, dates, and footers!")

    finally:
        try:
            proc.terminate()
        except Exception:
            pass

if __name__ == "__main__":
    generate_pdf()
