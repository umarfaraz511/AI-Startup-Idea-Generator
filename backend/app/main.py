from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import json
import random

BASE_DIR = Path(__file__).resolve().parents[1]
TREND_FILE = BASE_DIR / "data" / "trends.json"

app = FastAPI(title="VentureIQ AI Startup Idea Generator", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    industry: str = Field(default="Healthcare", min_length=2)
    region: str = Field(default="Pakistan", min_length=2)
    audience: str = Field(default="Small businesses", min_length=2)
    budget: str = Field(default="Medium")
    idea_count: int = Field(default=4, ge=3, le=6)


def load_trends():
    with TREND_FILE.open("r", encoding="utf-8") as f:
        return json.load(f)


def select_trend(industry: str):
    trends = load_trends()
    for row in trends:
        if row["industry"].lower() == industry.lower():
            return row
    return random.choice(trends) | {"industry": industry, "trend": f"AI automation in {industry}", "growth": 76, "competition": 50}


def budget_modifier(budget: str):
    return {"Low": -5, "Medium": 0, "High": 4}.get(budget, 0)


@app.get("/")
def root():
    return {"message": "VentureIQ backend is running", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "startup-idea-generator"}


@app.get("/api/trends")
def trends():
    return {"trends": load_trends()}


@app.post("/api/generate")
def generate_ideas(payload: IdeaRequest):
    trend = select_trend(payload.industry)
    names = ["Flow", "Pulse", "Pilot", "Guard", "Spark", "Vision"]
    models = ["SaaS Subscription", "Freemium SaaS", "B2B License", "Usage-Based Pricing", "Marketplace Commission", "Analytics Dashboard"]
    statuses = ["High Potential", "Validated", "MVP Ready", "Needs Interviews", "Pilot Ready", "Investor Ready"]
    modifier = budget_modifier(payload.budget)

    ideas = []
    for i in range(payload.idea_count):
        score = max(58, min(98, trend["growth"] - int(trend["competition"] * 0.25) + modifier + random.randint(-3, 8)))
        ideas.append({
            "id": i + 1,
            "name": f"{payload.industry}{names[i]} AI",
            "score": score,
            "market_signal": trend["trend"],
            "target_audience": payload.audience,
            "region": payload.region,
            "business_model": models[i % len(models)],
            "status": statuses[i % len(statuses)],
            "problem": f"{payload.audience} in {payload.region} need faster, cheaper, and more reliable {payload.industry.lower()} workflows.",
            "solution": f"An AI-powered product that uses {trend['trend'].lower()} to automate decisions, summarize insights, and guide daily operations.",
            "validation_steps": [
                "Interview 20 target users",
                "Create landing page and collect waitlist signups",
                "Build no-code MVP workflow",
                "Test pricing with 5 pilot customers",
                "Measure retention and willingness to pay"
            ]
        })

    ideas.sort(key=lambda x: x["score"], reverse=True)
    avg = round(sum(item["score"] for item in ideas) / len(ideas), 1)
    return {
        "inputs": payload.model_dump(),
        "summary": {
            "best_score": ideas[0]["score"],
            "average_score": avg,
            "best_idea": ideas[0]["name"],
            "trend_used": trend["trend"]
        },
        "ideas": ideas
    }
