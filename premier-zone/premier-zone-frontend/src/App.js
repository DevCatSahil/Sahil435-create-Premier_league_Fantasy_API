import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const API = "http://localhost:9090/api/player";

const MOCK = [
  { id: 1,  name: "Erling Haaland",         team: "MCI", teamName: "Man City",    position: "FW", goals: 27, assists: 5  },
  { id: 2,  name: "Mohamed Salah",           team: "LIV", teamName: "Liverpool",   position: "FW", goals: 24, assists: 13 },
  { id: 3,  name: "Cole Palmer",             team: "CHE", teamName: "Chelsea",     position: "MF", goals: 22, assists: 10 },
  { id: 4,  name: "Alexander Isak",          team: "NEW", teamName: "Newcastle",   position: "FW", goals: 21, assists: 4  },
  { id: 5,  name: "Bukayo Saka",             team: "ARS", teamName: "Arsenal",     position: "MF", goals: 16, assists: 10 },
  { id: 6,  name: "Jarrod Bowen",            team: "WHU", teamName: "West Ham",    position: "MF", goals: 14, assists: 7  },
  { id: 7,  name: "Son Heung-min",           team: "TOT", teamName: "Tottenham",   position: "FW", goals: 13, assists: 8  },
  { id: 8,  name: "Ollie Watkins",           team: "AVL", teamName: "Aston Villa", position: "FW", goals: 12, assists: 11 },
  { id: 9,  name: "Marcus Rashford",         team: "MUN", teamName: "Man United",  position: "FW", goals: 7,  assists: 4  },
  { id: 10, name: "Trent Alexander-Arnold",  team: "LIV", teamName: "Liverpool",   position: "DF", goals: 4,  assists: 9  },
  { id: 11, name: "William Saliba",          team: "ARS", teamName: "Arsenal",     position: "DF", goals: 3,  assists: 1  },
  { id: 12, name: "Ederson",                 team: "MCI", teamName: "Man City",    position: "GK", goals: 0,  assists: 0  },
  { id: 13, name: "David Raya",              team: "ARS", teamName: "Arsenal",     position: "GK", goals: 0,  assists: 2  },
  { id: 14, name: "Declan Rice",             team: "ARS", teamName: "Arsenal",     position: "MF", goals: 7,  assists: 6  },
  { id: 15, name: "Phil Foden",              team: "MCI", teamName: "Man City",    position: "MF", goals: 10, assists: 5  },
];

const AVATAR_BG = ["#CECBF6","#9FE1CB","#F5C4B3","#B5D4F4","#C0DD97","#FAC775","#F4C0D1"];
const AVATAR_FG = ["#3C3489","#085041","#712B13","#0C447C","#27500A","#633806","#72243E"];
const EMPTY_FORM = { name: "", team: "", teamName: "", position: "", goals: 0, assists: 0 };

// ── Theme tokens ───────────────────────────────────────────────────────────────
function makeTheme(dark) {
  return {
    bg:          dark ? "#0f1117" : "#ffffff",
    surface:     dark ? "#1a1d27" : "#f9fafb",
    card:        dark ? "#1e2130" : "#ffffff",
    border:      dark ? "#2e3147" : "#e5e7eb",
    borderLight: dark ? "#252840" : "#f3f4f6",
    text:        dark ? "#f1f5f9" : "#111827",
    muted:       dark ? "#8b92a9" : "#6b7280",
    hint:        dark ? "#4b5263" : "#9ca3af",
    inputBg:     dark ? "#252840" : "#ffffff",
    inputText:   dark ? "#f1f5f9" : "#111827",
    statBg:      dark ? "#252840" : "#f9fafb",
    barBg:       dark ? "#2e3147" : "#e5e7eb",
    accent:      dark ? "#4a90d9" : "#185FA5",
    accentHover: dark ? "#3a7bc8" : "#0C447C",
    danger:      "#E24B4A",
    success:     dark ? "#3B6D11" : "#3B6D11",
    successBg:   dark ? "#1a2e0d" : "#EAF3DE",
    successBdr:  dark ? "#2d4f1a" : "#C0DD97",
    overlay:     "rgba(0,0,0,0.6)",
    modalBg:     dark ? "#1e2130" : "#ffffff",
  };
}

