import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatsCard from '../components/StatsCard';
import { Award, BookOpen, Users, CheckSquare, Edit3, Send, CheckCircle2 } from 'lucide-react';

export default function LecturerDashboard({ onOpenDocs }) {
  const { user, showNotification } = useAuth();
  const [grades, setGrades] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Grading form state
  const [selectedStudent, setSelectedStudent] = useState('STU001');
  const [selectedCourse, setSelectedCourse] = useState('CS301');
  const [scoreInput, setScoreInput] = useState('85');
  const [savingGrade, setSavingGrade] = useState(false);

  // Review submission state
  const [gradingSubId, setGradingSubId] = useState(null);
  const [subGradeInput, setSubGradeInput] = useState('90');
  const [subFeedbackInput, setSubFeedbackInput] = useState('Pengerjaan sangat baik.');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [grdRes, asgnRes] = await Promise.all([
        api.getGrades(null, true),
        api.getAssignments(),
      ]);
      setGrades(grdRes.grades || []);
      setSubmissions(asgnRes.submissions || []);
    } catch (err) {
      showNotification('Gagal memuat data dosen: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    setSavingGrade(true);
    try {
      await api.updateGrade(selectedStudent, selectedCourse, scoreInput);
      showNotification('Nilai mahasiswa berhasil diperbarui di sistem!', 'success');
      loadAllData();
    } catch (err) {
      showNotification('Gagal menyimpan nilai: ' + err.message, 'error');
    } finally {
      setSavingGrade(false);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!gradingSubId) return;

    try {
      await api.gradeAssignment({
        submissionId: gradingSubId,
        grade: subGradeInput,
        feedback: subFeedbackInput,
      });
      showNotification('Penilaian tugas mahasiswa berhasil disimpan!', 'success');
      setGradingSubId(null);
      loadAllData();
    } catch (err) {
      showNotification('Gagal menilai tugas: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium text-emerald-100 backdrop-blur-xs">
              <span>Portal Dosen Pengampu • Departemen Informatika</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
              Dashboard Dosen: {user?.name}
            </h1>
            <p className="text-xs text-emerald-100 mt-0.5">
              NIP: <span className="font-mono">{user?.nip || '198501102010011001'}</span> • Kelola penilaian dan evaluasi tugas mahasiswa sintetis.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Mata Kuliah Diampu"
          value="2 MK"
          subtitle="CS301 & CS303"
          icon={BookOpen}
          color="emerald"
        />
        <StatsCard
          title="Mahasiswa Terbimbing"
          value="3 Mahasiswa"
          subtitle="STU001, STU002, STU003"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Tugas Terkumpul"
          value={`${submissions.length} Pengumpulan`}
          subtitle="Menunggu / selesai dinilai"
          icon={CheckSquare}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input Nilai Mahasiswa */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>Input & Perbarui Nilai Mahasiswa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simpan nilai angka mahasiswa untuk kalkulasi transkrip.
            </p>
          </div>

          <form onSubmit={handleSaveGrade} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Pilih Mahasiswa Sintetis
              </label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-mono"
              >
                <option value="STU001">STU001 - Budi Pratama (Fiktif)</option>
                <option value="STU002">STU002 - Siti Rahmawati (Fiktif)</option>
                <option value="STU003">STU003 - Ahmad Fauzi (Fiktif)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mata Kuliah
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
              >
                <option value="CS301">CS301: Keamanan Aplikasi Web & Penetrasi</option>
                <option value="CS302">CS302: Kriptografi & Pertahanan Jaringan</option>
                <option value="CS303">CS303: Pemrograman Web Lanjut & API</option>
                <option value="CS304">CS304: Rekayasa Perangkat Lunak Aman</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nilai Angka (0 - 100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={savingGrade}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{savingGrade ? 'Menyimpan...' : 'Simpan Nilai'}</span>
            </button>
          </form>
        </div>

        {/* Tabel Rekap Seluruh Nilai Mahasiswa */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Rekap Nilai Seluruh Mahasiswa</h2>
              <p className="text-xs text-slate-500">
                Data master nilai yang dapat diakses oleh dosen dan admin.
              </p>
            </div>
            <button
              onClick={loadAllData}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-50">
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Mahasiswa</th>
                  <th className="py-2.5 px-3 font-semibold">Mata Kuliah</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Score</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Grade</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {grades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{g.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{g.studentId}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{g.courseName}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">{g.score}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        g.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' :
                        g.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {g.grade}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-700 font-medium">
                      {g.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Evaluasi Pengumpulan Tugas Mahasiswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Evaluasi Berkas Tugas Masuk ({submissions.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{sub.studentName}</span>
                  <span className="text-[11px] font-mono text-slate-500">{sub.studentId}</span>
                </div>
                <div className="text-xs text-campus-700 font-medium mt-1">
                  File: {sub.fileName}
                </div>
                {sub.notes && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{sub.notes}"</p>
                )}
                <div className="text-[11px] text-slate-400 mt-2">
                  Dikumpulkan: {new Date(sub.submittedAt).toLocaleString('id-ID')}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  {sub.grade !== null ? (
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      Nilai: {sub.grade}/100
                    </span>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">Belum dinilai</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setGradingSubId(sub.id);
                    setSubGradeInput(sub.grade ? String(sub.grade) : '90');
                    setSubFeedbackInput(sub.feedback || 'Analisis tugas sangat komprehensif.');
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Beri Nilai & Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Beri Nilai Tugas */}
      {gradingSubId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Form Penilaian Tugas Mahasiswa</h3>
            <form onSubmit={handleGradeSubmission} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nilai Angka (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subGradeInput}
                  onChange={(e) => setSubGradeInput(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Feedback Dosen
                </label>
                <textarea
                  value={subFeedbackInput}
                  onChange={(e) => setSubFeedbackInput(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubId(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  Simpan Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
