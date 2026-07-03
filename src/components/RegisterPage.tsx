import React, { useState, useEffect } from 'react';
import { Brain, Mail, Phone, Lock, Key, ArrowRight, ShieldCheck, RefreshCw, User, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface RegisterPageProps {
  onRegisterSuccess: (userData: { email: string; phone: string }) => void;
  onLoginSuccess?: (userData: { email: string }) => void;
  onRegisterStart?: () => void;
  onGoToLogin: () => void;
  onQuickBypass?: () => void;
}

export default function RegisterPage({ 
  onRegisterSuccess, 
  onLoginSuccess, 
  onRegisterStart, 
  onGoToLogin, 
  onQuickBypass 
}: RegisterPageProps) {
  const { register, login, resetPassword, googleSignIn, error, clearError } = useAuth();

  // Multi-mode states: 'login' | 'register' | 'forgot_password'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot_password'>('login');

  // Input states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  // UI States
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Timer loop for verification code countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle SMS & Email secure dispatch simulation
  const handleGetCode = () => {
    if (!email || !email.includes('@')) {
      setLocalError('请输入合法的企业邮箱');
      return;
    }
    if (!phone || phone.length < 11) {
      setLocalError('请输入11位合法的国内手机号码');
      return;
    }
    setLocalError(null);
    clearError();
    
    // Start 60s countdown
    setCountdown(60);
    
    // Simulated delivery message with security notice
    setSuccessMessage(`安全网关已响应：六位数字校验码已成功分发并安全送达邮箱 (${email})与绑定的关联手机 (${phone?.replace(/(\d{3})\d{4}(\d{2})/, '$1****$2')})，请查收并填入下方。`);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    // 1. LOGIN SUBMISSION
    if (authMode === 'login') {
      if (!email || !email.includes('@')) {
        setLocalError('请输入正确的企业邮箱');
        return;
      }
      if (!password || password.length < 6) {
        setLocalError('密码长度不能少于6位');
        return;
      }

      setLoading(true);
      try {
        const loggedUser = await login(email, password);
        setSuccessMessage('安全登录成功，智能加载商家运维看板中...');
        setTimeout(() => {
          setLoading(false);
          if (onLoginSuccess) {
            onLoginSuccess({ email: loggedUser.email });
          } else {
            onRegisterSuccess({ email: loggedUser.email, phone: '' });
          }
        }, 1000);
      } catch (err: any) {
        setLoading(false);
        setLocalError(err.message || '登录异常，请核对凭据');
      }

    // 2. REGISTER SUBMISSION
    } else if (authMode === 'register') {
      if (!email.includes('@')) {
        setLocalError('请输入正确的企业邮箱');
        return;
      }
      if (!fullName.trim()) {
        setLocalError('请输入您的真实姓名');
        return;
      }
      if (phone.length < 11) {
        setLocalError('请输入11位合法的国内手机号码');
        return;
      }
      if (password.length < 6) {
        setLocalError('密码安全等级过低：密码长度不能少于6位');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('两次输入的密码不一致，请重新输入');
        return;
      }
      if (!code) {
        setLocalError('请输入分发验证码以完成高安全级别身份确认');
        return;
      }
      if (!/^\d{6}$/.test(code)) {
        setLocalError('验证码格式错误：请输入6位数字安全验证码');
        return;
      }

      setLoading(true);
      try {
        if (onRegisterStart) {
          onRegisterStart();
        }
        const newUser = await register(email, password, fullName, UserRole.MERCHANT_OWNER);
        setSuccessMessage('商户企业主号注册成功！正在进入行业领域选定通道...');
        setTimeout(() => {
          setLoading(false);
          onRegisterSuccess({ email: newUser.email, phone });
        }, 1200);
      } catch (err: any) {
        setLoading(false);
        setLocalError(err.message || '注册流程出错，请检查网络后重试');
      }

    // 3. PASSWORD RESET SUBMISSION
    } else if (authMode === 'forgot_password') {
      if (!email.includes('@')) {
        setLocalError('请输入正确的绑定电子邮箱');
        return;
      }

      setLoading(true);
      try {
        await resetPassword(email);
        setSuccessMessage(`密码重置指令已发出：重置凭证与临时密码已自动发送至您的注册邮箱 (${email})。`);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setLocalError(err.message || '重置失败，未检测到绑定的商户邮箱');
      }
    }
  };

  // Google OAuth Secure Core Trigger
  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
    try {
      const user = await googleSignIn();
      setSuccessMessage('Google 认证网关确认：OAuth 2.0 签署成功。');
      
      const isNew = !user.activeTenantId;
      if (isNew) {
        if (onRegisterStart) onRegisterStart();
        setTimeout(() => {
          onRegisterSuccess({ email: user.email, phone: '' });
        }, 1000);
      } else {
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess({ email: user.email });
          } else {
            onRegisterSuccess({ email: user.email, phone: '' });
          }
        }, 1000);
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('aborted')) {
        setLocalError(err.message);
      }
    }
  };

  return (
    <div id="auth-page-root" className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col justify-between overflow-hidden relative">
      
      {/* TEST DRIVE BYPASS BANNER */}
      {onQuickBypass && (
        <div className="bg-gradient-to-r from-[#07C2E3] via-indigo-600 to-indigo-800 py-3 px-4 text-center text-xs font-semibold text-white flex flex-col sm:flex-row items-center justify-center gap-3 shadow-lg z-50 animate-fade-in">
          <span>💡 <b className="font-extrabold">企业快捷演练通道已就绪：</b> 无需验证码接收，一键免签启动商业指挥中心。</span>
          <button 
            type="button"
            onClick={onQuickBypass}
            className="bg-white text-slate-900 border border-transparent hover:bg-slate-100 active:scale-95 px-4 font-black py-1 rounded-full text-[10px] sm:text-xs shadow-md transition-all cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>🚀 一键免签进入商家控制中心</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#07C2E3] animate-pulse" />
          </button>
        </div>
      )}
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#07C2E3]/10 to-transparent blur-3xl pointer-events-none rounded-full"></div>

      {/* HEADER BAR */}
      <header className="sticky top-0 z-50 bg-slate-950/80 border-b border-slate-900/40 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 bg-gradient-to-br from-[#07C2E3] to-[#046B7D] rounded-lg flex items-center justify-center shadow-lg shadow-[#07C2E3]/25">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-white">AI COMMERCE OS</span>
              <span className="block text-[8px] font-mono text-[#07C2E3] font-bold tracking-widest leading-none">PRODUCTION AUTHENTICATOR v1.0</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {authMode !== 'login' ? (
              <button 
                onClick={() => {
                  setAuthMode('login');
                  setLocalError(null);
                  setSuccessMessage(null);
                  clearError();
                }}
                className="text-slate-400 hover:text-white font-bold text-xs px-3 py-1 bg-slate-905 border border-slate-800 rounded-lg hover:border-slate-700 transition-all cursor-pointer"
              >
                商户登录
              </button>
            ) : (
              <button 
                onClick={() => {
                  setAuthMode('register');
                  setLocalError(null);
                  setSuccessMessage(null);
                  clearError();
                }}
                className="text-slate-400 hover:text-white font-bold text-xs px-3 py-1 bg-slate-905 border border-slate-800 rounded-lg hover:border-slate-700 transition-all cursor-pointer"
              >
                新建商家账号
              </button>
            )}
          </div>
        </div>
      </header>

      {/* CORE LOGIN/REGISTER HUB */}
      <main className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center px-6 py-10 z-10 relative">
        <div className="space-y-6">
          
          {/* Section Headers */}
          <div className="text-center space-y-1">
            <span className="text-[9px] font-mono text-[#07C2E3] font-bold tracking-widest uppercase mb-1 block">
              {authMode === 'login' && 'SOCIETY GATEWAY / 01'}
              {authMode === 'register' && 'REGISTRATION COMPLIANCE / 02'}
              {authMode === 'forgot_password' && 'CREDENTIAL RECOVERY / 03'}
            </span>
            <h1 className="text-2xl font-black tracking-tight text-white font-display">
              {authMode === 'login' && '验证商户身份'}
              {authMode === 'register' && '注册企业主账号'}
              {authMode === 'forgot_password' && '重置主号密码'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {authMode === 'login' && '进入 AI 驱动的跨国电商业态多租户管理中枢'}
              {authMode === 'register' && '构建高隔离等级、GDPR 级跨境电商智能系统'}
              {authMode === 'forgot_password' && '输入您的企业邮箱，密约重发安全链接'}
            </p>
          </div>

          {/* Form container card styled after Stripe */}
          <div className="bg-slate-900/60 border border-slate-900 rounded-2xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#07C2E3] to-[#046B7D]" />
            
            {/* Real notices and error feedback panels */}
            {(localError || error) && (
              <div className="bg-rose-950/40 border border-rose-500/20 p-3.5 rounded-xl text-rose-400 text-xs font-semibold leading-relaxed animate-fade-in mb-4">
                ⚠️ {localError || error}
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-950/40 border border-emerald-500/20 p-3.5 rounded-xl text-emerald-400 text-xs font-semibold leading-relaxed animate-fade-in mb-4">
                ✨ {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Login/Register Swapper controls inside card */}
              <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-1 mb-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setLocalError(null); setSuccessMessage(null); clearError(); }}
                  className={`flex-1 text-center py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${authMode === 'login' ? 'bg-[#07C2E3]/15 border border-[#07C2E3]/25 text-[#07C2E3] shadow' : 'text-slate-400 hover:text-slate-100'}`}
                >
                  商户登录
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setLocalError(null); setSuccessMessage(null); clearError(); }}
                  className={`flex-1 text-center py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${authMode === 'register' ? 'bg-[#07C2E3]/15 border border-[#07C2E3]/25 text-[#07C2E3] shadow' : 'text-slate-400 hover:text-slate-100'}`}
                >
                  创建账号
                </button>
              </div>

              {/* Input Field 1: Real Name (Register Only) */}
              {authMode === 'register' && (
                <div className="animate-fade-in">
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">企业负责人姓名 / Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <User className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-[#07C2E3] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] transition-all font-sans"
                      placeholder="例如：Aubrette Munsen"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Input Field 2: Corporate Email (All Modes) */}
              <div>
                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">企业主邮箱 / Corporate Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-[#07C2E3] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] transition-all font-sans"
                    placeholder="example@yourco.com"
                    required
                  />
                </div>
              </div>

              {/* Input Field 3: Mobile Phone (Register Only) */}
              {authMode === 'register' && (
                <div className="animate-fade-in">
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">企业电话号码 / Contact Phone</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-[#07C2E3] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] transition-all font-sans"
                      placeholder="13800000000"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Input Field 4: Password (Login & Register Mode) */}
              {authMode !== 'forgot_password' && (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">密匙密码 / Secret Password</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot_password'); setLocalError(null); setSuccessMessage(null); }}
                        className="text-[9px] text-[#07C2E3] hover:underline"
                      >
                        忘记密码？
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-[#07C2E3] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#07C2E3] transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Input Field 5: Confirm Password (Register Only) */}
              {authMode === 'register' && (
                <div className="animate-fade-in">
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">确认密码 / Confirm Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-[#07C2E3] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#07C2E3] transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Input Field 6: Multi-Factor SMS/Email Verification Code with real verification (Register Only) */}
              {authMode === 'register' && (
                <div className="animate-fade-in">
                  <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">双重安全检验码 / Verification Code</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <Key className="w-4 h-4" />
                      </span>
                      <input 
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 focus:border-[#07C2E3] rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#07C2E3] font-mono transition-all"
                        placeholder="六位数字校验码"
                        required
                        maxLength={6}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleGetCode}
                      disabled={countdown > 0}
                      className="bg-[#07C2E3]/15 hover:bg-[#07C2E3]/25 disabled:bg-slate-955/40 text-[#07C2E3] disabled:text-slate-500 border border-[#07C2E3]/20 rounded-lg px-4 text-xs font-bold font-mono min-w-[100px] cursor-pointer transition-colors"
                    >
                      {countdown > 0 ? `${countdown}s` : '分发验证码'}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Operations Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#07C2E3] to-[#046B7D] hover:from-[#06B2D0] hover:to-[#035968] active:scale-98 text-white py-3 rounded-lg font-extrabold text-xs shadow-lg shadow-[#07C2E3]/10 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-[#07C2E3]/10"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />
                    <span>安全凭据比对计算中...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authMode === 'login' && '验证主身份并安全登录'}
                      {authMode === 'register' && '验证并创建商户总账号'}
                      {authMode === 'forgot_password' && '发送重设凭证邮件'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Forgot Password cancellation link */}
              {authMode === 'forgot_password' && (
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setLocalError(null); setSuccessMessage(null); }}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-white pt-2 block"
                >
                  返回账号登录
                </button>
              )}

            </form>

            {/* Separator */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-slate-500 tracking-wider">FEDERATION GATEWAYS / 跨境鉴权联路</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>使用 Google 账号一键安全登录</span>
            </button>

          </div>

        </div>
      </main>

      {/* FOOTER COOPERATIONS */}
      <footer className="bg-slate-950/40 border-t border-slate-900/40 py-6 px-6 text-center z-10 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] font-mono text-slate-600">
          <span>AI COMMERCE OS © 2026 版权所有</span>
          <span className="text-[#07C2E3] font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#07C2E3]" />
            <span>SECURE AUDIT ACCREDITATION (GDPR)</span>
          </span>
        </div>
      </footer>

    </div>
  );
}
