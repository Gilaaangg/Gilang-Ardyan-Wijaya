import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, RefreshCw, BookOpen, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SecurityBanner({ onOpenDocs }) {
  const { showNotification } = useAuth();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!window.confirm('Reset seluruh data ke kondisi awal lab (data sintetis default)?')) return;
    setResetting(true);
    try {
      await api.resetDatabase();
      showNotification('Data lab berhasil di-reset ke kondisi awal.', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      showNotification('Gagal mereset data: ' + err.message, 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <aside aria-label="Peringatan Keamanan Laboratorium" className="bg-amber-500/10 border-b border-amber-500/30 text-amber-900 px-4 py-2 text-xs md:text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white tracking-wide shadow-sm animate-pulse">
            SECURITY LAB — FICTIONAL CAMPUS
          </span>
          <span className="hidden md:inline font-medium text-slate-700">
            Seluruh data (NIM, akun, nama, nilai) adalah 100% sintetis untuk tugas keamanan aplikasi.
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenDocs}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-medium text-xs transition"
            title="Lihat Petunjuk Eksploitasi & Rekomendasi Perbaikan"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Petunjuk Lab & Kerentanan</span>
          </button>

          <button
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition disabled:opacity-50"
            title="Kembalikan semua nilai & postingan ke default sintetis"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Data Lab</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
