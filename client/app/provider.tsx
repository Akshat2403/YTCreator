"use client";

import { NextUIProvider } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/user",
          {
            withCredentials: true,
          }
        );
        if (!response.data.id) {
          router.push("/login");
        }
        if (pathname === "/login" || pathname === "/signup") {
          router.push("/dashboard");
        }
      } catch (error) {
        router.push("/login");
        console.error(error);
      }
    };
    getUser();
  }, []);
  return <NextUIProvider>{children}</NextUIProvider>;
}
