import React, { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  Bold, Italic, Heading2, List, Code, Link as LinkIcon, 
  Quote, Eye, Edit3
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write in Markdown (e.g. ## Subheading, **bold**, *italic*, - list, [link](url))...',
  minHeight = '280px'
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  const insertSyntax = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end);

    const replacement = selectedText 
      ? `${before}${selectedText}${after}` 
      : `${before}${defaultText}${after}`;

    const nextValue = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      } else {
        const cursorLoc = start + before.length + defaultText.length;
        textarea.setSelectionRange(cursorLoc, cursorLoc);
      }
    }, 0);
  };

  const insertLinePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const currentVal = textarea.value;
    const lastNewline = currentVal.lastIndexOf('\n', start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const nextValue = currentVal.substring(0, lineStart) + prefix + currentVal.substring(lineStart);
    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden text-left font-sans">
      {/* Header with Tabs & Minimal Tools */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50/90 border-b border-slate-200">
        {/* Write / Preview Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              tab === 'write'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-3 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              tab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
        </div>

        {/* Minimal Formatting Buttons (only visible in Write mode) */}
        {tab === 'write' ? (
          <div className="flex items-center gap-0.5 text-slate-600">
            <button
              type="button"
              onClick={() => insertLinePrefix('## ')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Heading (##)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('**', '**', 'bold')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Bold (**text**)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('*', '*', 'italic')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Italic (*text*)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix('- ')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Bullet List (- item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('`', '`', 'code')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Inline Code (`code`)"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertLinePrefix('> ')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Quote (> quote)"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('[', '](https://...)', 'Link Title')}
              className="p-1.5 hover:bg-slate-200/80 hover:text-slate-900 rounded-md transition-colors cursor-pointer"
              title="Link ([title](url))"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-[11px] font-medium text-slate-400">
            Rendered Markdown
          </span>
        )}
      </div>

      {/* Content Area */}
      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 text-sm font-mono text-slate-800 bg-white focus:outline-hidden resize-y leading-relaxed border-0"
          style={{ minHeight }}
        />
      ) : (
        <div 
          className="p-6 bg-slate-50/40 overflow-y-auto blog-prose text-left"
          style={{ minHeight }}
        >
          {value.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-slate-400 italic text-xs">Nothing to preview yet. Type markdown in the Write tab.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownEditor;
