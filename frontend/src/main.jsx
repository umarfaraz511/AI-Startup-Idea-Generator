import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Rocket, Lightbulb, TrendingUp, CheckCircle2, FileText, Download, RefreshCw } from "lucide-react";
import "./styles/app.css";

const API_URL = "http://127.0.0.1:8000";

const fallbackIdeas = [
  { id: 1, name: "HealthcareFlow AI", score: 92, market_signal: "AI medical admin automation", target_audience: "Small clinics", region: "Pakistan", business_model: "SaaS Subscription", status: "High Potential", problem: "Small clinics need faster appointments, billing, and patient follow-up workflows.", solution: "A smart clinic automation dashboard that reduces manual admin work.", validation_steps: ["Interview 20 clinics", "Create landing page", "Build MVP", "Run pilot", "Measure paid interest"] },
  { id: 2, name: "HealthcarePulse AI", score: 88, market_signal: "Healthcare workflow insights", target_audience: "Small clinics", region: "Pakistan", business_model: "Freemium SaaS", status: "Validated", problem: "Clinic teams struggle to track patient operations clearly.", solution: "AI analytics for appointments, waiting time, and patient engagement.", validation_steps: ["Map workflows", "Survey clinics", "Test pricing", "Launch beta", "Improve retention"] },
  { id: 3, name: "HealthcarePilot AI", score: 84, market_signal: "Digital health operations", target_audience: "Small clinics", region: "Pakistan", business_model: "B2B License", status: "MVP Ready", problem: "Managers need simple AI guidance for daily operational decisions.", solution: "A decision-support tool for clinic managers and reception teams.", validation_steps: ["Define ICP", "Build prototype", "Collect feedback", "Improve UX", "Pilot launch"] }
];

