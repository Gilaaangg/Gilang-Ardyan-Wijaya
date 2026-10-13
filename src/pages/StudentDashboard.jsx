import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatsCard from '../components/StatsCard';
import { Award, BookOpen, FileText, MessagesSquare, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function StudentDashboard({ setActiveTab, onOpenDocs }) {
  const { user } = useAuth();
  const [gradesData, setGradesData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        setLoading(true);
        const [grd, asgn] = await Promise.all([
          api.getGrades(user.id),
          api.getAssignments(user.id),
        ]);
        setGradesData(grd);
        setAssignments(asgn.assignments || []);
      } catch (e) {
        console.error('Failed to load dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const grades = gradesData?.grades || [];
  const totalSks = grades.reduce((acc, curr) => acc + (curr.sks || 3), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-campus-800 to-campus-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium text-campus-100 backdrop-blur-xs">
              <span>Semester {user?.semester || 5} • {user?.program || 'S1 Informatika'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Selamat Datang, {user?.name}!
            </h1>
            <p className="text-sm text-campus-100">
              NIM: <span className="font-mono font-medium">{user?.nim}</span> • Portal Akademik & Laboratorium Keamanan Siber ITSC.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('grades')}
              className="px-4 py-2 bg-white text-campus-800 font-semibold text-xs rounded-xl hover:bg-campus-50 transition shadow-sm flex items-center space-x-1.5"
            >
              <span>Uji Kerentanan IDOR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('discussion')}
              className="px-4 py-2 bg-campus-700/80 border border-white/20 text-white font-semibold text-xs rounded-xl hover:bg-campus-700 transition flex items-center space-x-1.5"
            >
              <span>Uji Stored XSS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Indeks Prestasi (IPK)"
          value={user?.ipk ? user.ipk.toFixed(2) : '3.65'}
          subtitle="Skala 4.00"
          icon={Award}
          color="emerald"
        />
        <StatsCard
          title="Total SKS Diambil"
          value={totalSks ? `${totalSks} SKS` : '12 SKS'}
          subtitle="4 Mata Kuliah Aktif"
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Tugas Aktif"
          value={`${assignments.length} Tugas`}
          subtitle="Perlu dikerjakan"
          icon={FileText}
          color="amber"
        />
        <StatsCard
          title="Status Akun"
          value={user?.status || 'Aktif'}
          subtitle="Data Sintetis Lab"
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Grid: Ringkasan Nilai & Tugas Kuliah */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ringkasan Nilai (Kaitan IDOR) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Nilai Akademik Semester Ini</h2>
              <p className="text-xs text-slate-500">
                Fitur ini sengaja memiliki kerentanan IDOR pada endpoint <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded font-mono">/api/grades?studentId=...</code>
              </p>
            </div>
            <button
              onClick={() => setActiveTab('grades')}
              className="text-xs font-semibold text-campus-600 hover:text-campus-700 hover:underline flex items-center space-x-1"
            >
              <span>Buka Demo IDOR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/50">
                  <th className="py-2.5 px-3 font-semibold">Mata Kuliah</th>
                  <th className="py-2.5 px-3 font-semibold">SKS</th>
                  <th className="py-2.5 px-3 font-semibold">Nilai Angka</th>
                  <th className="py-2.5 px-3 font-semibold">Huruf</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-slate-400">
                      Memuat data nilai...
                    </td>
                  </tr>
                ) : (
                  grades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-medium text-slate-800">{g.courseName}</td>
                      <td className="py-3 px-3 text-slate-600">{g.sks}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-700">{g.score}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded font-bold font-mono text-xs ${
                          g.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                          g.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {g.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-700 font-medium">{g.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tugas Kuliah */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Tugas Terjadwal</h2>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs font-semibold text-campus-600 hover:text-campus-700 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-3">
            {assignments.map((asn) => (
              <div
                key={asn.id}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-campus-300 hover:bg-campus-50/30 transition space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span className="line-clamp-1">{asn.title}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                    Open
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2">{asn.description}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{asn.courseName}</span>
                  <button
                    onClick={() => setActiveTab('assignments')}
                    className="text-campus-600 font-semibold hover:underline"
                  >
                    Kirim &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
