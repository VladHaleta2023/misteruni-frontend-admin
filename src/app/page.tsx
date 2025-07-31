'use client';

import { useCallback, useEffect, useState } from "react";
import Header from "@/app/components/header";
import SubjectPage from "@/app/components/subjectPage";
import SectionPage from "@/app/components/sectionPage";
import TopicPage from "./components/topicPage";

export default function Home() {
  const [subjectId, setSubjectId] = useState<number>(-1);
  const [sectionId, setSectionId] = useState<number>(-1);
  const [topicId, setTopicId] = useState<number>(-1);
  
  const updateFromStorage = useCallback(() => {
    const storedSubjectId = localStorage.getItem("subjectId");
    const storedSectionId = localStorage.getItem("sectionId");
    const storedTopicId = localStorage.getItem("topicId");

    if (storedSubjectId) {
      const parsedSubjectId = Number(storedSubjectId);
      setSubjectId(!isNaN(parsedSubjectId) ? parsedSubjectId : -1);
    } else {
      setSubjectId(-1);
    }

    if (storedSectionId) {
      const parsedSectionId = Number(storedSectionId);
      setSectionId(!isNaN(parsedSectionId) ? parsedSectionId : -1);
    } else {
      setSectionId(-1);
    }

    if (storedTopicId) {
      const parsedTopicId = Number(storedTopicId);
      setTopicId(!isNaN(parsedTopicId) ? parsedTopicId : -1);
    } else {
      setTopicId(-1);
    }
  }, []);

  useEffect(() => {
    updateFromStorage();
  }, [updateFromStorage]);

  const renderPage = () => {
    if (subjectId !== -1 && sectionId !== -1 && topicId !== -1)
      return <TopicPage subjectId={subjectId} sectionId={sectionId} topicId={topicId} />
    else if (subjectId !== -1 && sectionId !== -1 && topicId === -1)
      return <SectionPage subjectId={subjectId} sectionId={sectionId} />
    else if (subjectId !== -1 && sectionId === -1 && topicId === -1)
      return <SubjectPage subjectId={subjectId} />
    else
      return null;
  }

  return (
    <>
      <Header onUpdate={updateFromStorage} />
      {renderPage()}
    </>
  );
}