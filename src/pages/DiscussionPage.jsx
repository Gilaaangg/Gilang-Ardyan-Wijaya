import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ShieldAlert, AlertTriangle, Send, Trash2, Code2, PlusCircle, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

// =========================================================================
// INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
// Komponen render ini SECARA SENGAJA TIDAK MENYARING (UNSANITIZED) konten HTML.
// Konten postingan dimasukkan langsung ke DOM menggunakan innerHTML dan
// script tag / inline handler dieksekusi untuk mendemonstrasikan Stored XSS.
// =========================================================================
function UnsafeContentRenderer({ htmlContent }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
    // 1. Render HTML mentah
    containerRef.current.innerHTML = htmlContent;

    // 2. HTML5 innerHTML secara default menonaktifkan tag <script>,
    // Untuk tujuan laboratorium pendidikan, kita aktifkan eksekusi tag <script>
    // agar payload seperti <script>alert('XSS LAB')</script> juga dapat dieksekusi.
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }, [htmlContent]);

  return <div ref={containerRef} className="xss-rendered-output text-slate-800 text-xs md:text-sm" />;
}

export default function DiscussionPage({ onOpenDocs }) {
  const { user, showNotification } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Diskusi Umum');

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    setLoading(true);
    try {
      const res = await api.getDiscussions();
      setDiscussions(res.discussions || []);
    } catch (err) {
      showNotification('Gagal memuat diskusi: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
      // Konten dikirim tanpa sanitasi client-side
      await api.createDiscussion({
        title,
        content,
        authorId: user?.id || 'STU001',
        authorName: user?.name || 'Mahasiswa Fiktif',
        authorRole: user?.role || 'mahasiswa',
        category,
      });

      showNotification('Postingan berhasil dikirim (Stored XSS sink aktif)!', 'success');
      setTitle('');
      setContent('');
      setShowForm(false);
      loadDiscussions();
    } catch (err) {
      showNotification('Gagal mengirim postingan: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteDiscussion(id);
      showNotification('Postingan telah dihapus.', 'info');
      loadDiscussions();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Shortcut injeksi payload aman untuk lab
  const insertSafePayload = (payloadString, payloadTitle) => {
    setTitle(payloadTitle || 'Uji Coba Stored XSS Lab');
    setContent(payloadString);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900">Forum Diskusi Mahasiswa & Dosen</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Stored XSS Lab
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Media komunikasi akademik kampus Cyberia. Halaman ini sengaja tidak men-sanitasi input & render HTML.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-campus-600 text-white hover:bg-campus-500 text-xs font-semibold transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showForm ? 'Tutup Formulir' : 'Buat Diskusi Baru'}</span>
          </button>

          <button
            onClick={onOpenDocs}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-medium transition shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Panduan XSS</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PANEL KHUSUS PENDIDIKAN: DEMONSTRASI STORED XSS
          INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
      ========================================================================= */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-700 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-600 rounded-lg text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Panel Laboratorium Stored XSS</h2>
              <p className="text-[11px] text-slate-400">
                Pilih payload edukasi aman di bawah ini untuk menguji eksekusi JavaScript tanpa bahaya pencurian data.
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300">
            // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Preset Payload 1 */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Image OnError Alert</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Membuktikan eksekusi script dengan menampilkan alert sederhana <code>alert('XSS LAB')</code>.
              </p>
            </div>
            <button
              onClick={() =>
                insertSafePayload(
                  `<img src="invalid-img.png" onerror="alert('XSS LAB - Eksekusi JavaScript Berhasil!');" /> <p>Halo! Ini contoh postingan berisi payload XSS alert.</p>`,
                  'Demonstrasi XSS: Alert Box Sederhana'
                )
              }
              className="w-full py-1.5 px-2 bg-amber-600/80 hover:bg-amber-600 text-white rounded-lg text-xs font-medium transition text-center"
            >
              Gunakan Payload Ini &rarr;
            </button>
          </div>

          {/* Preset Payload 2 */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-xs font-bold text-rose-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2. Visual HTML Defacement</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Menyisipkan spanduk visual dengan styling HTML untuk membuktikan render HTML bebas.
              </p>
            </div>
            <button
              onClick={() =>
                insertSafePayload(
                  `<div style="background:#fee2e2; border:2px dashed #dc2626; color:#991b1b; padding:12px; border-radius:10px; font-weight:bold; text-align:center;">
  ⚠️ [XSS LAB] Kode HTML Berhasil Diinjeksi ke Halaman Forum!
</div>
<p style="margin-top:8px;">Konten ini membuktikan bahwa renderer forum mengeksekusi tag HTML mentah.</p>`,
                  'Demonstrasi XSS: Injeksi Banner Visual'
                )
              }
              className="w-full py-1.5 px-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-medium transition text-center"
            >
              Gunakan Payload Ini &rarr;
            </button>
          </div>

          {/* Preset Payload 3 */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-xs font-bold text-campus-300 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3. Script Tag Execution</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Membuktikan eksekusi inline script tag langsung di dalam konteks dokumen.
              </p>
            </div>
            <button
              onClick={() =>
                insertSafePayload(
                  `<p>Teks pengantar diskusi...</p>
<script>
  console.log('[XSS LAB] Inline script executed on user browser!');
  alert('XSS LAB: Script tag executed!');
</script>`,
                  'Demonstrasi XSS: Inline Script Tag'
                )
              }
              className="w-full py-1.5 px-2 bg-campus-600/80 hover:bg-campus-600 text-white rounded-lg text-xs font-medium transition text-center"
            >
              Gunakan Payload Ini &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Formulir Tambah Postingan Baru */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-campus-600" />
              <span>Buat Topik / Postingan Forum Baru</span>
            </h2>
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Input Unsanitized (Stored Sink)
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Judul Postingan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-campus-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-campus-500 focus:outline-none bg-white"
                >
                  <option value="Diskusi Umum">Diskusi Umum</option>
                  <option value="Tanya Jawab MK">Tanya Jawab MK</option>
                  <option value="Keamanan Web">Keamanan Web</option>
                  <option value="Lab XSS Demo">Lab XSS Demo</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-700">
                  Isi Postingan (Mendukung Raw HTML & Script Payload untuk Lab)
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Sengaja tidak difilter untuk uji XSS
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                required
                placeholder="Tuliskan isi postingan atau masukkan payload lab..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-mono focus:ring-2 focus:ring-campus-500 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-campus-600 hover:bg-campus-700 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publikasikan Postingan</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Postingan Forum */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Daftar Diskusi Aktif ({discussions.length})
          </h2>
          <button
            onClick={loadDiscussions}
            disabled={loading}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang Diskusi</span>
          </button>
        </div>

        {discussions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
            Belum ada postingan diskusi. Silakan buat postingan baru!
          </div>
        ) : (
          discussions.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition overflow-hidden"
            >
              {/* Header Postingan */}
              <div className="p-4 sm:px-6 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-campus-100 text-campus-700 font-bold flex items-center justify-center text-xs">
                    {post.authorName ? post.authorName.charAt(0) : 'U'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                      <span>{post.authorName}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        post.authorRole === 'dosen' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {post.authorRole}
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {post.category || 'Diskusi'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      ID: {post.id} • {new Date(post.createdAt).toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Postingan Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Judul & Isi Konten (UNSAFE STORED XSS SINK) */}
              <div className="p-4 sm:p-6 space-y-3">
                <h3 className="text-base font-bold text-slate-900">{post.title}</h3>

                {/* =========================================================================
                    INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
                    Konten ini dirender secara tidak aman ke DOM:
                ========================================================================= */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                  <UnsafeContentRenderer htmlContent={post.content} />
                </div>
              </div>

              {/* Footer Postingan Info */}
              <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-amber-700">
                  // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
                </span>
                <span>Unsanitized Output Rendering Sink</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
