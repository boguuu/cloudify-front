"use client";

import { useState, useEffect } from "react";
import LoginPage from "@/app/login/page";
import HomePage from "@/app/homepage/HomePage";

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 5000)
      );

      try {
        const res = await Promise.race([
          fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "https://api.cloudify.lol"
            }/api/auth/me`,
            {
              method: "GET",
              credentials: "include", // 쿠키 포함 필수
            }
          ),
          timeoutPromise,
        ]);

        if (res.ok) {
          const data = await res.json();
          setUserData(data);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.warn("Auth check failed or timed out:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 dark:border-brand-400 mb-4"></div>
          <p className="animate-pulse text-sm text-slate-500">
            Connecting to Cloudify...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return <HomePage session={userData} />;
}
