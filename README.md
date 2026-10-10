# Shree Shathvi — Personal Portfolio Website

A personal portfolio website for **Shree Shathvi**, B.Sc. Computer Science graduate (2026) from **Ayya Nadar Janaki Ammal College**, aspiring Software Developer, and Machine Learning enthusiast.

Built with **HTML5, CSS3, and Vanilla JavaScript**, this site has zero build steps and is ready to deploy directly to **Vercel** or **GitHub Pages**.

---

## 🌟 Visual & Technical Highlights

- **Original Editorial Aesthetic**: Midnight navy & charcoal dark theme with electric lavender accents (`#a78bfa`), paired with a warm ivory light theme.
- **Instant Dark/Light Theme Switching**: Respects system preference, persists user choice in `localStorage`, and eliminates theme flickering on reload.
- **Dynamic Projects Showcase**: Projects stored in a clean JavaScript data array with category filtering (`All`, `Machine Learning`, `Web Development`, `Data Analytics`).
- **Honest Project & Metric Bounds**: Real GitHub repository links, transparent status badges, and safe "Demo Coming Soon" states for unconfigured deployments.
- **Smart Resume Handling**: Graceful fallback modal explaining that the resume is being updated until `assets/resume.pdf` is placed.
- **Honest Email Fallback**: Validated contact form triggering a pre-filled email draft to `shreeshathvi@gmail.com` with a copyable fallback dialog.
- **Fully Responsive & Accessible**: Semantic HTML5, ARIA labels, keyboard focus rings, and prefers-reduced-motion support.

---

## 📁 Project Directory Structure

```text
shree-portfolio/
├── index.html              # Main HTML markup (semantic & SEO-optimized)
├── css/
│   └── style.css           # Custom CSS tokens, layouts, animations & responsive styles
├── js/
│   └── script.js           # Theme switcher, project data, filters, form & resume logic
├── assets/
│   ├── images/             # Media and screenshot assets
│   └── resume.pdf          # [ADD HERE] Your real resume PDF
└── README.md               # Documentation and deployment guide
```

---

## 🚀 How to Run Locally

Because this project uses vanilla web standards, you do not need `npm install` or any build tooling.

### Option 1: Python Built-in HTTP Server (Recommended)
Open PowerShell or your terminal in this directory:
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Node.js `serve`
```bash
npx serve .
```

### Option 3: VS Code / IDE Live Server
Right-click `index.html` in your editor and select **"Open with Live Server"**.

---

## ✏️ Remaining Items to Add / Customize

### 1. Adding Your Resume PDF
1. Save your completed resume as a PDF.
2. Place the file at:
   ```text
   assets/resume.pdf
   ```
3. Open `js/script.js` and update line 18:
   ```javascript
   const RESUME_CONFIG = {
     isAvailable: true, // Change from false to true
     filePath: 'assets/resume.pdf',
     downloadFilename: 'Shree_Shathvi_Resume.pdf'
   };
   ```
Once enabled, clicking any **"Download Resume"** button will immediately download `Shree_Shathvi_Resume.pdf`.

---

### 2. Updating Experience & Training Details
When formal internship details (employer name, role title, duration, responsibilities) are verified:
1. Open `js/script.js`.
2. Locate `EXPERIENCE_CONFIG` (around line 30):
   ```javascript
   const EXPERIENCE_CONFIG = {
     isVerified: true, // Change from false to true
     records: [
       {
         role: 'Software Development Intern',
         organization: 'Your Company Name',
         location: 'Location / Remote',
         period: 'Jan 2025 — Present',
         responsibilities: [
           'Developed backend REST APIs using Java and Spring Boot.',
           'Integrated MySQL database schemas for data persistence.',
           'Collaborated on feature enhancements and unit tests.'
         ]
       }
     ]
   };
   ```
3. The site will automatically transition from the "Academic Training" notice to your formal experience timeline.

---

### 3. Adding Live Project Demos
When you deploy `NAVIRA AI` or `inventory-management` to a live server:
1. Open `js/script.js`.
2. Locate the project inside `projectsData`.
3. Set `liveUrl` to your URL:
   ```javascript
   liveUrl: 'https://your-deployed-app.vercel.app'
   ```
The card will automatically replace the "Demo Coming Soon" badge with an active "Live Demo" button.

---

## 🌐 Step-by-Step Vercel Deployment

Deploying this site to Vercel is completely free and takes less than 2 minutes.

### Step 1: Initialize Git and Push to GitHub
If you haven't already pushed this folder to GitHub, run:
```bash
git init
git add .
git commit -m "Initial commit: Shree Shathvi portfolio"
git branch -M main
git remote add origin https://github.com/shreeshathvi/portfolio.git
git push -u origin main
```
*(Replace `portfolio.git` with your repository name)*

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in using your GitHub account.
2. Click **"Add New..."** in the dashboard and choose **"Project"**.
3. Select your portfolio repository from the list and click **"Import"**.

### Step 3: Configure and Deploy
- **Framework Preset**: Choose **"Other"** (or leave as default static).
- **Root Directory**: `./` (default).
- **Build Command**: Leave empty (no build step needed).
- **Output Directory**: Leave empty.
- Click **"Deploy"**.

Vercel will deploy your site in seconds and provide a live URL (e.g. `https://shree-shathvi-portfolio.vercel.app`) with automatic SSL/HTTPS and instant redeployment on git push.

---

## 📬 Contact & Profiles

- **Email**: [shreeshathvi@gmail.com](mailto:shreeshathvi@gmail.com)
- **LinkedIn**: [linkedin.com/in/shree-shathvi-49511b281](https://www.linkedin.com/in/shree-shathvi-49511b281/)
- **GitHub**: [github.com/shreeshathvi](https://github.com/shreeshathvi)
- **College**: Ayya Nadar Janaki Ammal College (B.Sc. Computer Science, 2026)