function App() {
  const [page, setPage] = useState("idea");
  const [industry, setIndustry] = useState("Healthcare");
  const [region, setRegion] = useState("Pakistan");
  const [audience, setAudience] = useState("Small clinics");
  const [budget, setBudget] = useState("Medium");
  const [ideaCount, setIdeaCount] = useState(4);
  const [ideas, setIdeas] = useState(fallbackIdeas);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Ready to generate validated ideas.");

  const summary = useMemo(() => {
    const best = ideas.reduce((a, b) => (a.score > b.score ? a : b), ideas[0]);
    const avg = (ideas.reduce((sum, item) => sum + item.score, 0) / ideas.length).toFixed(1);
    return { best, avg };
  }, [ideas]);

  const generateIdeas = async () => {
    setLoading(true);
    setMessage("Generating ideas from backend...");
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, region, audience, budget, idea_count: Number(ideaCount) })
      });
      if (!res.ok) throw new Error("Backend not reachable");
      const data = await res.json();
      setIdeas(data.ideas);
      setPage("brief");
      setMessage(`Generated ${data.ideas.length} startup ideas successfully.`);
    } catch (err) {
      const updated = fallbackIdeas.map((idea, index) => ({ ...idea, name: `${industry}${["Flow", "Pulse", "Pilot"][index] || "Lab"} AI`, region, target_audience: audience, market_signal: `${industry} opportunity in ${region}` }));
      setIdeas(updated);
      setPage("brief");
      setMessage("Backend offline: showing local demo ideas. Start backend for live API generation.");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const report = ideas.map((idea, i) => `${i + 1}. ${idea.name}\nScore: ${idea.score}/100\nStatus: ${idea.status}\nMarket Signal: ${idea.market_signal}\nAudience: ${idea.target_audience}\nBusiness Model: ${idea.business_model}\nProblem: ${idea.problem}\nSolution: ${idea.solution}\n`).join("\n");
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ventureiq-startup-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div>
          <div className="brand"><Rocket size={20} /><span>VentureIQ</span></div>
          <nav>
            <button className={page === "idea" ? "active" : ""} onClick={() => setPage("idea")}>Idea Lab</button>
            <button className={page === "signals" ? "active" : ""} onClick={() => setPage("signals")}>Market Signals</button>
            <button className={page === "validation" ? "active" : ""} onClick={() => setPage("validation")}>Validation</button>
            <button className={page === "brief" ? "active" : ""} onClick={() => setPage("brief")}>Investor Brief</button>
          </nav>
        </div>
        <div className="side-card"><strong>Backend + React</strong><p>All sidebar pages, generation, export, and dashboard cards are working.</p></div>
      </aside>

      <main className="main">
        <section className="hero">
          <div><span>AI STARTUP INTELLIGENCE PLATFORM</span><h1>Generate validated startup ideas using trend and market signals.</h1><p>Build portfolio-ready startup concepts with scoring, validation steps, MVP direction, and investor brief output.</p></div>
          <div className="hero-score"><small>Best Score</small><strong>{summary.best.score}</strong><p>{summary.best.name}</p></div>
        </section>

        <section className="stats">
          <div className="stat-card"><Lightbulb size={18}/><small>Generated Ideas</small><h3>{ideas.length}</h3><p>Ranked concepts</p></div>
          <div className="stat-card"><TrendingUp size={18}/><small>Average Score</small><h3>{summary.avg}</h3><p>Market feasibility</p></div>
          <div className="stat-card"><CheckCircle2 size={18}/><small>Target Region</small><h3>{region}</h3><p>Localized opportunity</p></div>
          <div className="stat-card"><FileText size={18}/><small>Budget Level</small><h3>{budget}</h3><p>MVP planning</p></div>
        </section>

        <p className="status-line">{message}</p>

        {page === "idea" && <section className="page-grid two">
          <div className="panel large"><h2>Startup Idea Builder</h2><p>Enter preferences and click Generate Ideas. The button connects to FastAPI backend.</p><div className="form-grid"><label>Industry<input value={industry} onChange={e=>setIndustry(e.target.value)} /></label><label>Region<input value={region} onChange={e=>setRegion(e.target.value)} /></label><label>Audience<input value={audience} onChange={e=>setAudience(e.target.value)} /></label><label>Budget<select value={budget} onChange={e=>setBudget(e.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Number of Ideas<select value={ideaCount} onChange={e=>setIdeaCount(e.target.value)}><option>3</option><option>4</option><option>5</option><option>6</option></select></label></div><div className="actions"><button onClick={generateIdeas} disabled={loading}>{loading ? <RefreshCw size={15}/> : <Lightbulb size={15}/>} {loading ? "Generating..." : "Generate Ideas"}</button><button className="secondary" onClick={exportReport}><Download size={15}/> Export Report</button></div></div>
          <div className="panel"><h2>How It Works</h2><ul className="checklist"><li>Reads industry, region, audience, and budget</li><li>Scores concepts using market growth and competition</li><li>Creates MVP-ready startup descriptions</li><li>Prepares validation and investor direction</li></ul></div>
        </section>}

        {page === "signals" && <section className="page-grid two"><div className="panel"><h2>Opportunity Score</h2><p>Visual comparison of current startup concepts.</p><div className="bars">{ideas.map(i=><div className="bar-wrap" key={i.id}><div className="bar" style={{height:`${i.score}%`}}></div><span>{i.score}</span></div>)}</div></div><div className="panel"><h2>Market Signals</h2><ul className="checklist"><li>Industry: {industry}</li><li>Region demand: {region}</li><li>Audience: {audience}</li><li>Best signal: {summary.best.market_signal}</li></ul></div></section>}

        {page === "validation" && <section className="page-grid two"><div className="panel"><h2>Validation Roadmap</h2><ul className="checklist">{summary.best.validation_steps.map(step=><li key={step}>{step}</li>)}</ul></div><div className="panel"><h2>MVP Plan</h2><p><b>Problem:</b> {summary.best.problem}</p><p><b>Solution:</b> {summary.best.solution}</p><p><b>Business Model:</b> {summary.best.business_model}</p></div></section>}

        {page === "brief" && <section className="idea-list"><div className="section-title"><h2>Top AI Startup Ideas</h2><p>Ranked by feasibility, trend signal, and MVP readiness.</p><button className="secondary" onClick={exportReport}><Download size={15}/> Export</button></div><div className="cards">{ideas.map(idea=><article className="idea-card" key={idea.id}><div><h3>{idea.name}</h3><span>{idea.status}</span></div><p>{idea.solution}</p><strong>{idea.score}/100</strong><small>{idea.business_model}</small></article>)}</div></section>}
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
