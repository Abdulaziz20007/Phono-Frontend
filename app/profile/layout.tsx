import { ReactNode } from "react";
import Header from "../../components/Header/Header";
import "../../components/Header/Header.scss";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
