// API Service communicating with Netlify Functions (/api/*)
// In local development, vite.config.js routes /api/* directly to netlify/functions/*.js.
// In Netlify production, netlify.toml routes /api/* to /.netlify/functions/*.

export const api = {
  // Autentikasi
  async login(username, password) {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal.');
    return data;
  },

  async resetDatabase() {
    const res = await fetch('/api/auth/reset', { method: 'POST' });
    const data = await res.json();
    return data;
  },

  // =========================================================================
  // INTENTIONAL VULNERABILITY - IDOR FOR SECURITY LAB
  // Pemanggilan API nilai mengirim studentId melalui query parameter.
  // Frontend/Backend tidak memverifikasi apakah studentId milik user yang sedang aktif.
  // =========================================================================
  async getGrades(studentId, all = false) {
    const query = all ? '?all=true' : `?studentId=${encodeURIComponent(studentId)}`;
    const res = await fetch(`/api/grades${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data nilai.');
    return data;
  },

  async updateGrade(studentId, courseId, score) {
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, courseId, score }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan nilai.');
    return data;
  },

  // =========================================================================
  // INTENTIONAL VULNERABILITY - STORED XSS FOR SECURITY LAB
  // API diskusi menerima dan mengembalikan raw content tanpa sanitasi HTML.
  // =========================================================================
  async getDiscussions() {
    const res = await fetch('/api/discussions');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil forum diskusi.');
    return data;
  },

  async createDiscussion({ title, content, authorId, authorName, authorRole, category }) {
    const res = await fetch('/api/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, authorId, authorName, authorRole, category }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengirim postingan.');
    return data;
  },

  async deleteDiscussion(id) {
    const res = await fetch(`/api/discussions?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menghapus postingan.');
    return data;
  },

  // Tugas & Pengumpulan
  async getAssignments(studentId = null) {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';
    const res = await fetch(`/api/assignments${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data tugas.');
    return data;
  },

  async submitAssignment({ assignmentId, studentId, studentName, fileName, notes }) {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit',
        assignmentId,
        studentId,
        studentName,
        fileName,
        notes,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengunggah tugas.');
    return data;
  },

  async gradeAssignment({ submissionId, grade, feedback }) {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'grade',
        submissionId,
        grade,
        feedback,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyimpan penilaian tugas.');
    return data;
  },

  // Pengguna (Admin)
  async getUsers() {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengambil data pengguna.');
    return data;
  },

  async addUser(userData) {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menambah pengguna.');
    return data;
  },

  async toggleUserStatus(userId, status) {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal mengubah status pengguna.');
    return data;
  },
};
