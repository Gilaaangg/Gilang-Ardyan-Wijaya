// Synthetic Database for Fictional Campus Security Lab
// NOTE: All accounts, names, IDs, grades, and posts are 100% fictional.

export const initialData = {
  users: [
    // Mahasiswa Fiktif
    {
      id: 'STU001',
      username: 'student001',
      password: 'password123',
      name: 'Budi Pratama (Fiktif)',
      nim: '202401001',
      email: 'budi.fiktif@cyberia.ac.id',
      role: 'mahasiswa',
      program: 'S1 Teknik Informatika',
      semester: 5,
      ipk: 3.65,
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'STU002',
      username: 'student002',
      password: 'password123',
      name: 'Siti Rahmawati (Fiktif)',
      nim: '202401002',
      email: 'siti.fiktif@cyberia.ac.id',
      role: 'mahasiswa',
      program: 'S1 Sistem Informasi',
      semester: 5,
      ipk: 3.92,
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'STU003',
      username: 'student003',
      password: 'password123',
      name: 'Ahmad Fauzi (Fiktif)',
      nim: '202401003',
      email: 'ahmad.fiktif@cyberia.ac.id',
      role: 'mahasiswa',
      program: 'S1 Keamanan Siber',
      semester: 5,
      ipk: 3.10,
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    },
    // Dosen Fiktif
    {
      id: 'LEC001',
      username: 'lecturer001',
      password: 'password123',
      name: 'Dr. Hendra Wijaya, M.Kom (Fiktif)',
      nip: '198501102010011001',
      email: 'hendra.dosen@cyberia.ac.id',
      role: 'dosen',
      department: 'Teknik Informatika',
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 'LEC002',
      username: 'lecturer002',
      password: 'password123',
      name: 'Prof. Maya Kusuma, Ph.D (Fiktif)',
      nip: '198802202012022002',
      email: 'maya.dosen@cyberia.ac.id',
      role: 'dosen',
      department: 'Keamanan Siber',
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
    // Admin Fiktif
    {
      id: 'ADM001',
      username: 'admin001',
      password: 'password123',
      name: 'Administrator Lab Cyberia (Fiktif)',
      nip: 'ADM-2024-999',
      email: 'admin.lab@cyberia.ac.id',
      role: 'admin',
      department: 'Pusat Operasi Keamanan & TI',
      status: 'Aktif',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    },
  ],

  courses: [
    {
      id: 'CS301',
      code: 'SEC-301',
      name: 'Keamanan Aplikasi Web & Penetrasi',
      sks: 3,
      lecturerId: 'LEC001',
      lecturerName: 'Dr. Hendra Wijaya, M.Kom',
      semester: 5,
      room: 'Lab Cyber 01',
    },
    {
      id: 'CS302',
      code: 'SEC-302',
      name: 'Kriptografi & Pertahanan Jaringan',
      sks: 3,
      lecturerId: 'LEC002',
      lecturerName: 'Prof. Maya Kusuma, Ph.D',
      semester: 5,
      room: 'Lab Jaringan 02',
    },
    {
      id: 'CS303',
      code: 'IF-303',
      name: 'Pemrograman Web Lanjut & API',
      sks: 3,
      lecturerId: 'LEC001',
      lecturerName: 'Dr. Hendra Wijaya, M.Kom',
      semester: 5,
      room: 'Ruang Teori 304',
    },
    {
      id: 'CS304',
      code: 'IF-304',
      name: 'Rekayasa Perangkat Lunak Aman',
      sks: 3,
      lecturerId: 'LEC002',
      lecturerName: 'Prof. Maya Kusuma, Ph.D',
      semester: 5,
      room: 'Lab Rekayasa 03',
    },
  ],

  grades: [
    // STU001 - Budi Pratama
    { id: 'GRD-101', studentId: 'STU001', courseId: 'CS301', courseName: 'Keamanan Aplikasi Web & Penetrasi', sks: 3, score: 88, grade: 'A', status: 'Lulus' },
    { id: 'GRD-102', studentId: 'STU001', courseId: 'CS302', courseName: 'Kriptografi & Pertahanan Jaringan', sks: 3, score: 78, grade: 'B+', status: 'Lulus' },
    { id: 'GRD-103', studentId: 'STU001', courseId: 'CS303', courseName: 'Pemrograman Web Lanjut & API', sks: 3, score: 92, grade: 'A', status: 'Lulus' },
    { id: 'GRD-104', studentId: 'STU001', courseId: 'CS304', courseName: 'Rekayasa Perangkat Lunak Aman', sks: 3, score: 85, grade: 'A-', status: 'Lulus' },

    // STU002 - Siti Rahmawati (Nilai sangat tinggi / Rahasia IPK 3.92)
    { id: 'GRD-201', studentId: 'STU002', courseId: 'CS301', courseName: 'Keamanan Aplikasi Web & Penetrasi', sks: 3, score: 96, grade: 'A', status: 'Lulus' },
    { id: 'GRD-202', studentId: 'STU002', courseId: 'CS302', courseName: 'Kriptografi & Pertahanan Jaringan', sks: 3, score: 93, grade: 'A', status: 'Lulus' },
    { id: 'GRD-203', studentId: 'STU002', courseId: 'CS303', courseName: 'Pemrograman Web Lanjut & API', sks: 3, score: 90, grade: 'A', status: 'Lulus' },
    { id: 'GRD-204', studentId: 'STU002', courseId: 'CS304', courseName: 'Rekayasa Perangkat Lunak Aman', sks: 3, score: 94, grade: 'A', status: 'Lulus' },

    // STU003 - Ahmad Fauzi (Nilai rendah / Rahasia pribadi)
    { id: 'GRD-301', studentId: 'STU003', courseId: 'CS301', courseName: 'Keamanan Aplikasi Web & Penetrasi', sks: 3, score: 62, grade: 'C', status: 'Remedial' },
    { id: 'GRD-302', studentId: 'STU003', courseId: 'CS302', courseName: 'Kriptografi & Pertahanan Jaringan', sks: 3, score: 71, grade: 'B', status: 'Lulus' },
    { id: 'GRD-303', studentId: 'STU003', courseId: 'CS303', courseName: 'Pemrograman Web Lanjut & API', sks: 3, score: 58, grade: 'C-', status: 'Remedial' },
    { id: 'GRD-304', studentId: 'STU003', courseId: 'CS304', courseName: 'Rekayasa Perangkat Lunak Aman', sks: 3, score: 74, grade: 'B', status: 'Lulus' },
  ],

  assignments: [
    {
      id: 'ASN-01',
      title: 'Tugas 1: Analisis Kerentanan OWASP Top 10',
      courseId: 'CS301',
      courseName: 'Keamanan Aplikasi Web & Penetrasi',
      lecturerName: 'Dr. Hendra Wijaya, M.Kom',
      deadline: '2026-10-25T23:59:00Z',
      description: 'Lakukan analisis terhadap top 3 kerentanan web (XSS, Injection, dan Broken Access Control) dan simulasikan di lingkungan lab aman.',
      status: 'Open',
    },
    {
      id: 'ASN-02',
      title: 'Tugas 2: Implementasi Enkripsi Simetris AES & Asimetris RSA',
      courseId: 'CS302',
      courseName: 'Kriptografi & Pertahanan Jaringan',
      lecturerName: 'Prof. Maya Kusuma, Ph.D',
      deadline: '2026-10-30T23:59:00Z',
      description: 'Buatlah skrip perbandingan performa enkripsi data antara AES-256 dan RSA-2048 pada dataset sintetis.',
      status: 'Open',
    },
    {
      id: 'ASN-03',
      title: 'Tugas 3: Desain RESTful API dengan Skema Validasi',
      courseId: 'CS303',
      courseName: 'Pemrograman Web Lanjut & API',
      lecturerName: 'Dr. Hendra Wijaya, M.Kom',
      deadline: '2026-11-05T23:59:00Z',
      description: 'Kembangkan API CRUD dengan middleware autentikasi dan validasi schema request yang ketat.',
      status: 'Open',
    },
  ],

  submissions: [
    {
      id: 'SUB-01',
      assignmentId: 'ASN-01',
      studentId: 'STU001',
      studentName: 'Budi Pratama (Fiktif)',
      fileName: 'laporan_owasp_budi_fiktif.pdf',
      notes: 'Laporan analisis sudah dilengkapi bukti simulasi lab.',
      submittedAt: '2026-10-12T14:30:00Z',
      grade: 88,
      feedback: 'Analisis baik, perlu pendalaman pada konteks sanitasi output.',
    },
    {
      id: 'SUB-02',
      assignmentId: 'ASN-01',
      studentId: 'STU002',
      studentName: 'Siti Rahmawati (Fiktif)',
      fileName: 'analisis_lengkap_siti_fiktif.pdf',
      notes: 'Laporan lengkap dengan rekomendasi mitigasi kode.',
      submittedAt: '2026-10-11T09:15:00Z',
      grade: 96,
      feedback: 'Sangat komprehensif dan rapi!',
    },
  ],

  discussions: [
    {
      id: 'DSC-01',
      title: 'Pengumuman Kuliah: Pentingnya Pertahanan Berlapis (Defense-in-Depth)',
      content: 'Selamat datang para mahasiswa di modul keamanan aplikasi web. Ingatlah bahwa keamanan harus diimplementasikan pada lapisan frontend, validasi backend, serta kontrol akses di database.',
      authorId: 'LEC001',
      authorName: 'Dr. Hendra Wijaya, M.Kom (Fiktif)',
      authorRole: 'dosen',
      createdAt: '2026-10-10T08:00:00Z',
      category: 'Akademik',
    },
    {
      id: 'DSC-02',
      title: 'Tanya Jawab: Apakah sanitasi frontend saja cukup?',
      content: 'Halo teman-teman, apakah melakukan sanitasi di React form saja sudah menjamin aplikasi aman dari penyerang yang membypass browser menggunakan cURL/Postman?',
      authorId: 'STU002',
      authorName: 'Siti Rahmawati (Fiktif)',
      authorRole: 'mahasiswa',
      createdAt: '2026-10-11T10:20:00Z',
      category: 'Diskusi',
    },
    {
      id: 'DSC-03',
      title: 'Contoh Teks Berformat HTML di Forum',
      content: '<p class="text-slate-700">Halo rekan-rekan! Selamat belajar di <strong>Laboratorium Keamanan Aplikasi Web</strong>. Silakan coba fitur posting diskusi baru di bawah ini.</p>',
      authorId: 'STU001',
      authorName: 'Budi Pratama (Fiktif)',
      authorRole: 'mahasiswa',
      createdAt: '2026-10-12T11:00:00Z',
      category: 'Lab Demo',
    },
  ],
};

// Global in-memory storage for serverless runtime
export let db = JSON.parse(JSON.stringify(initialData));

export function resetDb() {
  db = JSON.parse(JSON.stringify(initialData));
  return db;
}
