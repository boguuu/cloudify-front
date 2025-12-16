"use client";

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
      </div>
    );
  }

  return (
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
            Cloudify
          </div>
          <div className="w-8"></div>
        </header>

        {/* 채팅 바디 */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6 justify-center">
          <div className="w-full max-w-4xl h-full">
            <AiChat session={session} onRecommend={handleRecommendation} />
          </div>
        </div>
      </main>
    </div>
  );
}
