import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Code, 
  List, 
  ListOrdered, 
  Link2, 
  Quote, 
  Sparkles, 
  Eye, 
  Edit3, 
  FileText, 
  Check, 
  Copy, 
  RotateCcw,
  Maximize2,
  Minimize2,
  Minimize,
  RefreshCw,
  Clock,
  HelpCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface MarkdownCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  minHeight?: string;
  enableAi?: boolean;
  aiContext?: string;
  label?: string;
}

export default function MarkdownCodeEditor({
  value,
  onChange,
  placeholder = '开始输入 Markdown 内容或代码...',
  rows = 10,
  minHeight = '200px',
  enableAi = true,
  aiContext = '',
  label = ''
}: MarkdownCodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiNotification, setAiNotification] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Push to history when value changes, but debounced to avoid huge stacks
  useEffect(() => {
    const timer = setTimeout(() => {
      if (history[historyIndex] !== value) {
        const newHistory = history.slice(0, historyIndex + 1);
        setHistory([...newHistory, value]);
        setHistoryIndex(newHistory.length);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [value, history, historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      onChange(history[prevIdx]);
    }
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const replacement = prefix + selectedText + suffix;

    const newValue = text.substring(0, start) + replacement + text.substring(end);
    onChange(newValue);

    // Refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleAiOptimize = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    setAiNotification(null);

    try {
      const response = await fetch('/api/ai/optimize-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: value,
          context: aiContext || 'SaaS Shop Page & Config Copywriting'
        })
      });

      if (!response.ok) {
        throw new Error('网络请求异常');
      }

      const data = await response.json();
      if (data.optimized) {
        onChange(data.optimized);
        setAiNotification('✨ 已完成 AI 精英话术重塑优化！');
        setTimeout(() => setAiNotification(null), 4000);
      } else {
        throw new Error('API 返回无效数据');
      }
    } catch (err: any) {
      console.error('AI text optimization failed:', err);
      setAiNotification('❌ 优化失败：' + (err.message || '系统崩溃'));
      setTimeout(() => setAiNotification(null), 4000);
    } finally {
      setAiLoading(false);
    }
  };

  // Get metrics
  const charCount = value.length;
  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
  const lineCount = value.split('\n').length;

  return (
    <div 
      className={`flex flex-col border border-slate-250 bg-white transition-all duration-300 shadow-3xs hover:border-[#07C2E3]/50 focus-within:border-[#07C2E3] rounded-xl ${
        isFullscreen ? 'fixed inset-4 z-50 bg-white shadow-2xl m-auto max-w-[1200px] h-[calc(100vh-32px)] border-2 border-[#07C2E3]' : 'w-full'
      }`}
      style={{ minHeight: isFullscreen ? 'auto' : 'auto' }}
    >
      {/* Editor Main Header Container */}
      <div className="flex items-center justify-between border-b border-slate-150 px-3 py-2 bg-slate-50/70 select-none rounded-t-xl shrink-0">
        <div className="flex items-center gap-2">
          {label && (
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
              {label}
            </span>
          )}
          <span className="text-[10px] text-slate-400 font-mono font-medium hidden sm:inline">
            MARKDOWN EDITOR
          </span>
        </div>

        {/* View Mode Switch Triggers & actions */}
        <div className="flex items-center gap-1.5">
          <div className="bg-slate-200/60 p-0.5 rounded-lg flex border border-slate-300/40">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1 text-[10.5px] font-black rounded-md flex items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'edit' 
                  ? 'bg-slate-900 text-[#07C2E3]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              <span>编辑 (Write)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 text-[10.5px] font-black rounded-md flex items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'preview' 
                  ? 'bg-slate-900 text-[#07C2E3]' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>预览 (Preview)</span>
            </button>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>

          {/* Utility icon hooks */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            title="全部克隆复制 (Copy)"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-1.5 hover:bg-slate-200 disabled:opacity-30 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            title="撤销最后一步 (Undo)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? '退出全屏' : '全屏编辑'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Auxiliary Markdown Formatting Panel */}
      {activeTab === 'edit' && (
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/45 px-2.5 py-1.5 border-b border-slate-150 select-none">
          <button
            type="button"
            onClick={() => insertFormatting('# ')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="一级标题 H1"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('## ')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="二级标题 H2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3 bg-slate-200 mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer font-extrabold"
            title="加粗 Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer font-bold italic"
            title="斜体 Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3 bg-slate-200 mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting('- ')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="无序列表"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('1. ')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="有序列表"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-3 bg-slate-200 mx-1"></div>

          <button
            type="button"
            onClick={() => insertFormatting('`', '`')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="行内代码"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('```\n', '\n```')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="代码块"
          >
            <span className="text-[10px] font-mono leading-none">&lt;/&gt;</span>
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('> ')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="引用块"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertFormatting('[', '](url)')}
            className="p-1 hover:bg-slate-250 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            title="添加超级链路"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>

          {/* Flex Empty space filler */}
          <div className="flex-1"></div>

          {/* Genuine Action-oriented AI assistance */}
          {enableAi && (
            <button
              type="button"
              onClick={handleAiOptimize}
              disabled={aiLoading}
              className="px-2.5 py-1 text-[9.5px] font-black font-sans uppercase tracking-wider rounded-lg bg-slate-900 border border-slate-700 hover:border-[#07C2E3] text-[#07C2E3] transition-all cursor-pointer flex items-center gap-1 hover:shadow-sm"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-[#07C2E3]" />
                  <span>正在深度润色 & 纠正...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 animate-pulse text-[#07C2E3]" />
                  <span>AI 一键排版润色 (Smart Assist)</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Editor Primary Workspace Scroll/Stage */}
      <div className="flex-1 min-h-[160px] flex flex-col relative bg-[#FBFBFC]">
        {activeTab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            style={{ minHeight: isFullscreen ? '100%' : minHeight }}
            className="w-full h-full p-4 resize-none border-none bg-transparent font-mono text-xs text-slate-800 leading-relaxed font-bold tracking-normal focus:outline-none focus:ring-0"
          />
        ) : (
          <div 
            style={{ minHeight: isFullscreen ? '400px' : minHeight }}
            className="p-4 overflow-y-auto bg-white"
          >
            <div className="markdown-body p-4 text-xs font-sans font-normal text-slate-800 leading-relaxed bg-slate-50/50 rounded-xl border border-slate-200">
              <ReactMarkdown>{value || '*暂无内容 / 无 Markdown 语法输入*'}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Dynamic AI Notification Float popup banner */}
        {aiNotification && (
          <div className="absolute top-2 right-2 z-10 px-3 py-1.5 rounded-lg border bg-[#0F172A] border-[#07C2E3]/40 text-[#07C2E3] text-[10px] font-extrabold flex items-center gap-1.5 animate-fadeIn shadow-lg">
            <span>{aiNotification}</span>
          </div>
        )}
      </div>

      {/* Editor Workspace Status bar (Character count, lines count, etc) */}
      <div className="flex items-center justify-between border-t border-slate-150 px-3 py-1.5 bg-slate-50 select-none text-[9.5px] text-slate-400 font-mono rounded-b-xl shrink-0">
        <div className="flex items-center gap-4">
          <span>LINES: <strong className="text-slate-600 font-bold">{lineCount}</strong></span>
          <span>CHARS: <strong className="text-slate-600 font-bold">{charCount}</strong></span>
          <span>WORDS: <strong className="text-slate-600 font-bold">{wordCount}</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[#07C2E3] rounded-full"></span>
          <span>UTF-8 • Markdown Engine v1.0 • Compliance Checks Enabled</span>
        </div>
      </div>
    </div>
  );
}
