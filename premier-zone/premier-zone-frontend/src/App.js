import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");

  // Fetch data from backend
  useEffect(() => {
    axios
      .get("http://localhost:9090/api/player")
      .then((res) => setPlayers(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Get unique teams for dropdown
  const teams = [...new Set(players.map((p) => p.team))];

  // Filter logic
  const filteredPlayers = players.filter((player) => {
    return (
      player.name.toLowerCase().includes(search.toLowerCase()) &&
      (teamFilter === "" || player.team === teamFilter)
    );
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>⚽ Premier League Players</h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search player..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px",
          width: "250px",
        }}
      />

      {/* 🏷 Team Filter */}
      <select
        value={teamFilter}
        onChange={(e) => setTeamFilter(e.target.value)}
        style={{ padding: "8px" }}
      >
        <option value="">All Teams</option>
        {teams.map((team, index) => (
          <option key={index} value={team}>
            {team}
          </option>
        ))}
      </select>

      {/* 📊 Table */}
      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Team</th>
            <th>Position</th>
            <th>Goals</th>
            <th>Assists</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.teamName}</td>
              <td>{p.position}</td>
              <td>{p.goals}</td>
              <td>{p.assists}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;