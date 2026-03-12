import { useState, useEffect, useRef } from "react";

const API = "uicloner.up.railway.app";

const TOOLS = ["Claude", "Cursor", "Bolt", "v0", "Framer", "Webflow AI", "Lovable"];

const QUESTIONS = [
  { id: 1, label: "PRODUCT IDENTITY", placeholder: "Ex: Plataforma SaaS de gestão de projetos para times remotos" },
  { id: 2, label: "AUDIENCE PERSONA", placeholder: "Ex: Profissionais 25-40 anos, tech-savvy, ambiciosos mas sobrecarregados" },
  { id: 3, label: "BRAND FEELING", placeholder: "Ex: cinematic, clinical, trustworthy (exatamente 3 adjetivos)" },
  { id: 4, label: "COLOR PALETTE", placeholder: "Ex: #0A0A0A, #FF5C00, #F5F0E8 — ou descreva: dark forest + terracotta" },
  { id: 5, label: "PAGE SECTIONS", placeholder: "Ex: Hero, Features, How It Works, Testimonials, Pricing, FAQ, Footer" },
  { id: 6, label: "PRIMARY HEADLINE", placeholder: "Ex: O jeito mais rápido de lançar seu produto digital" },
  { id: 7, label: "PRIMARY CTA", placeholder: "Ex: Começar grátis / Agendar demo / Ver planos" },
  { id: 8, label: "KEY DIFFERENTIATOR", placeholder: "O que te torna genuinamente diferente dos concorrentes?" },
  { id: 9, label: "ANIMATION INTENSITY", placeholder: "1 = estático, 2 = sutil, 3 = moderado, 4 = rico, 5 = cinemático" },
  { id: 10, label: "TECH STACK", placeholder: "Ex: React + Tailwind + GSAP / Vanilla HTML/CSS/JS / Vue + Framer Motion" },
  { id: 11, label: "CONTENT ASSETS", placeholder: "Tem logo/fotos? Ou usa Unsplash? Descreva o estilo visual desejado" },
  { id: 12, label: "SECTION MODIFICATIONS", placeholder: "Para cada seção do site referência: KEEP AS-IS / ADAPT (descreva) / REMOVE" },
];

const PHASES = [
  { id: 1, label: "Forensic Audit", desc: "Analisando estrutura, tokens e animações" },
  { id: 2, label: "Brand Interview", desc: "Processando identidade da marca" },
  { id: 3, label: "Synthesis", desc: "Gerando prompt de replicação" },
  { id: 4, label: "Quality Check", desc: "Verificando fidelidade e completude" },
];

