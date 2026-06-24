import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { login } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';

const DEMO_ACCOUNTS = [
  { role: '业务人员', username: 'business', password: 'business123' },
  { role: '法务人员', username: 'legal', password: 'legal123' },
  { role: '审批人', username: 'approver', password: 'approver123' },
  { role: '管理员', username: 'admin', password: 'admin123' },
];

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState('business');
  const [password, setPassword] = useState('business123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      setAuth(res.access_token, username);
      navigate('/review');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B1B33] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1c3a5f] bg-[#0f2541] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#F7F5F0]">
            智能合同审核系统
          </h1>
          <p className="mt-2 text-sm text-[#F7F5F0]/60">企业内部登录</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm text-[#F7F5F0]/80">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-[#1c3a5f] bg-[#0B1B33] px-4 py-2.5 text-[#F7F5F0] outline-none focus:border-[#C9A227]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-[#F7F5F0]/80">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#1c3a5f] bg-[#0B1B33] px-4 py-2.5 pr-10 text-[#F7F5F0] outline-none focus:border-[#C9A227]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F7F5F0]/50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-400/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#C9A227] py-2.5 text-sm font-semibold text-[#0B1B33] transition-all hover:shadow-lg disabled:opacity-60"
          >
            {loading ? '登录中…' : '登录'}
          </button>
        </form>

        <div className="mt-8 border-t border-[#1c3a5f] pt-6">
          <p className="mb-3 text-center text-xs text-[#F7F5F0]/50">演示账号</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.username}
                type="button"
                onClick={() => {
                  setUsername(acc.username);
                  setPassword(acc.password);
                }}
                className="rounded-md border border-[#1c3a5f] px-2 py-1.5 text-xs text-[#F7F5F0]/70 hover:border-[#C9A227]/50 hover:text-[#C9A227]"
              >
                {acc.role}: {acc.username}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