const POS_STYLES = {
  FW: { light: { bg: "#FAECE7", color: "#993C1D" }, dark: { bg: "#3d1a0e", color: "#f0997b" } },
  MF: { light: { bg: "#E6F1FB", color: "#185FA5" }, dark: { bg: "#0d2a45", color: "#85b7eb" } },
  DF: { light: { bg: "#EAF3DE", color: "#3B6D11" }, dark: { bg: "#162b08", color: "#97c459" } },
  GK: { light: { bg: "#FAEEDA", color: "#854F0B" }, dark: { bg: "#3a2005", color: "#ef9f27" } },
};

function getAvatar(name) {
  const i = name.charCodeAt(0) % AVATAR_BG.length;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return { bg: AVATAR_BG[i], fg: AVATAR_FG[i], initials };
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Avatar({ name, size = 28 }) {
  const av = getAvatar(name);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: av.bg, color: av.fg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 500 }}>
      {av.initials}
    </div>
  );
}

function PositionBadge({ position, dark }) {
  const s = (POS_STYLES[position] || POS_STYLES.MF)[dark ? "dark" : "light"];
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, display: "inline-block" }}>
      {position}
    </span>
  );
}

function StatBar({ value, max, color, t }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ minWidth: 20, textAlign: "right", fontSize: 13, color: t.text }}>{value}</span>
      <div style={{ flex: 1, height: 6, background: t.barBg, borderRadius: 3, minWidth: 40 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, t }) {
  return (
    <div style={{ background: t.statBg, borderRadius: 8, padding: "12px 16px", flex: 1, minWidth: 100, border: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 12, color: t.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: t.text }}>{value}</div>
    </div>
  );
}

// ── Dark Mode Toggle ───────────────────────────────────────────────────────────
function DarkToggle({ dark, onToggle, t }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 12px", borderRadius: 20,
        border: `1px solid ${t.border}`,
        background: t.surface, color: t.text,
        cursor: "pointer", fontSize: 13, fontWeight: 500,
        transition: "all 0.2s",
      }}
    >
      <span style={{ fontSize: 15 }}>{dark ? "☀️" : "🌙"}</span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}

// ── Player Form (shared Add + Edit) ───────────────────────────────────────────
function PlayerForm({ initial = EMPTY_FORM, onSave, onCancel, submitLabel = "Save player", t }) {
  const [form, setForm]     = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "goals" || name === "assists" ? Number(value) : value }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim())     errs.name     = "Name is required";
    if (!form.team.trim())     errs.team     = "Team code is required";
    if (!form.teamName.trim()) errs.teamName = "Team name is required";
    if (!form.position)        errs.position = "Position is required";
    if (form.goals < 0)        errs.goals    = "Cannot be negative";
    if (form.assists < 0)      errs.assists  = "Cannot be negative";
    return errs;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await onSave(form);
    setSuccess(true);
    setLoading(false);
  }

  const inp = (field) => ({
    width: "100%", padding: "8px 10px", fontSize: 14, outline: "none",
    border: `1px solid ${errors[field] ? "#E24B4A" : t.border}`,
    borderRadius: 8, background: t.inputBg, color: t.inputText,
  });
  const lbl = { fontSize: 12, color: t.muted, fontWeight: 500, marginBottom: 4, display: "block" };
  const fld = { display: "flex", flexDirection: "column" };
  const err = { fontSize: 11, color: "#E24B4A", marginTop: 3 };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14 }}>
        <div style={{ ...fld, gridColumn: "1 / -1" }}>
          <label style={lbl}>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Erling Haaland" style={inp("name")} />
          {errors.name && <span style={err}>{errors.name}</span>}
        </div>
        <div style={fld}>
          <label style={lbl}>Team code</label>
          <input name="team" value={form.team} onChange={handleChange} placeholder="e.g. MCI" maxLength={3} style={inp("team")} />
          {errors.team && <span style={err}>{errors.team}</span>}
        </div>
        <div style={fld}>
          <label style={lbl}>Team name</label>
          <input name="teamName" value={form.teamName} onChange={handleChange} placeholder="e.g. Man City" style={inp("teamName")} />
          {errors.teamName && <span style={err}>{errors.teamName}</span>}
        </div>
        <div style={fld}>
          <label style={lbl}>Position</label>
          <select name="position" value={form.position} onChange={handleChange} style={{ ...inp("position"), appearance: "auto" }}>
            <option value="">Select position…</option>
            <option value="FW">Forward (FW)</option>
            <option value="MF">Midfielder (MF)</option>
            <option value="DF">Defender (DF)</option>
            <option value="GK">Goalkeeper (GK)</option>
          </select>
          {errors.position && <span style={err}>{errors.position}</span>}
        </div>
        <div style={fld}>
          <label style={lbl}>Goals</label>
          <input type="number" name="goals" value={form.goals} onChange={handleChange} min={0} style={inp("goals")} />
          {errors.goals && <span style={err}>{errors.goals}</span>}
        </div>
        <div style={fld}>
          <label style={lbl}>Assists</label>
          <input type="number" name="assists" value={form.assists} onChange={handleChange} min={0} style={inp("assists")} />
          {errors.assists && <span style={err}>{errors.assists}</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
        <button onClick={onCancel} style={{ padding: "8px 18px", border: `1px solid ${t.border}`, borderRadius: 8, background: "transparent", color: t.muted, fontSize: 14, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={handleSubmit} disabled={loading || success} style={{ padding: "8px 18px", border: "none", borderRadius: 8, background: success ? t.success : t.accent, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", opacity: loading ? 0.7 : 1, transition: "background 0.2s" }}>
          {success ? "✓ Saved!" : loading ? "Saving…" : submitLabel}
        </button>
      </div>
      {success && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: t.successBg, border: `1px solid ${t.successBdr}`, borderRadius: 8, fontSize: 13, color: t.success }}>
          {submitLabel === "Update player" ? "Player updated!" : "Player added successfully!"}
        </div>
      )}
    </div>
  );
}

