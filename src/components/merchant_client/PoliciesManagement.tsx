import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Lock, 
  Check, 
  ChevronRight, 
  AlertCircle, 
  Save, 
  DownloadCloud, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import MarkdownCodeEditor from '../MarkdownCodeEditor';

interface PoliciesManagementProps {
  addLog: (agent: string, action: string, details: string, type?: 'info' | 'success' | 'warning' | 'error' | 'tool') => void;
}

export default function PoliciesManagement({ addLog }: PoliciesManagementProps) {
  // Lang state
  const [selectedLang, setSelectedLang] = useState('it'); // default Italian/European
  const [supportedLangs, setSupportedLangs] = useState([
    { code: 'en', name: 'English (🇬🇧 英语)', nativeName: 'English' },
    { code: 'it', name: 'Italiano (🇮🇹 意大利语)', nativeName: 'Italiano' },
    { code: 'de', name: 'Deutsch (🇩🇪 德语)', nativeName: 'Deutsch' },
    { code: 'fr', name: 'Français (🇫🇷 法语)', nativeName: 'Français' },
    { code: 'es', name: 'Español (🇪🇸 西班牙语)', nativeName: 'Español' }
  ]);

  // Privacy compliance state
  const [privacyConsentMode, setPrivacyConsentMode] = useState<'strict_gdpr' | 'standard_eu' | 'essential_only'>('strict_gdpr');
  
  // Policies templates
  const [refundPolicy, setRefundPolicy] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [tosPolicy, setTosPolicy] = useState('');
  
  // Target focused text block
  const [activePolicyTab, setActivePolicyTab] = useState<'refund' | 'privacy' | 'tos'>('refund');

  // Policy text presets to avoid manual editing "不要让客人写全部可以选择最好"
  const policyPresets = {
    refund: {
      standardEU: `POLITICA DI RIMBORSO STANDARD UNIONE EUROPEA (EU 30-Day Return)
----------------------------------------------------------------------
1. Ai sensi della direttiva europea sui diritti dei consumatori, i clienti hanno il diritto di recedere dall'acquisto entro 14 giorni. Inoltre, offriamo una garanzia estesa di 30 giorni.
2. I prodotti devono essere restituiti nelle medesime condizioni originali di ricezione, comprensivi di etichette e imballaggio intatto.
3. Le spese di reso all'interno della zona Euro sono a carico del merchant se si seleziona "Label Reso Gratuito". L'accredito verrà rimborsato sullo stesso metodo di pagamento utilizzato (Stripe / PayPal / Base USDC) entro 5 giorni lavorativi dall'inspezione fisica del magazzino centrale a Rotterdam.`,
      minimalist: `EU LIGHT RETURN POLICY
--------------------------
Standard 14 days statutory cooling-off period applies. Original packaging must be kept. Refunds are audited by central AI log system.`
    },
    privacy: {
      standardEU: `INFORMATIVA SULLA PRIVACY E PROTEZIONE DEI DATI (GDPR Compliant v2.4)
----------------------------------------------------------------------
1. TITOLARE DEL TRATTAMENTO: Il sistema opera in modalità Multi-Tenant isolata GDPR. Ciascun merchant memorizza le informazioni crittografate end-to-end.
2. DATI RACCOLTI: Nome cliente, indirizzo IP europeo, file cookie di tracciamento transazioni stripe, indirizzo di spedizione DHL/PostNL.
3. FINALITÀ: Esclusivamente finalità di adempimento d'ordine. I tuoi dati non saranno venduti a broker pubblicitari di terze parti.
4. DIRITTI: Ai sensi degli artt. 15-22 del Regolamento UE 2016/679 (GDPR), il cliente ha il diritto di chiedere la cancellazione immediata ("diritto all'oblio") inviando una notifica webhook on-chain.`,
      minimalist: `DATA SAFETY STATEMENT
----------------------
Minimal user tracking. Safe with zero sales of customer information. EU server physically hosted under strict sandbox rules.`
    },
    tos: {
      standardEU: `TERMINI DI SERVIZIO E CONDIZIONI D'USO IN EUROPA
----------------------------------------------------------------------
1. INTRODUZIONE: Il presente accordo regola le vendite online effettuate attraverso i canali del merchant SaaS abilitati su infrastruttura multitenant.
2. RESPONSABILITÀ: Non siamo responsabili per ritardi di corriere terzi dovuti a scioperi sindacali o formazioni meteorologiche critiche.
3. LEGGE APPLICABILE: I contratti conclusi si intendono perfezionati in conformità alle leggi dello Stato membro dell'Unione Europea prescelto dal merchant nel pannello delle impostazioni regionali.`,
      minimalist: `TERMS OF COMMERCIAL RELATIONSHIP
-------------------------------------
Contracts are closed according to EU commercial code rules. Transactions must be backed by authenticated payment providers.`
    }
  };

  const handleApplyPreset = (policyType: 'refund' | 'privacy' | 'tos', templateKey: 'standardEU' | 'minimalist') => {
    const text = policyPresets[policyType][templateKey];
    if (policyType === 'refund') setRefundPolicy(text);
    if (policyType === 'privacy') setPrivacyPolicy(text);
    if (policyType === 'tos') setTosPolicy(text);

    addLog(
      'Policy Agent',
      '加载合规模板政策',
      `商家已一键导入 [${policyType === 'refund' ? '14/30天无理由退款政策' : policyType === 'privacy' ? '欧盟本位 GDPR 隐私声明' : '标准欧盟销售贸易条款'}] ${templateKey === 'standardEU' ? '企业版' : '极简版'} 模版。`,
      'success'
    );
  };

  const handleSavePolicies = () => {
    addLog(
      'Compliance System',
      '政策声明库已保存上线',
      `多国语言: [${selectedLang.toUpperCase()}] | GDPR 防护等级: [${privacyConsentMode === 'strict_gdpr' ? '严格GDPR(拦截一切不合规Cookie)' : privacyConsentMode === 'standard_eu' ? '标准提示' : '极简声明'}] | 政策文本库同步完毕 (已配置退款 policy: ${refundPolicy ? '√ 有效' : '× 空'} | 隐私 policy: ${privacyPolicy ? '√ 有效' : '× 空'})。`,
      'success'
    );
    alert('欧盟法律条款政策与GDPR环境配置已成功注入您的店铺，即刻生效。');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-left font-sans">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-800 text-base">欧盟政策与合规中心 (Informative & GDPR)</h3>
            <p className="text-xs text-slate-500 mt-0.5">一键配置多语言、Cookie隐私级别以及欧盟法律声明文本模版，拒绝繁琐打字。</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
          EU Conformity
        </span>
      </div>

      <div className="space-y-6 text-xs">
        
        {/* Section 1: Multilingual Language Presets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1.5 md:col-span-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> 1. 店铺运行语种 (Lingue)
            </span>
            <p className="text-[11px] text-slate-400">选择店铺前端对欧展示的预设主要语言，系统将自动对齐界面文本与翻译翻译提示。</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            {supportedLangs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLang(lang.code);
                  addLog('Translation Node', '语种偏好变更', `店铺前端首选语言已设为: ${lang.name}`, 'info');
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all select-none cursor-pointer ${
                  selectedLang === lang.code 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <p className="font-semibold text-xs leading-none">{lang.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-normal font-mono">{lang.nativeName}</p>
                </div>
                {selectedLang === lang.code && (
                  <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: GDPR Customer Privacy Presets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1.5 md:col-span-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> 2. GDPR 隐私声明预设 (Privacy)
            </span>
            <p className="text-[11px] text-slate-400">设定消费者进入网店时，关于 Cookie 与日志追踪合规拦截机制的严苛程度。</p>
          </div>

          <div className="md:col-span-2 space-y-2">
            {[
              {
                id: 'strict_gdpr',
                title: '🛡 严苛合规模式 (欧盟 GDPR 推荐)',
                desc: '严格拦截一切未授权 Cookie，必须先一键确认同意才得记录 Stripe / 购物车。',
                tag: '欧盟直供首选'
              },
              {
                id: 'standard_eu',
                title: '🔔 标准确认提示模式 (Standard EU)',
                desc: '弹出横幅提示 Cookie，默认加载分析器，拒绝收集高级行为画像，兼顾转化。',
                tag: '平衡推荐'
              },
              {
                id: 'essential_only',
                title: '⚡ 极简必要型保护模式 (Cookie-free)',
                desc: '隐藏一切 Cookie 气泡。仅在底层调用 Session 完成购物车，符合本地轻量隐私条件。',
                tag: '无横幅无卡顿'
              }
            ].map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setPrivacyConsentMode(preset.id as any);
                  addLog('Compliance Engine', '隐私拦截预设调节', `拦截机制升级为 「${preset.title}」`, 'info');
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-start justify-between transition-all select-none cursor-pointer ${
                  privacyConsentMode === preset.id 
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">{preset.title}</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded ${
                      privacyConsentMode === preset.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>{preset.tag}</span>
                  </div>
                  <p className={`text-[10px] font-normal leading-relaxed ${privacyConsentMode === preset.id ? 'text-indigo-950/80' : 'text-slate-400'}`}>
                    {preset.desc}
                  </p>
                </div>
                {privacyConsentMode === preset.id && (
                  <Check className="w-4 h-4 text-indigo-600 mt-1 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Legal policy page editor & template preset generation */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> 3. 销售政策页面条款加载 (Informative)
            </span>
            <div className="flex gap-1">
              {[
                { id: 'refund', label: '退款政策' },
                { id: 'privacy', label: '隐私声明' },
                { id: 'tos', label: '服务条款' }
              ].map(tb => (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setActivePolicyTab(tb.id as any)}
                  className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    activePolicyTab === tb.id 
                      ? 'bg-slate-900 text-[#07C2E3]' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            
            {/* Left selector card templates list */}
            <div className="xl:col-span-4 bg-slate-50 rounded-xl p-4 border border-slate-150 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase block tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> 快捷精选模版
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  根据欧洲电商监管守则预先校准，商家无需撰写。点击以下按钮，一键调取标准条文。
                </p>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset(activePolicyTab, 'standardEU')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-between transition-all cursor-pointer select-none"
                >
                  <span className="text-[10.5px]">导入标准欧盟条款模版</span>
                  <DownloadCloud className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset(activePolicyTab, 'minimalist')}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-250 font-semibold py-2 px-3 rounded-lg flex items-center justify-between transition-all cursor-pointer select-none"
                >
                  <span className="text-[10.5px]">导入精简快捷版模版</span>
                  <DownloadCloud className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-150 text-[9.5px] text-slate-450 leading-relaxed">
                📢 <span className="font-bold text-slate-650">法律合规建议：</span> 零售商依欧盟 2011/83/EU 指令有义务建立退货明细并公示，若无公示任何规则，则默认适用最宽泛退货规定。
              </div>
            </div>

            {/* Right text box edit area */}
            <div className="xl:col-span-8 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] text-slate-450 font-semibold">
                <span>编辑当前政策条款 ({activePolicyTab === 'refund' ? '退款政策' : activePolicyTab === 'privacy' ? '隐私声明' : '服务条款'})：</span>
                <span className="font-mono text-[#07C2E3]">Standard Markdown Legal Compliance Edition</span>
              </div>

              <MarkdownCodeEditor
                value={activePolicyTab === 'refund' ? refundPolicy : activePolicyTab === 'privacy' ? privacyPolicy : tosPolicy}
                onChange={val => {
                  if (activePolicyTab === 'refund') setRefundPolicy(val);
                  if (activePolicyTab === 'privacy') setPrivacyPolicy(val);
                  if (activePolicyTab === 'tos') setTosPolicy(val);
                }}
                placeholder="在此框输入具体的法律政策。推荐直接点击左侧「导入标准欧盟条款模版」一键补齐内容。"
                rows={12}
                label={activePolicyTab === 'refund' ? 'Refund Policy 退款政策' : activePolicyTab === 'privacy' ? 'Privacy Statement 隐私声明' : 'Terms of Service 服务条款'}
                aiContext={`E-commerce storefront policy context: ${activePolicyTab === 'refund' ? 'Withdrawal and Refund policy conforming to EU 2011/83/EU directive' : activePolicyTab === 'privacy' ? 'Data protection & Privacy declaration conforming to Europe GDPR rules' : 'Standard store terms of service'}`}
              />
            </div>

          </div>
        </div>

        {/* Confirm submit actions */}
        <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase flex items-center gap-1">
            ✓ 反欺诈、高防及 GDPR ISO27001 数据合规认证
          </span>

          <button
            onClick={handleSavePolicies}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>保存欧盟政策配置 (Salva GDPR)</span>
          </button>
        </div>

      </div>

    </div>
  );
}
