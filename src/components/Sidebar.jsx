import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Award,
  FileText,
  MessagesSquare,
  User,
  Users,
  ShieldAlert,
  BookOpen,
  CheckSquare,
  GraduationCap
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenDocs }) {
  const { user } = useAuth();
  const role = user?.role || 'mahasiswa';

  const studentMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'grades', label: 'Nilai Akademik', icon: Award, badge: 'IDOR Lab', badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'assignments', label: 'Tugas Kuliah', icon: FileText },
    { id: 'discussion', label: 'Forum Diskusi', icon: MessagesSquare, badge: 'XSS Lab', badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'docs', label: 'Panduan Keamanan', icon: BookOpen },
  ];

  const lecturerMenu = [
    { id: 'lecturer-dashboard', label: 'Dashboard Dosen', icon: LayoutDashboard },
    { id: 'grading', label: 'Input & Kelola Nilai', icon: Award, badge: 'IDOR Demo', badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'lecturer-assignments', label: 'Tinjau Tugas Mahasiswa', icon: CheckSquare },
    { id: 'discussion', label: 'Forum Diskusi Kampus', icon: MessagesSquare, badge: 'XSS Lab', badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'profile', label: 'Profil Dosen', icon: User },
    { id: 'docs', label: 'Panduan Keamanan', icon: BookOpen },
  ];

  const adminMenu = [
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'users-manage', label: 'Manajemen Akun', icon: Users },
    { id: 'discussion', label: 'Monitoring Forum', icon: MessagesSquare, badge: 'XSS Lab', badgeColor: 'bg-amber-100 text-amber-700' },
    { id: 'grades', label: 'Audit Nilai (IDOR Lab)', icon: Award, badge: 'IDOR Lab', badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'docs', label: 'Panduan Keamanan', icon: BookOpen },
  ];

  let currentMenu = studentMenu;
  if (role === 'dosen') currentMenu = lecturerMenu;
  if (role === 'admin') currentMenu = adminMenu;

  return (
    <aside aria-label="Navigasi Utama Portal" className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        {/* Role Identity Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Portal Mahasiswa & Akademik
          </div>
          <div className="text-sm font-bold text-slate-800 mt-1 flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-campus-600" />
            <span className="capitalize">{role === 'mahasiswa' ? 'Portal Mahasiswa' : role === 'dosen' ? 'Portal Dosen' : 'Konsol Admin'}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5 truncate font-mono">
            ID: {user?.id}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Menu Navigasi
          </div>
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'docs') {
                    onOpenDocs();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium transition ${
                  isActive
                    ? 'bg-campus-600 text-white shadow-sm shadow-campus-500/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Lab Info Box at bottom of sidebar */}
      <div className="p-3 bg-red-50/60 border border-red-200/60 rounded-xl text-xs space-y-2 mt-4">
        <div className="flex items-center space-x-1.5 text-red-800 font-semibold">
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>Lab Kerentanan Aktif</span>
        </div>
        <p className="text-[11px] text-red-700 leading-relaxed">
          Portal ini sengaja mengandung kerentanan <strong>Stored XSS</strong> dan <strong>IDOR</strong> untuk demonstrasi akademik.
        </p>
        <button
          onClick={onOpenDocs}
          className="w-full text-center py-1 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded font-semibold text-[11px] transition shadow-2xs"
        >
          Buka Dokumentasi & Solusi
        </button>
      </div>
    </aside>
  );
}
