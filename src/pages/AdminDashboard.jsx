import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatsCard from '../components/StatsCard';
import { Users, UserPlus, Shield, ShieldAlert, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ onOpenDocs }) {
  const { user, showNotification } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form tambah user baru
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('password123');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('mahasiswa');
  const [newNim, setNewNim] = useState('');
  const [newProgram, setNewProgram] = useState('S1 Teknik Informatika');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.users || []);
    } catch (err) {
      showNotification('Gagal memuat pengguna: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.addUser({
        username: newUsername,
        password: newPassword,
        name: newName,
        role: newRole,
        nim: newNim,
        program: newProgram,
      });
      showNotification('Pengguna sintetis baru berhasil ditambahkan!', 'success');
      setShowAddModal(false);
      setNewUsername('');
      setNewName('');
      setNewNim('');
      loadUsers();
    } catch (err) {
      showNotification('Gagal menambah pengguna: ' + err.message, 'error');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Aktif' ? 'Non-Aktif' : 'Aktif';
      await api.toggleUserStatus(userId, nextStatus);
      showNotification(`Status pengguna diubah menjadi ${nextStatus}.`, 'info');
      loadUsers();
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const studentsCount = users.filter((u) => u.role === 'mahasiswa').length;
  const lecturersCount = users.filter((u) => u.role === 'dosen').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium text-purple-100 backdrop-blur-xs">
              <span>Konsol Administrator Lab • ITSC Cyberia</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">
              Manajemen Pengguna & Pengaturan Lab
            </h1>
            <p className="text-xs text-purple-200 mt-0.5">
              Kelola seluruh akun sintetis untuk kebutuhan simulasi pengujian kerentanan.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-white text-purple-900 font-semibold text-xs rounded-xl hover:bg-purple-50 transition shadow-sm flex items-center space-x-1.5 self-start md:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Sintetis</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Akun Sintetis"
          value={`${users.length} Akun`}
          subtitle="Mahasiswa, Dosen, Admin"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Akun Mahasiswa"
          value={`${studentsCount} Orang`}
          subtitle="Target simulasi IDOR & XSS"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Akun Dosen"
          value={`${lecturersCount} Orang`}
          subtitle="Penguji & Pemberi Nilai"
          icon={Shield}
          color="emerald"
        />
      </div>

      {/* Tabel Manajemen Akun */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daftar Akun Pengguna Lab</h2>
            <p className="text-xs text-slate-500">
              Seluruh akun di bawah ini 100% sintetis dan aman digunakan untuk demonstrasi.
            </p>
          </div>
          <button
            onClick={loadUsers}
            className="text-xs text-purple-600 font-semibold hover:underline flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/70">
                <th className="py-2.5 px-3 font-semibold">Pengguna</th>
                <th className="py-2.5 px-3 font-semibold">Username / Email</th>
                <th className="py-2.5 px-3 font-semibold">Role</th>
                <th className="py-2.5 px-3 font-semibold">NIM / NIP</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {u.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-slate-800 font-medium">@{u.username}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'dosen' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {u.nim || u.nip || '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                      u.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {u.status === 'Aktif' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{u.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
                    >
                      {u.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900">Tambah Akun Pengguna Sintetis</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Nama Lengkap Sintetis
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Rian Anggara"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="student004"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    NIM / NIP Fiktif
                  </label>
                  <input
                    type="text"
                    value={newNim}
                    onChange={(e) => setNewNim(e.target.value)}
                    placeholder="202401004"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold transition"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
