

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from 'react-router-dom'
import api from "../api/axios";
import { toast } from 'react-toastify'
import ChatItem from "../components/ChatItem";
import ChatPage from "../components/ChatPage";

const Home = () => {
  const [arr, setArr] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onToggle = () => setMobileOpen((v) => !v);
    window.addEventListener('toggle-sidebar', onToggle);
    return () => window.removeEventListener('toggle-sidebar', onToggle);
  }, []);

  const { register, handleSubmit, reset } = useForm();

  // 📥 Load chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/chat");
        setArr(res.data.chat);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchChats();
  }, []);

  // ➕ Create chat
  const onSubmit = async (data) => {
    try {
      const res = await api.post("/chat", { title: data.title });
      setArr((prev) => [...prev, res.data.chat]);
      reset();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // 🗑️ Delete chat
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    try {
      await api.delete(`/chat/${id}`);
      setArr((prev) => prev.filter((c) => c._id !== id));
      toast.success('Chat deleted');

      // if we are viewing that chat, navigate home
      if (location.pathname.includes(id)) {
        navigate('/home');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="flex h-full bg-[#071426] text-gray-100 rounded-xl overflow-hidden shadow-lg">

      {/* ================= LEFT SIDEBAR ================= */}
      {/* backdrop for mobile when sidebar is open */}
      <div onClick={()=> setMobileOpen(false)} className={`fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden ${mobileOpen ? 'block' : 'hidden'}`} />

      <div className={`${collapsed ? 'w-16' : 'w-[320px]'} border-r border-[#071426] flex flex-col bg-[#040612] transition-width duration-200 sm:static fixed sm:translate-x-0 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'} inset-y-0 left-0 z-40 w-full max-w-xs sm:w-[320px]` }>

      {/* 🔝 Sidebar header */}
        <div className="p-4 border-b border-[#071426] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="sm:hidden">
              <button onClick={()=> setMobileOpen(false)} aria-label='Close sidebar' title='Close sidebar' className='p-2 rounded hover:bg-[#071426]'>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L2 7v6c0 5 3.8 9.7 10 13 6.2-3.3 10-8 10-13V7l-10-5z"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">ZORO</div>
              <div className="text-xs text-gray-400">Your AI assistant</div>
            </div>
          </div>
          <button onClick={()=>{}} title="New chat" className="bg-[#040612] border border-[#071426] text-gray-300 px-2 py-1 rounded hover:bg-[#071426] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16"/></svg>
            <span className="text-xs text-gray-300">New</span>
          </button>
        </div>

        {/* 🔝 Create Chat */}
        <div className="p-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-center">
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="New chat..."
              className="flex-1 bg-[#040612] text-gray-300 border border-[#071426] rounded px-3 py-1.5 text-sm focus:outline-none placeholder-gray-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 text-black px-2 py-1.5 rounded hover:opacity-90 text-sm border border-emerald-500 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16"/></svg>
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* 📜 Chat List */}
        <div className="flex-1 h-[60vh] sm:h-auto overflow-y-auto p-2 space-y-1 min-h-0 custom-scrollbar pr-2">
          {arr.map((item) => (
            <ChatItem key={item._id} chat={item} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* ================= RIGHT CHAT AREA ================= */}
      <div className="flex-1 min-h-0 overflow-hidden flex items-stretch">
        <div className="flex-1 h-full flex flex-col min-h-0">
          <ChatPage />
        </div>
      </div>

    </div>
  );
};

export default Home;


