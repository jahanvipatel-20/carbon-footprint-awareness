import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BatteryCharging,
  Car,
  Leaf,
  Sprout,
  SunMedium,
  Trophy,
  Waves,
  Zap,
} from 'lucide-react';

const emissionFactors = {
  petrol: 0.2,
  diesel: 0.18,
  electric: 0.08,
  gas: 0.2,
};

const dailyMissions = [
  { id: 1, label: 'Cold Water Wash', xp: 20 },
  { id: 2, label: 'Meat-free Lunch', xp: 25 },
  { id: 3, label: 'Bike or Walk 10 min', xp: 30 },
];

export default function App() {
  const [transport, setTransport] = useState(40);
  const [fuelType, setFuelType] = useState('petrol');
  const [energy, setEnergy] = useState(18);
  const [energySource, setEnergySource] = useState('electric');
  const [diet, setDiet] = useState(5);
  const [dietType, setDietType] = useState('balanced');
  const [missionsDone, setMissionsDone] = useState([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('eco-platform');
    if (saved) {
      const parsed = JSON.parse(saved);
      setMissionsDone(parsed.missionsDone || []);
      setStreak(parsed.streak || 0);
      setXp(parsed.xp || 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eco-platform', JSON.stringify({ missionsDone, streak, xp }));
  }, [missionsDone, streak, xp]);

  const transportEmission = transport * emissionFactors[fuelType];
  const energyEmission = energy * (energySource === 'electric' ? 0.4 : 0.55);
  const dietEmission = diet * (dietType === 'vegan' ? 1.2 : dietType === 'vegetarian' ? 0.8 : 1.6);
  const total = transportEmission + energyEmission + dietEmission;

  const categoryBreakdown = [
    { label: 'Transport', value: transportEmission, color: 'from-emerald-400 to-cyan-400' },
    { label: 'Energy', value: energyEmission, color: 'from-cyan-400 to-sky-400' },
    { label: 'Diet', value: dietEmission, color: 'from-lime-400 to-emerald-500' },
  ];

  const topCategory = useMemo(() => categoryBreakdown.reduce((a, b) => (a.value > b.value ? a : b)), [categoryBreakdown]);
  const percentage = Math.min(100, Math.round((total / 40) * 100));

  const tips = useMemo(() => {
    const suggestions = [];
    if (topCategory.label === 'Transport') {
      suggestions.push('Switching to cycling for trips under 5 km could save about 15 kg of CO2 this week.');
      suggestions.push('Group errands into one trip to cut weekly mileage and fuel use.');
    }
    if (topCategory.label === 'Energy') {
      suggestions.push('Use scheduled power saving modes to reduce standby energy draw at night.');
      suggestions.push('Shift heavy laundry to off-peak hours and use cold water for most loads.');
    }
    if (topCategory.label === 'Diet') {
      suggestions.push('Swap one meat meal each week with legumes or tofu to lower your footprint.');
      suggestions.push('Plan plant-based lunches ahead to keep your weekly diet consistent.');
    }
    return suggestions.slice(0, 3);
  }, [topCategory]);

  const toggleMission = (id) => {
    if (missionsDone.includes(id)) {
      setMissionsDone((prev) => prev.filter((item) => item !== id));
      setXp((prev) => Math.max(0, prev - 20));
      return;
    }
    setMissionsDone((prev) => [...prev, id]);
    setXp((prev) => prev + 20);
    setStreak((prev) => prev + 1);
  };

  const leaderboard = [
    { name: 'Ava', score: 92 },
    { name: 'Noah', score: 89 },
    { name: 'You', score: Math.max(60, Math.round(xp / 2 + streak * 4)) },
    { name: 'Maya', score: 71 },
    { name: 'Leo', score: 68 },
  ].sort((a, b) => b.score - a.score);

  return (
    <main className="min-h-screen p-4 text-slate-100 md:p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Nature-Tech Platform</p>
              <h1 className="mt-2 text-3xl font-semibold text-white md:text-5xl">Carbon Footprint Awareness Platform</h1>
              <p className="mt-3 max-w-2xl text-slate-300">Monitor your impact, calculate your footprint, and turn sustainable choices into visible progress.</p>
            </div>
            <div className="rounded-2xl border border-cyan-400/20 bg-slate-800/70 p-4 text-right shadow-lg shadow-cyan-900/10">
              <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Current footprint</p>
              <p className="text-2xl font-semibold text-emerald-300">{total.toFixed(1)} kg CO₂</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-emerald-300"><Activity size={18}/> <h2 className="text-xl font-semibold">Interactive Dashboard</h2></div>
            <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
              <div className="rounded-3xl border border-cyan-400/10 bg-slate-800/70 p-5">
                <p className="text-sm text-slate-300">Global Impact Score</p>
                <div className="mt-5 flex items-center gap-6">
                  <div className="relative h-28 w-28 rounded-full" style={{ background: 'conic-gradient(#34d399 0deg, #22d3ee 0deg, #1f2937 0deg)' }}>
                    <div className="absolute inset-2 rounded-full bg-slate-900" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-emerald-200">{percentage}%</div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">Goal progress</p>
                    <p className="text-2xl font-semibold text-white">{Math.max(0, 100 - percentage)}% to target</p>
                    <p className="mt-2 text-xs text-cyan-200">Optimized for low-carbon habits.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-cyan-400/10 bg-slate-800/70 p-5">
                <p className="text-sm text-slate-300">Carbon Trend</p>
                <svg viewBox="0 0 320 120" className="mt-4 h-28 w-full overflow-visible">
                  <path d="M0 90 C40 70, 70 55, 105 60 S175 95, 210 68 S270 20, 320 30" fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
                  <path d="M0 98 C40 80, 70 66, 105 72 S175 105, 210 78 S270 35, 320 42" fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
                </svg>
                <p className="text-xs text-slate-400">Minimal SVG trendline for lightweight visuals.</p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-cyan-300"><Leaf size={18}/> <h2 className="text-xl font-semibold">Precision Calculator</h2></div>
            <div className="mt-5 space-y-4 text-sm text-slate-200">
              <label className="block">Transport distance (km)
                <input type="range" min="5" max="200" value={transport} onChange={(e)=>setTransport(Number(e.target.value))} className="mt-2 w-full accent-emerald-400" />
                <span className="text-cyan-200">{transport} km</span>
              </label>
              <label className="block">Fuel type
                <select value={fuelType} onChange={(e)=>setFuelType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-slate-100">
                  {Object.keys(emissionFactors).map((item) => <option key={item} value={item}>{item}</option>) }
                </select>
              </label>
              <label className="block">Energy use (kWh)
                <input type="range" min="5" max="80" value={energy} onChange={(e)=>setEnergy(Number(e.target.value))} className="mt-2 w-full accent-cyan-400" />
                <span className="text-cyan-200">{energy} kWh</span>
              </label>
              <label className="block">Source
                <select value={energySource} onChange={(e)=>setEnergySource(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-slate-100">
                  <option value="electric">Electricity</option>
                  <option value="gas">Gas</option>
                </select>
              </label>
              <label className="block">Diet habits (meals/week)
                <input type="range" min="1" max="14" value={diet} onChange={(e)=>setDiet(Number(e.target.value))} className="mt-2 w-full accent-lime-400" />
                <span className="text-cyan-200">{diet} meals/week</span>
              </label>
              <label className="block">Diet style
                <select value={dietType} onChange={(e)=>setDietType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-slate-100">
                  <option value="balanced">Balanced</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </label>
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-emerald-300"><BatteryCharging size={18}/> <h2 className="text-xl font-semibold">Impact Breakdown</h2></div>
            <div className="mt-5 space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-100"><span>{item.label}</span><strong>{item.value.toFixed(1)} kg</strong></div>
                  <div className="h-2 rounded-full bg-slate-700"><div className={`h-2 rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${Math.max(8, (item.value / total) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-cyan-300"><Zap size={18}/> <h2 className="text-xl font-semibold">Smart AI Sustainability Agent</h2></div>
            <p className="mt-3 text-sm text-slate-300">Highest impact category: <strong>{topCategory.label}</strong></p>
            <ul className="mt-4 space-y-3 text-sm text-slate-100">
              {tips.map((tip, index) => (
                <li key={index} className="rounded-2xl border border-emerald-400/15 bg-slate-800/70 p-4">{tip}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-emerald-300"><Sprout size={18}/> <h2 className="text-xl font-semibold">Gamified Eco-System</h2></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {dailyMissions.map((mission) => (
                <button key={mission.id} onClick={() => toggleMission(mission.id)} className={`rounded-2xl border p-4 text-left transition ${missionsDone.includes(mission.id) ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-slate-700 bg-slate-800/70 hover:border-cyan-400/40'}`}>
                  <div className="flex items-center justify-between"><span className="font-medium">{mission.label}</span><span className="rounded-full bg-slate-700 px-2 py-1 text-xs text-cyan-200">+{mission.xp} XP</span></div>
                  <p className="mt-2 text-xs text-slate-300">{missionsDone.includes(mission.id) ? 'Completed today' : 'Tap to complete'}</p>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <div className="rounded-2xl border border-cyan-400/20 bg-slate-800/80 px-4 py-3">Streak: <strong>{streak} days</strong></div>
              <div className="rounded-2xl border border-emerald-400/20 bg-slate-800/80 px-4 py-3">XP: <strong>{xp}</strong></div>
            </div>
          </article>

          <article className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-2xl shadow-cyan-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-cyan-300"><Trophy size={18}/> <h2 className="text-xl font-semibold">Global Leaderboard</h2></div>
            <ul className="mt-5 space-y-3 text-sm text-slate-100">
              {leaderboard.map((person, index) => (
                <li key={person.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                  <span className="flex items-center gap-3"><span className="text-cyan-200">#{index + 1}</span> {person.name}</span>
                  <strong>{person.score} pts</strong>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <footer className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 text-sm text-slate-300 shadow-xl shadow-slate-950/60 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <Waves size={16} className="text-cyan-300" />
            <span>Green software, lightweight build, no external image assets, and secure client-side input handling.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
