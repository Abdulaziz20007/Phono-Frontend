import { ReactNode } from "react";
import Script from "next/script";
import Header from "../../components/Header/Header";
import "../../components/Header/Header.scss";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="beforeInteractive"
      />
      <Header />
      {children}
    </>
  );
}
