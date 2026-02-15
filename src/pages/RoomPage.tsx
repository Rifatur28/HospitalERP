import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  BedDouble, Search, Filter, Plus, Eye, Edit3, Wifi, Wind, Tv,
  Thermometer, MonitorSpeaker, ChevronDown, X, Clock, DollarSign,
  AlertCircle, CheckCircle2, Wrench, CalendarClock, LayoutGrid, List,
  ArrowUpDown, Activity
} from 'lucide-react';
import type { Room, RoomType, RoomStatus } from '../types';
import { rooms as allRooms } from '../data/mockData';

function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString()}`;
}

const roomTypeConfig: Record<RoomType, { label: string; color: string; bg: string; border: string; icon: string }> = {
  general: { label: 'General Ward', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '🏥' },
  cabin: { label: 'Cabin', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', icon: '🛏️' },
  icu: { label: 'ICU', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', icon: '🫀' },
  emergency: { label: 'Emergency', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: '🚑' },
  vip: { label: 'VIP Suite', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '👑' },
  nicu: { label: 'NICU', color: 'text-pink-700', bg: 'bg-pink-50', border: 'border-pink-200', icon: '👶' },
};

const statusConfig: Record<RoomStatus, { label: string; color: string; bg: string; dot: string }> = {
  available: { label: 'Available', color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  occupied: { label: 'Occupied', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  maintenance: { label: 'Maintenance', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  reserved: { label: 'Reserved', color: 'text-violet-700', bg: 'bg-violet-50', dot: 'bg-violet-500' },
};

function getFeatureIcon(feature: string) {
  const f = feature.toLowerCase();
  if (f.includes('wifi')) return <Wifi className="w-3 h-3" />;
  if (f.includes('ac')) return <Wind className="w-3 h-3" />;
  if (f.includes('tv')) return <Tv className="w-3 h-3" />;
  if (f.includes('ventilator') || f.includes('monitor')) return <MonitorSpeaker className="w-3 h-3" />;
  if (f.includes('oxygen')) return <Thermometer className="w-3 h-3" />;
  return null;
}

function RentCalculator({ room, onClose }: { room: Room; onClose: () => void }) {
  const [duration, setDuration] = useState(1);
  const [unit, setUnit] = useState<'hour' | 'day' | 'week'>('day');

  const price = unit === 'hour' ? room.pricePerHour : unit === 'day' ? room.pricePerDay : room.pricePerWeek;
  const total = price * duration;
  const tc = roomTypeConfig[room.type];

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${tc.bg} rounded-xl flex items-center justify-center text-lg`}>{tc.icon}</div>
            <div>
              <h3 className="font-semibold text-slate-900">Room {room.number} - Rent Calculator</h3>
              <p className="text-xs text-slate-500">{tc.label} • {room.acType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Pricing Table */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Hourly', value: room.pricePerHour, u: 'hour' as const },
              { label: 'Daily', value: room.pricePerDay, u: 'day' as const },
              { label: 'Weekly', value: room.pricePerWeek, u: 'week' as const },
            ].map((p) => (
              <button
                key={p.u}
                onClick={() => setUnit(p.u)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${unit === p.u
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
                  }`}
              >
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{p.label}</p>
                <p className={`text-lg font-bold ${unit === p.u ? 'text-blue-600' : 'text-slate-900'}`}>
                  {formatBDT(p.value)}
                </p>
              </button>
            ))}
          </div>

          {/* Duration Slider */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Duration: <span className="text-blue-600 font-bold">{duration} {unit}{duration > 1 ? 's' : ''}</span>
            </label>
            <input
              type="range"
              min={1}
              max={unit === 'hour' ? 24 : unit === 'day' ? 30 : 12}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1</span>
              <span>{unit === 'hour' ? '24' : unit === 'day' ? '30' : '12'}</span>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Base Rate ({unit})</span>
              <span>{formatBDT(price)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Duration</span>
              <span>× {duration}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Service Charge (5%)</span>
              <span>{formatBDT(Math.round(total * 0.05))}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">Total Amount</span>
                <span className="text-xl font-bold text-blue-600">{formatBDT(Math.round(total * 1.05))}</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Room Features</p>
            <div className="flex flex-wrap gap-1.5">
              {room.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[11px] text-slate-600">
                  {getFeatureIcon(f)} {f}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
              Book Now
            </button>
            <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Print Quote
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function RoomDetailModal({ room, onClose }: { room: Room; onClose: () => void }) {
  const tc = roomTypeConfig[room.type];
  const sc = statusConfig[room.status];

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className={`p-5 rounded-t-2xl ${tc.bg} border-b ${tc.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{tc.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Room {room.number}</h3>
                <p className="text-sm text-slate-600">{tc.label} • Floor {room.floor} • {room.acType}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-xl transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Status & Occupancy */}
          <div className="flex gap-3">
            <div className={`flex-1 p-3 rounded-xl ${sc.bg} border ${sc.color.replace('text', 'border')}/20`}>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${sc.dot} ${room.status === 'occupied' ? 'animate-pulse-soft' : ''}`} />
                <span className={`font-semibold ${sc.color}`}>{sc.label}</span>
              </div>
            </div>
            <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Occupancy</p>
              <p className="font-semibold text-slate-900">{room.occupied}/{room.capacity} beds</p>
              <div className="mt-1.5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${room.occupied / room.capacity > 0.8 ? 'bg-rose-500' :
                    room.occupied / room.capacity > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pricing (BDT)</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <Clock className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Hourly</p>
                <p className="text-sm font-bold text-blue-600">{formatBDT(room.pricePerHour)}</p>
              </div>
              <div className="text-center p-3 bg-violet-50 rounded-xl">
                <CalendarClock className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Daily</p>
                <p className="text-sm font-bold text-violet-600">{formatBDT(room.pricePerDay)}</p>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-xl">
                <DollarSign className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-slate-500">Weekly</p>
                <p className="text-sm font-bold text-emerald-600">{formatBDT(room.pricePerWeek)}</p>
              </div>
            </div>
          </div>

          {/* Patient Info (if occupied) */}
          {room.patientName && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2">Current Patient</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-500">Patient</p>
                  <p className="text-sm font-medium text-slate-900">{room.patientName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Admission</p>
                  <p className="text-sm font-medium text-slate-900">{room.admissionDate}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-500">Current Bill</p>
                  <p className="text-lg font-bold text-amber-700">{room.currentBill ? formatBDT(room.currentBill) : 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Features & Amenities</p>
            <div className="flex flex-wrap gap-2">
              {room.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-700 font-medium">
                  {getFeatureIcon(f)} {f}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {room.status === 'available' && (
              <button className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                Assign Patient
              </button>
            )}
            {room.status === 'occupied' && (
              <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                View Bill
              </button>
            )}
            <button className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Edit Room
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function RoomPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<RoomType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [calcRoom, setCalcRoom] = useState<Room | null>(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [sortBy, setSortBy] = useState<'number' | 'price' | 'occupancy'>('number');

  const filteredRooms = useMemo(() => {
    let result = allRooms.filter((r) => {
      const matchesSearch = r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.patientName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || r.type === filterType;
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'price') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'occupancy') return (b.occupied / b.capacity) - (a.occupied / a.capacity);
      return a.number.localeCompare(b.number);
    });

    return result;
  }, [searchQuery, filterType, filterStatus, sortBy]);

  const roomSummary = useMemo(() => {
    const total = allRooms.length;
    const available = allRooms.filter(r => r.status === 'available').length;
    const occupied = allRooms.filter(r => r.status === 'occupied').length;
    const totalBeds = allRooms.reduce((s, r) => s + r.capacity, 0);
    const occupiedBeds = allRooms.reduce((s, r) => s + r.occupied, 0);
    return { total, available, occupied, maintenance: total - available - occupied - allRooms.filter(r => r.status === 'reserved').length, reserved: allRooms.filter(r => r.status === 'reserved').length, totalBeds, occupiedBeds };
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Room & Seat Management</h1>
          <p className="text-slate-500 mt-1 text-sm">কক্ষ ও আসন ব্যবস্থাপনা • Manage hospital rooms, beds, and pricing</p>
        </div>
        <button
          onClick={() => setShowAddRoom(!showAddRoom)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add New Room
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Rooms', value: roomSummary.total, icon: BedDouble, color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Available', value: roomSummary.available, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Occupied', value: roomSummary.occupied, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Reserved', value: roomSummary.reserved, icon: CalendarClock, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Maintenance', value: roomSummary.maintenance, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Bed Occupancy', value: `${Math.round((roomSummary.occupiedBeds / roomSummary.totalBeds) * 100)}%`, icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((s, i) => (
          <div key={i} className={`${s.bg} rounded-xl p-3 border border-slate-100`}>
            <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
            <p className="text-xl font-bold text-slate-900">{s.value}</p>
            <p className="text-[11px] text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Floor Map Visual */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-900 mb-3">Floor Occupancy Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((floor) => {
            const floorRooms = allRooms.filter(r => r.floor === floor);
            const occ = floorRooms.filter(r => r.status === 'occupied').length;
            const total = floorRooms.length;
            const pct = total > 0 ? Math.round((occ / total) * 100) : 0;
            return (
              <div key={floor} className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {floor === 0 ? 'Ground' : `Floor ${floor}`}
                  </span>
                  <span className={`text-xs font-bold ${pct > 80 ? 'text-rose-500' : pct > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct > 80 ? 'bg-gradient-to-r from-rose-400 to-rose-500' :
                      pct > 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                        'bg-gradient-to-r from-emerald-400 to-emerald-500'
                      }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {floorRooms.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRoom(r)}
                      className={`w-7 h-7 rounded-lg text-[9px] font-bold flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${r.status === 'available' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                        r.status === 'occupied' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                          r.status === 'reserved' ? 'bg-violet-100 text-violet-700 hover:bg-violet-200' :
                            'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        }`}
                      title={`Room ${r.number}`}
                    >
                      {r.number}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-100 rounded" />Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded" />Occupied</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-violet-100 rounded" />Reserved</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 rounded" />Maintenance</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search rooms by number or patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as RoomType | 'all')}
              className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="general">General Ward</option>
              <option value="cabin">Cabin</option>
              <option value="icu">ICU</option>
              <option value="emergency">Emergency</option>
              <option value="vip">VIP Suite</option>
              <option value="nicu">NICU</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as RoomStatus | 'all')}
              className="pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'number' ? 'price' : sortBy === 'price' ? 'occupancy' : 'number')}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === 'number' ? 'By Room' : sortBy === 'price' ? 'By Price' : 'By Occupancy'}
          </button>
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Room Type Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          All ({allRooms.length})
        </button>
        {(Object.entries(roomTypeConfig) as [RoomType, typeof roomTypeConfig[RoomType]][]).map(([type, config]) => {
          const count = allRooms.filter(r => r.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1.5 ${filterType === type ? `${config.bg} ${config.color} border ${config.border}` : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              <span>{config.icon}</span> {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Rooms Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => {
            const tc = roomTypeConfig[room.type];
            const sc = statusConfig[room.status];
            const occupancyPct = (room.occupied / room.capacity) * 100;

            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {/* Header Bar */}
                <div className={`px-4 py-3 ${tc.bg} border-b ${tc.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{tc.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Room {room.number}</p>
                      <p className="text-[10px] text-slate-500">Floor {room.floor} • {room.acType}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${sc.bg} ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${room.status === 'occupied' ? 'animate-pulse-soft' : ''}`} />
                    {sc.label}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Type Label */}
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${tc.bg} ${tc.color}`}>
                    {tc.label}
                  </span>

                  {/* Bed Occupancy */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Bed Occupancy</span>
                      <span className="font-semibold text-slate-700">{room.occupied}/{room.capacity}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Pricing Quick */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center bg-slate-50 rounded-lg py-1.5">
                      <p className="text-[9px] text-slate-400">Hour</p>
                      <p className="text-xs font-bold text-slate-700">৳{room.pricePerHour}</p>
                    </div>
                    <div className="text-center bg-slate-50 rounded-lg py-1.5">
                      <p className="text-[9px] text-slate-400">Day</p>
                      <p className="text-xs font-bold text-slate-700">৳{room.pricePerDay.toLocaleString()}</p>
                    </div>
                    <div className="text-center bg-slate-50 rounded-lg py-1.5">
                      <p className="text-[9px] text-slate-400">Week</p>
                      <p className="text-xs font-bold text-slate-700">৳{(room.pricePerWeek / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  {/* Patient (if occupied) */}
                  {room.patientName && (
                    <div className="bg-blue-50/50 rounded-lg px-3 py-2 border border-blue-100">
                      <p className="text-[10px] text-slate-500">Patient</p>
                      <p className="text-xs font-medium text-slate-900">{room.patientName}</p>
                      {room.currentBill && (
                        <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Bill: {formatBDT(room.currentBill)}</p>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {room.features.slice(0, 3).map((f) => (
                      <span key={f} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-50 rounded text-[9px] text-slate-500">
                        {getFeatureIcon(f)} {f}
                      </span>
                    ))}
                    {room.features.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-slate-50 rounded text-[9px] text-slate-400">
                        +{room.features.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setSelectedRoom(room)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-medium text-slate-600 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button
                      onClick={() => setCalcRoom(room)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-medium text-blue-600 transition-colors"
                    >
                      <DollarSign className="w-3 h-3" /> Calculate
                    </button>
                    <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Room</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Type</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Status</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Beds</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Daily Rate</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Patient</th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => {
                  const tc = roomTypeConfig[room.type];
                  const sc = statusConfig[room.status];
                  return (
                    <tr key={room.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-sm text-slate-900">#{room.number}</span>
                        <span className="text-[10px] text-slate-400 ml-1">F{room.floor}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${tc.bg} ${tc.color}`}>
                          {tc.icon} {tc.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${sc.bg} ${sc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{room.occupied}/{room.capacity}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-slate-900">{formatBDT(room.pricePerDay)}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{room.patientName || '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSelectedRoom(room)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-500">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setCalcRoom(room)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-emerald-500">
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-amber-500">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredRooms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <BedDouble className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-lg font-medium text-slate-500">No rooms found</p>
          <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Modals */}
      {selectedRoom && <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
      {calcRoom && <RentCalculator room={calcRoom} onClose={() => setCalcRoom(null)} />}

      {/* Add Room Modal */}
      {showAddRoom && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={() => setShowAddRoom(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900 text-lg">Add New Room</h3>
              <button onClick={() => setShowAddRoom(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Room Number</label>
                  <input type="text" placeholder="e.g., 501" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Floor</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>Ground</option>
                    <option>1st Floor</option>
                    <option>2nd Floor</option>
                    <option>3rd Floor</option>
                    <option>4th Floor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Room Type</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>General Ward</option>
                    <option>Cabin</option>
                    <option>ICU</option>
                    <option>Emergency</option>
                    <option>VIP Suite</option>
                    <option>NICU</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">AC Type</label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>AC</option>
                    <option>Non-AC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Bed Capacity</label>
                <input type="number" placeholder="e.g., 4" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Hourly (৳)</label>
                  <input type="number" placeholder="100" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Daily (৳)</label>
                  <input type="number" placeholder="1500" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Weekly (৳)</label>
                  <input type="number" placeholder="9000" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  Create Room
                </button>
                <button onClick={() => setShowAddRoom(false)} className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
