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

type SectionPageProps = {
  subjectId: number;
  sectionId: number;
};

type Subtopic = {
  topicId: number;
  subjectId: number;
  sectionId: number;
  subtopics: [string, number][];
};

export default function SectionPage({ subjectId, sectionId }: SectionPageProps) {
  const [typeSectionText, setTypeSectionText] = useState(["", ""]);
  const [promptSubtopicsText, setPromptSubtopicsText] = useState(["", ""]);
  const [promptQuestionText, setPromptQuestionText] = useState(["", ""]);
  const [promptSolutionText, setPromptSolutionText] = useState(["", ""]);
  const [promptAnswersText, setPromptAnswersText] = useState(["", ""]);
  const [promptClosedSubtopicsText, setPromptClosedSubtopicsText] = useState(["", ""]);
  const [promptSubQuestionsText, setPromptSubQuestionsText] = useState(["", ""]);
  const [promptVocabluaryText, setPromptVocabluaryText] = useState(["", ""]);
  const [subjectName, setSubjectName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [msgSectionDataVisible, setMsgSectionDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const promptSubtopicsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubtopicsTextareaExpanded, setPromptSubtopicsTextareaExpanded] = useState(false);
  const [promptSubtopicsTextareaRows, setPromptSubtopicsTextareaRows] = useState(5);

  const [promptSubtopicsTextOwn, setPromptSubtopicsTextOwn] = useState(true);
  const [promptQuestionTextOwn, setPromptQuestionTextOwn] = useState(true);
  const [promptSolutionTextOwn, setPromptSolutionTextOwn] = useState(true);
  const [promptAnswersTextOwn, setPromptAnswersTextOwn] = useState(true);
  const [promptClosedSubtopicsTextOwn, setPromptClosedSubtopicsTextOwn] = useState(true);
  const [promptSubQuestionsTextOwn, setPromptSubQuestionsTextOwn] = useState(true);
  const [promptVocabluaryTextOwn, setPromptVocabluaryTextOwn] = useState(true);

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

  const promptVocabluaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptVocabluaryTextareaExpanded, setPromptVocabluaryTextareaExpanded] = useState(false);
  const [promptVocabluaryTextareaRows, setPromptVocabluaryTextareaRows] = useState(5);

  useEffect(() => {
    async function fetchSectionPromptById() {
      if (subjectId === -1 || sectionId === -1) {
        setSubjectName("");
        setSectionName("");
        setPromptQuestionText(["", ""]);
        setPromptSolutionText(["", ""]);
        setPromptAnswersText(["", ""]);
        setPromptClosedSubtopicsText(["", ""]);
        setPromptSubtopicsText(["", ""]);
        setTypeSectionText(["", ""]);
        setPromptSubQuestionsText(["", ""]);
        setPromptVocabluaryText(["", ""]);
        setPromptSubtopicsTextOwn(true);
        setPromptQuestionTextOwn(true);
        setPromptSolutionTextOwn(true);
        setPromptAnswersTextOwn(true);
        setPromptClosedSubtopicsTextOwn(true);
        setPromptSubQuestionsTextOwn(true);
        setPromptVocabluaryTextOwn(true);
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}?withTopics=false&withSubtopics=false`);
        if (response.data?.statusCode === 200) {
          setSubjectName(response.data.subject.name);
          setSectionName(response.data.section.name);
          setTypeSectionText([response.data.section.type, response.data.section.type]);
          setPromptSubtopicsText([response.data.section.subtopicsPrompt, response.data.section.subtopicsPrompt]);
          setPromptQuestionText([response.data.section.questionPrompt, response.data.section.questionPrompt]);
          setPromptSolutionText([response.data.section.solutionPrompt, response.data.section.solutionPrompt]);
          setPromptAnswersText([response.data.section.answersPrompt, response.data.section.answersPrompt]);
          setPromptClosedSubtopicsText([response.data.section.closedSubtopicsPrompt, response.data.section.closedSubtopicsPrompt]);
          setPromptSubQuestionsText([response.data.section.subQuestionsPrompt, response.data.section.subQuestionsPrompt]);
          setPromptVocabluaryText([response.data.section.vocabluaryPrompt, response.data.section.vocabluaryPrompt]);
          setPromptSubtopicsTextOwn(response.data.section.subtopicsPromptOwn);
          setPromptQuestionTextOwn(response.data.section.questionPromptOwn);
          setPromptSolutionTextOwn(response.data.section.solutionPromptOwn);
          setPromptAnswersTextOwn(response.data.section.answersPromptOwn);
          setPromptClosedSubtopicsTextOwn(response.data.section.closedSubtopicsPromptOwn);
          setPromptSubQuestionsTextOwn(response.data.section.subQuestionsPromptOwn);
          setPromptVocabluaryTextOwn(response.data.section.vocabluaryPromptOwn);
        } else {
          setSectionName("");
          setTypeSectionText(["", ""]);
          setSubjectName("");
          setPromptSubtopicsText(["", ""]);
          setPromptQuestionText(["", ""]);
          setPromptSolutionText(["", ""]);
          setPromptAnswersText(["", ""]);
          setPromptClosedSubtopicsText(["", ""]);
          setPromptSubQuestionsText(["", ""]);
          setPromptVocabluaryText(["", ""]);
          setPromptSubtopicsTextOwn(true);
          setPromptQuestionTextOwn(true);
          setPromptSolutionTextOwn(true);
          setPromptAnswersTextOwn(true);
          setPromptClosedSubtopicsTextOwn(true);
          setPromptSubQuestionsTextOwn(true);
          setPromptVocabluaryTextOwn(true);
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        setSectionName("");
        setSubjectName("");
        setPromptSubtopicsText(["", ""]);
        setTypeSectionText(["", ""]);
        setPromptQuestionText(["", ""]);
        setPromptSolutionText(["", ""]);
        setPromptAnswersText(["", ""]);
        setPromptClosedSubtopicsText(["", ""]);
        setPromptSubQuestionsText(["", ""]);
        setPromptVocabluaryText(["", ""]);
        setPromptSubtopicsTextOwn(true);
        setPromptQuestionTextOwn(true);
        setPromptSolutionTextOwn(true);
        setPromptAnswersTextOwn(true);
        setPromptClosedSubtopicsTextOwn(true);
        setPromptSubQuestionsTextOwn(true);
        setPromptVocabluaryTextOwn(true);
        handleApiError(error);
      } finally {
        setTimeout(() => {
          resetSpinner();
        }, 3000);
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
    const style = getComputedStyle(textarea);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.6;
    const paddingTop = parseFloat(style.paddingTop || "0");
    const paddingBottom = parseFloat(style.paddingBottom || "0");
    const totalPadding = paddingTop + paddingBottom;

    const rows = Math.ceil((textarea.scrollHeight - totalPadding) / lineHeight);
    return rows;
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

  function toggleVocabluaryPromptTextareaSize() {
    if (promptVocabluaryTextareaRef.current) {
      if (!promptVocabluaryTextareaExpanded) {
        const rows = calculateRows(promptVocabluaryTextareaRef.current);
        setPromptVocabluaryTextareaRows(rows);
      } else {
        setPromptVocabluaryTextareaRows(5);
      }
    }

    setPromptVocabluaryTextareaExpanded(prev => !prev);
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

    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      const allSubtopics: Subtopic[] = [];

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja podtematów przedmiotu ${subjectName}, rozdziału ${topicsResponse.data.section.name}, tematu ${topicsResponse.data.topics[i].name}...`);
        
        let changed: string = "true";
        let attempt: number = 0;
        let subtopics: [string, number][] = [];
        let errors: string[] = [];
        const prompt: string = topicsResponse.data.topics[i].subtopicsPrompt;
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
            console.log(`Temat ${topicsResponse.data.topics[i].name}: Próba ${attempt}`);
          }
          else {
            showAlert(400, `Nie udało się zgenerować podtamaty przedmiotu ${subjectName}, rozdziału ${topicsResponse.data.section.name}, tematu ${topicsResponse.data.topics[i].name}`);
            break;
          }
        }

        if (
          subtopics.length === 0 ||
          subtopics.some(s => 
            !Array.isArray(s) || 
            s.length !== 2 || 
            typeof s[0] !== 'string' || 
            s[0].trim() === '' || 
            typeof s[1] !== 'number'
          )
        ) {
          showAlert(
            400, 
            `Nie udało się poprawnie wygenerować podtematów dla tematu ${topicsResponse.data.topics[i].name}`
          );
          continue;
        }

        allSubtopics.push({
          subjectId: subjectId,
          sectionId: sectionId,
          topicId: topicId,
          subtopics: subtopics
        })
      }

      await api.post(`/options/subtopics`, {
        subtopics: allSubtopics
      });

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

  async function saveSectionData(data = {
    type: typeSectionText,
    subtopicsPrompt: promptSubtopicsText,
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    answersPrompt: promptAnswersText,
    closedSubtopicsPrompt: promptClosedSubtopicsText,
    subQuestionsPrompt: promptSubQuestionsText,
    vocabluaryPrompt: promptVocabluaryText
  }) {
    try {
      const processedData = {
        type: (Array.isArray(data.type) && data.type[0] !== data.type[1]) ? data.type[0] : undefined,
        subtopicsPrompt: (Array.isArray(data.subtopicsPrompt) && data.subtopicsPrompt[0] !== data.subtopicsPrompt[1]) ? data.subtopicsPrompt[0] : undefined,
        questionPrompt: (Array.isArray(data.questionPrompt) && data.questionPrompt[0] !== data.questionPrompt[1]) ? data.questionPrompt[0] : undefined,
        solutionPrompt: (Array.isArray(data.solutionPrompt) && data.solutionPrompt[0] !== data.solutionPrompt[1]) ? data.solutionPrompt[0] : undefined,
        answersPrompt: (Array.isArray(data.answersPrompt) && data.answersPrompt[0] !== data.answersPrompt[1]) ? data.answersPrompt[0] : undefined,
        closedSubtopicsPrompt: (Array.isArray(data.closedSubtopicsPrompt) && data.closedSubtopicsPrompt[0] !== data.closedSubtopicsPrompt[1]) ? data.closedSubtopicsPrompt[0] : undefined,
        subQuestionsPrompt: (Array.isArray(data.subQuestionsPrompt) && data.subQuestionsPrompt[0] !== data.subQuestionsPrompt[1]) ? data.subQuestionsPrompt[0] : undefined,
        vocabluaryPrompt: (Array.isArray(data.vocabluaryPrompt) && data.vocabluaryPrompt[0] !== data.vocabluaryPrompt[1]) ? data.vocabluaryPrompt[0] : undefined,
      };

      return await api.put(`/subjects/${subjectId}/sections/${sectionId}`, processedData);
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
                <label htmlFor="SectionType" className="label">Typ Rozdziału:</label>
                <input
                    id="SectionType"
                    name="text-container"
                    value={typeSectionText[0]}
                    onInput={(e) => {
                      setTypeSectionText([(e.target as HTMLTextAreaElement).value, typeSectionText[1]])
                    }}
                    className={`text-container own ${(typeSectionText[0] !== typeSectionText[1]) ? ' changed' : ''}`}
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
                <label htmlFor="promptQuestion" className="label">Tekst Zadania:</label>
                <textarea
                  id="promptQuestion"
                  rows={promptQuestionTextareaRows}
                  ref={promptQuestionTextareaRef}
                  name="text-container"
                  value={promptQuestionText[0]}
                  onInput={(e) => {
                    console.log(promptQuestionTextOwn);
                    setPromptQuestionText([(e.target as HTMLTextAreaElement).value, promptQuestionText[1]])
                  }}
                  className={`text-container ${promptQuestionTextOwn ? "own" : ""} ${(promptQuestionText[0] !== promptQuestionText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt tekst zadania..."
                />
              </div>
              {typeSectionText[0] != "InteractiveQuestion" ? (<div className="options-container">
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
                    setPromptSolutionText([(e.target as HTMLTextAreaElement).value, promptSolutionText[1]])
                  }}
                  className={`text-container ${promptSolutionTextOwn ? "own" : ""} ${(promptSolutionText[0] !== promptSolutionText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt rozwiązanie..."
                />
              </div>) : null}
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
                    setPromptAnswersText([(e.target as HTMLTextAreaElement).value, promptAnswersText[1]])
                  }}
                  className={`text-container ${promptAnswersTextOwn ? "own" : ""} ${(promptAnswersText[0] !== promptAnswersText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt warianty odpowiedzi..."
                />
              </div>
              {typeSectionText[0] != "InteractiveQuestion" ? (<div className="options-container">
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
              </div>) : null}
              {typeSectionText[0] == "InteractiveQuestion" ? (<div className="options-container">
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
              {typeSectionText[0] == "InteractiveQuestion" ? (<div className="options-container">
                {promptVocabluaryTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleVocabluaryPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleVocabluaryPromptTextareaSize}
                  />
                }
                <label htmlFor="promptVocabluary" className="label">Słownictwo:</label>
                <textarea
                  id="promptVocabluary"
                  rows={promptVocabluaryTextareaRows}
                  ref={promptVocabluaryTextareaRef}
                  name="text-container"
                  value={promptVocabluaryText[0]}
                  onInput={(e) => {
                    setPromptVocabluaryText([(e.target as HTMLTextAreaElement).value, promptVocabluaryText[1]])
                  }}
                  className={`text-container ${promptVocabluaryTextOwn ? "own" : ""} ${(promptVocabluaryText[0] !== promptVocabluaryText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt słownictwa..."
                />
              </div>) : null}
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
              {typeSectionText[0] != "InteractiveQuestion" ? (<>
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
                <label htmlFor="SectionSubtopics" className="label">Podtematy:</label>
                <textarea
                  id="SectionSubtopics"
                  rows={promptSubtopicsTextareaRows}
                  ref={promptSubtopicsTextareaRef}
                  name="text-container"
                  value={promptSubtopicsText[0]}
                  onInput={(e) => {
                    setPromptSubtopicsText([(e.target as HTMLTextAreaElement).value, promptSubtopicsText[1]])
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
              </>): null}
            </>
          )}
        </div>
      </main>
    </>
  );
}