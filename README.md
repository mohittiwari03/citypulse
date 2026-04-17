# CityPulse — AI Weather & News Dashboard

Real-time weather, live news, and an AI assistant for any city in the world.
Built with the MERN stack (MongoDB · Express · React · Node.js).

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS              |
| Backend   | Node.js + Express.js                        |
| Database  | MongoDB + Mongoose                          |
| AI        | Mistral AI (`mistral-small-latest`)         |
| APIs      | OpenWeatherMap · Tavily Search              |

---

## Folder Structure

```
citypulse/
├── backend/
│   ├── config/
│   │   └── db.js                  ← MongoDB connection
│   ├── controllers/
│   │   ├── weatherController.js   ← OpenWeatherMap API logic
│   │   ├── newsController.js      ← Tavily news API logic
│   │   ├── chatController.js      ← Mistral AI chat logic
│   │   └── historyController.js   ← Save/fetch/delete searches
│   ├── models/
│   │   ├── Search.js              ← Mongoose schema for searches
│   │   └── Chat.js                ← Mongoose schema for chat sessions
│   ├── routes/
│   │   ├── weather.js
│   │   ├── news.js
│   │   ├── chat.js
│   │   └── history.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── .env                       ← API keys go here
│   ├── server.js                  ← Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── SearchBar.jsx      ← City search with suggestions
    │   │   ├── WeatherCard.jsx    ← Weather display card
    │   │   ├── NewsCard.jsx       ← News articles grid
    │   │   ├── ChatBot.jsx        ← Floating AI chat panel
    │   │   └── Loader.jsx         ← Skeleton loading state
    │   ├── pages/
    │   │   ├── Home.jsx           ← Main dashboard
    │   │   └── History.jsx        ← Past searches from MongoDB
    │   ├── hooks/
    │   │   └── useCity.js         ← Custom hook for search logic
    │   ├── services/
    │   │   └── api.js             ← All axios API calls
    │   ├── App.jsx                ← React Router setup
    │   ├── main.jsx
    │   └── index.css              ← Tailwind + global styles
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/api/weather?city=` | Current weather for a city         |
| GET    | `/api/news?city=`    | Latest news articles for a city    |
| POST   | `/api/chat`          | Chat with AI (body: message, city) |
| GET    | `/api/history`       | All saved searches from MongoDB    |
| POST   | `/api/history`       | Save a new search                  |
| DELETE | `/api/history/:id`   | Delete a search from history       |

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/citypulse
MISTRAL_API_KEY=your_key
TAVILY_API_KEY=your_key
OPENWEATHER_API_KEY=your_key
```

```bash
npm run dev       # development (nodemon)
npm start         # production
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:5173
```

> Make sure MongoDB is running locally before starting the backend.

---

## Features

- **Live Weather** — temperature, humidity, wind, visibility, sunrise/sunset
- **Top News** — 6 live articles via Tavily Search API
- **AI Chat** — Mistral AI with real-time city context (weather + news injected)
- **Search History** — every city search saved to MongoDB, deletable
- **Quick Suggestions** — one-click search for popular cities
- **Skeleton Loaders** — smooth loading states
- **Toast Notifications** — error/success feedback
