let currentSport = "Kabaddi";
let pointsData = [];

/* =======================
   LOAD POINTS (BACKEND)
   ======================= */
function loadPoints(sport) {
  fetch(`https://inter-nit-backend.onrender.com/points/${sport}`)
    .then(res => res.json())
    .then(data => {
      pointsData = data || [];
      renderPoolTables();
    })
    .catch(err => {
      console.error("Failed to load points:", err);
      pointsData = [];
      renderPoolTables();
    });
}

/* =======================
   TEAM STATS HELPER
   ======================= */
function getTeamStats(teamName) {
  return pointsData.find(p => p.team === teamName) || {
    played: 0,
    won: 0,
    lost: 0,
    points: 0
  };
}

/* =======================
   RENDER POOL TABLES
   ======================= */
function renderPoolTables() {
  const container = document.getElementById("poolTables");
  if (!container) return;

  container.innerHTML = "";

  const pools = ["A", "B", "C", "D", "E", "F"];

  pools.forEach(pool => {
    const poolTeams = teams
      .filter(team => team.pool === pool)
      .map(team => ({ ...team, stats: getTeamStats(team.name) }))
      .sort((a, b) =>
        b.stats.points - a.stats.points ||
        b.stats.won - a.stats.won ||
        a.stats.lost - b.stats.lost
      );

    if (poolTeams.length === 0) return;

    container.innerHTML += `
      <div class="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h2 class="text-2xl font-bold text-white mb-4">Pool ${pool}</h2>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class= "text-center" "text-slate-300 border-b border-white/10">
                <th class="py-3 px-4">Position</th>
                <th class="py-3 px-4">Team</th>
                <th class="py-3 px-4">Matches</th>
                <th class="py-3 px-4">Wins</th>
                <th class="py-3 px-4">Losses</th>
                <th class="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
  ${poolTeams.map((team, index) => `
    <tr class="${index < 2 ? 'bg-green-500/10' : ''} border-b border-white/5 hover:bg-white/5 transition text-center">

      <td class="py-3 px-4">${index + 1}</td>

      <td class="py-3 px-4">
        <div class="flex items-center justify-center gap-3">
          <img src="${team.logo}"
               onerror="this.src='assets/logos/default.png'"
               class="h-8 w-8 object-contain">
          <span>${team.name}</span>
        </div>
      </td>

      <td class="py-3 px-4">${team.stats.played}</td>
      <td class="py-3 px-4 text-green-400">${team.stats.won}</td>
      <td class="py-3 px-4 text-red-400">${team.stats.lost}</td>
      <td class="py-3 px-4 font-semibold">${team.stats.points}</td>

    </tr>
  `).join("")}
</tbody>

          </table>
        </div>
      </div>
    `;
  });
}

/* =======================
   TEAMS OVERLAY
   ======================= */
function renderTeams() {
  const grid = document.getElementById("teamsGrid");
  if (!grid) return;

  grid.innerHTML = "";
  teams.forEach(team => {
    grid.innerHTML += `
      <div class="rounded-2xl p-6 text-center bg-slate-800/50 backdrop-blur-xl
                  border border-white/10 hover:scale-[1.05] transition">
        <img src="${team.logo}"
             onerror="this.src='assets/logos/default.png'"
             class="h-24 mx-auto mb-4 object-contain">
        <p class="font-medium">${team.name}</p>
      </div>
    `;
  });
}

function openTeams() {
  document.getElementById("teamsView")?.classList.remove("hidden");
  renderTeams();
}

function closeTeams() {
  document.getElementById("teamsView")?.classList.add("hidden");
}

/* =======================
   SPORT SWITCHING
   ======================= */
function switchSport(sport) {
  currentSport = sport;

  document.querySelectorAll(".sport-card").forEach(card => {
    card.classList.remove("border-blue-400", "shadow-lg", "scale-105");
    card.classList.add("border-white/20");
  });

  const activeCard = document.querySelector(`[data-sport="${sport}"]`);
  if (activeCard) {
    activeCard.classList.remove("border-white/20");
    activeCard.classList.add("border-blue-400", "shadow-lg", "scale-105");
  }

  loadPoints(sport);
}

/* =======================
   INIT
   ======================= */
document.addEventListener("DOMContentLoaded", () => {
  loadPoints(currentSport);
});
