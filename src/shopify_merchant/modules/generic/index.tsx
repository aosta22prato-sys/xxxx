/**
 * Professional Decoupled Generic Module - Level 10 Separate Setup
 * High-fidelity business dashboards for marketing, finance, analytics, content, markets, and integrations.
 */

import React, { useState } from 'react';
import { Database, Filter, Search } from 'lucide-react';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';

interface GenericModuleViewProps {
  moduleKey: string;
}

export default function GenericModuleView({ moduleKey }: GenericModuleViewProps) {
  const [query, setQuery] = useState('');

  // Auto layout configuration engine using schema metadata mapping (Level 10)
  const schemaConfigurations: Record<string, {
    title: string;
    tagline: string;
    kpis: { label: string; value: string; trend: string; isPositive: boolean }[];
    columns: string[];
    records: Record<string, any>[];
  }> = {
    marketing: {
      title: '多渠道精准营销 (Marketing Hub)',
      tagline: 'Active campaigns tracking across social layers',
      kpis: [
        { label: '投放转化 ROAS', value: '4.82x', trend: '12%', isPositive: true },
        { label: '邮件回追挽回率', value: '28.4%', trend: '4.3%', isPositive: true },
        { label: '每次点击成本 CPC', value: '€0.18', trend: '8.1%', isPositive: false },
      ],
      columns: ['广告活动 Campaign', '媒体渠道 Channel', '实付成本 Spent', '触达曝光 Impressions', '点击转化 CTR', '状态 Status'],
      records: [
        { campaign: '布鲁塞尔秋季高定奢革包', channel: 'Instagram Feed', spent: '€450.00', impressions: '154,200', ctr: '1.8%', status: 'active' },
        { campaign: '新户直降 15% 自动回追', channel: 'Klaviyo Email', spent: '€120.00', impressions: '38,100', ctr: '4.2%', status: 'active' },
        { campaign: '欧洲可持续生活理念倡导', channel: 'TikTok Ads', spent: '€550.00', impressions: '210,500', ctr: '2.1%', status: 'paused' },
      ],
    },
    finance: {
      title: '欧洲及多国财务对账 (Finance Control)',
      tagline: 'Standard VAT filings and transaction auditing',
      kpis: [
        { label: '已清算毛利 (Net Liquated)', value: '€28,450.00', trend: '18.1%', isPositive: true },
        { label: '标准欧盟 VAT 扣除金', value: '€6,259.00', trend: '11.8%', isPositive: true },
        { label: '汇率顺差损益 (Forex Gain)', value: '+€154.20', trend: '1.2%', isPositive: true },
      ],
      columns: ['对账编号 Ref', '交易时间 Created', '结算币种 Currency', '净额 (Net)', '税率 (VAT)', '状态 Status'],
      records: [
        { ref: 'TXN-489012', created: '2026-06-16', currency: 'EUR', net: '€1,250.00', vat: '22% (IT)', status: 'cleared' },
        { ref: 'TXN-489013', created: '2026-06-15', currency: 'USD', net: '$840.00', vat: '0% (Exempt)', status: 'cleared' },
        { ref: 'TXN-489014', created: '2026-06-14', currency: 'CNY', net: '¥14,200.00', vat: '13% (CN)', status: 'pending' },
      ],
    },
    analytics: {
      title: '决策层多维度商业度量 (Commerce Analytics)',
      tagline: 'Historical performance indicators and custom segment report',
      kpis: [
        { label: '日活跃访问量 UV', value: '18,542', trend: '22.4%', isPositive: true },
        { label: '结账转化漏斗 Conversion', value: '3.42%', trend: '0.85%', isPositive: true },
        { label: '单客边际价值 CLV', value: '€154.00', trend: '3.2%', isPositive: true },
      ],
      columns: ['度量指标 KPI', '统计序列 Segment', '样本总数 Items', '本周数值 Current', '上周数值 Previous', '差异 Status'],
      records: [
        { kpi: '购物车加购流失率', segment: 'All Products', items: '2,400 sessions', current: '68.2%', previous: '72.4%', status: 'improved' },
        { kpi: '高定意愿支付客体 LTV', segment: 'European VIPs', items: '342 clients', current: '€345.00', previous: '€320.00', status: 'improved' },
      ],
    },
    content: {
      title: '内容与店面资产资产 (Content Space)',
      tagline: 'Page routing structure and file metaobjects directory',
      kpis: [
        { label: '已备案元对象 Metaobjects', value: '18 types', trend: '2 new', isPositive: true },
        { label: '动态产品页模版 Styles', value: '5 variants', trend: '1 up', isPositive: true },
        { label: '资源库总配额 CDN Assets', value: '840 MB', trend: '124 KB', isPositive: false },
      ],
      columns: ['对象标识 Key', '关联类型 Association', '描述详情 Description', '已登记Metafields', '变更事件 Modified', '状态 Status'],
      records: [
        { key: 'product.materials.leather', association: 'Products Detail', description: '高品质全粒面精磨革材质描述模版', fields: '4 keys', modified: '4 hours ago', status: 'published' },
        { key: 'theme.global.editorial', association: 'Layout Config', description: '大西洋主视觉及高对比度极简排版规则', fields: '12 keys', modified: 'Yesterday', status: 'published' },
      ],
    },
    markets: {
      title: '跨国区域主权市场 (Markets Control)',
      tagline: 'Localized domains and checkout adjustments',
      kpis: [
        { label: '已开启国际市场 Active Markets', value: '3 Zones', trend: '1 up', isPositive: true },
        { label: '本地定价比率 Adjustments', value: 'Auto Tax', trend: '100% accurate', isPositive: true },
        { label: '本周跨国发货比重 Rate', value: '28.4%', trend: '2.4%', isPositive: true },
      ],
      columns: ['主权市场 Country', '核心本币 Local Currency', '结算价格倍率 Factor', '本埠物流 Carrier', '本地政策 (Tax)', '准入 Status'],
      records: [
        { country: '欧洲统一市场 (EU Zones)', local: 'EUR (€)', factor: '100% (Base)', carrier: 'DHL Express', tax: 'VAT Collected', status: 'active' },
        { country: '大西洋美加市场 (US/CA)', local: 'USD ($)', factor: '105% (FX Adj)', carrier: 'FedEx Cargo', tax: 'Destination Tax', status: 'active' },
        { country: '亚太及大中华区 (Greater China)', local: 'CNY (¥)', factor: '102%', carrier: 'SF-Express', tax: 'Inland Customs Clear', status: 'active' },
      ],
    },
    apps: {
      title: '外部应用与接口扩展 (App Integration)',
      tagline: 'Custom hooks and connected SDK keys',
      kpis: [
        { label: '已对接服务 App Integrations', value: '8 个应用', trend: '稳定运行', isPositive: true },
        { label: '平均接口延迟 API Latency', value: '110ms', trend: '正常范围', isPositive: true },
        { label: '接口调用成功率 Success Rate', value: '100%', trend: '无故障', isPositive: true },
      ],
      columns: ['外部应用 App Name', '服务级别 Rating', '接口密钥 Credentials', '数据协议 Protocol', '同步频率 Standard', '状态 Status'],
      records: [
        { app: 'TaxJar EU Compliance Engine', rating: 'Certified Partner', credentials: 'Token (Encrypted)', protcol: 'GraphQL API', standard: '每笔交易实时对账', status: 'active' },
        { app: 'Klaviyo Omni-Channel Marketing', rating: 'Premium Partner', credentials: 'Read / Write', protcol: 'REST API', standard: '每日结算对账', status: 'active' },
      ],
    },
  };

  const currentModule = schemaConfigurations[moduleKey] || {
    title: `${moduleKey.toUpperCase()} 业务看板`,
    tagline: 'Autonomous data flow metrics',
    kpis: [{ label: '连接状态', value: 'STANDBY', trend: '100%', isPositive: true }],
    columns: ['编号 No', '关联信息 Info', '说明 Status'],
    records: [{ id: '1', info: '当前功能已自动和 Admin OS 架构对齐', status: 'ACTIVE' }],
  };

  // Generic dynamic filter engine logic
  const filteredRecords = currentModule.records.filter((rec) => {
    const valString = Object.values(rec).join(' ').toLowerCase();
    return valString.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#888]">{moduleKey.toUpperCase()} METADATA AGENT</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-mono uppercase">{currentModule.title}</h2>
        </div>
        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-neutral-400 bg-white p-1 px-2.5 rounded border border-neutral-200">
          <Database className="w-3.5 h-3.5 text-neutral-500" />
          <span>SCHEMA RECLAMATION: AUTOMATIC</span>
        </div>
      </div>

      {/* Stats KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentModule.kpis.map((k, index) => (
          <StatCard 
            key={index}
            label={k.label} 
            value={k.value} 
            changeText={k.trend} 
            isPositive={k.isPositive} 
          />
        ))}
      </div>

      {/* Dynamic Filter Search tool */}
      <div className="flex bg-white border border-neutral-200 rounded-lg p-2 items-center justify-between shadow-sm">
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-neutral-450 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={`在此对 ${currentModule.title.split(' ')[0]} 记录进行过滤...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded px-2.5 py-1.5 pl-9 text-xs focus:ring-1 focus:ring-black focus:outline-none font-mono"
          />
        </div>
        <div className="flex items-center space-x-2 text-[10px] font-mono text-neutral-400">
          <Filter className="w-3 h-3 text-[#333]" />
          <span>自动生成数据项：{filteredRecords.length} 项</span>
        </div>
      </div>

      {/* Configurable Dynamic Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px] min-w-[600px]">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 font-mono text-[9px] uppercase tracking-wider text-neutral-400">
              {currentModule.columns.map((c, i) => (
                <th key={i} className={`p-3 ${i === currentModule.columns.length - 1 ? 'text-right' : ''}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150">
            {filteredRecords.map((rec, rIdx) => {
              const keys = Object.keys(rec);
              return (
                <tr key={rIdx} className="hover:bg-neutral-50/70 transition-colors">
                  {keys.map((k, kIdx) => {
                    const val = rec[k];
                    const isLast = kIdx === keys.length - 1;
                    return (
                      <td key={kIdx} className={`p-3 ${isLast ? 'text-right' : ''}`}>
                        {val === 'active' || val === 'cleared' || val === 'published' || val === 'improved' ? (
                          <Badge variant="success">{val}</Badge>
                        ) : val === 'paused' || val === 'pending' ? (
                          <Badge variant="warning">{val}</Badge>
                        ) : (
                          <span className={`font-mono ${kIdx === 0 ? 'font-bold text-neutral-900' : 'text-neutral-600'}`}>
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
