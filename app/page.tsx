import React, { Suspense } from "react";
import Home from "../pages/Home/Home";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Загрузка страницы...</div>}>
      <Home />
    </Suspense>
  );
}
