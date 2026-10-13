import React, { useState } from 'react';
import { X, ShieldAlert, Code2, AlertTriangle, CheckCircle2, Copy, Check } from 'lucide-react';

export default function SecurityLabModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('xss');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const safeXssPayloads = [
    {
      title: '1. Safe Alert Box (Standar Pembuktian XSS)',
      payload: `<img src="invalid-image" onerror="alert('XSS LAB - Eksekusi JavaScript Berhasil!');" />`,
      explanation: 'Memanfaatkan event handler onerror pada tag img saat gambar gagal dimuat. Sesuai instruksi: hanya menampilkan alert aman tanpa mencuri kredensial.',
    },
    {
      title: '2. Safe Visual Banner Injection',
      payload: `<div style="padding:10px; background:#ef4444; color:white; border-radius:8px; font-weight:bold; text-align:center;">⚠️ [XSS LAB] Script HTML Terinjeksi di Komentar!</div>`,
      explanation: 'Menyisipkan elemen HTML visual berpenampilan mencolok untuk membuktikan render HTML yang tidak disanitasi.',
    },
    {
      title: '3. Safe SVG Event Handler',
      payload: `<svg onload="alert('XSS LAB: SVG payload executed!')"></svg>`,
      explanation: 'Memanfaatkan event onload pada elemen SVG.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">Laboratorium Keamanan — Panduan Kerentanan</h2>
              <p className="text-xs text-slate-400">Portal Kampus Fiktif ITSC Cyberia (100% Data Sintetis)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2">
          <button
            onClick={() => setActiveTab('xss')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'xss'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>1. Stored XSS Lab</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono">Forum Diskusi</span>
          </button>

          <button
            onClick={() => setActiveTab('idor')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'idor'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>2. IDOR Lab</span>
            <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full font-mono">Nilai Mahasiswa</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'accounts'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Daftar Akun Lab</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs md:text-sm">
          {activeTab === 'xss' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Kerentanan: Stored Cross-Site Scripting (Stored XSS)</span>
                </div>
                <p className="text-slate-700">
                  Kerentanan ini sengaja ditanamkan pada fitur <strong>Forum Diskusi Mahasiswa</strong>.
                  Data postingan yang dikirim pengguna disimpan langsung ke database/state tanpa proses sanitasi HTML.
                  Saat pengguna lain membuka halaman diskusi, isi komentar dirender secara mentah menggunakan mekanisme yang mengeksekusi markup HTML.
                </p>
                <div className="text-[11px] font-mono text-amber-900 bg-amber-100/60 p-2 rounded">
                  Label Kode: <code>// INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB</code>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Langkah Pengujian Stored XSS:</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>Login sebagai <strong>student001</strong> atau gunakan switcher di navbar.</li>
                  <li>Buka menu <strong>Forum Diskusi</strong>.</li>
                  <li>Klik tombol <strong>Buat Diskusi Baru</strong> atau pilih salah satu <strong>Safe Demo Payload</strong>.</li>
                  <li>Kirim postingan dengan payload di bawah ini.</li>
                  <li>Beralih akun ke <strong>student002</strong> atau muat ulang halaman: payload akan langsung tereksekusi!</li>
                </ol>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Contoh Payload Pembuktian Aman (Non-Destruktif):</h3>
                <div className="space-y-3">
                  {safeXssPayloads.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                        <span>{item.title}</span>
                        <button
                          onClick={() => copyToClipboard(item.payload, idx)}
                          className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-campus-300 text-xs transition"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="font-mono text-xs bg-slate-950 p-2 rounded text-emerald-300 overflow-x-auto">
                        {item.payload}
                      </pre>
                      <p className="text-[11px] text-slate-400">{item.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rekomendasi Perbaikan (Mitigasi):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li><strong>Sanitasi Input di Backend:</strong> Gunakan library seperti <code>DOMPurify</code> atau sanitasi strip tags sebelum data disimpan.</li>
                  <li><strong>Konteks Rendering Aman di Frontend:</strong> Hindari <code>dangerouslySetInnerHTML</code>. Render sebagai plain text via <code>&lbrace;post.content&rbrace;</code> di React agar karakter spesial otomatis di-encode (misal <code>&lt;</code> menjadi <code>&amp;lt;</code>).</li>
                  <li><strong>Content Security Policy (CSP):</strong> Terapkan header CSP ketat (misal <code>Content-Security-Policy: default-src 'self'</code>) untuk membatasi inline script.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'idor' && (
            <div className="space-y-4">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-rose-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Kerentanan: Insecure Direct Object References (IDOR)</span>
                </div>
                <p className="text-slate-700">
                  Kerentanan ini berada pada fitur <strong>Lihat Nilai Akademik</strong>.
                  Endpoint API <code>GET /api/grades?studentId=STU001</code> secara sengaja tidak memverifikasi apakah akun yang sedang login memiliki hak akses atas ID yang diminta.
                  Seorang mahasiswa dapat mengganti parameter <code>studentId</code> menjadi milik mahasiswa lain dan melihat nilai rahasia mereka.
                </p>
                <div className="text-[11px] font-mono text-rose-900 bg-rose-100/60 p-2 rounded">
                  Label Kode: <code>// INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB</code>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Langkah Pengujian IDOR:</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>Login sebagai <strong>student001</strong> (Budi Pratama - ID: STU001).</li>
                  <li>Buka menu <strong>Nilai Akademik</strong>. Nilai default STU001 akan tampil.</li>
                  <li>Pada panel pengujian IDOR di atas tabel nilai, ubah parameter <code>studentId</code> menjadi <strong>STU002</strong> (Siti Rahmawati) atau <strong>STU003</strong> (Ahmad Fauzi).</li>
                  <li>Klik tombol <strong>"Kirim Request IDOR (GET /api/grades?studentId=STU002)"</strong>.</li>
                  <li>Data nilai dan IPK mahasiswa lain berhasil dibaca meskipun akun aktif adalah STU001!</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1">
                <div className="text-xs font-semibold text-slate-300">Contoh Request HTTP Rentan:</div>
                <pre className="font-mono text-xs bg-slate-950 p-2.5 rounded text-rose-300 overflow-x-auto">
{`GET /api/grades?studentId=STU002 HTTP/1.1
Host: localhost:5173
Authorization: Bearer lab-token-STU001-xxxx`}
                </pre>
                <p className="text-[11px] text-slate-400">Backend mengembalikan data milik STU002 tanpa memeriksa token STU001.</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Rekomendasi Perbaikan (Mitigasi):</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li><strong>Validasi Sesi / Token di Backend:</strong> Jangan mengandalkan parameter ID dari client. Ekstrak identitas pengguna langsung dari token JWT atau session di server.</li>
                  <li><strong>Pemeriksaan Otorisasi (Access Control Check):</strong>
                    <pre className="mt-1 font-mono text-[11px] bg-emerald-950 text-emerald-300 p-2 rounded">
{`// Contoh Mitigasi:
if (sessionUser.role !== 'admin' && sessionUser.role !== 'dosen') {
  if (sessionUser.id !== requestedStudentId) {
    return res.status(403).json({ error: 'Akses ditolak: Dilarang melihat nilai pengguna lain.' });
  }
}`}
                    </pre>
                  </li>
                  <li><strong>Gunakan Indirect Object References:</strong> Jangan ekspos ID database langsung secara berurutan jika tidak diperlukan.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-bold text-blue-900">Daftar Akun Lab Sintetis</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Seluruh akun berikut disiapkan untuk mempermudah tugas pengujian keamanan:
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-2 border border-slate-200">Role</th>
                      <th className="p-2 border border-slate-200">Username</th>
                      <th className="p-2 border border-slate-200">Password</th>
                      <th className="p-2 border border-slate-200">Nama Sintetis</th>
                      <th className="p-2 border border-slate-200">ID / NIM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 border border-slate-200 font-semibold text-blue-600">Mahasiswa</td>
                      <td className="p-2 border border-slate-200 font-mono">student001</td>
                      <td className="p-2 border border-slate-200 font-mono">password123</td>
                      <td className="p-2 border border-slate-200">Budi Pratama (Fiktif)</td>
                      <td className="p-2 border border-slate-200 font-mono">STU001 / 202401001</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200 font-semibold text-blue-600">Mahasiswa</td>
                      <td className="p-2 border border-slate-200 font-mono">student002</td>
                      <td className="p-2 border border-slate-200 font-mono">password123</td>
                      <td className="p-2 border border-slate-200">Siti Rahmawati (Fiktif)</td>
                      <td className="p-2 border border-slate-200 font-mono">STU002 / 202401002</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200 font-semibold text-blue-600">Mahasiswa</td>
                      <td className="p-2 border border-slate-200 font-mono">student003</td>
                      <td className="p-2 border border-slate-200 font-mono">password123</td>
                      <td className="p-2 border border-slate-200">Ahmad Fauzi (Fiktif)</td>
                      <td className="p-2 border border-slate-200 font-mono">STU003 / 202401003</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200 font-semibold text-emerald-600">Dosen</td>
                      <td className="p-2 border border-slate-200 font-mono">lecturer001</td>
                      <td className="p-2 border border-slate-200 font-mono">password123</td>
                      <td className="p-2 border border-slate-200">Dr. Hendra Wijaya, M.Kom (Fiktif)</td>
                      <td className="p-2 border border-slate-200 font-mono">LEC001</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200 font-semibold text-emerald-600">Dosen</td>
                      <td className="p-2 border border-slate-200 font-mono">lecturer002</td>
                      <td className="p-2 border border-slate-200 font-mono">password123</td>
                      <td className="p-2 border border-slate-200">Prof. Maya Kusuma, Ph.D (Fiktif)</td>
                      <td className="p-2 border border-slate-200 font-mono">LEC002</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-200 font-semibold text-purple-600">Admin</td>
                      <td className="p-2 border border-slate-200 font-mono">admin001</td>
                      <td className="p-2 border border-slate-200 font-mono">password123</td>
                      <td className="p-2 border border-slate-200">Admin Lab Cyberia (Fiktif)</td>
                      <td className="p-2 border border-slate-200 font-mono">ADM001</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs rounded-lg transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
