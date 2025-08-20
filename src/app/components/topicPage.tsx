'use client';

import "@/app/styles/components.css";
import "@/app/styles/formTable.css";
import "@/app/styles/main.css";
import { useState, useEffect, useRef } from "react";
import api from "@/app/utils/api";
import { showAlert } from "@/app/scripts/showAlert";
import axios from "axios";
import Spinner from "@/app/components/spinner";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import Message from "./message";
import FormatText from "./formatText";

type TopicPageProps = {
  subjectId: number;
  sectionId: number;
  topicId: number;
};

type Subtopic = {
  topicId: number;
  subjectId: number;
  sectionId: number;
  subtopics: [string, number][];
};

export default function TopicPage({ subjectId, sectionId, topicId }: TopicPageProps) {
  const router = useRouter();
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const [subtopics, setSubtopics] = useState([]);
  const [msgSubtopicDeleteVisible, setMsgSubtopicDeleteVisible] = useState(false);
  const [msgTopicDataVisible, setMsgTopicDataVisible] = useState(false);
  const [subtopicId, setSubtopicId] = useState(-1);

  const [subjectName, setSubjectName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [topicName, setTopicName] = useState("");

  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);

  const [promptQuestionText, setPromptQuestionText] = useState(["", ""]);
  const [promptSolutionText, setPromptSolutionText] = useState(["", ""]);
  const [promptAnswersText, setPromptAnswersText] = useState(["", ""]);
  const [promptClosedSubtopicsText, setPromptClosedSubtopicsText] = useState(["", ""]);
  const [promptSubtopicsText, setPromptSubtopicsText] = useState(["", ""]);

  const [promptSubtopicsTextOwn, setPromptSubtopicsTextOwn] = useState(true);
  const [promptQuestionTextOwn, setPromptQuestionTextOwn] = useState(true);
  const [promptSolutionTextOwn, setPromptSolutionTextOwn] = useState(true);
  const [promptAnswersTextOwn, setPromptAnswersTextOwn] = useState(true);
  const [promptClosedSubtopicsTextOwn, setPromptClosedSubtopicsTextOwn] = useState(true);

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
  
  useEffect(() => {
    setSubtopicId(-1);

    async function fetchSubtopics() {
      if (subjectId === -1 || sectionId === -1 || topicId === -1) {
        setSubjectName("");
        setSectionName("");
        setTopicName("");
        setPromptQuestionText(["", ""]);
        setPromptSolutionText(["", ""]);
        setPromptAnswersText(["", ""]);
        setPromptClosedSubtopicsText(["", ""]);
        setPromptSubtopicsText(["", ""]);
        setPromptSubtopicsTextOwn(true);
        setPromptQuestionTextOwn(true);
        setPromptSolutionTextOwn(true);
        setPromptAnswersTextOwn(true);
        setPromptClosedSubtopicsTextOwn(true);
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics`);
        
        if (response.data?.statusCode === 200) {
          setSubtopics(response.data.subtopics);
        }
        else {
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        handleApiError(error);
      } finally {
        setTimeout(() => {
          resetSpinner();
        }, 3000);
      }
    }

    async function fetchTopicPromptById() {
      if (subjectId === -1 || sectionId === -1 || topicId === -1) {
        setSubjectName("");
        setSectionName("");
        setTopicName("");
        setPromptQuestionText(["", ""]);
        setPromptSolutionText(["", ""]);
        setPromptAnswersText(["", ""]);
        setPromptClosedSubtopicsText(["", ""]);
        setPromptSubtopicsText(["", ""]);
        setPromptSubtopicsTextOwn(true);
        setPromptQuestionTextOwn(true);
        setPromptSolutionTextOwn(true);
        setPromptAnswersTextOwn(true);
        setPromptClosedSubtopicsTextOwn(true);
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);
        
        if (response.data?.statusCode === 200) {
          setSubjectName(response.data.subject.name);
          setSectionName(response.data.section.name);
          setTopicName(response.data.topic.name);
          setPromptQuestionText([response.data.topic.questionPrompt, response.data.topic.questionPrompt]);
          setPromptSolutionText([response.data.topic.solutionPrompt, response.data.topic.solutionPrompt]);
          setPromptAnswersText([response.data.topic.answersPrompt, response.data.topic.answersPrompt]);
          setPromptClosedSubtopicsText([response.data.topic.closedSubtopicsPrompt, response.data.topic.closedSubtopicsPrompt]);
          setPromptSubtopicsText([response.data.topic.subtopicsPrompt, response.data.topic.subtopicsPrompt]);
          setPromptSubtopicsTextOwn(response.data.topic.subtopicsPromptOwn);
          setPromptQuestionTextOwn(response.data.topic.questionPromptOwn);
          setPromptSolutionTextOwn(response.data.topic.solutionPromptOwn);
          setPromptAnswersTextOwn(response.data.topic.answersPromptOwn);
          setPromptClosedSubtopicsTextOwn(response.data.topic.closedSubtopicsPromptOwn);
      } else {
          setSectionName("");
          setSubjectName("");
          setTopicName("");
          setPromptQuestionText(["", ""]);
          setPromptSolutionText(["", ""]);
          setPromptAnswersText(["", ""]);
          setPromptClosedSubtopicsText(["", ""]);
          setPromptSubtopicsText(["", ""]);
          setPromptSubtopicsTextOwn(true);
          setPromptQuestionTextOwn(true);
          setPromptSolutionTextOwn(true);
          setPromptAnswersTextOwn(true);
          setPromptClosedSubtopicsTextOwn(true);
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        handleApiError(error);
      } finally {
        setTimeout(() => {
          resetSpinner();
        }, 3000);
      }
    }

    fetchTopicPromptById();
    fetchSubtopics();
  }, [subjectId, sectionId, topicId]);

  function showSpinner(visible: boolean, text: string = "") {
    setSpinnerVisible(visible);
    setSpinnerText(text);
  }

  function resetSpinner() {
    setSpinnerVisible(false);
    setSpinnerText("");
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

  function handleAddSubtopic() {
    router.push("/add-subtopic");
  }

  function handleSubtopicDeleteMsgCancel() {
    setMsgSubtopicDeleteVisible(false);
  }

  async function handleDeleteSubtopic() {
    setMsgSubtopicDeleteVisible(false);

    showSpinner(true, "Trwa usuwanie podtematu...");
    
    try {
        const response = await api.delete(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/${subtopicId}`);

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

  function handleOpenMessageDeleteSubtopic(id: number) {
    setSubtopicId(id);
    setMsgSubtopicDeleteVisible(true);
  }

  function handleOpenMessageSaveTopicData() {
    setMsgTopicDataVisible(true);
  }

  function handleTopicSaveDataMsgCancel() {
    setMsgTopicDataVisible(false);
  }

  function calculateRows(textarea: HTMLTextAreaElement): number {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || "210");
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop || "0");
    const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom || "0");
    const totalPadding = paddingTop + paddingBottom;

    const rows = Math.floor((textarea.scrollHeight - totalPadding) / lineHeight);
    return rows;
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

  async function handleSaveTopicData() {
    setMsgTopicDataVisible(false);
    showSpinner(true, "Trwa zapisywanie danych...");

    try {
      const response = await saveTopicData();

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

  function handleSubtopicsPromptMsgCancel() {
    setMsgSubtopicsPromptVisible(false);
  }

  async function handleSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(false);

    await saveTopicData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);

      const allSubtopics: Subtopic[] = [];

      const topics = [];
      topics.push(topicsResponse.data.topic);

      for (let i = 0; i < topics.length; i++) {
        showSpinner(true, `Trwa generacja podtematów przedmiotu ${subjectName}, rozdziału ${sectionName}, tematu ${topicName}...`);
        
        let changed: string = "true";
        let attempt: number = 0;
        let subtopics: [string, number][] = [];
        let errors: string[] = [];
        const prompt: string = topics[i].subtopicsPrompt;
        const MAX_ATTEMPTS = 10;

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
            console.log(`Temat ${topics[i].name}: Próba ${attempt}`);
          }
          else {
            showAlert(400, `Nie udało się zgenerować podtamaty przedmiotu ${subjectName}, rozdziału ${sectionName}, tematu ${topicName}`);
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

  function handleOpenMessageSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(true);
  }

  async function saveTopicData(data = {
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    subtopicsPrompt: promptSubtopicsText,
    answersPrompt: promptAnswersText,
    closedSubtopicsPrompt: promptClosedSubtopicsText
  }) {
    try {
      const processedData = {
        subtopicsPrompt: (Array.isArray(data.subtopicsPrompt) && data.subtopicsPrompt[0] !== data.subtopicsPrompt[1]) ? data.subtopicsPrompt[0] : undefined,
        questionPrompt: (Array.isArray(data.questionPrompt) && data.questionPrompt[0] !== data.questionPrompt[1]) ? data.questionPrompt[0] : undefined,
        solutionPrompt: (Array.isArray(data.solutionPrompt) && data.solutionPrompt[0] !== data.solutionPrompt[1]) ? data.solutionPrompt[0] : undefined,
        answersPrompt: (Array.isArray(data.answersPrompt) && data.answersPrompt[0] !== data.answersPrompt[1]) ? data.answersPrompt[0] : undefined,
        closedSubtopicsPrompt: (Array.isArray(data.closedSubtopicsPrompt) && data.closedSubtopicsPrompt[0] !== data.closedSubtopicsPrompt[1]) ? data.closedSubtopicsPrompt[0] : undefined,
      };

      return await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, processedData);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  return (
    <>
      <main>
        <Message 
            message={`Czy na pewno chcesz usunąć dany podtemat?`}
            textConfirm="Tak"
            textCancel="Nie"
            onConfirm={handleDeleteSubtopic}
            onClose={handleSubtopicDeleteMsgCancel}
            visible={msgSubtopicDeleteVisible}
        />

        <Message 
          message={`Czy na pewno chcesz zapisać dane dla przedmiotu ${subjectName}, rozdziału ${sectionName}, tematu ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSaveTopicData}
          onClose={handleTopicSaveDataMsgCancel}
          visible={msgTopicDataVisible}
        />

        <Message 
            message={`Czy na pewno chcesz ponownie wygenerować podtematy dla przedmiotu ${subjectName}, rozdziału ${sectionName}, tematu ${topicName}?`}
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
                    setPromptQuestionText([(e.target as HTMLTextAreaElement).value, promptQuestionText[1]])
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
                    setPromptSolutionText([(e.target as HTMLTextAreaElement).value, promptSolutionText[1]])
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
                    setPromptAnswersText([(e.target as HTMLTextAreaElement).value, promptAnswersText[1]])
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
                <label htmlFor="promptClosedSubtopics" className="label">Porcenty Podtematów:</label>
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
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageSaveTopicData}
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
                <label htmlFor="subjectSubtopics" className="label">Podtematy:</label>
                <textarea
                  id="subjectSubtopics"
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
              <br />
              <div className="formTable">
              <div
                className="element elementTitle"
              >
                <div>
                  Podtematy
                </div>
                <button
                  className="btnFormTableAdd"
                  onClick={handleAddSubtopic}
                >
                  <Plus size={28} />
              </button>
              </div>
                  {subtopics.map(({ id, name }) => (
                      <div className="element" key={id}>
                          <div>
                              <FormatText content={name} />
                          </div>
                          <button
                              id={id}
                              className="btnFormTable"
                              onClick={(e) => handleOpenMessageDeleteSubtopic(Number(e.currentTarget.id))}
                          >
                              <Trash2 size={28} />
                          </button>
                      </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}