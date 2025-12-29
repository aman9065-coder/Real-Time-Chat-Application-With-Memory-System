import { NavLink } from "react-router-dom";

const ChatItem = ({ chat, onDelete }) => {
  return (
    <NavLink
      to={`/home/chat/${chat._id}`}
      className={({ isActive }) => `group flex items-start gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${isActive ? 'bg-[#071426] text-white border-l-4 border-emerald-500' : 'bg-[#040612] text-gray-300 hover:bg-[#071426]'}`}
    >
      <div className="flex-shrink-0 mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 group-hover:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12v7a2 2 0 0 1-2 2H7l-6-6V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium truncate">{chat.title || 'New chat'}</div>
        <div className="text-xs text-gray-500 mt-0.5">{chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : ''}</div>
      </div>

      <button
        onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); onDelete && onDelete(chat._id) }}
        title="Delete chat"
        className="ml-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded p-1"
        aria-label="Delete chat"
      >
        {/* nicer trash icon (filled outline) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M9 3a1 1 0 00-.894.553L7 5H4a1 1 0 100 2h16a1 1 0 100-2h-3l-1.106-1.447A1 1 0 0015 3H9zM6 8v11a2 2 0 002 2h8a2 2 0 002-2V8H6zm3 2a1 1 0 012 0v7a1 1 0 11-2 0V10zm4 0a1 1 0 012 0v7a1 1 0 11-2 0V10z"/>
        </svg>
      </button>
    </NavLink>
  );
};

export default ChatItem;



