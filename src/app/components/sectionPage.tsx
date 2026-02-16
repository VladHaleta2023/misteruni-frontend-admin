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
import MessageOK from "./messageOK";

type SectionPageProps = {
  subjectId: number;
  sectionId: number;
};

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

export default function SectionPage({ subjectId, sectionId }: SectionPageProps) {
  const [typeSectionText, setTypeSectionText] = useState(["", ""]);
  const [difficultySection, setDifficultySection] = useState(["", ""]);
  const [promptSubtopicsText, setPromptSubtopicsText] = useState(["", ""]);
  const [promptSubtopicsStatusText, setPromptSubtopicsStatusText] = useState(["", ""]);
  const [promptQuestionText, setPromptQuestionText] = useState(["", ""]);
  const [promptSolutionText, setPromptSolutionText] = useState(["", ""]);
  const [promptAnswersText, setPromptAnswersText] = useState(["", ""]);
  const [promptClosedSubtopicsText, setPromptClosedSubtopicsText] = useState(["", ""]);
  const [promptStoriesText, setPromptStoriesText] = useState(["", ""]);
  const [promptWordsText, setPromptWordsText] = useState(["", ""]);
  const [promptChatText, setPromptChatText] = useState(["", ""]);
  const [promptTopicExpansionText, setPromptTopicExpansionText] = useState(["", ""]);
  const [promptTopicFrequencyText, setPromptTopicFrequencyText] = useState(["", ""]);
  const [subjectName, setSubjectName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [msgSectionDataVisible, setMsgSectionDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [msgTopicExpansionPromptVisible, setMsgTopicExpansionPromptVisible] = useState(false);
  const [msgTopicFrequencyPromptVisible, setMsgTopicFrequencyPromptVisible] = useState(false);
  const [msgSubtopicsStatusPromptVisible, setMsgSubtopicsStatusPromptVisible] = useState(false);
  const [msgWordsPromptVisible, setMsgWordsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");

  const [msgOKVisible, setMsgOKVisible] = useState(false);
  const [textMessageOK, setTextMessageOK] = useState("");
  
  const promptSubtopicsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubtopicsTextareaExpanded, setPromptSubtopicsTextareaExpanded] = useState(false);
  const [promptSubtopicsTextareaRows, setPromptSubtopicsTextareaRows] = useState(5);

  const [promptSubtopicsTextOwn, setPromptSubtopicsTextOwn] = useState(true);
  const [promptSubtopicsStatusTextOwn, setPromptSubtopicsStatusTextOwn] = useState(true);
  const [promptQuestionTextOwn, setPromptQuestionTextOwn] = useState(true);
  const [promptSolutionTextOwn, setPromptSolutionTextOwn] = useState(true);
  const [promptAnswersTextOwn, setPromptAnswersTextOwn] = useState(true);
  const [promptClosedSubtopicsTextOwn, setPromptClosedSubtopicsTextOwn] = useState(true);
  const [promptStoriesTextOwn, setPromptStoriesTextOwn] = useState(true);
  const [promptWordsTextOwn, setPromptWordsTextOwn] = useState(true);
  const [promptChatTextOwn, setPromptChatTextOwn] = useState(true);
  const [promptTopicExpansionTextOwn, setPromptTopicExpansionTextOwn] = useState(true);
  const [promptTopicFrequencyTextOwn, setPromptTopicFrequencyTextOwn] = useState(true);

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

  const promptStoriesTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptStoriesTextareaExpanded, setPromptStoriesTextareaExpanded] = useState(false);
  const [promptStoriesTextareaRows, setPromptStoriesTextareaRows] = useState(5);

  const promptWordsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptWordsTextareaExpanded, setPromptWordsTextareaExpanded] = useState(false);
  const [promptWordsTextareaRows, setPromptWordsTextareaRows] = useState(5);

  const promptChatTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptChatTextareaExpanded, setPromptChatTextareaExpanded] = useState(false);
  const [promptChatTextareaRows, setPromptChatTextareaRows] = useState(5);

  const promptTopicExpansionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptTopicExpansionTextareaExpanded, setPromptTopicExpansionTextareaExpanded] = useState(false);
  const [promptTopicExpansionTextareaRows, setPromptTopicExpansionTextareaRows] = useState(5);

  const promptSubtopicsStatusTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubtopicsStatusTextareaExpanded, setPromptSubtopicsStatusTextareaExpanded] = useState(false);
  const [promptSubtopicsStatusTextareaRows, setPromptSubtopicsStatusTextareaRows] = useState(5);

  const promptTopicFrequencyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptTopicFrequencyTextareaExpanded, setPromptTopicFrequencyTextareaExpanded] = useState(false);
  const [promptTopicFrequencyTextareaRows, setPromptTopicFrequencyTextareaRows] = useState(5);

  useEffect(() => {
    async function fetchSectionPromptById() {
      showSpinner(true);

      try {
        const response = await api.get(`/subjects/${subjectId}/sections/${sectionId}?withTopics=false&withSubtopics=false`);
        if (response.data?.statusCode === 200) {
          setSubjectName(response.data.subject.name);
          setSectionName(response.data.section.name);
          setTypeSectionText([response.data.section.type, response.data.section.type]);
          setDifficultySection([response.data.section.difficulty, response.data.section.difficulty]);
          setPromptSubtopicsText([response.data.section.subtopicsPrompt, response.data.section.subtopicsPrompt]);
          setPromptSubtopicsStatusText([response.data.section.subtopicsStatusPrompt, response.data.section.subtopicsStatusPrompt]);
          setPromptQuestionText([response.data.section.questionPrompt, response.data.section.questionPrompt]);
          setPromptSolutionText([response.data.section.solutionPrompt, response.data.section.solutionPrompt]);
          setPromptAnswersText([response.data.section.answersPrompt, response.data.section.answersPrompt]);
          setPromptClosedSubtopicsText([response.data.section.closedSubtopicsPrompt, response.data.section.closedSubtopicsPrompt]);
          setPromptStoriesText([response.data.section.vocabluaryPrompt, response.data.section.vocabluaryPrompt]);
          setPromptWordsText([response.data.section.wordsPrompt, response.data.section.wordsPrompt]);
          setPromptChatText([response.data.section.chatPrompt, response.data.section.chatPrompt]);
          setPromptTopicExpansionText([response.data.section.topicExpansionPrompt, response.data.section.topicExpansionPrompt]);
          setPromptTopicFrequencyText([response.data.section.topicFrequencyPrompt, response.data.section.topicFrequencyPrompt]);
          setPromptSubtopicsTextOwn(response.data.section.subtopicsPromptOwn);
          setPromptSubtopicsStatusTextOwn(response.data.section.subtopicsStatusPromptOwn);
          setPromptQuestionTextOwn(response.data.section.questionPromptOwn);
          setPromptSolutionTextOwn(response.data.section.solutionPromptOwn);
          setPromptAnswersTextOwn(response.data.section.answersPromptOwn);
          setPromptClosedSubtopicsTextOwn(response.data.section.closedSubtopicsPromptOwn);
          setPromptStoriesTextOwn(response.data.section.vocabluaryPromptOwn);
          setPromptWordsTextOwn(response.data.section.wordsPromptOwn);
          setPromptChatTextOwn(response.data.section.chatPromptOwn);
          setPromptTopicExpansionTextOwn(response.data.section.topicExpansionPromptOwn);
          setPromptTopicFrequencyTextOwn(response.data.section.topicFrequencyPromptOwn);
        } else {
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

  function handleMessageOK() {
    setMsgOKVisible(false);
    window.location.reload();
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

  function toggleSubtopicsStatusPromptTextareaSize() {
    if (promptSubtopicsStatusTextareaRef.current) {
      if (!promptSubtopicsStatusTextareaExpanded) {
        const rows = calculateRows(promptSubtopicsStatusTextareaRef.current);
        setPromptSubtopicsStatusTextareaRows(rows);
      } else {
        setPromptSubtopicsStatusTextareaRows(5);
      }
    }

    setPromptSubtopicsStatusTextareaExpanded(prev => !prev);
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

  function toggleWordsPromptTextareaSize() {
    if (promptWordsTextareaRef.current) {
      if (!promptWordsTextareaExpanded) {
        const rows = calculateRows(promptWordsTextareaRef.current);
        setPromptWordsTextareaRows(rows);
      } else {
        setPromptWordsTextareaRows(5);
      }
    }

    setPromptWordsTextareaExpanded(prev => !prev);
  }

  function toggleTopicExpansionPromptTextareaSize() {
    if (promptTopicExpansionTextareaRef.current) {
      if (!promptTopicExpansionTextareaExpanded) {
        const rows = calculateRows(promptTopicExpansionTextareaRef.current);
        setPromptTopicExpansionTextareaRows(rows);
      } else {
        setPromptTopicExpansionTextareaRows(5);
      }
    }

    setPromptTopicExpansionTextareaExpanded(prev => !prev);
  }

  function toggleTopicFrequencyPromptTextareaSize() {
    if (promptTopicFrequencyTextareaRef.current) {
      if (!promptTopicFrequencyTextareaExpanded) {
        const rows = calculateRows(promptTopicFrequencyTextareaRef.current);
        setPromptTopicFrequencyTextareaRows(rows);
      } else {
        setPromptTopicFrequencyTextareaRows(5);
      }
    }

    setPromptTopicFrequencyTextareaExpanded(prev => !prev);
  }

  function toggleChatPromptTextareaSize() {
    if (promptChatTextareaRef.current) {
      if (!promptChatTextareaExpanded) {
        const rows = calculateRows(promptChatTextareaRef.current);
        setPromptChatTextareaRows(rows);
      } else {
        setPromptChatTextareaRows(5);
      }
    }

    setPromptChatTextareaExpanded(prev => !prev);
  }

  function handleOpenMessageSaveSectionData() {
    setMsgSectionDataVisible(true);
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

  function handleOpenMessageWordsGenerate() {
    setMsgWordsPromptVisible(true);
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

    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
        
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
            showAlert(400, `Nie udało się zgenerować podtematy\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
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

        showAlert(200, `Podtematy zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
      }

      resetSpinner();
      setTextMessageOK(`Podtematy zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}`);
      setMsgOKVisible(true);
    }
    catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleSubtopicsStatusGenerate() {
    setMsgSubtopicsStatusPromptVisible(false);

    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja ważności podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
        
        const subtopicsStatusResponse = await api.get<{ subtopics: [string, string][] }>(
          `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/admin/status`
        );

        let subtopics: [string, string][] = subtopicsStatusResponse.data.subtopics;

        let changed: string = "true";
        let attempt: number = 0;
        let errors: string[] = [];
        const prompt: string = topicsResponse.data.topics[i].subtopicsStatusPrompt;
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
            console.log(`Temat ${topicsResponse.data.topics[i].name}: Próba ${attempt}`);
          }
          else {
            showAlert(400, `Nie udało się zgenerować ważności podtamatów\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
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
            `Nie udało się poprawnie wygenerować ważności podtematów dla tematu ${topicsResponse.data.topics[i].name}`
          );
          continue;
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

        showAlert(200, `Ważności podtematów zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
      }

      resetSpinner();
      setTextMessageOK(`Ważności podtematów zostały zapisane dla:\nRozdział: ${topicsResponse.data.section.name}`);
      setMsgOKVisible(true);
    }
    catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(false);
    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);
      const topics = topicsResponse.data.topics;

      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];
        const topicId: number = topic.id;
        const topicName: string = topic.name;
        const prompt: string = topic.topicExpansionPrompt;
        const subtopics = topic.subtopics.map((sub: Subtopic) => sub.name);

        showSpinner(
          true,
          `Trwa generacja notatki tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicName}`
        );

        const MAX_ATTEMPTS = 2;
        const CHUNK_SIZE = 5;

        const chunkNotes: string[] = [];
        const errors: string[] = [];

        const chunks: string[][] = [];
        for (let i = 0; i < subtopics.length; i += CHUNK_SIZE) {
          chunks.push(subtopics.slice(i, i + CHUNK_SIZE));
        }

        for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
          const subtopicChunk = chunks[chunkIndex];
          let changed = "true";
          let attempt = 0;
          let chunkNote = "";

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
              showAlert(
                400,
                `Nie udało się wygenerować notatki dla porcji podtematów:\n${subtopicChunk.join(", ")}`
              );
              break;
            }
          }
        }

        const fullNote = chunkNotes.join("\n\n");

        const MAX_DB_ATTEMPTS = 3;
        let dbAttempt = 0;
        let dbSuccess = false;

        while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
          try {
            await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, {
              note: fullNote
            });

            dbSuccess = true;
          } catch (err) {
            dbAttempt++;
            console.log(`DB attempt ${dbAttempt} failed`);
            if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
          }
        }

        showAlert(200, `Notatka została zapisana dla tematu ${topicName}`);
      }

      resetSpinner();
      setTextMessageOK(`Notatka została zapisana dla rozdziału ${topicsResponse.data.section.name}`);
      setMsgOKVisible(true);
    } catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleTopicFrequencyGenerate() {
    setMsgTopicFrequencyPromptVisible(false);
    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);
      const topics = topicsResponse.data.topics;

      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];
        const topicId: number = topic.id;
        const topicName: string = topic.name;
        const prompt: string = topic.topicFrequencyPrompt;

        if (!prompt || prompt.trim() === '') {
          showAlert(400, `Brak promptu do generacji częstotliwości dla tematu: ${topicName}`);
          continue;
        }

        const subtopics = topic.subtopics.map((sub: Subtopic) => sub.name);
        
        showSpinner(
          true,
          `Trwa generacja częstotliwości tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`
        );

        const MAX_ATTEMPTS = 2;
        const errors: string[] = [];
        
        let frequency = 0;
        let outputSubtopics: [string, number][] = [];
        let changed = "true";
        let attempt = 0;
        let success = false;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const topicFrequencyResponse = await api.post<FrequencyResponse>(
              `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/frequency-generate`,
              {
                changed,
                frequency,
                errors,
                attempt,
                prompt,
                subtopics: subtopics,
                outputSubtopics
              }
            );

            const data = topicFrequencyResponse.data;

            if (data.statusCode === 201) {
              changed = data.changed;
              frequency = data.frequency ?? 0;
              outputSubtopics = data.outputSubtopics ?? [];
              attempt = data.attempt;
              
              if (frequency > 0 && outputSubtopics.length > 0) {
                success = true;
                break;
              }
            } else {
              showAlert(
                400,
                `Nie udało się wygenerować częstotliwości dla tematu: ${topicName}`
              );
              break;
            }
        }

        if (!success) {
          showAlert(
            400,
            `Nie udało się wygenerować częstotliwości dla tematu ${topicName} po ${attempt} próbach`
          );
          continue;
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

        showAlert(200, `Częstotliwość została zapisana dla tematu ${topicName}`);
      }

      resetSpinner();
      setTextMessageOK(`Częstotliwość została zapisana dla rozdziału ${topicsResponse.data.section.name}`);
      setMsgOKVisible(true);
    } catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  async function handleWordsGenerate() {
    setMsgWordsPromptVisible(false);

    await saveSectionData();

    try {
      const topicsResponse = await api.get(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja słów tematycznych dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
        
        let changed: string = "true";
        let attempt: number = 0;
        let words: [string, number][] = [];
        let errors: string[] = [];
        const prompt: string = topicsResponse.data.topics[i].wordsPrompt;
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
            console.log(`Temat ${topicsResponse.data.topics[i].name}: Próba ${attempt}`);
          }
          else {
            showAlert(400, `Nie udało się zgenerować słów tematycznych\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
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
            `Nie udało się poprawnie wygenerować słów tematycznych dla tematu ${topicsResponse.data.topics[i].name}`
          );
          continue;
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

        showAlert(200, `Słowy tematyczne zostały zapisane dla tematu ${topicsResponse.data.topics[i].name}`);
      }

      resetSpinner();
      setTextMessageOK(`Słowy tematyczne zostały zapisane dla rozdziału ${topicsResponse.data.section.name}`);
      setMsgOKVisible(true);
    }
    catch (error: unknown) {
      handleApiError(error);
      resetSpinner();
    }
  }

  function handleOpenMessageSubtopicsStatusGenerate() {
    setMsgSubtopicsStatusPromptVisible(true);
  }

  async function saveSectionData(data = {
    type: typeSectionText,
    difficulty: difficultySection,
    subtopicsPrompt: promptSubtopicsText,
    subtopicsStatusPrompt: promptSubtopicsStatusText,
    questionPrompt: promptQuestionText,
    solutionPrompt: promptSolutionText,
    answersPrompt: promptAnswersText,
    closedSubtopicsPrompt: promptClosedSubtopicsText,
    vocabluaryPrompt: promptStoriesText,
    wordsPrompt: promptWordsText,
    chatPrompt: promptChatText,
    topicExpansionPrompt: promptTopicExpansionText,
    topicFrequencyPrompt: promptTopicFrequencyText
  }) {
    try {
      const processedData = {
        type: (Array.isArray(data.type) && data.type[0] !== data.type[1]) ? data.type[0] : undefined,
        difficulty: (Array.isArray(data.difficulty) && data.difficulty[0] !== data.difficulty[1]) ? data.difficulty[0] : undefined,
        subtopicsPrompt: (Array.isArray(data.subtopicsPrompt) && data.subtopicsPrompt[0] !== data.subtopicsPrompt[1]) ? data.subtopicsPrompt[0] : undefined,
        subtopicsStatusPrompt: (Array.isArray(data.subtopicsStatusPrompt) && data.subtopicsStatusPrompt[0] !== data.subtopicsStatusPrompt[1]) ? data.subtopicsStatusPrompt[0] : undefined,
        questionPrompt: (Array.isArray(data.questionPrompt) && data.questionPrompt[0] !== data.questionPrompt[1]) ? data.questionPrompt[0] : undefined,
        solutionPrompt: (Array.isArray(data.solutionPrompt) && data.solutionPrompt[0] !== data.solutionPrompt[1]) ? data.solutionPrompt[0] : undefined,
        answersPrompt: (Array.isArray(data.answersPrompt) && data.answersPrompt[0] !== data.answersPrompt[1]) ? data.answersPrompt[0] : undefined,
        closedSubtopicsPrompt: (Array.isArray(data.closedSubtopicsPrompt) && data.closedSubtopicsPrompt[0] !== data.closedSubtopicsPrompt[1]) ? data.closedSubtopicsPrompt[0] : undefined,
        vocabluaryPrompt: (Array.isArray(data.vocabluaryPrompt) && data.vocabluaryPrompt[0] !== data.vocabluaryPrompt[1]) ? data.vocabluaryPrompt[0] : undefined,
        wordsPrompt: (Array.isArray(data.wordsPrompt) && data.wordsPrompt[0] !== data.wordsPrompt[1]) ? data.wordsPrompt[0] : undefined,
        chatPrompt: (Array.isArray(data.chatPrompt) && data.chatPrompt[0] !== data.chatPrompt[1]) ? data.chatPrompt[0] : undefined,
        topicExpansionPrompt: (Array.isArray(data.topicExpansionPrompt) && data.topicExpansionPrompt[0] !== data.topicExpansionPrompt[1]) ? data.topicExpansionPrompt[0] : undefined,
        topicFrequencyPrompt: (Array.isArray(data.topicFrequencyPrompt) && data.topicFrequencyPrompt[0] !== data.topicFrequencyPrompt[1]) ? data.topicFrequencyPrompt[0] : undefined,
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
          message={`Czy na pewno chcesz zapisać dane dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSaveSectionData}
          onClose={handleSectionSaveDataMsgCancel}
          visible={msgSectionDataVisible}
        />

        <MessageOK 
          message={textMessageOK}
          onConfirm={handleMessageOK}
          visible={msgOKVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować podtematy dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsGenerate}
          onClose={handleSubtopicsPromptMsgCancel}
          visible={msgSubtopicsPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować ważności podtematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsStatusGenerate}
          onClose={handleSubtopicsStatusPromptMsgCancel}
          visible={msgSubtopicsStatusPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować notatkę tematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}?`}
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
          message={`Czy na pewno chcesz ponownie wygenerować słowy kluczowe dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleWordsGenerate}
          onClose={handleWordsPromptMsgCancel}
          visible={msgWordsPromptVisible}
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
              {typeSectionText[0] === "Stories" ? (<div className="options-container">
                <label htmlFor="SectionDifficulty" className="label">Trudność:</label>
                <input
                    id="SectionDifficulty"
                    name="text-container"
                    value={difficultySection[0]}
                    onInput={(e) => {
                      setDifficultySection([(e.target as HTMLTextAreaElement).value, difficultySection[1]])
                    }}
                    className={`text-container own ${(difficultySection[0] !== difficultySection[1]) ? ' changed' : ''}`}
                    spellCheck={true}
                    placeholder="Proszę napisać trudność rozdziału..."
                />
              </div>) : null}
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
              {typeSectionText[0] != "Stories" ? (<div className="options-container">
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
              <div className="options-container">
                {promptChatTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleChatPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleChatPromptTextareaSize}
                  />
                }
                <label htmlFor="promptChat" className="label">Chat Zadania:</label>
                <textarea
                  id="promptChat"
                  rows={promptChatTextareaRows}
                  ref={promptChatTextareaRef}
                  name="text-container"
                  value={promptChatText[0]}
                  onInput={(e) => {
                    setPromptChatText([(e.target as HTMLTextAreaElement).value, promptChatText[1]])
                  }}
                  className={`text-container ${promptChatTextOwn ? "own" : ""} ${(promptChatText[0] !== promptChatText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt do chatu zadania..."
                />
              </div>
              {typeSectionText[0] != "Stories" ? (<div className="options-container">
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
              {typeSectionText[0] == "Stories" ? (<div className="options-container">
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
              {typeSectionText[0] == "Stories" ? (
              <>
              <div className="options-container">
                {promptWordsTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleWordsPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleWordsPromptTextareaSize}
                  />
                }
                <label htmlFor="promptWords" className="label">Słowy Tematyczne:</label>
                <textarea
                  id="promptWords"
                  rows={promptWordsTextareaRows}
                  ref={promptWordsTextareaRef}
                  name="text-container"
                  value={promptWordsText[0]}
                  onInput={(e) => {
                    setPromptWordsText([(e.target as HTMLTextAreaElement).value, promptWordsText[1]])
                  }}
                  className={`text-container ${promptWordsTextOwn ? "own" : ""} ${(promptWordsText[0] !== promptWordsText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt słów tematycznych..."
                />
              </div>
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageWordsGenerate}
                >
                  Generuj Słowy Tematyczne
                </button>
              </div>
              </>) : null}
              {typeSectionText[0] != "Stories" ? (
              <>
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
              <div className="options-container">
                {promptSubtopicsStatusTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSubtopicsStatusPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleSubtopicsStatusPromptTextareaSize}
                  />
                }
                <label htmlFor="subjectSubtopicsStatus" className="label">Ważności Podtematów:</label>
                <textarea
                  id="subjectSubtopicsStatus"
                  rows={promptSubtopicsStatusTextareaRows}
                  ref={promptSubtopicsStatusTextareaRef}
                  name="text-container"
                  value={promptSubtopicsStatusText[0]}
                  onInput={(e) => {
                    setPromptSubtopicsStatusText([(e.target as HTMLTextAreaElement).value, promptSubtopicsStatusText[1]]);
                  }}
                  className={`text-container ${promptSubtopicsStatusTextOwn ? "own" : ""} ${(promptSubtopicsStatusText[0] !== promptSubtopicsStatusText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt dla statusów podtematów..."
                />
              </div>
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageSubtopicsStatusGenerate}
                >
                  Generuj Ważności
                </button>
              </div>
              <br />
              <div className="options-container">
                {promptTopicFrequencyTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTopicFrequencyPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTopicFrequencyPromptTextareaSize}
                  />
                }
                <label htmlFor="promptTopicFrequency" className="label">Częstotliwość Tematu:</label>
                <textarea
                  id="promptTopicFrequency"
                  rows={promptTopicFrequencyTextareaRows}
                  ref={promptTopicFrequencyTextareaRef}
                  name="text-container"
                  value={promptTopicFrequencyText[0]}
                  onInput={(e) => {
                    setPromptTopicFrequencyText([(e.target as HTMLTextAreaElement).value, promptTopicFrequencyText[1]]);
                  }}
                  className={`text-container ${promptTopicFrequencyTextOwn ? "own" : ""} ${(promptTopicFrequencyText[0] !== promptTopicFrequencyText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt częstotliwości tematu..."
                />
              </div>
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
              <div className="options-container">
                {promptTopicExpansionTextareaExpanded ?
                  <ChevronUp
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTopicExpansionPromptTextareaSize}
                  /> :
                  <ChevronDown
                    size={28}
                    style={{top: "28px"}}
                    className="btnTextAreaOpen"
                    onClick={toggleTopicExpansionPromptTextareaSize}
                  />
                }
                <label htmlFor="promptTopicExpansion" className="label">Notatka Tematu:</label>
                <textarea
                  id="promptTopicExpansion"
                  rows={promptTopicExpansionTextareaRows}
                  ref={promptTopicExpansionTextareaRef}
                  name="text-container"
                  value={promptTopicExpansionText[0]}
                  onInput={(e) => {
                    setPromptTopicExpansionText([(e.target as HTMLTextAreaElement).value, promptTopicExpansionText[1]]);
                  }}
                  className={`text-container ${promptTopicExpansionTextOwn ? "own" : ""} ${(promptTopicExpansionText[0] !== promptTopicExpansionText[1]) ? ' changed' : ''}`}
                  spellCheck={true}
                  placeholder="Proszę napisać prompt notatki tematu..."
                />
              </div>
              <div style={{ marginTop: "4px" }}>
                <button
                  className="button"
                  style={{ padding: "10px 54px" }}
                  onClick={handleOpenMessageTopicExpansionGenerate}
                >
                  Generuj Notatkę
                </button>
              </div>
              </>): null}
              <br />
              <div style={{ margin: "4px 0px" }}>
                <button
                  className="button"
                  style={{
                    padding: "10px 54px",
                    backgroundColor: "darkgreen"
                  }}
                  onClick={handleOpenMessageSaveSectionData}
                >
                  Zapisz
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}