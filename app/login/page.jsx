"use client";

import { Music, Headphones, Sparkles, ArrowRight, Cloud } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href =
      "https://api.cloudify.lol/oauth2/authorization/google?redirect_uri=https://dev.cloudify.lol:3000/";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
      {/* Main Card */}
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-fade-in border border-brand-100 dark:border-slate-700">
        {/* Header Section */}
        <div className="relative h-48 bg-brand-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* Decorative Circles */}
            <div className="absolute top-[-50%] left-[-20%] w-64 h-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-[-50%] right-[-20%] w-64 h-64 rounded-full bg-brand-200 blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-white">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm mb-3 shadow-lg">
              <Cloud size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Cloudify</h1>
            <p className="text-brand-100 text-sm mt-1">Your Mood, Your Music</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
              오늘의 기분은 어떤가요?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              AI가 당신의 감정을 이해하고,
              <br />딱 맞는 음악을 추천해드립니다.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="flex flex-col items-center p-3 bg-brand-50 dark:bg-slate-800 rounded-xl">
              <Sparkles className="text-brand-500 mb-2" size={20} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                AI 감성 분석
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-brand-50 dark:bg-slate-800 rounded-xl">
              <Music className="text-brand-500 mb-2" size={20} />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                음악 재생
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            {/* Google Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google 계정으로 시작하기</span>
            <ArrowRight
              size={18}
              className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </button>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            로그인 시 개인정보처리방침 및 이용약관에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
