import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { UserProvider } from "../context/UserContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phono | Купить телефоны в Узбекистане",
  description: "Купить телефоны в Узбекистане",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <UserProvider>{children}</UserProvider>
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
      </body>
    </html>
  );
}
