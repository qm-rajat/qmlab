export interface BotLogEntry {
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

// Store for real bot crawl requests
const recordedLogs: BotLogEntry[] = [];

export function identifyBot(userAgent: string): { botName: string; botCategory: 'search_engine' | 'ai_crawler' | 'social_bot' } | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();

  if (ua.includes('googlebot')) return { botName: 'Googlebot', botCategory: 'search_engine' };
  if (ua.includes('google-extended')) return { botName: 'Google-Extended', botCategory: 'ai_crawler' };
  if (ua.includes('bingbot')) return { botName: 'Bingbot', botCategory: 'search_engine' };
  if (ua.includes('gptbot')) return { botName: 'GPTBot', botCategory: 'ai_crawler' };
  if (ua.includes('chatgpt-user')) return { botName: 'ChatGPT-User', botCategory: 'ai_crawler' };
  if (ua.includes('claudebot')) return { botName: 'ClaudeBot', botCategory: 'ai_crawler' };
  if (ua.includes('perplexitybot')) return { botName: 'PerplexityBot', botCategory: 'ai_crawler' };
  if (ua.includes('duckduckbot')) return { botName: 'DuckDuckBot', botCategory: 'search_engine' };
  if (ua.includes('applebot')) return { botName: 'Applebot', botCategory: 'search_engine' };
  if (ua.includes('yandexbot') || ua.includes('yandex')) return { botName: 'YandexBot', botCategory: 'search_engine' };
  if (ua.includes('baiduspider')) return { botName: 'Baiduspider', botCategory: 'search_engine' };
  if (ua.includes('twitterbot')) return { botName: 'TwitterBot', botCategory: 'social_bot' };
  if (ua.includes('facebookexternalhit')) return { botName: 'Meta-Crawler', botCategory: 'social_bot' };
  if (ua.includes('linkedinbot')) return { botName: 'LinkedInBot', botCategory: 'social_bot' };

  return null;
}

export function recordBotCrawl(
  userAgent: string,
  path: string,
  method: string = 'GET',
  statusCode: number = 200,
  ip: string = '127.0.0.1',
  responseTimeMs: number = 25
) {
  const botInfo = identifyBot(userAgent);
  if (!botInfo) return;

  const newEntry: BotLogEntry = {
    id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    botName: botInfo.botName,
    botCategory: botInfo.botCategory,
    userAgent,
    path,
    method,
    statusCode,
    ip: ip.replace(/^.*:/, '') || '127.0.0.1',
    responseTimeMs: Math.max(5, Math.round(responseTimeMs)),
    timestamp: new Date().toISOString()
  };

  recordedLogs.unshift(newEntry);
  if (recordedLogs.length > 500) {
    recordedLogs.pop();
  }
}

export function getBotTelemetry() {
  const totalCrawls = recordedLogs.length;
  const searchEngineCount = recordedLogs.filter(l => l.botCategory === 'search_engine').length;
  const aiCrawlerCount = recordedLogs.filter(l => l.botCategory === 'ai_crawler').length;
  const successfulCrawls = recordedLogs.filter(l => l.statusCode >= 200 && l.statusCode < 400).length;
  const successRate = totalCrawls > 0 ? `${Math.round((successfulCrawls / totalCrawls) * 100)}%` : '100%';

  const avgLatencyMs = totalCrawls > 0 
    ? Math.round(recordedLogs.reduce((sum, l) => sum + l.responseTimeMs, 0) / totalCrawls)
    : 0;

  // Bot frequencies calculated from real logs
  const botFrequencies: { [name: string]: number } = {};
  recordedLogs.forEach(log => {
    botFrequencies[log.botName] = (botFrequencies[log.botName] || 0) + 1;
  });

  // Top crawled paths from real logs
  const pathHits: { [path: string]: { hits: number; lastTime: string } } = {};
  recordedLogs.forEach(log => {
    if (!pathHits[log.path]) {
      pathHits[log.path] = { hits: 0, lastTime: log.timestamp };
    }
    pathHits[log.path].hits += 1;
  });

  const topCrawledPaths = Object.entries(pathHits)
    .map(([path, data]) => ({
      path,
      hits: data.hits,
      lastCrawled: formatTimeAgo(data.lastTime)
    }))
    .sort((a, b) => b.hits - a.hits);

  // Group 7-day crawl history from real logs
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayMap: { [day: string]: { google: number; bing: number; ai: number } } = {};
  
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayName = dayNames[d.getDay()];
    last7Days.push(dayName);
    dayMap[dayName] = { google: 0, bing: 0, ai: 0 };
  }

  recordedLogs.forEach(log => {
    const d = new Date(log.timestamp);
    const dayName = dayNames[d.getDay()];
    if (dayMap[dayName]) {
      if (log.botName === 'Googlebot') dayMap[dayName].google += 1;
      else if (log.botName === 'Bingbot') dayMap[dayName].bing += 1;
      else if (log.botCategory === 'ai_crawler') dayMap[dayName].ai += 1;
    }
  });

  const crawlHistory7d = last7Days.map(day => ({
    day,
    google: dayMap[day]?.google || 0,
    bing: dayMap[day]?.bing || 0,
    ai: dayMap[day]?.ai || 0
  }));

  return {
    summary: {
      totalCrawls,
      searchEngineCount,
      aiCrawlerCount,
      avgLatencyMs,
      crawlSuccessRate: successRate,
      disallowedBlocks: recordedLogs.filter(l => l.statusCode === 403 || l.statusCode === 401).length,
    },
    botFrequencies: Object.entries(botFrequencies).map(([name, count]) => ({ name, count })),
    crawlHistory7d,
    topCrawledPaths,
    recentLogs: recordedLogs.slice(0, 50)
  };
}

function formatTimeAgo(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
