import {
  Users, BedDouble, Stethoscope,
  AlertTriangle, Clock, Calendar, Activity, ArrowUpRight, ArrowDownRight,
  UserCheck, Wallet, HeartPulse, Siren, DollarSign
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { dashboardStats, revenueData, departmentData, occupancyTrend, patientFlowData, appointments, rooms } from '../data/mockData';

function formatBDT(amount: number): string {
  if (amount >= 10000000) return `৳${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `৳${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `৳${(amount / 1000).toFixed(1)}K`;
  return `৳${amount}`;
}

export function DashboardPage() {
  const statCards = [
    {
      title: 'Total Patients',
      titleBn: 'মোট রোগী',
      value: dashboardStats.totalPatients.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgGlow: 'bg-blue-500/10',
      subtitle: `${dashboardStats.todayAdmissions} admitted today`,
    },
    {
      title: 'Bed Occupancy',
      titleBn: 'শয্যা দখল',
      value: `${dashboardStats.occupancyRate}%`,
      change: '+3.2%',
      trend: 'up',
      icon: BedDouble,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGlow: 'bg-emerald-500/10',
      subtitle: `${dashboardStats.occupiedRooms}/${dashboardStats.totalRooms} beds occupied`,
    },
    {
      title: "Today's Revenue",
      titleBn: 'আজকের আয়',
      value: formatBDT(dashboardStats.todayRevenue),
      change: '+8.7%',
      trend: 'up',
      icon: Wallet,
      gradient: 'from-violet-500 to-violet-600',
      bgGlow: 'bg-violet-500/10',
      subtitle: `Monthly: ${formatBDT(dashboardStats.monthlyRevenue)}`,
    },
    {
      title: 'Active Doctors',
      titleBn: 'সক্রিয় ডাক্তার',
      value: `${dashboardStats.availableDoctors}`,
      change: '-2',
      trend: 'down',
      icon: Stethoscope,
      gradient: 'from-amber-500 to-orange-500',
      bgGlow: 'bg-amber-500/10',
      subtitle: `${dashboardStats.totalDoctors} total doctors`,
    },
  ];

  const quickStats = [
    { label: 'Appointments', value: dashboardStats.todayAppointments, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed', value: dashboardStats.completedAppointments, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Emergency', value: dashboardStats.emergencyCases, icon: Siren, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Pending Bills', value: dashboardStats.pendingBills, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  const recentAppointments = appointments.slice(0, 6);
  const criticalRooms = rooms.filter(r => r.type === 'icu' || r.type === 'emergency');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Admin</span> 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Here's what's happening at MediCare Hospital today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-soft" />
            <span className="text-sm text-slate-600 font-medium">System Online</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="relative group bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bgGlow} rounded-full -translate-x-8 -translate-y-8 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                  stat.trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mb-0.5">{stat.value}</p>
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{stat.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((qs, i) => (
          <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 px-4 py-3">
            <div className={`w-9 h-9 ${qs.bg} rounded-lg flex items-center justify-center`}>
              <qs.icon className={`w-4 h-4 ${qs.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{qs.value}</p>
              <p className="text-[11px] text-slate-500">{qs.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900">Revenue Overview</h3>
              <p className="text-xs text-slate-500 mt-0.5">Monthly revenue vs expenses (BDT)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-400 rounded-full" />Expenses</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatBDT(value as number), '']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="expenses" stroke="#fb7185" strokeWidth={2} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-900 mb-1">Department Wise</h3>
          <p className="text-xs text-slate-500 mb-4">Patient distribution by department</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="patients"
                stroke="none"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
            {departmentData.slice(0, 6).map((dept) => (
              <div key={dept.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dept.color }} />
                <span className="text-[11px] text-slate-600 truncate">{dept.name}</span>
                <span className="text-[11px] font-semibold text-slate-900 ml-auto">{dept.patients}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Patient Flow */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900">Patient Flow Today</h3>
              <p className="text-xs text-slate-500 mt-0.5">Hourly patient count by type</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-500 rounded-full" />Inpatient</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full" />Outpatient</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-rose-500 rounded-full" />Emergency</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={patientFlowData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="inpatient" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outpatient" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emergency" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Trend */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-slate-900">Occupancy Trend</h3>
              <p className="text-xs text-slate-500 mt-0.5">Room occupancy % throughout the day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={occupancyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="general" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cabin" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="icu" stroke="#f43f5e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="emergency" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Appointments */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Today's Appointments</h3>
              <p className="text-xs text-slate-500 mt-0.5">{dashboardStats.todayAppointments} appointments scheduled</p>
            </div>
            <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View All →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-3">Token</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-3">Patient</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-3">Doctor</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-3">Time</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-3">Status</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-2.5 px-3">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xs font-bold">
                        {apt.tokenNumber}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="text-sm font-medium text-slate-900">{apt.patientName}</p>
                      <p className="text-[10px] text-slate-400">{apt.patientId}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <p className="text-sm text-slate-700">{apt.doctorName}</p>
                      <p className="text-[10px] text-slate-400">{apt.department}</p>
                    </td>
                    <td className="py-2.5 px-3 text-sm text-slate-600">{apt.time}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        apt.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                        apt.status === 'scheduled' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          apt.status === 'completed' ? 'bg-emerald-500' :
                          apt.status === 'in-progress' ? 'bg-blue-500 animate-pulse-soft' :
                          apt.status === 'scheduled' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} />
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[11px] font-medium ${
                        apt.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {apt.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Critical Alerts & ICU Status */}
        <div className="space-y-5">
          {/* Emergency Alert */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-semibold text-rose-900">Critical Alerts</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-3">
                <HeartPulse className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-900">ICU Bed #302 - Critical</p>
                  <p className="text-[10px] text-slate-500">সালমা বেগম - Heart rate irregular</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-3">
                <Activity className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-900">Emergency Room E01 Full</p>
                  <p className="text-[10px] text-slate-500">3/4 beds occupied - need attention</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/70 rounded-xl p-3">
                <Siren className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-900">Oxygen Supply Low</p>
                  <p className="text-[10px] text-slate-500">Floor 3 - 15% remaining</p>
                </div>
              </div>
            </div>
          </div>

          {/* ICU Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">ICU & Critical Rooms</h3>
            <div className="space-y-2.5">
              {criticalRooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      room.status === 'occupied' ? 'bg-rose-500 animate-pulse-soft' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Room {room.number}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{room.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-700">{room.patientName || 'Available'}</p>
                    <p className="text-[10px] text-slate-400">
                      {room.currentBill ? formatBDT(room.currentBill) : 'Ready'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
