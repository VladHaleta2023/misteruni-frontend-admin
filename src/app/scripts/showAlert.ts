import { toast } from "react-toastify";
import React from "react";

export function showAlert(statusCode: number, message: React.ReactNode) {
  if (statusCode >= 200 && statusCode < 300) {
    toast.success(message, { autoClose: 3000 });
  } else if (statusCode >= 400 && statusCode < 500) {
    toast.warning(message, { autoClose: false });
  } else {
    toast.error(message, { autoClose: false });
  }
}

export function showInfo(message: string) {
  toast.info(message, { autoClose: false });
}