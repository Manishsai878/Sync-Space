// client/src/pages/Workspace.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Hash, Send, Terminal, User } from 'lucide-react';
import { io } from 'socket.io-client';
import API from '../api'; // Import your configured Axios instance

// Connect to the backend socket pipeline
const SOCKET_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://sync-space-vet4.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true
});

export default function Workspace() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch history from MongoDB AND listen to the live socket pipeline
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await API.get('/messages');
        setChatMessages(response.data);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    // 1. Load historical messages on startup
    fetchChatHistory();

    // 2. Setup live event listener for incoming messages
    socket.on('receiveMessage', (newMessage) => {
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // 3. Clean up the listener when the component unmounts
    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      const messageData = {
        text: message,
        sender: user.username || 'Developer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Fire the message down the socket pipeline to the backend
      socket.emit('sendMessage', messageData);
      
      // Clear the input box
      setMessage('');
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans">
      
      {/* Sidebar - Channels & Profile */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-10">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-emerald-400 font-bold text-lg">
          <Terminal size={20} /> Sync-Space
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Channels</p>
          <button className="w-full flex items-center gap-2 px-2 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-md transition-colors text-sm font-medium">
            <Hash size={16} /> general
          </button>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
          <div className="flex flex-col truncate pr-2">
            <span className="text-sm font-bold text-white truncate">{user.username}</span>
            <span className="text-xs text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
            </span>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Navbar */}
        <div className="h-16 border-b border-slate-800 flex items-center px-6 bg-slate-950/80 backdrop-blur-sm z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Hash size={20} className="text-slate-500" /> general
          </h2>
        </div>

        {/* Live Messages Display */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {chatMessages.length === 0 ? (
            <div className="text-center text-slate-500 mt-20">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-800">
                <Hash size={32} className="text-slate-600" />
              </div>
              <p className="text-xl font-medium text-slate-300 mb-2">Welcome to #general</p>
              <p className="text-sm">This is the start of the channel. Send a message to wake up the socket!</p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div key={index} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-emerald-400">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-slate-200">{msg.sender}</span>
                    <span className="text-xs text-slate-500 font-medium">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-2xl rounded-tl-none border border-slate-800/50 inline-block">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-slate-950">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all shadow-lg">
            <input
              type="text"
              placeholder="Message #general..."
              className="flex-1 bg-transparent border-none outline-none text-white px-3 placeholder-slate-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="p-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 rounded-lg transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}