// ── Add Player Panel ───────────────────────────────────────────────────────────
function AddPlayerPanel({ onAdd, t }) {
  const [open, setOpen] = useState(false);

  async function handleSave(form) {
    try { await axios.post(API, form); } catch {}
    onAdd({ ...form, id: Date.now() });
    setTimeout(() => setOpen(false), 1500);
  }

  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: 24, background: t.card }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Add new player</span>
        <button onClick={() => setOpen((o) => !o)} style={{ padding: "6px 14px", fontSize: 13, border: `1px solid ${t.border}`, borderRadius: 8, background: open ? t.surface : t.card, cursor: "pointer", color: t.text }}>
          {open ? "— Close" : "+ Add player"}
        </button>
      </div>
      {open && (
        <div style={{ marginTop: 20 }}>
          <PlayerForm onSave={handleSave} onCancel={() => setOpen(false)} submitLabel="Save player" t={t} />
        </div>
      )}
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditModal({ player, onSave, onClose, t }) {
  async function handleSave(form) {
    try { await axios.put(`${API}/${player.id}`, form); } catch {}
    onSave({ ...form, id: player.id });
    setTimeout(onClose, 1500);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: t.modalBg, borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 520, margin: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={player.name} size={36} />
            <div>
              <div style={{ fontWeight: 500, fontSize: 15, color: t.text }}>Edit player</div>
              <div style={{ fontSize: 12, color: t.muted }}>{player.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: t.hint }}>×</button>
        </div>
        <PlayerForm initial={player} onSave={handleSave} onCancel={onClose} submitLabel="Update player" t={t} />
      </div>
    </div>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────────
function DetailModal({ player, onEdit, onClose, maxGoals, maxAssists, t, dark }) {
  const av = getAvatar(player.name);
  const contribution = player.goals + player.assists;

  const statRow = (label, value, color, max) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
        <span style={{ color: t.muted }}>{label}</span>
        <span style={{ fontWeight: 500, color: t.text }}>{value}</span>
      </div>
      <div style={{ height: 8, background: t.barBg, borderRadius: 4 }}>
        <div style={{ width: `${max ? Math.round((value / max) * 100) : 0}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.4s" }} />
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: t.modalBg, borderRadius: 16, width: "100%", maxWidth: 400, margin: "0 1rem", overflow: "hidden" }}>
        <div style={{ background: t.surface, padding: "1.5rem", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${t.border}` }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: av.bg, color: av.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 500 }}>
            {av.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 17, color: t.text }}>{player.name}</div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 2 }}>{player.teamName}</div>
            <div style={{ marginTop: 6 }}><PositionBadge position={player.position} dark={dark} /></div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 22, cursor: "pointer", color: t.hint, alignSelf: "flex-start" }}>×</button>
        </div>
        <div style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[["Goals", player.goals, "#D85A30"], ["Assists", player.assists, "#378ADD"], ["G+A", contribution, "#7F77DD"]].map(([l, v, c]) => (
              <div key={l} style={{ flex: 1, background: t.statBg, borderRadius: 8, padding: "10px 12px", textAlign: "center", border: `1px solid ${t.border}` }}>
                <div style={{ fontSize: 22, fontWeight: 500, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          {statRow("Goals", player.goals, "#D85A30", maxGoals)}
          {statRow("Assists", player.assists, "#378ADD", maxAssists)}
          {statRow("Contributions (G+A)", contribution, "#7F77DD", maxGoals + maxAssists)}
        </div>
        <div style={{ padding: "0 1.5rem 1.25rem", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", border: `1px solid ${t.border}`, borderRadius: 8, background: "transparent", color: t.muted, fontSize: 13, cursor: "pointer" }}>Close</button>
          <button onClick={onEdit} style={{ padding: "8px 16px", border: "none", borderRadius: 8, background: t.accent, color: "#fff", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Edit player</button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
function DeleteModal({ player, onConfirm, onClose, t }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try { await axios.delete(`${API}/${player.id}`); } catch {}
    onConfirm(player.id);
    setLoading(false);
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlay, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: t.modalBg, borderRadius: 16, padding: "1.5rem", width: "100%", maxWidth: 380, margin: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FCEBEB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚠</div>
          <div style={{ fontWeight: 500, fontSize: 15, color: t.text }}>Remove player</div>
        </div>
        <p style={{ fontSize: 14, color: t.muted, marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to remove <strong style={{ color: t.text }}>{player.name}</strong> from the squad? This cannot be undone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", border: `1px solid ${t.border}`, borderRadius: 8, background: "transparent", color: t.muted, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={handleDelete} disabled={loading} style={{ padding: "8px 18px", border: "none", borderRadius: 8, background: t.danger, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Removing…" : "Yes, remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("plDark") === "true"; } catch { return false; }
  });

  const t = useMemo(() => makeTheme(dark), [dark]);

  function toggleDark() {
    setDark((d) => {
      try { localStorage.setItem("plDark", String(!d)); } catch {}
      return !d;
    });
  }

  // Apply bg to document body so no white flash outside the app div
  useEffect(() => {
    document.body.style.background = t.bg;
    document.body.style.margin = "0";
    return () => { document.body.style.background = ""; };
  }, [t.bg]);

  const [players, setPlayers]       = useState([]);
  const [search, setSearch]         = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [posFilter, setPosFilter]   = useState("");
  const [sortKey, setSortKey]       = useState("goals");
  const [sortDir, setSortDir]       = useState(-1);

  const [detailPlayer, setDetailPlayer] = useState(null);
  const [editPlayer, setEditPlayer]     = useState(null);
  const [deletePlayer, setDeletePlayer] = useState(null);

  useEffect(() => {
    axios.get(API).then((res) => setPlayers(res.data)).catch(() => setPlayers(MOCK));
  }, []);

  const teams      = useMemo(() => [...new Map(players.map((p) => [p.team, p.teamName]))], [players]);
  const maxGoals   = useMemo(() => Math.max(...players.map((p) => p.goals), 1), [players]);
  const maxAssists = useMemo(() => Math.max(...players.map((p) => p.assists), 1), [players]);

  const filtered = useMemo(() => {
    return players
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (!teamFilter || p.team === teamFilter) &&
        (!posFilter || p.position === posFilter)
      )
      .sort((a, b) => {
        const av = a[sortKey], bv = b[sortKey];
        if (typeof av === "number") return (av - bv) * sortDir;
        return av.localeCompare(bv) * sortDir;
      });
  }, [players, search, teamFilter, posFilter, sortKey, sortDir]);

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => d * -1);
    else { setSortKey(key); setSortDir(-1); }
  }

  function SortArrow({ col }) {
    if (sortKey !== col) return <span style={{ opacity: 0.3, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4, color: t.accent }}>{sortDir === -1 ? "↓" : "↑"}</span>;
  }

  const thStyle = {
    padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 500,
    color: t.muted, cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    background: t.surface, borderBottom: `1px solid ${t.border}`,
  };
  const tdStyle = { padding: "11px 14px", borderTop: `1px solid ${t.borderLight}`, fontSize: 14, color: t.text };

  const selStyle = { padding: "8px 12px", border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 14, minWidth: 150, background: t.inputBg, color: t.inputText };

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif", maxWidth: 920, margin: "0 auto", background: t.bg, minHeight: "100vh", transition: "background 0.25s, color 0.25s" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: dark ? "#1a2a40" : "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚽</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0, color: t.text }}>Premier League Players</h1>
            <p style={{ fontSize: 13, color: t.muted, margin: 0 }}>{players.length} players · {teams.length} teams</p>
          </div>
        </div>
        <DarkToggle dark={dark} onToggle={toggleDark} t={t} />
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total players" value={players.length} t={t} />
        <StatCard label="Teams" value={teams.length} t={t} />
        <StatCard label="Total goals" value={players.reduce((s, p) => s + p.goals, 0)} t={t} />
        <StatCard label="Total assists" value={players.reduce((s, p) => s + p.assists, 0)} t={t} />
      </div>

      {/* Add Player */}
      <AddPlayerPanel onAdd={(p) => setPlayers((prev) => [p, ...prev])} t={t} />

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: t.hint, fontSize: 14 }}>🔍</span>
          <input type="text" placeholder="Search player…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 32px", border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 14, outline: "none", background: t.inputBg, color: t.inputText, boxSizing: "border-box" }} />
        </div>
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} style={selStyle}>
          <option value="">All teams</option>
          {teams.map(([team, teamName]) => <option key={team} value={team}>{teamName}</option>)}
        </select>
        <select value={posFilter} onChange={(e) => setPosFilter(e.target.value)} style={selStyle}>
          <option value="">All positions</option>
          <option value="FW">Forwards</option>
          <option value="MF">Midfielders</option>
          <option value="DF">Defenders</option>
          <option value="GK">Goalkeepers</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "28%" }} onClick={() => handleSort("name")}>Player <SortArrow col="name" /></th>
              <th style={{ ...thStyle, width: "18%" }} onClick={() => handleSort("team")}>Team <SortArrow col="team" /></th>
              <th style={{ ...thStyle, width: "9%"  }} onClick={() => handleSort("position")}>Pos <SortArrow col="position" /></th>
              <th style={{ ...thStyle, width: "18%" }} onClick={() => handleSort("goals")}>Goals <SortArrow col="goals" /></th>
              <th style={{ ...thStyle, width: "18%" }} onClick={() => handleSort("assists")}>Assists <SortArrow col="assists" /></th>
              <th style={{ ...thStyle, width: "9%", cursor: "default" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ ...tdStyle, textAlign: "center", padding: "2.5rem", color: t.hint }}>No players match your filters.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id}
                onMouseEnter={(e) => e.currentTarget.style.background = t.surface}
                onMouseLeave={(e) => e.currentTarget.style.background = ""}
              >
                <td style={{ ...tdStyle, cursor: "pointer" }} onClick={() => setDetailPlayer(p)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={p.name} size={28} />
                    <span style={{ color: t.accent }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ ...tdStyle, color: t.muted }}>{p.teamName}</td>
                <td style={tdStyle}><PositionBadge position={p.position} dark={dark} /></td>
                <td style={tdStyle}><StatBar value={p.goals} max={maxGoals} color="#D85A30" t={t} /></td>
                <td style={tdStyle}><StatBar value={p.assists} max={maxAssists} color="#378ADD" t={t} /></td>
                <td style={tdStyle}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button title="Edit" onClick={() => setEditPlayer(p)}
                      style={{ padding: "4px 10px", fontSize: 12, border: `1px solid ${t.border}`, borderRadius: 6, background: "transparent", cursor: "pointer", color: t.text }}>✏</button>
                    <button title="Delete" onClick={() => setDeletePlayer(p)}
                      style={{ padding: "4px 10px", fontSize: 12, border: "1px solid #7f1d1d", borderRadius: 6, background: "transparent", cursor: "pointer", color: t.danger }}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 10, fontSize: 12, color: t.hint, textAlign: "right" }}>
        Showing {filtered.length} of {players.length} players
      </p>

      {detailPlayer && <DetailModal player={detailPlayer} maxGoals={maxGoals} maxAssists={maxAssists} onEdit={() => { setEditPlayer(detailPlayer); setDetailPlayer(null); }} onClose={() => setDetailPlayer(null)} t={t} dark={dark} />}
      {editPlayer   && <EditModal   player={editPlayer}   onSave={(u) => setPlayers((prev) => prev.map((p) => p.id === u.id ? u : p))} onClose={() => setEditPlayer(null)} t={t} />}
      {deletePlayer && <DeleteModal player={deletePlayer} onConfirm={(id) => setPlayers((prev) => prev.filter((p) => p.id !== id))} onClose={() => setDeletePlayer(null)} t={t} />}
    </div>
  );
}