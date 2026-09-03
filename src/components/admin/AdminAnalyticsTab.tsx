import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  Activity, Users, Eye, ArrowUpRight, MousePointerClick, Clock, Monitor, Smartphone, 
  Globe, Bot, ShieldAlert, Cpu, Sparkles, RefreshCw, Terminal, CheckCircle2, AlertTriangle, 
  ExternalLink, Search, Filter, Play, Download
} from 'lucide-react';

interface BotLogEntry {
  id: string;
  botName: string;
  botCategory: 'search_engine' | 'ai_crawler' | 'social_bot';
  userAgent: string;
  path: string;
  method: string;
  statusCode: number;
  ip: string;
  responseTimeMs: number;
  timestamp: string;
}

interface BotTelemetryData {
  summary: {
    totalCrawls: number;
    searchEngineCount: number;
    aiCrawlerCount: number;
    avgLatencyMs: number;
    crawlSuccessRate: string;
    disallowedBlocks: number;
  };
  botFrequencies: { name: string; count: number }[];
  crawlHistory7d: { day: string; google: number; bing: number; ai: number }[];
  topCrawledPaths: { path: string; hits: number; lastCrawled: string }[];
  recentLogs: BotLogEntry[];
}

interface TrafficTelemetryData {
  summary: {
    totalVisits: number;
    uniqueVisitors: number;
    avgSessionDuration: string;
    bounceRate: string;
    resumeDownloads: number;
  };
  dailyTraffic: { name: string; visits: number; unique: number }[];
  deviceData: { name: string; value: number; count: number; color: string }[];
  topPages: { path: string; views: number; bounceRate: string }[];
  recentVisits: {
    id: string;
    path: string;
    ip: string;
    deviceType: string;
    timestamp: string;
  }[];
}

const BOT_COLORS: { [key: string]: string } = {
  'Googlebot': '#4285F4',
  'Bingbot': '#008373',
  'GPTBot': '#10A37F',
  'ClaudeBot': '#D97706',
  'PerplexityBot': '#8B5CF6',
  'DuckDuckBot': '#DE5833',
  'Applebot': '#64748B',
  'Other Bots': '#94A3B8'
};

