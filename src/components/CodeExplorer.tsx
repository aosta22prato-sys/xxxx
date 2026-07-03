import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  RefreshCw, 
  Save, 
  Search, 
  Terminal, 
  Code2, 
  FileCode,
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import MarkdownCodeEditor from './MarkdownCodeEditor';

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

interface CodeExplorerProps {
  addLog: (module: string, action: string, details: string, type: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function CodeExplorer({ addLog }: CodeExplorerProps) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [originalContent, setOriginalContent] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [expandedPaths, setExpandedPaths] = useState<Record<string, boolean>>({
    'src': true,
    'src/components': true
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch the filesystem tree on mount
  const fetchFileTree = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/developer/files');
      const data = await response.json();
      if (data.success && data.tree) {
        setFileTree(data.tree);
        addLog('Developer SDK', '文件树同步', '同步当前工作空间代码源目录结构成功', 'info');
      } else {
        showNotification('error', '未能拉取工作区目录列表');
      }
    } catch (err: any) {
      showNotification('error', `网络错误: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileTree();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle folder expansion
  const toggleFolder = (path: string) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Load a file's content
  const loadFile = async (filePath: string) => {
    setLoading(true);
    setSelectedFilePath(filePath);
    try {
      const response = await fetch('/api/developer/read-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      const data = await response.json();
      if (data.success) {
        setFileContent(data.content);
        setOriginalContent(data.content);
        addLog('Developer SDK', '读取源码', `成功载入「${filePath}」源文本结构`, 'success');
      } else {
        showNotification('error', data.error || '无法读取文件内容');
      }
    } catch (err: any) {
      showNotification('error', `加载文件出错: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save the modified file content back to the workspace
  const saveFileContent = async () => {
    if (!selectedFilePath) return;
    setSaving(true);
    try {
      const response = await fetch('/api/developer/write-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFilePath, content: fileContent })
      });
      const data = await response.json();
      if (data.success) {
        setOriginalContent(fileContent);
        showNotification('success', `✓ 「${selectedFilePath}」内容保存并热重载成功！`);
        addLog('Developer SDK', '修改源码', `主动物理写入持久化文件「${selectedFilePath}」成功`, 'success');
      } else {
        showNotification('error', data.error || '保存文件失败');
      }
    } catch (err: any) {
      showNotification('error', `保存文件出错: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Recursively search and collect path suggestions
  const collectFilesFlat = (nodes: FileNode[]): string[] => {
    let result: string[] = [];
    for (const node of nodes) {
      if (node.isDirectory && node.children) {
        result = [...result, ...collectFilesFlat(node.children)];
      } else {
        result.push(node.path);
      }
    }
    return result;
  };

  const flatFiles = collectFilesFlat(fileTree);
  const matchingFiles = searchQuery 
    ? flatFiles.filter(p => p.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8)
    : [];

  // Recursive component for rendering the File Tree
  const renderTreeNodes = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedPaths[node.path] || false;
      const isSelected = selectedFilePath === node.path;
      const paddingLeft = `${depth * 14}px`;

      if (node.isDirectory) {
        return (
          <div key={node.path} className="select-none">
            <button
              onClick={() => toggleFolder(node.path)}
              style={{ paddingLeft }}
              className="w-full text-left py-1.5 px-2 hover:bg-slate-100 rounded-md flex items-center gap-1.5 text-[11px] font-bold text-slate-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <Folder className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{node.name}</span>
            </button>
            {isExpanded && node.children && (
              <div className="mt-0.5">
                {renderTreeNodes(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        return (
          <button
            key={node.path}
            onClick={() => loadFile(node.path)}
            style={{ paddingLeft: `${depth * 14 + 20}px` }}
            className={`w-full text-left py-1.5 px-2 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition-all ${
              isSelected
                ? 'bg-[#0f766e]/10 text-[#0f766e] font-bold border-l-2 border-[#0f766e]'
                : 'hover:bg-slate-50 text-slate-600'
            }`}
          >
            <File className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#0f766e]' : 'text-slate-400'}`} />
            <span className="truncate">{node.name}</span>
          </button>
        );
      }
    });
  };

  const isChanged = fileContent !== originalContent;

