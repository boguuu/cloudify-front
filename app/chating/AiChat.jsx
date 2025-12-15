"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AiChat({ session, onRecommend }) {
  const chatEndRef = useRef(null);
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `안녕하세요, ${
        session?.name || "사용자"
      }님! 오늘 기분은 어떠신가요? 이야기해 주시면 딱 맞는 노래를 추천해 드릴게요. 🎵`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("🚀 백엔드로 요청 보냄:", { text: userMessage });

      const res = await fetch(
        "https://api.cloudify.lol/api/recommend/by-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // 쿠키 인증 필수
          body: JSON.stringify({ text: userMessage }),
        }
      );

      if (!res.ok) {
        let errorDetail = "";
        try {
          const errorJson = await res.json();
          console.error("🔥 서버 에러 응답(JSON):", errorJson);
          errorDetail = errorJson.message || JSON.stringify(errorJson);
        } catch (parseError) {
          const errorText = await res.text();
          console.error("🔥 서버 에러 응답(Text):", errorText);
          errorDetail = errorText.slice(0, 50);
        }

        if (res.status === 401) {
          throw new Error("로그인이 만료되었습니다.");
        } else if (res.status === 500) {
          throw new Error(`서버 내부 오류(500): ${errorDetail}`);
        } else {
          throw new Error(`요청 실패(${res.status}): ${errorDetail}`);
        }
      }

      const responseData = await res.json();
      console.log("✅ 백엔드 추천 성공:", responseData);

      const rawList = Array.isArray(responseData)
        ? responseData
        : responseData.data || [];

      const recommendedSongs = rawList.map((item, index) => {
        return {
          _id: item.videoId || `rec-${index}`,
          videoId: item.videoId,
          title: item.title || "Unknown Title",
          artist: item.artist || "Unknown Artist",
          cover:
            item.songImageUrl ||
            `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
        };
      });

      // 5. 결과 처리
      setTimeout(() => {
        if (recommendedSongs.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `분석 완료! ${recommendedSongs.length}곡을 추천해 드렸습니다. 플레이리스트에 담아드릴게요! 🎧`,
            },
          ]);
          onRecommend(recommendedSongs);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "추천 결과가 비어있어요. 다른 주제로 이야기해 볼까요?",
            },
          ]);
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("❌ 추천 시스템 최종 에러:", error);

      let userDisplayMessage =
        "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      if (error.message.includes("로그인")) {
        userDisplayMessage = "로그인이 필요합니다. 로그인 페이지로 이동합니다.";
        setTimeout(() => router.replace("/login"), 2000);
      } else if (error.message.includes("500")) {
        userDisplayMessage =
          "서버가 응답하지 않습니다. (500 에러) 백엔드 로그를 확인해주세요.";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: userDisplayMessage },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 flex items-center gap-3">
        <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-full">
          <Sparkles className="text-brand-600 dark:text-brand-400" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">
            AI 뮤직 카운슬러
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            감정을 분석하여 음악을 추천합니다
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-brand-600 text-white rounded-br-none"
                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex gap-2 items-center">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="오늘 기분을 이야기해주세요..."
            className="w-full pl-5 pr-12 py-3.5 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 disabled:hover:bg-brand-600 transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
