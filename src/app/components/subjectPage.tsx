'use client';

import "@/app/styles/components.css";
import "@/app/styles/main.css";
import { useState, useEffect, useRef } from "react";
import api from "@/app/utils/api";
import showAlert from "@/app/scripts/showAlert";
import axios from "axios";
import Message from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import { ChevronDown, ChevronUp } from "lucide-react";

type SubjectPageProps = {
  subjectId: number;
};

export default function SubjectPage({ subjectId }: SubjectPageProps) {
  const [subjectPromptText, setSubjectPromptText] = useState("");
  const [typeSubjectText, setTypeSubjectText] = useState("");
  const [promptSubtopicsText, setPromptSubtopicsText] = useState("");
  const [promptQuestionText, setPromptQuestionText] = useState("");
  const [promptSolutionText, setPromptSolutionText] = useState("");
  const [promptAnswersText, setPromptAnswersText] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [msgPlanVisible, setMsgPlanVisible] = useState(false);
  const [msgSubjectDataVisible, setMsgSubjectDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptTextareaExpanded, setPromptTextareaExpanded] = useState(false);
  const [promptTextareaRows, setPromptTextareaRows] = useState(5);
  const typeSubjectTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [typeSubjectTextareaExpanded, setTypeSubjectTextareaExpanded] = useState(false);
  const [typeSubjectTextareaRows, setTypeSubjectTextareaRows] = useState(2);
  const promptSubtopicsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubtopicsTextareaExpanded, setPromptSubtopicsTextareaExpanded] = useState(false);
  const [promptSubtopicsTextareaRows, setPromptSubtopicsTextareaRows] = useState(5);

  const promptQuestionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptQuestionTextareaExpanded, setPromptQuestionTextareaExpanded] = useState(false);
  const [promptQuestionTextareaRows, setPromptQuestionTextareaRows] = useState(5);

  const promptSolutionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSolutionTextareaExpanded, setPromptSolutionTextareaExpanded] = useState(false);
  const [promptSolutionTextareaRows, setPromptSolutionTextareaRows] = useState(5);

  const promptAnswersTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptAnswersTextareaExpanded, setPromptAnswersTextareaExpanded] = useState(false);
  const [promptAnswersTextareaRows, setPromptAnswersTextareaRows] = useState(5);

  useEffect(() => {
    async function fetchSubjectPromptById() {
      if (subjectId === -1) {
        setSubjectName("");
        setSubjectPromptText("");
        setPromptSubtopicsText("");
        setTypeSubjectText("");
        setPromptQuestionText("");
        setPromptSolutionText("");
        setPromptAnswersText("");
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}`);
        if (response.data?.statusCode === 200) {
          setSubjectPromptText(response.data.subject.prompt);
          setSubjectName(response.data.subject.name);
          setTypeSubjectText(response.data.subject.type);
          setPromptSubtopicsText(response.data.subject.subtopicsPrompt);
          setPromptQuestionText(response.data.subject.questionPrompt);
          setPromptSolutionText(response.data.subject.solutionPrompt);
          setPromptAnswersText(response.data.subject.answersPrompt);
        } else {
          setTypeSubjectText("");
          setSubjectName("");
          setSubjectPromptText("");
          setPromptSubtopicsText("");
          setPromptQuestionText("");
          setPromptSolutionText("");
          setPromptAnswersText("");
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        setSubjectName("");
        setSubjectPromptText("");
        setPromptSubtopicsText("");
        setTypeSubjectText("");
        setPromptQuestionText("");
        setPromptSolutionText("");
        setPromptAnswersText("");
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

  function handlePlanMsgCancel() {
    setMsgPlanVisible(false);
  }

  function handleSubjectSaveDataMsgCancel() {
    setMsgSubjectDataVisible(false);
  }

  function handleSubtopicsPromptMsgCancel() {
    setMsgSubtopicsPromptVisible(false);
  }

  async function handlePlanGenerate() {
    setMsgPlanVisible(false);
    showSpinner(true, "Trwa generacja treści...");

    saveSubjectData();

    try {
      const response = await api.post(`/subjects/${subjectId}/generate`, {
        prompt: subjectPromptText,
      });

      showAlert(response.data.statusCode, response.data.message);

      setTimeout(() => {
        resetSpinner();
        window.location.reload();
      }, 1000);
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

  function calculateRows(textarea: HTMLTextAreaElement): number {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || "210");
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop || "0");
    const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom || "0");
    const totalPadding = paddingTop + paddingBottom;

    const rows = Math.floor((textarea.scrollHeight - totalPadding) / lineHeight);
    return rows;
  }

  function handleOpenMessagePlanGenerate() {
    setMsgPlanVisible(true);
  }

  function togglePromptTextareaSize() {
    if (promptTextareaRef.current) {
      if (!promptTextareaExpanded) {
        const rows = calculateRows(promptTextareaRef.current);
        setPromptTextareaRows(rows);
      } else {
        setPromptTextareaRows(5);
      }
    }

    setPromptTextareaExpanded(prev => !prev);
  }

  function toggleTypeSubjectTextareaSize() {
    if (typeSubjectTextareaRef.current) {
      if (!typeSubjectTextareaExpanded) {
        const rows = calculateRows(typeSubjectTextareaRef.current);
        setTypeSubjectTextareaRows(rows);
      } else {
        setTypeSubjectTextareaRows(2);
      }
    }

    setTypeSubjectTextareaExpanded(prev => !prev);
  }

  function toggleQuestionPromptTextareaSize() {
    if (promptQuestionTextareaRef.current) {
      if (!promptQuestionTextareaExpanded) {
        const rows = calculateRows(promptQuestionTextareaRef.current);
        setPromptQuestionTextareaRows(rows);
      } else {
        setPromptQuestionTextareaRows(5);
      }
    }

    setPromptQuestionTextareaExpanded(prev => !prev);
  }

  function toggleSolutionPromptTextareaSize() {
    if (promptSolutionTextareaRef.current) {
      if (!promptSolutionTextareaExpanded) {
        const rows = calculateRows(promptSolutionTextareaRef.current);
        setPromptSolutionTextareaRows(rows);
      } else {
        setPromptSolutionTextareaRows(5);
      }
    }

    setPromptSolutionTextareaExpanded(prev => !prev);
  }

  function toggleAnswersPromptTextareaSize() {
    if (promptAnswersTextareaRef.current) {
      if (!promptAnswersTextareaExpanded) {
        const rows = calculateRows(promptAnswersTextareaRef.current);
        setPromptAnswersTextareaRows(rows);
      } else {
        setPromptAnswersTextareaRows(5);
      }
    }

    setPromptAnswersTextareaExpanded(prev => !prev);
  }

  function toggleSubtopicsPromptTextareaSize() {
    if (promptSubtopicsTextareaRef.current) {
      if (!promptSubtopicsTextareaExpanded) {
        const rows = calculateRows(promptSubtopicsTextareaRef.current);
        setPromptSubtopicsTextareaRows(rows);
      } else {
        setPromptSubtopicsTextareaRows(5);
      }
    }

    setPromptSubtopicsTextareaExpanded(prev => !prev);
  }

  function handleOpenMessageSaveSubjectData() {
    setMsgSubjectDataVisible(true);
  }

  function handleOpenMessageSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(true);
  }

  async function handleSaveSubjectData() {
    setMsgSubjectDataVisible(false);
    showSpinner(true, "Trwa zapisywanie danych...");

    try {
      const response = await saveSubjectData();

      showAlert(response?.data.statusCode, response?.data.message);

      setTimeout(() => {
        resetSpinner();
        window.location.reload();
      }, 1000);
    }
    catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
        resetSpinner();
      }, 1000);
    }
  }

  async function handleSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(false);

    await saveSubjectData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        const topicId: number = topicsResponse.data.topics[i].id;
        const sectionId: number = topicsResponse.data.topics[i].section.id;
        showSpinner(true, `Trwa generacja podtematów przedmiotu ${subjectName}, rozdziału ${topicsResponse.data.topics[i].section.name}, tematu ${topicsResponse.data.topics[i].name}...`);
        await api.delete(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics`);

        let changed: string = "true";
        let attempt: number = 0;
        let subtopics: string[] = [];
        const prompt: string = topicsResponse.data.topics[i].subtopicsPrompt;
        const MAX_ATTEMPTS = 10;

        console.log(`Prompt:\n${topicsResponse.data.topics[i].subtopicsPrompt}`);

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
          const subtopicsResponse = await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/generate`, {
            changed,
            subtopics,
            attempt,
            prompt
          });

          if (subtopicsResponse.data?.statusCode === 201) {
            changed = subtopicsResponse.data.changed;
            subtopics = subtopicsResponse.data.subtopics;
            attempt = subtopicsResponse.data.attempt;
            console.log(`Temat ${topicsResponse.data.topics[i].name}: Próba ${attempt}`);
          }
          else {
            showAlert(400, `Nie udało się zgenerować podtamaty przedmiotu ${subjectName}, rozdziału ${topicsResponse.data.topics[i].section.name}, tematu ${topicsResponse.data.topics[i].name}`);
            break;
          }
        }

        await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/bulk`, {
          subtopics
        });
      }

      setTimeout(() => {
        resetSpinner();
        window.location.reload();
      }, 1000);
    }
    catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
        resetSpinner();
      }, 1000);
    }
  }

  async function saveSubjectData(data = {
    type: typeSubjectText,
    prompt: subjectPromptText,
    subtopicsPrompt: promptSubtopicsText,
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    answersPrompt: promptAnswersText
  }) {
    try {
      return await api.put(`/subjects/${subjectId}`, data);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  return (
    <>
      <main>
        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować treść dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handlePlanGenerate}
          onClose={handlePlanMsgCancel}
          visible={msgPlanVisible}
        />

        <Message 
          message={`Czy na pewno chcesz zapisać dane dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSaveSubjectData}
          onClose={handleSubjectSaveDataMsgCancel}
          visible={msgSubjectDataVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować podtematy dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsGenerate}
          onClose={handleSubtopicsPromptMsgCancel}
          visible={msgSubtopicsPromptVisible}
        />

        <div className={spinnerVisible ? "container-center" : ""}>
          {spinnerVisible ? (
            <div className="spinner-wrapper">
              <Spinner text={spinnerText} />
            </div>
          ) : (
            <>
              <div className="options-container">
                {typeSubjectTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTypeSubjectTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTypeSubjectTextareaSize}
                  />
                }
                <label htmlFor="subjectType" className="label">Typ Przedmoitu:</label>
                <textarea
                  id="subjectType"
                  rows={typeSubjectTextareaRows}
                  ref={typeSubjectTextareaRef}
                  name="text-container"
                  value={typeSubjectText}
                  onInput={(e) => setTypeSubjectText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać typ przedmiotu..."
                />
              </div>
              <div className="options-container">
                {promptQuestionTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleQuestionPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleQuestionPromptTextareaSize}
                  />
                }
                <label htmlFor="promptQuestion" className="label">Prompt Tekst Zadania:</label>
                <textarea
                  id="promptQuestion"
                  rows={promptQuestionTextareaRows}
                  ref={promptQuestionTextareaRef}
                  name="text-container"
                  value={promptQuestionText}
                  onInput={(e) => setPromptQuestionText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać prompt tekst zadania..."
                />
              </div>
              <div className="options-container">
                {promptSolutionTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSolutionPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSolutionPromptTextareaSize}
                  />
                }
                <label htmlFor="promptSolution" className="label">Prompt Rozwiązania Zadania:</label>
                <textarea
                  id="promptSolution"
                  rows={promptSolutionTextareaRows}
                  ref={promptSolutionTextareaRef}
                  name="text-container"
                  value={promptSolutionText}
                  onInput={(e) => setPromptSolutionText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać prompt rozwiązanie..."
                />
              </div>
              <div className="options-container">
                {promptAnswersTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleAnswersPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleAnswersPromptTextareaSize}
                  />
                }
                <label htmlFor="promptAnswers" className="label">Prompt Warianty Odpowiedzi Zadania:</label>
                <textarea
                  id="promptAnswers"
                  rows={promptAnswersTextareaRows}
                  ref={promptAnswersTextareaRef}
                  name="text-container"
                  value={promptAnswersText}
                  onInput={(e) => setPromptAnswersText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać prompt warianty odpowiedzi..."
                />
              </div>
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageSaveSubjectData}
                >
                  Zapisz
                </button>
              </div>
              <br />
              <br />
              <div className="options-container">
                {promptTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={togglePromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={togglePromptTextareaSize}
                  />
                }
                <label htmlFor="subjectPlan" className="label">Treść Przedmiotu:</label>
                <textarea
                  id="subjectPlan"
                  rows={promptTextareaRows}
                  ref={promptTextareaRef}
                  name="text-container"
                  value={subjectPromptText}
                  onInput={(e) => setSubjectPromptText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać prompt dla treści..."
                />
              </div>
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessagePlanGenerate}
                >
                  Generuj Treść
                </button>
              </div>
              <br />
              <br />
              <div className="options-container">
                {promptSubtopicsTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSubtopicsPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSubtopicsPromptTextareaSize}
                  />
                }
                <label htmlFor="subjectSubtopics" className="label">Prompt Podtematów:</label>
                <textarea
                  id="subjectSubtopics"
                  rows={promptSubtopicsTextareaRows}
                  ref={promptSubtopicsTextareaRef}
                  name="text-container"
                  value={promptSubtopicsText}
                  onInput={(e) => setPromptSubtopicsText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać prompt dla podtematów..."
                />
              </div>
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageSubtopicsGenerate}
                >
                  Generuj Podtematy
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}