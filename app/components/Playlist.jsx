"use client";
import React from "react";
import { Play } from "lucide-react";

export default function Playlist({ songs, currentSong, onSongSelect }) {
  if (!songs || songs.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        플레이리스트가 비어있습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-slate-950">
      {/* 헤더: 버튼 삭제됨 */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur z-10 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800 dark:text-white">
          재생 목록{" "}
          <span className="text-brand-500 ml-1 text-sm">{songs.length}곡</span>
        </h3>
      </div>

      <div className="flex-1 p-2 space-y-1">
        {songs.map((song, index) => {
          // 현재 재생 중인지 확인
          const isCurrent =
            currentSong && song.videoId && currentSong.videoId === song.videoId;

          // 썸네일 안전한 hqdefault 사용
          const coverUrl =
            song.cover ||
            `https://i.ytimg.com/vi/${song.videoId}/hqdefault.jpg`;

          return (
            <div
              key={song.videoId || index}
              onClick={() => onSongSelect(song)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  isCurrent
                    ? "bg-brand-50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 shadow-sm"
                    : "hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent"
                }
              `}
            >
              <div className="flex items-center gap-4 overflow-hidden w-full">
                {/* 번호 및 재생 아이콘 */}
                <div className="w-6 flex justify-center text-sm font-medium text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {isCurrent ? (
                    <Play
                      size={14}
                      className="text-brand-600 dark:text-brand-400 fill-current animate-pulse"
                    />
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                  {!isCurrent && (
                    <Play
                      size={14}
                      className="hidden group-hover:block text-slate-500 dark:text-slate-400"
                    />
                  )}
                </div>

                {/* 썸네일 이미지 */}
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt={song.title || "thumbnail"}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      isCurrent ? "scale-110" : "group-hover:scale-110"
                    }`}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/48?text=Music";
                    }}
                  />
                </div>

                {/* 곡 정보 */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span
                    className={`font-semibold text-sm truncate ${
                      isCurrent
                        ? "text-brand-600 dark:text-brand-400"
                        : "text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {song.title || `Track ${song.videoId}`}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {song.artist || "Unknown Artist"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
