
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios";
import { toast } from 'react-toastify';

const ChatPage = () => {
  const { id: chatId } = useParams();

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatTitle, setChatTitle] = useState('');

  const bottomRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  // helper to auto-resize the textarea to fit content
  const adjustTextarea = (el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  // set initial height on mount (in case of pre-filled value)
  useEffect(() => {
    const el = document.querySelector('textarea[name="content"]');
    if (el) adjustTextarea(el);
  }, []);

  // load chat title when chat changes
  useEffect(() => {
    if (!chatId) {
      setChatTitle('');
      return;
    }

    async function loadChat() {
      try {
        const res = await api.get(`/chat/${chatId}`);
        setChatTitle(res.data.title || '');
      } catch (err) {
        console.error('Failed to load chat details', err);
        setChatTitle('');
      }
    }

    loadChat();
  }, [chatId]);

  /* ======================================================
     1️⃣ CREATE SOCKET (ONLY ONCE)
     ====================================================== */
  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("ai-response", (msg) => {
      setLoading(false);
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  /* ======================================================
     2️⃣ CLEAR UI WHEN CHAT CHANGES
     ====================================================== */
  useEffect(() => {
    setMessages([]);
  }, [chatId]);

  /* ======================================================
     3️⃣ LOAD OLD CHAT HISTORY (REST)
     ====================================================== */

  useEffect(() => {
    if (!chatId) return;

    async function loadHistory() {
      try {
        const res = await api.get(`/chat/${chatId}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load history", err);
      }
    }

    loadHistory();
  }, [chatId]);

  /* ======================================================
     4️⃣ JOIN SOCKET ROOM
     ====================================================== */

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("join-chat", { chatId });

    return () => {
      socket.emit("leave-chat", { chatId });
    };
  }, [socket, chatId]);

  /* ======================================================
     5️⃣ AUTO SCROLL TO BOTTOM
     ====================================================== */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ======================================================
     6️⃣ SEND MESSAGE
     ====================================================== */
  const onSubmit = (data) => {
    if (!chatId) {
      toast.error('Please select a chat first');
      return;
    }
    if (!socket) {
      toast.error('Socket not connected');
      return;
    }
    if (!data.content.trim()) {
      return;
    }

    const payload = {
      chat_id: chatId,
      content: data.content,
    };

    // optimistic UI
    setMessages((prev) => [...prev, { role: "user", content: data.content }]);

    setLoading(true);
    socket.emit("ai-message", payload);
    reset();
  }; 

  /* ======================================================
     7️⃣ UI
     ====================================================== */
  return (
    <div className="flex flex-col h-full bg-[#071426] text-gray-100 rounded-lg overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm text-gray-300">Conversation</h2>
          <p className="text-xs text-gray-400 truncate">{chatTitle || chatId}</p>
        </div>
        <div className="text-xs text-gray-400">Model: GPT-like</div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0 custom-scrollbar pr-2" style={{overscrollBehavior: 'contain'}}>
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-10">
            Start a conversation 👋
          </p>
        )}

        {messages.map((msg, index) => (
          <div key={msg._id || index} className={`w-[75%] sm:max-w-[70%] text-sm ${msg.role === 'user' ? 'ml-auto bg-emerald-500 text-black' : 'mr-auto bg-[#0b1220] text-gray-100 border border-gray-700'} rounded-lg px-4 py-2`}> 
            <div>{msg.content}</div>
            <div className="text-xs text-shadow-gray-400 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}</div>
          </div>
        ))}

        {/* typing indicator */}
        {loading && (
          <div className="bg-gray-700 px-3 py-2 rounded-lg w-fit text-sm animate-pulse">
            AI is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-gray-700 p-3 flex gap-3 items-end">
        <textarea
          name="content"
          rows={1}
          placeholder={chatId ? "Ask anything..." : "Select a chat to start typing..."}
          className={`flex-1 resize-none bg-[#0b1220] text-gray-100 border border-gray-700 px-3 py-1.5 rounded text-sm focus:outline-none placeholder-gray-400 max-h-36 overflow-y-auto custom-scrollbar ${(!chatId || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...register("content", { required: true, onChange: (e) => adjustTextarea(e.target) })}
          disabled={loading || !chatId}
        />
        <button disabled={loading || !chatId} title={chatId ? undefined : 'Select a chat to send'} className="bg-emerald-500 text-black px-3 py-1.5 rounded text-sm disabled:opacity-50 border border-emerald-500">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;


