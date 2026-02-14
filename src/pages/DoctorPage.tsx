import { useState, useMemo } from 'react';
import {
  Search, Star, Clock, Calendar, Phone, Mail, ChevronDown,
  UserPlus, X, Users, CheckCircle2, AlertCircle, Filter,
  Stethoscope, CalendarPlus, Video, Zap, ArrowRight
} from 'lucide-react';
import type { Doctor, AppointmentStatus } from '../types';
import { doctors as allDoctors, appointments as allAppointments } from '../data/mockData';

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString()}`;
}

const statusColors: Record<AppointmentStatus, { bg: string; text: string; dot: string }> = {
  'scheduled': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'cancelled': { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
  'no-show': { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

function DoctorDetailModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'appointments'>('schedule');
  const doctorAppointments = allAppointments.filter(a => a.doctorId === doctor.id);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-x-10 -translate-y-10" />
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 relative">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              {doctor.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold">{doctor.name}</h2>
              <p className="text-blue-100 text-sm">{doctor.nameBn}</p>
              <p className="text-blue-200 text-xs mt-1">{doctor.qualification}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-blue-100 text-[10px] uppercase">Experience</p>
              <p className="font-bold">{doctor.experience} Years</p>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-blue-100 text-[10px] uppercase">Rating</p>
              <p className="font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> {doctor.rating}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-blue-100 text-[10px] uppercase">Patients</p>
              <p className="font-bold">{doctor.totalPatients.toLocaleString()}</p>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2 backdrop-blur-sm">
              <p className="text-blue-100 text-[10px] uppercase">Status</p>
              <p className={`font-bold ${doctor.available ? 'text-emerald-300' : 'text-rose-300'}`}>
                {doctor.available ? '● Online' : '○ Offline'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[50vh]">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-[10px] text-slate-500">Department</p>
                <p className="text-sm font-medium text-slate-900">{doctor.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Clock className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-[10px] text-slate-500">Next Available</p>
                <p className="text-sm font-medium text-slate-900">{doctor.nextAvailable}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-4 h-4 text-violet-500" />
              <div>
                <p className="text-[10px] text-slate-500">Phone</p>
                <p className="text-sm font-medium text-slate-900">{doctor.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
              <Mail className="w-4 h-4 text-rose-500" />
              <div>
                <p className="text-[10px] text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900 text-xs">{doctor.email}</p>
              </div>
            </div>
          </div>

          {/* Fees */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-[10px] text-blue-600 uppercase font-medium">Consultation Fee</p>
              <p className="text-xl font-bold text-blue-700">{formatBDT(doctor.consultationFee)}</p>
            </div>
            <div className="flex-1 text-center p-3 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-[10px] text-rose-600 uppercase font-medium">Emergency Fee</p>
              <p className="text-xl font-bold text-rose-700">{formatBDT(doctor.emergencyFee)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'schedule' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Weekly Schedule
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'appointments' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Today's Appointments ({doctorAppointments.length})
            </button>
          </div>

          {activeTab === 'schedule' ? (
            <div className="space-y-1.5">
              {doctor.schedule.map((s) => (
                <div key={s.day} className={`flex items-center justify-between p-3 rounded-xl ${s.isActive ? 'bg-slate-50' : 'bg-rose-50/50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${s.isActive ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                    <span className="text-sm font-medium text-slate-700 w-24">{s.day}</span>
                  </div>
                  <span className={`text-sm ${s.isActive ? 'text-slate-900 font-medium' : 'text-rose-500'}`}>
                    {s.isActive ? `${s.startTime} - ${s.endTime}` : 'Off Day'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {doctorAppointments.length === 0 ? (
                <p className="text-center text-slate-500 py-8 text-sm">No appointments today</p>
              ) : (
                doctorAppointments.map((apt) => {
                  const sc = statusColors[apt.status];
                  return (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold">
                          {apt.tokenNumber}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{apt.patientName}</p>
                          <p className="text-[10px] text-slate-500">{apt.time} • {apt.type}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>
                        {apt.status.replace('-', ' ')}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Book Appointment */}
          <div className="flex gap-3 mt-5">
            <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
              <CalendarPlus className="w-4 h-4" /> Book Appointment
            </button>
            <button className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center gap-2">
              <Video className="w-4 h-4" /> Video Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookAppointmentModal({ onClose }: { onClose: () => void }) {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentType, setAppointmentType] = useState('regular');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">Book New Appointment</h3>
            <p className="text-xs text-slate-500">নতুন অ্যাপয়েন্টমেন্ট বুক করুন</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Appointment Type */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">Appointment Type</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'regular', label: 'Regular', icon: Calendar, color: 'blue' },
                { value: 'emergency', label: 'Emergency', icon: Zap, color: 'rose' },
                { value: 'follow-up', label: 'Follow-up', icon: ArrowRight, color: 'amber' },
                { value: 'online', label: 'Online', icon: Video, color: 'emerald' },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setAppointmentType(t.value)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    appointmentType === t.value
                      ? `border-${t.color}-500 bg-${t.color}-50`
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <t.icon className={`w-5 h-5 mx-auto mb-1 ${appointmentType === t.value ? `text-${t.color}-500` : 'text-slate-400'}`} />
                  <p className="text-[10px] font-medium text-slate-700">{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Patient Name</label>
              <input type="text" placeholder="রোগীর নাম" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Phone Number</label>
              <input type="tel" placeholder="+880 1XXX-XXXXXX" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Select Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">Choose a doctor...</option>
              {allDoctors.filter(d => d.available).map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.specialization} ({formatBDT(d.consultationFee)})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Date</label>
              <input type="date" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Preferred Time</label>
              <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>09:00 AM</option>
                <option>09:30 AM</option>
                <option>10:00 AM</option>
                <option>10:30 AM</option>
                <option>11:00 AM</option>
                <option>11:30 AM</option>
                <option>02:00 PM</option>
                <option>02:30 PM</option>
                <option>03:00 PM</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Notes (Optional)</label>
            <textarea placeholder="Any special notes..." rows={2} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
          </div>

          {/* Fee Summary */}
          {selectedDoctor && (
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Consultation Fee</span>
                <span className="font-bold text-blue-700">
                  {formatBDT(allDoctors.find(d => d.id === selectedDoctor)?.consultationFee || 0)}
                </span>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="text-xs font-medium text-slate-600 mb-2 block">Payment Method</label>
            <div className="flex gap-2">
              {['Cash', 'bKash', 'Nagad', 'Card'].map(m => (
                <button key={m} className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Confirm Booking
            </button>
            <button onClick={onClose} className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DoctorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [activeView, setActiveView] = useState<'doctors' | 'queue'>('doctors');

  const departments = useMemo(() => [...new Set(allDoctors.map(d => d.department))], []);

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.nameBn.includes(searchQuery);
      const matchesDept = filterDept === 'all' || d.department === filterDept;
      const matchesAvail = filterAvailability === 'all' || 
        (filterAvailability === 'available' && d.available) ||
        (filterAvailability === 'busy' && !d.available);
      return matchesSearch && matchesDept && matchesAvail;
    });
  }, [searchQuery, filterDept, filterAvailability]);

  const queueAppointments = allAppointments.filter(a => a.status === 'scheduled' || a.status === 'in-progress');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Doctor & Appointment Management</h1>
          <p className="text-slate-500 mt-1 text-sm">ডাক্তার ও অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা • Manage doctors, schedules, and bookings</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <UserPlus className="w-4 h-4" />
            Add Doctor
          </button>
          <button
            onClick={() => setShowBooking(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Doctors', value: allDoctors.length, icon: Stethoscope, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Available Now', value: allDoctors.filter(d => d.available).length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Fully Booked', value: allDoctors.filter(d => !d.available).length, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: "Today's Appointments", value: allAppointments.length, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'In Queue', value: queueAppointments.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-3 border border-slate-100`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-xl font-bold text-slate-900">{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toggle View */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveView('doctors')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeView === 'doctors' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4 inline mr-1.5" />Doctor Panel
        </button>
        <button
          onClick={() => setActiveView('queue')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeView === 'queue' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4 inline mr-1.5" />Patient Queue
        </button>
      </div>

      {activeView === 'doctors' ? (
        <>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="busy">Fully Booked</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {/* Card Header */}
                <div className="relative p-5 pb-3">
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      doctor.available ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${doctor.available ? 'bg-emerald-500 animate-pulse-soft' : 'bg-rose-400'}`} />
                      {doctor.available ? 'Available' : 'Fully Booked'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                      {doctor.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{doctor.name}</h3>
                      <p className="text-[11px] text-slate-500">{doctor.nameBn}</p>
                      <p className="text-xs text-blue-600 font-medium mt-0.5">{doctor.specialization}</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-4 space-y-3">
                  {/* Qualification */}
                  <p className="text-[11px] text-slate-500 bg-slate-50 rounded-lg px-2 py-1.5">{doctor.qualification}</p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-900">{doctor.experience}y</p>
                      <p className="text-[9px] text-slate-400">Experience</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-900 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {doctor.rating}
                      </p>
                      <p className="text-[9px] text-slate-400">Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-900">{(doctor.totalPatients / 1000).toFixed(1)}K</p>
                      <p className="text-[9px] text-slate-400">Patients</p>
                    </div>
                  </div>

                  {/* Today's Schedule */}
                  <div className="bg-slate-50 rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">Today's Appointments</span>
                      <span className="text-[10px] font-bold text-blue-600">{doctor.todayAppointments}/{doctor.maxAppointments}</span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (doctor.todayAppointments / doctor.maxAppointments) >= 1 ? 'bg-rose-500' :
                          (doctor.todayAppointments / doctor.maxAppointments) > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min((doctor.todayAppointments / doctor.maxAppointments) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400">Consultation</span>
                      <p className="text-sm font-bold text-slate-900">{formatBDT(doctor.consultationFee)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      Next: {doctor.nextAvailable}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setSelectedDoctor(doctor)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-600 transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => setShowBooking(true)}
                      disabled={!doctor.available}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                        doctor.available
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-md hover:shadow-blue-500/30'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {doctor.available ? 'Book Now' : 'Full'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-medium text-slate-500">No doctors found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      ) : (
        /* Queue Management View */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Active Queue */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Patient Queue</h3>
                <p className="text-xs text-slate-500 mt-0.5">{queueAppointments.length} patients in queue</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-700">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-soft" />
                  Live Queue
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {allAppointments.map((apt) => {
                const sc = statusColors[apt.status];
                return (
                  <div key={apt.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    apt.status === 'in-progress' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 hover:bg-slate-50'
                  }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      apt.status === 'in-progress' ? 'bg-blue-500 text-white' :
                      apt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      apt.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      #{apt.tokenNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900">{apt.patientName}</p>
                        {apt.type === 'emergency' && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded text-[9px] font-bold uppercase">Emergency</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{apt.doctorName} • {apt.department} • {apt.time}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${sc.bg} ${sc.text} flex items-center gap-1`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${apt.status === 'in-progress' ? 'animate-pulse-soft' : ''}`} />
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('-', ' ')}
                    </span>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-900">{formatBDT(apt.fee)}</p>
                      <p className={`text-[10px] ${apt.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {apt.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queue Stats */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Queue Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                  <span className="text-sm text-emerald-700">Completed</span>
                  <span className="text-lg font-bold text-emerald-700">
                    {allAppointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-blue-700">In Progress</span>
                  <span className="text-lg font-bold text-blue-700">
                    {allAppointments.filter(a => a.status === 'in-progress').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                  <span className="text-sm text-amber-700">Waiting</span>
                  <span className="text-lg font-bold text-amber-700">
                    {allAppointments.filter(a => a.status === 'scheduled').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                  <span className="text-sm text-rose-700">Cancelled</span>
                  <span className="text-lg font-bold text-rose-700">
                    {allAppointments.filter(a => a.status === 'cancelled').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-2">Now Serving</h3>
              {allAppointments.filter(a => a.status === 'in-progress').slice(0, 2).map(apt => (
                <div key={apt.id} className="bg-white/15 rounded-xl p-3 backdrop-blur-sm mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-sm">
                      #{apt.tokenNumber}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{apt.patientName}</p>
                      <p className="text-blue-200 text-[11px]">{apt.doctorName}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-blue-200 text-xs">Avg. Wait Time</p>
                <p className="text-2xl font-bold">~18 min</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedDoctor && <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />}
      {showBooking && <BookAppointmentModal onClose={() => setShowBooking(false)} />}
    </div>
  );
}
