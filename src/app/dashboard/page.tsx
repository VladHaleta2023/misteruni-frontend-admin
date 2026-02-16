'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderDropDown from "@/app/components/headerDropDown";
import SubjectPage from "@/app/components/subjectPage";
import SectionPage from "@/app/components/sectionPage";
import TopicPage from "@/app/components/topicPage";
import { LogOut } from "lucide-react";
import api from "../utils/api";
import { showAlert } from "../scripts/showAlert";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();
  
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

  const handleLogout = async () => {
    try {
      const response = await api.post("/auth/logout");

      if (response.data?.statusCode === 200) {
        localStorage.removeItem("weekOffset");
        localStorage.removeItem("subjectId");
        localStorage.removeItem("sectionId");
        localStorage.removeItem("topicId");
        localStorage.removeItem("subtopicId");
        localStorage.removeItem("subjectType");

        showAlert(response.data.statusCode, response.data.message);
        
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error: unknown) {

      if (axios.isAxiosError(error)) {
        if (error.response) {
          showAlert(error.response.status, error.response.data?.message || "Server error");
        } else {
          showAlert(500, `Server error: ${error.message}`);
        }
      } else if (error instanceof Error) {
        showAlert(500, error.message);
      } else {
        showAlert(500, "Unknown error");
      }
    }
  };

  const renderPage = () => {
    if (subjectId !== -1 && sectionId !== -1 && topicId !== -1)
      return <TopicPage subjectId={subjectId} sectionId={sectionId} topicId={topicId} />
    else if (subjectId !== -1 && sectionId !== -1 && topicId === -1)
      return <SectionPage subjectId={subjectId} sectionId={sectionId} />
    else if (subjectId !== -1 && sectionId === -1 && topicId === -1)
      return <SubjectPage subjectId={subjectId} />
  }

  return (
    <>
      <HeaderDropDown onUpdate={updateFromStorage}>
        <div className="menu-icons">
          <div
            className="menu-icon"
            onClick={handleLogout}
            style={{ marginLeft: "auto" }}
            title={"Wyloguj się"}
          >
            <LogOut size={28} color="white" />
          </div>
        </div>
      </HeaderDropDown>
      {renderPage()}
    </>
  );
}