import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { path: '/', label: '首页' },
  { path: '/review', label: '审核工作台', protected: true },
  { path: '/reports', label: '报告中心', protected: true },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = useAuthStore((s) => s.token);
  const username = useAuthStore((s) => s.username);
  const logout = useAuthStore((s) => s.logout);

  const visibleNavItems = navItems.filter((item) => !item.protected || token);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#1c3a5f] bg-[#0B1B33]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-[#F7F5F0]">
          <ShieldCheck className="h-7 w-7 text-[#C9A227]" />
          <span className="font-serif text-xl font-semibold tracking-wide">法审通</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {visibleNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-[#C9A227]'
                  : 'text-[#F7F5F0]/80 hover:text-[#F7F5F0]'
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute -bottom-5 left-0 h-0.5 w-full bg-[#C9A227]" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {token ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-[#F7F5F0]/70">
                <User className="h-4 w-4" />
                {username}
              </span>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-md border border-[#1c3a5f] px-3 py-1.5 text-sm text-[#F7F5F0]/80 transition-colors hover:border-[#C9A227]/50 hover:text-[#C9A227]"
              >
                <LogOut className="h-4 w-4" />
                退出
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-[#C9A227] px-4 py-2 text-sm font-semibold text-[#0B1B33] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#C9A227]/20"
            >
              登录
            </Link>
          )}
        </div>

        <button
          type="button"
          className="text-[#F7F5F0] md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#1c3a5f] bg-[#0B1B33] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {visibleNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-[#C9A227]'
                    : 'text-[#F7F5F0]/80'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {token ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="mt-2 rounded-md border border-[#1c3a5f] px-4 py-2 text-center text-sm font-semibold text-[#F7F5F0]"
              >
                退出登录
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-md bg-[#C9A227] px-4 py-2 text-center text-sm font-semibold text-[#0B1B33]"
              >
                登录
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
