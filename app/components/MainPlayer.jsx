"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  Share2,
} from "lucide-react";

export default function MainPlayer(props) {
  // Props 처리
  const track = props.track || props.playlist || [];
  const currentSongData = props.currentSong || {};
  const currentVideoId = currentSongData?.videoId || "";

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // 유튜브 제목 저장용 (DB에 제목 없을 때 사용)
  const [ytTitle, setYtTitle] = useState("");

  const playerRef = useRef(null);
  const animationRef = useRef(null);

  // 1. YouTube API 초기화 및 로드
  const initPlayer = useCallback(() => {
    if (!currentVideoId || !window.YT) return;

    // 이미 플레이어가 생성되어 있다면 비디오만 교체
    if (
      playerRef.current &&
      typeof playerRef.current.loadVideoById === "function"
    ) {
      playerRef.current.loadVideoById(currentVideoId);
      return;
    }

    // 새 플레이어 생성
    playerRef.current = new window.YT.Player("player-iframe", {
      height: "0",
      width: "0",
      videoId: currentVideoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        rel: 0,
        playsinline: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          e.target.setVolume(volume);
          e.target.playVideo();
          // 영상 정보 가져오기
          const data = e.target.getVideoData();
          if (data && data.title) setYtTitle(data.title);
        },
        onStateChange: (e) => {
          const status = e.data;
          // 재생 중
          if (status === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            if (props.setIsPlaying) props.setIsPlaying(true);
            setTotalTime(e.target.getDuration());

            // 제목 재확인
            const data = e.target.getVideoData();
            if (data && data.title) setYtTitle(data.title);
          }
          // 일시정지
          else if (status === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            if (props.setIsPlaying) props.setIsPlaying(false);
          }
          // 끝남 -> 다음 곡
          else if (status === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            if (props.setIsPlaying) props.setIsPlaying(false);
            if (props.onNext) props.onNext();
          }
        },
<<<<<<< HEAD
=======
        onStateChange: (e) => onPlayerStateChange(e), // 상태 변경 시 호출될 함수 연결
        onError: onPlayerError, // 에러 로그 추가
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
      },
    });
  }, [currentVideoId]);

  // 2. API 스크립트 로드
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }
  }, [initPlayer]);

  // 3. 재생 바 업데이트 Loop
  const updateProgress = useCallback(() => {
    if (
      playerRef.current &&
      typeof playerRef.current.getCurrentTime === "function" &&
      !isDragging
    ) {
      const curr = playerRef.current.getCurrentTime();
      if (!isNaN(curr)) setCurrentTime(curr);
    }
<<<<<<< HEAD
    animationRef.current = requestAnimationFrame(updateProgress);
=======
    // API 스크립트가 없다면 동적으로 생성하여 페이지에 추가합니다.
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 스크립트 로드가 완료되면 YouTube API가 이 전역 함수를 호출합니다.
    window.onYouTubeIframeAPIReady = () => initializePlayer();

    // 컴포넌트가 언마운트될 때 정리(cleanup) 함수
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      window.onYouTubeIframeAPIReady = null;
    };
  }, [initializePlayer]);

  // --- 핵심 비디오 제어 로직 ---
  // currentVideoId가 (부모에 의해) 변경되었고 플레이어가 존재하면, 새 비디오를 로드합니다.
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !currentVideoId) return;
    if (typeof p.loadVideoById === "function") {
      try {
        p.loadVideoById(currentVideoId);
      } catch (e) {
        console.warn("loadVideoById 실패:", e);
      }
    }
  }, [currentVideoId]);

  // 플레이어 상태 변경 이벤트 핸들러. (재생, 종료, 일시정지 등)
  const onPlayerStateChange = (event) => {
    const p = playerRef.current;
    if (!p) return;

    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      setTotalTime(p.getDuration ? p.getDuration() : 0);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      onNextTrack?.(); // 다음 곡 재생 요청
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  // YT 에러 로깅
  const onPlayerError = (event) => {
    const code = event?.data;
    const reason =
      {
        2: "Invalid parameter",
        5: "HTML5 player error",
        100: "Video not found / private",
        101: "Embedding disabled by owner",
        150: "Embedding disabled by owner",
      }[code] || "Unknown";
    console.error(
      `[YT Error] code=${code} (${reason}) videoId=${currentVideoId}`
    );
  };

  // --- 재생 바(Progress Bar) 업데이트 로직 ---
  // requestAnimationFrame을 사용하여 부드럽고 효율적으로 재생 바를 업데이트합니다.
  const updateProgressBar = useCallback(() => {
    const p = playerRef.current;
    if (p && typeof p.getCurrentTime === "function" && !isDragging) {
      const current = p.getCurrentTime();
      // 0.25초 이상 차이가 날 때만 상태를 업데이트하여 불필요한 렌더링을 줄입니다 (Throttling).
      if (Math.abs(current - lastReportedTimeRef.current) > 0.25) {
        lastReportedTimeRef.current = current;
        setCurrentTime(current);
      }
    }
    animationFrameRef.current = requestAnimationFrame(updateProgressBar);
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
  }, [isDragging]);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateProgress);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, updateProgress]);

  // 4. 핸들러 함수들
  const togglePlay = () => {
    if (!playerRef.current) return;
    const p = playerRef.current;

    // 안전장치: 함수 존재 여부 확인 후 실행
    if (isPlaying) {
      if (typeof p.pauseVideo === "function") p.pauseVideo();
    } else {
      if (typeof p.playVideo === "function") p.playVideo();
    }
  };

  const handleSeek = (e) => {
    const val = Number(e.target.value);
    const newTime = (val / 100) * totalTime;
    setCurrentTime(newTime);

    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const handleVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);

    if (
      playerRef.current &&
      typeof playerRef.current.setVolume === "function"
    ) {
      playerRef.current.setVolume(val);
    }
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${sec}`;
  };

  // 5. 렌더링 데이터 준비
  const percent = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;

  // 제목: DB제목 -> 유튜브제목 -> 기본값
  // "Track "으로 시작하면 임시 제목이므로 유튜브 제목(ytTitle)을 우선 사용
  const displayTitle =
    currentSongData.title && !currentSongData.title.startsWith("Track ")
      ? currentSongData.title
      : ytTitle || currentSongData.title || "Loading Title...";

  const displayArtist = currentSongData.artist || "Unknown Artist";

  // 썸네일: hqdefault 사용 (가장 안전함)
  const displayCover =
    currentSongData.cover ||
    `https://i.ytimg.com/vi/${currentVideoId}/hqdefault.jpg`;

  return (
<<<<<<< HEAD
    <div className="w-full h-full flex items-center justify-between px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 transition-all duration-300">
      {/* Left: Info */}
      <div className="flex items-center gap-4 w-1/3 min-w-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 shadow-md flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
=======
    <main
      className={`${glassmorphismStyle} p-8 flex-1 flex flex-col items-center justify-center text-white/90`}
    >
      {/* player 요소를 display:none 대신 오프스크린*/}
      <div
        id="player"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          left: -9999,
          top: 0,
          overflow: "hidden",
        }}
      ></div>

      <div className="w-52 h-52 rounded-lg shadow-2xl overflow-hidden mb-6">
        {displayAlbumArt ? (
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
          <img
            src={displayCover}
            alt="art"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p
            className="font-bold text-sm text-slate-900 dark:text-white truncate cursor-default"
            title={displayTitle}
          >
            {displayTitle}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate cursor-default">
            {displayArtist}
          </p>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center justify-center w-1/3 gap-1">
        <div className="flex items-center gap-6">
          <button className="text-slate-400 hover:text-brand-500 hidden md:block transition">
            <Shuffle size={18} />
          </button>

          <button
            onClick={props.onPrev}
            className="text-slate-700 dark:text-slate-200 hover:scale-110 transition"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-full flex items-center justify-center hover:scale-105 shadow-lg transition active:scale-95"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button
            onClick={props.onNext}
            className="text-slate-700 dark:text-slate-200 hover:scale-110 transition"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>

          <button className="text-slate-400 hover:text-brand-500 hidden md:block transition">
            <Repeat size={18} />
          </button>
        </div>

        <div className="w-full max-w-md flex items-center gap-2 text-xs text-slate-400 select-none">
          <span className="w-8 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full relative group cursor-pointer">
            <div
              className="absolute h-full bg-brand-500 rounded-full"
              style={{ width: `${percent}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={percent || 0}
              onChange={handleSeek}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="w-8">{formatTime(totalTime)}</span>
        </div>
      </div>

      {/* Right: Volume */}
      <div className="flex items-center justify-end w-1/3 gap-3 hidden md:flex">
        <Volume2 size={20} className="text-slate-500 dark:text-slate-400" />
        <div className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer group">
          <div
            className="absolute h-full bg-slate-500 dark:bg-slate-400 group-hover:bg-brand-500 rounded-full"
            style={{ width: `${volume}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolume}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <button
          title="공유"
          className="ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <Share2 size={18} />
        </button>
      </div>

      {/* Hidden YouTube Iframe */}
      <div id="player-iframe" className="hidden"></div>
    </div>
  );
}
