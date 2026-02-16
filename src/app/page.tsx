'use client';

import Header from "@/app/components/header";
import "@/app/styles/login-components.css";
import "@/app/styles/globals.css";
import LoginPage from "./components/login";

export default function MainPage() {
  return (
    <>
      <Header />

      <div>
        <LoginPage />
      </div>
    </>
  );
}