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

type SectionPageProps = {
  subjectId: number;
  sectionId: number;
};

export default function SectionPage({ subjectId, sectionId }: SectionPageProps) {
  const [typeSectionText, setTypeSectionText] = useState("");
  const [promptSubtopicsText, setPromptSubtopicsText] = useState("");
  const [promptQuestionText, setPromptQuestionText] = useState("");
  const [promptSolutionText, setPromptSolutionText] = useState("");
  const [promptAnswersText, setPromptAnswersText] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [msgSectionDataVisible, setMsgSectionDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const typeSectionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [typeSectionTextareaExpanded, setTypeSectionTextareaExpanded] = useState(false);
  const [typeSectionTextareaRows, setTypeSectionTextareaRows] = useState(2);
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
    async function fetchSectionPromptById() {
      if (subjectId === -1 || sectionId === -1) {
        setSubjectName("");
        setSectionName("");
        setPromptQuestionText("");
        setPromptSolutionText("");
        setPromptAnswersText("");
        setPromptSubtopicsText("");
        setTypeSectionText("");
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}?withTopics=false&withSubtopics=false&withPercent=false`);
        if (response.data?.statusCode === 200) {
          setSubjectName(response.data.subject.name);
          setSectionName(response.data.section.name);
          setTypeSectionText(response.data.section.type);
          setPromptSubtopicsText(response.data.section.subtopicsPrompt);
          setPromptQuestionText(response.data.section.questionPrompt);
          setPromptSolutionText(response.data.section.solutionPrompt);
          setPromptAnswersText(response.data.section.answersPrompt);
        } else {
          setSectionName("");
          setTypeSectionText("");
          setSubjectName("");
          setPromptSubtopicsText("");
          setPromptQuestionText("");
          setPromptSolutionText("");
          setPromptAnswersText("");
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        setSectionName("");
        setSubjectName("");
        setPromptSubtopicsText("");
        setTypeSectionText("");
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

    fetchSectionPromptById();
  }, [subjectId, sectionId]);

  function showSpinner(visible: boolean, text: string = "") {
    setSpinnerVisible(visible);
    setSpinnerText(text);
  }

  function resetSpinner() {
    setSpinnerVisible(false);
    setSpinnerText("");
  }

  function handleSectionSaveDataMsgCancel() {
    setMsgSectionDataVisible(false);
  }

  function handleSubtopicsPromptMsgCancel() {
    setMsgSubtopicsPromptVisible(false);
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

  function toggleTypeSectionTextareaSize() {
    if (typeSectionTextareaRef.current) {
      if (!typeSectionTextareaExpanded) {
        const rows = calculateRows(typeSectionTextareaRef.current);
        setTypeSectionTextareaRows(rows);
      } else {
        setTypeSectionTextareaRows(2);
      }
    }

    setTypeSectionTextareaExpanded(prev => !prev);
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

  function handleOpenMessageSaveSectionData() {
    setMsgSectionDataVisible(true);
  }

  function handleOpenMessageSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(true);
  }

  async function handleSaveSectionData() {
    setMsgSectionDataVisible(false);
    showSpinner(true, "Trwa zapisywanie danych...");

    try {
      const response = await saveSectionData();

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

    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja podtematów przedmiotu ${subjectName}, rozdziału ${topicsResponse.data.section.name}, tematu ${topicsResponse.data.topics[i].name}...`);
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
            showAlert(400, `Nie udało się zgenerować podtamaty przedmiotu ${subjectName}, rozdziału ${topicsResponse.data.section.name}, tematu ${topicsResponse.data.topics[i].name}`);
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

  async function saveSectionData(data = {
    type: typeSectionText,
    subtopicsPrompt: promptSubtopicsText,
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    answersPrompt: promptAnswersText
  }) {
    try {
      return await api.put(`/subjects/${subjectId}/sections/${sectionId}`, data);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  return (
    <>
      <main>
        <Message 
          message={`Czy na pewno chcesz zapisać dane dla przedmiotu ${subjectName}, rozdziału ${sectionName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSaveSectionData}
          onClose={handleSectionSaveDataMsgCancel}
          visible={msgSectionDataVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować podtematy dla przedmiotu ${subjectName}, rozdziału ${sectionName}?`}
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
                {typeSectionTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTypeSectionTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTypeSectionTextareaSize}
                  />
                }
                <label htmlFor="SectionType" className="label">Typ Rozdziału:</label>
                <textarea
                  id="SectionType"
                  rows={typeSectionTextareaRows}
                  ref={typeSectionTextareaRef}
                  name="text-container"
                  value={typeSectionText}
                  onInput={(e) => setTypeSectionText((e.target as HTMLTextAreaElement).value)}
                  className="text-container"
                  spellCheck={true}
                  placeholder="Proszę napisać typ rozdziału..."
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
                  onClick={handleOpenMessageSaveSectionData}
                >
                  Zapisz
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
                <label htmlFor="SectionSubtopics" className="label">Prompt Podtematów:</label>
                <textarea
                  id="SectionSubtopics"
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