export default function AdminAnalyticsTab() {
  const [analyticsView, setAnalyticsView] = useState<'traffic' | 'bots'>('traffic');
  const [trafficData, setTrafficData] = useState<TrafficTelemetryData | null>(null);
  const [botData, setBotData] = useState<BotTelemetryData | null>(null);
  const [isLoadingTraffic, setIsLoadingTraffic] = useState(false);
  const [isLoadingBots, setIsLoadingBots] = useState(false);
  const [botFilter, setBotFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [simulatingBot, setSimulatingBot] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchTrafficTelemetry = () => {
    setIsLoadingTraffic(true);
    fetch('/api/admin/traffic-stats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTrafficData(data);
        }
      })
      .catch(err => console.error('Failed to load traffic telemetry:', err))
      .finally(() => setIsLoadingTraffic(false));
  };

  const fetchBotTelemetry = () => {
    setIsLoadingBots(true);
    fetch('/api/admin/bot-logs', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBotData(data);
        }
      })
      .catch(err => console.error('Failed to load bot telemetry:', err))
      .finally(() => setIsLoadingBots(false));
  };

  useEffect(() => {
    fetchTrafficTelemetry();
    fetchBotTelemetry();
  }, []);

  const handleSimulateCrawl = async (botName: string, path: string = '/sitemap.xml') => {
    setSimulatingBot(botName);
    try {
      const res = await fetch('/api/admin/bot-ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ botName, path, statusCode: 200 })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`✓ ${botName} crawl recorded on ${path}`);
        setTimeout(() => setToastMessage(null), 3500);
        fetchBotTelemetry();
      }
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setSimulatingBot(null);
    }
  };

  const filteredLogs = (botData?.recentLogs || []).filter(log => {
    const matchesBot = botFilter === 'all' || log.botName.toLowerCase() === botFilter.toLowerCase();
    const matchesSearch = !searchQuery || 
      log.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.botName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.includes(searchQuery);
    return matchesBot && matchesSearch;
  });

  const totalVisits = trafficData?.summary?.totalVisits || 0;
  const uniqueVisitors = trafficData?.summary?.uniqueVisitors || 0;
  const resumeDownloads = trafficData?.summary?.resumeDownloads || 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>Site Telemetry & Crawlers</span>
            {analyticsView === 'bots' && (
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200/60 rounded-full font-mono uppercase font-bold">
                Live Bot Telemetry
              </span>
            )}
            {analyticsView === 'traffic' && (
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full font-mono uppercase font-bold">
                Real Edge Telemetry
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {analyticsView === 'traffic' 
              ? 'Real-time recorded visitor telemetry, impressions, and engagement metrics.'
              : 'Search engine indexing probes, AI crawler activity, and technical crawl budgets.'}
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/70 self-start sm:self-auto">
          <button
            onClick={() => {
              setAnalyticsView('traffic');
              fetchTrafficTelemetry();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              analyticsView === 'traffic'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>Visitor Traffic</span>
          </button>
          <button
            onClick={() => {
              setAnalyticsView('bots');
              fetchBotTelemetry();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              analyticsView === 'bots'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-indigo-500" />
            <span>Bot & Crawlers</span>
            <span className="px-1.5 py-0.2 text-[9px] bg-indigo-50 text-indigo-700 font-mono rounded-full font-extrabold">
              SEO
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. REAL VISITOR TRAFFIC VIEW */}
      {/* ========================================================================= */}
      {analyticsView === 'traffic' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Active Status Banner */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Live Traffic Telemetry</div>
                <div className="text-[11px] text-slate-500">Real page impressions and visitor routes</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchTrafficTelemetry}
                disabled={isLoadingTraffic}
                className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTraffic ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/50 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 tracking-wide">
                  {uniqueVisitors > 0 ? `${uniqueVisitors} Unique Recorded` : 'Tracking Live'}
                </span>
              </div>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Page Impressions', value: totalVisits.toLocaleString(), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
              { label: 'Unique Visitors', value: uniqueVisitors.toLocaleString(), icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { label: 'Resume Print/Downloads', value: resumeDownloads.toLocaleString(), icon: Download, color: 'text-amber-500', bg: 'bg-amber-50' },
              { label: 'Avg Session Duration', value: trafficData?.summary?.avgSessionDuration || '0s', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            ].map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${metric.bg}`}>
                      <Icon className={`w-4 h-4 ${metric.color}`} />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-100">
                      Real Time
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-800 tracking-tight">{metric.value}</div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-1">{metric.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Traffic Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800">Traffic History (Last 7 Days)</h3>
                <p className="text-xs text-slate-500">Real recorded visits and unique visitor breakdown</p>
              </div>
              <div className="h-[250px] w-full">
                {trafficData?.dailyTraffic && trafficData.dailyTraffic.some(d => d.visits > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trafficData.dailyTraffic} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0084ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0084ff" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                      />
                      <Area type="monotone" dataKey="visits" name="Total Visits" stroke="#0084ff" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                      <Area type="monotone" dataKey="unique" name="Unique Visitors" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorUnique)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-xl">
                    <Activity className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-600">No Historical Visits Recorded Yet</span>
                    <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                      As visitors browse your live portfolio and technical articles, daily visit curves will render here automatically.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Devices Breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
              <div className="mb-2">
                <h3 className="text-sm font-bold text-slate-800">Sessions by Device</h3>
                <p className="text-xs text-slate-500">Real client user-agent distribution</p>
              </div>
              <div className="flex-1 min-h-[180px] w-full flex items-center justify-center relative">
                {trafficData?.deviceData && trafficData.deviceData.some(d => d.count > 0) ? (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={trafficData.deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                          stroke="none"
                        >
                          {trafficData.deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-800 tracking-tight">{totalVisits}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Visits</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 text-xs">
                    <Monitor className="w-8 h-8 text-slate-300 mb-1" />
                    <span>Awaiting Client Telemetry</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {(trafficData?.deviceData || [
                  { name: 'Desktop', value: 0, count: 0, color: '#0084ff' },
                  { name: 'Mobile', value: 0, count: 0, color: '#00c3ff' },
                  { name: 'Tablet', value: 0, count: 0, color: '#94a3b8' }
                ]).map((device, i) => (
                  <div key={i} className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: device.color }} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{device.name}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">{device.count} <span className="text-[10px] font-normal text-slate-400">({device.value}%)</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Pages Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Real Visited Pages</h3>
                <p className="text-xs text-slate-500">Live request counts per endpoint</p>
              </div>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-white text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold">Page Path</th>
                    <th className="px-6 py-4 font-semibold text-right">Recorded Views</th>
                    <th className="px-6 py-4 font-semibold text-right">Route Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {trafficData?.topPages && trafficData.topPages.length > 0 ? (
                    trafficData.topPages.map((page, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium text-blue-600 truncate max-w-[200px] sm:max-w-xs">{page.path}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-right font-black text-slate-800 tracking-tight">
                          {page.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex items-center justify-end">
                            <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${totalVisits > 0 ? Math.round((page.views / totalVisits) * 100) : 0}%` }} 
                              />
                            </div>
                            <span className="text-[11px] font-mono text-slate-500 ml-2">
                              {totalVisits > 0 ? `${Math.round((page.views / totalVisits) * 100)}%` : '0%'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-400 text-xs font-medium">
                        No individual page impressions recorded yet. Live telemetry is listening.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REAL BOT & CRAWLER ACTIVITY TELEMETRY VIEW */}
      {/* ========================================================================= */}
      {analyticsView === 'bots' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Action Bar / Simulation Controls */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm text-white">Search Engine & AI Crawler Monitor</span>
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-mono font-bold">
                  Active Edge Tracking
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Real-time tracking of Googlebot, Bingbot, GPTBot, ClaudeBot, and automated search engine scrapers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={fetchBotTelemetry}
                disabled={isLoadingBots}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBots ? 'animate-spin' : ''}`} />
                <span>Refresh Logs</span>
              </button>

              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-300 px-2">Simulate Crawl:</span>
                {['Googlebot', 'GPTBot', 'ClaudeBot', 'Bingbot'].map(bot => (
                  <button
                    key={bot}
                    onClick={() => handleSimulateCrawl(bot)}
                    disabled={Boolean(simulatingBot)}
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 text-indigo-300" />
                    <span>{bot}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bot Metric Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 text-left">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  Search Indexing
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {(botData?.summary?.searchEngineCount || 0).toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Search Engine Hits
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Googlebot, Bingbot & Applebot</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 text-left">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  AI Crawlers
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {(botData?.summary?.aiCrawlerCount || 0).toLocaleString()}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  AI LLM Scrapers
                </div>
                <div className="text-[10px] text-slate-400 mt-1">GPTBot, Claude, Perplexity</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 text-left">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Crawl Health
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {botData?.summary?.crawlSuccessRate || '100%'}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Crawl Success Rate
                </div>
                <div className="text-[10px] text-slate-400 mt-1">HTTP 200/304 successful responses</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2 text-left">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  Response Time
                </span>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800 tracking-tight">
                  {botData?.summary?.avgLatencyMs || 0} ms
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Avg Crawler Latency
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Real edge response speed</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-Day Crawl Activity */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Weekly Crawl Frequency</h3>
                  <p className="text-xs text-slate-500">Googlebot vs Bingbot vs AI LLM Scrapers (Last 7 days)</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Googlebot
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Bingbot
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> AI Bots
                  </span>
                </div>
              </div>

              <div className="h-[240px] w-full">
                {botData?.crawlHistory7d && botData.crawlHistory7d.some(d => d.google > 0 || d.bing > 0 || d.ai > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={botData.crawlHistory7d} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} dy={5} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                      />
                      <Bar dataKey="google" name="Googlebot" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="bing" name="Bingbot" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="ai" name="AI Scrapers" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-100 rounded-xl">
                    <Bot className="w-8 h-8 text-slate-300 mb-2" />
                    <span className="text-xs font-bold text-slate-600">No Crawler Logs Recorded Yet</span>
                    <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                      Click the "Simulate Crawl" buttons above or submit your sitemap to Google Search Console to record live crawlers.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Crawled Endpoints & Config Links */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800">Top Crawled Endpoints</h3>
                  <Terminal className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-2.5">
                  {botData?.topCrawledPaths && botData.topCrawledPaths.length > 0 ? (
                    botData.topCrawledPaths.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="truncate max-w-[160px]">
                          <span className="text-xs font-mono font-bold text-slate-800">{item.path}</span>
                          <div className="text-[10px] text-slate-400">{item.lastCrawled}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 font-mono">{item.hits}</span>
                          <div className="text-[9px] text-slate-500 uppercase font-semibold">hits</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      No crawler path hits yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Crawl Configuration Test Links */}
              <div className="pt-4 border-t border-slate-100 mt-4 grid grid-cols-2 gap-2">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-bold text-slate-700 transition-all"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>/sitemap.xml</span>
                </a>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-bold text-slate-700 transition-all"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  <span>/robots.txt</span>
                </a>
              </div>
            </div>
          </div>

          {/* Real-Time Bot Logs Table with Filter */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Live Crawl Log Stream</h3>
                <p className="text-xs text-slate-500">Real-time HTTP requests from bots with status codes & latencies</p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter path, bot, or IP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
                  />
                </div>

                <select
                  value={botFilter}
                  onChange={(e) => setBotFilter(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Spiders</option>
                  <option value="googlebot">Googlebot</option>
                  <option value="bingbot">Bingbot</option>
                  <option value="gptbot">GPTBot (OpenAI)</option>
                  <option value="claudebot">ClaudeBot (Anthropic)</option>
                  <option value="perplexitybot">PerplexityBot</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white text-slate-500 font-mono text-[10px] uppercase tracking-widest border-b border-slate-100">
                    <th className="px-5 py-3 font-semibold">Bot / Agent</th>
                    <th className="px-5 py-3 font-semibold">Category</th>
                    <th className="px-5 py-3 font-semibold">Target Path</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Latency</th>
                    <th className="px-5 py-3 font-semibold">Origin IP</th>
                    <th className="px-5 py-3 font-semibold text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => {
                      const isError = log.statusCode >= 400;
                      return (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-3 font-sans font-bold text-slate-900 flex items-center gap-1.5">
                            <span 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: BOT_COLORS[log.botName] || '#64748b' }} 
                            />
                            <span>{log.botName}</span>
                          </td>
                          <td className="px-5 py-3 font-sans">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                              log.botCategory === 'search_engine' 
                                ? 'bg-blue-50 text-blue-700' 
                                : log.botCategory === 'ai_crawler'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {log.botCategory.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-bold text-blue-600">{log.path}</td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {log.statusCode} {log.statusCode === 200 ? 'OK' : log.statusCode === 403 ? 'FORBIDDEN' : ''}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-500">{log.responseTimeMs}ms</td>
                          <td className="px-5 py-3 text-slate-400">{log.ip}</td>
                          <td className="px-5 py-3 text-right text-slate-400 font-sans text-[11px]">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-slate-400 font-sans text-xs">
                        No crawler logs matching current filter. Use "Simulate Crawl" above to trigger tests.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
