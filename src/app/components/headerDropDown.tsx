'use client';

import React, { ReactNode } from "react";
import "@/app/styles/globals.css";
import "@/app/styles/header.css";
import Dropdown from "@/app/components/dropdown";

interface HeaderDropDownProps {
  onUpdate: () => void;
  children?: ReactNode;
}

export default function HeaderDropDown({ onUpdate, children }: HeaderDropDownProps) {
  return (
    <header className="header">
      <Dropdown onUpdate={onUpdate} />
      <span className="misterUniLogo">MisterUniAdmin</span>
      {children}
    </header>
  );
}