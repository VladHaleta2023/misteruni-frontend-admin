'use client';

import React from "react";
import "@/app/styles/globals.css";
import "@/app/styles/header.css";
import Dropdown from "@/app/components/dropdown";

interface HeaderProps {
  onUpdate: () => void;
}

export default function Header({ onUpdate }: HeaderProps) {
  return (
    <header className="header">
      <Dropdown onUpdate={onUpdate} />
      <span style={{ fontSize: "24px" }}>MisterUniAdmin</span>
    </header>
  );
}