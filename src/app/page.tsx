"use client";

import Dashboard from "@/components/Dashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/authentication");

      toast('Session Expired', {
        description: 'Your session expired. Please Log In again.',
        icon: <AlertCircle className="mr-2 h-4 w-4" />,
        action: {
          label: 'Log In',
          onClick: () => { router.push('/authentication') }
        }
      })

      return;
    }

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const isExpired = Date.now() >= exp * 1000;

      if (isExpired) {
        localStorage.removeItem("access_token");

        router.push("/authentication");

        toast('Session Expired', {
          description: 'Your session expired. Please Log In again.',
          icon: <AlertCircle className="mr-2 h-4 w-4" />,
          action: {
            label: 'Log In',
            onClick: () => { router.push('/authentication') }
          }
        })
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
