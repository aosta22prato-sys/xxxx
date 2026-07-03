import React, { useState } from 'react';
import { MessageSquareCode, Star, Sparkles, RefreshCw } from 'lucide-react';

export default function AppEmbedPanel() {
  const [activeApp, setActiveApp] = useState<'reviews' | 'sync'>('reviews');
  const [generatingReplyId, setGeneratingReplyId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [syncStatus, setSyncStatus] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(100);

  const mockReviews = [
    {
      id: 'rev-1',
      author: 'Clara Oswald',
      rating: 5,
      product: 'Ceramic Pour-Over Coffee Brewer',
      date: '2026-06-14',
      comment: '极致优雅的拿铁配色，磨砂手感非常有质感。每天早上流速稳定，Atelier Noir 的审美确实一流。',
      pushed: false
    },
    {
      id: 'rev-2',
      author: 'Aris Thorne',
      rating: 4,
      product: 'Sartorial Linen Trench',
      date: '2026-06-12',
      comment: '剪裁得体，面料略薄但是透气度极佳。在夏季和秋季交界处穿很合适。希望包装能更精美一点。',
      pushed: false
    }
  ];

  const triggerReviewReplyAI = (revId: string, comment: string) => {
    setGeneratingReplyId(revId);
    setTimeout(() => {
      let reply = '';
      if (comment.includes('Coffee')) {
        reply = '尊敬的 Clara，非常高兴这尊墨黑咖啡壶能与您的清晨时光相伴。我们的慢烧瓷器讲究独特的重力流速，期待能持续为您带来纯粹的萃取体验。—— Atelier Nord 敬上';
      } else {
        reply = '尊敬的 Aris，感谢您对战壕风衣剪裁的喜爱！针对包装，我们正在推行100%可循环再生无漂白牛皮纸礼盒，下季新品即刻实装，期待您的再次造访。—— Atelier Nord 敬上';
      }
      setReplies(prev => ({ ...prev, [revId]: reply }));
      setGeneratingReplyId(null);
    }, 1200);
  };

  const handleSyncProcess = () => {
    setSyncStatus(true);
    setSyncProgress(10);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncStatus(false);
          alert('🌟 跨渠道全域库存同步完成！Amazon仓库 与 巴黎 Showroom 现已就水平均衡。');
          return 100;
        }
        return prev + 25;
      });
    }, 450);
  };

  return (
    <div className="space-y-4">
      {/* Embedded Apps Selection tabs */}
      <div className="flex border-b border-[#e3e3e3] bg-white p-1 rounded-lg border">
        <button
          onClick={() => setActiveApp('reviews')}
          className={`flex-1 py-1.5 text-center font-medium rounded-md transition-all text-[11px] ${
            activeApp === 'reviews' 
              ? 'bg-[#1a1a1a] text-white font-semibold' 
              : 'text-[#616161] hover:bg-neutral-100'
          }`}
        >
          Customer Reviews AI
        </button>
        <button
          onClick={() => setActiveApp('sync')}
          className={`flex-1 py-1.5 text-center font-medium rounded-md transition-all text-[11px] ${
            activeApp === 'sync' 
              ? 'bg-[#1a1a1a] text-white font-semibold' 
              : 'text-[#616161] hover:bg-neutral-100'
          }`}
        >
          Multichannel Sync
        </button>
      </div>

      {/* Tab A: Customer reviews moderator */}
      {activeApp === 'reviews' && (
        <div className="space-y-3.5">
          <div className="bg-[#eef3ff] border border-[#d4e1ff] p-3 rounded-lg flex items-start space-x-2">
            <MessageSquareCode className="w-4 h-4 text-indigo-600 mt-0.5" />
            <div>
              <span className="font-bold text-[10px] font-mono uppercase text-indigo-700">AI Reply Draft Generator</span>
              <p className="text-[10px] text-neutral-600 font-sans mt-0.5 leading-normal">
                Analyze store sentiment and generate brand voice appropriate replies that sync in real-time.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {mockReviews.map(rev => (
              <div key={rev.id} className="bg-white border border-[#e3e3e3] p-3 rounded-lg space-y-2.5 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-neutral-950 font-sans">{rev.author}</span>
                    <div className="flex items-center text-yellow-500 space-x-0.5 mt-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono mt-0.5">{rev.date}</span>
                </div>

                <div>
                  <span className="text-[9px] text-neutral-400 font-mono uppercase">Item: {rev.product}</span>
                  <p className="text-[11px] text-neutral-700 font-sans leading-relaxed mt-0.5">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Action Generate Draft AI */}
                <div className="border-t border-neutral-100 pt-2.5">
                  {replies[rev.id] ? (
                    <div className="space-y-1.5">
                      <span className="font-bold text-[9px] text-[#123812] uppercase font-mono px-1 py-0.2 bg-[#e2ffe9] rounded inline-block">Suggested Brand Reply:</span>
                      <p className="text-[10px] bg-neutral-50 border border-neutral-200 p-2.5 rounded text-neutral-800 leading-normal italic font-sans whitespace-pre-wrap">
                        "{replies[rev.id]}"
                      </p>
                      <div className="flex justify-end space-x-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(replies[rev.id]);
                            alert("Copied suggested reply toast!");
                          }}
                          className="text-[9px] bg-white border border-neutral-300 font-medium rounded px-2 py-1 hover:bg-neutral-50 active:scale-95 transition-all"
                        >
                          Copy reply
                        </button>
                        <button
                          onClick={() => alert("Published successfully. Answer is synced live to item description review section!")}
                          className="text-[9px] bg-neutral-950 text-white font-medium rounded px-2.5 py-1 hover:bg-black active:scale-95 transition-all"
                        >
                          Publish Answer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => triggerReviewReplyAI(rev.id, rev.comment)}
                      disabled={generatingReplyId === rev.id}
                      className="w-full text-center py-1.5 bg-neutral-100 font-medium hover:bg-neutral-950 hover:text-white border border-neutral-300 transition-all text-[10px] rounded flex items-center justify-center space-x-2 text-neutral-700"
                    >
                      {generatingReplyId === rev.id ? (
                        <>
                          <div className="w-2.5 h-2.5 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Generate AI response</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab B: Multichannel Inventory syncer */}
      {activeApp === 'sync' && (
        <div className="space-y-3.5">
          <div className="bg-white border border-[#e3e3e3] p-4 rounded-lg space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-tight text-neutral-900 font-sans">跨渠道全域库存协调</h4>
                <span className="text-[9px] text-[#616161] font-mono">Last Synchronized: Active 12m ago</span>
              </div>
              <RefreshCw className={`w-4 h-4 text-neutral-500 pointer-events-none ${syncStatus ? 'animate-spin' : ''}`} />
            </div>

            {/* Line visual meters */}
            <div className="space-y-2.5 pt-2">
              {[
                { node: 'Online Shopify website', qty: '392 Units', fill: 'bg-green-600' },
                { node: 'Amazon Global Store FBA', qty: '120 Units', fill: 'bg-indigo-600' },
                { node: 'Paris Boutique Showroom', qty: '49 Units', fill: 'bg-yellow-500' },
                { node: 'West Warehouse Logistics', qty: '1,280 Units', fill: 'bg-[#1a1a1a]' }
              ].map((nod, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-neutral-600">
                    <span>{nod.node}</span>
                    <strong className="font-extrabold text-neutral-950">{nod.qty}</strong>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className={`h-full ${nod.fill} transition-all duration-1000`} style={{ width: syncStatus ? `${syncProgress}%` : '100%' }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleSyncProcess}
                disabled={syncStatus}
                className="shopify-btn-primary w-full py-2 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{syncStatus ? 'Recalculating stock logs...' : 'Force Sync All Channels now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
