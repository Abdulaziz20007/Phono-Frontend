import React from "react";
import { AppProps } from "next/app";
import { UserProvider } from "../context/UserContext";
import { Toaster } from "react-hot-toast";
import "../app/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            iconTheme: {
              primary: "#5e35b1",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#e53935",
              secondary: "#fff",
            },
          },
        }}
      />
    </UserProvider>
  );
}

export default MyApp;
