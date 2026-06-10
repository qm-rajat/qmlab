import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, Heading3, Code, Quote,
  Type, Eraser, Check, Eye, Code2, AlertCircle, FileText, Sparkles,
  ChevronDown, RotateCcw
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const TEMPLATES = [
  {
    name: "Full-Stack Developer Specialization",
    icon: Sparkles,
    content: `<h3><strong>Rajat Kumar Dash — Full-Stack Developer & Multi-Disciplinary Engineer</strong></h3>
<p>I am a highly analytical software engineer specializing in building robust, performant web architectures. With intermediate-to-advanced expertise in React, TypeScript, Python, and SQL, I design reliable front-end systems paired with secure server infrastructures.</p>
<ul>
  <li><strong>Front-End Engineering:</strong> Clean, component-driven UI with state management (React Hooks, Context, Motion layout transitions).</li>
  <li><strong>Server-Side & Databases:</strong> Express.js APIs, GraphQL endpoints, and optimized PostgreSQL schema logic.</li>
  <li><strong>Modern Practices:</strong> Monorepo setups, strict TypeScript compliance, and native performance tuning.</li>
</ul>
<p>My continuous focus is delivering stable, scalable code that optimizes customer retention and developer velocity.</p>`
  },
  {
    name: "Technical SEO & Analytics Executive",
    icon: FileText,
    content: `<h3><strong>Technical SEO & Web Analyst Specialist</strong></h3>
<p>I leverage my deep engineering background to bridge the gap between content marketing and web machinery. I specialize in maximizing search engine visibility through algorithmic auditing, content structure, and core system speed-ups.</p>
<ul>
  <li><strong>Auditing Core Web Vitals:</strong> Substantial improvements in Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS).</li>
  <li><strong>Crawl & Protocol Security:</strong> Sitemaps configuration, robots.txt routing, HTTPS/TLS compliance, and structural JSON-LD schema generation.</li>
  <li><strong>Advanced Web Analytics:</strong> Google Analytics 4 (GA4) custom event tracking, Google Tag Manager deployment, and conversion rate optimization (CRO).</li>
</ul>
<p>Driven by metrics, I have a proven track record of boosting organic acquisitions while scaling infrastructure integrity.</p>`
  },
  {
    name: "Automation QA & Security Focus",
    icon: Code,
    content: `<h3><strong>QA Automation Engineer & Penetration Security Auditor</strong></h3>
<p>Analytical developer passionate about software testability, threat modeling, and secure system provisioning. I design automated pipelines that validate functional integrity and scan for latent security vulnerability vectors.</p>
<ol>
  <li><strong>E2E Automation Testing:</strong> Selenium WebDriver suites and PyTest test classes under strict Page Object Model (POM) standards.</li>
  <li><strong>Security Verification:</strong> Port scans, packet analysis with Wireshark, state inspections via Burp Suite, and active mitigation workflows on Linux/Parrot OS formats.</li>
  <li><strong>Continuous Integration:</strong> Jenkins, GitHub Actions pipelines, and local Docker testing rigs.</li>
</ol>
<p>I build robust digital defenses, ensuring that software is both functional and resilient under extreme conditions.</p>`
  }
];

