"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "../../context/UserContext";

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    // if user is not authenticated and not still loading, redirect to auth
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
      return;
    }

    if (typeof window !== "undefined" && pathname === "/settings") {
      // Store the active tab in sessionStorage
      sessionStorage.setItem("profileActiveTab", "settings");

      // Use router.push to navigate to the profile page
      router.push("/profile");
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // Return a loading state while redirecting
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
