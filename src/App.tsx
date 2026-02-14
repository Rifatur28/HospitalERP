import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { RoomPage } from './pages/RoomPage';
import { DoctorPage } from './pages/DoctorPage';
import type { PageType } from './types';
import {
  Bell, Search, Globe, ChevronDown, Menu, X
} from 'lucide-react';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Emergency Admission', desc: 'New emergency patient in Room E01', time: '2 min ago', urgent: true },
    { id: 2, title: 'ICU Alert', desc: 'Patient in ICU-302 needs immediate attention', time: '5 min ago', urgent: true },
    { id: 3, title: 'Appointment Reminder', desc: 'Dr. Ahmed has 3 pending appointments', time: '10 min ago', urgent: false },
    { id: 4, title: 'Lab Report Ready', desc: 'Blood test results for Patient P1003', time: '15 min ago', urgent: false },
    { id: 5, title: 'Payment Received', desc: '৳15,000 received via bKash', time: '20 min ago', urgent: false },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'rooms': return <RoomPage />;
      case 'doctors': return <DoctorPage />;
      default: return <DashboardPage />;
    }
  };

  const pageTitle = {
    dashboard: language === 'en' ? 'Dashboard' : 'ড্যাশবোর্ড',
    rooms: language === 'en' ? 'Room Management' : 'কক্ষ ব্যবস্থাপনা',
    doctors: language === 'en' ? 'Doctor Panel' : 'ডাক্তার প্যানেল',
  };

  return (
    <div className="min-h-screen bg-slate-50 gradient-mesh">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="w-[260px] h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar currentPage={currentPage} onPageChange={(page) => { setCurrentPage(page); setShowMobileMenu(false); }} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="lg:ml-[260px] min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 glass-effect border-b border-slate-200/60">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400">MediCare ERP</span>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-700">{pageTitle[currentPage]}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Quick search...' : 'দ্রুত অনুসন্ধান...'}
                  className="pl-9 pr-4 py-2 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all focus:w-72"
                />
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/80 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{language === 'en' ? 'বাংলা' : 'English'}</span>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 bg-white/80 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                    5
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 animate-fadeIn overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 cursor-pointer">
                            <div className="flex items-start gap-3">
                              <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.urgent ? 'bg-rose-500 animate-pulse-soft' : 'bg-blue-500'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900">{n.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{n.desc}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-100 text-center">
                        <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View All Notifications</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Menu */}
              <button className="flex items-center gap-2 px-2 py-1.5 bg-white/80 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                  SA
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-slate-700">Admin</p>
                  <p className="text-[9px] text-slate-400">Super Admin</p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>

        {/* Footer */}
        <footer className="px-6 py-4 border-t border-slate-200/60 text-center">
          <p className="text-xs text-slate-400">
            © 2025 MediCare ERP System • Bangladesh Hospital Management Solution • 
            <span className="ml-1">
              {language === 'en' ? 'All rights reserved' : 'সর্বস্বত্ব সংরক্ষিত'}
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}
