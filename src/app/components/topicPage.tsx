'use client';

import "@/app/styles/components.css";
import "@/app/styles/formTable.css";
import "@/app/styles/main.css";
import { useState, useEffect, useRef } from "react";
import api from "@/app/utils/api";
import showAlert from "@/app/scripts/showAlert";
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

  const [promptQuestionText, setPromptQuestionText] = useState("");
  const [promptSolutionText, setPromptSolutionText] = useState("");
  const [promptAnswersText, setPromptAnswersText] = useState("");

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
    setSubtopicId(-1);

    async function fetchSubtopics() {
      if (subjectId === -1 || sectionId === -1 || topicId === -1) {
        setSubjectName("");
        setSectionName("");
        setTopicName("");
        setPromptQuestionText("");
        setPromptSolutionText("");
        setPromptAnswersText("");
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
        }, 1000);
      }
    }

    async function fetchTopicPromptById() {
      if (subjectId === -1 || sectionId === -1 || topicId === -1) {
        setSubjectName("");
        setSectionName("");
        setTopicName("");
        setPromptQuestionText("");
        setPromptSolutionText("");
        setPromptAnswersText("");
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
          setPromptQuestionText(response.data.topic.questionPrompt);
          setPromptSolutionText(response.data.topic.solutionPrompt);
          setPromptAnswersText(response.data.topic.answersPrompt);
        } else {
          setSectionName("");
          setSubjectName("");
          setTopicName("");
          setPromptQuestionText("");
          setPromptSolutionText("");
          setPromptAnswersText("");
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
        handleApiError(error);
      } finally {
        setTimeout(() => {
          resetSpinner();
        }, 1000);
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
        }, 1000);
    }
    catch (error: unknown) {
        handleApiError(error);
            setTimeout(() => {
            resetSpinner();
        }, 1000);
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

  async function handleSaveTopicData() {
    setMsgTopicDataVisible(false);
    showSpinner(true, "Trwa zapisywanie danych...");

    try {
      const response = await saveTopicData();

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

  async function saveTopicData(data = {
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    answersPrompt: promptAnswersText
  }) {
    try {
      return await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, data);
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

        <div className={spinnerVisible ? "container-center" : ""}>
          {spinnerVisible ? (
            <div className="spinner-wrapper">
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
                  onClick={handleOpenMessageSaveTopicData}
                >
                  Zapisz
                </button>
              </div>
              <br />
              <div className="formTable">
              <div
                className="element elementTitle"
              >
                <div>Podtematy</div>
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