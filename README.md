<p align="center">
  <h1 align="center">🏋️ FitFusion — Campus Wellness Ecosystem</h1>
  <p align="center">
    A full-stack wellness platform built for IIT campus life — track fitness, nutrition, mood, and environmental health. Powered by classical ML, real-time APIs, and a multi-tier architecture.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Express.js-000?logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2016-000?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Mobile-Expo%20(React%20Native)-4630EB?logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-SQLite%20(Prisma)-003B57?logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Time--Series-InfluxDB-22ADF6?logo=influxdb&logoColor=white" />
  <img src="https://img.shields.io/badge/AI%20Chat-Groq%20%7C%20Llama%203.3-F55036" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Web Frontend Setup](#2-web-frontend-setup)
  - [Mobile App Setup](#3-mobile-app-setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Team](#team)
- [License](#license)

---

## Overview

**FitFusion** is a comprehensive campus wellness ecosystem designed for IIT students and administrators. It bridges the gap between fitness tracking, nutritional awareness, mental wellness, and environmental health — all in one unified platform.

The platform consists of three major components:

| Component | Description | Target Users |
|-----------|-------------|--------------|
| **Backend API** | RESTful API gateway with authentication, data simulation, and external API integrations | — |
| **Web Dashboard** | Admin panel for analytics, user management, reports, and campus environment monitoring | Administrators |
| **Mobile App** | Student-facing app for tracking activities, nutrition, mood, and accessing the AI wellness chatbot | Students |

---

## Architecture

```
┌─────────────────┐    ┌─────────────────────────────┐    ┌────────────────┐
│   Mobile App    │    │       Backend (API)         │    │  Web Dashboard │
│  (Expo / RN)    │◄──►│     Express.js + Prisma     │◄──►│   (Next.js 16) │
│                 │    │                             │    │                │
│ • Activity Log  │    │  ┌─────────┐ ┌────────────┐ │    │ • Analytics    │
│ • Nutrition     │    │  │ SQLite  │ │ InfluxDB   │ │    │ • User Mgmt    │
│ • Mood Check-in │    │  │ (Prisma)│ │ (Env Data) │ │    │ • Nutrition    │
│ • AI Chatbot    │    │  └─────────┘ └────────────┘ │    │ • Reports      │
│ • Journal       │    │                             │    │ • Environment  │
└─────────────────┘    │  External APIs:             │    └────────────────┘
                       │  • Groq (Llama 3.3 Chatbot) │
                       │  • USDA (Nutrition Search)  │
                       │  • InfluxDB (Environment)   │
                       └─────────────────────────────┘
```

> 📐 **For detailed HLD/LLD with UML class diagrams, sequence diagrams, ER diagrams, and component diagrams**, see **[DESIGN.md](DESIGN.md)**.

---

## Features

### Activity Tracking (Mobile)
- Log workouts: running, gym, swimming, yoga, and more
- Track duration, calories burned, sets, reps, and load
- View activity history with visual charts and breakdowns
- Detailed activity insights per session

### Nutrition Management
- **Food Search** — Real-time nutritional lookup via the USDA FoodData Central API
- **Meal Logging** — Log meals (breakfast, lunch, dinner, snack) with auto-calculated macros
- **Nutrition Dashboard** — Visualize daily caloric intake, protein, carbs, and fats
- **Mess Menu** — Campus mess menu tracking with estimated calorie counts

### Mental Wellness
- **Mood Check-ins** — Daily mood scoring (0–4 scale) with optional notes
- **Mood Analytics** — Track mood trends over time with visual charts
- **Journaling** — Private journal with title/body entries for self-reflection
- **Burnout Detection** — Automated burnout alerts based on activity and mood patterns

### AI Wellness Chatbot
- Powered by **Groq API** with the **Llama 3.3 70B** model
- Scoped to wellness topics: fitness, nutrition, mental health, campus life
- Context-aware with conversation history (last 10 messages)
- Indian campus-focused advice (mess food, hostel life, exam stress)

### Campus Environment Monitoring
- Real-time environmental data from **InfluxDB**
- Tracks AQI, noise levels, temperature, humidity, crowd density, and rainfall
- Zone-based monitoring across campus locations
- Displayed on both web and mobile dashboards

### Admin Dashboard (Web)
- **Statistics Overview** — KPI cards (total users, active today, burnout alerts, wellness score)
- **Activity Trends** — Daily/weekly/monthly activity visualizations with Recharts
- **Nutrition Analytics** — Caloric breakdown by meal type (donut charts)
- **Hostel Comparison** — Cross-hostel wellness rankings with progress bars
- **User Management** — View and manage student profiles
- **Report Builder** — Generate and export wellness reports as CSV
- **Wellness Events** — Manage campus wellness events (yoga, meditation, sports)

### Authentication & Security
- JWT-based authentication with role-based access (Student / Admin)
- Bcrypt password hashing
- Rate limiting (100 requests / 15 minutes per IP)
- Helmet.js for HTTP security headers
- Protected API routes with middleware guards

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Express.js 5** | REST API framework |
| **Prisma ORM** | Database access & schema management |
| **SQLite** | Primary relational database |
| **InfluxDB** | Time-series data for environment monitoring |
| **JWT** | Authentication tokens |
| **Bcrypt.js** | Password hashing |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | API rate limiting |
| **Groq API** | AI chatbot (Llama 3.3 70B) |
| **USDA FoodData API** | Real-time nutrition search |

### Web Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Recharts** | Data visualization (charts & graphs) |
| **Lucide React** | Modern icon library |
| **Axios** | HTTP client |

### Mobile App
| Technology | Purpose |
|---|---|
| **Expo SDK 54** | React Native development platform |
| **React Native 0.81** | Cross-platform mobile framework |
| **React Navigation 7** | Stack & tab navigation |
| **AsyncStorage** | Local data persistence |
| **React Native Chart Kit** | Mobile data visualizations |
| **React Native Reanimated** | Performant animations |
| **Expo Linear Gradient** | UI gradient effects |
| **Toast Messages** | User feedback notifications |

---

## Project Structure

```
FitFusion/
├── backend/
│   ├── controllers/
│   │   ├── activityController.js    # Activity CRUD & analytics
│   │   ├── authController.js        # Login, register, JWT
│   │   ├── chatController.js        # Groq-powered AI chatbot
│   │   ├── dashboardController.js   # Admin dashboard stats & analytics
│   │   ├── environmentController.js # InfluxDB environment data
│   │   ├── foodItemController.js    # Food catalog management
│   │   ├── moodController.js        # Mood check-ins & trends
│   │   ├── nutritionController.js   # Nutrition logging & analysis
│   │   ├── nutritionSearchController.js # USDA API food search
│   │   └── wellnessController.js    # Wellness events & participation
│   ├── middleware/                   # Auth middleware (JWT verification)
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (10 models)
│   │   └── seed.js                  # Database seeding script
│   ├── routes/
│   │   ├── adminRoutes.js           # Admin-only API routes
│   │   ├── authRoutes.js            # Authentication routes
│   │   └── studentRoutes.js         # Student API routes
│   ├── utils/
│   │   └── autoUpdater.js           # Generates simulated data every 30 min
│   ├── server.js                    # Express app entry point
│   └── .env.example                 # Environment variable template
│
├── web-frontend/
│   ├── app/
│   │   ├── page.tsx                 # Dashboard home (statistics)
│   │   ├── layout.tsx               # Root layout with sidebar
│   │   ├── login/                   # Admin login page
│   │   ├── analytics/               # Detailed analytics page
│   │   ├── nutrition/               # Nutrition management
│   │   ├── activities/              # Activity management
│   │   ├── wellness/                # Wellness events
│   │   ├── environment/             # Campus environment monitoring
│   │   ├── users/                   # User management
│   │   ├── reports/                 # Report builder & export
│   │   └── profile/                 # Admin profile
│   ├── components/
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   ├── StatCard.tsx             # KPI stat card component
│   │   ├── ChartCard.tsx            # Chart wrapper component
│   │   └── DataTable.tsx            # Reusable data table
│   └── lib/
│       └── api.ts                   # Axios API client
│
├── mobile-app/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── auth/                # Login & registration
│   │   │   ├── home/                # Home dashboard
│   │   │   ├── activity/            # Activity tracking & history
│   │   │   ├── nutrition/           # Meal logging & nutrition search
│   │   │   ├── mood/                # Mood check-ins & journaling
│   │   │   ├── chat/                # AI wellness chatbot
│   │   │   └── profile/             # User profile & about
│   │   ├── navigation/              # Tab & stack navigators
│   │   ├── components/              # Shared UI components
│   │   ├── constants/               # Theme & config constants
│   │   └── utils/                   # Helper utilities
│   ├── assets/                      # Images, icons, fonts
│   └── App.js                       # App entry point
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** — [Download](https://git-scm.com/)
- **Expo Go** app (for mobile testing) — [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Clone the Repository

```bash
git clone https://github.com/Jgauri24/fitfusion.git
cd FitFusion
```

---

### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure environment variables:**
```bash
cp .env.example .env
```
Edit `.env` and fill in your API keys (see [Environment Variables](#environment-variables)).

**Initialize the database:**
```bash
npx prisma generate      # Generate Prisma client
npx prisma db push        # Create SQLite tables
npm run seed              # (Optional) Seed with sample data
```

**Start the server:**
```bash
npm run dev
```
> Backend runs at `http://localhost:8080`

---

### 2. Web Frontend Setup

```bash
cd web-frontend
npm install
npm run dev
```
> Open `http://localhost:3000` in your browser.

---

### 3. Mobile App Setup

```bash
cd mobile-app
npm install
npx expo start
```
> Scan the QR code with Expo Go on your device, or press `a` (Android) / `i` (iOS Simulator).

---

## Environment Variables

Create a `.env` file in the `backend/` directory using the template below:

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: `8080`) | ✅ |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ |
| `DATABASE_URL` | Prisma database URL (`file:./dev.db` for SQLite) | ✅ |
| `INFLUX_URL` | InfluxDB instance URL | ⚠️ Optional |
| `INFLUX_TOKEN` | InfluxDB authentication token | ⚠️ Optional |
| `INFLUX_ORG` | InfluxDB organization name | ⚠️ Optional |
| `INFLUX_BUCKET` | InfluxDB bucket name | ⚠️ Optional |
| `GROQAPI` | Groq API key for AI chatbot | ⚠️ Optional |
| `USDA_API_KEY` | USDA FoodData Central API key | ⚠️ Optional |

> **Note:** The app will work without optional API keys, but the corresponding features (chatbot, nutrition search, environment data) will be unavailable.

---

## Database Schema

The application uses **Prisma ORM** with **SQLite** and defines the following models:

| Model | Description |
|---|---|
| `User` | Student/admin profiles with campus metadata (hostel, branch, year) |
| `NutritionLog` | Meal logs with calories, protein, carbs, fats |
| `ActivityLog` | Workout logs with duration, calories, sets/reps/load |
| `FoodItem` | Food catalog with nutritional information |
| `MessMenu` | Campus mess menu with meal types and calorie estimates |
| `EnvironmentZone` | Campus zone environmental readings (AQI, noise, temp) |
| `WellnessEvent` | Scheduled wellness events (yoga, meditation, sports) |
| `EventParticipation` | Student event registrations and attendance |
| `MoodCheckIn` | Daily mood scores (0–4) with notes |
| `Journal` | Private journal entries with title and body |

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive JWT token |
| `GET` | `/profile` | Get current user profile |
| `PUT` | `/profile` | Update user profile |

### Student Routes (`/api/student`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/activities` | Log a new activity |
| `GET` | `/activities` | Get activity history |
| `POST` | `/nutrition` | Log a meal |
| `GET` | `/nutrition` | Get nutrition history |
| `POST` | `/mood` | Submit mood check-in |
| `GET` | `/mood/trends` | Get mood trends |
| `POST` | `/journal` | Create journal entry |
| `POST` | `/chat` | Send message to AI chatbot |
| `GET` | `/food-search` | Search USDA nutrition data |
| `GET` | `/food-items` | Browse food catalog |

### Admin Routes (`/api/admin`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/dashboard/stats` | Get dashboard KPIs and analytics |
| `GET` | `/users` | List all users |
| `GET` | `/nutrition/analytics` | Nutrition analytics |
| `GET` | `/activities/analytics` | Activity analytics |
| `GET` | `/wellness/events` | List wellness events |
| `POST` | `/wellness/events` | Create wellness event |
| `GET` | `/environment` | Get environment zone data |
| `GET` | `/reports` | Generate reports |

---

## Screenshots

> _Screenshots can be added here to showcase the web dashboard and mobile app interfaces._

---

## Troubleshooting

| Issue | Solution |
|---|---|
| **Database errors** | Ensure `DATABASE_URL` is set in `.env`, then run `npx prisma db push` |
| **Prisma client not found** | Run `npx prisma generate` to regenerate the Prisma client |
| **Dependency issues** | Delete `node_modules/` and `package-lock.json`, then run `npm install` |
| **Expo connection fails** | Ensure your phone and computer are on the same Wi-Fi network |
| **API rate limit hit** | Wait 15 minutes or adjust the rate limiter in `server.js` |
| **Chatbot not responding** | Verify `GROQAPI` key is set correctly in `.env` |
| **Nutrition search fails** | Verify `USDA_API_KEY` is set correctly in `.env` |
| **Environment data empty** | Verify InfluxDB credentials in `.env` |

---

## Team

| Name |
|---|
**Sachin Jaiswal**
**Gauri Jindal**
**Yashvi Goyal**
**Kushal Sarkar**
**Meghna Nair**

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for campus wellness
</p>
