'use client';

import "@/app/styles/components.css";
import "@/app/styles/main.css";
import { useState, useEffect, useRef } from "react";
import api from "@/app/utils/api";
import { showAlert } from "@/app/scripts/showAlert";
import axios from "axios";
import Message from "@/app/components/message";
import Spinner from "@/app/components/spinner";
import { ChevronDown, ChevronUp } from "lucide-react";

type SubjectPageProps = {
  subjectId: number;
  subjectName?: string;
};

type Subtopic = {
  topicId: number;
  subjectId: number;
  sectionId: number;
  subtopics: [string, number][];
};

type Topic = {
  id: number;
  name: string;
  section: Section;
  subtopicsPrompt: string;
};

type Section = {
  id: number;
  name: string;
};

export default function SubjectPage({ subjectId }: SubjectPageProps) {
  const [subjectPromptText, setSubjectPromptText] = useState(["", ""]);
  const [typeSubjectText, setTypeSubjectText] = useState(["", ""]);
  const [promptSubtopicsText, setPromptSubtopicsText] = useState(["", ""]);
  const [promptQuestionText, setPromptQuestionText] = useState(["", ""]);
  const [promptSolutionText, setPromptSolutionText] = useState(["", ""]);
  const [promptAnswersText, setPromptAnswersText] = useState(["", ""]);
  const [promptClosedSubtopicsText, setPromptClosedSubtopicsText] = useState(["", ""]);
  const [promptSubQuestionsText, setPromptSubQuestionsText] = useState(["", ""]);
  const [promptStoriesText, setPromptStoriesText] = useState(["", ""]);

  const [promptSubtopicsTextOwn, setPromptSubtopicsTextOwn] = useState(true);
  const [promptQuestionTextOwn, setPromptQuestionTextOwn] = useState(true);
  const [promptSolutionTextOwn, setPromptSolutionTextOwn] = useState(true);
  const [promptAnswersTextOwn, setPromptAnswersTextOwn] = useState(true);
  const [promptClosedSubtopicsTextOwn, setPromptClosedSubtopicsTextOwn] = useState(true);
  const [promptSubQuestionsTextOwn, setPromptSubQuestionsTextOwn] = useState(true);
  const [promptStoriesTextOwn, setPromptStoriesTextOwn] = useState(true);

  const [subjectName, setSubjectName] = useState("");
  const [msgPlanVisible, setMsgPlanVisible] = useState(false);
  const [msgSubjectDataVisible, setMsgSubjectDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptTextareaExpanded, setPromptTextareaExpanded] = useState(false);
  const [promptTextareaRows, setPromptTextareaRows] = useState(5);

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

  const promptClosedSubtopicsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptClosedSubtopicsTextareaExpanded, setPromptClosedSubtopicsTextareaExpanded] = useState(false);
  const [promptClosedSubtopicsTextareaRows, setPromptClosedSubtopicsTextareaRows] = useState(5);

  const promptSubQuestionsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubQuestionsTextareaExpanded, setPromptSubQuestionsTextareaExpanded] = useState(false);
  const [promptSubQuestionsTextareaRows, setPromptSubQuestionsTextareaRows] = useState(5);

  const promptStoriesTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptStoriesTextareaExpanded, setPromptStoriesTextareaExpanded] = useState(false);
  const [promptStoriesTextareaRows, setPromptStoriesTextareaRows] = useState(5);

  useEffect(() => {
    async function fetchSubjectPromptById() {
      if (subjectId === -1) {
        setSubjectName("");
        setSubjectPromptText(["", ""]);
        setPromptSubtopicsText(["", ""]);
        setTypeSubjectText(["", ""]);
        setPromptQuestionText(["", ""]);
        setPromptSolutionText(["", ""]);
        setPromptAnswersText(["", ""]);
        setPromptClosedSubtopicsText(["", ""]);
        setPromptSubQuestionsText(["", ""]);
        setPromptStoriesText(["", ""]);
        setPromptSubtopicsTextOwn(true);
        setPromptQuestionTextOwn(true);
        setPromptSolutionTextOwn(true);
        setPromptAnswersTextOwn(true);
        setPromptClosedSubtopicsTextOwn(true);
        setPromptSubQuestionsTextOwn(true);
        setPromptStoriesTextOwn(true);
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}`);
        if (response.data?.statusCode === 200) {
          setSubjectPromptText([response.data.subject.prompt, response.data.subject.prompt]);
          setSubjectName(response.data.subject.name);
          setTypeSubjectText([response.data.subject.type, response.data.subject.type]);
          setPromptSubtopicsText([response.data.subject.subtopicsPrompt, response.data.subject.subtopicsPrompt]);
          setPromptQuestionText([response.data.subject.questionPrompt, response.data.subject.questionPrompt]);
          setPromptSolutionText([response.data.subject.solutionPrompt, response.data.subject.solutionPrompt]);
          setPromptAnswersText([response.data.subject.answersPrompt, response.data.subject.answersPrompt]);
          setPromptSubQuestionsText([response.data.subject.subQuestionsPrompt, response.data.subject.subQuestionsPrompt]);
          setPromptStoriesText([response.data.subject.vocabluaryPrompt, response.data.subject.vocabluaryPrompt]);
          setPromptClosedSubtopicsText([response.data.subject.closedSubtopicsPrompt, response.data.subject.closedSubtopicsPrompt]);
          setPromptSubtopicsTextOwn(response.data.subject.subtopicsPromptOwn);
          setPromptQuestionTextOwn(response.data.subject.questionPromptOwn);
          setPromptSolutionTextOwn(response.data.subject.solutionPromptOwn);
          setPromptAnswersTextOwn(response.data.subject.answersPromptOwn);
          setPromptSubQuestionsTextOwn(response.data.subject.subQuestionsPromptOwn);
          setPromptStoriesTextOwn(response.data.subject.vocabluaryPromptOwn);
        } else {
          setTypeSubjectText(["", ""]);
          setSubjectName("");
          setSubjectPromptText(["", ""]);
          setPromptSubtopicsText(["", ""]);
          setPromptQuestionText(["", ""]);
          setPromptSolutionText(["", ""]);
          setPromptAnswersText(["", ""]);
          setPromptClosedSubtopicsText(["", ""]);
          setPromptSubQuestionsText(["", ""]);
          setPromptStoriesText(["", ""]);
          setPromptSubtopicsTextOwn(true);
          setPromptQuestionTextOwn(true);
          setPromptSolutionTextOwn(true);
          setPromptAnswersTextOwn(true);
          setPromptClosedSubtopicsTextOwn(true);
          setPromptSubQuestionsTextOwn(true);
          setPromptStoriesTextOwn(true);
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        setSubjectName("");
        setSubjectPromptText(["", ""]);
        setPromptSubtopicsText(["", ""]);
        setTypeSubjectText(["", ""]);
        setPromptQuestionText(["", ""]);
        setPromptSolutionText(["", ""]);
        setPromptAnswersText(["", ""]);
        setPromptClosedSubtopicsText(["", ""]);
        setPromptSubQuestionsText(["", ""]);
        setPromptStoriesText(["", ""]);
        setPromptSubtopicsTextOwn(true);
        setPromptQuestionTextOwn(true);
        setPromptSolutionTextOwn(true);
        setPromptAnswersTextOwn(true);
        setPromptClosedSubtopicsTextOwn(true);
        setPromptSubQuestionsTextOwn(true);
        setPromptStoriesTextOwn(true);
        handleApiError(error);
      } finally {
        setTimeout(() => {
          resetSpinner();
        }, 3000);
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
        prompt: subjectPromptText[0],
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
      }, 3000);
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
    const style = getComputedStyle(textarea);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.6;
    const paddingTop = parseFloat(style.paddingTop || "0");
    const paddingBottom = parseFloat(style.paddingBottom || "0");
    const totalPadding = paddingTop + paddingBottom;

    const rows = Math.ceil((textarea.scrollHeight - totalPadding) / lineHeight);
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

  function toggleClosedSubtopicsPromptTextareaSize() {
    if (promptClosedSubtopicsTextareaRef.current) {
      if (!promptClosedSubtopicsTextareaExpanded) {
        const rows = calculateRows(promptClosedSubtopicsTextareaRef.current);
        setPromptClosedSubtopicsTextareaRows(rows);
      } else {
        setPromptClosedSubtopicsTextareaRows(5);
      }
    }

    setPromptClosedSubtopicsTextareaExpanded(prev => !prev);
  }

  function toggleSubQuestionsPromptTextareaSize() {
    if (promptSubQuestionsTextareaRef.current) {
      if (!promptSubQuestionsTextareaExpanded) {
        const rows = calculateRows(promptSubQuestionsTextareaRef.current);
        setPromptSubQuestionsTextareaRows(rows);
      } else {
        setPromptSubQuestionsTextareaRows(5);
      }
    }

    setPromptSubQuestionsTextareaExpanded(prev => !prev);
  }

  function toggleStoriesPromptTextareaSize() {
    if (promptStoriesTextareaRef.current) {
      if (!promptStoriesTextareaExpanded) {
        const rows = calculateRows(promptStoriesTextareaRef.current);
        setPromptStoriesTextareaRows(rows);
      } else {
        setPromptStoriesTextareaRows(5);
      }
    }

    setPromptStoriesTextareaExpanded(prev => !prev);
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
      }, 3000);
    }
    catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
        resetSpinner();
      }, 3000);
    }
  }

  async function handleSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(false);
    await saveSubjectData();

    const successfulSections: string[] = [];

    try {
      const topicsResponse = await api.get<{ topics: Topic[] }>(`/subjects/${subjectId}/topics`);
      const topics = topicsResponse.data.topics;

      const sectionsMap = new Map<number, { name: string; topics: Topic[] }>();
      topics.forEach((topic: Topic) => {
        const sectionId = topic.section.id;
        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, { name: topic.section.name, topics: [] });
        }
        sectionsMap.get(sectionId)!.topics.push(topic);
      });

      for (const [sectionId, sectionData] of sectionsMap.entries()) {
        const sectionSubtopics: Subtopic[] = [];
        let sectionFailed = false;

        for (const topic of sectionData.topics) {
          showSpinner(true, `Generacja podtematów dla\nPrzedmiot: ${subjectName}\nRozdział: ${sectionData.name}\nTemat: ${topic.name}`);

          const topicId = topic.id;
          let changed = "true";
          let attempt = 0;
          let subtopics: [string, number][] = [];
          let errors: string[] = [];
          const prompt = topic.subtopicsPrompt;
          const MAX_ATTEMPTS = 2;

          while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const subtopicsResponse = await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/generate`, {
              changed,
              subtopics,
              errors,
              attempt,
              prompt
            });

            if (subtopicsResponse.data?.statusCode === 201) {
              changed = subtopicsResponse.data.changed;
              subtopics = subtopicsResponse.data.subtopics;
              errors = subtopicsResponse.data.errors;
              attempt = subtopicsResponse.data.attempt;
            } else {
              showAlert(400, `Nie udało się wygenerować podtematów dla\nPrzedmiot: ${subjectName}\nRozdział: ${sectionData.name}\nTemat: ${topic.name}`);
              sectionFailed = true;
              break;
            }
          }

          if (
            subtopics.length === 0 ||
            subtopics.some(
              s =>
                !Array.isArray(s) ||
                s.length !== 2 ||
                typeof s[0] !== "string" ||
                s[0].trim() === "" ||
                typeof s[1] !== "number"
            )
          ) {
            showAlert(400, `Nie udało się poprawnie wygenerować podtematów dla\nPrzedmiot: ${subjectName}\nRozdział: ${sectionData.name}\nTemat: ${topic.name}`);
            sectionFailed = true;
            break;
          }

          sectionSubtopics.push({
            subjectId,
            sectionId,
            topicId,
            subtopics
          });
        }

        if (!sectionFailed && sectionSubtopics.length > 0) {
          await api.post(`/options/subtopics`, { subtopics: sectionSubtopics });
          successfulSections.push(sectionData.name);
        } else {
          const successMsg = successfulSections.length
            ? formatSuccessSections(successfulSections, subjectName)
            : `Nie zapisano żadnego rozdziału przedmiotu ${subjectName}`;
          showAlert(400, successMsg);

          resetSpinner();
          return;
        }
      }

      const successMsg = successfulSections.length
        ? `Poprawnie zapisano wszystkie działy przedmiotu ${subjectName}`
        : `Brak zapisanych rozdziałów przedmiotu ${subjectName}`;
      const statusCode = successfulSections.length > 0 ? 200 : 400;
      showAlert(statusCode, successMsg);

      setTimeout(() => {
        resetSpinner();
        window.location.reload();
      }, 3000);

    } catch (error: unknown) {
      handleApiError(error);

      const successMsg = successfulSections.length
        ? formatSuccessSections(successfulSections, subjectName)
        : `Nie zapisano żadnego rozdziału przedmiotu ${subjectName}`;
      showAlert(400, successMsg);

      setTimeout(() => resetSpinner(), 3000);
    }
  }

  function formatSuccessSections(
    sections: string[],
    subjectName: string
  ): React.ReactNode {
    if (sections.length === 1) {
      return <div>Poprawnie zapisano dział {sections[0]} przedmiotu {subjectName}</div>;
    } else if (sections.length === 2) {
      return (
        <div style={{ whiteSpace: "pre-line" }}>
          Poprawnie zapisano działy przedmiotu {subjectName}:
          <br /><br />
          {sections[0]}
          <br />
          {sections[1]}
        </div>
      );
    } else {
      return (
        <div style={{ whiteSpace: "pre-line" }}>
          Poprawnie zapisano działy przedmiotu {subjectName}:
          <br /><br />
          {sections[0]}
          <br />
          ...
          <br />
          {sections[sections.length - 1]}
        </div>
      );
    }
  }

  async function saveSubjectData(data = {
    type: typeSubjectText,
    prompt: subjectPromptText,
    subtopicsPrompt: promptSubtopicsText,
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    answersPrompt: promptAnswersText,
    closedSubtopicsPrompt: promptClosedSubtopicsText,
    subQuestionsPrompt: promptSubQuestionsText,
    vocabluaryPrompt: promptStoriesText
  }) {
    try {
      const processedData = {
        type: (Array.isArray(data.type) && data.type[0] !== data.type[1]) ? data.type[0] : undefined,
        prompt: (Array.isArray(data.prompt) && data.prompt[0] !== data.prompt[1]) ? data.prompt[0] : undefined,
        subtopicsPrompt: (Array.isArray(data.subtopicsPrompt) && data.subtopicsPrompt[0] !== data.subtopicsPrompt[1]) ? data.subtopicsPrompt[0] : undefined,
        questionPrompt: (Array.isArray(data.questionPrompt) && data.questionPrompt[0] !== data.questionPrompt[1]) ? data.questionPrompt[0] : undefined,
        solutionPrompt: (Array.isArray(data.solutionPrompt) && data.solutionPrompt[0] !== data.solutionPrompt[1]) ? data.solutionPrompt[0] : undefined,
        answersPrompt: (Array.isArray(data.answersPrompt) && data.answersPrompt[0] !== data.answersPrompt[1]) ? data.answersPrompt[0] : undefined,
        closedSubtopicsPrompt: (Array.isArray(data.closedSubtopicsPrompt) && data.closedSubtopicsPrompt[0] !== data.closedSubtopicsPrompt[1]) ? data.closedSubtopicsPrompt[0] : undefined,
        subQuestionsPrompt: (Array.isArray(data.subQuestionsPrompt) && data.subQuestionsPrompt[0] !== data.subQuestionsPrompt[1]) ? data.subQuestionsPrompt[0] : undefined,
        vocabluaryPrompt: (Array.isArray(data.vocabluaryPrompt) && data.vocabluaryPrompt[0] !== data.vocabluaryPrompt[1]) ? data.vocabluaryPrompt[0] : undefined,
      };

      return await api.put(`/subjects/${subjectId}`, processedData);
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
            <div>
              <Spinner text={spinnerText} />
            </div>
          ) : (
            <>
              <div className="options-container">
                <label htmlFor="subjectType" className="label">Typ Przedmoitu:</label>
                <input
                    id="subjectType"
                    name="text-container"
                    value={typeSubjectText[0]}
                    onInput={(e) => {
                      setTypeSubjectText([(e.target as HTMLTextAreaElement).value, typeSubjectText[1]]);
                    }}
                    className={`text-container own ${(typeSubjectText[0] !== typeSubjectText[1]) ? ' changed' : ''}`}
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
                <label htmlFor="promptQuestion" className="label">Tekst Zadania:</label>
                <textarea
                  id="promptQuestion"
                  rows={promptQuestionTextareaRows}
                  ref={promptQuestionTextareaRef}
                  name="text-container"
                  value={promptQuestionText[0]}
                  onInput={(e) => {
                    setPromptQuestionText([(e.target as HTMLTextAreaElement).value, promptQuestionText[1]]);
                  }}
                  className={`text-container ${promptQuestionTextOwn ? "own" : ""} ${(promptQuestionText[0] !== promptQuestionText[1]) ? ' changed' : ''}`}
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
                <label htmlFor="promptSolution" className="label">Rozwiązanie Zadania:</label>
                <textarea
                  id="promptSolution"
                  rows={promptSolutionTextareaRows}
                  ref={promptSolutionTextareaRef}
                  name="text-container"
                  value={promptSolutionText[0]}
                  onInput={(e) => {
                    setPromptSolutionText([(e.target as HTMLTextAreaElement).value, promptSolutionText[1]]);
                  }}
                  className={`text-container ${promptSolutionTextOwn ? "own" : ""} ${(promptSolutionText[0] !== promptSolutionText[1]) ? ' changed' : ''}`}
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
                <label htmlFor="promptAnswers" className="label">Warianty Zadania:</label>
                <textarea
                  id="promptAnswers"
                  rows={promptAnswersTextareaRows}
                  ref={promptAnswersTextareaRef}
                  name="text-container"
                  value={promptAnswersText[0]}
                  onInput={(e) => {
                    setPromptAnswersText([(e.target as HTMLTextAreaElement).value, promptAnswersText[1]]);
                  }}
                  className={`text-container ${promptAnswersTextOwn ? "own" : ""} ${(promptAnswersText[0] !== promptAnswersText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt warianty odpowiedzi..."
                />
              </div>
              <div className="options-container">
                {promptClosedSubtopicsTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleClosedSubtopicsPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleClosedSubtopicsPromptTextareaSize}
                  />
                }
                <label htmlFor="promptClosedSubtopics" className="label">Procenty Podtematów:</label>
                <textarea
                  id="promptClosedSubtopics"
                  rows={promptClosedSubtopicsTextareaRows}
                  ref={promptClosedSubtopicsTextareaRef}
                  name="text-container"
                  value={promptClosedSubtopicsText[0]}
                  onInput={(e) => {
                    setPromptClosedSubtopicsText([(e.target as HTMLTextAreaElement).value, promptClosedSubtopicsText[1]])
                  }}
                  className={`text-container ${promptClosedSubtopicsTextOwn ? "own" : ""} ${(promptClosedSubtopicsText[0] !== promptClosedSubtopicsText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt zamykania podtematów..."
                />
              </div>
              {typeSubjectText[0] == "Language" ? (<div className="options-container">
                {promptSubQuestionsTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSubQuestionsPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSubQuestionsPromptTextareaSize}
                  />
                }
                <label htmlFor="promptSubQuestions" className="label">Pytania Etapowe:</label>
                <textarea
                  id="promptSubQuestions"
                  rows={promptSubQuestionsTextareaRows}
                  ref={promptSubQuestionsTextareaRef}
                  name="text-container"
                  value={promptSubQuestionsText[0]}
                  onInput={(e) => {
                    setPromptSubQuestionsText([(e.target as HTMLTextAreaElement).value, promptSubQuestionsText[1]])
                  }}
                  className={`text-container ${promptSubQuestionsTextOwn ? "own" : ""} ${(promptSubQuestionsText[0] !== promptSubQuestionsText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt pytań etapowych..."
                />
              </div>) : null}
              {typeSubjectText[0] == "Language" ? (<div className="options-container">
                {promptStoriesTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleStoriesPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleStoriesPromptTextareaSize}
                  />
                }
                <label htmlFor="promptStories" className="label">Słownictwo:</label>
                <textarea
                  id="promptStories"
                  rows={promptStoriesTextareaRows}
                  ref={promptStoriesTextareaRef}
                  name="text-container"
                  value={promptStoriesText[0]}
                  onInput={(e) => {
                    setPromptStoriesText([(e.target as HTMLTextAreaElement).value, promptStoriesText[1]])
                  }}
                  className={`text-container ${promptStoriesTextOwn ? "own" : ""} ${(promptStoriesText[0] !== promptStoriesText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt słownictwa..."
                />
              </div>) : null}
              <div style={{ margin: "4px 0px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageSaveSubjectData}
                >
                  Zapisz
                </button>
              </div>
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
                  value={subjectPromptText[0]}
                  onInput={(e) => {
                    setSubjectPromptText([(e.target as HTMLTextAreaElement).value, subjectPromptText[1]]);
                  }}
                  className={`text-container own ${(subjectPromptText[0] !== subjectPromptText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt dla treści..."
                />
              </div>
              <div style={{ margin: "4px 0px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessagePlanGenerate}
                >
                  Generuj Treść
                </button>
              </div>
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
                <label htmlFor="subjectSubtopics" className="label">Podtematy:</label>
                <textarea
                  id="subjectSubtopics"
                  rows={promptSubtopicsTextareaRows}
                  ref={promptSubtopicsTextareaRef}
                  name="text-container"
                  value={promptSubtopicsText[0]}
                  onInput={(e) => {
                    setPromptSubtopicsText([(e.target as HTMLTextAreaElement).value, promptSubtopicsText[1]]);
                  }}
                  className={`text-container ${promptSubtopicsTextOwn ? "own" : ""} ${(promptSubtopicsText[0] !== promptSubtopicsText[1]) ? ' changed' : ''}`}
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