import { useState } from 'react';
import { Activity, Layers, Settings, Youtube, Zap } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen w-screen bg-carbon-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-rog-dark border-r border-gray-800 flex flex-col relative z-10">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-orbitron font-bold text-rog-red tracking-widest">
            RAIN<span className="text-white">FLOW</span>
          </h1>
          <p className="text-xs text-gray-500 font-rajdhani mt-1 tracking-[0.2em]">AUTOMATION SUITE</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem
            icon={<Activity />}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <SidebarItem
            icon={<Layers />}
            label="Job Queue"
            active={activeTab === 'queue'}
            onClick={() => setActiveTab('queue')}
          />
          <SidebarItem
            icon={<Youtube />}
            label="Uploads"
            active={activeTab === 'uploads'}
            onClick={() => setActiveTab('uploads')}
          />
          <SidebarItem
            icon={<Settings />}
            label="Config"
            active={activeTab === 'config'}
            onClick={() => setActiveTab('config')}
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="rog-panel p-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
            <div>
              <p className="text-xs text-gray-400 font-rajdhani">SYSTEM STATUS</p>
              <p className="text-sm font-bold text-neon-blue">ONLINE</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rog-red/5 to-transparent pointer-events-none"></div>

        <div className="p-8 h-full overflow-y-auto relative z-10">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-orbitron text-white">COMMAND CENTER</h2>
              <p className="text-gray-400 font-rajdhani">Welcome back, Commander.</p>
            </div>
            <button className="rog-btn rog-btn-lambo flex items-center gap-2">
              <Zap size={18} />
              <span>NEW CAMPAIGN</span>
            </button>
          </header>

          {/* Content Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Active Jobs" value="3" color="text-neon-blue" />
            <StatCard label="Quota Used" value="4,500 / 10,000" color="text-lambo-yellow" />
            <StatCard label="Videos Published" value="128" color="text-rog-red" />
          </div>

          <div className="mt-8 rog-panel h-96 flex items-center justify-center border-dashed border-gray-700">
            <p className="text-gray-500 font-rajdhani text-xl">MODULE: {activeTab.toUpperCase()}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 font-rajdhani font-bold tracking-wide ${active
        ? 'bg-rog-red/20 text-rog-red border-l-4 border-rog-red'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, color }: any) => (
  <div className="rog-panel p-6">
    <p className="text-gray-400 font-rajdhani uppercase text-sm tracking-wider">{label}</p>
    <p className={`text-4xl font-orbitron font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default App;