export default function RichTextEditor({ value, onChange, placeholder = "Write biography outlines..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);
  const [internalChange, setInternalChange] = useState(false);

  // Sync state changes from outside safely
  useEffect(() => {
    if (!internalChange) {
      setHtmlValue(value);
      if (editorRef.current && editorMode === 'visual') {
        editorRef.current.innerHTML = value || `<p><br></p>`;
      }
    }
    setInternalChange(false);
  }, [value, editorMode]);

  // Initial load
  useEffect(() => {
    if (editorRef.current && editorMode === 'visual' && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || `<p><br></p>`;
    }
  }, []);

  // Update logic from editing DIV
  const handleContentChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlValue(html);
      setInternalChange(true);
      onChange(html);
    }
  };

  // Helper method to apply WYSIWYG commands
  const executeCommand = (command: string, arg: string = '') => {
    if (editorMode !== 'visual') return;
    
    // Focus first
    editorRef.current?.focus();
    
    // Execute
    document.execCommand(command, false, arg);
    
    // Trigger update
    handleContentChange();
  };

  // Text colors list
  const textColors = [
    { name: 'Default Charcoal', value: '#1e293b' },
    { name: 'RQM Labs Blue', value: '#0084ff' },
    { name: 'Executive Indigo', value: '#4f46e5' },
    { name: 'Eco Emerald', value: '#10b981' },
    { name: 'Vibrant Amber', value: '#d97706' },
    { name: 'Classic Slate', value: '#475569' }
  ];

  const applyColor = (color: string) => {
    executeCommand('foreColor', color);
    setShowColorDropdown(false);
  };

  // Switch modes handler
  const toggleEditorMode = (mode: 'visual' | 'html') => {
    if (mode === 'visual' && editorMode === 'html') {
      // Html textarea -> Visual editor sync
      setEditorMode('visual');
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlValue || `<p><br></p>`;
        }
      }, 50);
    } else if (mode === 'html' && editorMode === 'visual') {
      // Visual -> Html textarea sync
      if (editorRef.current) {
        setHtmlValue(editorRef.current.innerHTML);
      }
      setEditorMode('html');
    }
  };

  // Clear formats
  const handleClearFormat = () => {
    if (editorMode !== 'visual') return;
    executeCommand('removeFormat');
  };

  // Template Loader
  const loadTemplate = (contentHTML: string) => {
    if (window.confirm("Loading this template will replace your current Detailed About text. Proceed?")) {
      setHtmlValue(contentHTML);
      onChange(contentHTML);
      if (editorMode === 'visual' && editorRef.current) {
        editorRef.current.innerHTML = contentHTML;
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
      
      {/* EDITOR TOOLBAR HEADER */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 select-none">
        
        {/* Style Controls (Disabled in raw HTML mode) */}
        <div className={`flex flex-wrap items-center gap-1 ${editorMode === 'html' ? 'opacity-40 pointer-events-none' : ''}`}>
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Bold text"
          >
            <Bold className="w-3.5 h-3.5 font-extrabold" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Italic text"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Underline text"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-250 mx-1" />

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-0.5"
            title="Heading Size"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          {/* Color Picker Drawer */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorDropdown(!showColorDropdown)}
              className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              title="Forecolor Accent"
            >
              <Type className="w-3.5 h-3.5 text-[#0084ff]" />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
            {showColorDropdown && (
              <div className="absolute top-7 left-0 bg-white border border-slate-200 rounded-xl p-2 shadow-lg z-20 space-y-1 min-w-[140px] text-xs">
                <span className="text-[9px] font-black tracking-widest text-slate-400 block pb-1 border-b uppercase mb-1.5">Colors</span>
                {textColors.map(tc => (
                  <button
                    key={tc.value}
                    type="button"
                    onClick={() => applyColor(tc.value)}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-slate-50 rounded-md w-full text-left font-medium"
                    style={{ color: tc.value }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tc.value }} />
                    {tc.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="w-px h-5 bg-slate-250 mx-1" />

          {/* Lists */}
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Bulleted List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-250 mx-1" />

          {/* Code elements & Quote blocks */}
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<pre>')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Terminal Code Frame"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<blockquote>')}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Quote highlight"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          {/* Eraser / Clear */}
          <button
            type="button"
            onClick={handleClearFormat}
            className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer ml-1"
            title="Clean text formats"
          >
            <Eraser className="w-3.5 h-3.5 text-slate-450" />
          </button>
        </div>

        {/* View mode Selector: WYSIWYG vs Raw HTML */}
        <div className="flex items-center bg-slate-200/60 p-0.5 rounded-xl border border-slate-200/40">
          <button
            type="button"
            onClick={() => toggleEditorMode('visual')}
            className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
              editorMode === 'visual'
                ? 'bg-white text-slate-800 shadow-3xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3 h-3" />
            Visual Rich
          </button>
          <button
            type="button"
            onClick={() => toggleEditorMode('html')}
            className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
              editorMode === 'html'
                ? 'bg-white text-slate-800 shadow-3xs font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-3 h-3" />
            Raw HTML Code
          </button>
        </div>
      </div>

      {/* QUICK PRESETS TEMPLATE INJECTORS */}
      <div className="bg-blue-50/20 border-b border-slate-200 p-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 select-none text-[11px] font-sans">
        <span className="font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          Instantly Seed Formatted Template Bios:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATES.map((tmpl, tIdx) => {
            const TmplIcon = tmpl.icon;
            return (
              <button
                key={tIdx}
                type="button"
                onClick={() => loadTemplate(tmpl.content)}
                className="px-2 py-1 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 font-semibold rounded-lg hover:bg-blue-50/35 transition-colors cursor-pointer flex items-center gap-1"
              >
                <TmplIcon className="w-3 h-3 text-primary" />
                {tmpl.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* EDITING INTERACTIVE FRAME */}
      <div className="min-h-[220px] relative font-sans">
        {editorMode === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            className="p-4 min-h-[220px] focus:outline-none overflow-y-auto leading-relaxed text-slate-700 text-sm prose max-w-none text-left select-text"
            style={{ minHeight: '220px' }}
            title="Rich formatted editor"
          />
        ) : (
          <textarea
            value={htmlValue}
            onChange={(e) => {
              setHtmlValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Edit raw code parameters (e.g. <h3>Hello</h3>...)"
            className="w-full p-4 min-h-[220px] font-mono text-xs text-slate-100 bg-slate-950 focus:outline-none resize-y text-left block border-0 focus:ring-1 focus:ring-primary/40"
            style={{ minHeight: '220px' }}
          />
        )}

        {/* Dynamic Placeholder when text is empty */}
        {editorMode === 'visual' && (!htmlValue || htmlValue === '<p><br></p>' || htmlValue === '') && (
          <div className="absolute top-4 left-4 text-slate-400 text-sm pointer-events-none italic">
            {placeholder}
          </div>
        )}
      </div>

      {/* METRICS & STATUS SLATE FOOTER */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-[9px] font-mono text-slate-400 select-none">
        <span className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Supports raw tags (e.g., strong, em, ul, li, h3)
        </span>
        <span>
          Character Count: {htmlValue?.length || 0}
        </span>
      </div>
    </div>
  );
}
