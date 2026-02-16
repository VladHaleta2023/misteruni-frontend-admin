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
import MessageOK from "./messageOK";

type TopicPageProps = {
  subjectId: number;
  sectionId: number;
  topicId: number;
};

type Word = {
  id: number;
  text: string;
  frequency: number;
}

type Subtopic = {
  id: number;
  name: string;
}

type TopicExpansionChunkResponse = {
  statusCode: number;
  changed: string;
  note: string;
  errors: string[];
  attempt: number;
};

type FrequencyResponse = {
  statusCode: number;
  changed: string;
  frequency: number;
  outputSubtopics: [string, number][]
  errors: string[];
  attempt: number;
};

export default function TopicPage({ subjectId, sectionId, topicId }: TopicPageProps) {
  const router = useRouter();
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [msgSubtopicDeleteVisible, setMsgSubtopicDeleteVisible] = useState(false);
  const [msgOKVisible, setMsgOKVisible] = useState(false);
  const [textMessageOK, setTextMessageOK] = useState("");
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
  const [noteHeight, setNoteHeight] = useState(160);
  const noteRef = useRef<HTMLDivElement>(null);

  const [literatureText, setLiteratureText] = useState(["", ""]);
  const [note, setNote] = useState("");
  const [words, setWords] = useState<Word[]>([]);

  const [msgWordsPromptVisible, setMsgWordsPromptVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [msgSubtopicsStatusPromptVisible, setMsgSubtopicsStatusPromptVisible] = useState(false);
  const [msgTopicExpansionPromptVisible, setMsgTopicExpansionPromptVisible] = useState(false);
  const [msgTopicFrequencyPromptVisible, setMsgTopicFrequencyPromptVisible] = useState(false);

  useEffect(() => {
    setSubtopicId(-1);

    async function fetchSubtopics() {
      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/admin`);
        
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
        }, 2000);
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
        }, 2000);
      }
    }

    async function fetchWords() {
      if (subjectId === -1 || sectionId === -1 || topicId === -1) {
        setWords([]);
      }

      showSpinner(true);

      try {
        const response = await api.post(`/subjects/${subjectId}/words/admin`, {
          topicId: topicId
        });

        if (response.data?.statusCode === 200) {
          const fetchedWords: Word[] = response.data.words;
          setWords(fetchedWords);
        } else {
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error) {
        handleApiError(error);
      }
      finally {
        setTimeout(() => {
          resetSpinner();
        }, 2000);
      }
    }

    fetchTopicPromptById();
    fetchSubtopics();
    fetchWords();
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

  function handleSubtopicsStatusPromptMsgCancel() {
    setMsgSubtopicsStatusPromptVisible(false);
  }

  function handleTopicExpansionPromptMsgCancel() {
    setMsgTopicExpansionPromptVisible(false);
  }

  function handleTopicFrequencyPromptMsgCancel() {
    setMsgTopicFrequencyPromptVisible(false);
  }

  function handleWordsPromptMsgCancel() {
    setMsgWordsPromptVisible(false);
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

  function handleMessageOK() {
    setMsgOKVisible(false);
    window.location.reload();
  }

  async function handleDeleteSubtopic() {
    setMsgSubtopicDeleteVisible(false);

    showSpinner(true, "Trwa usuwanie podtematu...");
    
    try {
        const response = await api.delete(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/${subtopicId}`);

        showAlert(response?.data.statusCode, response?.data.message);

        setSubtopics(prev => prev.filter(sub => sub.id !== subtopicId));
    }
    catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
          resetSpinner();
      }, 2000);
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
        setNoteHeight(160);
      }
    }
    setPromptNoteExpanded(prev => !prev);
  }

  function handleOpenMessageTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(true);
  }

  function handleOpenMessageTopicFrequencyGenerate() {
    setMsgTopicFrequencyPromptVisible(true);
  }

  function handleOpenMessageSubtopicsGenerate() {
    setMsgSubtopicsPromptVisible(true);
  }

  function handleOpenMessageSubtopicsStatusGenerate() {
    setMsgSubtopicsStatusPromptVisible(true);
  }

  function handleOpenMessageWordsGenerate() {
    setMsgWordsPromptVisible(true);
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
      }, 2000);
    }
    catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
        resetSpinner();
      }, 2000);
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

      const MAX_DB_ATTEMPTS = 3;
      let dbAttempt = 0;
      let dbSuccess = false;

      while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
        try {
          await api.delete(
            `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics`
          );

          await api.post(
            `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/admin/bulk`,
            { subtopics }
          );

          dbSuccess = true;
        } catch (err) {
          dbAttempt++;
          console.log(`DB attempt ${dbAttempt} failed`);
          if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
        }
      }

      resetSpinner();
      setTextMessageOK(`Podtematy zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topic.name}`);
      setMsgOKVisible(true);
    }
    catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleSubtopicsStatusGenerate() {
    setMsgSubtopicsStatusPromptVisible(false);

    await saveTopicData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);

      showSpinner(true, `Trwa generacja ważności podtematów dla\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
      
      const subtopicsStatusResponse = await api.get<{ subtopics: [string, string][] }>(
        `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/admin/status`
      );

      let subtopics: [string, string][] = subtopicsStatusResponse.data.subtopics;

      let changed: string = "true";
      let attempt: number = 0;
      let errors: string[] = [];
      const prompt: string = topicsResponse.data.topic.subtopicsStatusPrompt;
      const MAX_ATTEMPTS = 2;

      while (changed === "true" && attempt <= MAX_ATTEMPTS) {
        const subtopicsStatusResponse = await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/status-generate`, {
          changed,
          subtopics,
          errors,
          attempt,
          prompt
        });

        if (subtopicsStatusResponse.data?.statusCode === 201) {
          changed = subtopicsStatusResponse.data.changed;
          subtopics = subtopicsStatusResponse.data.subtopics;
          errors = subtopicsStatusResponse.data.errors;
          attempt = subtopicsStatusResponse.data.attempt;
          console.log(`Temat ${topicsResponse.data.topic.name}: Próba ${attempt}`);
        }
        else {
          showAlert(400, `Nie udało się zgenerować ważności podtematów\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
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
          typeof s[1] !== 'string'
        )
      ) {
        showAlert(
          400, 
          `Nie udało się poprawnie wygenerować ważności podtematów dla tematu ${topicsResponse.data.topic.name}`
        );
      }

      const MAX_DB_ATTEMPTS = 3;
      let dbAttempt = 0;
      let dbSuccess = false;

      while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
        try {
          await api.put(
            `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/admin/update`,
            { subtopics }
          );

          dbSuccess = true;
        } catch (err) {
          dbAttempt++;
          console.log(`DB attempt ${dbAttempt} failed`);
          if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
        }
      }

      resetSpinner();
      setTextMessageOK(`Ważności podtematów zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topic.name}`);
      setMsgOKVisible(true);
    }
    catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(false);
    await saveTopicData();

    try {
      const topicResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);
      const topic = topicResponse.data.topic;
      const prompt: string = topic.topicExpansionPrompt;

      showSpinner(true, `Trwa generacja notatki tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);

      const MAX_ATTEMPTS = 2;
      const CHUNK_SIZE = 10;

      let chunkNote = "";
      const chunkNotes: string[] = []
      const errors: string[] = [];

      const subtopicNames = subtopics.map(sub => sub.name);

      const chunks: string[][] = [];
      for (let i = 0; i < subtopicNames.length; i += CHUNK_SIZE) {
        chunks.push(subtopicNames.slice(i, i + CHUNK_SIZE));
      }

      for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
        const subtopicChunk = chunks[chunkIndex];

        let changed = "true";
        let attempt = 0;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
          const topicExpansionResponse: { data: TopicExpansionChunkResponse } = await api.post(
            `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/topic-expansion-generate`,
            {
              changed,
              note: chunkNote,
              errors,
              attempt,
              prompt,
              subtopics: subtopicChunk,
            }
          );

          const data: TopicExpansionChunkResponse = topicExpansionResponse.data;

          if (data.statusCode === 201) {
            changed = data.changed;
            chunkNote = data.note ?? "";
            attempt = data.attempt;

            chunkNotes.push(chunkNote);
          } else {
            showAlert(400, `Nie udało się wygenerować notatki i częstotliwości dla porcji podtematów:\n${subtopicChunk.join(", ")}`);
            break;
          }
        }
      }

      const MAX_DB_ATTEMPTS = 3;
      let dbAttempt = 0;
      let dbSuccess = false;

      while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
        try {
          await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, {
            note: chunkNotes.join("\n\n")
          });

          dbSuccess = true;
        } catch (err) {
          dbAttempt++;
          console.log(`DB attempt ${dbAttempt} failed`);
          if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
        }
      }

      resetSpinner();
      setNote(chunkNotes.join("\n\n"));
      setTextMessageOK(`Notatka została zapisana dla tematu ${topicName}`);
      setMsgOKVisible(true);
    } catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleTopicFrequencyGenerate() {
    setMsgTopicFrequencyPromptVisible(false);
    await saveTopicData();

    try {
      const topicResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);
      const topic = topicResponse.data.topic;
      const prompt: string = topic.topicFrequencyPrompt;

      showSpinner(true, `Trwa generacja częstotliwości tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);

      const MAX_ATTEMPTS = 2;

      const errors: string[] = [];

      const subtopicNames = subtopics.map(sub => sub.name);
      let frequency = 0;
      let outputSubtopics: [string, number][] = [];
      let changed = "true";
      let attempt = 0;

      while (changed === "true" && attempt <= MAX_ATTEMPTS) {
        const topicFrequencyResponse: { data: FrequencyResponse } = await api.post(
          `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/frequency-generate`,
          {
            changed,
            frequency,
            errors,
            attempt,
            prompt,
            subtopics: subtopicNames,
            outputSubtopics
          }
        );

        const data: FrequencyResponse = topicFrequencyResponse.data;

        if (data.statusCode === 201) {
          changed = data.changed;
          frequency = data.frequency ?? 0;
          outputSubtopics = data.outputSubtopics ?? [];
          attempt = data.attempt;
        } else {
          showAlert(400, `Nie udało się wygenerować częstotliwości dla porcji podtematów`);
          break;
        }
      }

      const MAX_DB_ATTEMPTS = 3;
      let dbAttempt = 0;
      let dbSuccess = false;

      while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
        try {
          await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, {
            outputSubtopics,
            frequency
          });

          dbSuccess = true;
        } catch (err) {
          dbAttempt++;
          console.log(`DB attempt ${dbAttempt} failed`);
          if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
        }
      }

      resetSpinner();
      setFrequencyText([frequency, frequency]);
      setTextMessageOK(`Częstotliwość została zapisana dla tematu ${topicName}`);
      setMsgOKVisible(true);
    } catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleWordsGenerate() {
    setMsgWordsPromptVisible(false);

    await saveTopicData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`);

      showSpinner(true, `Trwa generacja słów tematycznych dla\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
      
      let changed: string = "true";
      let attempt: number = 0;
      let words: [string, number][] = [];
      let errors: string[] = [];
      const prompt: string = topicsResponse.data.topic.wordsPrompt;
      const MAX_ATTEMPTS = 0;

      while (changed === "true" && attempt <= MAX_ATTEMPTS) {
        const wordsResponse = await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/words/words-generate`, {
          changed,
          words,
          errors,
          attempt,
          prompt
        });

        if (wordsResponse.data?.statusCode === 201) {
          changed = wordsResponse.data.changed;
          words = wordsResponse.data.words;
          errors = wordsResponse.data.errors;
          attempt = wordsResponse.data.attempt;
          console.log(`Temat ${topicsResponse.data.topic.name}: Próba ${attempt}`);
        }
        else {
          showAlert(400, `Nie udało się zgenerować słowy tematyczne\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`);
          break;
        }
      }

      if (
        words.length === 0 ||
        words.some(w => 
          !Array.isArray(w) || 
          w.length !== 2 || 
          typeof w[0] !== 'string' || 
          w[0].trim() === '' || 
          typeof w[1] !== 'number'
        )
      ) {
        showAlert(
          400, 
          `Nie udało się poprawnie wygenerować słowy tematyczne dla tematu ${topicsResponse.data.topic.name}`
        );
      }

      const MAX_DB_ATTEMPTS = 3;
      let dbAttempt = 0;
      let dbSuccess = false;

      while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
        try {
          await api.delete(
            `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/words`
          );

          await api.post(
            `subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/words`,
            { words }
          );

          dbSuccess = true;
        } catch (err) {
          dbAttempt++;
          console.log(`DB attempt ${dbAttempt} failed`);
          if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
        }
      }

      resetSpinner();
      setTextMessageOK(`Słowy tematyczne zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topic.name}`);
      setMsgOKVisible(true);
    }
    catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
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

        <MessageOK 
          message={textMessageOK}
          onConfirm={handleMessageOK}
          visible={msgOKVisible}
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
          message={`Czy na pewno chcesz ponownie wygenerować ważności podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsStatusGenerate}
          onClose={handleSubtopicsStatusPromptMsgCancel}
          visible={msgSubtopicsStatusPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować notatkę tematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleTopicExpansionGenerate}
          onClose={handleTopicExpansionPromptMsgCancel}
          visible={msgTopicExpansionPromptVisible}
        />

        <Message
          message={`Czy na pewno chcesz ponownie wygenerować częstotliwość tematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleTopicFrequencyGenerate}
          onClose={handleTopicFrequencyPromptMsgCancel}
          visible={msgTopicFrequencyPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz zapisać dane dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSaveTopicData}
          onClose={handleTopicSaveDataMsgCancel}
          visible={msgTopicDataVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować słowy kluczowe dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleWordsGenerate}
          onClose={handleWordsPromptMsgCancel}
          visible={msgWordsPromptVisible}
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
                <div style={{ margin: "4px 0px" }}>
                  <button
                    className="button"
                    style={{ padding: "10px 54px" }}
                    onClick={handleOpenMessageSubtopicsStatusGenerate}
                  >
                    Generuj Ważności
                  </button>
                </div>
                <br />
                <div style={{ marginTop: "4px" }}>
                  <button
                    className="button"
                    style={{ padding: "10px 54px" }}
                    onClick={handleOpenMessageTopicFrequencyGenerate}
                  >
                    Generuj Częstotliwość
                  </button>
                </div>
                <br />
                <div style={{ marginTop: "4px" }}>
                  <button
                    className="button"
                    style={{ padding: "10px 54px" }}
                    onClick={handleOpenMessageTopicExpansionGenerate}
                  >
                    Generuj Notatkę
                  </button>
                </div>
                <br />
              </>) : null}
              {sectionType === "Stories" ? (<>
                <div style={{ marginTop: "4px" }}>
                  <button
                    className="button"
                    style={{ padding: "10px 54px" }}
                    onClick={handleOpenMessageWordsGenerate}
                  >
                    Generuj Słowy Tematyczne
                  </button>
                </div>
                <br />
              </>) : null}
              <div style={{ margin: "4px 0px" }}>
                <button
                  className="button"
                  style={{
                    padding: "10px 54px",
                    backgroundColor: "darkgreen"
                  }}
                  onClick={handleOpenMessageSaveTopicData}
                >
                  Zapisz
                </button>
              </div>
              <br />
              {sectionType !== "Stories" ? (
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
                          id={String(id)}
                          className="btn btnFormTable"
                          onClick={(e) => handleEditSubtopic(Number(e.currentTarget.id))}
                      >
                        <Edit size={28} />
                      </button>
                      <button
                          id={String(id)}
                          className="btn btnFormTable"
                          onClick={(e) => handleOpenMessageDeleteSubtopic(Number(e.currentTarget.id))}
                      >
                        <Trash2 size={28} />
                      </button>
                    </div>
                ))}
              </div>) : (
              <div className="formTable">
                <div
                  className="element elementTitle"
                >
                  <div>
                    Słowy Tematyczne
                  </div>
                </div>
                {words.map(({ id, text, frequency }, index) => (
                  <div className="element" key={id}>
                    <div className="text" style={{ display: "flex", gap: "6px" }}>
                      <div className="element">{index + 1}.</div>
                      <div className="element-frequency">{frequency}</div>
                      <FormatText content={text} />
                    </div>
                  </div>
                ))}
              </div>)}
            </>
          )}
        </div>
      </main>
    </>
  );
}