  return (
    <div id="developer-code-explorer" className="space-y-6 text-slate-800 text-left font-sans animate-fadeIn">
      
      {/* Visual notification banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-2.5 animate-slideIn ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
            : 'bg-rose-50 border-rose-300 text-rose-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="text-[11px] font-bold tracking-tight font-mono">{notification.message}</span>
        </div>
      )}

      {/* Head line controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-wider uppercase flex items-center gap-2 font-display">
            <Terminal className="w-4.5 h-4.5 text-[#0f766e]" />
            <span>开发者源码文件管理器</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            浏览与编辑该多租户 SaaS 电商系统在 Cloud Run 沙箱容器中的实际运行源文件结构。
          </p>
        </div>

        <button
          onClick={fetchFileTree}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-lg transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer border border-slate-200"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>刷新文件树</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="在多租户电商系统中检索任何源码文件 (例: App.tsx, server.ts...)"
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full font-mono font-medium"
          />
        </div>

        {/* Search suggestions overlay */}
        {searchQuery && matchingFiles.length > 0 && (
          <div className="absolute left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-30 space-y-1 animate-fadeIn">
            <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase px-2 mb-1">匹配的文件/匹配建议</span>
            {matchingFiles.map(path => (
              <button
                key={path}
                onClick={() => {
                  loadFile(path);
                  setSearchQuery('');
                }}
                className="w-full text-left p-2 hover:bg-slate-50 rounded-lg text-[10px] font-mono text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-[#0f766e] shrink-0" />
                <span>{path}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left Side: Directory Tree */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col h-[520px] overflow-hidden">
          <div className="border-b border-slate-200/60 pb-3 mb-3 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono">WORKSPACE FILE TREE</span>
            <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-full font-mono">
              {flatFiles.length} files
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-0.5">
            {loading && fileTree.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                <span>扫描工作目录中...</span>
              </div>
            ) : (
              renderTreeNodes(fileTree)
            )}
          </div>
        </div>

        {/* Right Side: Interactive Code Editor / Placeholder */}
        <div className="lg:col-span-8 flex flex-col border border-slate-200 rounded-2xl h-[520px] overflow-hidden bg-white">
          {selectedFilePath ? (
            <div className="flex flex-col h-full">
              {/* Header info */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-2 text-left truncate">
                  <span className="p-1 bg-[#0f766e]/10 text-[#0f766e] rounded">
                    <Code2 className="w-4 h-4" />
                  </span>
                  <div className="truncate">
                    <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">ACTIVE FILE IN VIEWER</span>
                    <span className="text-xs font-bold text-slate-900 font-mono truncate">{selectedFilePath}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isChanged && (
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-200 rounded-md font-mono animate-pulse">
                      ● 未保存更改
                    </span>
                  )}
                  <button
                    onClick={saveFileContent}
                    disabled={saving || !isChanged}
                    className="px-3.5 py-1.5 bg-[#0f766e] hover:bg-teal-800 disabled:opacity-40 text-white text-[10px] font-black rounded-lg transition-all active:scale-95 flex items-center gap-1.5 disabled:pointer-events-none cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? '持久化中...' : '保存更改'}</span>
                  </button>
                </div>
              </div>

              {/* Real Content Rich Editor */}
              <div className="flex-1 overflow-y-auto p-4 bg-white">
                <MarkdownCodeEditor
                  value={fileContent}
                  onChange={(val) => setFileContent(val)}
                  placeholder="载入源码结构中，可随时进行开发式编辑..."
                  rows={20}
                  minHeight="350px"
                  enableAi={true}
                  aiContext={`We are viewing and editing file: "${selectedFilePath}" in the AI Commerce OS ecommerce SaaS platform.`}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-center justify-center text-[#0f766e] animate-bounce">
                <Terminal className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest font-display">未打开任何源代码文件</h3>
                <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed mx-auto font-medium">
                  请在左侧工作区目录树中选择要浏览并修改的文件，或使用上方的检索栏定位文件。
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-left max-w-sm text-[10px] space-y-1.5 font-mono text-slate-500">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0f766e]" />
                  <span>支持调试和热更以下重点模块:</span>
                </div>
                <div>⚡ <b>Express 后端路由服务:</b> server.ts</div>
                <div>⚛️ <b>React 主渲染渲染流:</b> src/App.tsx</div>
                <div>🗂️ <b>多租户商品/订单业务:</b> src/components/SaaSMerchantWorkbench.tsx</div>
                <div>🛠️ <b>配置清单及依赖树:</b> package.json</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
