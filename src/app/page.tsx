"use client";

import Dashboard from "@/components/Dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/authentication");
      toast.error("Your session expired. Please log in again.")
      return;
    }

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() >= exp * 1000;

      if (isExpired) {
        localStorage.removeItem("access_token");
        router.push("/authentication");
        toast.error("Your session expired. Please log in again.")
      }
    } 
    catch (error) {
      console.error("Failed to decode token:", error);
      router.push("/authentication");
    }
  }, [router]);

  return (
    <main className="container mx-auto p-4">
      <Dashboard />
    </main>
  );
}
