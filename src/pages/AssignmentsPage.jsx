import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { FileText, Upload, CheckCircle2, Clock, AlertCircle, Send, Check } from 'lucide-react';

export default function AssignmentsPage() {
  const { user, showNotification } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal / form submission state
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.getAssignments(user?.id);
      setAssignments(res.assignments || []);
      setSubmissions(res.submissions || []);
    } catch (err) {
      showNotification('Gagal memuat tugas: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmitModal = (asn) => {
    setActiveAssignment(asn);
    const existing = submissions.find((s) => s.assignmentId === asn.id && s.studentId === user?.id);
    if (existing) {
      setFileName(existing.fileName);
      setNotes(existing.notes || '');
    } else {
      setFileName(`${asn.id.toLowerCase()}_${user?.username || 'student'}_tugas.pdf`);
      setNotes('');
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!activeAssignment || !user) return;

    try {
      await api.submitAssignment({
        assignmentId: activeAssignment.id,
        studentId: user.id,
        studentName: user.name,
        fileName: fileName || 'tugas_lab.pdf',
        notes: notes,
      });

      showNotification('Tugas berhasil diunggah dan disimpan!', 'success');
      setActiveAssignment(null);
      loadAssignments();
    } catch (err) {
      showNotification('Gagal mengunggah tugas: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tugas Kuliah & Pengumpulan Tugas</h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar seluruh tugas akademik, batas waktu pengumpulan, dan status penilaian dosen.
        </p>
      </div>

      {/* Grid Tugas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((asn) => {
          const submission = submissions.find(
            (s) => s.assignmentId === asn.id && s.studentId === user?.id
          );
          const isSubmitted = !!submission;

          return (
            <div
              key={asn.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-campus-50 text-campus-700 border border-campus-100">
                    {asn.courseName}
                  </span>
                  {isSubmitted ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" />
                      <span>Terkumpul</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3" />
                      <span>Belum Kirim</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{asn.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {asn.description}
                </p>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                  <div>Dosen Pengampu: <span className="font-medium text-slate-700">{asn.lecturerName}</span></div>
                  <div>Tenggat Waktu: <span className="font-mono text-slate-700">{new Date(asn.deadline).toLocaleString('id-ID')}</span></div>
                </div>

                {/* Info Penilaian jika ada */}
                {submission && submission.grade !== null && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between items-center text-emerald-800 font-bold">
                      <span>Nilai Tugas:</span>
                      <span className="font-mono text-sm">{submission.grade} / 100</span>
                    </div>
                    {submission.feedback && (
                      <p className="text-[11px] text-emerald-700">Catatan: {submission.feedback}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {submission ? submission.fileName : 'Belum ada file'}
                </div>
                <button
                  onClick={() => handleOpenSubmitModal(asn)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-2xs ${
                    isSubmitted
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-campus-600 hover:bg-campus-700 text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSubmitted ? 'Perbarui Tugas' : 'Unggah Tugas'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Pengumpulan Tugas */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <span className="text-[11px] font-mono text-campus-600 font-semibold">{activeAssignment.courseName}</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeAssignment.title}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Formulir simulasi pengunggahan laporan / file tugas mahasiswa.
              </p>
            </div>

            <form onSubmit={handleSubmitAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama File Dokumen Sintetis (PDF / ZIP)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    required
                    placeholder="nama_file_tugas.pdf"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-campus-500 focus:outline-none"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Simulasi upload berkas lab. Berkas akan tercatat atas nama Anda di portal.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan / Keterangan untuk Dosen
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Tambahkan catatan pengerjaan tugas atau tautan repository..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-campus-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAssignment(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-campus-600 hover:bg-campus-700 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Tugas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
