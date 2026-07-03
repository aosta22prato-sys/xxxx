import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Compass, ShieldCheck, CornerDownLeft, Sparkles, Cpu, AlertTriangle, Bot, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { dbEngine } from '../../../db/dbEngine';

export interface RouteInfo {
  id: string;
  name: string;
  path: string;
  description: string;
  aliases: string[];
  permission: string;
}

interface EcosMasterDirectoryProps {
  currentRole?: string;
  onNavigateSuccess?: (path: string) => void;
  inlineVariant?: boolean;
}

export const EcosMasterDirectory: React.FC<EcosMasterDirectoryProps> = ({
  currentRole = 'merchant',
  onNavigateSuccess,
  inlineVariant = false
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RouteInfo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const allRoutes = useMemo(() => {
    return dbEngine.navigation_registry.getAll().map(item => ({
      id: item.id,
      name: item.name,
      path: `/${item.route}`,
      description: `${item.name} (${item.component}) - Status: ${item.status}`,
      aliases: item.aliases || [],
      permission: item.permissions.includes('Admin') ? 'super_admin' : 'merchant'
    }));
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const queryRoutes = (q: string, list: RouteInfo[]) => {
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(r => 
      r.name.toLowerCase().includes(term) || 
      r.path.toLowerCase().includes(term) || 
      r.aliases.some(a => a.toLowerCase().includes(term))
    );
  };

  const validateRouteAndClearance = (path: string, role: string) => {
    const matched = allRoutes.find(r => r.path === path);
    if (!matched) return { cleared: true };
    if (matched.permission === 'super_admin' && role !== 'admin' && role !== 'super_admin') {
      return { cleared: false, reason: '此页面需要超级管理员核心对账授权才能进入' };
    }
    return { cleared: true };
  };

  // Trigger search on query change
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(allRoutes);
      setSelectedIndex(0);
      return;
    }

    const matched = queryRoutes(query, allRoutes);
    setSearchResults(matched);
    setSelectedIndex(0);
  }, [query, allRoutes]);

  // Handle Hotkeys (Cmd+K focus, up/down arrows, enter select)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (!isFocused) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (searchResults[selectedIndex]) {
          handleSelectRoute(searchResults[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        searchInputRef.current?.blur();
        setIsFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, searchResults, selectedIndex]);

  // Execute Route Switch Engine
  const handleSelectRoute = (route: RouteInfo) => {
    const auditResult = validateRouteAndClearance(route.path, currentRole);
    
    if (!auditResult.cleared) {
      setActionNotice(auditResult.reason || '权限校验未通过：此路由受限访问');
      setTimeout(() => setActionNotice(null), 4000);
      return;
    }

    setActionNotice(`✓ 正在穿梭至: [${route.name}]...`);
    
    // Execute global routing engine
    setTimeout(() => {
      setActionNotice(null);
      const win = window as any;
      if (win.ECOS_NAVIGATE) {
        win.ECOS_NAVIGATE(route.path);
      } else {
        console.warn(`[ECOS_NAV] Warning: window.ECOS_NAVIGATE is not bound. Simulating navigate to: ${route.path}`);
      }
      
      if (onNavigateSuccess) {
        onNavigateSuccess(route.path);
      }
    }, 800);
  };

  return (
    <div className={`w-full flex flex-col font-sans ${inlineVariant ? 'bg-transparent' : 'bg-[#070809] border border-[#1f2124] rounded-2xl p-4 shadow-2xl text-left'}`}>
      {!inlineVariant && (
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#1f2124]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#07C2E3]/10 text-[#07C2E3] border border-[#07C2E3]/15">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-widest uppercase">ECOS 全网穿梭司南</h3>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">Autonomous Directory Registry & Navigation Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-mono text-[8px] bg-slate-950 px-2 py-1 rounded border border-slate-900 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#07C2E3] animate-pulse"></span>
            <span>CLEARANCE: <strong className="text-emerald-400 capitalize">{currentRole}</strong></span>
          </div>
        </div>
      )}

      {/* Global Input Bar */}
      <div className="relative font-sans mb-3.5">
        <label htmlFor="master-directory-search" className="sr-only">搜索 ECOS 功能与页面</label>
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4_5 h-4_5 text-slate-500" />
        <input
          id="master-directory-search"
          ref={searchInputRef}
          type="text"
          placeholder="搜索功能、模块别名、核心指令或页面... (快捷键: Cmd+K 开启)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full bg-[#101112] border border-[#1f2124] focus:border-[#07C2E3] rounded-xl pl-11 pr-20 py-3.5 text-xs text-slate-200 font-bold placeholder-slate-600 focus:outline-none transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-mono font-bold text-slate-500 bg-slate-950 px-1.5 py-1 rounded border border-slate-900 pointer-events-none select-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      </div>

      {/* Running Action Alert Overlay */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`p-3 rounded-lg text-xs font-bold font-sans flex items-center gap-2 mb-3 shadow ${
              actionNotice.startsWith('✓') 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}
          >
            {actionNotice.startsWith('✓') ? (
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce shrink-0" />
            )}
            <span>{actionNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Listing */}
      <div className="max-h-[280px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-900 pr-1">
        {searchResults.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#090a0c]/60 border border-slate-900 flex flex-col items-center justify-center space-y-2">
            <Bot className="w-8 h-8 text-slate-600 animate-bounce" />
            <p className="text-[11px] font-bold text-slate-400">未检索到对应的 ECOS 导航注册映射</p>
            <p className="text-[9px] text-slate-600 font-mono">别名映射为空，请在 /database/ 目录注册或使用其他模糊词</p>
          </div>
        ) : (
          searchResults.map((route, index) => {
            const isSelected = index === selectedIndex && isFocused;
            const requiresAdmin = route.permission === 'super_admin';
            const isForbidden = requiresAdmin && currentRole !== 'super_admin';

            return (
              <div
                key={route.id}
                onClick={() => handleSelectRoute(route)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-[#07C2E3]/10 border-[#07C2E3]/40 text-white' 
                    : 'bg-[#0d0e11] border-[#1d1e22]/60 hover:border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                    isSelected 
                      ? 'bg-[#07C2E3]/20 border-[#07C2E3]/30 text-[#07C2E3]' 
                      : 'bg-black/30 border-white/5 text-slate-400 group-hover:text-white'
                  }`}>
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-extrabold text-white group-hover:text-[#07C2E3] transition-colors">{route.name}</span>
                      <span className="text-[8.5px] font-mono text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-900/40">{route.path}/</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed mt-0.5">{route.description}</p>
                    
                    {/* Alias tags visual list */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {route.aliases.slice(0, 5).map((alias, aIdx) => (
                        <span 
                          key={aIdx} 
                          className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                            isSelected 
                              ? 'bg-[#07C2E3]/5 border-[#07C2E3]/15 text-[#07C2E3]' 
                              : 'bg-slate-950/80 border-slate-900 text-slate-600'
                          }`}
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right badges */}
                <div className="flex items-center gap-3 shrink-0 font-sans">
                  {requiresAdmin ? (
                    <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded flex items-center gap-1 border ${
                      isForbidden 
                        ? 'bg-red-500/10 border-red-500/15 text-red-400 font-extrabold' 
                        : 'bg-purple-500/10 border-purple-500/15 text-purple-300'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>{isForbidden ? '超管授信限制' : '超管已就绪'}</span>
                    </span>
                  ) : (
                    <span className="text-[8.5px] font-mono text-slate-500 group-hover:text-slate-200">商户通用</span>
                  )}

                  {isSelected && (
                    <div className="flex items-center gap-0.5 text-[8.5px] text-[#07C2E3] font-mono font-bold animate-pulse">
                      <span>Enter</span>
                      <CornerDownLeft className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!inlineVariant && (
        <div className="mt-3.5 pt-3 border-t border-[#121417] flex justify-between items-center text-[8.5px] text-slate-500 font-mono select-none">
          <span>ECOS Master Directory V1.2 Routing Engine</span>
          <span>UP / DOWN to navigate &bull; ENTER to teleport</span>
        </div>
      )}
    </div>
  );
};
export default EcosMasterDirectory;
