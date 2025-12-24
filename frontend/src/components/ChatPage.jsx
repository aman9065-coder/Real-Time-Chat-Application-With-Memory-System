// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";

// const ChatPage = () => {
//   const { id } = useParams();

//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);

//   const { register, handleSubmit, reset } = useForm();

//   // SOCKET CONNECTION
//   useEffect(() => {
//     const socketInstance = io("http://localhost:3000", {
//       withCredentials: true,
//     });

//     socketInstance.on("connect", () => {
//       console.log("Socket connected:", socketInstance.id);
//       socketInstance.emit("join-chat", { chatId: id });
//     });

//     // RECEIVE MESSAGE (ONLY ONCE)
//     socketInstance.on("ai-response", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     setSocket(socketInstance);

//     return () => {
//       socketInstance.disconnect();
//     };
//   }, [id]);

//   // SEND MESSAGE
//   const onSubmit = (data) => {
//     const payload = {
//       chat_id: id,
//       content: data.content,
//     };

//     // show user message immediately
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: data.content },
//     ]);

//     socket.emit("ai-message", payload);
//     reset();
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <h2>Chat ID: {id}</h2>

//       <div className="flex flex-col gap-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded max-w-[70%] ${
//               msg.role === "user"
//                 ? "self-end bg-blue-500 text-white"
//                 : "self-start bg-gray-200"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
//         <input
//           className="border flex-1"
//           placeholder="ask anything"
//           {...register("content")}
//         />
//         <button className="border px-2">Send</button>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";

// const ChatPage = () => {
//   const { id: chatId } = useParams();

//   const [socket, setSocket] = useState(null);
//   const [messages, setMessages] = useState([]);

//   const { register, handleSubmit, reset } = useForm();

//  // 1️⃣ clear messages on chat change
// useEffect(() => {
//   setMessages([]);
// }, [chatId]);

// useEffect(() => {
//   async function loadHistory() {
//     const res = await fetch(
//       `http://localhost:3000/api/chat/${chatId}/messages`,
//       { credentials: "include" }
//     );
//     const data = await res.json();
//     setMessages(data);
//   }

//   loadHistory();
// }, [chatId]);

// // 2️⃣ socket connection (already correct)
// // useEffect(() => {
// //   const socketInstance = io("http://localhost:3000", {
// //     withCredentials: true,
// //   });

// //   socketInstance.emit("join-chat", { chatId });

// //   socketInstance.on("ai-response", (data) => {
// //     setMessages(prev => [...prev, data]);
// //   });

// //   setSocket(socketInstance);

// //   return () => {
// //     socketInstance.off("ai-response");
// //     socketInstance.disconnect();
// //   };
// // }, [chatId]);

// useEffect(() => {
//   if (!socket) return;

//   socket.emit("join-chat", { chatId });

//   socket.on("ai-response", (msg) => {
//     setMessages(prev => [...prev, msg]);
//   });

//   return () => socket.off("ai-response");
// }, [socket, chatId]);

//   // 📤 SEND MESSAGE
//   const onSubmit = (data) => {
//     if (!socket) return;

//     const payload = {
//       chat_id: chatId,
//       content: data.content,
//     };

//     // show user message instantly
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: data.content },
//     ]);

//     socket.emit("ai-message", payload);
//     reset();
//   };

//   return (
//     <div className="flex flex-col h-screen p-4 gap-3">
//       <h2 className="font-bold">Chat ID: {chatId}</h2>

//       {/* 📨 CHAT AREA */}
//       <div className="flex-1 overflow-y-auto border p-3 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded max-w-[70%] ${
//               msg.role === "user"
//                 ? "bg-blue-600 ml-auto"
//                 : "bg-gray-700"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//       </div>

//       {/* ✍️ INPUT */}
//       <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Ask anything..."
//           className="border flex-1 p-2 rounded"
//           {...register("content", { required: true })}
//         />
//         <button className="bg-blue-500 text-white px-4 rounded">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";

// const ChatPage = () => {
//   // 🆔 chat id from URL
//   const { id: chatId } = useParams();

//   // 🔌 socket instance
//   const [socket, setSocket] = useState(null);

//   // 📨 all messages (user + AI)
//   const [messages, setMessages] = useState([]);

