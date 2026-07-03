import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Info,
  Layers,
  Sparkles,
  Bot,
  Filter,
  Check,
  FolderOpen
} from 'lucide-react';
import { DOCTREE_DATA, DocTreeNode } from '../doctreeData';

export default function DocTreeViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'entry-1': true,
    'entry-2': true,
    'entry-3': true,
  });
  const [selectedNode, setSelectedNode] = useState<DocTreeNode | null>(DOCTREE_DATA[0]);

  // Recursively calculate stats
  const calculateStats = (nodes: DocTreeNode[]): { total: number; done: number; pending: number } => {
    let total = 0;
    let done = 0;
    let pending = 0;

    const traverse = (node: DocTreeNode) => {
      // If it is a leaf node (no children), count it as a concrete item
      if (!node.children || node.children.length === 0) {
        total += 1;
        if (node.status === 'done') {
          done += 1;
        } else {
          pending += 1;
        }
      } else {
        // For parent nodes, we can count them or traverse children
        node.children.forEach(traverse);
      }
    };

    nodes.forEach(traverse);
    return { total, done, pending };
  };

  const stats = calculateStats(DOCTREE_DATA);
  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const expandAll = () => {
    const newExpanded: Record<string, boolean> = {};
    const traverse = (node: DocTreeNode) => {
      if (node.children && node.children.length > 0) {
        newExpanded[node.id] = true;
        node.children.forEach(traverse);
      }
    };
    DOCTREE_DATA.forEach(traverse);
    setExpandedNodes(newExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  // Check if a node or any of its children match the query
  const matchesSearch = (node: DocTreeNode, query: string): boolean => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    const titleMatch = node.title.toLowerCase().includes(lowerQuery);
    const detailsMatch = node.details?.toLowerCase().includes(lowerQuery) || false;
    const locationMatch = node.locationDesc?.toLowerCase().includes(lowerQuery) || false;

    if (titleMatch || detailsMatch || locationMatch) return true;

    if (node.children) {
      return node.children.some(child => matchesSearch(child, query));
    }

    return false;
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: DocTreeNode, depth: number) => {
    if (!matchesSearch(node, searchQuery)) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.id] || searchQuery !== '';
    const isSelected = selectedNode?.id === node.id;

    // Build indented tree visuals
    return (
      <div key={node.id} className="flex flex-col text-left">
        <div 
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren && searchQuery === '') {
              toggleNode(node.id);
            }
          }}
          className={`flex items-start md:items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all select-none ${
            isSelected 
              ? 'bg-indigo-50 border border-indigo-150 text-indigo-950 ring-1 ring-indigo-100' 
              : 'hover:bg-slate-50 border border-transparent text-slate-800'
          }`}
          style={{ paddingLeft: `${Math.max(10, depth * 22)}px` }}
        >
          <div className="flex items-start md:items-center gap-2">
            {/* Expand/Collapse Chevron */}
            <div className="w-5 h-5 flex items-center justify-center text-slate-400 shrink-0">
              {hasChildren ? (
                isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 ml-1.5"></div>
              )}
            </div>

            {/* Status Checkbox */}
            <span className="shrink-0 mr-1">
              {node.status === 'done' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-50" />
              ) : (
                <Clock className="w-4 h-4 text-amber-500 fill-amber-50" />
              )}
            </span>

            {/* Title & Metadata */}
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
              <span className={`text-[12px] md:text-sm font-display ${node.status === 'done' ? 'font-medium text-slate-800' : 'text-slate-500 italic'}`}>
                {node.title}
              </span>
            </div>
          </div>

          {/* Right badges */}
          <div className="flex items-center gap-1.5 shrink-0 ml-4">
            {node.status === 'done' ? (
              <span className="hidden md:inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                已开通 ✓
              </span>
            ) : (
              <span className="hidden md:inline-block text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full uppercase">
                待集成 ⏳
              </span>
            )}
          </div>
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="relative mt-0.5 pb-1">
            {/* Thread line visual */}
            <div 
              className="absolute left-[19px] top-0 bottom-1 w-0.5 bg-slate-100"
              style={{ left: `${depth * 22 + 19}px` }}
            ></div>
            {node.children!.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans text-left">
      
      {/* Top statistics dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Progress Card */}
        <div className="md:col-span-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-indigo-950 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-indigo-500/30">
                系统需求大纲
              </span>
              <h3 className="text-xl md:text-2xl font-bold font-display mt-2.5">需求指标体系</h3>
              <p className="text-xs text-slate-300 font-normal leading-relaxed max-w-xl mt-1.5">
                实时跟踪核算系统模块运行状况
              </p>
            </div>

            {/* Dynamic Progress indicator */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end text-xs">
                <span className="text-slate-400 font-normal">三端三入口全功能开发就绪率</span>
                <span className="text-emerald-450 font-bold text-base font-mono">{completionRate}% 就绪</span>
              </div>
              <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden p-[2px] border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-emerald-505 to-indigo-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="absolute right-4 bottom-[-15px] opacity-10 pointer-events-none">
            <Layers className="w-44 h-44 text-indigo-400" />
          </div>
        </div>

        {/* Legend stats Card */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">开发节点总量统计</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold font-mono text-slate-900">{stats.total}</span>
              <span className="text-xs text-slate-400 font-normal">个底层落地点</span>
            </div>
          </div>

          {/* Stats detailed grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-emerald-50/50 border border-emerald-100/80 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-emerald-700">✓ 已实现上线</span>
              <span className="text-xl font-bold font-mono text-emerald-800 mt-1 block">{stats.done}</span>
            </div>
            <div className="p-3 bg-amber-50/50 border border-amber-100/80 rounded-xl">
              <span className="block text-[9px] uppercase font-bold text-amber-700">⏳ 待迭代功能</span>
              <span className="text-xl font-bold font-mono text-amber-800 mt-1 block">{stats.pending}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main interactive directory workspace and deployment tracker panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Document Tree Canvas) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 min-h-[500px] flex flex-col">
          
          {/* Filter operations toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索页面、菜单、角色或专属 AI 功能..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-600 focus:bg-white font-sans transition-all"
              />
            </div>

            {/* Tree Collapse & Expand Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={expandAll}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold px-3 py-1.5 rounded-lg text-[10px] text-slate-600 transition-colors"
              >
                全部展开
              </button>
              <button 
                onClick={collapseAll}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold px-3 py-1.5 rounded-lg text-[10px] text-slate-600 transition-colors"
              >
                全部折叠
              </button>
            </div>
          </div>

          {/* Render list of nodes recursive */}
          <div className="flex-1 space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {DOCTREE_DATA.map(node => renderTreeNode(node, 0))}

            {DOCTREE_DATA.every(node => !matchesSearch(node, searchQuery)) && (
              <div className="py-12 text-center text-slate-400 text-xs italic space-y-2">
                <Info className="w-8 h-8 mx-auto text-slate-300" />
                <p>未找到符合要求的需求文档节点。换个词试试？</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Node Deployment context description) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed Deployment Viewer Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800">
              <Info className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-xs uppercase tracking-wider font-mono">需求节点部署定位</h4>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs font-normal">
                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1">需求层级名称</span>
                  <div className="font-bold text-slate-800 font-display text-sm leading-tight">{selectedNode.title}</div>
                </div>

                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1">功能逻辑说明</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-3">
                    {selectedNode.details || '该业务节点属于三端架构中的细分子级板块，已全量绑定到对应的 AI 模块和商业决策图中。'}
                  </p>
                </div>

                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1">当前沙盘落地位置</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-505"></span>
                    <span className="font-mono text-indigo-750 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {selectedNode.locationDesc || '「系统后台经营仪表盘」'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-1">交付就绪状态</span>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedNode.status === 'done' ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Core Sandbox Ready (可交互就绪)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mocked / Roadmap Pipeline</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-normal py-4">选择左侧树状结构的任意需求项，查看此模块在 SaaS 前后台沙箱中的部署位置及交互详情。</p>
            )}
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-xs font-mono uppercase tracking-wider">交互提示 (Interactive Help)</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-normal">
              本系统是一个可深度交互的 **多租户 AI 商业操作系统**，您可以通过在左侧的系统侧边栏切换不同的行业（如 `RETAIL` 服装、`FOOD` 餐饮、`SERVICE` 美业)，来激活不同的首页驾驶舱、SKU 货架、特定 AI 岗位成员关系及专属工作流。
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
