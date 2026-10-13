import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ShieldAlert, AlertTriangle, ArrowRight, CheckCircle2, Search, RefreshCw, Eye, UserX } from 'lucide-react';

export default function GradesPage({ onOpenDocs }) {
  const { user } = useAuth();

  // Parameter studentId yang sedang diminta dari API (Default: ID mahasiswa yang sedang login)
  const [targetStudentId, setTargetStudentId] = useState(user?.id || 'STU001');
  const [customInputId, setCustomInputId] = useState(user?.id || 'STU001');

  const [gradesResponse, setGradesResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sinkronisasi saat user berganti akun
  useEffect(() => {
    if (user?.id) {
      setTargetStudentId(user.id);
      setCustomInputId(user.id);
      fetchGrades(user.id);
    }
  }, [user]);

  // =========================================================================
  // INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
  // Fungsi ini mengirimkan parameter `studentId` ke API:
  // GET /api/grades?studentId=...
  // Backend tidak melakukan validasi kepemilikan sesi.
  // Pengguna STU001 dapat dengan bebas memanggil `targetStudentId = STU002`
  // dan membaca seluruh nilai rahasia mahasiswa STU002.
  // =========================================================================
  const fetchGrades = async (studentIdToFetch) => {
    setLoading(true);
    setError('');
    try {
      // INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
      const data = await api.getGrades(studentIdToFetch);
      setGradesResponse(data);
      setTargetStudentId(studentIdToFetch);
    } catch (err) {
      setError(err.message || 'Gagal memanggil API nilai.');
      setGradesResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const handleIdorTrigger = (newId) => {
    setCustomInputId(newId);
    fetchGrades(newId);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInputId.trim()) return;
    fetchGrades(customInputId.trim());
  };

  const isIdorActive = user && targetStudentId !== user.id;

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Kartu Hasil Studi & Nilai Akademik</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              IDOR Lab Modul
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Halaman resmi transkrip nilai mahasiswa Institut Teknologi & Sains Cyberia (Fictional).
          </p>
        </div>

        <button
          onClick={onOpenDocs}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition shadow-sm"
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Panduan Eksploitasi IDOR</span>
        </button>
      </div>

      {/* =========================================================================
          PANEL INTERAKTIF PENGUJIAN IDOR
          INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
      ========================================================================= */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-rose-600 rounded-lg text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Panel Interaktif Pengujian IDOR</h2>
              <p className="text-[11px] text-slate-400">
                Ubah parameter <code className="text-rose-300 font-mono">studentId</code> pada request HTTP untuk membuktikan kebocoran data nilai mahasiswa lain.
              </p>
            </div>
          </div>

          <div className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            Sesi Login Aktif: <strong className="text-campus-400">{user?.id}</strong> ({user?.name})
          </div>
        </div>

        {/* Live URL Request Simulation Bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>ENDPOINT HTTP YANG DIPANGGIL:</span>
            <span className="text-emerald-400">Method: GET</span>
          </div>
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-slate-200">
              <span className="text-slate-500 mr-1">https://cyberia.ac.id/api/grades?studentId=</span>
              <input
                type="text"
                value={customInputId}
                onChange={(e) => setCustomInputId(e.target.value)}
                placeholder="STU001"
                className="bg-transparent text-rose-300 font-bold focus:outline-none w-28"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-lg transition flex items-center space-x-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Kirim Request IDOR</span>
            </button>
          </form>
        </div>

        {/* Quick IDOR Exploitation Shortcut Buttons */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Shortcut Uji Coba Cepat:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleIdorTrigger('STU001')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 ${
                targetStudentId === 'STU001'
                  ? 'bg-campus-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>STU001 (Budi Pratama)</span>
              {user?.id === 'STU001' && <span className="text-[10px] bg-campus-800 px-1 rounded">(Akun Anda)</span>}
            </button>

            <button
              type="button"
              onClick={() => handleIdorTrigger('STU002')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 ${
                targetStudentId === 'STU002'
                  ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>🚨 Intip STU002 (Siti Rahmawati)</span>
              {user?.id === 'STU002' ? <span className="text-[10px] bg-slate-700 px-1 rounded">(Akun Anda)</span> : <span className="text-[10px] text-rose-300 font-bold">[Eksploitasi IDOR]</span>}
            </button>

            <button
              type="button"
              onClick={() => handleIdorTrigger('STU003')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center space-x-1.5 ${
                targetStudentId === 'STU003'
                  ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <span>🚨 Intip STU003 (Ahmad Fauzi)</span>
              {user?.id === 'STU003' ? <span className="text-[10px] bg-slate-700 px-1 rounded">(Akun Anda)</span> : <span className="text-[10px] text-rose-300 font-bold">[Eksploitasi IDOR]</span>}
            </button>
          </div>
        </div>

        {/* Live IDOR Alert Badge */}
        {isIdorActive && (
          <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-red-200 text-xs flex items-start space-x-2.5 animate-pulse">
            <UserX className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-300">
                ⚠️ IDOR BERHASIL DIBUKTIKAN! (KONTROL AKSES LEMAH TERDETEKSI)
              </div>
              <p className="mt-0.5 text-slate-300">
                Anda login sebagai <strong className="text-white font-mono">{user?.id}</strong> ({user?.name}), namun berhasil melihat transkrip nilai privat milik <strong className="text-white font-mono">{targetStudentId}</strong> ({gradesResponse?.studentName}) tanpa izin otorisasi!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tampilan Tabel Nilai Mahasiswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Mahasiswa */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Data Mahasiswa Pemilik Transkrip:
            </div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center space-x-2">
              <span>{gradesResponse?.studentName || 'Memuat...'}</span>
              {isIdorActive && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-mono font-semibold">
                  Data Korban IDOR
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">
              ID: {gradesResponse?.studentId || targetStudentId} • NIM: {gradesResponse?.nim || '-'} • Program: {gradesResponse?.program || '-'}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-right">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">IPK Semester</div>
              <div className="text-xl font-bold text-campus-700 font-mono">
                {gradesResponse?.ipk ? gradesResponse.ipk.toFixed(2) : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Nilai */}
        <div className="p-6">
          {error ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/80">
                    <th className="py-3 px-4 font-semibold">Kode MK</th>
                    <th className="py-3 px-4 font-semibold">Nama Mata Kuliah</th>
                    <th className="py-3 px-4 font-semibold text-center">SKS</th>
                    <th className="py-3 px-4 font-semibold text-center">Nilai Angka</th>
                    <th className="py-3 px-4 font-semibold text-center">Nilai Huruf</th>
                    <th className="py-3 px-4 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradesResponse?.grades && gradesResponse.grades.length > 0 ? (
                    gradesResponse.grades.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-3.5 px-4 font-mono text-slate-500">{item.courseId}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">{item.courseName}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600">{item.sks}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800">{item.score}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-bold font-mono text-xs ${
                            item.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                            item.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {item.grade}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`text-xs font-semibold ${item.status === 'Lulus' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400">
                        {loading ? 'Memuat nilai dari serverless function...' : 'Tidak ada data nilai ditemukan untuk ID ini.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Kode Komentar Intentional Vulnerability */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <div className="font-mono text-[11px] text-rose-700">
            // INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
          </div>
          <span className="text-[11px]">Netlify Function: <code>/netlify/functions/grades.js</code></span>
        </div>
      </div>
    </div>
  );
}
