import { useState } from 'react';
import {
  LayoutDashboard, BedDouble, Stethoscope, ChevronLeft, ChevronRight,
  Activity, Settings, LogOut, Shield, Bell, Hospital
} from 'lucide-react';
import type { PageType } from '../types';

interface SidebarProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard' as PageType, label: 'Dashboard', labelBn: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'rooms' as PageType, label: 'Room & Seats', labelBn: 'কক্ষ ও আসন', icon: BedDouble },
    { id: 'doctors' as PageType, label: 'Doctors', labelBn: 'ডাক্তার', icon: Stethoscope },
  ];

  const bottomItems = [
    { label: 'Activity Log', icon: Activity },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[78px]' : 'w-[260px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Hospital className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fadeIn">
            <h1 className="text-white font-bold text-lg tracking-tight">MediCare</h1>
            <p className="text-blue-300/70 text-[10px] font-medium tracking-widest uppercase">ERP System</p>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors z-50 shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Admin Badge */}
      {!collapsed && (
        <div className="mx-4 mt-5 mb-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-white text-xs font-semibold">Admin Panel</p>
              <p className="text-blue-300/60 text-[10px]">Super Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 mt-4 space-y-1">
        <p className={`text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-3 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '•••' : 'Main Menu'}
        </p>
        {menuItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full -ml-3" />
              )}
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
              {!collapsed && (
                <div className="animate-fadeIn text-left">
                  <span className="text-sm font-medium block">{item.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>{item.labelBn}</span>
                </div>
              )}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-1">
        <p className={`text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-2 ${collapsed ? 'text-center' : 'px-3'}`}>
          {collapsed ? '•••' : 'System'}
        </p>
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </button>
        ))}

        {/* Notification */}
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all relative ${collapsed ? 'justify-center' : ''}`}>
          <Bell className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Notifications</span>}
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse-soft" />
        </button>

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            SA
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Super Admin</p>
              <p className="text-slate-500 text-[10px]">admin@medicare.bd</p>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
