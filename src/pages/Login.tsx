import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { localDb } from '../db/localDb';

interface LoginProps {
  onNavigate: (page: 'home' | 'register' | 'login') => void;
  prefilledEmail?: string;
}

export default function Login({ onNavigate, prefilledEmail = '' }: LoginProps) {
  // Form state
  const [identifier, setIdentifier] = useState(prefilledEmail);
  const [password, setPassword] = useState('');
  
  // Interaction states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier) {
      setErrorMsg('请输入企业邮箱或手机号码');
      return;
    }
    if (!password) {
      setErrorMsg('请输入登录密码');
      return;
    }

    setIsSubmitting(true);

    // Simulated API response delay
    setTimeout(() => {
      const user = localDb.authenticate(identifier, password);
      setIsSubmitting(false);

      if (user) {
        setSuccessMsg(`企业空间验证成功！正在校验底层沙箱安全证书...`);
      } else {
        setErrorMsg('账号或密码不正确，或账户未完成认证登记');
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-950">
      
      {/* Navbar overlay */}
      <nav className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="bg-indigo-600 p-1.5 rounded text-white flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800">
              AI BUSINESS OS
            </span>
          </div>
          <button 
            onClick={() => onNavigate('home')} 
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            返回首页
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              商家控制中心登录
            </h2>
            <p className="mt-2.5 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              通过您的受保护安全凭底座登录，获取行业中台控制权并同步AI骨干群。
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>

            {successMsg ? (
              <div id="login-success-pane" className="py-8 text-center animate-fade-in space-y-4">
                <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 mb-2">
                  <CheckCircle2 className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{successMsg}</h3>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>系统状态通知</span>
                  </div>
                  <p className="text-xxs text-slate-500 leading-relaxed">
                    当前版本开发已按开发指令执行【第一阶段：注册验证与首页冷冻结】。
                  </p>
                  <p className="text-xxs text-indigo-600 font-semibold leading-relaxed">
                    系统已进入待审核终态，我们已暂停商家控制中心及六大行业后台开发。请等待下一步审核通过后继续开发第二阶段！
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4"
                  >
                    返回首页
                  </button>
                </div>
              </div>
            ) : (
              <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
                
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Email / Phone identifier */}
                <div>
                  <label htmlFor="identifier" className="block text-xs font-bold text-slate-700 mb-1.5">
                    企业账号 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="identifier"
                      name="identifier"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      placeholder="注册邮箱 或 负责人手机号"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                      登录密码 <span className="text-rose-500">*</span>
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        alert('如需协助，请联系系统审计管理员');
                      }}
                      className="text-xxs font-semibold text-slate-400 hover:text-indigo-600"
                    >
                      忘记密码？
                    </a>
                  </div>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      placeholder="请输入输入注册时设置的登录密码"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  id="submit-login-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-all disabled:bg-slate-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>正在进行多维握手加密校验...</span>
                    </>
                  ) : (
                    <>
                      <span>进入商家控制中心</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Go to register helper */}
          {!successMsg && (
            <div className="mt-6 text-center">
              <span className="text-xs text-slate-500">还没有建立企业空间？ </span>
              <button
                id="link-go-to-register"
                onClick={() => onNavigate('register')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                免费注册新空间
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Static clean footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-slate-400 text-xxs">
        <p>© 2026 AI BUSINESS OS Inc. 多租户物理沙盒审计系统。 您的所有数据与物理空间已通过硬件哈希密钥安全保护。</p>
      </footer>
    </div>
  );
}
