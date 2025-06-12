"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("profileActiveTab", "messages");
      router.push("/profile");
    }
  }, [router]);

  return null;
}
