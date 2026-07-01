// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';

// Temporary Dashboard Stub until we wire Workspace components in next phase
function DummyWorkspace() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
      <div className="border border-slate-800 bg-slate-900 p-8 rounded-2xl max-w-md shadow-xl">
        <h2 className="text-3xl font-extrabold text-emerald-400 mb-2">Pipeline Connected</h2>
        <p className="text-slate-300 mb-6">Welcome back, <span className="font-mono text-white bg-slate-950 px-2 py-1 rounded border border-slate-800">{user.username || 'Developer'}</span>!</p>
        <button 
          onClick={() => { localStorage.clear(); window.location.reload(); }}
          className="bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-800 text-slate-300 hover:text-rose-400 text-sm px-4 py-2 rounded-xl transition-all"
        >
          Disconnect Session Token
        </button>
      </div>
    </div>
  );
}

// Protected Route Guard Layer
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<ProtectedRoute><DummyWorkspace /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}