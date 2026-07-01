// client/src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, Terminal } from 'lucide-react';
import API from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', isError: false });

    try {
      if (isLogin) {
        // Handle User Login
        const res = await API.post('/auth/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setMessage({ text: 'Access Granted! Connecting to workspace...', isError: false });
        
        // Simulate landing transition
        setTimeout(() => navigate('/'), 1500);
      } else {
        // Handle User Registration
        const res = await API.post('/auth/signup', formData);
        setMessage({ text: res.data.msg + ' Redirecting to secure login...', isError: false });
        setTimeout(() => {
          setIsLogin(true);
          setMessage({ text: '', isError: false });
        }, 2000);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.msg || err.response?.data?.error || 'Connection pipeline dropped.',
        isError: true
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Visual Flare */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

        {/* Branding header */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 mb-3">
            <Terminal size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sync-Space</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isLogin ? 'Sign in to access your digital workspace' : 'Create an encrypted developer account'}
          </p>
        </div>

        {/* Info/Error Notification strip */}
        {message.text && (
          <div className={`p-3 rounded-lg text-sm mb-5 text-center font-medium border ${
            message.isError 
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Core Form input blocks */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="manish_dev"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="email"
                placeholder="developer@syncspace.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={18} />
              <input
                type="password"
                placeholder="••••••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-[0.98] transition-all"
          >
            {isLogin ? (
              <>
                <LogIn size={18} /> Authenticate Gateway
              </>
            ) : (
              <>
                <UserPlus size={18} /> Register Identity
              </>
            )}
          </button>
        </form>

        {/* Toggle Option Footer */}
        <div className="mt-6 text-center text-sm relative z-10">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: '', isError: false });
            }}
            className="text-slate-400 hover:text-emerald-400 transition-colors font-medium"
          >
            {isLogin ? "New here? Create an identity space" : "Already registered? Access credentials login"}
          </button>
        </div>
      </div>
    </div>
  );
}