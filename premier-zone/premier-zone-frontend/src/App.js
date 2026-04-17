import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const MOCK = [
  { name: "Erling Haaland", team: "MCI", teamName: "Man City", position: "FW", goals: 27, assists: 5 },
  { name: "Mohamed Salah", team: "LIV", teamName: "Liverpool", position: "FW", goals: 24, assists: 13 },
  { name: "Cole Palmer", team: "CHE", teamName: "Chelsea", position: "MF", goals: 22, assists: 10 },
  { name: "Alexander Isak", team: "NEW", teamName: "Newcastle", position: "FW", goals: 21, assists: 4 },
  { name: "Bukayo Saka", team: "ARS", teamName: "Arsenal", position: "MF", goals: 16, assists: 10 },
  { name: "Jarrod Bowen", team: "WHU", teamName: "West Ham", position: "MF", goals: 14, assists: 7 },
  { name: "Son Heung-min", team: "TOT", teamName: "Tottenham", position: "FW", goals: 13, assists: 8 },
  { name: "Ollie Watkins", team: "AVL", teamName: "Aston Villa", position: "FW", goals: 12, assists: 11 },
  { name: "Marcus Rashford", team: "MUN", teamName: "Man United", position: "FW", goals: 7, assists: 4 },
  { name: "Trent Alexander-Arnold", team: "LIV", teamName: "Liverpool", position: "DF", goals: 4, assists: 9 },
  { name: "William Saliba", team: "ARS", teamName: "Arsenal", position: "DF", goals: 3, assists: 1 },
  { name: "Ederson", team: "MCI", teamName: "Man City", position: "GK", goals: 0, assists: 0 },
  { name: "David Raya", team: "ARS", teamName: "Arsenal", position: "GK", goals: 0, assists: 2 },
  { name: "Declan Rice", team: "ARS", teamName: "Arsenal", position: "MF", goals: 7, assists: 6 },
  { name: "Phil Foden", team: "MCI", teamName: "Man City", position: "MF", goals: 10, assists: 5 },
];

const AVATAR_BG = ["#CECBF6","#9FE1CB","#F5C4B3","#B5D4F4","#C0DD97","#FAC775","#F4C0D1"];
const AVATAR_FG = ["#3C3489","#085041","#712B13","#0C447C","#27500A","#633806","#72243E"];

const EMPTY_FORM = { name: "", team: "", teamName: "", position: "", goals: 0, assists: 0 };

function getAvatar(name) {
  const i = name.charCodeAt(0) % AVATAR_BG.length;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return { bg: AVATAR_BG[i], fg: AVATAR_FG[i], initials };
}

const POS_STYLES = {
  FW: { background: "#FAECE7", color: "#993C1D" },
  MF: { background: "#E6F1FB", color: "#185FA5" },
  DF: { background: "#EAF3DE", color: "#3B6D11" },
  GK: { background: "#FAEEDA", color: "#854F0B" },
};

function PositionBadge({ position }) {
  const style = POS_STYLES[position] || POS_STYLES.MF;
  return (
    <span style={{ ...style, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, display: "inline-block" }}>
      {position}
    </span>
  );
}

