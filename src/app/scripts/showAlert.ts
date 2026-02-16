import { toast } from "react-toastify";
import React from "react";

const TIMES = {
  SUCCESS: 3000,
  WARNING: 4000,
  ERROR: 4000,
};

export function showAlert(statusCode: number, message: React.ReactNode) {
  if (statusCode >= 200 && statusCode < 300) {
    toast.success(message, { autoClose: TIMES.SUCCESS });
  } else if (statusCode >= 400 && statusCode < 500) {
    toast.warning(message, { autoClose: false });
  } else {
    toast.error(message, { autoClose: false });
  }
}

export function showInfo(message: string) {
  toast.info(message, { autoClose: false });
}