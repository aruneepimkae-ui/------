import React from 'react';
import { LayoutDashboard, PieChart, TrendingUp, Settings, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col transition-all duration-300">
        <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-700">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          <h1 className="hidden lg:block text-xl font-bold tracking-tight">ThaiStock AI</h1>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-2">
          <NavItem icon={<LayoutDashboard />} label="ภาพรวมตลาด" active />
          <NavItem icon={<PieChart />} label="พอร์ตโฟลิโอ" />
          <NavItem icon={<User />} label="ข้อมูลส่วนตัว" />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <NavItem icon={<Settings />} label="ตั้งค่า" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="text-lg font-semibold text-slate-700">Market Overview (SET)</h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900">สมชาย นักลงทุน</div>
                <div className="text-xs text-slate-500">บัญชี Premium</div>
             </div>
             <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border-2 border-slate-300">
                S
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${active ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'} justify-center lg:justify-start`}>
    {icon}
    <span className="hidden lg:block font-medium">{label}</span>
  </button>
);
