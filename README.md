# FitFusion - Campus Wellness Ecosystem

FitFusion is a comprehensive wellness platform designed for campus life, featuring a backend API, a web frontend for administration and student dashboards, and a mobile application for real-time tracking and engagement.

## Project Structure

- `backend/`: Express.js server with Prisma and SQLite.
- `web-frontend/`: Next.js application for dashboards and management.
- `mobile-app/`: Expo (React Native) application for students.

---

## Getting Started

Follow these steps to set up the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FitFusion
```

### 2. Backend Setup

The backend handles data, authentication, and integration with external APIs.

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy the example `.env` file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and fill in your actual API keys (Groq, USDA, InfluxDB).

4. **Database Setup (Prisma & SQLite):**
   - Generate the Prisma client:
     ```bash
     npx prisma generate
     ```
   - Push the schema to your local SQLite database:
     ```bash
     npx prisma db push
     ```
   - (Optional) Seed the database with sample data:
     ```bash
     npm run seed
     ```

5. **Start the server:**
   ```bash
   npm run dev
   ```
   The backend will be running at `http://localhost:8080` (or the port specified in `.env`).

---

### 3. Web Frontend Setup

The web frontend provides administrative and analytical views.

1. **Navigate to the web-frontend directory:**

   ```bash
   cd ../web-frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

### 4. Mobile App Setup

The mobile app is built with Expo.

1. **Navigate to the mobile-app directory:**

   ```bash
   cd ../mobile-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the Expo server:**
   ```bash
   npx expo start
   ```

   - Scan the QR code with the [Expo Go](https://expo.dev/go) app on your physical device.
   - Alternatively, press `a` for Android Emulator or `i` for iOS Simulator.

---

## Troubleshooting

- **Database Errors:** If you encounter database issues, ensure `DATABASE_URL` in `.env` is correctly set and run `npx prisma db push` again.
- **Dependency Issues:** Delete `node_modules` and run `npm install` if you face package-related errors.
- **Expo Connection:** Ensure your mobile device and computer are on the same Wi-Fi network when using Expo Go.

---

## License

This project is licensed under the [MIT License](LICENSE).