const s = {
  wrap: { minHeight: "100vh", background: "#080808", color: "#f0ede8", fontFamily: "'Inter', sans-serif", padding: "0" },
  header: { borderBottom: "1px solid #1a1a1a", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: "13px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#f0ede8" },
  logoAccent: { color: "#ff5c00" },
  badge: { fontSize: "11px", padding: "4px 10px", border: "1px solid #2a2a2a", borderRadius: "20px", color: "#666", letterSpacing: "0.08em" },
  main: { maxWidth: "760px", margin: "0 auto", padding: "48px 24px" },
  stepLabel: { fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff5c00", marginBottom: "12px", fontWeight: 600 },
  h1: { fontSize: "28px", fontWeight: 700, lineHeight: 1.25, marginBottom: "8px", color: "#f0ede8" },
  sub: { fontSize: "14px", color: "#555", lineHeight: 1.6, marginBottom: "32px" },
  input: { width: "100%", background: "#0f0f0f", border: "1px solid #222", borderRadius: "10px", padding: "14px 16px", color: "#f0ede8", fontSize: "14px", outline: "none" },
  modeGroup: { display: "flex", gap: "10px", marginBottom: "24px" },
  modeBtn: (active) => ({ flex: 1, padding: "14px", borderRadius: "10px", border: active ? "1px solid #ff5c00" : "1px solid #222", background: active ? "rgba(255,92,0,0.08)" : "#0f0f0f", color: active ? "#ff5c00" : "#555", cursor: "pointer", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", transition: "all 0.2s", textAlign: "center" }),
  btnPrimary: { background: "#ff5c00", color: "#fff", border: "none", borderRadius: "10px", padding: "14px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.03em" },
  btnGhost: { background: "transparent", color: "#555", border: "1px solid #222", borderRadius: "10px", padding: "14px 28px", fontSize: "14px", cursor: "pointer" },
  card: { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: "14px", padding: "24px", marginBottom: "16px" },
  qLabel: { fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ff5c00", marginBottom: "8px" },
  textarea: { width: "100%", background: "#080808", border: "1px solid #222", borderRadius: "8px", padding: "12px 14px", color: "#f0ede8", fontSize: "13px", lineHeight: 1.6, resize: "vertical", minHeight: "72px", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  phaseRow: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 0", borderBottom: "1px solid #111" },
  phaseDot: (st) => ({ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, background: st === "done" ? "#22c55e" : st === "active" ? "#ff5c00" : "#222", boxShadow: st === "active" ? "0 0 8px #ff5c00" : "none", transition: "all 0.4s" }),
  phaseLabel: (st) => ({ fontSize: "13px", fontWeight: 600, color: st === "done" ? "#22c55e" : st === "active" ? "#f0ede8" : "#333" }),
  phaseDesc: { fontSize: "12px", color: "#444", marginTop: "2px" },
  toolGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "24px" },
  toolBtn: (active) => ({ padding: "10px 8px", borderRadius: "8px", border: active ? "1px solid #ff5c00" : "1px solid #222", background: active ? "rgba(255,92,0,0.08)" : "#0f0f0f", color: active ? "#ff5c00" : "#555", cursor: "pointer", fontSize: "12px", fontWeight: 600, textAlign: "center", transition: "all 0.2s" }),
  promptBox: { background: "#050505", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "24px", fontSize: "12px", lineHeight: 1.8, color: "#888", maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace", marginBottom: "16px" },
  copyBtn: { background: "#1a1a1a", color: "#f0ede8", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", cursor: "pointer", fontWeight: 600 },
  progress: { height: "2px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden", marginBottom: "32px" },
  progressBar: (pct) => ({ height: "100%", width: `${pct}%`, background: "#ff5c00", transition: "width 0.6s ease", borderRadius: "2px" }),
  iterBox: { background: "#0a0500", border: "1px solid #2a1500", borderRadius: "12px", padding: "20px", marginTop: "24px" },
  iterLabel: { fontSize: "12px", color: "#ff5c00", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px" },
};

function Spinner() {
  return <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #333", borderTop: "2px solid #ff5c00", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginRight: "8px" }} />;
}

function PhaseTracker({ currentPhase, status }) {
  const getStatus = (id) => {
    if (status === "error") return id < currentPhase ? "done" : "idle";
    if (id < currentPhase) return "done";
    if (id === currentPhase) return "active";
    return "idle";
  };
  return (
    <div style={s.card}>
      {PHASES.map(p => {
        const st = getStatus(p.id);
        return (
          <div key={p.id} style={s.phaseRow}>
            <div style={s.phaseDot(st)} />
            <div style={{ flex: 1 }}>
              <div style={s.phaseLabel(st)}>{p.label}</div>
              {st === "active" && <div style={s.phaseDesc}>{p.desc}...</div>}
              {st === "done" && <div style={{ ...s.phaseDesc, color: "#22c55e" }}>Concluído ✓</div>}
            </div>
            {st === "active" && <Spinner />}
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState("standard");
  const [targetTool, setTargetTool] = useState("Claude");
  const [answers, setAnswers] = useState(Array(12).fill(""));
  const [runId, setRunId] = useState(null);
  const [phase, setPhase] = useState(0);
  const [runStatus, setRunStatus] = useState("running");
  const [finalPrompt, setFinalPrompt] = useState("");
  const [iterInput, setIterInput] = useState("");
  const [iterOutput, setIterOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const pollRef = useRef(null);

  const progressPct = view === "running" ? Math.min((phase / 4) * 100, 95) : view === "result" ? 100 : 0;

  useEffect(() => {
    if (view !== "running" || !runId) return;
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`${API}/pipeline/status/${runId}`);
        const data = await r.json();
        if (data.phase) setPhase(data.phase);
        if (data.status === "complete") {
          clearInterval(pollRef.current);
          const rr = await fetch(`${API}/pipeline/result/${runId}`);
          const rd = await rr.json();
          const promptFile = rd.files?.find(f => f.name === "04-final-prompt.md");
          if (promptFile) {
            const pr = await fetch(promptFile.url);
            setFinalPrompt(await pr.text());
          }
          setView("result");
        }
        if (data.status === "error") {
          clearInterval(pollRef.current);
          setError(data.error || "Erro no pipeline");
          setRunStatus("error");
        }
      } catch (_) {}
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [view, runId]);

  const startPipeline = async () => {
    setError("");
    setView("running");
    setPhase(1);
    try {
      const r = await fetch(`${API}/pipeline/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode, brandAnswers: answers, targetTool }),
      });
      const data = await r.json();
      setRunId(data.runId);
    } catch (err) {
      setError("Não foi possível conectar ao backend: " + err.message);
      setRunStatus("error");
    }
  };

  const runIterator = async () => {
    if (!iterInput.trim()) return;
    setView("iterate");
    try {
      const r = await fetch(`${API}/pipeline/iterate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, currentImplementation: iterInput }),
      });
      const data = await r.json();
      setIterOutput(data.iteratorOutput || "");
    } catch (err) {
      setIterOutput("Erro: " + err.message);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setView("home"); setUrl(""); setMode("standard"); setTargetTool("Claude");
    setAnswers(Array(12).fill("")); setRunId(null); setPhase(0);
    setRunStatus("running"); setFinalPrompt(""); setIterInput(""); setIterOutput(""); setError("");
  };

  return (
    <div style={s.wrap}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0f0f0f; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
      `}</style>

      <div style={s.header}>
        <div style={s.logo}>UI<span style={s.logoAccent}>CLONER</span> <span style={{ color: "#333", fontWeight: 400 }}>/ SRIP</span></div>
        <div style={s.badge}>Site Replication Intelligence Protocol</div>
      </div>

      <div style={s.main}>

        {view === "home" && (
          <div>
            <div style={s.stepLabel}>Fase 1 de 4 — Target</div>
            <h1 style={s.h1}>Clone qualquer site.<br />Adapte à sua marca.</h1>
            <p style={s.sub}>Cole a URL do site de referência. O SRIP analisa forense, entrevista sua marca e gera um prompt de replicação pronto para o seu tool de vibe coding.</p>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", color: "#444", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>URL do site alvo</div>
              <input style={s.input} placeholder="https://stripe.com" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && url && setView("interview")} />
            </div>

            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "12px", color: "#444", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Modo de auditoria</div>
              <div style={s.modeGroup}>
                <button style={s.modeBtn(mode === "standard")} onClick={() => setMode("standard")}>
                  Standard<br /><span style={{ fontSize: "11px", fontWeight: 400, color: mode === "standard" ? "#ff5c0088" : "#333" }}>Rápido · Inspiração</span>
                </button>
                <button style={s.modeBtn(mode === "high-fidelity")} onClick={() => setMode("high-fidelity")}>
                  High-Fidelity<br /><span style={{ fontSize: "11px", fontWeight: 400, color: mode === "high-fidelity" ? "#ff5c0088" : "#333" }}>Pixel-perfect · ASCII wireframes</span>
                </button>
              </div>
            </div>

            <button style={{ ...s.btnPrimary, opacity: url ? 1 : 0.4 }} onClick={() => url && setView("interview")}>
              Continuar →
            </button>
          </div>
        )}

        {view === "interview" && (
          <div>
            <div style={s.stepLabel}>Fase 2 de 4 — Brand Interview</div>
            <h1 style={s.h1}>Conte sobre sua marca.</h1>
            <p style={s.sub}>12 perguntas que moldam o prompt de replicação. Seja específico — cada resposta afeta o output.</p>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#444", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Output otimizado para</div>
              <div style={s.toolGrid}>
                {TOOLS.map(t => (
                  <button key={t} style={s.toolBtn(targetTool === t)} onClick={() => setTargetTool(t)}>{t}</button>
                ))}
              </div>
            </div>

            {QUESTIONS.map((q, i) => (
              <div key={q.id} style={s.card}>
                <div style={s.qLabel}>Q{q.id} — {q.label}</div>
                <textarea style={s.textarea} placeholder={q.placeholder} value={answers[i]} onChange={e => { const a = [...answers]; a[i] = e.target.value; setAnswers(a); }} />
              </div>
            ))}

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button style={s.btnGhost} onClick={() => setView("home")}>← Voltar</button>
              <button style={s.btnPrimary} onClick={startPipeline}>Iniciar Pipeline →</button>
            </div>
          </div>
        )}

        {view === "running" && (
          <div>
            <div style={s.stepLabel}>Pipeline em execução</div>
            <h1 style={s.h1}>Analisando {url.replace("https://", "").split("/")[0]}…</h1>
            <p style={s.sub}>O SRIP está rodando as 4 fases. Isso leva 2 a 5 minutos dependendo do site.</p>
            <div style={s.progress}><div style={s.progressBar(progressPct)} /></div>
            <PhaseTracker currentPhase={phase} status={runStatus} />
            {error && (
              <div style={{ background: "#1a0505", border: "1px solid #3a1010", borderRadius: "10px", padding: "16px", marginTop: "16px", color: "#ff6b6b", fontSize: "13px" }}>
                ⚠ {error}
                <div style={{ marginTop: "12px" }}><button style={s.btnGhost} onClick={reset}>Recomeçar</button></div>
              </div>
            )}
          </div>
        )}

        {view === "result" && (
          <div>
            <div style={s.stepLabel}>Pipeline concluído ✓</div>
            <h1 style={s.h1}>Seu prompt está pronto.</h1>
            <p style={s.sub}>Cole este prompt no <strong style={{ color: "#f0ede8" }}>{targetTool}</strong> para construir o site.</p>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "12px", color: "#444", marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Trocar ferramenta alvo</div>
              <div style={s.toolGrid}>
                {TOOLS.map(t => (
                  <button key={t} style={s.toolBtn(targetTool === t)} onClick={() => setTargetTool(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div style={s.promptBox}>{finalPrompt || "Carregando prompt..."}</div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
              <button style={s.copyBtn} onClick={() => copyText(finalPrompt)}>{copied ? "✓ Copiado!" : "Copiar Prompt"}</button>
              <button style={s.btnGhost} onClick={reset}>Novo clone</button>
            </div>

            <div style={s.iterBox}>
              <div style={s.iterLabel}>🔁 Iterator — Refinamento Pós-Build</div>
              <p style={{ fontSize: "12px", color: "#664422", lineHeight: 1.6, marginBottom: "14px" }}>Se o primeiro build ficou ruim, cole o código gerado ou descreva o que ficou errado e rode os 5 passes de refinamento.</p>
              <textarea style={{ ...s.textarea, background: "#0a0500", borderColor: "#2a1500", minHeight: "100px" }} placeholder="Cole o código gerado, URL do preview ou descreva o que ficou errado..." value={iterInput} onChange={e => setIterInput(e.target.value)} />
              <button style={{ ...s.btnPrimary, marginTop: "10px", background: "#7c2d00" }} onClick={runIterator}>Rodar 5 Passes →</button>
            </div>
          </div>
        )}

        {view === "iterate" && (
          <div>
            <div style={s.stepLabel}>Iterator — 5 Passes de Refinamento</div>
            <h1 style={s.h1}>Prompts corretivos gerados.</h1>
            <p style={s.sub}>Cada pass identifica os gaps mais críticos e gera um prompt corretivo preciso. Use em sequência.</p>
            <div style={s.promptBox}>{iterOutput || <span><Spinner />Gerando passes...</span>}</div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={s.copyBtn} onClick={() => copyText(iterOutput)}>{copied ? "✓ Copiado!" : "Copiar Tudo"}</button>
              <button style={s.btnGhost} onClick={() => setView("result")}>← Voltar ao resultado</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
