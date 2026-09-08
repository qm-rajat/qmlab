import React, { useState, useMemo } from 'react';
import {
  Bot,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  CheckCircle2,
  Cpu,
  Boxes,
  Code,
  Sparkles,
  ArrowRight,
  FolderGit2,
  BookOpen,
  Award,
  Briefcase,
  Sliders,
  Search,
  Zap,
  Play,
  FileJson,
  Layers,
  Activity
} from 'lucide-react';
import { SiteSettings, Project, Blog, Certificate } from '../../types';

interface AdminAiTabProps {
  settings: SiteSettings;
  projects: Project[];
  blogs: Blog[];
  certificates: Certificate[];
  onRefreshAll?: () => void;
}

type ClientTab = 'chatgpt' | 'claude' | 'cursor' | 'generic';
type ToolCategory = 'All' | 'Overview' | 'Projects' | 'Blogs' | 'Credentials' | 'Resume' | 'Settings';

export const AdminAiTab: React.FC<AdminAiTabProps> = ({
  projects,
  blogs,
  certificates,
  onRefreshAll
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeClientTab, setActiveClientTab] = useState<ClientTab>('chatgpt');
  const [toolSearchQuery, setToolSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('All');

  // MCP Test Console State
  const [selectedMcpMethod, setSelectedMcpMethod] = useState<'initialize' | 'tools/list' | 'tools/call' | 'ping'>('tools/list');
  const [selectedTool, setSelectedTool] = useState<string>('get_portfolio_overview');
  const [testToolArgs, setTestToolArgs] = useState<string>('{}');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [testLatency, setTestLatency] = useState<number | null>(null);
  const [testStatus, setTestStatus] = useState<number | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const mcpUrl = `${baseUrl}/api/mcp`;
  const sseUrl = `${baseUrl}/api/sse`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const sampleClaudeMcpJson = `{
  "mcpServers": {
    "rajat-portfolio": {
      "url": "${mcpUrl}"
    }
  }
}`;

  const sampleCursorMcpJson = `{
  "mcp": {
    "servers": {
      "rajat-portfolio": {
        "url": "${mcpUrl}"
      }
    }
  }
}`;

  const sampleGenericJson = `{
  "name": "rajat-portfolio-mcp",
  "type": "http",
  "url": "${mcpUrl}",
  "sseUrl": "${sseUrl}",
  "authentication": "none"
}`;

  // MCP Tool Definitions
  const mcpToolsList = useMemo(() => [
    {
      name: 'get_portfolio_overview',
      icon: Boxes,
      category: 'Overview' as ToolCategory,
      desc: 'Retrieves high-level summary, counts of projects, blogs, credentials, and profile bio.',
      sampleArgs: '{}',
      readOnly: true,
    },
    {
      name: 'list_projects',
      icon: FolderGit2,
      category: 'Projects' as ToolCategory,
      desc: 'List portfolio projects with optional category filter or keyword search query.',
      sampleArgs: JSON.stringify({ category: 'machine-learning' }, null, 2),
      readOnly: true,
    },
    {
      name: 'create_project',
      icon: FolderGit2,
      category: 'Projects' as ToolCategory,
      desc: 'Creates and publishes a new project case study with tech stack and live links.',
      sampleArgs: JSON.stringify(
        {
          title: 'AI Workflow Automation Engine',
          description: 'Scalable LLM routing and agent orchestration pipeline.',
          category: 'product-management',
          technologies: ['Claude', 'MCP', 'Node.js', 'React'],
          live_url: 'https://example.com'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_project',
      icon: FolderGit2,
      category: 'Projects' as ToolCategory,
      desc: 'Edits title, description, technologies, metrics, or links on an existing project.',
      sampleArgs: JSON.stringify(
        {
          id: projects[0]?.id || 'proj_2',
          title: projects[0] ? `${projects[0].title} (Updated via MCP)` : 'Updated Title',
          description: 'Refined case study overview via Model Context Protocol.'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'delete_project',
      icon: FolderGit2,
      category: 'Projects' as ToolCategory,
      desc: 'Deletes a project by ID or slug from the portfolio.',
      sampleArgs: JSON.stringify({ id: projects[0]?.id || 'proj_2' }, null, 2),
      readOnly: false,
    },
    {
      name: 'list_blogs',
      icon: BookOpen,
      category: 'Blogs' as ToolCategory,
      desc: 'Lists technical blogs with optional status (published/draft) or tag filters.',
      sampleArgs: JSON.stringify({ status: 'published' }, null, 2),
      readOnly: true,
    },
    {
      name: 'create_blog',
      icon: BookOpen,
      category: 'Blogs' as ToolCategory,
      desc: 'Drafts or publishes a new technical blog post with full HTML/Markdown.',
      sampleArgs: JSON.stringify(
        {
          title: 'Building Reliable MCP Servers for AI Agents',
          content_html: '<p>A deep dive into JSON-RPC 2.0 protocol design and autonomous tooling.</p>',
          tags: ['MCP', 'AI Agents', 'Claude'],
          status: 'published'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_blog',
      icon: BookOpen,
      category: 'Blogs' as ToolCategory,
      desc: 'Edits the content, status, tags, excerpt, or title of an existing blog article.',
      sampleArgs: JSON.stringify(
        {
          id: blogs[0]?.id || 'blog_5',
          title: blogs[0] ? `${blogs[0].title} (Refreshed)` : 'Updated Article Title',
          status: 'published'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'delete_blog',
      icon: BookOpen,
      category: 'Blogs' as ToolCategory,
      desc: 'Removes a blog post by ID from the CMS.',
      sampleArgs: JSON.stringify({ id: blogs[0]?.id || 'blog_5' }, null, 2),
      readOnly: false,
    },
    {
      name: 'list_certificates',
      icon: Award,
      category: 'Credentials' as ToolCategory,
      desc: 'Lists all verified certifications, credential IDs, and issuing organizations.',
      sampleArgs: '{}',
      readOnly: true,
    },
    {
      name: 'create_certificate',
      icon: Award,
      category: 'Credentials' as ToolCategory,
      desc: 'Adds a verified certification with issuing authority and verification URL.',
      sampleArgs: JSON.stringify(
        {
          title: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services',
          issue_date: 'August/2024',
          skills: ['Cloud Architecture', 'AWS', 'Serverless', 'Security']
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_certificate',
      icon: Award,
      category: 'Credentials' as ToolCategory,
      desc: 'Edits issue date, credential ID, verification URL, or title of a certificate.',
      sampleArgs: JSON.stringify(
        {
          id: certificates[0]?.id || 'cert_3',
          title: certificates[0] ? `${certificates[0].title} (Verified)` : 'Updated Certificate'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'delete_certificate',
      icon: Award,
      category: 'Credentials' as ToolCategory,
      desc: 'Deletes a certificate record by ID or title.',
      sampleArgs: JSON.stringify({ id: certificates[0]?.id || 'cert_3' }, null, 2),
      readOnly: false,
    },
    {
      name: 'get_resume',
      icon: Briefcase,
      category: 'Resume' as ToolCategory,
      desc: 'Fetches work experience history, MBA education items, and skill taxonomies.',
      sampleArgs: '{}',
      readOnly: true,
    },
    {
      name: 'add_work_experience',
      icon: Briefcase,
      category: 'Resume' as ToolCategory,
      desc: 'Adds a new professional employment record to the interactive resume.',
      sampleArgs: JSON.stringify(
        {
          company: 'QM Labs Consulting',
          role: 'Lead Product Engineer',
          start_date: '2025-01-01',
          is_current: true,
          description: 'Orchestrating autonomous AI workflows and full-stack client platforms.',
          location: 'New Delhi, India'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_work_experience',
      icon: Briefcase,
      category: 'Resume' as ToolCategory,
      desc: 'Updates company, role, responsibilities, or dates of a work experience item.',
      sampleArgs: JSON.stringify(
        {
          identifier: 'QM Labs',
          role: 'Technical Product Lead & AI Specialist'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'add_education',
      icon: Briefcase,
      category: 'Resume' as ToolCategory,
      desc: 'Adds university degree / MBA education record to the resume.',
      sampleArgs: JSON.stringify(
        {
          institution: 'Institute of Management Studies',
          degree: 'Master of Business Administration',
          field: 'Product Management & Analytics',
          start_year: 2024,
          end_year: 2026,
          grade: 'Distinction'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_education',
      icon: Briefcase,
      category: 'Resume' as ToolCategory,
      desc: 'Updates degree, institution, field of study, or years of an education item.',
      sampleArgs: JSON.stringify(
        {
          identifier: 'B.Tech',
          grade: '9.1 CGPA'
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_skills',
      icon: Cpu,
      category: 'Resume' as ToolCategory,
      desc: 'Updates or replaces technical skills categories and skill pills.',
      sampleArgs: JSON.stringify(
        {
          skills: [
            {
              category: 'AI & Automation',
              items: ['Model Context Protocol (MCP)', 'Claude API', 'LLM Agents', 'LangChain', 'Prompt Engineering']
            }
          ]
        },
        null,
        2
      ),
      readOnly: false,
    },
    {
      name: 'update_site_settings',
      icon: Sliders,
      category: 'Settings' as ToolCategory,
      desc: 'Updates hero taglines, bio paragraphs, contact details, and SEO metadata.',
      sampleArgs: JSON.stringify(
        {
          hero_tagline: 'Technical Product Manager & AI Systems Engineer',
          hero_bio: 'Building intelligent digital products with full Model Context Protocol automation.'
        },
        null,
        2
      ),
      readOnly: false,
    },
  ], [projects, blogs, certificates]);

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return mcpToolsList.filter(tool => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(toolSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [mcpToolsList, selectedCategory, toolSearchQuery]);

  // Run Test MCP JSON-RPC 2.0 Request
  const handleRunMcpTest = async (overrideMethod?: typeof selectedMcpMethod, overrideTool?: string, overrideArgs?: string) => {
    setTestLoading(true);
    setTestResponse(null);
    setTestLatency(null);
    setTestStatus(null);

    const methodToRun = overrideMethod || selectedMcpMethod;
    const toolToRun = overrideTool || selectedTool;
    const argsToRun = overrideArgs || testToolArgs;

    const startTime = performance.now();

    try {
      let rpcBody: any = {
        jsonrpc: '2.0',
        id: `mcp_${Date.now()}`
      };

      if (methodToRun === 'initialize') {
        rpcBody.method = 'initialize';
        rpcBody.params = {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          clientInfo: { name: 'AdminMcpConsole', version: '1.0.0' }
        };
      } else if (methodToRun === 'ping') {
        rpcBody.method = 'ping';
        rpcBody.params = {};
      } else if (methodToRun === 'tools/list') {
        rpcBody.method = 'tools/list';
        rpcBody.params = {};
      } else {
        rpcBody.method = 'tools/call';
        rpcBody.params = {
          name: toolToRun,
          arguments: JSON.parse(argsToRun || '{}')
        };
      }

      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rpcBody)
      });

      const latency = Math.round(performance.now() - startTime);
      setTestLatency(latency);
      setTestStatus(res.status);

      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));

      if (
        onRefreshAll &&
        methodToRun === 'tools/call' &&
        (toolToRun.startsWith('create_') ||
          toolToRun.startsWith('update_') ||
          toolToRun.startsWith('edit_') ||
          toolToRun.startsWith('delete_') ||
          toolToRun.startsWith('add_'))
      ) {
        onRefreshAll();
      }
    } catch (err: any) {
      const latency = Math.round(performance.now() - startTime);
      setTestLatency(latency);
      setTestStatus(500);
      setTestResponse(JSON.stringify({ error: err.message || 'MCP JSON-RPC request failed' }, null, 2));
    } finally {
      setTestLoading(false);
    }
  };

  const handleSelectToolForTest = (tool: typeof mcpToolsList[0]) => {
    setSelectedMcpMethod('tools/call');
    setSelectedTool(tool.name);
    setTestToolArgs(tool.sampleArgs);

    // Scroll to simulator smoothly
    const element = document.getElementById('mcp-live-simulator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(testToolArgs);
      setTestToolArgs(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // ignore invalid json formatting
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* EXECUTIVE HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800/90 shadow-lg">
        {/* Subtle glowing ambient accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/3"></div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          {/* Top row: Badges and Live Server Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                MCP Engine Online
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold font-mono">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                JSON-RPC 2.0
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold font-mono">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                SSE Streamable
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span>Model Context Protocol Standard v2024-11-05</span>
            </div>
          </div>

          {/* Main Content & Action Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shadow-inner">
                  <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <span>Model Context Protocol (MCP) Hub</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Direct neural gateway exposing your verified portfolio, case studies, technical blogs, and interactive resume to <strong className="text-white">ChatGPT</strong>, <strong className="text-white">Claude</strong>, and <strong className="text-white">Cursor IDE</strong> agents.
              </p>
            </div>

            {/* Quick URL & Copy Box */}
            <div className="lg:col-span-5 flex flex-col gap-3 justify-center lg:items-end">
              <div className="w-full max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-inner space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-medium">
                  <span>Server Ingress Endpoint</span>
                  <span className="text-emerald-400 font-mono">GET / POST</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/90">
                  <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-200 truncate flex-1">{mcpUrl}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(mcpUrl, 'mcp_server_url')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs shrink-0"
                  >
                    {copiedField === 'mcp_server_url' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'mcp_server_url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono leading-none">{mcpToolsList.length}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">Callable Tools</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono leading-none">{projects.length}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">Live Projects</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono leading-none">{blogs.length}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">Blog Articles</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-bold text-white font-mono leading-none">{certificates.length}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">Credentials</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CLIENT CONNECTIONS SUITE */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-600" />
              Client Integration Quickstart
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your AI client to view one-click setup instructions and configuration manifests
            </p>
          </div>

          {/* Client selector tabs */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl gap-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'chatgpt' as ClientTab, label: 'ChatGPT', icon: Bot },
              { id: 'claude' as ClientTab, label: 'Claude Desktop', icon: Sparkles },
              { id: 'cursor' as ClientTab, label: 'Cursor IDE', icon: Code },
              { id: 'generic' as ClientTab, label: 'Generic / SSE', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeClientTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveClientTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: OpenAI ChatGPT Custom Connector */}
        {activeClientTab === 'chatgpt' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ChatGPT Custom Connector Mode
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  OpenAI supports direct HTTP JSON-RPC 2.0 and SSE endpoints with automatic tool schema discovery.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs mb-1">Step-by-Step Setup:</h4>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-700">
                  <li>In ChatGPT, open <strong>Settings &rarr; Connectors</strong></li>
                  <li>Click <strong>Create Connector</strong></li>
                  <li>Set Connection type to <strong>Server URL</strong></li>
                  <li>Paste the Server URL provided on the right</li>
                  <li>Set Authentication to <strong>No Auth</strong></li>
                  <li>Click <strong>Save & Test</strong></li>
                </ol>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">ChatGPT Server Parameters</span>
                  <button
                    onClick={() => handleCopy(mcpUrl, 'chatgpt_url')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copiedField === 'chatgpt_url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'chatgpt_url' ? 'Copied' : 'Copy URL'}
                  </button>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800 gap-2">
                    <span className="text-slate-400">Server URL:</span>
                    <span className="text-emerald-300 font-bold break-all">{mcpUrl}</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Authentication:</span>
                    <span className="text-indigo-300 font-bold">No Auth (Anonymous)</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Protocol Support:</span>
                    <span className="text-slate-300">HTTP POST (JSON-RPC 2.0) + SSE</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/70 text-xs text-indigo-950 space-y-1">
                <div className="font-bold flex items-center gap-2 text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Try Prompting in ChatGPT:
                </div>
                <p className="text-slate-700 italic">
                  &ldquo;Inspect my portfolio using the <code>get_portfolio_overview</code> tool and show me a breakdown of all published projects.&rdquo;
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Claude Desktop Config */}
        {activeClientTab === 'claude' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  Claude Desktop Configuration
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Add this configuration snippet to your Claude Desktop config JSON to enable native tools in Claude.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs mb-1">Config File Location:</h4>
                <ul className="space-y-1 text-slate-700">
                  <li><strong>macOS:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
                  <li className="pt-1"><strong>Windows:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">%APPDATA%\Claude\claude_desktop_config.json</code></li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">claude_desktop_config.json</span>
                  <button
                    onClick={() => handleCopy(sampleClaudeMcpJson, 'claude_json')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copiedField === 'claude_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'claude_json' ? 'Copied' : 'Copy Manifest'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-amber-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  {sampleClaudeMcpJson}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Cursor IDE Config */}
        {activeClientTab === 'cursor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100/80 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <Code className="w-4 h-4 text-indigo-600 shrink-0" />
                  Cursor IDE & VS Code Extensions
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect Cursor Composer, Windsurf, or Cline directly to the MCP server.
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-xs mb-1">Quick Setup:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                  <li>Open <strong>Cursor Settings &rarr; Features &rarr; MCP</strong></li>
                  <li>Click <strong>+ Add New MCP Server</strong></li>
                  <li>Name: <code>rajat-portfolio</code></li>
                  <li>Type: <code>sse</code> or <code>http</code></li>
                  <li>URL: <code>{mcpUrl}</code></li>
                </ol>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">settings.json (MCP Configuration)</span>
                  <button
                    onClick={() => handleCopy(sampleCursorMcpJson, 'cursor_json')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copiedField === 'cursor_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'cursor_json' ? 'Copied' : 'Copy Manifest'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-indigo-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  {sampleCursorMcpJson}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Generic / SSE Transport */}
        {activeClientTab === 'generic' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-3">
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Terminal className="w-4 h-4 text-slate-700 shrink-0" />
                  Direct Transport Endpoints
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Both Streamable HTTP JSON-RPC 2.0 (POST) and Server-Sent Events (GET) are available on root and API namespaces.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Generic MCP Manifest</span>
                  <button
                    onClick={() => handleCopy(sampleGenericJson, 'generic_json')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    {copiedField === 'generic_json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedField === 'generic_json' ? 'Copied' : 'Copy Manifest'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  {sampleGenericJson}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LIVE IN-BROWSER MCP PROTOCOL SIMULATOR */}
      <div id="mcp-live-simulator" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Live MCP Protocol Simulator</h3>
              <p className="text-xs text-slate-500">
                Execute and inspect live JSON-RPC 2.0 requests in real-time
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setSelectedMcpMethod('initialize');
                handleRunMcpTest('initialize');
              }}
              disabled={testLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Initialize</span>
            </button>
            <button
              onClick={() => {
                setSelectedMcpMethod('tools/list');
                handleRunMcpTest('tools/list');
              }}
              disabled={testLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <Boxes className="w-3.5 h-3.5 text-indigo-500" />
              <span>tools/list</span>
            </button>
            <button
              onClick={() => {
                setSelectedMcpMethod('tools/call');
                setSelectedTool('get_portfolio_overview');
                setTestToolArgs('{}');
                handleRunMcpTest('tools/call', 'get_portfolio_overview', '{}');
              }}
              disabled={testLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Overview</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">JSON-RPC Method</label>
              <select
                value={selectedMcpMethod}
                onChange={(e) => {
                  const m = e.target.value as any;
                  setSelectedMcpMethod(m);
                  if (m === 'tools/call') {
                    const tool = mcpToolsList.find(t => t.name === selectedTool);
                    if (tool) setTestToolArgs(tool.sampleArgs);
                  }
                }}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 font-medium"
              >
                <option value="initialize">initialize (Protocol handshake)</option>
                <option value="tools/list">tools/list (Discover registered tools)</option>
                <option value="tools/call">tools/call (Execute tool function)</option>
                <option value="ping">ping (Connection heartbeat)</option>
              </select>
            </div>

            {selectedMcpMethod === 'tools/call' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select MCP Tool</label>
                <select
                  value={selectedTool}
                  onChange={(e) => {
                    const newToolName = e.target.value;
                    setSelectedTool(newToolName);
                    const found = mcpToolsList.find(t => t.name === newToolName);
                    if (found) {
                      setTestToolArgs(found.sampleArgs);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 font-mono"
                >
                  {mcpToolsList.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedMcpMethod === 'tools/call' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Tool Arguments (JSON)</label>
                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer flex items-center gap-1"
                  >
                    <FileJson className="w-3 h-3" />
                    Format JSON
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={testToolArgs}
                  onChange={(e) => setTestToolArgs(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-300 border border-slate-800 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-y"
                  placeholder="{}"
                />
              </div>
            )}

            <button
              onClick={() => handleRunMcpTest()}
              disabled={testLoading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-50 cursor-pointer active:scale-98"
            >
              {testLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing JSON-RPC 2.0...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Send JSON-RPC Payload</span>
                </>
              )}
            </button>
          </div>

          {/* Response Console Column */}
          <div className="lg:col-span-7 space-y-2 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Response Payload</span>
                {testStatus && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    testStatus >= 200 && testStatus < 300
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    HTTP {testStatus}
                  </span>
                )}
                {testLatency !== null && (
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {testLatency} ms
                  </span>
                )}
              </div>

              {testResponse && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(testResponse, 'test_response')}
                    className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    {copiedField === 'test_response' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedField === 'test_response' ? 'Copied' : 'Copy'}
                  </button>
                  <span className="text-slate-300">&bull;</span>
                  <button
                    onClick={() => setTestResponse(null)}
                    className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[220px] max-h-[380px] overflow-auto">
              {testResponse ? (
                <pre className="text-xs font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap break-all">
                  {testResponse}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-12 space-y-2">
                  <Terminal className="w-8 h-8 text-slate-700" />
                  <p>Send a request or click a quick action above to view server response</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* REGISTERED MCP TOOLS DIRECTORY */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">Registered MCP Tools</h3>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  {mcpToolsList.length} Active Tools
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any tool to pre-fill parameters and execute in the Live Protocol Simulator
              </p>
            </div>
          </div>

          {/* Search and Category Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tools or keywords..."
                value={toolSearchQuery}
                onChange={(e) => setToolSearchQuery(e.target.value)}
                className="w-full sm:w-60 pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(['All', 'Overview', 'Projects', 'Blogs', 'Credentials', 'Resume', 'Settings'] as ToolCategory[]).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            const isCurrentInConsole = selectedTool === tool.name && selectedMcpMethod === 'tools/call';

            return (
              <div
                key={tool.name}
                onClick={() => handleSelectToolForTest(tool)}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                  isCurrentInConsole
                    ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-200/50 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/70 hover:bg-white hover:border-indigo-200 hover:shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50/80 px-2.5 py-0.5 rounded-md">
                      {tool.category}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      tool.readOnly ? 'bg-slate-100 text-slate-600' : 'bg-amber-100/70 text-amber-800'
                    }`}>
                      {tool.readOnly ? 'Read-Only' : 'Read / Write'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <div className="p-2 rounded-xl bg-white border border-slate-200/80 text-slate-700 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-mono text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Try in Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAiTab;
