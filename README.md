🌍 Travel Dashboard — Local Full-Stack Project

A full-stack travel dashboard that allows users to search cities, view weather forecasts, explore nearby attractions on a map, create trips, and check transport (flight) options — all running locally.

This project is designed as a learning + portfolio project, without user authentication.

✨ Features
🏙 City Search & Dashboard

Search cities with country disambiguation

View multi-day weather forecast

Explore nearby attractions

Interactive map view for attractions

🧳 Trips

Create trips with:

From city

Destination city

Start & end dates

Trips persist using localStorage

Trips remain unchanged when searching new cities

Remove trips

⭐ Attractions

Category-based filtering

Sorting options

Bookmark attractions for trips

Copy attraction coordinates

View external links (website, address)

✈ Transport (Flights)

Fetch real flight offers using Amadeus API

View flight options for a selected trip

🛠 Tech Stack
Frontend

React (Vite)

JavaScript (ES6)

Leaflet (maps)

CSS (custom styling)

Backend

Node.js

Express

Prisma ORM

PostgreSQL (local database)

External APIs

OpenWeather (weather forecast)

Geoapify (attractions & places)

Amadeus (flight data)

📂 Project Structure
travel-dashboard/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── index.js
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md

🚀 How to Run the Project Locally
1️⃣ Clone the repository
git clone https://github.com/your-username/travel-dashboard.git
cd travel-dashboard

2️⃣ Install dependencies
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

3️⃣ Setup Environment Variables

Create a .env file inside the backend folder:

DATABASE_URL=postgresql://postgres:password@localhost:5432/travel_dashboard

OPENWEATHER_API_KEY=your_openweather_key
GEOAPIFY_API_KEY=your_geoapify_key

AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret


⚠️ Do not commit the .env file

4️⃣ Setup Database (Prisma)

Make sure PostgreSQL is running locally.

cd backend
npx prisma generate
npx prisma migrate dev


(Optional – open database UI)

npx prisma studio

5️⃣ Start Backend Server
cd backend
node src/index.js


Backend runs on:

http://localhost:4000

6️⃣ Start Frontend
cd frontend
npm run dev


Frontend runs on:

http://localhost:5173

🔁 API Usage (Local)

Examples:

City search
GET http://localhost:4000/api/cities/search?q=Tokyo

City dashboard
GET http://localhost:4000/api/cities/1/dashboard

Trips
GET / POST http://localhost:4000/api/trips

Flights
GET http://localhost:4000/api/transport/flights?from=DEL&to=HND&date=2025-12-18

💾 Data Persistence

Trips & bookmarks → stored in browser localStorage

Weather & attractions → cached in PostgreSQL via Prisma

⚠️ Known Limitations

No user authentication

Trips are browser-specific (localStorage)

Limited free API quotas

Desktop-first UI (mobile improvements pending)

📌 Future Improvements

User accounts & login

Save trips to database

Mobile responsive layout

Export trip plan

Deployment (Vercel)
