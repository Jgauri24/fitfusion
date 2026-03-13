# FitFusion — System Design Document (HLD / LLD)

> **High-Level Design (HLD)** and **Low-Level Design (LLD)** using OOAD concepts with UML class diagrams, sequence diagrams, component diagrams, and ER diagrams.

---

## Table of Contents

1. [High-Level Design (HLD)](#1-high-level-design-hld)
   - [1.1 System Context Diagram](#11-system-context-diagram)
   - [1.2 Component Diagram](#12-component-diagram)
   - [1.3 Deployment Diagram](#13-deployment-diagram)
   - [1.4 Use Case Diagram](#14-use-case-diagram)
2. [Low-Level Design (LLD)](#2-low-level-design-lld)
   - [2.1 Class Diagram — Domain Models](#21-class-diagram--domain-models)
   - [2.2 Class Diagram — Controllers & Services](#22-class-diagram--controllers--services)
   - [2.3 ER Diagram](#23-er-diagram)
   - [2.4 Sequence Diagrams](#24-sequence-diagrams)

---

## 1. High-Level Design (HLD)

### 1.1 System Context Diagram

Shows how FitFusion interacts with external actors and systems.

```mermaid
graph TB
    Student(("👨‍🎓 Student<br/>IIT campus student"))
    Admin(("👩‍💼 Admin<br/>Wellness administrator"))

    subgraph FitFusion Platform
        FF["FitFusion<br/>Full-stack campus wellness ecosystem"]
    end

    Groq["Groq API<br/>LLM inference - Llama 3.3 70B"]
    USDA["USDA FoodData API<br/>Nutritional data lookup"]
    Influx["InfluxDB Cloud<br/>Time-series environment data"]

    Student -->|Uses mobile app| FF
    Admin -->|Uses web dashboard| FF
    FF -->|AI chatbot queries| Groq
    FF -->|Nutrition search| USDA
    FF -->|Environment readings| Influx

    style FF fill:#4F46E5,stroke:#3730A3,color:#fff
    style Student fill:#10B981,stroke:#059669,color:#fff
    style Admin fill:#F59E0B,stroke:#D97706,color:#fff
    style Groq fill:#6B7280,stroke:#4B5563,color:#fff
    style USDA fill:#6B7280,stroke:#4B5563,color:#fff
    style Influx fill:#6B7280,stroke:#4B5563,color:#fff
```

---

### 1.2 Component Diagram

Internal architecture of the FitFusion backend system.

```mermaid
graph TB
    subgraph "Client Layer"
        MA[Mobile App<br/>Expo / React Native]
        WD[Web Dashboard<br/>Next.js 16]
    end

    subgraph "API Gateway Layer"
        EX[Express.js Server]
        HL[Helmet<br/>Security Headers]
        RL[Rate Limiter<br/>100 req/15min]
        CORS[CORS Middleware]
    end

    subgraph "Route Layer"
        AR[Auth Routes<br/>/api/auth]
        SR[Student Routes<br/>/api/student]
        ADR[Admin Routes<br/>/api/admin]
    end

    subgraph "Middleware Layer"
        JWT[JWT Auth Middleware<br/>Token Verification]
        RBAC[Role Guard<br/>STUDENT / ADMIN]
    end

    subgraph "Controller Layer"
        AC[AuthController]
        ACC[ActivityController]
        NC[NutritionController]
        NSC[NutritionSearchController]
        MC[MoodController]
        CC[ChatController]
        DC[DashboardController]
        EC[EnvironmentController]
        WC[WellnessController]
        FC[FoodItemController]
    end

    subgraph "Data Layer"
        PR[Prisma ORM]
        DB[(SQLite Database)]
        IF[(InfluxDB)]
    end

    subgraph "External Services"
        GROQ[Groq API<br/>Llama 3.3]
        USDA[USDA FoodData<br/>Central API]
    end

    MA --> EX
    WD --> EX
    EX --> HL
    EX --> RL
    EX --> CORS
    EX --> AR
    EX --> SR
    EX --> ADR
    AR --> AC
    SR --> JWT
    ADR --> JWT
    JWT --> RBAC
    SR --> ACC
    SR --> NC
    SR --> NSC
    SR --> MC
    SR --> CC
    SR --> FC
    ADR --> DC
    ADR --> EC
    ADR --> WC
    AC --> PR
    ACC --> PR
    NC --> PR
    MC --> PR
    DC --> PR
    WC --> PR
    FC --> PR
    PR --> DB
    EC --> IF
    CC --> GROQ
    NSC --> USDA
```

---

### 1.3 Deployment Diagram

```mermaid
graph LR
    subgraph "Student Device"
        EXPO[Expo Go App<br/>iOS / Android]
    end

    subgraph "Admin Device"
        BROWSER[Chrome / Safari<br/>Web Dashboard]
    end

    subgraph "Application Server"
        NODE[Node.js Runtime]
        EXPRESS[Express.js<br/>Port 8080]
        PRISMA[Prisma Client]
        AUTOUPD[Auto Updater<br/>30-min interval]
    end

    subgraph "Data Stores"
        SQLITE[(SQLite<br/>dev.db)]
        INFLUXDB[(InfluxDB Cloud<br/>Environment Data)]
    end

    subgraph "Third-Party APIs"
        GROQAPI[Groq Cloud<br/>Llama 3.3 70B]
        USDAAPI[USDA FoodData<br/>Central]
    end

    EXPO -->|REST API / HTTPS| EXPRESS
    BROWSER -->|REST API / HTTPS| EXPRESS
    NODE --> EXPRESS
    EXPRESS --> PRISMA
    EXPRESS --> AUTOUPD
    PRISMA --> SQLITE
    EXPRESS -->|HTTPS| INFLUXDB
    EXPRESS -->|HTTPS| GROQAPI
    EXPRESS -->|HTTPS| USDAAPI
```

---

### 1.4 Use Case Diagram

```mermaid
graph TB
    subgraph "Student Use Cases"
        UC1[Register / Login]
        UC2[Log Activity]
        UC3[View Activity History]
        UC4[Log Meal / Nutrition]
        UC5[Search Food Nutrition]
        UC6[Mood Check-in]
        UC7[Write Journal Entry]
        UC8[Chat with AI Bot]
        UC9[View Profile]
        UC10[Update Profile]
    end

    subgraph "Admin Use Cases"
        UC11[View Dashboard Analytics]
        UC12[Manage Users]
        UC13[View Nutrition Analytics]
        UC14[View Activity Analytics]
        UC15[Manage Wellness Events]
        UC16[Monitor Environment Zones]
        UC17[Generate Reports / CSV Export]
    end

    STUDENT((Student))
    ADMIN((Admin))

    STUDENT --> UC1
    STUDENT --> UC2
    STUDENT --> UC3
    STUDENT --> UC4
    STUDENT --> UC5
    STUDENT --> UC6
    STUDENT --> UC7
    STUDENT --> UC8
    STUDENT --> UC9
    STUDENT --> UC10

    ADMIN --> UC1
    ADMIN --> UC11
    ADMIN --> UC12
    ADMIN --> UC13
    ADMIN --> UC14
    ADMIN --> UC15
    ADMIN --> UC16
    ADMIN --> UC17
```

---

## 2. Low-Level Design (LLD)

### 2.1 Class Diagram — Domain Models

Object-oriented representation of the Prisma schema entities and their relationships.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String passwordHash
        +String role
        +String firstName
        +String lastName
        +Int age
        +String gender
        +Float height
        +Float weight
        +String fitnessLevel
        +String dietaryPref
        +String hostel
        +String branch
        +String academicYear
        +DateTime createdAt
        +DateTime updatedAt
    }

    class NutritionLog {
        +String id
        +String userId
        +String mealType
        +Int foodGrams
        +Float calories
        +Float protein
        +Float carbs
        +Float fats
        +String foodItemId
        +DateTime loggedAt
    }

    class ActivityLog {
        +String id
        +String userId
        +String activityType
        +Int durationMins
        +Float caloriesBurned
        +Int sets
        +Int reps
        +Float load
        +DateTime loggedAt
    }

    class FoodItem {
        +String id
        +String name
        +String category
        +String meal
        +String portion
        +Int calories
        +Float protein
        +Float carbs
        +Float fats
        +DateTime createdAt
    }

    class MessMenu {
        +String id
        +DateTime date
        +String mealType
        +String items
        +Int calories
        +DateTime createdAt
    }

    class MoodCheckIn {
        +String id
        +String userId
        +Int moodScore
        +String note
        +DateTime createdAt
    }

    class Journal {
        +String id
        +String userId
        +String title
        +String body
        +DateTime createdAt
    }

    class WellnessEvent {
        +String id
        +String name
        +String type
        +String description
        +String location
        +DateTime scheduledAt
        +Int durationMins
        +Int maxCapacity
        +DateTime createdAt
    }

    class EventParticipation {
        +String id
        +String userId
        +String eventId
        +String status
        +DateTime joinedAt
    }

    class EnvironmentZone {
        +String id
        +String zone
        +Int aqi
        +Int noiseDb
        +Float temperature
        +Float humidity
        +Int crowdDensity
        +Float rainfall
        +DateTime createdAt
    }

    User "1" --> "*" NutritionLog : logs
    User "1" --> "*" ActivityLog : logs
    User "1" --> "*" MoodCheckIn : records
    User "1" --> "*" Journal : writes
    User "1" --> "*" EventParticipation : participates
    FoodItem "1" --> "*" NutritionLog : referenced by
    WellnessEvent "1" --> "*" EventParticipation : has
```

---

### 2.2 Class Diagram — Controllers & Services

Backend controller responsibilities and dependencies.

```mermaid
classDiagram
    class AuthController {
        +register(req, res)
        +login(req, res)
        -hashPassword(password) String
        -generateJWT(user) String
    }

    class ActivityController {
        +logActivity(req, res)
        +getWeeklyActivity(req, res)
        +deleteActivity(req, res)
        -calculateStreak(dailyMinutes) Int
        -classifyIntensity(calories) String
    }

    class NutritionController {
        +logMeal(req, res)
        +getNutritionHistory(req, res)
        +getNutritionDashboard(req, res)
    }

    class NutritionSearchController {
        +searchFood(req, res)
        -callUSDAApi(query) Object
    }

    class MoodController {
        +saveMoodCheckIn(req, res)
        +saveJournalEntry(req, res)
        +getWeeklyMood(req, res)
        +getJournals(req, res)
        +getMoodDashboard(req, res)
        +deleteJournal(req, res)
    }

    class ChatController {
        +chat(req, res)
        -buildMessages(history, message) Array
        -callGroqAPI(messages) String
    }

    class DashboardController {
        +getStats(req, res)
        -calculateWellnessScore() Float
        -detectBurnout() Int
        -getHostelComparison() Array
    }

    class EnvironmentController {
        +getEnvironmentData(req, res)
        -queryInfluxDB(zone) Object
    }

    class WellnessController {
        +getEvents(req, res)
        +createEvent(req, res)
        +registerForEvent(req, res)
    }

    class JWTAuthMiddleware {
        +verifyToken(req, res, next)
        +requireRole(role) Function
    }

    class PrismaClient {
        +user
        +activityLog
        +nutritionLog
        +moodCheckIn
        +journal
        +wellnessEvent
        +eventParticipation
        +foodItem
        +messMenu
        +environmentZone
    }

    AuthController ..> PrismaClient : uses
    ActivityController ..> PrismaClient : uses
    NutritionController ..> PrismaClient : uses
    MoodController ..> PrismaClient : uses
    DashboardController ..> PrismaClient : uses
    WellnessController ..> PrismaClient : uses

    NutritionSearchController ..> USDA_API : calls
    ChatController ..> Groq_API : calls
    EnvironmentController ..> InfluxDB : queries

    JWTAuthMiddleware ..> AuthController : protects routes

    class USDA_API {
        <<external>>
    }
    class Groq_API {
        <<external>>
    }
    class InfluxDB {
        <<external>>
    }
```

---

### 2.3 ER Diagram

Entity-Relationship diagram for the SQLite database.

```mermaid
erDiagram
    USER {
        string id PK
        string email UK
        string passwordHash
        string role
        string firstName
        string lastName
        int age
        string gender
        float height
        float weight
        string fitnessLevel
        string dietaryPref
        string hostel
        string branch
        string academicYear
        datetime createdAt
        datetime updatedAt
    }

    NUTRITION_LOG {
        string id PK
        string userId FK
        string mealType
        int foodGrams
        float calories
        float protein
        float carbs
        float fats
        string foodItemId FK
        datetime loggedAt
    }

    ACTIVITY_LOG {
        string id PK
        string userId FK
        string activityType
        int durationMins
        float caloriesBurned
        int sets
        int reps
        float load
        datetime loggedAt
    }

    FOOD_ITEM {
        string id PK
        string name
        string category
        string meal
        string portion
        int calories
        float protein
        float carbs
        float fats
        datetime createdAt
    }

    MESS_MENU {
        string id PK
        datetime date
        string mealType
        string items
        int calories
        datetime createdAt
    }

    MOOD_CHECK_IN {
        string id PK
        string userId FK
        int moodScore
        string note
        datetime createdAt
    }

    JOURNAL {
        string id PK
        string userId FK
        string title
        string body
        datetime createdAt
    }

    WELLNESS_EVENT {
        string id PK
        string name
        string type
        string description
        string location
        datetime scheduledAt
        int durationMins
        int maxCapacity
        datetime createdAt
    }

    EVENT_PARTICIPATION {
        string id PK
        string userId FK
        string eventId FK
        string status
        datetime joinedAt
    }

    ENVIRONMENT_ZONE {
        string id PK
        string zone
        int aqi
        int noiseDb
        float temperature
        float humidity
        int crowdDensity
        float rainfall
        datetime createdAt
    }

    USER ||--o{ NUTRITION_LOG : "logs meals"
    USER ||--o{ ACTIVITY_LOG : "logs activities"
    USER ||--o{ MOOD_CHECK_IN : "records moods"
    USER ||--o{ JOURNAL : "writes entries"
    USER ||--o{ EVENT_PARTICIPATION : "participates in"
    FOOD_ITEM ||--o{ NUTRITION_LOG : "referenced by"
    WELLNESS_EVENT ||--o{ EVENT_PARTICIPATION : "has participants"
```

---

### 2.4 Sequence Diagrams

#### 2.4.1 User Registration & Login

```mermaid
sequenceDiagram
    actor Student
    participant App as Mobile App
    participant API as Express Server
    participant Auth as AuthController
    participant DB as SQLite (Prisma)

    Note over Student, DB: Registration Flow
    Student->>App: Enter name, email, password
    App->>API: POST /api/auth/register
    API->>Auth: register(req, res)
    Auth->>DB: findUnique(email)
    DB-->>Auth: null (no existing user)
    Auth->>Auth: bcrypt.hash(password)
    Auth->>DB: user.create(data)
    DB-->>Auth: newUser
    Auth->>Auth: jwt.sign(payload)
    Auth-->>API: {token, user}
    API-->>App: 201 Created
    App-->>Student: Welcome screen

    Note over Student, DB: Login Flow
    Student->>App: Enter email, password
    App->>API: POST /api/auth/login
    API->>Auth: login(req, res)
    Auth->>DB: findUnique(email)
    DB-->>Auth: user record
    Auth->>Auth: bcrypt.compare(password, hash)
    Auth->>Auth: jwt.sign(payload)
    Auth-->>API: {token, user}
    API-->>App: 200 OK
    App->>App: Store token in AsyncStorage
    App-->>Student: Navigate to Home
```

---

#### 2.4.2 Activity Logging Flow

```mermaid
sequenceDiagram
    actor Student
    participant App as Mobile App
    participant API as Express Server
    participant MW as JWT Middleware
    participant Ctrl as ActivityController
    participant DB as SQLite (Prisma)

    Student->>App: Fill activity form
    Note right of Student: type, duration, calories,<br/>sets, reps, load
    App->>API: POST /api/student/activities<br/>[Authorization: Bearer token]
    API->>MW: verifyToken(req)
    MW->>MW: jwt.verify(token)
    MW-->>API: req.user = decoded
    API->>Ctrl: logActivity(req, res)
    Ctrl->>Ctrl: Validate required fields
    Ctrl->>DB: activityLog.create(data)
    DB-->>Ctrl: new ActivityLog
    Ctrl-->>API: 201 {message, log}
    API-->>App: Success response
    App-->>Student: Show success toast

    Note over Student, DB: Fetching Weekly Summary
    App->>API: GET /api/student/activities
    API->>MW: verifyToken(req)
    API->>Ctrl: getWeeklyActivity(req, res)
    Ctrl->>DB: activityLog.findMany(last 7 days)
    DB-->>Ctrl: activity logs[]
    Ctrl->>Ctrl: Calculate dailyMinutes, streak,<br/>consistencyScore
    Ctrl-->>App: {dailyMinutes, streak, recentActivities}
    App-->>Student: Render charts & activity list
```

---

#### 2.4.3 AI Chatbot Interaction

```mermaid
sequenceDiagram
    actor Student
    participant App as Mobile App
    participant API as Express Server
    participant MW as JWT Middleware
    participant Chat as ChatController
    participant Groq as Groq API (Llama 3.3)

    Student->>App: Type wellness question
    App->>API: POST /api/student/chat<br/>{message, history[]}
    API->>MW: verifyToken(req)
    API->>Chat: chat(req, res)
    Chat->>Chat: Validate message not empty
    Chat->>Chat: Build messages array<br/>[systemPrompt + history(last 10) + userMsg]
    Chat->>Groq: POST /openai/v1/chat/completions<br/>{model, messages, temperature: 0.7}
    Groq-->>Chat: {choices: [{message: {content}}]}
    Chat->>Chat: Extract reply from response
    Chat-->>API: {reply}
    API-->>App: 200 {reply}
    App->>App: Append to conversation history
    App-->>Student: Display bot reply
```

---

#### 2.4.4 Nutrition Search & Meal Logging

```mermaid
sequenceDiagram
    actor Student
    participant App as Mobile App
    participant API as Express Server
    participant MW as JWT Middleware
    participant NSC as NutritionSearchController
    participant NC as NutritionController
    participant USDA as USDA FoodData API
    participant DB as SQLite (Prisma)

    Note over Student, DB: Step 1 — Search Food
    Student->>App: Search "paneer tikka"
    App->>API: GET /api/student/food-search?q=paneer+tikka
    API->>MW: verifyToken(req)
    API->>NSC: searchFood(req, res)
    NSC->>USDA: GET /fdc/v1/foods/search?query=paneer+tikka
    USDA-->>NSC: {foods: [{description, nutrients}]}
    NSC->>NSC: Format nutritional data
    NSC-->>App: {results: [{name, calories, protein, carbs, fats}]}
    App-->>Student: Display search results

    Note over Student, DB: Step 2 — Log Meal
    Student->>App: Select food & confirm
    App->>API: POST /api/student/nutrition<br/>{mealType, foodGrams, calories, protein, carbs, fats}
    API->>MW: verifyToken(req)
    API->>NC: logMeal(req, res)
    NC->>DB: nutritionLog.create(data)
    DB-->>NC: new NutritionLog
    NC-->>App: 201 {message, log}
    App-->>Student: Updated nutrition dashboard
```

---

#### 2.4.5 Mood Check-in & Journaling

```mermaid
sequenceDiagram
    actor Student
    participant App as Mobile App
    participant API as Express Server
    participant MW as JWT Middleware
    participant MC as MoodController
    participant DB as SQLite (Prisma)

    Note over Student, DB: Mood Check-in
    Student->>App: Select mood (0-4) + optional note
    App->>API: POST /api/student/mood<br/>{moodScore: 3, note: "Feeling good"}
    API->>MW: verifyToken(req)
    API->>MC: saveMoodCheckIn(req, res)
    MC->>DB: moodCheckIn.create(data)
    DB-->>MC: new MoodCheckIn
    MC-->>App: 201 {message, checkIn}
    App-->>Student: Mood saved confirmation

    Note over Student, DB: Mood Dashboard
    App->>API: GET /api/student/mood/dashboard
    API->>MW: verifyToken(req)
    API->>MC: getMoodDashboard(req, res)
    MC->>DB: moodCheckIn.findFirst(today)
    MC->>DB: moodCheckIn.findMany(last 7 days)
    MC->>DB: journal.findMany(last 3)
    DB-->>MC: todayMood, checkIns[], journals[]
    MC->>MC: Calculate weeklyTrend averages
    MC-->>App: {todayMood, weeklyTrend, journals}
    App-->>Student: Render mood trends chart

    Note over Student, DB: Journal Entry
    Student->>App: Write journal entry
    App->>API: POST /api/student/journal<br/>{title, body}
    API->>MW: verifyToken(req)
    API->>MC: saveJournalEntry(req, res)
    MC->>DB: journal.create(data)
    DB-->>MC: new Journal
    MC-->>App: 201 {message, journal}
    App-->>Student: Journal saved
```

---

#### 2.4.6 Admin Dashboard Analytics

```mermaid
sequenceDiagram
    actor Admin
    participant Web as Web Dashboard (Next.js)
    participant API as Express Server
    participant MW as JWT Middleware
    participant DC as DashboardController
    participant DB as SQLite (Prisma)

    Admin->>Web: Open dashboard page
    Web->>API: GET /api/admin/dashboard/stats?date=2026-03-13&period=Days
    API->>MW: verifyToken(req)
    MW->>MW: Check role === ADMIN
    API->>DC: getStats(req, res)

    par Parallel queries
        DC->>DB: user.count()
        DC->>DB: activityLog.findMany(today)
        DC->>DB: moodCheckIn.findMany(recent)
        DC->>DB: nutritionLog.groupBy(mealType)
        DC->>DB: user.findMany(group by hostel)
    end

    DB-->>DC: Raw query results

    DC->>DC: Calculate totalUsers
    DC->>DC: Calculate activeToday
    DC->>DC: Detect burnout alerts
    DC->>DC: Compute wellness score
    DC->>DC: Build weeklyActivityTrend
    DC->>DC: Compute nutritionByMeal averages
    DC->>DC: Build hostelComparison rankings

    DC-->>API: {totalUsers, activeToday, burnoutAlerts, wellnessScore, weeklyActivityTrend, nutritionByMeal, hostelComparison}
    API-->>Web: 200 JSON
    Web-->>Admin: Render KPI cards, charts, tables
```

---

#### 2.4.7 Environment Monitoring

```mermaid
sequenceDiagram
    actor Admin
    participant Web as Web Dashboard
    participant API as Express Server
    participant EC as EnvironmentController
    participant Influx as InfluxDB Cloud

    Admin->>Web: Navigate to Environment page
    Web->>API: GET /api/admin/environment
    API->>EC: getEnvironmentData(req, res)
    EC->>Influx: Flux Query<br/>(AQI, noise, temp, humidity per zone)
    Influx-->>EC: Time-series data points
    EC->>EC: Format zone-wise readings
    EC-->>API: {zones: [{zone, aqi, noiseDb, temp, humidity, crowdDensity}]}
    API-->>Web: 200 JSON
    Web-->>Admin: Render environment cards with zone data
```

---

*Document generated for the FitFusion Campus Wellness Ecosystem project.*
