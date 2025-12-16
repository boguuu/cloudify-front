"use client";

import { useState, useEffect } from "react";
import { Menu, Music, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Sidebar from "../components/Sidebar";
import MainPlayer from "../components/MainPlayer";
import Playlist from "../components/Playlist";

export default function HomePage({ session }) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 스토리지 확인
    const savedPlaylist = localStorage.getItem("cloudify_playlist");

    if (savedPlaylist) {
      try {
        const parsed = JSON.parse(savedPlaylist);
        if (parsed && parsed.length > 0) {
          console.log("✅ 추천 플레이리스트 로드:", parsed);
          setPlaylist(parsed);
          setCurrentSong(parsed[0]); // 첫 곡 자동 장전
        }
      } catch (e) {
        console.error("로컬 스토리지 데이터 오류", e);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- 플레이어 컨트롤 ---
  const handleSongSelect = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const handleNextSong = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(
      (s) => s.videoId === currentSong.videoId
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevSong = () => {
    if (!currentSong || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(
      (s) => s.videoId === currentSong.videoId
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const currentCover =
    currentSong?.cover ||
    (currentSong?.videoId
      ? `https://i.ytimg.com/vi/${currentSong.videoId}/hqdefault.jpg`
      : "");

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar*/}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out ${
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="font-semibold text-lg text-brand-600 dark:text-brand-400">
            Cloudify Player
          </div>
          <div className="w-8"></div>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden relative pb-24">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center animate-pulse text-lg">
              로딩 중...
            </div>
          ) : playlist.length > 0 ? (
            <div className="flex w-full h-full">
              {/* 왼쪽: 앨범 아트 */}
              <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-100 dark:bg-slate-900/50 p-10">
                <div className="relative aspect-square w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black">
                  {currentCover ? (
                    <Image
                      src={currentCover}
                      alt="Album Art"
                      width={500}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      priority={true} // LCP 최적화
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {/* 오른쪽: 재생 목록 */}
              <div className="flex-1 lg:flex-none lg:w-[450px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-y-auto no-scrollbar">
                <Playlist
                  songs={playlist}
                  currentSong={currentSong}
                  onSongSelect={handleSongSelect}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-6">
              <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-full">
                <Music
                  size={48}
                  className="text-slate-300 dark:text-slate-600"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300">
                  재생할 노래가 없습니다.
                </p>
                <p>AI 채팅에서 기분에 맞는 노래를 추천받아보세요!</p>
                <button
                  onClick={() => router.push("/chating")}
                  className="mt-3 ml-20 flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <PlayCircle size={20} />
                  추천받으러 가기
                </button>
              </div>
            </div>
          )}
        </div>

        {/*하단 플레이어 */}
        {currentSong && (
          <div className="absolute bottom-0 left-0 right-0 h-24 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] bg-white dark:bg-slate-900">
            <MainPlayer
              currentSong={currentSong}
              playlist={playlist}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onNext={handleNextSong}
              onPrev={handlePrevSong}
            />
          </div>
        )}
      </main>
    </div>
  );
}
