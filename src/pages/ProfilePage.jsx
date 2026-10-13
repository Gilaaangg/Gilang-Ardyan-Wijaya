import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, BookOpen, GraduationCap, Calendar, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Pengguna Portal</h1>
        <p className="text-xs text-slate-500 mt-1">
          Informasi identitas akun sintetis di sistem informasi akademik kampus Cyberia.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-campus-800 to-campus-600 relative">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-xs text-white text-xs px-3 py-1 rounded-full font-mono">
            STATUS: 100% SINTETIS (FIKTIF)
          </div>
        </div>

        <div className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4">
            <div className="flex items-end space-x-4">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md ring-4 ring-white">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="mb-1">
                <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="font-mono">@{user?.username}</span>
                  <span>•</span>
                  <span className="capitalize font-medium text-campus-700">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Akun Lab Aktif</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Identitas Akun</span>
              <div className="font-mono text-slate-800 font-medium">ID Pengguna: {user?.id}</div>
              <div className="font-mono text-slate-800">
                {user?.role === 'mahasiswa' ? `NIM: ${user?.nim}` : `NIP: ${user?.nip || '-'}`}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Kontak & Email Kampus</span>
              <div className="text-slate-800 font-medium">{user?.email}</div>
              <div className="text-slate-500">Domain Resmi: cyberia.ac.id</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Program Studi / Departemen</span>
              <div className="text-slate-800 font-medium">{user?.program || user?.department || 'Fakultas Ilmu Komputer'}</div>
              <div className="text-slate-500">{user?.role === 'mahasiswa' ? `Semester ${user?.semester || 5}` : 'Dosen Pengajar'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">Indeks Prestasi Kumulatif (IPK)</span>
              <div className="text-slate-800 font-mono font-bold text-base">
                {user?.ipk ? user.ipk.toFixed(2) : '-'} / 4.00
              </div>
              <div className="text-slate-400 text-[11px]">Dapat dibaca oleh akun lain melalui IDOR</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
