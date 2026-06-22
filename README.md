# 🏆 CivicSense AI – AI-Powered Community Issue Resolution Platform

**Coding Ninjas Hackathon Submission**
**Live Demo:** [https://civicsense-ai-shivam.web.app](https://civicsense-ai-shivam.web.app)



## 1. Overview & Vision
**CivicSense AI** is a smart, two-sided civic engagement platform that bridges the gap between citizens and municipal authorities. 

By combining **Google's Gemini Vision AI**, geolocation tracking, community gamification, and a dedicated Official Portal, CivicSense AI eliminates the friction of reporting neighborhood issues (potholes, leakages, sanitation) and gives city officials the exact data they need to fix them quickly.

---

## 2. The Two-Sided Platform

We built a complete ecosystem catering to both ends of civic management. You can instantly toggle between these roles on the Landing Page.

### 👥 For Citizens: The Community App
A highly polished, mobile-first web app that empowers residents to report issues, verify community reports, and climb local leaderboards by earning XP for civic participation.

### 🏛️ For Authorities: The Municipal Officer Portal
A secure, dedicated admin dashboard specifically for city workers. 
* **City Metrics:** View real-time analytics on critical alerts, open issues, and resolution rates.
* **Workforce Deployment:** A live interactive modal showing active field workers, their departments, distances, and zones.
* **Issue Management:** Instantly cycle the status of citizen reports (Open ➝ In Progress ➝ Resolved).
* **Official Broadcasts:** Send official updates and warnings directly to the citizen community feed.

---

## 3. Core Features & Technology

### 🤖 AI-Powered Smart Reporting
Instead of filling out tedious forms, users simply snap a photo. **Gemini Vision AI** automatically analyzes the image to:
* **Classify the Category** (e.g., Pothole, Flooding, Garbage)
* **Calculate Severity** (1-5 scale)
* **Generate a Title & Summary** based on visual evidence.
* **Recommend the appropriate City Department** to handle the fix.

### 🔍 Instant Smart Search
A robust global search bar integrated directly into the navigation. It instantly filters through all platform issues by title, category, or location, displaying results in a sleek absolute dropdown menu. Clicking a result isolates that specific issue on the Community Feed.

### 🌗 Global Dark Mode
A seamless, state-of-the-art Dark Mode toggle available on the navigation bar. With a single click, the entire platform transforms into a premium, accessible dark UI, dynamically updating backgrounds, text colors, and component shadows globally.

### 🌍 Instant Multilingual Translation
A built-in native language selector that instantly translates the entire application into 10 major Indian regional languages (Hindi, Marathi, Punjabi, Telugu, Kannada, Tamil, Gujarati, Bengali, Malayalam). This ensures maximum accessibility for all citizens, breaking down language barriers in civic reporting.

### 🛡️ Community Verification System
To ensure data integrity and prevent duplicate/fake reports, nearby citizens receive reports in their feed and can "Upvote/Verify" the issue. This crowdsourced consensus filters out spam and establishes a credible "Trust Score" before authorities intervene.

### 🎮 Gamification & Rewards
To solve citizen apathy, we implemented a robust gamification system:
* **XP System:** Users earn points for reporting valid issues and verifying others.
* **Dynamic Badges:** Users rank up to earn beautifully designed titles like "Verified Hero" and "Community Champion".
* **Live Leaderboards:** Fosters healthy neighborhood competition and rewards top civic contributors.

### 💬 CivicBot: AI Assistant
An integrated conversational AI assistant available everywhere on the platform. Users can chat with CivicBot to learn how to report issues, understand civic processes, and navigate the platform.

---

## 4. Future Roadmap
While we have built a fully functional prototype, our vision for CivicSense AI extends much further. Our roadmap includes:
* **Predictive Analytics:** Using historical issue data and AI to predict future hotspot zones (e.g., predicting pipeline bursts before winter).
* **Automated Duplicate Detection:** Programmatically checking image embeddings to instantly flag and merge duplicate reports of the same pothole or incident.

---

## 5. Technology Stack
* **Frontend:** React.js (Vite)
* **AI Stack:** Google Gemini Generative AI (Vision & Text Models)
* **Database & Hosting:** Firebase Hosting
* **State Management:** React Context & Hooks
* **Styling & UI:** Custom CSS Variables, Lucide React Icons

---

## 6. Conclusion
CivicSense AI proves that by combining cutting-edge AI image analysis with crowdsourced community verification and a dedicated municipal response portal, we can drastically simplify and modernize civic issue management. 

