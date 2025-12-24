// import axios from 'axios';

// import React, { useEffect, useState } from 'react'
// import { useForm } from 'react-hook-form';

// const Home = async() => {
//   const [arr, setarr] = useState([])
//     const {
//       register,
//       handleSubmit,
//       formState: { errors },
//       reset
//     } = useForm();

//   const chatarr=await axios.get('/chat/')
//   console.log(chatarr)

//   return (
//     <div className='flex gap-2'>
//       <div className="left w-[30%] border flex flex-col">
//         <div className="top">
//           <form action="" >
//           <input type="text" placeholder='create chat'

//           />
//         </form>
//         </div>
//         <div className="bottom flex flex-col gap-1">
//           <hr />
//           <div className='border'>
//             t1

//           </div>
//            <div className='border'>
//             t2

//           </div>

//         </div>

//       </div>

//       <div className="right w-[70%]  border-2">right</div>
//     </div>
//   )
// }

// export default Home

// part2...............don

// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import api from "../api/axios";
// import ChatItem from "../components/ChatItem";
// import ChatPage from "../components/ChatPage";

// const Home = () => {
//   const [arr, setArr] = useState([]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm();

//   // useEffect(() => {
//   //   const fetchChats = async () => {
//   //     try {
//   //       const res = await axios.get('/chat/')
//   //       console.log(res)

//   //     } catch (err) {
//   //       console.log(err)
//   //     }
//   //   }

//   //   fetchChats()
//   // }, []) // 👈 runs only once

//   useEffect(() => {
//     const fetchChats = async () => {
//       try {
//         const res = await api.get("/chat");
//         // console.log(res.data.chat);
//         setArr(res.data.chat);
//       } catch (err) {
//         console.log(err.response?.data || err.message);
//       }
//     };

//     fetchChats();
//   }, []);

//  const onSubmit = async (data) => {
//   try {
//     const res = await api.post("/chat/", {
//       title: data.title,
//     });

//     setArr((prev) => [...prev, res.data.chat]);

//     reset();
//   } catch (err) {
//     console.log(err.response?.data || err.message);
//   }
// };


//   return (
//     <div className="flex gap-2">
//       <div className="left w-[30%] border flex flex-col">
//         <div className="top">
//           <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
//             <input
//               type="text"
//               {...register("title", { required: true })}
//               placeholder="create chat"
//               className="border p-1 flex-1"
//             />

//             <button
//               type="submit"
//               className="border px-3 py-1 bg-blue-600 text-white hover:bg-blue-700"
//             >
//               Create
//             </button>
//           </form>
//         </div>

//         <div className="bottom flex flex-col gap-1">
//           <hr />
//           {arr.map((item, index) => (
//             <ChatItem key={item._id} chat={item} />
//           ))}
//         </div>
//       </div>

//       <div className="right w-[70%] border-2">
//         <ChatPage />
//       </div>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import ChatItem from "../components/ChatItem";
import ChatPage from "../components/ChatPage";

const Home = () => {
  const [arr, setArr] = useState([]);

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

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">

      {/* ================= LEFT SIDEBAR ================= */}
      <div className="w-[320px] border-r border-gray-700 flex flex-col">

        {/* 🔝 Create Chat */}
        <div className="p-3 border-b border-gray-700">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="New chat..."
              className="flex-1 bg-[#020617] border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 px-3 py-2 rounded hover:bg-blue-700 text-sm"
            >
              +
            </button>
          </form>
        </div>

        {/* 📜 Chat List */}
        <div className="flex flex-col overflow-y-auto p-2 space-y-1">
          {arr.map((item) => (
            <ChatItem key={item._id} chat={item} />
          ))}
        </div>
      </div>

      {/* ================= RIGHT CHAT AREA ================= */}
      <div className="flex-1">
        <ChatPage />
      </div>

    </div>
  );
};

export default Home;

