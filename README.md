# VillageVision AI 🌾🤖

> **AI-powered community problem reporting and development platform**

VillageVision AI is a modern web application designed for smart village infrastructure management, automated issue categorization, and community development tracking.

This project is built as a clean, independent full-stack web prototype suitable for college project demonstrations and can be easily opened and run directly from **VS Code**.

---

## 📁 Project Structure

```
VillageVision-AI/
├── frontend/             # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # Navbar, Hero, Features, About, Footer
│   │   ├── App.jsx
│   │   ├── index.css     # Modern aesthetic design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/              # Python Flask backend server
│   ├── app.py            # Flask application entry point with SQLite setup
│   ├── requirements.txt  # Backend dependencies
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 How to Run the Project from VS Code

### Prerequisites

Make sure you have installed on your computer:
1. **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
2. **Python 3** (v3.9 or higher) - [Download Python](https://www.python.org/)

---

### Step 1: Run the Backend (Python Flask)

1. Open a new terminal in VS Code (`Ctrl + ~` or `Terminal -> New Terminal`).
2. Navigate into the `backend` directory:
   ```bash
   cd backend
   ```
3. (Optional but recommended) Create and activate a virtual environment:
   - **Windows PowerShell**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate
     ```
   - **macOS / Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Start the Flask server:
   ```bash
   python app.py
   ```
   *The Flask backend will run on `http://localhost:5000` and automatically create the SQLite database (`village_vision.db`).*

---

### Step 2: Run the Frontend (React + Vite)

1. Open a **second** terminal tab in VS Code.
2. Navigate into the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install Node package dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to the address shown in the terminal (usually `http://localhost:3000` or `http://localhost:5173`).

---

## 💡 Tech Stack Overview

- **Frontend**: React 18, Vite, JavaScript, Vanilla CSS (Glassmorphism & CSS Variables), Lucide Icons
- **Backend**: Python 3, Flask, Flask-CORS
- **Database**: SQLite3 (`backend/village_vision.db`)

---

## 📌 Features Included in First Step

1. **Professional Landing Page**: Sleek design with responsive laptop and mobile layouts.
2. **Navigation Header**: Branding logo with Home, About, Features, and Login buttons.
3. **Hero Section**: Explaining *"AI-powered community problem reporting and development platform"*.
4. **Call to Action**: High-visibility "Get Started" buttons.
5. **Core Feature Showcase**:
   - Report Community Issues
   - AI-Powered Categorization
   - Community Insights
   - Stakeholder Collaboration

---

## 🎯 Next Steps Roadmap

- User Authentication System (Villager & Admin Login)
- Issue Reporting Modal with Photo Upload & Geolocation
- AI Severity & Category Classifier Endpoint
- Interactive Dashboard with Resolution Heatmaps & Status Filters
