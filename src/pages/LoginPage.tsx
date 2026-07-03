import React, { useState } from 'react';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  Database,
  Building2,
  CheckCircle2,
  Workflow
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onShowToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function LoginPage({ onNavigate, onShowToast }: LoginPageProps) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // 错误标志
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');
    setIsSubmitting(true);

    if (!account) {
      setErrorText('请输入手机号码或企业邮箱');
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setErrorText('请输入登录密码');
      setIsSubmitting(false);
      return;
    }

    // 从真实 LocalStorage 沙箱存储中匹配数据
    try {
      const existingUsersRaw = localStorage.getItem('ai_business_os_users');
      const usersList = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const user = usersList.find(
        (u: any) => u.email === account || u.phone === account
      );

      if (!user) {
        setErrorText('该管理员账户未注册');
        onShowToast('登录失败：账户未注册或密码错误', 'error');
        setIsSubmitting(false);
        return;
      }

      if (user.password !== password) {
        setErrorText('密码匹配错误');
        onShowToast('登录失败：密码错误', 'error');
        setIsSubmitting(false);
        return;
      }

      // 验证通过
      setTimeout(() => {
        setIsSubmitting(false);
        setLoginSuccess(true);
        onShowToast(`🎉 欢迎回来，企业专属租户已成功校验启动！`, 'success');
      }, 800);

    } catch (err) {
      setIsSubmitting(false);
      setErrorText('系统服务查询出错');
      onShowToast('登录状态异常', 'error');
    }
  };

  return (
    <div id="login-page-container" className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col justify-between selection:bg-slate-200 selection:text-slate-900">
      {/* 极简顶栏 */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-base leading-none">
            AI
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">AI Business OS</span>
        </div>
        <div>
          <button 
            id="login-header-to-register"
            onClick={() => onNavigate('register')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            新用户？注册企业管理员
          </button>
        </div>
      </header>

      {/* 登录主体 */}
      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div id="login-card" className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden transition-all animate-fade-in">
          
          {!loginSuccess ? (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 py-1 px-2.5 rounded-full text-[10px] font-bold text-slate-600 mb-3 uppercase tracking-wider">
                  <KeyRound className="w-3 h-3 text-slate-900" />
                  <span>管理员安全认证入口</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900">登录企业操作系统</h1>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  请输入您注册的企业邮箱或手机号码作为登录凭证。
                </p>
              </div>

              <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
                {/* 账号 */}
                <div id="login-group-account">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    手机号码 / 企业邮箱
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="login-input-account"
                      type="text"
                      placeholder="name@company.com 或 手机号"
                      value={account}
                      onChange={(e) => {
                        setAccount(e.target.value);
                        setErrorText('');
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div id="login-group-password">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    登录密码
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="login-input-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="请输入密码"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorText('');
                      }}
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                      required
                    />
                    <button
                      type="button"
                      id="btn-login-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 错误提示区域 */}
                {errorText && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs font-semibold animate-pulse">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorText}</span>
                  </div>
                )}

                {/* 提交按钮 */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <span>{isSubmitting ? '安全校验中...' : '登录并控制企业后台'}</span>
                  <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* 转换项 */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3">
                <div className="flex items-center text-xs font-semibold text-slate-500">
                  没有系统管理员账户？
                  <button 
                    id="btn-login-to-register"
                    onClick={() => onNavigate('register')}
                    className="text-slate-900 hover:text-slate-700 hover:underline transition-all font-bold cursor-pointer ml-1"
                  >
                    注册新企业
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div id="login-success-hold" className="text-center py-6 animate-fade-in">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">管理员登录成功</h2>
              <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                欢迎登录 <span className="text-slate-700 font-bold">{account}</span> 物理安全隔离的租户节点。
              </p>

              <div className="my-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  当前第一阶段审核状态
                </span>
                
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                  <span>管理员鉴权控制链路：已就绪 & 隔离运行良好</span>
                </div>
                
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-1.5 shrink-0" />
                  <span>企业创建 / 行业装配后台 (Page004-Page007)：根据审核要求已处于冻结保密计划中。</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  id="btn-success-back-home"
                  onClick={() => onNavigate('home')}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs tracking-wide transition-all cursor-pointer"
                >
                  返回主会场首页
                </button>
                <button
                  id="btn-success-logout"
                  onClick={() => {
                    setLoginSuccess(false);
                    setAccount('');
                    setPassword('');
                  }}
                  className="w-full py-3 px-4 bg-white text-slate-500 hover:text-slate-800 font-semibold border border-slate-200 rounded-xl text-xs transition-all cursor-pointer"
                >
                  退出当前登录
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 页脚 */}
      <footer className="py-6 border-t border-slate-100 bg-white text-center text-[10px] text-slate-400 font-medium">
        <span>© 2026 AI Business OS. 专享租户已接入边缘算力服务器。</span>
      </footer>
    </div>
  );
}
