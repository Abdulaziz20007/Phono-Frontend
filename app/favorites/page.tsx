"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("profileActiveTab", "favorites");
      router.push("/profile");
    }
  }, [router]);

  return null;
}
