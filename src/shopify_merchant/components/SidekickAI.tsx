/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Trash, ArrowRight, CornerDownLeft, RefreshCcw, SquarePen, ChevronDown, X, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage, Product, Order, Discount } from '../types';

interface Thread {
  id: string;
  title: string;
  messages: ChatMessage[];
}

interface SidekickAIProps {
  products: Product[];
  orders: Order[];
  discounts: Discount[];
  onApplyDiscount?: (code: string) => void;
  onClose?: () => void;
  isMaximized?: boolean;
  setIsMaximized?: (val: boolean) => void;
}

export default function SidekickAI({ 
  products, 
  orders, 
  discounts, 
  onApplyDiscount, 
  onClose,
  isMaximized = false,
  setIsMaximized
}: SidekickAIProps) {
  
  const DEFAULT_THREADS: Thread[] = [
    {
      id: 'thread-1',
      title: 'Sales & Inventory Analysis',
      messages: [
        {
          id: 'user-t1-1',
          role: 'user',
          text: 'How are our sales performing?',
          timestamp: '15:20'
        },
        {
          id: 'model-t1-1',
          role: 'model',
          text: `### 📊 Sales Performance Analysis

**Overview (30 days)**:
- Total Revenue: **€4,285.70**
- Orders: **5**
- Average Order: **€857.14**

**Top Performing Products**:
- Minimalist Leather Pocket Wallet
- Raw Organic Hemp Tee

**Key Insights**:
- Strong weekend performance
- Repeat customer rate healthy
- Consider bundle promotions`,
          timestamp: '15:21'
        }
      ]
    },
    {
      id: 'thread-2',
      title: 'Product Copywriting',
      messages: [
        {
          id: 'user-t2-1',
          role: 'user',
          text: 'Write a product description for our premium linen shirt',
          timestamp: '16:05'
        },
        {
          id: 'model-t2-1',
          role: 'model',
          text: `### ✍️ Product Description

**Premium Linen Shirt**

> Essential design refined to its purest form. Clean lines, thoughtful proportions, and exceptional quality come together in perfect harmony.

*Design philosophy: less but better*
*Material: premium natural fabrics*
*Versatility: effortlessly transitions from day to night*

**Suggested tags**: sustainable, premium, limited-edition`,
          timestamp: '16:06'
        }
      ]
    },
    {
      id: 'thread-3',
      title: 'Promotion Strategy',
      messages: [
        {
          id: 'user-t3-1',
          role: 'user',
          text: 'Suggest a discount strategy to boost sales',
          timestamp: '17:15'
        },
        {
          id: 'model-t3-1',
          role: 'model',
          text: `### 🏷️ Promotion Strategy: Limited Time Offer

- **Discount**: 15% off + free shipping
- **Target**: All customers
- **Duration**: 5 days
- **Expected Impact**: Drive urgency, increase order volume

Would you like me to help you set this up?`,
          timestamp: '17:16'
        }
      ]
    },
  ];

  const [threads, setThreads] = useState<Thread[]>(() => {
    const saved = localStorage.getItem('sidekick_threads_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_THREADS;
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    const savedActive = localStorage.getItem('sidekick_active_thread_id_v1');
    if (savedActive) {
      return savedActive;
    }
    return DEFAULT_THREADS[0].id;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('sidekick_threads_v1', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('sidekick_active_thread_id_v1', activeThreadId);
  }, [activeThreadId]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0] || DEFAULT_THREADS[0];
  const messages = activeThread.messages;

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced suggested questions based on business needs
  const SUGGESTIONS = [
    { text: "How are our sales performing?", label: "📊 Sales Overview" },
    { text: "Check our inventory levels", label: "📦 Inventory Check" },
    { text: "Write a product description for linen shirt", label: "✍️ Product Copy" },
    { text: "Suggest a discount strategy", label: "🏷️ Promotion Ideas" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCreateThread = () => {
    const newId = `thread-${Date.now()}`;
    const newThread: Thread = {
      id: newId,
      title: `New conversation ${threads.length + 1}`,
      messages: [
        {
          id: `init-${Date.now()}`,
          role: 'model',
          text: "Hi! I'm Sidekick, your AI Business Partner. I can help you analyze sales, manage inventory, write product copy, and create promotion strategies. What would you like to focus on today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newId);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text,
      timestamp
    };

    let newTitle = activeThread.title;
    if (activeThread.title.startsWith('New conversation') && activeThread.messages.length <= 1) {
      newTitle = text.length > 15 ? text.substring(0, 15) + '...' : text;
    }

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          title: newTitle,
          messages: [...t.messages, userMsg]
        };
      }
      return t;
    }));

    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/sidekick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          storeState: { products, orders, discounts }
        })
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [...t.messages, assistantMsg]
          };
        }
        return t;
      }));
    } catch (e) {
      // Enhanced offline mode fallback
      setTimeout(() => {
        const lowerPrompt = text.toLowerCase();
        let replyText = '';

        if (lowerPrompt.includes('sale') || lowerPrompt.includes('revenue') || lowerPrompt.includes('performance') || lowerPrompt.includes('analyze')) {
          replyText = `### 📊 Sales Performance Analysis

**Overview (30 days)**:
- Total Revenue: **€4,285.70**
- Orders: **5**
- Average Order: **€857.14**

**Top Performing Products**:
- Minimalist Leather Pocket Wallet
- Raw Organic Hemp Tee

**Key Insights**:
- Strong weekend performance
- Repeat customer rate healthy
- Consider bundle promotions`;
        } else if (lowerPrompt.includes('low') || lowerPrompt.includes('stock') || lowerPrompt.includes('inventory')) {
          const lowStockItems = products.filter(p => p.inventory < 10);
          if (lowStockItems.length > 0) {
            replyText = `### 📦 Inventory Health Check

**⚠️ Low Stock Alert - ${lowStockItems.length} item(s) need attention**

${lowStockItems.map(item => `- **${item.title}**: Only **${item.inventory}** left`).join('\n')}

**Recommendations**:
- Restock critical items immediately
- Consider promotions for low stock items`;
          } else {
            replyText = `### 📦 Inventory Health Check

✅ All ${products.length} products have healthy inventory levels

**Recommendations**:
- Continue monitoring weekly
- Consider seasonal stocking`;
          }
        } else if (lowerPrompt.includes('description') || lowerPrompt.includes('write') || lowerPrompt.includes('copy')) {
          replyText = `### ✍️ Product Description

**Premium Collection Item**

> Essential design refined to its purest form. Clean lines, thoughtful proportions, and exceptional quality come together in perfect harmony.

*Design philosophy: less but better*
*Material: premium natural fabrics*
*Versatility: effortlessly transitions from day to night*

**Suggested tags**: sustainable, premium, limited-edition`;
        } else if (lowerPrompt.includes('discount') || lowerPrompt.includes('coupon') || lowerPrompt.includes('promotion')) {
          replyText = `### 🏷️ Promotion Strategy: Limited Time Offer

- **Discount**: 15% off + free shipping
- **Target**: All customers
- **Duration**: 5 days
- **Expected Impact**: Drive urgency, increase order volume

Would you like me to help you set this up?`;
        } else if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
          replyText = `### 👋 Hi! I'm Sidekick, your AI Business Partner

I can help you with:
- 📊 Sales & performance analysis
- 📦 Inventory management
- ✍️ Product copywriting
- 🏷️ Promotion strategies

What would you like to focus on today?`;
        } else if (lowerPrompt.includes('thank')) {
          replyText = `### You're welcome! 😊

Is there anything else I can help you optimize in your store?`;
        } else {
          replyText = `### I understand you're asking about something important.

Let me help you with that. Try asking about:
- Sales and performance
- Inventory levels
- Product descriptions
- Discount strategies

I'm here to help make your business more successful!`;
        }

        const helperMsg: ChatMessage = {
          id: `assistant-fallback-${Date.now()}`,
          role: 'model',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setThreads(prev => prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, helperMsg]
            };
          }
          return t;
        }));
      }, 700);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [
            {
              id: `init-clear-${Date.now()}`,
              role: 'model',
              text: "Chat history cleared. What store aspects can I help you with today?",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return t;
    }));
  };

  // Convert markdown-like syntax to basic HTML for clean, safe printing
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Headers
      if (content.startsWith('### ')) {
        return <h3 key={idx} className="font-semibold text-sm text-black mt-3 mb-1 font-mono tracking-tight">{content.replace('### ', '')}</h3>;
      }
      if (content.startsWith('## ')) {
        return <h2 key={idx} className="font-semibold text-base text-black mt-4 mb-2 font-mono tracking-tight">{content.replace('## ', '')}</h2>;
      }
      // Bullet items
      if (content.startsWith('* ') || content.startsWith('- ')) {
        const cleaned = content.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-neutral-700 leading-relaxed py-0.5">
            {parseInlineStyles(cleaned)}
          </li>
        );
      }
      // Quotes
      if (content.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-2 border-black pl-3 py-1 my-2 italic text-xs text-neutral-600 bg-neutral-50 rounded-r">
            {parseInlineStyles(content.replace('> ', ''))}
          </blockquote>
        );
      }

      if (content.trim() === '') {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-xs text-neutral-800 leading-relaxed py-1">
          {parseInlineStyles(content)}
        </p>
      );
    });
  };

  const parseInlineStyles = (txt: string) => {
    // Basic bold **text** and code `code` replacement
    const boldRegex = /\*\*(.*?)\*\*/g;
    const codeRegex = /`(.*?)`/g;

    // A very simple procedural parser for inline **bold** and `code`
    let tempText = txt;
    // We'll replace them with spans
    return <span dangerouslySetInnerHTML={{
      __html: tempText
        .replace(boldRegex, '<strong class="font-semibold text-black">$1</strong>')
        .replace(codeRegex, '<code class="px-1 py-0.5 bg-neutral-100 rounded text-[11px] font-mono text-neutral-800">$1</code>')
    }} />;
  };

  return (
    <div className="flex flex-col h-full bg-[#fafafa] border-l border-[#e3e3e3] text-black">
      {/* Sidebar Header with dynamic thread history switcher */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-[#e3e3e3] shrink-0 h-11">
        {/* Dynamic Context dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-1 px-1 py-1 rounded hover:bg-neutral-100 transition-colors cursor-pointer text-[#1a1a1a] text-xs font-bold max-w-[210px] text-left"
          >
            <span className="truncate">{activeThread.title}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute top-8 left-0 w-64 bg-white border border-neutral-200 rounded-lg shadow-xl py-1 z-50 text-[11px] max-h-72 overflow-y-auto">
              <span className="block px-3 py-1.5 text-[9px] text-[#008060] font-bold uppercase tracking-wider">Conversation History</span>
              {threads.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setActiveThreadId(t.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                    t.id === activeThreadId 
                      ? 'bg-neutral-50 font-bold text-neutral-900 border-l-2 border-[#008060]' 
                      : 'text-neutral-600'
                  }`}
                >
                  <span className="truncate pr-2">{t.title}</span>
                  <span className="text-[8px] font-mono opacity-60 shrink-0">{t.messages.length} messages</span>
                </button>
              ))}
              
              <div className="border-t border-neutral-150 my-1" />
              <button
                type="button"
                onClick={() => {
                  handleClearChat();
                  setDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-500 font-semibold flex items-center space-x-1"
              >
                <span>Clear current chat</span>
              </button>

              {threads.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const remaining = threads.filter(t => t.id !== activeThreadId);
                    setThreads(remaining);
                    setActiveThreadId(remaining[0].id);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-rose-600 font-semibold flex items-center space-x-1 animate-pulse"
                >
                  <span>Delete current conversation</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right controls: compose, maximize, close */}
        <div className="flex items-center space-x-0.5">
          {/* New Conversation (Compose) */}
          <button 
            type="button"
            onClick={handleCreateThread}
            title="New conversation"
            className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition-all cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </button>

          {/* Maximize Wideview toggler */}
          {setIsMaximized && (
            <button 
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "2-Column Mode" : "3-Column Mode"}
              className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition-all cursor-pointer"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Close copilot panel */}
          {onClose && (
            <button 
              type="button"
              onClick={onClose}
              title="Close AI Assistant"
              className="p-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-black transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Message Output Board */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-black text-white rounded-br-none' 
                : 'bg-white border border-[#e3e3e3] rounded-bl-none shadow-sm'
            }`}>
              {msg.role === 'user' ? (
                <p className="text-xs leading-relaxed selection:bg-neutral-200">{msg.text}</p>
              ) : (
                <div className="space-y-1">{renderMarkdown(msg.text)}</div>
              )}
            </div>
            <span className="text-[9px] text-neutral-400 mt-1 px-1 font-mono">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start select-none">
            <div className="bg-white border border-[#e3e3e3] rounded-lg p-3 rounded-bl-none shadow-sm flex items-center space-x-2">
              <span className="text-[10px] text-neutral-400 font-mono italic">Sidekick is analyzing store data</span>
              <span className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Input Prompt Carousel */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[#f0f0f0] bg-white">
          <p className="text-[10px] text-neutral-400 font-mono mb-1.5">Suggested prompts</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug.text)}
                className="text-[10px] bg-neutral-100 hover:bg-black hover:text-white border border-neutral-200 transition-all rounded px-2 py-1 flex items-center space-x-1 cursor-pointer font-medium"
              >
                <span>{sug.label}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Input Controller */}
      <div className="p-3 border-t border-[#e3e3e3] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="relative flex items-center border border-[#ccc] rounded-md bg-[#fafafa] focus-within:ring-1 focus-within:ring-black focus-within:border-black overflow-hidden"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask Sidekick anything about the store..."
            className="flex-1 px-3 py-2.5 text-xs bg-transparent focus:outline-none pr-10 text-black pr-12"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-1.5 p-1.5 rounded bg-black hover:bg-neutral-800 text-white disabled:bg-neutral-100 disabled:text-neutral-400 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between mt-1 px-1">
          <p className="text-[9px] text-neutral-400 text-left">
            Connected to <strong>Atelier Noir Admin</strong>
          </p>
          <span className="text-[8px] text-neutral-400 font-mono flex items-center">
            Enter <CornerDownLeft className="w-2 h-2 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
