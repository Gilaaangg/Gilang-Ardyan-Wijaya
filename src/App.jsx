import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import SecurityBanner from './components/SecurityBanner';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SecurityLabModal from './components/SecurityLabModal';

import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import GradesPage from './pages/GradesPage';
import DiscussionPage from './pages/DiscussionPage';
import AssignmentsPage from './pages/AssignmentsPage';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

function MainApp() {
  const { user, notification } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // If not logged in, render the login page
  if (!user) {
    return (
      <>
        <LoginPage onOpenDocs={() => setIsDocsOpen(true)} />
        <SecurityLabModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
      </>
    );
  }

  // Adjust default view per role
  const renderContent = () => {
    switch (activeTab) {
      // Student views
      case 'dashboard':
        return user.role === 'dosen' ? (
          <LecturerDashboard onOpenDocs={() => setIsDocsOpen(true)} />
        ) : user.role === 'admin' ? (
          <AdminDashboard onOpenDocs={() => setIsDocsOpen(true)} />
        ) : (
          <StudentDashboard setActiveTab={setActiveTab} onOpenDocs={() => setIsDocsOpen(true)} />
        );

      case 'grades':
        return <GradesPage onOpenDocs={() => setIsDocsOpen(true)} />;

      case 'discussion':
        return <DiscussionPage onOpenDocs={() => setIsDocsOpen(true)} />;

      case 'assignments':
        return <AssignmentsPage />;

      case 'profile':
        return <ProfilePage />;

      // Lecturer views
      case 'lecturer-dashboard':
      case 'grading':
      case 'lecturer-assignments':
        return <LecturerDashboard onOpenDocs={() => setIsDocsOpen(true)} />;

      // Admin views
      case 'admin-dashboard':
      case 'users-manage':
        return <AdminDashboard onOpenDocs={() => setIsDocsOpen(true)} />;

      default:
        return <StudentDashboard setActiveTab={setActiveTab} onOpenDocs={() => setIsDocsOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center space-x-2 ${
              notification.type === 'success'
                ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
                : notification.type === 'error'
                ? 'bg-red-900 border-red-700 text-red-100'
                : 'bg-slate-900 border-slate-700 text-slate-100'
            }`}
          >
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Security Lab Banner */}
      <SecurityBanner onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Main Navbar */}
      <Navbar onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Content Layout with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenDocs={() => setIsDocsOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 Institut Teknologi & Sains Cyberia — Security Lab Academic Edition.</span>
          <span className="font-mono text-[11px] text-slate-500">
            Intentionally Vulnerable: Stored XSS & IDOR
          </span>
        </div>
      </footer>

      {/* Interactive Modal */}
      <SecurityLabModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
