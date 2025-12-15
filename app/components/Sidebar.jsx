"use client";

import Link from "next/link";
import { Home, MessageCircle, Music, User, LogOut, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar({ session }) {
  const router = useRouter();

  // 로그아웃
  const handleLogout = async () => {
    try {
      await fetch("https://api.cloudify.lol/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.replace("/login");
    } catch (e) {
      console.error(e);
      router.replace("/login");
    }
  };

  // 연동 해제
  const handleDisconnect = async () => {
    if (!confirm("정말 구글 계정 연동을 해제하시겠습니까?")) return;
    try {
      await fetch("https://api.cloudify.lol/api/auth/disconnect", {
        method: "POST",
        credentials: "include",
      });
      alert("연동이 해제되었습니다.");
      router.replace("/login");
    } catch (e) {
      console.error(e);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center py-6 bg-white dark:bg-slate-900 overflow-hidden">
      {/* 로고 영역 */}
      <div className="mb-8 p-3 bg-brand-100 dark:bg-white/10 rounded-full flex-shrink-0">
        <Music size={32} className="text-brand-600 dark:text-white" />
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 w-full flex flex-col gap-2 px-4">
        <NavItem href="/" icon={<Home size={22} />} label="홈" />
        <NavItem
          href="/chating"
          icon={<MessageCircle size={22} />}
          label="AI 채팅"
        />
      </nav>

      {/* 하단 유저 영역 */}
      <div className="mt-auto flex flex-col gap-3 items-center w-full px-4 mb-20">
        {/* 유저 프로필 */}
        {session?.userId && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 w-full justify-center overflow-hidden">
            <User size={16} className="flex-shrink-0" />
            <span className="truncate max-w-[100px] whitespace-nowrap">
              {session.userId.substring(0, 8)}...
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition group whitespace-nowrap overflow-hidden"
          title="로그아웃"
        >
          <LogOut
            size={20}
            className="group-hover:text-red-500 transition flex-shrink-0"
          />
          <span className="font-medium text-sm">로그아웃</span>
        </button>

        <button
          onClick={handleDisconnect}
          className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition group whitespace-nowrap overflow-hidden"
          title="연동 해제"
        >
          <Unplug
            size={20}
            className="group-hover:text-red-500 transition flex-shrink-0"
          />
          <span className="font-medium text-sm">연동 해제</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-brand-600 dark:hover:text-white transition-all group whitespace-nowrap overflow-hidden"
    >
      <div className="group-hover:scale-110 transition flex-shrink-0">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