//   // ✍️ form handler
//   const { register, handleSubmit, reset } = useForm();

//   /* ======================================================
//      1️⃣ CREATE SOCKET (ONLY ONCE)
//      ====================================================== */
//   useEffect(() => {
//     const socketInstance = io("http://localhost:3000", {
//       withCredentials: true, // cookie based auth
//     });

//     socketInstance.on("connect", () => {
//       console.log("Socket connected:", socketInstance.id);
//     });

//     // receive AI / live messages
//     socketInstance.on("ai-response", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     setSocket(socketInstance);

//     // cleanup
//     return () => {
//       socketInstance.disconnect();
//       console.log("Socket disconnected");
//     };
//   }, []);

//   /* ======================================================
//      2️⃣ LOAD OLD CHAT HISTORY (REST API)
//      ====================================================== */
//   useEffect(() => {
//     if (!chatId) return;

//     async function loadHistory() {
//       try {
//         const res = await fetch(
//           `http://localhost:3000/api/chat/${chatId}/messages`,
//           { credentials: "include" }
//         );
//         const data = await res.json();
//         setMessages(data); // overwrite with DB messages
//       } catch (err) {
//         console.error("Failed to load chat history", err);
//       }
//     }

//     loadHistory();
//   }, [chatId]);

//   /* ======================================================
//      3️⃣ JOIN SOCKET ROOM WHEN CHAT CHANGES
//      ====================================================== */
//   useEffect(() => {
//     if (!socket || !chatId) return;

//     // clear old messages UI
//     setMessages([]);

//     // join room
//     socket.emit("join-chat", { chatId });

//   }, [socket, chatId]);

//   /* ======================================================
//      4️⃣ SEND MESSAGE
//      ====================================================== */
//   const onSubmit = (data) => {
//     if (!socket) return;

//     const payload = {
//       chat_id: chatId,
//       content: data.content,
//     };

//     // show user message instantly (optimistic UI)
//     setMessages((prev) => [
//       ...prev,
//       { role: "user", content: data.content },
//     ]);

//     // send to backend
//     socket.emit("ai-message", payload);

//     reset();
//   };

//   /* ======================================================
//      5️⃣ UI
//      ====================================================== */
//   return (
//     <div className="flex flex-col h-screen p-4 gap-3 bg-[#0f172a] text-white">

//       {/* HEADER */}
//       <h2 className="font-bold text-lg">
//         Chat ID: {chatId}
//       </h2>

//       {/* CHAT MESSAGES */}
//       <div className="flex-1 overflow-y-auto border border-gray-600 p-3 space-y-2 rounded">

//         {messages.map((msg, index) => (
//           <div
//             key={msg._id || index}
//             className={`p-2 rounded max-w-[70%] ${
//               msg.role === "user"
//                 ? "bg-blue-600 ml-auto text-right"
//                 : "bg-gray-700"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}

//       </div>

//       {/* INPUT BOX */}
//       <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
//         <input
//           type="text"
//           placeholder="Ask anything..."
//           className="border border-gray-600 bg-transparent flex-1 p-2 rounded"
//           {...register("content", { required: true })}
//         />
//         <button className="bg-blue-500 px-4 rounded">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;

// ....................... ondoinw

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../api/axios";

const ChatPage = () => {
  const { id: chatId } = useParams();

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

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
    if (!socket || !data.content.trim()) return;

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
    <div className="flex flex-col h-full p-4 bg-[#0f172a] text-white">
      {/* HEADER */}
      <div className="border-b border-gray-700 pb-2 mb-2">
        <h2 className="font-semibold text-sm text-gray-300">Chat ID</h2>
        <p className="text-xs text-gray-400 truncate">{chatId}</p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-10">
            Start a conversation 👋
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
              msg.role === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"
            }`}
          >
            {msg.content}
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 pt-3 border-t border-gray-700"
      >
        <input
          type="text"
          placeholder="Ask anything..."
          className="flex-1 bg-[#020617] border border-gray-600 px-3 py-2 rounded text-sm focus:outline-none"
          {...register("content", { required: true })}
          disabled={loading}
        />
        <button
          disabled={loading}
          className="bg-blue-600 px-4 rounded text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
