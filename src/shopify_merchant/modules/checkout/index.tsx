import React, { useEffect, useState } from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Settings, Sliders, Smartphone, Check, Layout, Palette, 
  HelpCircle, Sparkles, RefreshCw, Star, Info, ListFilter
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

export default function CheckoutView() {
  const { checkoutConfig, funnelMetrics, loading, hydrateCheckout, updateCheckoutConfig } = useCheckoutStore();
  const [accentCode, setAccentCode] = useState('#111111');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    hydrateCheckout();
  }, [hydrateCheckout]);

  useEffect(() => {
    if (checkoutConfig) {
      setAccentCode(checkoutConfig.brandingAccentColor);
    }
  }, [checkoutConfig]);

  const handleUpdate = (fields: any) => {
    updateCheckoutConfig(fields);
  };

  const handleSave = () => {
    handleUpdate({ brandingAccentColor: accentCode });
    setToastMsg('Checkout Optimization settings applied successfully!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!checkoutConfig) {
    return <div className="p-10 text-center font-mono text-neutral-450">Loading Checkout Customizer ...</div>;
  }

  // Beautiful single-hue gradient palette array for Recharts conversion bar graph
  const COLORS = ['#111111', '#1f2937', '#4b5563', '#6b7280', '#9ca3af'];

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div>
          <span className="text-[10px] font-sans tracking-widest text-neutral-400 font-bold">流程配置</span>
          <h2 className="text-sm font-bold tracking-tight text-[#111] font-sans">结账优化</h2>
        </div>
        <button
          onClick={handleSave}
          className="bg-black text-white hover:bg-neutral-800 px-3 py-1.5 rounded-lg flex items-center space-x-1 font-bold cursor-pointer transition-colors text-xs"
        >
          <Check className="w-3.5 h-3.5" />
          <span>保存</span>
        </button>
      </div>

      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-2.5 rounded-lg font-mono">
          {toastMsg}
        </div>
      )}

      {/* Main Grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        
        {/* Controls col */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Sizing Layout Options */}
          <div className="bg-white border rounded-lg p-3.5 space-y-4 shadow-xs">
            <h4 className="font-bold font-mono text-neutral-800 flex items-center space-x-1.5 border-b pb-1.5 uppercase">
              <Layout className="w-4 h-4 text-neutral-600" />
              <span>Checkout Layout Layout Style</span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => handleUpdate({ themeStyle: 'one_page' })}
                className={`p-3 border rounded-lg text-left transition-all relative cursor-pointer flex flex-col justify-between h-20 ${
                  checkoutConfig.themeStyle === 'one_page' ? 'border-black bg-neutral-50/50 shadow-xs' : 'hover:bg-neutral-50'
                }`}
              >
                <div>
                  <div className="font-bold text-neutral-900">One-Page Checkout</div>
                  <div className="text-[10px] text-neutral-500 line-clamp-2">All checkout steps compiled on a single responsive screen.</div>
                </div>
                {checkoutConfig.themeStyle === 'one_page' && <Badge variant="success" className="absolute top-2 right-2">Active</Badge>}
              </button>

              <button
                onClick={() => handleUpdate({ themeStyle: 'three_step' })}
                className={`p-3 border rounded-lg text-left transition-all relative cursor-pointer flex flex-col justify-between h-20 ${
                  checkoutConfig.themeStyle === 'three_step' ? 'border-black bg-neutral-50/50 shadow-xs' : 'hover:bg-neutral-50'
                }`}
              >
                <div>
                  <div className="font-bold text-neutral-900">3-Step Accordion</div>
                  <div className="text-[10px] text-neutral-500 line-clamp-2">Standard step-by-step breadcrumb progress tracking.</div>
                </div>
                {checkoutConfig.themeStyle === 'three_step' && <Badge variant="success" className="absolute top-2 right-2">Active</Badge>}
              </button>
            </div>
          </div>

          {/* Form Rules settings */}
          <div className="bg-white border rounded-lg p-3.5 space-y-3.5 shadow-xs">
            <h4 className="font-bold font-mono text-neutral-800 flex items-center space-x-1.5 border-b pb-1.5 uppercase">
              <Sliders className="w-4 h-4 text-neutral-600" />
              <span>Consumer Field Directives</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-neutral-500">Guest Checkout Status</label>
                <select
                  value={checkoutConfig.guestCheckout}
                  onChange={e => handleUpdate({ guestCheckout: e.target.value as any })}
                  className="border rounded p-1 bg-white outline-none focus:ring-1 focus:ring-black text-[11px]"
                >
                  <option value="allowed">Allowed (所有买家极速结账)</option>
                  <option value="required">Required (强制以游客结账)</option>
                  <option value="disabled">Disabled (必须注册账号登录)</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-neutral-500">Company Name Field</label>
                <select
                  value={checkoutConfig.companyNameField}
                  onChange={e => handleUpdate({ companyNameField: e.target.value as any })}
                  className="border rounded p-1 bg-white outline-none focus:ring-1 focus:ring-black text-[11px]"
                >
                  <option value="hidden">Hidden from view</option>
                  <option value="optional">Optional form item</option>
                  <option value="required">Required compulsory field</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-neutral-500">Enable Autocomplete</label>
                <select
                  value={checkoutConfig.addressAutocomplete ? 'true' : 'false'}
                  onChange={e => handleUpdate({ addressAutocomplete: e.target.value === 'true' })}
                  className="border rounded p-1 bg-white outline-none focus:ring-1 focus:ring-black text-[11px]"
                >
                  <option value="true">Active (Google Places Auto-resolve)</option>
                  <option value="false">Disabled (Manual text input)</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-neutral-500">Require Phone Number</label>
                <select
                  value={checkoutConfig.requirePhoneNumber ? 'true' : 'false'}
                  onChange={e => handleUpdate({ requirePhoneNumber: e.target.value === 'true' })}
                  className="border rounded p-1 bg-white outline-none focus:ring-1 focus:ring-black text-[11px]"
                >
                  <option value="true">Compulsory Require (新用户必填手机)</option>
                  <option value="false">Optional input (无需校验)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sizing Branding configuration */}
          <div className="bg-white border rounded-lg p-3.5 space-y-3.5 shadow-xs">
            <h4 className="font-bold font-mono text-neutral-800 flex items-center space-x-1.5 border-b pb-1.5 uppercase">
              <Palette className="w-4 h-4 text-neutral-600" />
              <span>Checkout Brand CSS Configuration</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-neutral-600">Checkout Accent Color (Hex)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={accentCode}
                    onChange={e => setAccentCode(e.target.value)}
                    className="w-7 h-7 rounded border cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={accentCode}
                    onChange={e => setAccentCode(e.target.value)}
                    className="border rounded px-2 py-1 text-xs uppercase font-mono w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-semibold text-neutral-600">Branding Padding Spacing</label>
                <select
                  value={checkoutConfig.brandingDensity}
                  onChange={e => handleUpdate({ brandingDensity: e.target.value as any })}
                  className="border rounded p-1.5 bg-white text-xs outline-none"
                >
                  <option value="spacious">Spacious (优雅高级留白)</option>
                  <option value="tight">Tight (紧凑高效表单)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Live Simulator View & Funnel Charts */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Conversion Funnel Recharts */}
          <div className="bg-white border rounded-lg p-4 space-y-2 shadow-xs">
            <div className="flex justify-between items-center border-b pb-1.5 mb-1">
              <span className="font-bold font-mono text-neutral-800 uppercase flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-neutral-700" />
                <span>Conversion checkout Funnel Analytics</span>
              </span>
              <span className="font-mono text-[#888] font-bold text-[10px]">TOTAL CR: 27.18%</span>
            </div>

            <div className="h-44 w-full relative min-w-0 min-h-0">
              <ResponsiveContainer width="100%" height={176}>
                <BarChart data={funnelMetrics} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="stage" type="category" width={110} tick={{ fontSize: 9, fill: '#4b5563', fontFamily: 'monospace' }} />
                  <Tooltip 
                    contentStyle={{ fontSize: '10px', backgroundColor: '#000', color: '#fff', borderRadius: '4px', fontFamily: 'monospace' }}
                    formatter={(val) => [`${val} visitors`, 'SampleSize']}
                  />
                  <Bar dataKey="visitors" radius={[0, 4, 4, 0]}>
                    {funnelMetrics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Mobile Checkout Live Simulator */}
          <div className="bg-white border rounded-lg p-4 space-y-3 shadow-xs">
            <span className="font-mono text-[#888] uppercase block text-[9px] font-bold">Checkout Mobile visual look simulator</span>
            
            <div className="border rounded-2xl p-4 bg-neutral-50/50 max-w-sm mx-auto relative space-y-3.5 shadow-sm leading-relaxed">
              <div className="absolute top-2 right-3 font-mono text-[7px] text-neutral-400">IPHONE PREVIEW SIMULATOR</div>
              
              {/* Checkout Logo segment */}
              <div className="flex justify-center border-b pb-2">
                <span className="font-serif font-extrabold text-sm uppercase tracking-widest text-[#111]">ATELIER NOIR</span>
              </div>

              {/* Express checkout button */}
              {checkoutConfig.enableExpressCheckout && (
                <div className="space-y-1.5. text-center">
                  <span className="text-[8px] text-neutral-400 font-mono">EXPRESS CHECKOUT AVAILABLE</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button 
                      style={{ backgroundColor: accentCode }}
                      className="text-white font-mono text-[9px] py-1.5 rounded-lg font-bold flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85"
                    >
                      Shop Pay
                    </button>
                    <button className="bg-amber-400 text-neutral-900 font-mono text-[9px] py-1.5 rounded-lg font-bold flex items-center justify-center cursor-pointer">
                      PayPal
                    </button>
                  </div>
                </div>
              )}

              {/* Form Input fields simulator */}
              <div className={`space-y-2 ${checkoutConfig.brandingDensity === 'tight' ? 'space-y-1' : 'space-y-3'}`}>
                <div className="text-[9px] font-bold text-neutral-500">SHIPPING INFORMATION</div>
                
                <input
                  type="email"
                  disabled
                  placeholder="Billing Customer Email"
                  className="w-full border rounded p-1.5 text-[10px] bg-white outline-none cursor-not-allowed"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled
                    placeholder="First Name"
                    className="w-full border rounded p-1.5 text-[10px] bg-white cursor-not-allowed"
                  />
                  <input
                    type="text"
                    disabled
                    placeholder="Last Name"
                    className="w-full border rounded p-1.5 text-[10px] bg-white"
                  />
                </div>

                <input
                  type="text"
                  disabled
                  placeholder="Address Line 1"
                  className="w-full border rounded p-1.5 text-[10px] bg-white"
                />

                {checkoutConfig.companyNameField !== 'hidden' && (
                  <input
                    type="text"
                    disabled
                    placeholder="Company Name (Optional)"
                    className="w-full border rounded p-1.5 text-[10px] bg-white"
                  />
                )}

                {checkoutConfig.requirePhoneNumber && (
                  <input
                    type="text"
                    disabled
                    placeholder="Phone number (+32 for Belgium)"
                    className="w-full border rounded p-1.5 text-[10px] bg-white"
                  />
                )}
              </div>

              {/* Complete payload button */}
              <button 
                style={{ backgroundColor: accentCode }}
                className="w-full text-white py-2 text-[10px] tracking-wider rounded-lg font-bold font-mono transition-opacity hover:opacity-85"
              >
                COMPILE AND ORDER PAY (实付 €350)
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
