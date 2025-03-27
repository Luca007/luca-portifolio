"use client";

import React from "react";
import Header from "./Header";

export default function StickyHeader() {
  return (
    <div
      className="sticky top-0 w-full z-[9999]"
      style={{ position: "sticky", top: 0, zIndex: 9999 }}
    >
      <Header />
    </div>
  );
}
