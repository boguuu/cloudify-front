"use client";

import { useState, useEffect } from "react";
import { Menu, Music, RefreshCw } from "lucide-react";

// 하위 컴포넌트 임포트
import Sidebar from "../components/Sidebar";
import MainPlayer from "../components/MainPlayer";
import Playlist from "../components/Playlist";

export default function HomePage({ session }) {
  // UI 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 데이터 상태
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 데이터 불러오기 (무조건 DB에서 가져오도록 수정)
  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        // [백엔드 연동] /api/songs 호출
        const res = await fetch("/api/songs", { method: "GET" });
        if (res.ok) {
          const songs = await res.json();
          console.log("✅ MongoDB 데이터 로드:", songs);

          if (songs && songs.length > 0) {
            setPlaylist(songs);
            // 재생 중인 곡이 없으면 첫 곡 자동 장전
            if (!currentSong) setCurrentSong(songs[0]);
          } else {
            console.warn("⚠️ DB에 노래가 없습니다.");
          }
        } else {
          console.error("❌ API 호출 실패:", res.status);
        }
      } catch (error) {
        console.error("❌ 데이터 가져오기 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []); // 의존성 배열 비움

  // 2. 반응형 처리
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

  // 앨범 아트 (안전한 hqdefault 사용)
  const currentCover =
    currentSong?.cover ||
    (currentSong?.videoId
      ? `https://i.ytimg.com/vi/${currentSong.videoId}/hqdefault.jpg`
      : "");

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* 1. 사이드바 (부드러운 애니메이션) */}
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

      {/* 2. 메인 컨텐츠 */}
      <main className="flex-1 flex flex-col h-full w-full relative transition-all duration-300">
        {/* 헤더 */}
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

        {/* 바디 */}
        <div className="flex-1 flex overflow-hidden relative pb-24">
          {isLoading ? (
            <div className="flex-1 flex flex-col gap-4 items-center justify-center text-xl animate-pulse">
              <RefreshCw className="animate-spin" size={32} />
              <span>노래를 불러오는 중입니다...</span>
            </div>
          ) : playlist.length > 0 ? (
            <div className="flex w-full h-full">
              {/* 왼쪽: 앨범 아트 */}
              <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-100 dark:bg-slate-900/50 p-10">
                <div className="relative aspect-square w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-black">
                  {currentCover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentCover}
                      alt="Album Art"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }} // 에러 시 숨김
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                      No Album Art
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
              <Music size={64} className="text-slate-300 dark:text-slate-700" />
              <div className="text-center space-y-2">
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300">
                  재생할 노래가 없습니다.
                </p>
                <p>MongoDB에 데이터가 있는지 확인해주세요.</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. 하단 플레이어 */}
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
