import { useEffect } from "react";
import { useRouter } from "next/router";

// This is a placeholder file to support the App Router version
// It redirects any requests to /settings from Pages Router to the App Router implementation
export default function SettingsPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the App Router settings page which will then redirect to profile
    window.location.href = "/settings";
  }, []);

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
      Redirecting to settings...
    </div>
  );
}
