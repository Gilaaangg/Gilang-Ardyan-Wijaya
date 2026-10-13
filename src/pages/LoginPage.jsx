import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage({ onOpenDocs }) {
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('student001');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuickLogin = async (uname) => {
    setUsername(uname);
    setPassword('password123');
    setError('');
    try {
      await login(uname, 'password123');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Notice */}
      <div className="max-w-md w-full mx-auto mb-6 px-4">
        <div className="bg-red-950/70 border border-red-500/40 rounded-xl p-3 flex items-start space-x-3 text-red-200 text-xs shadow-lg">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-300 uppercase tracking-wide">
              SECURITY LAB — FICTIONAL CAMPUS
            </div>
            <p className="mt-0.5 text-slate-300 leading-relaxed">
              Portal akademik simulasi untuk latihan keamanan aplikasi web (Stored XSS & IDOR). 100% data sintetis.
            </p>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-campus-600 to-campus-400 flex items-center justify-center text-white shadow-xl shadow-campus-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Institut Teknologi & Sains Cyberia
        </h1>
        <p className="mt-1 text-center text-xs text-slate-400">
          Sistem Informasi Akademik & Laboratorium Keamanan Siber
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-800/90 border border-slate-700 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-900/50 border border-red-700/60 text-red-200 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username Akun Sintetis
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="student001"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-campus-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-campus-500 focus:border-transparent font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-campus-600 hover:bg-campus-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-campus-500 transition disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Memproses...' : 'Masuk ke Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Masuk Cepat untuk Evaluasi Lab:
              </span>
              <button
                type="button"
                onClick={onOpenDocs}
                className="text-[11px] text-campus-400 hover:underline"
              >
                Lihat Panduan
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-medium">Mahasiswa Fiktif:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student001')}
                  className="py-1.5 px-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition text-center border border-slate-600/50"
                >
                  student001
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student002')}
                  className="py-1.5 px-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition text-center border border-slate-600/50"
                >
                  student002
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student003')}
                  className="py-1.5 px-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition text-center border border-slate-600/50"
                >
                  student003
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-medium pt-1">Dosen & Admin:</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('lecturer001')}
                  className="py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 rounded-lg text-xs font-mono transition text-center border border-emerald-800/50"
                >
                  lecturer001
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('lecturer002')}
                  className="py-1.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 rounded-lg text-xs font-mono transition text-center border border-emerald-800/50"
                >
                  lecturer002
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin001')}
                  className="py-1.5 px-2 bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 rounded-lg text-xs font-mono transition text-center border border-purple-800/50"
                >
                  admin001
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          Default Password seluruh akun: <code className="text-slate-400 font-mono">password123</code>
        </div>
      </div>
    </div>
  );
}
