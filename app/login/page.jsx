"use client";

<<<<<<< HEAD
import { Music, Headphones, Sparkles, ArrowRight } from "lucide-react";
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
              <Headphones size={40} className="text-white" />
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
                YouTube 재생
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
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12.5S6.42 23 12.1 23c5.83 0 8.84-4.15 8.84-8.83c0-.76-.15-1.82-.15-1.82z"
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
=======
import React from "react";
import { signIn } from "next-auth/react";
import { Cloud } from "lucide-react";

const glassmorphismStyle =
  "bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // 구글 로그인 후 /chat 페이지로 이동하도록 설정
    signIn("google", { callbackUrl: "/chating" });
  };

  return (
    <div className={`${glassmorphismStyle} w-full max-w-sm p-10 text-white/90`}>
      <div className="flex flex-col items-center space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="flex flex-col items-center justify-center mb-4 space-y-3">
            <Cloud size={52} className="text-white/80" />
            <h1 className="text-4xl font-bold text-white">Cloudify</h1>
          </div>
          <p className="text-white/60">음악, 대화로 발견하다</p>
        </div>

        {/* 로그인 버튼 */}
        <div className="w-full pt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white/90 text-slate-800 py-3 rounded-lg font-semibold hover:bg-white transition-colors shadow-md transform hover:scale-105 duration-300"
          >
            Google 계정으로 로그인
          </button>
        </div>

        {/* 푸터 */}
        <div className="text-center text-xs text-white/40 pt-4">
          <p>&copy; 2025 Cloudify. All rights reserved.</p>
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import { Cloud } from "lucide-react";

// const glassmorphismStyle =
//   "bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg";

// export default function LoginPage() {
//   const router = useRouter(); // useRouter 훅 사용

//   const handleGoogleLogin = () => {
//     // 실제 로그인을 호출하는 대신 /chat 페이지로 이동
//     router.push("/chating");
//   };

//   return (
//     <div className={`${glassmorphismStyle} w-full max-w-sm p-10 text-white/90`}>
//       <div className="flex flex-col items-center space-y-8">
//         {/* 헤더 */}
//         <div className="text-center">
//           <div className="flex flex-col items-center justify-center mb-4 space-y-3">
//             <Cloud size={52} className="text-white/80" />
//             <h1 className="text-4xl font-bold text-white">Cloudify</h1>
//           </div>
//           <p className="text-white/60">음악, 대화로 발견하다</p>
//         </div>

//         {/* '로그인' 버튼 (페이지 이동 기능) */}
//         <div className="w-full pt-4">
//           <button
//             onClick={handleGoogleLogin}
//             className="w-full bg-white/90 text-slate-800 py-3 rounded-lg font-semibold hover:bg-white transition-colors shadow-md transform hover:scale-105 duration-300"
//           >
//             Google 계정으로 로그인
//           </button>
//         </div>

//         {/* 푸터 */}
//         <div className="text-center text-xs text-white/40 pt-4">
//           <p>&copy; 2025 Cloudify. All rights reserved.</p>
//         </div>
//       </div>
//     </div>
//   );
// }
>>>>>>> 131156c9bf9cf71fcce71be47c5c70ce365d3ab8
