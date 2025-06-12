"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    // if user is not authenticated and not still loading, redirect to auth
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  // Return a loading state while redirecting
  // The actual redirection to /profile is now handled by middleware
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#5e35b1",
      }}
    >
      redirecting to profile...
    </div>
  );
}
