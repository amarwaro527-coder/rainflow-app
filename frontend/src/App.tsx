import { useState, useEffect } from 'react';
import { Activity, Layers, Settings, Youtube, Zap, CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';
import { jobService, type Job } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch jobs on load and when tab changes
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    }
  };

  const handleCreateCampaign = async () => {
    setIsCreating(true);
    setNotification(null);
    try {
      const result = await jobService.createJob(60, 'rain noise'); // Default 60 mins
      setNotification({ type: 'success', message: `Campaign Started! Job ID: ${result.jobId}` });
      fetchJobs(); // Refresh list
    } catch (error: any) {
      setNotification({ type: 'error', message: `Failed to start campaign: ${error.message}` });
    } finally {
      setIsCreating(false);
    }
  };

  // Calculate Stats
  const activeJobsCount = jobs.filter(j => j.status === 'active' || j.status === 'waiting').length;
  const completedJobsCount = jobs.filter(j => j.status === 'completed').length;
  const failedJobsCount = jobs.filter(j => j.status === 'failed').length;

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
            <button
              onClick={handleCreateCampaign}
              disabled={isCreating}
              className={`rog-btn rog-btn-lambo flex items-center gap-2 ${isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Zap size={18} />
              <span>{isCreating ? 'STARTING...' : 'NEW CAMPAIGN'}</span>
            </button>
          </header>

          {/* Notification Area */}
          {notification && (
            <div className={`mb-6 p-4 rounded border flex items-center gap-3 ${notification.type === 'success'
              ? 'bg-green-900/20 border-green-500 text-green-400'
              : 'bg-red-900/20 border-red-500 text-red-400'
              }`}>
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span className="font-rajdhani font-bold">{notification.message}</span>
            </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Active Jobs" value={activeJobsCount.toString()} color="text-neon-blue" />
              <StatCard label="Completed" value={completedJobsCount.toString()} color="text-lambo-yellow" />
              <StatCard label="Failed" value={failedJobsCount.toString()} color="text-rog-red" />
            </div>
          )}

          {/* Queue View */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <h3 className="text-xl font-orbitron text-white mb-4">JOB QUEUE</h3>
              {jobs.length === 0 ? (
                <p className="text-gray-500 font-rajdhani">No jobs in queue.</p>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="rog-panel p-4 flex justify-between items-center border border-gray-800">
                    <div>
                      <p className="font-bold text-white">Job #{job.id}</p>
                      <p className="text-xs text-gray-400">{job.data.category} - {job.data.duration} mins</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === 'active' && <Loader className="animate-spin text-neon-blue" size={16} />}
                      {job.status === 'completed' && <CheckCircle className="text-green-500" size={16} />}
                      {job.status === 'waiting' && <Clock className="text-yellow-500" size={16} />}
                      {job.status === 'failed' && <AlertCircle className="text-red-500" size={16} />}
                      <span className="uppercase text-sm font-rajdhani">{job.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Other Views Placeholder */}
          {(activeTab === 'uploads' || activeTab === 'config') && (
            <div className="mt-8 rog-panel h-96 flex items-center justify-center border-dashed border-gray-700">
              <p className="text-gray-500 font-rajdhani text-xl">MODULE: {activeTab.toUpperCase()} (Coming Soon)</p>
            </div>
          )}
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
