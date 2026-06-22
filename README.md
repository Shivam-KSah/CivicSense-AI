# 🏘️ CivicSense AI — Community Hero Platform

> **Vibe2Ship Hackathon | Coding Ninjas × Google for Developers**

A hyperlocal civic issue reporting and resolution platform powered by **Google Gemini AI**. Citizens can report, verify, track, and resolve community infrastructure issues — potholes, water leaks, broken streetlights, and more.

[![Built with Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

## 🎯 Problem Statement

**Community Hero — Hyperlocal Problem Solver**

Communities frequently face issues such as potholes, water leakages, damaged streetlights, and waste management concerns. Reporting these issues is often fragmented, difficult to track, and lacks transparency.

CivicSense AI solves this by enabling citizens to **identify, report, validate, track, and resolve** community issues through collaboration, data, and intelligent automation.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📸 **AI Issue Reporting** | Upload a photo → Gemini Vision auto-categorizes, rates severity, routes to the right department |
| 🗺️ **Live Issue Map** | Interactive Leaflet map with color-coded severity markers and real-time status |
| ✅ **Community Verification** | Citizens upvote and verify issues — transparency through crowd-wisdom |
| 📊 **AI Insights Dashboard** | Gemini-generated weekly community summaries, hotspot analysis, predictive trends |
| 🏆 **Gamification** | XP system, badges, and leaderboard to drive civic engagement |
| 🤖 **CivicBot** | Floating Gemini-powered AI assistant for issue reporting guidance |
| 📋 **Full Issue Tracking** | Status pipeline: Reported → Verified → In Progress → Resolved |

---

## 🧠 Google Technologies Used

- **Google Gemini 1.5 Flash** — Image analysis for issue categorization, AI insights generation, CivicBot chat
- **Google AI Studio** — API access and deployment
- **Firebase** — Authentication, Firestore database, Storage, Hosting

---

## 🛠️ Tech Stack

```
Frontend:   React 19 + Vite
Styling:    Vanilla CSS (custom design system)
AI:         Google Gemini API (gemini-1.5-flash)
Maps:       Leaflet.js + OpenStreetMap
Charts:     Recharts
Auth:       Firebase Auth
Database:   Firebase Firestore
Hosting:    Firebase Hosting
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Shivam-KSah/civicsense-ai.git
cd civicsense-ai

# Install dependencies
npm install

# Set up environment variables (copy .env.example to .env and add your API key)
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables (`.env`)

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

---

## 🤖 AI Integration Details

### Image Analysis (Gemini Vision)
When a user uploads a photo of a civic issue, Gemini analyzes it and returns:
- **Category** (Pothole, Water Leakage, Streetlight, etc.)
- **Severity** (1–5 scale) + **Urgency Level**
- **Auto-generated Title & Description**
- **Suggested Department** (Public Works, Water Authority, etc.)
- **Confidence Score** (%)

### Community Insights (Gemini Text)
AI summary from aggregated issue statistics with community health overview, top concerns, recommendations for authorities, and trend alerts.

### CivicBot Assistant
Floating chat widget powered by Gemini for guided reporting and civic Q&A.

---

## 📊 Evaluation Criteria Alignment

| Criteria | Weightage | Our Approach |
|---|---|---|
| Problem Solving & Impact | 20% | End-to-end civic reporting gap solution |
| Agentic Depth | 20% | Gemini autonomously categorizes, analyzes, generates insights |
| Innovation & Creativity | 20% | Gamification + AI verification + predictive hotspot analysis |
| Usage of Google Technologies | 15% | Gemini API + Google AI Studio + Firebase |
| Product Experience & Design | 10% | Nextdoor-inspired premium UI |
| Technical Implementation | 10% | React + Vite + real-time data |
| Completeness & Usability | 5% | All features functional and deployed |

---

## 👤 Author

**Shivam Kumar Sah** | IDD, Mechanical Engineering, IIT(BHU) Varanasi  
GitHub: [@Shivam-KSah](https://github.com/Shivam-KSah)

*Built for Vibe2Ship Hackathon — Coding Ninjas × Google for Developers, June 2026*
