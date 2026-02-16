import React from "react";
import "@/app/styles/message.css";

interface SwitchPopUpOKProps {
  onConfirm: () => void;
  textConfirm?: string;
  bodyMaxWidth?: string;
  btnsWidth?: string;
  message?: string;
  visible?: boolean;
}

export default function MessageOK({
  onConfirm,
  textConfirm = "OK",
  bodyMaxWidth = "600px",
  btnsWidth = "100px",
  message = "Message",
  visible = false,
}: SwitchPopUpOKProps) {
  if (!visible) return null;
  
  return (
    <div className="popup-overlay">
      <div className="switchPopUp" style={{ maxWidth: bodyMaxWidth }}>
        <div className="text" style={{ whiteSpace: "pre-wrap" }}>
          {message}
        </div>
        <div className="btnsSwitchPopUp" style={{ justifyContent: "flex-end" }}>
          <button
            className="btnSwicthPopUp confirm"
            onClick={onConfirm}
            style={{ width: btnsWidth, maxWidth: btnsWidth }}
          >
            {textConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}