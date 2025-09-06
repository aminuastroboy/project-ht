# ❤️ Heart Tracker

A simple React + Firebase web app for tracking heart health vitals (heart rate, blood pressure, cholesterol, glucose).  
Deployed automatically to **Netlify** with GitHub Actions 🚀.

---

## 📌 Features
- Log heart vitals with a simple form
- View latest vitals on dashboard
- Firebase Firestore as database
- Toast notifications for feedback
- TailwindCSS styling
- CI/CD with GitHub Actions + Netlify

---

## 🛠️ Setup Instructions

### 1. Clone Repo
```bash
git clone https://github.com/your-username/heart-tracker.git
cd heart-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup
- Create a Firebase project → [Firebase Console](https://console.firebase.google.com/)  
- Enable **Firestore Database**  
- Copy your Firebase config and paste it into `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-PROJECT.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT.appspot.com",
  messagingSenderId: "YOUR-SENDER-ID",
  appId: "YOUR-APP-ID"
};
```

### 4. Run Locally
```bash
npm start
```

App will run on: `http://localhost:3000`

---

## 🚀 Deployment on Netlify

### 1. One-Time Setup
- Push your repo to GitHub  
- Connect GitHub repo to [Netlify](https://app.netlify.com/)  
- Deploy once manually to get **Site ID**  
- Create **Personal Access Token** in Netlify settings  

### 2. Add GitHub Secrets
In **GitHub Repo → Settings → Secrets → Actions** add:  
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

### 3. Automatic Deployment
Every push to `main` will:  
- Build React app (`npm run build`)  
- Deploy to Netlify automatically 🎉  

---

## ✅ Tech Stack
- React + Vite/CRA
- Firebase Firestore
- TailwindCSS
- Netlify Hosting
- GitHub Actions CI/CD

---

Made with ❤️ for health tracking.
