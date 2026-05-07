'use client';

import "@/app/styles/components.css";
import "@/app/styles/main.css";
import { useState, useEffect, useRef } from "react";
import api from "@/app/utils/api";
import { showAlert } from "@/app/scripts/showAlert";
import Message from "@/app/components/message";
import Spinner from "@/app/components/spinner";
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
  errors: string[];
  attempt: number;
};

type ChronologyResponse = {
  statusCode: number;
  changed: string;
  outputSubtopics: [string, number][]
  errors: string[];
  attempt: number;
};

export default function SectionPage({ subjectId, sectionId }: SectionPageProps) {
  const [typeSectionText, setTypeSectionText] = useState(["", ""]);
  const [categorySectionText, setCategorySectionText] = useState(["", ""]);
  const [difficultySection, setDifficultySection] = useState(["", ""]);
  const [subjectName, setSubjectName] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [msgSectionDataVisible, setMsgSectionDataVisible] = useState(false);
  const [msgSubtopicsPromptVisible, setMsgSubtopicsPromptVisible] = useState(false);
  const [msgTopicExpansionPromptVisible, setMsgTopicExpansionPromptVisible] = useState(false);
  const [msgTopicFrequencyPromptVisible, setMsgTopicFrequencyPromptVisible] = useState(false);
  const [msgChronologyPromptVisible, setMsgChronologyPromptVisible] = useState(false);
  const [msgSubtopicsStatusPromptVisible, setMsgSubtopicsStatusPromptVisible] = useState(false);
  const [msgWordsPromptVisible, setMsgWordsPromptVisible] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");

  const [msgOKVisible, setMsgOKVisible] = useState(false);
  const [textMessageOK, setTextMessageOK] = useState("");
  
  useEffect(() => {
    async function fetchSectionPromptById() {
      showSpinner(true);

      try {
        const response = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}?withTopics=false&withSubtopics=false`);
        if (response.data?.statusCode === 200) {
          setSubjectName(response.data.subject.name);
          setSectionName(response.data.section.name);
          setTypeSectionText([response.data.section.type, response.data.section.type]);
          setCategorySectionText([response.data.section.category, response.data.section.category]);
          setDifficultySection([response.data.section.difficulty, response.data.section.difficulty]);
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

  function handleChronologyPromptMsgCancel() {
    setMsgChronologyPromptVisible(false);
  }

  function handleWordsPromptMsgCancel() {
    setMsgWordsPromptVisible(false);
  }

  function handleMessageOK() {
    setMsgOKVisible(false);
    window.location.reload();
  }

  function handleApiError(error: unknown) {
    const err = error as any;
    if (err?.response) {
      showAlert(err.response.status || 500, err.response.data?.message || err.message || "Server error");
    } 
    else if (error instanceof Error) {
      showAlert(500, error.message);
    }
    else {
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

  function handleOpenMessageSaveSectionData() {
    setMsgSectionDataVisible(true);
  }

  function handleOpenMessageTopicExpansionGenerate() {
    setMsgTopicExpansionPromptVisible(true);
  }

  function handleOpenMessageTopicFrequencyGenerate() {
    setMsgTopicFrequencyPromptVisible(true);
  }

  function handleOpenMessageChronologyGenerate() {
    setMsgChronologyPromptVisible(true);
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
      const response = await saveSectionData() as any;

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
      const topicsResponse = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        if (topicsResponse.data.topics[i].type === "Stories" || topicsResponse.data.topics[i].type === "Writing")
          continue;

        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
        
        let changed: string = "true";
        let attempt: number = 0;
        let subtopics: [string, number][] = [];
        let errors: string[] = [];
        const prompt: string = topicsResponse.data.subject.subtopicsPrompt;
        const MAX_ATTEMPTS = 2;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
          const subtopicsResponse = await api.post<any>(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/generate`, {
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
      const topicsResponse = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        if (topicsResponse.data.topics[i].type === "Stories" || topicsResponse.data.topics[i].type === "Writing")
          continue;
        
        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja ważności podtematów dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
        
        const subtopicsStatusResponse = await api.get<{ subtopics: [string, string][] }>(
          `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/admin/status`
        );

        let subtopics: [string, string][] = subtopicsStatusResponse.data.subtopics;

        let changed: string = "true";
        let attempt: number = 0;
        let errors: string[] = [];
        const prompt: string = topicsResponse.data.subject.subtopicsStatusPrompt;
        const MAX_ATTEMPTS = 2;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
          const subtopicsStatusResponse = await api.post<any>(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/status-generate`, {
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
      const topicsResponse = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}/topics`);
      const topics = topicsResponse.data.topics;

      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];

        if (topic.type === "Stories" || topic.type === "Writing")
          continue;

        const topicId: number = topic.id;
        const topicName: string = topic.name;
        const prompt: string = topicsResponse.data.subject.topicExpansionPrompt;
        const subtopics = topic.subtopics.map((sub: Subtopic) => sub.name);

        showSpinner(
          true,
          `Trwa generacja notatki tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicName}`
        );

        const MAX_ATTEMPTS = 2;
        const CHUNK_SIZE = 10;

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
      const topicsResponse = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}/topics`);
      const topics = topicsResponse.data.topics;

      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];
        const topicId: number = topic.id;
        const topicName: string = topic.name;
        const prompt: string = topicsResponse.data.subject.topicFrequencyPrompt;

        if (!prompt || prompt.trim() === '') {
          showAlert(400, `Brak promptu do generacji częstotliwości dla tematu: ${topicName}`);
          continue;
        }

        showSpinner(
          true,
          `Trwa generacja częstotliwości tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`
        );

        const MAX_ATTEMPTS = 2;
        const errors: string[] = [];
        
        let frequency = 0;
        let changed = "true";
        let attempt = 0;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const topicFrequencyResponse = await api.post<FrequencyResponse>(
              `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/frequency-generate`,
              {
                changed,
                frequency,
                errors,
                attempt,
                prompt,
              }
            );

            const data = topicFrequencyResponse.data;

            if (data.statusCode === 201) {
              changed = data.changed;
              frequency = data.frequency ?? 0;
              attempt = data.attempt;
            } else {
              showAlert(
                400,
                `Nie udało się wygenerować częstotliwości dla tematu: ${topicName}`
              );
              break;
            }
        }

        const MAX_DB_ATTEMPTS = 3;
        let dbAttempt = 0;
        let dbSuccess = false;

        while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
          try {
            await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, {
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

  async function handleChronologyGenerate() {
    setMsgChronologyPromptVisible(false);
    await saveSectionData();

    try {
      const topicsResponse = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}/topics`);
      const topics = topicsResponse.data.topics;

      for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
        const topic = topics[topicIndex];

        if (topic.type === "Stories" || topic.type === "Writing")
          continue;

        const topicId: number = topic.id;
        const topicName: string = topic.name;
        const prompt: string = topicsResponse.data.subject.chronologyPrompt;

        if (!prompt || prompt.trim() === '') {
          showAlert(400, `Brak promptu do generacji chronologii dla tematu: ${topicName}`);
          continue;
        }
        
        showSpinner(
          true,
          `Trwa generacja chronologii tematu dla:\nPrzedmiot: ${subjectName}\nRozdział: ${sectionName}\nTemat: ${topicName}`
        );

        const MAX_ATTEMPTS = 2;
        const errors: string[] = [];
        
        let outputSubtopics: [string, number][] = [];
        let changed = "true";
        let attempt = 0;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
            const chronologyResponse = await api.post<ChronologyResponse>(
              `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/chronology-generate`,
              {
                changed,
                errors,
                attempt,
                prompt,
                outputSubtopics
              }
            );

            const data = chronologyResponse.data;

            if (data.statusCode === 201) {
              changed = data.changed;
              outputSubtopics = data.outputSubtopics ?? [];
              attempt = data.attempt;
            } else {
              showAlert(
                400,
                `Nie udało się wygenerować częstotliwości dla tematu: ${topicName}`
              );
              break;
            }
        }

        const MAX_DB_ATTEMPTS = 3;
        let dbAttempt = 0;
        let dbSuccess = false;

        while (dbAttempt < MAX_DB_ATTEMPTS && !dbSuccess) {
          try {
            await api.put(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}`, {
              outputSubtopics
            });

            dbSuccess = true;
          } catch (err) {
            dbAttempt++;
            console.log(`DB attempt ${dbAttempt} failed`);
            if (dbAttempt >= MAX_DB_ATTEMPTS) throw err;
          }
        }

        showAlert(200, `Chronologia została zapisana dla tematu ${topicName}`);
      }

      resetSpinner();
      setTextMessageOK(`Chronologia została zapisana dla rozdziału ${topicsResponse.data.section.name}`);
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
      const topicsResponse = await api.get<any>(`/subjects/${subjectId}/sections/${sectionId}/topics`);

      for (let i = 0; i < topicsResponse.data.topics.length; i++) {
        if (topicsResponse.data.topics[i].type !== "Stories")
          continue;

        const topicId: number = topicsResponse.data.topics[i].id;
        showSpinner(true, `Trwa generacja słów tematycznych dla:\nPrzedmiot: ${subjectName}\nRozdział: ${topicsResponse.data.section.name}\nTemat: ${topicsResponse.data.topics[i].name}`);
        
        let changed: string = "true";
        let attempt: number = 0;
        let words: [string, number][] = [];
        let errors: string[] = [];
        const prompt: string = topicsResponse.data.subject.wordsPrompt;
        const MAX_ATTEMPTS = 0;

        while (changed === "true" && attempt <= MAX_ATTEMPTS) {
          const wordsResponse = await api.post<any>(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/words/words-generate`, {
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
    category: categorySectionText,
    difficulty: difficultySection
  }) {
    try {
      const processedData = {
        type: (Array.isArray(data.type) && data.type[0] !== data.type[1]) ? data.type[0] : undefined,
        category: (Array.isArray(data.category) && data.category[0] !== data.category[1]) ? data.category[0] : undefined,
        difficulty: (Array.isArray(data.difficulty) && data.difficulty[0] !== data.difficulty[1]) ? data.difficulty[0] : undefined,
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
          message={`Czy na pewno chcesz ponownie wygenerować chronologię tematów dla przedmiotu ${subjectName}?`}
          textConfirm="Tak"
          textCancel="Nie"
          onConfirm={handleChronologyGenerate}
          onClose={handleChronologyPromptMsgCancel}
          visible={msgChronologyPromptVisible}
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
              <div className="options-container">
                <label htmlFor="SectionCategory" className="label">Kategoria:</label>
                <input
                    id="SectionCategory"
                    name="text-container"
                    value={categorySectionText[0]}
                    onInput={(e) => {
                      setCategorySectionText([(e.target as HTMLTextAreaElement).value, categorySectionText[1]])
                    }}
                    className={`text-container own ${(categorySectionText[0] !== categorySectionText[1]) ? ' changed' : ''}`}
                    spellCheck={true}
                    placeholder="Proszę napisać kategorię rozdziału..."
                />
              </div>
              <div className="options-container">
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
              </div>
              <br />
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
                  onClick={handleOpenMessageChronologyGenerate}
                >
                  Generuj Chronologię
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