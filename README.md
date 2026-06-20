# VentureIQ AI Startup Idea Generator

A professional full-stack portfolio project that generates validated startup ideas using trend analysis, market signals, MVP readiness, and business-model scoring.

## Tech Stack

- Backend: Python, FastAPI, Pydantic
- Frontend: React, Vite, CSS, Lucide Icons
- Data: Local JSON market trend dataset

## Features

- Working sidebar pages: Idea Lab, Market Signals, Validation, Investor Brief
- Working Generate Ideas button connected to FastAPI backend
- Fallback demo mode if backend is offline
- Startup scoring and opportunity comparison chart
- MVP validation roadmap
- Export startup report as TXT file
- Compact professional dashboard layout designed for 100% zoom

## Folder Structure

```text
ventureiq_ai_startup_idea_generator/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py
│   ├── data/
│   │   └── trends.json
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles/
│   │       └── app.css
│   ├── index.html
│   └── package.json
└── README.md
```

## Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend API docs:

```text
http://127.0.0.1:8000/docs
```

## Run Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## API Endpoints

- `GET /api/health` — backend health check
- `GET /api/trends` — market trend dataset
- `POST /api/generate` — generate startup ideas

## GitHub Portfolio Description

VentureIQ is an AI-powered startup idea generation platform built with FastAPI and React. It transforms market signals, target audience data, regional context, and budget level into validated startup concepts with opportunity scores, MVP validation steps, and investor-ready summaries.
