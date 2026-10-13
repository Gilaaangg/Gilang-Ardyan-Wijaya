import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, GraduationCap, UserCheck, LogOut, ChevronDown, User, ShieldAlert } from 'lucide-react';

export default function Navbar({ onOpenDocs }) {
  const { user, logout, switchUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const labAccounts = [
    { username: 'student001', role: 'Mahasiswa', name: 'Budi Pratama (Fiktif)', nim: '202401001' },
    { username: 'student002', role: 'Mahasiswa', name: 'Siti Rahmawati (Fiktif)', nim: '202401002' },
    { username: 'student003', role: 'Mahasiswa', name: 'Ahmad Fauzi (Fiktif)', nim: '202401003' },
    { username: 'lecturer001', role: 'Dosen', name: 'Dr. Hendra Wijaya, M.Kom (Fiktif)' },
    { username: 'lecturer002', role: 'Dosen', name: 'Prof. Maya Kusuma, Ph.D (Fiktif)' },
    { username: 'admin001', role: 'Admin', name: 'Admin Lab Cyberia (Fiktif)' },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="bg-purple-100 text-purple-800 border border-purple-200 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>;
      case 'dosen':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs px-2 py-0.5 rounded-full font-medium">Dosen</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2 py-0.5 rounded-full font-medium">Mahasiswa</span>;
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Kampus */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-campus-700 to-campus-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">ITSC Cyberia</span>
                <span className="hidden sm:inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                  PORTAL AKADEMIK
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Institut Teknologi & Sains Cyberia (Fictional)</p>
            </div>
          </div>

          {/* User Controls & Quick Lab Switcher */}
          <div className="flex items-center space-x-3">
            {/* Quick Switch Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition"
                title="Ganti Akun Instan untuk Uji Coba Lab"
              >
                <UserCheck className="w-4 h-4 text-campus-600" />
                <span className="hidden md:inline">Ganti Akun Demo</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    Akun Pengujian Cepat (Password: password123)
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {labAccounts.map((acc) => (
                      <button
                        key={acc.username}
                        type="button"
                        onClick={async () => {
                          setDropdownOpen(false);
                          await switchUser(acc.username);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-campus-50 transition ${
                          user?.username === acc.username ? 'bg-campus-50/70 font-semibold' : ''
                        }`}
                      >
                        <div>
                          <div className="text-slate-800">{acc.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {acc.username} {acc.nim ? `• NIM: ${acc.nim}` : ''}
                          </div>
                        </div>
                        {getRoleBadge(acc.role.toLowerCase())}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current User Info */}
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-2 ring-slate-100 flex-shrink-0">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</div>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  {getRoleBadge(user?.role)}
                  <span className="text-[11px] font-mono text-slate-500">@{user?.username}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Keluar dari sesi"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
