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

type SubjectPageProps = {
  subjectId: number;
  subjectName?: string;
};

type SectionSubtopic = {
  topicId: number;
  subjectId: number;
  sectionId: number;
  subtopics: [string, number][] | [string, string][];
};

type Word = {
  topicId: number;
  subjectId: number;
  sectionId: number;
  words: [string, number][];
}

type Topic = {
  id: number;
  name: string;
  section: Section;
  subtopicsPrompt: string;
  subtopicsStatusPrompt: string;
  topicExpansionPrompt: string;
  topicFrequencyPrompt: string;
  wordsPrompt: string;
  subtopics: Subtopic[]
};

type Section = {
  id: number;
  name: string;
  partId: number;
  topics: Topic[]
};

type Subtopic = {
  id: number;
  name: string;
};

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

export default function SubjectPage({ subjectId }: SubjectPageProps) {
  const [minSectionPart, setMinSectionPart] = useState(1);

  const [subjectPromptText, setSubjectPromptText] = useState(["", ""]);
  const [typeSubjectText, setTypeSubjectText] = useState(["", ""]);
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

  const [msgOKVisible, setMsgOKVisible] = useState(false);
  const [textMessageOK, setTextMessageOK] = useState("");

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

  const [subjectName, setSubjectName] = useState("");

  const [msgNextWordsGenerateVisible, setMsgNextWordsGenerateVisible] = useState(false);
  const [msgNextFrequencyGenerateVisible, setMsgNextFrequencyGenerateVisible] = useState(false);
  const [msgNextSubtopicsGenerateVisible, setMsgNextSubtopicsGenerateVisible] = useState(false);
  const [msgNextSubtopicsStatusGenerateVisible, setMsgNextSubtopicsStatusGenerateVisible] = useState(false);
  const [msgNextTopicExpansionsGenerateVisible, setMsgNextTopicExpansionsGenerateVisible] = useState(false);

  const [msgPlanVisible, setMsgPlanVisible] = useState(false);
  const [msgSubjectDataVisible, setMsgSubjectDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [msgSubtopicsStatusPromptVisible, setMsgSubtopicsStatusPromptVisible] = useState(false);
  const [msgTopicExpansionPromptVisible, setMsgTopicExpansionPromptVisible] = useState(false);
  const [msgTopicFrequencyPromptVisible, setMsgTopicFrequencyPromptVisible] = useState(false);
  const [msgWordsPromptVisible, setMsgWordsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");

  const promptTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptTextareaExpanded, setPromptTextareaExpanded] = useState(false);
  const [promptTextareaRows, setPromptTextareaRows] = useState(5);

  const promptSubtopicsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubtopicsTextareaExpanded, setPromptSubtopicsTextareaExpanded] = useState(false);
  const [promptSubtopicsTextareaRows, setPromptSubtopicsTextareaRows] = useState(5);

  const promptSubtopicsStatusTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptSubtopicsStatusTextareaExpanded, setPromptSubtopicsStatusTextareaExpanded] = useState(false);
  const [promptSubtopicsStatusTextareaRows, setPromptSubtopicsStatusTextareaRows] = useState(5);

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

  const promptTopicFrequencyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [promptTopicFrequencyTextareaExpanded, setPromptTopicFrequencyTextareaExpanded] = useState(false);
  const [promptTopicFrequencyTextareaRows, setPromptTopicFrequencyTextareaRows] = useState(5);

  useEffect(() => {
    async function fetchSubjectPromptById() {
      if (subjectId === -1) {
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
          setPromptSubtopicsStatusText([response.data.subject.subtopicsStatusPrompt, response.data.subject.subtopicsStatusPrompt]);
          setPromptQuestionText([response.data.subject.questionPrompt, response.data.subject.questionPrompt]);
          setPromptSolutionText([response.data.subject.solutionPrompt, response.data.subject.solutionPrompt]);
          setPromptAnswersText([response.data.subject.answersPrompt, response.data.subject.answersPrompt]);
          setPromptStoriesText([response.data.subject.vocabluaryPrompt, response.data.subject.vocabluaryPrompt]);
          setPromptWordsText([response.data.subject.wordsPrompt, response.data.subject.wordsPrompt]);
          setPromptChatText([response.data.subject.chatPrompt, response.data.subject.chatPrompt]);
          setPromptClosedSubtopicsText([response.data.subject.closedSubtopicsPrompt, response.data.subject.closedSubtopicsPrompt]);
          setPromptTopicExpansionText([response.data.subject.topicExpansionPrompt, response.data.subject.topicExpansionPrompt]);
          setPromptTopicFrequencyText([response.data.subject.topicFrequencyPrompt, response.data.subject.topicFrequencyPrompt]);
          setPromptSubtopicsTextOwn(response.data.subject.subtopicsPromptOwn);
          setPromptSubtopicsStatusTextOwn(response.data.subject.subtopicsStatusPromptOwn);
          setPromptClosedSubtopicsTextOwn(response.data.subject.closedSubtopicsPromptOwn)
          setPromptQuestionTextOwn(response.data.subject.questionPromptOwn);
          setPromptSolutionTextOwn(response.data.subject.solutionPromptOwn);
          setPromptAnswersTextOwn(response.data.subject.answersPromptOwn);
          setPromptStoriesTextOwn(response.data.subject.vocabluaryPromptOwn);
          setPromptWordsTextOwn(response.data.subject.wordsPromptOwn);
          setPromptChatTextOwn(response.data.subject.chatPromptOwn);
          setPromptTopicExpansionTextOwn(response.data.subject.topicExpansionPromptOwn);
          setPromptTopicFrequencyTextOwn(response.data.subject.topicFrequencyPromptOwn);
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

  function handleNextSubtopicsGenerateMsgCancel() {
    setMinSectionPart(1);
    setMsgNextSubtopicsGenerateVisible(false);
  }

  function handleNextSubtopicsStatusGenerateMsgCancel() {
    setMinSectionPart(1);
    setMsgNextSubtopicsStatusGenerateVisible(false);
  }

  function handleNextTopicExpansionsGenerateMsgCancel() {
    setMinSectionPart(1);
    setMsgNextTopicExpansionsGenerateVisible(false);
  }

  function handleNextWordsGenerateMsgCancel() {
    setMinSectionPart(1);
    setMsgNextWordsGenerateVisible(false);
  }

  function handleNextFrequencyGenerateMsgCancel() {
    setMinSectionPart(1);
    setMsgNextFrequencyGenerateVisible(false);
  }

  function handleSubjectSaveDataMsgCancel() {
    setMsgSubjectDataVisible(false);
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
      }, 2000);
    } catch (error: unknown) {
      handleApiError(error);
      setTimeout(() => {
        resetSpinner();
      }, 2000);
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

  function handleOpenMessageSaveSubjectData() {
    setMsgSubjectDataVisible(true);
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

  async function handleSaveSubjectData() {
    setMsgSubjectDataVisible(false);
    showSpinner(true, "Trwa zapisywanie danych...");

    try {
      const response = await saveSubjectData();

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
    setMsgNextSubtopicsGenerateVisible(false);
    await saveSubjectData();

    let lastPartId: number | null = null;
    let lastName: string | null = null;

    try {
      const sectionsResponse = await api.get<{ sections: Section[] }>(`/subjects/${subjectId}/sections/admin?minSectionPart=${minSectionPart}`);
      const sections = sectionsResponse.data.sections;

      for (const section of sections) {
        let sectionFailed = false;
        const sectionSubtopics: SectionSubtopic[] = [];

        for (const topic of section.topics) {
          showSpinner(true, `Generacja podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);

          const topicId = topic.id;
          let changed = "true";
          let attempt = 0;
          let subtopics: [string, number][] = [];
          let errors: string[] = [];
          const prompt = topic.subtopicsPrompt;
          const MAX_ATTEMPTS = 2;

          while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const subtopicsResponse = await api.post(`/subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics/generate`, {
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
            }
            else {
              showAlert(400, `Nie udało się zgenerować podtematy\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);
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
            showAlert(400, `Nie udało się poprawnie wygenerować podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);
            sectionFailed = true;
            break;
          }

          const MAX_DB_ATTEMPTS = 3;
          let dbAttempt = 0;
          let dbSuccess = false;
    
          while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
            try {
              await api.delete(
                `subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics`
              );

              await api.post(
                `subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics/admin/bulk`,
                { subtopics }
              );
    
              dbSuccess = true;
            } catch (err) {
              dbAttempt++;
              console.log(`DB attempt ${dbAttempt} failed`);
              if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
            }
          }

          sectionSubtopics.push(
            ...subtopics.map(s => ({
              topicId,
              subjectId,
              sectionId: section.id,
              name: s[0],
              importance: s[1],
              subtopics: []
            }))
          );

          showAlert(200, `Podtematy zostały zapisane dla Rozdział: ${section.name}\nTemat: ${topic.name}`);
        }

        if (!sectionFailed && sectionSubtopics.length > 0) {
          lastPartId = section.partId;
          lastName = section.name;
        } else if (sectionFailed) {
          setMinSectionPart(lastPartId ?? 1 + 1);
          showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
          resetSpinner();
          setMsgNextSubtopicsGenerateVisible(true);
          return;
        }
      }

      resetSpinner();
      setTextMessageOK(`Poprawnie zapisano wszystkie działy przedmiotu ${subjectName}`);
      setMsgOKVisible(true);
      setMinSectionPart(1);
    } catch (error: unknown) {
      setMinSectionPart(lastPartId ?? 1 + 1);
      handleApiError(error);
      showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
      resetSpinner();
      setMsgNextSubtopicsGenerateVisible(true);
    }
  }

  async function handleSubtopicsStatusGenerate() {
    setMsgSubtopicsStatusPromptVisible(false);
    setMsgNextSubtopicsStatusGenerateVisible(false);
    await saveSubjectData();

    let lastPartId: number | null = null;
    let lastName: string | null = null;

    try {
      const sectionsResponse = await api.get<{ sections: Section[] }>(`/subjects/${subjectId}/sections/admin?minSectionPart=${minSectionPart}`);
      const sections = sectionsResponse.data.sections;

      for (const section of sections) {
        let sectionFailed = false;
        const sectionSubtopics: SectionSubtopic[] = [];

        for (const topic of section.topics) {
          showSpinner(true, `Generacja ważności podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);

          const subtopicsStatusResponse = await api.get<{ subtopics: [string, string][] }>(
            `/subjects/${subjectId}/sections/${section.id}/topics/${topic.id}/subtopics/admin/status`
          );

          let subtopics: [string, string][] = subtopicsStatusResponse.data.subtopics;

          const topicId = topic.id;
          let changed = "true";
          let attempt = 0;
          let errors: string[] = [];
          const prompt = topic.subtopicsStatusPrompt;
          const MAX_ATTEMPTS = 2;

          while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const subtopicsStatusResponse = await api.post(`/subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics/status-generate`, {
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
                typeof s[1] !== "string"
            )
          ) {
            showAlert(400, `Nie udało się poprawnie wygenerować ważności podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);
            sectionFailed = true;
            break;
          }

          const MAX_DB_ATTEMPTS = 3;
          let dbAttempt = 0;
          let dbSuccess = false;
    
          while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
            try {
              await api.put(
                `subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics/admin/update`,
                { subtopics }
              );
    
              dbSuccess = true;
            } catch (err) {
              dbAttempt++;
              console.log(`DB attempt ${dbAttempt} failed`);
              if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
            }
          }

          sectionSubtopics.push(
            ...subtopics.map(s => ({
              topicId,
              subjectId,
              sectionId: section.id,
              name: s[0],
              detailLevel: s[1],
              subtopics: []
            }))
          );

          showAlert(200, `Podtematy zostały zapisane dla Rozdział: ${section.name}\nTemat: ${topic.name}`);
        }

        if (!sectionFailed && sectionSubtopics.length > 0) {
          lastPartId = section.partId;
          lastName = section.name;
        } else if (sectionFailed) {
          setMinSectionPart(lastPartId ?? 1 + 1);
          showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
          resetSpinner();
          setMsgNextSubtopicsStatusGenerateVisible(true);
          return;
        }
      }

      resetSpinner();
      setTextMessageOK(`Poprawnie zapisano wszystkie działy przedmiotu ${subjectName}`);
      setMsgOKVisible(true);
      setMinSectionPart(1);
    } catch (error: unknown) {
      setMinSectionPart(lastPartId ?? 1 + 1);
      handleApiError(error);
      showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
      resetSpinner();
      setMsgNextSubtopicsStatusGenerateVisible(true);
    }
  }

  async function handleTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(false);
    setMsgNextTopicExpansionsGenerateVisible(false);
    await saveSubjectData();

    let lastPartId: number | null = null;
    let lastName: string | null = null;

    try {
      const sectionsResponse = await api.get<{ sections: Section[] }>(`/subjects/${subjectId}/sections/admin?minSectionPart=${minSectionPart}`);
      const sections = sectionsResponse.data.sections;

      for (const section of sections) {
        let sectionFailed = false;

        for (const topic of section.topics) {
          const topicId = topic.id;
          const topicName = topic.name;
          const prompt = topic.topicExpansionPrompt;
          const subtopics: string[] = topic.subtopics.map(sub => sub.name);

          showSpinner(
            true,
            `Trwa generacja notatki tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topicName}`
          );

          const MAX_ATTEMPTS = 2;
          const CHUNK_SIZE = 5;
          const chunkNotes: string[] = [];
          const errors: string[] = [];

          const chunks: string[][] = [];
          for (let i = 0; i < subtopics.length; i += CHUNK_SIZE) {
            chunks.push(subtopics.slice(i, i + CHUNK_SIZE));
          }

          for (const subtopicChunk of chunks) {
            let changed = "true";
            let attempt = 0;
            let chunkNote = "";

            while (changed === "true" && attempt <= MAX_ATTEMPTS) {
              const topicExpansionResponse: { data: TopicExpansionChunkResponse } = await api.post(
                `/subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics/topic-expansion-generate`,
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
                sectionFailed = true;
                break;
              }
            }

            if (sectionFailed) break;
          }

          if (chunkNotes.length === 0) {
            showAlert(
              400,
              `Nie udało się wygenerować pełnej notatki dla tematu ${topicName}`
            );
            sectionFailed = true;
            break;
          }

          const fullNote = chunkNotes.join("\n\n");

          const MAX_DB_ATTEMPTS = 3;
          let dbAttempt = 0;
          let dbSuccess = false;
    
          while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
            try {
              await api.put(`/subjects/${subjectId}/sections/${section.id}/topics/${topicId}`, {
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

        if (!sectionFailed) {
          lastPartId = section.partId;
          lastName = section.name;
        } else {
          setMinSectionPart(lastPartId ?? 1 + 1);
          showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
          resetSpinner();
          setMsgNextTopicExpansionsGenerateVisible(true);
          return;
        }
      }

      resetSpinner();
      setTextMessageOK(`Poprawnie zapisano wszystkie działy przedmiotu ${subjectName}`);
      setMsgOKVisible(true);
      setMinSectionPart(1);
    } catch (error: unknown) {
      setMinSectionPart(lastPartId ?? 1 + 1);
      handleApiError(error);
      showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
      resetSpinner();
      setMsgNextTopicExpansionsGenerateVisible(true);
    }
  }

  async function handleTopicFrequencyGenerate() {
    setMsgTopicFrequencyPromptVisible(false);
    setMsgNextFrequencyGenerateVisible(false);
    await saveSubjectData();

    let lastPartId: number | null = null;
    let lastName: string | null = null;

    try {
        const sectionsResponse = await api.get<{ sections: Section[] }>(`/subjects/${subjectId}/sections/admin?minSectionPart=${minSectionPart}`);
        const sections = sectionsResponse.data.sections;

        for (const section of sections) {
            let sectionFailed = false;

            for (const topic of section.topics) {
                const topicId = topic.id;
                const topicName = topic.name;
                const prompt = topic.topicFrequencyPrompt;

                if (!prompt || prompt.trim() === '') {
                    showAlert(400, `Brak promptu do generacji częstotliwości dla tematu: ${topicName}`);
                    sectionFailed = true;
                    break;
                }

                const subtopics: string[] = topic.subtopics.map(sub => sub.name);

                showSpinner(
                    true,
                    `Trwa generacja częstotliwości tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topicName}`
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
                        `/subjects/${subjectId}/sections/${section.id}/topics/${topicId}/subtopics/frequency-generate`,
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
                        sectionFailed = true;
                        break;
                    }
                }

                if (!success) {
                    showAlert(
                        400,
                        `Nie udało się wygenerować częstotliwości dla tematu ${topicName} po ${attempt} próbach`
                    );
                    sectionFailed = true;
                    break;
                }

                const MAX_DB_ATTEMPTS = 3;
                let dbAttempt = 0;
                let dbSuccess = false;
          
                while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
                  try {
                    await api.put(`/subjects/${subjectId}/sections/${section.id}/topics/${topicId}`, {
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

            if (!sectionFailed) {
              lastPartId = section.partId;
              lastName = section.name;
            }
            else {
              setMinSectionPart(lastPartId ?? 1 + 1);
              showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
              resetSpinner();
              setMsgNextFrequencyGenerateVisible(true);
              return;
            }
        }

        resetSpinner();
        setTextMessageOK(`Poprawnie zapisano wszystkie działy przedmiotu ${subjectName}`);
        setMsgOKVisible(true);
        setMinSectionPart(1);
    } catch (error: unknown) {
      setMinSectionPart(lastPartId ?? 1 + 1);
      handleApiError(error);
      showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
      resetSpinner();
      setMsgNextFrequencyGenerateVisible(true);
    }
  }

  async function handleWordsGenerate() {
    setMsgWordsPromptVisible(false);
    setMsgNextWordsGenerateVisible(false);
    
    await saveSubjectData();

    let lastPartId: number | null = null;
    let lastName: string | null = null;

    try {
      const sectionsResponse = await api.get<{ sections: Section[] }>(`/subjects/${subjectId}/sections/admin?minSectionPart=${minSectionPart}&notStories=false`);
      const sections = sectionsResponse.data.sections;

      for (const section of sections) {
        let sectionFailed = false;
        const sectionWords: Word[] = [];

        for (const topic of section.topics) {
          showSpinner(true, `Generacja słów tematycznych dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);

          const topicId = topic.id;
          let changed = "true";
          let attempt = 0;
          let words: [string, number][] = [];
          let errors: string[] = [];
          const prompt = topic.wordsPrompt;
          const MAX_ATTEMPTS = 0;

          while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const wordsResponse = await api.post(`/subjects/${subjectId}/sections/${section.id}/topics/${topicId}/words/words-generate`, {
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
            } else {
              showAlert(400, `Nie udało się wygenerować słów tematycznych dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);
              sectionFailed = true;
              break;
            }
          }

          if (
            words.length === 0 ||
            words.some(
              w =>
                !Array.isArray(w) ||
                w.length !== 2 ||
                typeof w[0] !== "string" ||
                w[0].trim() === "" ||
                typeof w[1] !== "number"
            )
          ) {
            showAlert(400, `Nie udało się poprawnie wygenerować słów tematycznych dla:\nPrzedmiot: ${subjectName}\nRozdział: ${section.name}\nTemat: ${topic.name}`);
            sectionFailed = true;
            break;
          }

          const MAX_DB_ATTEMPTS = 3;
          let dbAttempt = 0;
          let dbSuccess = false;
    
          while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
            try {
              await api.delete(
                `subjects/${subjectId}/sections/${section.id}/topics/${topicId}/words`
              );

              await api.post(
                `subjects/${subjectId}/sections/${section.id}/topics/${topicId}/words`,
                { words }
              );
    
              dbSuccess = true;
            } catch (err) {
              dbAttempt++;
              console.log(`DB attempt ${dbAttempt} failed`);
              if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
            }
          }

          sectionWords.push(
            ...words.map(w => ({
              topicId,
              subjectId,
              sectionId: section.id,
              text: w[0],
              frequency: w[1],
              words: []
            }))
          );

          showAlert(200, `Słowy tematyczne zostały zapisane dla Rozdział: ${section.name}\nTemat: ${topic.name}`);
        }

        if (!sectionFailed && sectionWords.length > 0) {
          lastPartId = section.partId;
          lastName = section.name;
        } else if (sectionFailed) {
          setMinSectionPart(lastPartId ?? 1 + 1);
          showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
          resetSpinner();
          setMsgWordsPromptVisible(true);
          return;
        }
      }

      resetSpinner();
      setTextMessageOK(`Poprawnie zapisano wszystkie działy przedmiotu ${subjectName}`);
      setMsgOKVisible(true);
      setMinSectionPart(1);
    } catch (error: unknown) {
      setMinSectionPart(lastPartId ?? 1 + 1);
      handleApiError(error);
      showAlert(400, formatSuccessSections(lastPartId, lastName, subjectName));
      resetSpinner();
      setMsgWordsPromptVisible(true);
    }
  }

  function formatSuccessSections(
    lastPartId: number | null,
    lastName: string | null,
    subjectName: string
  ): React.ReactNode {
    if (!lastPartId && !lastName) {
      return <div>Nie zapisano żadnego rozdziału przedmiotu {subjectName}</div>;
    }
    else {
      return <div>Poprawnie zapisano ostatni dział  przedmiotu {subjectName}:<br />{lastPartId}. {lastName}</div>;
    }
  }

  async function saveSubjectData(data = {
    type: typeSubjectText,
    prompt: subjectPromptText,
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
        prompt: (Array.isArray(data.prompt) && data.prompt[0] !== data.prompt[1]) ? data.prompt[0] : undefined,
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

      return await api.put(`/subjects/${subjectId}`, processedData);
    } catch (error: unknown) {
      console.error(error);
    }
  }

  function handleMessageOK() {
    setMsgOKVisible(false);
    window.location.reload();
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
          message={`Czy na pewno chcesz dalej generować słowy kluczowe dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleWordsGenerate}
          onClose={handleNextWordsGenerateMsgCancel}
          visible={msgNextWordsGenerateVisible}
        />

        <Message 
          message={`Czy na pewno chcesz dalej generować podtematy dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsGenerate}
          onClose={handleNextSubtopicsGenerateMsgCancel}
          visible={msgNextSubtopicsGenerateVisible}
        />

        <Message 
          message={`Czy na pewno chcesz dalej generować ważności podtematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsStatusGenerate}
          onClose={handleNextSubtopicsStatusGenerateMsgCancel}
          visible={msgNextSubtopicsStatusGenerateVisible}
        />

        <Message 
          message={`Czy na pewno chcesz dalej generować notatkę tematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleTopicExpansionGenerate}
          onClose={handleNextTopicExpansionsGenerateMsgCancel}
          visible={msgNextTopicExpansionsGenerateVisible}
        />

        <Message 
          message={`Czy na pewno chcesz dalej generować częstotliwość tematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleTopicFrequencyGenerate}
          onClose={handleNextFrequencyGenerateMsgCancel}
          visible={msgNextFrequencyGenerateVisible}
        />

        <MessageOK 
          message={textMessageOK}
          onConfirm={handleMessageOK}
          visible={msgOKVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować słowy kluczowe dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleWordsGenerate}
          onClose={handleWordsPromptMsgCancel}
          visible={msgWordsPromptVisible}
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

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować ważności podtematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleSubtopicsStatusGenerate}
          onClose={handleSubtopicsStatusPromptMsgCancel}
          visible={msgSubtopicsStatusPromptVisible}
        />

        <Message 
          message={`Czy na pewno chcesz ponownie wygenerować notatkę tematów dla przedmiotu ${subjectName}?`}
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
              <br />
              {typeSubjectText[0] == "Language" ? (
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
              <br />
              <div style={{ margin: "4px 0px" }}>
                <button
                  className="button"
                  style={{
                    padding: "10px 54px",
                    backgroundColor: "darkgreen"
                  }}
                  onClick={handleOpenMessageSaveSubjectData}
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