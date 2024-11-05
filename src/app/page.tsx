"use client"

import Dashboard from "@/components/Dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/authentication");
    }
    console.log(localStorage)
  }, [router]);

  return (
    <main className="container mx-auto p-4">
      <Dashboard />
    </main>
  );
}
