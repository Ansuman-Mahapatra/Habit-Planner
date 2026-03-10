
<div align="center">

# 🌊 HabitFlow Planner

> *Build habits. Track streaks. Become consistent — anywhere.*

[![Stack](https://img.shields.io/badge/stack-MERN-20232a?style=for-the-badge&logo=mongodb)](.)
[![Mobile](https://img.shields.io/badge/mobile-Android%20APK-3DDC84?style=for-the-badge&logo=android)](.)
[![Backend](https://img.shields.io/badge/backend-Render%20(Live)-46E3B7?style=for-the-badge)](.)
[![Styling](https://img.shields.io/badge/styling-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss)](.)

---

**Log a habit on your phone → syncs to the cloud → stats update in real time. That's it.**

</div>

---

## 💡 What Is HabitFlow?

Most habit apps are either too complex or live only on your device.  
HabitFlow is neither.

You open the app, log your habit for the day, and it's **instantly stored in MongoDB** through a live cloud API — no setup, no sync button, no guesswork. Come back tomorrow; your streak is exactly where you left it.

It's a full MERN-stack web app that also **compiles into a real Android APK** — so it lives on your homescreen like any native app, with full-screen display, safe-area inserts, and hardware access via Capacitor.

---

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────┐
│         habit-spark-main/           │
│   React + Vite + Tailwind CSS       │
│                                     │
│  ┌──────────────┐  ┌─────────────┐  │
│  │  Web Browser │  │ Android APK │  │
│  │  (localhost) │  │ (Capacitor) │  │
│  └──────┬───────┘  └──────┬──────┘  │
└─────────┼─────────────────┼─────────┘
          │   REST API calls │
          ▼                  ▼
┌─────────────────────────────────────┐
│       habit-planner-backend/        │
│       Node.js + Express             │
│       Deployed on  Render  ☁️        │
│                │                    │
│                ▼                    │
│           MongoDB Atlas             │
│      (habits, streaks, stats)       │
└─────────────────────────────────────┘
```

Two folders. Two jobs. One seamless experience.

---

## ✨ Features

### 📱 Native Android Feel
- Compiles directly into an installable `.apk` via **Capacitor + Android Studio**
- Full-screen display with safe-area insets — no awkward notch overlap
- Runs on the homescreen like a real app, not a web shortcut

### ☁️ Cloud-First by Default
- Every habit you create is **immediately synced** to MongoDB through the Render-deployed backend
- No local-only data — your habits follow you across devices

### 🧭 Smart Mobile Navigation
- Hamburger-triggered **sliding drawer sidebar** with a blur backdrop
- Dynamically resizes to any screen dimension — phones, tablets, foldables

### 📊 Real-Time Statistics
- Live completion rate visualizations
- **Streak tracking** — consecutive days keep momentum visible
- Activity overview so you always know where you stand

---

## 📁 Project Structure

```
/
├── 📂 habit-spark-main/         ← Frontend + Android App
│   ├── src/
│   │   ├── components/          ← Sidebar, habit cards, stat charts
│   │   ├── pages/               ← Dashboard, habit detail, settings
│   │   └── services/            ← API calls to backend
│   ├── android/                 ← Capacitor Android project
│   ├── capacitor.config.ts      ← Native bridge config
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── README.md                ← Frontend & APK build instructions ↗
│
└── 📂 habit-planner-backend/    ← Node.js API Server
    ├── routes/                  ← Habit CRUD endpoints
    ├── models/                  ← Mongoose schemas
    ├── server.js                ← Express entry point
    └── README.md                ← Backend setup & deployment docs ↗
```

---

## 🚀 Getting Started

### What You Need

- ✅ **Node.js v18+**
- ✅ **MongoDB** (Atlas or local)
- ✅ **Android Studio** *(only if building the APK)*
- ✅ A browser *(the web version works with zero mobile setup)*

---

### Option A — Run in the Browser *(quickest)*

```bash
# 1. Start the backend
cd habit-planner-backend
npm install
npm start
# ✅ API live at http://localhost:5000

# 2. Start the frontend
cd habit-spark-main
npm install
npm run dev
# ✅ App live at http://localhost:5173
```

Open `http://localhost:5173` and you're in.

---

### Option B — Build the Android APK

```bash
# 1. Build the frontend for production
cd habit-spark-main
npm run build

# 2. Sync to Capacitor
npx cap sync android

# 3. Open in Android Studio
npx cap open android
```

Inside Android Studio:
- Connect a device or start an emulator
- Hit **▶ Run** — the APK installs and launches

> 💡 The backend is already deployed on Render, so the APK talks to the live cloud API out of the box. No local server needed on your phone.

---

## 📖 Detailed Instructions

Each sub-project has its own README with deeper setup guidance:

| Component | Instructions |
|-----------|-------------|
| 🖥️ Frontend + Android APK | [habit-spark-main/README.md](./habit-spark-main/README.md) |
| ⚙️ Backend API | [habit-planner-backend/README.md](./habit-planner-backend/README.md) |

---

## 🔄 How Data Flows

```
You log "Meditated today" in the app
           │
           ▼
   React sends POST /habits/log
           │
           ▼
   Express validates + saves to MongoDB
           │
           ▼
   Response returns updated streak + stats
           │
           ▼
   UI re-renders: streak counter ticks up 🔥
```

No refresh. No manual sync. It just works.

---

<div align="center">

Small steps, every day. HabitFlow keeps count so you don't have to.

**🌊 Track it. Streak it. Flow with it.**

</div>