function StatBar({ value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ minWidth: 20, textAlign: "right", fontSize: 13 }}>{value}</span>
      <div style={{ flex: 1, height: 6, background: "#e5e7eb", borderRadius: 3, minWidth: 40 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 16px", flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

// ── Add Player Form ────────────────────────────────────────────────────────────
function AddPlayerForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "goals" || name === "assists" ? Number(value) : value,
    }));
    setErrors((err) => ({ ...err, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.team.trim()) newErrors.team = "Team code is required";
    if (!form.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!form.position) newErrors.position = "Position is required";
    if (form.goals < 0) newErrors.goals = "Cannot be negative";
    if (form.assists < 0) newErrors.assists = "Cannot be negative";
    return newErrors;
  }

  async function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await axios.post("http://localhost:9090/api/player", form);
    } catch {
      // API unreachable — add locally anyway
    } finally {
      onAdd(form);
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setOpen(false);
        setForm(EMPTY_FORM);
        setSuccess(false);
      }, 1500);
    }
  }

  function handleCancel() {
    setOpen(false);
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccess(false);
  }

  const inputStyle = (field) => ({
    width: "100%",
    padding: "8px 10px",
    border: `1px solid ${errors[field] ? "#E24B4A" : "#e5e7eb"}`,
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    background: "#fff",
    color: "#111827",
  });

  const labelStyle = { fontSize: 12, color: "#6b7280", fontWeight: 500, marginBottom: 4, display: "block" };
  const errStyle   = { fontSize: 11, color: "#E24B4A", marginTop: 3 };
  const fieldStyle = { display: "flex", flexDirection: "column" };

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: 24, background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 500 }}>Add new player</span>
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            padding: "6px 14px", fontSize: 13,
            border: "1px solid #e5e7eb", borderRadius: 8,
            background: open ? "#f3f4f6" : "#fff",
            cursor: "pointer", color: "#374151",
          }}
        >
          {open ? "— Close" : "+ Add player"}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14 }}>
            {/* Full name */}
            <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Full name</label>
              <input
                name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Erling Haaland" style={inputStyle("name")}
              />
              {errors.name && <span style={errStyle}>{errors.name}</span>}
            </div>

            {/* Team code */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Team code</label>
              <input
                name="team" value={form.team} onChange={handleChange}
                placeholder="e.g. MCI" maxLength={3} style={inputStyle("team")}
              />
              {errors.team && <span style={errStyle}>{errors.team}</span>}
            </div>

            {/* Team name */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Team name</label>
              <input
                name="teamName" value={form.teamName} onChange={handleChange}
                placeholder="e.g. Man City" style={inputStyle("teamName")}
              />
              {errors.teamName && <span style={errStyle}>{errors.teamName}</span>}
            </div>

            {/* Position */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Position</label>
              <select
                name="position" value={form.position} onChange={handleChange}
                style={{ ...inputStyle("position"), appearance: "auto" }}
              >
                <option value="">Select position…</option>
                <option value="FW">Forward (FW)</option>
                <option value="MF">Midfielder (MF)</option>
                <option value="DF">Defender (DF)</option>
                <option value="GK">Goalkeeper (GK)</option>
              </select>
              {errors.position && <span style={errStyle}>{errors.position}</span>}
            </div>

            {/* Goals */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Goals</label>
              <input
                type="number" name="goals" value={form.goals}
                onChange={handleChange} min={0} style={inputStyle("goals")}
              />
              {errors.goals && <span style={errStyle}>{errors.goals}</span>}
            </div>

            {/* Assists */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Assists</label>
              <input
                type="number" name="assists" value={form.assists}
                onChange={handleChange} min={0} style={inputStyle("assists")}
              />
              {errors.assists && <span style={errStyle}>{errors.assists}</span>}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
            <button
              onClick={handleCancel}
              style={{
                padding: "8px 18px", border: "1px solid #e5e7eb", borderRadius: 8,
                background: "transparent", color: "#6b7280", fontSize: 14, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || success}
              style={{
                padding: "8px 18px", border: "none", borderRadius: 8,
                background: success ? "#3B6D11" : "#185FA5",
                color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer",
                opacity: loading ? 0.7 : 1, transition: "background 0.2s",
              }}
            >
              {success ? "✓ Saved!" : loading ? "Saving…" : "Save player"}
            </button>
          </div>

          {success && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#EAF3DE", border: "1px solid #C0DD97", borderRadius: 8, fontSize: 13, color: "#3B6D11" }}>
              Player added successfully!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [posFilter, setPosFilter] = useState("");
  const [sortKey, setSortKey] = useState("goals");
  const [sortDir, setSortDir] = useState(-1);

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/player")
      .then((res) => setPlayers(res.data))
      .catch(() => setPlayers(MOCK));
  }, []);

  function handleAddPlayer(newPlayer) {
    setPlayers((prev) => [newPlayer, ...prev]);
  }

  const teams = useMemo(
    () => [...new Map(players.map((p) => [p.team, p.teamName]))],
    [players]
  );

  const maxGoals   = useMemo(() => Math.max(...players.map((p) => p.goals), 1), [players]);
  const maxAssists = useMemo(() => Math.max(...players.map((p) => p.assists), 1), [players]);

  const filtered = useMemo(() => {
    return players
      .filter(
        (p) =>
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
    return <span style={{ marginLeft: 4, color: "#185FA5" }}>{sortDir === -1 ? "↓" : "↑"}</span>;
  }

  const totalGoals   = players.reduce((s, p) => s + p.goals, 0);
  const totalAssists = players.reduce((s, p) => s + p.assists, 0);

  const thStyle = {
    padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 500,
    color: "#6b7280", cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    background: "#f9fafb", borderBottom: "1px solid #e5e7eb",
  };

  const tdStyle = {
    padding: "11px 14px", borderTop: "1px solid #f3f4f6", fontSize: 14, color: "#111827",
  };

  return (
    <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, background: "#EFF6FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          ⚽
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Premier League Players</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            {players.length} players · {teams.length} teams
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total players" value={players.length} />
        <StatCard label="Teams" value={teams.length} />
        <StatCard label="Total goals" value={totalGoals} />
        <StatCard label="Total assists" value={totalAssists} />
      </div>

      {/* Add Player Form */}
      <AddPlayerForm onAdd={handleAddPlayer} />

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>🔍</span>
          <input
            type="text" placeholder="Search player…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" }}
          />
        </div>

        <select
          value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, minWidth: 150 }}
        >
          <option value="">All teams</option>
          {teams.map(([team, teamName]) => (
            <option key={team} value={team}>{teamName}</option>
          ))}
        </select>

        <select
          value={posFilter} onChange={(e) => setPosFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, minWidth: 150 }}
        >
          <option value="">All positions</option>
          <option value="FW">Forwards</option>
          <option value="MF">Midfielders</option>
          <option value="DF">Defenders</option>
          <option value="GK">Goalkeepers</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "30%" }} onClick={() => handleSort("name")}>Player <SortArrow col="name" /></th>
              <th style={{ ...thStyle, width: "20%" }} onClick={() => handleSort("team")}>Team <SortArrow col="team" /></th>
              <th style={{ ...thStyle, width: "10%" }} onClick={() => handleSort("position")}>Pos <SortArrow col="position" /></th>
              <th style={{ ...thStyle, width: "20%" }} onClick={() => handleSort("goals")}>Goals <SortArrow col="goals" /></th>
              <th style={{ ...thStyle, width: "20%" }} onClick={() => handleSort("assists")}>Assists <SortArrow col="assists" /></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: "center", padding: "2.5rem", color: "#9ca3af" }}>
                  No players match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((p, i) => {
                const av = getAvatar(p.name);
                return (
                  <tr
                    key={i}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: av.bg, color: av.fg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                          {av.initials}
                        </div>
                        {p.name}
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: "#6b7280" }}>{p.teamName}</td>
                    <td style={tdStyle}><PositionBadge position={p.position} /></td>
                    <td style={tdStyle}><StatBar value={p.goals} max={maxGoals} color="#D85A30" /></td>
                    <td style={tdStyle}><StatBar value={p.assists} max={maxAssists} color="#378ADD" /></td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: 10, fontSize: 12, color: "#9ca3af", textAlign: "right" }}>
        Showing {filtered.length} of {players.length} players
      </p>
    </div>
  );
}