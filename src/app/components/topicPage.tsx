'use client';

import "@/app/styles/components.css";
import "@/app/styles/formTable.css";
import "@/app/styles/main.css";
import { useState, useEffect, useRef } from "react";
import api from "@/app/utils/api";
import { showAlert } from "@/app/scripts/showAlert";
import axios from "axios";
import Spinner from "@/app/components/spinner";
import { ChevronDown, ChevronUp, Plus, Trash2, Edit } from "lucide-react";
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
  const [subjectType, setSubjectType] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionType, setSectionType] = useState("");
  const [topicName, setTopicName] = useState("");

  const [frequencyText, setFrequencyText] = useState([0, 0]);

  const promptLiteratureTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptLiteratureTextareaExpanded, setLiteratureTextareaExpanded] = useState(false);
  const [promptLiteratureTextareaRows, setLiteratureTextareaRows] = useState(5);

  const [promptNoteExpanded, setPromptNoteExpanded] = useState(false);
  const [noteHeight, setNoteHeight] = useState(100);
  const noteRef = useRef<HTMLDivElement>(null);

  const [literatureText, setLiteratureText] = useState(["", ""]);
  const [note, setNote] = useState("");

  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [msgTopicExpansionPromptVisible, setMsgTopicExpansionPromptVisible] = useState(false);

  useEffect(() => {
    setSubtopicId(-1);

    async function fetchSubtopics() {
      if (subjectId === -1 || sectionId === -1 || topicId === -1) {
        setSubjectName("");
        setSectionName("");
        setSectionType("");
        setTopicName("");
        setSubjectType("");
        setFrequencyText([0, 0]);
        setLiteratureText(["", ""]);
        setNote("");
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
        setSectionType("");
        setTopicName("");
        setSubjectType("");
        setFrequencyText([0, 0]);
        setLiteratureText(["", ""]);
        setNote("");
        resetSpinner();
        return;
      }

      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);

        if (response.data?.statusCode === 200) {
          setSubjectName(response.data.subject.name);
          setSectionName(response.data.section.name);
          setSectionType(response.data.section.type);
          setTopicName(response.data.topic.name);
          setSubjectType(response.data.subject.type);
          setLiteratureText([response.data.topic.literature, response.data.topic.literature]);
          setNote(response.data.topic.note);
          setFrequencyText([response.data.topic.frequency, response.data.topic.frequency]);
      } else {
          setSectionName("");
          setSubjectName("");
          setSectionType("");
          setTopicName("");
          setSubjectType("");
          setFrequencyText([0, 0]);
          setLiteratureText(["", ""]);
          setNote("");
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

  function handleSubtopicsPromptMsgCancel() {
    setMsgSubtopicsPromptVisible(false);
  }

  function handleTopicExpansionPromptMsgCancel() {
    setMsgTopicExpansionPromptVisible(false);
  }

  function handleAddSubtopic() {
    router.push("/add-subtopic");
  }

  function handleEditSubtopic(id: number) {
    localStorage.setItem("subtopicId", String(id));
    router.push("/edit-subtopic");
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
    const style = getComputedStyle(textarea);
    const fontSize = parseFloat(style.fontSize);
    const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.6;
    const paddingTop = parseFloat(style.paddingTop || "0");
    const paddingBottom = parseFloat(style.paddingBottom || "0");
    const totalPadding = paddingTop + paddingBottom;

    const rows = Math.ceil((textarea.scrollHeight - totalPadding) / lineHeight);
    return rows;
  }

  function toggleLiteratureTextareaSize() {
    if (promptLiteratureTextareaRef.current) {
      if (!promptLiteratureTextareaExpanded) {
        const rows = calculateRows(promptLiteratureTextareaRef.current);
        setLiteratureTextareaRows(rows);
      } else {
        setLiteratureTextareaRows(5);
      }
    }

    setLiteratureTextareaExpanded(prev => !prev);
  }

  function toggleNoteTextareaSize() {
    if (noteRef.current) {
      if (!promptNoteExpanded) {
        setNoteHeight(noteRef.current.scrollHeight);
      } else {
        setNoteHeight(100);
      }
    }
    setPromptNoteExpanded(prev => !prev);
  }

  function handleOpenMessageTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(true);
  }

  function handleOpenMessageSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(true);
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

  async function handleSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(false);

    await saveTopicData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);

      showSpinner(true, `Trwa generacja podtematów dla\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
      
      let changed: string = "true";
      let attempt: number = 0;
      let subtopics: [string, number][] = [];
      let errors: string[] = [];
      const prompt: string = topicsResponse.data.topic.subtopicsPrompt;
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
          console.log(`Temat ${topicsResponse.data.topic.name}: Próba ${attempt}`);
        }
        else {
          showAlert(400, `Nie udało się zgenerować podtamaty\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
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
          `Nie udało się poprawnie wygenerować podtematów dla tematu ${topicsResponse.data.topic.name}`
        );
      }

      await api.delete(
        `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics`
      );

      await api.post(
        `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/bulk`,
        { subtopics }
      );

      showAlert(200, `Podtematy zostały zapisane dla Rozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topic.name}`);

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

  async function handleTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(false);

    await saveTopicData();

    try {
      const topicResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);
      const topic = topicResponse.data.topic;

      showSpinner(true, `Trwa generacja właściwości tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);

      let changed: string = "true";
      let attempt: number = 0;
      let frequency: number = 0;
      let note: string = "";
      let errors: string[] = [];
      const prompt: string = topic.topicExpansionPrompt;
      const MAX_ATTEMPTS = 2;

      while (changed === "true" && attempt <= MAX_ATTEMPTS) {
        const topicExpansionResponse = await api.post(
          `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/topic-expansion-generate`,
          { changed, frequency, note, errors, attempt, prompt }
        );

        if (topicExpansionResponse.data?.statusCode === 201) {
          changed = topicExpansionResponse.data.changed;
          frequency = topicExpansionResponse.data.frequency;
          note = topicExpansionResponse.data.note;
          errors = topicExpansionResponse.data.errors;
          attempt = topicExpansionResponse.data.attempt;
          console.log(`Temat ${topic.name}: Próba ${attempt}`);
        } else {
          showAlert(400, `Nie udało się zgenerować właściwości tematu\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
          break;
        }
      }

      if (typeof frequency !== 'number' || typeof note !== 'string') {
        showAlert(400, `Nie udało się poprawnie wygenerować właściwości tematu dla tematu ${topicName}`);
        return;
      }

      await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, { note, frequency });

      showAlert(200, `Właściwości tematu zostały zapisane dla tematu ${topicName}`);

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

  async function saveTopicData(data = {
    literatureText: literatureText,
    frequencyText: frequencyText
  }) {
    try {
      const processedData = {
        literature: (Array.isArray(data.literatureText) && data.literatureText[0] !== data.literatureText[1]) ? data.literatureText[0] : undefined,
        frequency: (Array.isArray(data.frequencyText) && data.frequencyText[0] !== data.frequencyText[1]) ? data.frequencyText[0] : undefined,
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
          message={`Czy na pewno chcesz ponownie wygenerować podtematy dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsGenerate}
          onClose={handleSubtopicsPromptMsgCancel}
          visible={msgSubtopicsPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować właściwości tematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleTopicExpansionGenerate}
          onClose={handleTopicExpansionPromptMsgCancel}
          visible={msgTopicExpansionPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz zapisać dane dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSaveTopicData}
          onClose={handleTopicSaveDataMsgCancel}
          visible={msgTopicDataVisible}
        />

        <div className={spinnerVisible ? "container-center" : ""}>
          {spinnerVisible ? (
            <div>
              <Spinner text={spinnerText} />
            </div>
          ) : (
            <>
              <div className="options-container">
                <label htmlFor="SectionType" className="label">Częstotliwość Tematu:</label>
                <input
                    id="SectionType"
                    name="text-container"
                    value={Number(frequencyText[0])}
                    onInput={(e) => {
                      setFrequencyText([Number((e.target as HTMLTextAreaElement).value) || 0, frequencyText[1]])
                    }}
                    className={`text-container own ${(frequencyText[0] !== frequencyText[1]) ? ' changed' : ''}`}
                    spellCheck={true}
                    placeholder="Proszę napisać częstotliwość tematu na egzaminie..."
                />
              </div>
              {subjectType == "Polski" ? (
              <div className="options-container">
                {promptLiteratureTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleLiteratureTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleLiteratureTextareaSize}
                  />
                }
                <label htmlFor="promptLiterature" className="label">Literatura:</label>
                <textarea
                   id="promptLiterature"
                   rows={promptLiteratureTextareaRows}
                   ref={promptLiteratureTextareaRef}
                   name="text-container"
                   value={literatureText[0]}
                   onInput={(e) => {
                    setLiteratureText([(e.target as HTMLTextAreaElement).value, literatureText[1]])
                   }}
                   className={`text-container own ${(literatureText[0] !== literatureText[1]) ? ' changed' : ''}`}
                   spellCheck={true}
                   placeholder="Proszę napisać literaturę..."
                />
              </div>
              ) : null}
              <div className="options-container">
                {promptNoteExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleNoteTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleNoteTextareaSize}
                  />
                }
                <label htmlFor="promptNote" className="label">Notatka:</label>
                <div
                  ref={noteRef}
                  style={{
                    height: `${noteHeight}px`,
                    overflow: 'hidden',
                    userSelect: 'text',
                  }}
                  className={`text-container`}
                >
                  <FormatText content={note} />
                </div>
              </div>
              <div style={{ margin: "4px 0px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageSaveTopicData}
                >
                  Zapisz
                </button>
              </div>
              <br />
              {sectionType !== "Stories" ? (
              <>
                <div style={{ margin: "4px 0px" }}>
                  <button
                    className="button"
                    style={{ padding: "10px 54px" }}
                    onClick={handleOpenMessageSubtopicsGenerate}
                  >
                    Generuj Podtematy
                  </button>
                </div>
                <br />
                <div style={{ marginTop: "4px" }}>
                  <button
                    className="button"
                    style={{ padding: "10px 54px" }}
                    onClick={handleOpenMessageTopicExpansionGenerate}
                  >
                    Generuj Właściwości
                  </button>
                </div>
                <br />
              </>) : null}
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
                          <div className="text">
                              <FormatText content={name} />
                          </div>
                          <button
                              id={id}
                              className="btn btnFormTable"
                              onClick={(e) => handleEditSubtopic(Number(e.currentTarget.id))}
                          >
                              <Edit size={28} />
                          </button>
                          <button
                              id={id}
                              className="btn btnFormTable"
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