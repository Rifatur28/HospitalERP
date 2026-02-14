export type RoomType = 'general' | 'cabin' | 'icu' | 'emergency' | 'vip' | 'nicu';
export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';
export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'overdue';
export type PageType = 'dashboard' | 'rooms' | 'doctors';
export type Language = 'en' | 'bn';

export interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  capacity: number;
  occupied: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek: number;
  features: string[];
  patientName?: string;
  admissionDate?: string;
  currentBill?: number;
  acType: 'AC' | 'Non-AC';
}

export interface Doctor {
  id: string;
  name: string;
  nameBn: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: number;
  rating: number;
  totalPatients: number;
  avatar: string;
  available: boolean;
  schedule: DoctorSchedule[];
  consultationFee: number;
  emergencyFee: number;
  phone: string;
  email: string;
  nextAvailable: string;
  todayAppointments: number;
  maxAppointments: number;
}

export interface DoctorSchedule {
  day: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: 'regular' | 'emergency' | 'follow-up' | 'online';
  tokenNumber: number;
  paymentStatus: PaymentStatus;
  fee: number;
}

export interface DashboardStats {
  totalPatients: number;
  todayAdmissions: number;
  totalDoctors: number;
  availableDoctors: number;
  totalRooms: number;
  occupiedRooms: number;
  todayRevenue: number;
  monthlyRevenue: number;
  pendingBills: number;
  emergencyCases: number;
  todayAppointments: number;
  completedAppointments: number;
  occupancyRate: number;
  avgStayDuration: number;
}
