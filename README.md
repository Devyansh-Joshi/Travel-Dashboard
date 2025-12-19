# 🌍 Travel Dashboard — Local Full-Stack Project

A full-stack travel dashboard that allows users to search cities, view weather forecasts, explore nearby attractions on a map, create trips, and check transport (flight) options — all running **locally**.

This project is designed as a **learning + portfolio project**, without user authentication.

---

## ✨ Features

### 🏙 City Search & Dashboard
- Search cities with country disambiguation
- View multi-day weather forecast
- Explore nearby attractions
- Interactive map view for attractions

### 🧳 Trips
- Create trips with:
  - From city
  - Destination city
  - Start & end dates
- Trips persist using **localStorage**
- Trips remain unchanged when searching new cities
- Remove trips

### ⭐ Attractions
- Category-based filtering
- Sorting options
- Bookmark attractions for trips
- Copy attraction coordinates
- View external links (website, address)

### ✈ Transport (Flights)
- Fetch real flight offers using **Amadeus API**
- View flight options for a selected trip

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6)
- Leaflet (maps)
- CSS (custom styling)

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL (local database)

### External APIs
- OpenWeather (weather forecast)
- Geoapify (attractions & places)
- Amadeus (flight data)

---

## 📂 Project Structure
```bash
travel-dashboard/
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ ├── services/
│ │ └── index.js
│ ├── prisma/
│ │ └── schema.prisma
│ └── package.json
│
├── frontend/
│ ├── src/
│ ├── index.html
│ ├── vite.config.js
│ └── package.json
│
└── README.md
```

---

## 🚀 How to Run the Project Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/travel-dashboard.git
```
### 2️⃣ Install dependencies
```bash
- Backend
cd travel-dashboard
cd backend
npm install
- Frontend
cd ../frontend
npm install
```
### 3️⃣ Setup Environment Variables
Create a .env file inside the backend folder:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/travel_dashboard

OPENWEATHER_API_KEY=your_openweather_key
GEOAPIFY_API_KEY=your_geoapify_key

AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
```
### 4️⃣ Setup Database (Prisma)

Make sure PostgreSQL is running locally.

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```
### 5️⃣ Start Backend Server
```bash
cd backend
node src\index.js
```
### 6️⃣ Start Frontend
```bash
cd frontend
npm run dev
```
