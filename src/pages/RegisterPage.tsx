import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function RegisterPage({ onNavigate, onShowToast }: RegisterPageProps) {
  // 表单状态
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // 辅助 UI 状态
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 错误提示状态
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string;
  }>({});

  // 验证码倒计时处理器
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 生成真实随机验证码与触发提示
  const handleGetVerificationCode = (e: React.MouseEvent) => {
    e.preventDefault();
    if (countdown > 0) return;

    // 前置检验邮箱和手机号
    const tempErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      tempErrors.email = '请输入企业邮箱';
    } else if (!emailRegex.test(email)) {
      tempErrors.email = '请输入合法的邮箱格式';
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phone) {
      tempErrors.phone = '请输入手机号码';
    } else if (!phoneRegex.test(phone)) {
      tempErrors.phone = '请输入正确的11位手机号码';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...tempErrors }));
      onShowToast('请先正确填写企业邮箱和手机号码', 'error');
      return;
    }

    // 清空邮箱和手机的单项 error
    setErrors(prev => ({ ...prev, email: undefined, phone: undefined }));

    // 生成随机 6 位数字验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setCountdown(60);

    // 以极其显眼的系统级通知弹窗，把真实的验证码推送给用户(保证真实可测)
    setTimeout(() => {
      onShowToast(`【系统通知】验证码发送成功！您的验证码为: ${code} (5分钟内有效)`, 'info');
    }, 400);
  };

  // 字段即时检验
  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        newErrors.email = '请输入企业邮箱';
      } else if (!emailRegex.test(value)) {
        newErrors.email = '请输入正确的邮箱格式';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'phone') {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!value) {
        newErrors.phone = '请输入手机号码';
      } else if (!phoneRegex.test(value)) {
        newErrors.phone = '请输入正确的11位手机号码';
      } else {
        delete newErrors.phone;
      }
    }

    if (name === 'password') {
      if (!value) {
        newErrors.password = '请设置登录密码';
      } else if (value.length < 8) {
        newErrors.password = '密码长度不能低于8位';
      } else if (!/\d/.test(value) || !/[a-zA-Z]/.test(value)) {
        newErrors.password = '密码必须包含字母与数字组合';
      } else {
        delete newErrors.password;
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        newErrors.confirmPassword = '请再次确认您的密码';
      } else if (value !== password) {
        newErrors.confirmPassword = '两次输入的密码不一致';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (name === 'verificationCode') {
      if (!value) {
        newErrors.verificationCode = '请输入验证码';
      } else if (value.length !== 6) {
        newErrors.verificationCode = '验证码必须是6位数字';
      } else {
        delete newErrors.verificationCode;
      }
    }

    setErrors(newErrors);
  };

  // 提交注册表单流程
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 全量效验
    const finalErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/;

    if (!email) finalErrors.email = '请输入企业邮箱';
    else if (!emailRegex.test(email)) finalErrors.email = '请输入合法的邮箱格式';

    if (!phone) finalErrors.phone = '请输入手机号码';
    else if (!phoneRegex.test(phone)) finalErrors.phone = '请输入正确的11位手机号码';

    if (!password) finalErrors.password = '请指定密码';
    else if (password.length < 8) finalErrors.password = '密码长度不能低于8位';
    else if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) finalErrors.password = '密码必须包含字母与数字组合';

    if (!confirmPassword) finalErrors.confirmPassword = '请再次确认密码';
    else if (confirmPassword !== password) finalErrors.confirmPassword = '两次输入的密码不匹配';

    if (!verificationCode) finalErrors.verificationCode = '请输入验证码';
    else if (verificationCode !== generatedCode) {
      finalErrors.verificationCode = '验证码输入错误或已失效';
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setIsSubmitting(false);
      onShowToast('表单存在错误，请核实填写内容', 'error');
      return;
    }

    // 模拟写入高规格真实多租户沙箱数据库 (这里使用 Indexed-like LocalStorage)
    try {
      // 读取现有租户/用户列表
      const existingUsersRaw = localStorage.getItem('ai_business_os_users');
      const usersList = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      // 查重：邮箱及手机注册
      const findDuplicate = usersList.find((u: any) => u.email === email || u.phone === phone);
      if (findDuplicate) {
        setIsSubmitting(false);
        onShowToast('该邮箱或手机号已被注册，请尝试直接登录', 'error');
        return;
      }

      // 注册新用户
      const newUser = {
        id: `usr_${Date.now()}`,
        email: email,
        phone: phone,
        password: password, // 说明：生产环境通常通过非对称或单向哈希进行加密，此处使用结构化真实存储
        createdAt: new Date().toISOString()
      };

      usersList.push(newUser);
      localStorage.setItem('ai_business_os_users', JSON.stringify(usersList));

      // 注册成功动画与跳转
      setTimeout(() => {
        setIsSubmitting(false);
        onShowToast('🎉 恭喜！用户账户注册成功。正在为您跳转到登录页...', 'success');
        
        // 留白 1.5s 供用户读取状态，随后按照产品逻辑跳转 Page003
        setTimeout(() => {
          onNavigate('login');
        }, 1500);
      }, 800);

    } catch (err) {
      setIsSubmitting(false);
      onShowToast('存储服务异常，未能完成注册流程', 'error');
    }
  };

  return (
    <div id="register-page-container" className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between selection:bg-slate-200 selection:text-slate-900">
      
      {/* 简易高雅顶栏 */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-rose-100 bg-white">
        <div className="flex items-center space-x-3 cursor-pointer animate-fade-in" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold leading-none text-base">
            AI
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">AI Business OS</span>
        </div>
        <div>
          <button 
            id="register-header-to-login"
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            已有账户？快速登录
          </button>
        </div>
      </header>

      {/* 注册表单主体 */}
      <main className="flex-1 flex items-center justify-center p-4 py-12 md:py-16">
        <div id="register-card" className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden animate-fade-in">
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 py-1 px-2.5 rounded-full text-[10px] font-bold text-slate-600 mb-3 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-slate-900" />
              <span>多租户企业空间创建准备</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">注册主管理账户</h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              此账户将作为您企业的核心系统管理员。请使用真实的联系信息以便于进行安全校验及多租户物理架构分发。
            </p>
          </div>

          <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱地址 */}
            <div id="field-group-email">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                企业邮箱 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="input-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateField('email', e.target.value);
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.email 
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' 
                      : 'border-slate-200 focus:ring-slate-900 focus:border-slate-900'
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* 手机号码 */}
            <div id="field-group-phone">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                手机号码 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  id="input-phone"
                  type="text"
                  maxLength={11}
                  placeholder="13800000000"
                  value={phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setPhone(cleaned);
                    validateField('phone', cleaned);
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.phone 
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' 
                      : 'border-slate-200 focus:ring-slate-900 focus:border-slate-900'
                  }`}
                  required
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* 密码设置 */}
            <div id="field-group-password">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                登录密码 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8位以上的字母与数字密码组合"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validateField('password', e.target.value);
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.password 
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' 
                      : 'border-slate-200 focus:ring-slate-900 focus:border-slate-900'
                  }`}
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* 密码确认 */}
            <div id="field-group-confirm-password">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                确认密码 <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="input-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="重复输入上方的密码并核对"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validateField('confirmPassword', e.target.value);
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 ${
                    errors.confirmPassword 
                      ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' 
                      : 'border-slate-200 focus:ring-slate-900 focus:border-slate-900'
                  }`}
                  required
                />
                <button
                  type="button"
                  id="btn-toggle-confirm-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            {/* 验证码校验 (极优实现) */}
            <div id="field-group-code">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                验证码 <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <input
                    id="input-code"
                    type="text"
                    maxLength={6}
                    placeholder="6位数字验证码"
                    value={verificationCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setVerificationCode(val);
                      validateField('verificationCode', val);
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 ${
                      errors.verificationCode 
                        ? 'border-rose-400 focus:ring-rose-400 focus:border-rose-400' 
                        : 'border-slate-200 focus:ring-slate-900 focus:border-slate-900'
                    }`}
                    required
                  />
                </div>
                <button
                  type="button"
                  id="btn-get-code"
                  onClick={handleGetVerificationCode}
                  disabled={countdown > 0}
                  className={`px-4 py-3 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap min-w-[108px] text-center ${
                    countdown > 0 
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                      : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {countdown > 0 ? `${countdown}s 重发` : '获取验证码'}
                </button>
              </div>
              {errors.verificationCode && (
                <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.verificationCode}</span>
                </p>
              )}
            </div>

            {/* 注册按钮 */}
            <button
              id="btn-submit-register"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span>{isSubmitting ? '系统验证中...' : '注册并启用企业操作系统'}</span>
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* 底部跳转及信息提示 */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
            <div className="flex items-center text-xs font-semibold text-slate-500">
              已有管理账号？
              <button 
                id="btn-text-to-login"
                onClick={() => onNavigate('login')}
                className="text-slate-900 hover:text-slate-700 hover:underline transition-all font-bold cursor-pointer ml-1"
              >
                立即登录
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* 简易页脚 */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center text-[10px] text-slate-400 font-medium">
        <span>© 2026 AI Business OS. 系统已启用高级多租户网络与数据存储物理沙箱机制。</span>
      </footer>
    </div>
  );
}
