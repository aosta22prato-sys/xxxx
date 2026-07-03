import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { localDb } from '../db/localDb';

interface RegisterProps {
  onNavigate: (page: 'home' | 'register' | 'login') => void;
  onRegisterSuccess?: (registeredEmail: string) => void;
}

export default function Register({ onNavigate, onRegisterSuccess }: RegisterProps) {
  // Form State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // UI States
  const [countdown, setCountdown] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCodeToast, setShowCodeToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation / Feedback states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMsg, setSuccessMsg] = useState('');

  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, []);

  // Countdown handler
  useEffect(() => {
    if (countdown > 0) {
      countdownTimer.current = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
      }
    }
  }, [countdown]);

  // Handle Send Verification Code
  const handleSendCode = () => {
    const currentErrors: { [key: string]: string } = {};

    // Validate fields before sending code
    if (!email) {
      currentErrors.email = '请输入企业邮箱';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      currentErrors.email = '请输入有效的邮箱地址';
    }

    if (!phone) {
      currentErrors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      currentErrors.phone = '请输入11位有效手机号码';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    // Clear specific errors
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.email;
      delete copy.phone;
      return copy;
    });

    // Check if account already exists in real DB
    const checkUser = localDb.userExists(email, phone);
    if (checkUser.exists) {
      setErrors((prev) => ({
        ...prev,
        [checkUser.field || 'email']: `该${checkUser.field === 'email' ? '邮箱' : '手机号码'}已被注册`
      }));
      return;
    }

    // Generate random mock verification code
    const mockCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(mockCode);
    setCountdown(60);
    setShowCodeToast(true);

    // Auto dismiss verification code hint in 10 seconds
    setTimeout(() => {
      setShowCodeToast(false);
    }, 12000);
  };

  // Submit Registration
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');
    const currentErrors: { [key: string]: string } = {};

    // Validate forms
    if (!email) {
      currentErrors.email = '请填写企业邮箱';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      currentErrors.email = '请输入正确的邮箱格式';
    }

    if (!phone) {
      currentErrors.phone = '请填写手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(phone)) {
      currentErrors.phone = '请输入11位中国大陆手机号码';
    }

    if (!password) {
      currentErrors.password = '请输入登录密码';
    } else if (password.length < 6) {
      currentErrors.password = '密码长度不能少于 6 位';
    }

    if (!confirmPassword) {
      currentErrors.confirmPassword = '请再次输入密码进行确认';
    } else if (password !== confirmPassword) {
      currentErrors.confirmPassword = '两次输入的密码不一致';
    }

    if (!verificationCode) {
      currentErrors.verificationCode = '请输入验证码';
    } else if (verificationCode !== generatedCode) {
      currentErrors.verificationCode = '验证码不正确或已失效';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulated API latency
    setTimeout(() => {
      // Re-check just in case before saving
      const checkUser = localDb.userExists(email, phone);
      if (checkUser.exists) {
        setErrors((prev) => ({
          ...prev,
          [checkUser.field || 'email']: `该${checkUser.field === 'email' ? '邮箱' : '手机号码'}已被占用`
        }));
        setIsSubmitting(false);
        return;
      }

      // Save user to the real localStorage DB
      try {
        localDb.saveUser({
          email,
          phone,
          passwordHash: password, // Plain text evaluation for simplified simulation
        });

        setSuccessMsg('企业账户注册成功！正在为您重定向至登录页...');
        setIsSubmitting(false);

        // Call callback if available, then redirect to Page003 (Login) after 2 seconds
        setTimeout(() => {
          if (onRegisterSuccess) {
            onRegisterSuccess(email);
          } else {
            onNavigate('login');
          }
        }, 1800);
      } catch (err) {
        setErrors({ submit: '保存注册信息失败，请重试' });
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-950 relative">
      
      {/* Top Brand Nav */}
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
          
          {/* Header Card intro */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              创建企业空间
            </h2>
            <p className="mt-2.5 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              一个安全物理隔离的智能后台底座。请填写您的真实信息以便初始化安全命名空间。
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600"></div>
            
            {successMsg ? (
              <div id="register-success-pane" className="py-10 text-center animate-fade-in">
                <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">注册成功!</h3>
                <p className="text-slate-500 text-xs px-4">{successMsg}</p>
                <div className="mt-6 flex justify-center">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <form id="register-form" onSubmit={handleSubmit} className="space-y-5">
                
                {/* Submit-level errors */}
                {errors.submit && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Field 1: Enterprise Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5">
                    企业邮箱 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.email;
                            return copy;
                          });
                        }
                      }}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                  {errors.email && (
                    <p id="error-email" className="mt-1.5 text-xxs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                    </p>
                  )}
                </div>

                {/* Field 2: Mobile Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    负责人手机号码 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={11}
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ''));
                        if (errors.phone) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.phone;
                            return copy;
                          });
                        }
                      }}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      placeholder="13800000000"
                    />
                  </div>
                  {errors.phone && (
                    <p id="error-phone" className="mt-1.5 text-xxs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Field 3: Password */}
                <div>
                  <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-1.5">
                    登录密码 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.password;
                            return copy;
                          });
                        }
                      }}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      placeholder="配置至少6位复杂密码"
                    />
                  </div>
                  {errors.password && (
                    <p id="error-password" className="mt-1.5 text-xxs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                    </p>
                  )}
                </div>

                {/* Field 4: Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 mb-1.5">
                    确认登录密码 <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.confirmPassword;
                            return copy;
                          });
                        }
                      }}
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                      placeholder="请再次属于登录密码进行校验"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p id="error-confirm" className="mt-1.5 text-xxs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Field 5: Verification Code */}
                <div>
                  <label htmlFor="verificationCode" className="block text-xs font-bold text-slate-700 mb-1.5">
                    验证码 <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative rounded-lg shadow-xs flex-grow">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheck className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        id="verificationCode"
                        name="verificationCode"
                        type="text"
                        required
                        maxLength={4}
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value.replace(/\D/g, ''));
                          if (errors.verificationCode) {
                            setErrors((prev) => {
                              const copy = { ...prev };
                              delete copy.verificationCode;
                              return copy;
                            });
                          }
                        }}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all"
                        placeholder="请输入4位验证码"
                      />
                    </div>
                    <button
                      id="send-code-btn"
                      type="button"
                      disabled={countdown > 0}
                      onClick={handleSendCode}
                      className={`px-4 text-xs font-bold rounded-xl border transition-all ${
                        countdown > 0
                          ? 'border-slate-200 bg-slate-100 text-slate-450 cursor-not-allowed'
                          : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100/80 cursor-pointer'
                      }`}
                    >
                      {countdown > 0 ? `${countdown}s 后重新发送` : '获取验证码'}
                    </button>
                  </div>
                  {errors.verificationCode && (
                    <p id="error-verification" className="mt-1.5 text-xxs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.verificationCode}
                    </p>
                  )}
                </div>

                {/* Submit Register Button */}
                <button
                  id="submit-register-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>正在校验信息...</span>
                    </>
                  ) : (
                    <>
                      <span>建立企业空间</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Go to Login footer */}
          {!successMsg && (
            <div className="mt-6 text-center">
              <span className="text-xs text-slate-500">已有企业空间？ </span>
              <button
                id="link-go-to-login"
                onClick={() => onNavigate('login')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                立即登录
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Simulated Notification Toast Area for Mock SMS Code Verification */}
      {showCodeToast && (
        <div 
          id="mock-sms-toast"
          className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white rounded-xl shadow-xl border border-slate-800 p-4 animate-slide-up flex items-start gap-3"
        >
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold tracking-wide text-indigo-400">【安全短信模拟器】</span>
              <button 
                onClick={() => setShowCodeToast(false)} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-100">
              您的安全注册验证码为：<span className="font-mono font-black text-amber-400 text-sm">{generatedCode}</span>。该验证码 5 分钟内有效。请在表单中进行填写完成空间校验。
            </p>
          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-slate-400 text-xxs">
        <p>© 2026 AI BUSINESS OS Inc. 多租户物理沙盒审计系统。 您的所有数据与物理空间已通过硬件哈希密钥安全保护。</p>
      </footer>
    </div>
  );
}
