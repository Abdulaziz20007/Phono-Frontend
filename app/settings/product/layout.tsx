"use client";

import React from "react";
import styles from "./layout.module.scss";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
