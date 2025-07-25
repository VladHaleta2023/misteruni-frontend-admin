'use client';

import Header from "./components/header";
import "@/app/styles/components.css";
import "@/app/styles/main.css";
import { useState, useEffect, useCallback } from "react";
import api from "@/app/utils/api";
import showAlert from "./scripts/showAlert";
import axios from "axios";
import Message from "@/app/components/message";
import Spinner from "@/app/components/spinner";

export default function Home() {
  const [subjectPromptText, setSubjectPromptText] = useState("");
  const [subjectId, setSubjectId] = useState<number>(-1);
  const [subjectName, setSubjectName] = useState("");
  const [msgPlanVisible, setMsgPlanVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");

  const updateSubjectIdFromStorage = useCallback(() => {
    const storedSubjectId = localStorage.getItem("subjectId");
    if (storedSubjectId) {
      const parsedId = Number(storedSubjectId);
      if (!isNaN(parsedId)) {
        setSubjectId(parsedId);
      } else {
        setSubjectId(-1);
      }
    } else {
      setSubjectId(-1);
    }
  }, []);

  useEffect(() => {
    updateSubjectIdFromStorage();
  }, [updateSubjectIdFromStorage]);

  useEffect(() => {
    async function fetchSubjectPromptById() {
      if (subjectId === -1) {
        setSubjectName("");
        setSubjectPromptText("");
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}`);
        if (response.data?.statusCode === 200) {
          setSubjectPromptText(response.data.subject.prompt);
          setSubjectName(response.data.subject.name);

          console.log(response.data.subject);
        } else {
          setSubjectName("");
          setSubjectPromptText("");
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        setSubjectName("");
        setSubjectPromptText("");
        handleApiError(error);
      } finally {
        setTimeout(() => {
          resetSpinner();
        }, 1000);
      }
    }

    fetchSubjectPromptById();
  }, [subjectId]);

  function showSpinner(visible: boolean, text: string = "") {
    setSpinnerVisible(visible);
    setSpinnerText(text);
  }

  function resetSpinner() {
    setSpinnerVisible(false);
    setSpinnerText("");
  }

  function handleMsgCancel() {
    setMsgPlanVisible(false);
  }

  async function handlePlanGenerate() {
    setMsgPlanVisible(false);
    showSpinner(true, "Trwa generacja treści...");

    try {
      const response = await api.post(`/subjects/${subjectId}/generate`, {
        prompt: subjectPromptText,
      });

      showAlert(response.data.statusCode, response.data.message);

      setTimeout(() => {
        resetSpinner();
        window.location.reload();
      }, 3000);
    } catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
        resetSpinner();
      }, 1000);
    }
  }

  function handleApiError(error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        showAlert(error.response.status, error.response.data.message || "Server error");
      } else {
        showAlert(500, `Server error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      showAlert(500, `Server error: ${error.message}`);
    } else {
      showAlert(500, "Unknown error");
    }
  }

  function handleOpenMessagePlanGenerate() {
    setMsgPlanVisible(true);
  }

  return (
    <>
      <Header onUpdate={updateSubjectIdFromStorage} />
      <main>
        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować treść dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handlePlanGenerate}
          onClose={handleMsgCancel}
          visible={msgPlanVisible}
        />

        <div className={spinnerVisible ? "container-center" : ""}>
          {spinnerVisible ? (
            <div className="spinner-wrapper">
              <Spinner text={spinnerText} />
            </div>
          ) : (
            <>
              <textarea
                name="text-container"
                value={subjectPromptText}
                onInput={(e) => setSubjectPromptText((e.target as HTMLTextAreaElement).value)}
                className="text-container"
                spellCheck={true}
                placeholder="Proszę napisać prompt..."
              />
              <div style={{ marginTop: "12px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessagePlanGenerate}
                >
                  Generuj treść
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}