'use client';

import React from "react";
import "@/app/styles/globals.css";
import "@/app/styles/header.css";

export default function Header() {
  return (
    <header className="header" style={{ justifyContent: "center", alignItems: "center" }}>
      <span className="misterUniLogo">MisterUniAdmin</span>
    </header>
  );
}