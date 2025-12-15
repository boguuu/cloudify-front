"use client";

<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import Sidebar from "../components/Sidebar";
import AiChat from "./AiChat";

export default function ChatPage() {
  const router = useRouter();

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [session, setSession] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://api.cloudify.lol/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleRecommendation = (newPlaylist) => {
    if (newPlaylist && newPlaylist.length > 0) {
      localStorage.setItem("cloudify_playlist", JSON.stringify(newPlaylist));
      router.push("/");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center dark:text-white">
        로딩 중...
=======
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import Sidebar from "../components/Sidebar";

const glassmorphismStyle =
  "bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg";

// --- ChatPage Component ---
export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const chatContainerRef = useRef(null);

  // --- State ---
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요! 오늘 어떤 음악을 듣고 싶으신가요? 기분이나 상황을 알려주세요. 🎵",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // --- Auth Effect ---
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // --- Scroll Effect ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // --- Functions ---
  const addMessageToChat = (text, sender = "bot") => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (!userInput) return;

    addMessageToChat(userInput, "user");
    setInputValue("");
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      addMessageToChat(
        "알겠습니다. 요청을 처리 중입니다. 잠시 후 메인 페이지로 이동합니다."
      );
      setIsLoading(false);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    }, 1000);
  };

  // --- Render ---
  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white/50">
        Loading...
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* 1. 사이드바 */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          transform transition-transform duration-300 ease-out shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          session={session}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* 2. 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {/* 헤더 */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="font-semibold text-lg text-brand-600 dark:text-brand-400">
            AI Chat
          </div>
          <div className="w-8"></div>
        </header>

        {/* 채팅 바디 */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6 justify-center">
          <div className="w-full max-w-4xl h-full">
            <AiChat session={session} onRecommend={handleRecommendation} />
          </div>
        </div>
=======
    <div className="flex flex-row h-[70vh] w-full max-w-5xl p-6 gap-6">
      <Sidebar />

      {/* --- 중앙 (채팅) --- */}
      <main
        className={`${glassmorphismStyle} p-6 flex-1 flex flex-col text-white/90`}
      >
        {/* Chat Window */}
        <div
          ref={chatContainerRef}
          className="flex-grow p-2 space-y-4 overflow-y-auto"
          style={{ scrollbarWidth: "none" }} // Firefox 스크롤바 숨김
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-2xl shadow-md max-w-xl fade-in ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white/20 text-white/90 rounded-bl-none"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start max-w-md">
              <div className="bg-white/20 rounded-2xl rounded-bl-none p-3 flex items-center">
                <div className="typing-indicator">
                  <span className="bg-white/50"></span>
                  <span className="bg-white/50"></span>
                  <span className="bg-white/50"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleChatSubmit}
          className="flex items-center space-x-3 pt-4"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="오늘 좀 힘들었어..."
            className="flex-grow p-3 bg-white/10 border border-white/20 rounded-full focus:ring-2 focus:ring-white/50 focus:outline-none transition text-white placeholder-white/50"
            autoComplete="off"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-white/90 text-slate-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition shadow-lg disabled:opacity-50"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </form>
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
      </main>
    </div>
  );
}
<<<<<<< HEAD
=======

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Send } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// const glassmorphismStyle =
//   "bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg";

// // --- ChatPage Component ---
// export default function ChatPage() {
//   const router = useRouter();
//   const chatContainerRef = useRef(null);

//   // --- State ---
//   const [messages, setMessages] = useState([
//     {
//       sender: "bot",
//       text: "안녕하세요! 오늘 어떤 음악을 듣고 싶으신가요? 기분이나 상황을 알려주세요. 🎵",
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // --- Scroll Effect ---
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollHeight;
//     }
//   }, [messages, isLoading]);

//   // --- Functions ---
//   const addMessageToChat = (text, sender = "bot") => {
//     setMessages((prev) => [...prev, { sender, text }]);
//   };

//   const handleChatSubmit = (e) => {
//     e.preventDefault();
//     const userInput = inputValue.trim();
//     if (!userInput) return;

//     addMessageToChat(userInput, "user");
//     setInputValue("");
//     setIsLoading(true);

//     // Simulate bot response
//     setTimeout(() => {
//       addMessageToChat(
//         "알겠습니다. 요청을 처리 중입니다. 잠시 후 메인 페이지로 이동합니다."
//       );
//       setIsLoading(false);

//       setTimeout(() => {
//         router.push("/"); // 메인 음악 플레이어 페이지로 이동
//       }, 1500);
//     }, 1000);
//   };

//   return (
//     <div className="flex flex-row h-[70vh] w-full max-w-5xl p-6 gap-6">
//       <Sidebar />

//       {/* --- 중앙 (채팅) --- */}
//       <main
//         className={`${glassmorphismStyle} p-6 flex-1 flex flex-col text-white/90`}
//       >
//         {/* Chat Window */}
//         <div
//           ref={chatContainerRef}
//           className="flex-grow p-2 space-y-4 overflow-y-auto"
//           style={{ scrollbarWidth: "none" }} // Firefox 스크롤바 숨김
//         >
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`w-full flex ${
//                 msg.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`p-3 rounded-2xl shadow-md max-w-xl fade-in ${
//                   msg.sender === "user"
//                     ? "bg-blue-500 text-white rounded-br-none"
//                     : "bg-white/20 text-white/90 rounded-bl-none"
//                 }`}
//               >
//                 <p>{msg.text}</p>
//               </div>
//             </div>
//           ))}

//           {/* Typing Indicator */}
//           {isLoading && (
//             <div className="flex justify-start max-w-md">
//               <div className="bg-white/20 rounded-2xl rounded-bl-none p-3 flex items-center">
//                 <div className="typing-indicator">
//                   <span className="bg-white/50"></span>
//                   <span className="bg-white/50"></span>
//                   <span className="bg-white/50"></span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Input Form */}
//         <form
//           onSubmit={handleChatSubmit}
//           className="flex items-center space-x-3 pt-4"
//         >
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             placeholder="오늘 좀 힘들었어..."
//             className="flex-grow p-3 bg-white/10 border border-white/20 rounded-full focus:ring-2 focus:ring-white/50 focus:outline-none transition text-white placeholder-white/50"
//             autoComplete="off"
//             disabled={isLoading}
//           />
//           <button
//             type="submit"
//             className="bg-white/90 text-slate-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition shadow-lg disabled:opacity-50"
//             disabled={isLoading}
//           >
//             <Send size={20} />
//           </button>
//         </form>
//       </main>
//     </div>
//   );
// }
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
