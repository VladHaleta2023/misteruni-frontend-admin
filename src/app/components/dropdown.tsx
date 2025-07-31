'use client';

import React, { useState, useRef, useEffect } from "react";
import "@/app/styles/globals.css";
import "@/app/styles/dropdown.css";
import api from "@/app/utils/api";
import showAlert from "@/app/scripts/showAlert";
import axios from "axios";
import Spinner from "@/app/components/spinner";
import FormatText from "@/app/components/formatText";

interface Topic {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
  topics: Topic[];
}

interface Subject {
  id: number;
  name: string;
  sections: Section[];
}

interface DropdownProps {
  onUpdate: () => void;
}

export default function Dropdown({ onUpdate }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [openSubjectIds, setOpenSubjectIds] = useState<Set<number>>(new Set());
  const [openSectionIds, setOpenSectionIds] = useState<Set<number>>(new Set());

  const [activeSubjectId, setActiveSubjectId] = useState<number | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<number | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectSubject = (id: number) => {
    setActiveSubjectId(id);
    setActiveSectionId(null);
    setActiveTopicId(null);

    localStorage.setItem("subjectId", String(id));
    localStorage.setItem("sectionId", "");
    localStorage.setItem("topicId", "");

    setOpenSubjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    onUpdate();
  };

  const selectSection = (subjectId: number, id: number) => {
    setActiveSubjectId(null);
    setActiveSectionId(id);
    setActiveTopicId(null);

    localStorage.setItem("subjectId", String(subjectId));
    localStorage.setItem("sectionId", String(id));
    localStorage.setItem("topicId", "");

    setOpenSectionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    onUpdate();
  };

  const selectTopic = (subjectId: number, sectionId: number, id: number) => {
    setActiveSubjectId(null);
    setActiveSectionId(null);
    setActiveTopicId(id);

    localStorage.setItem("subjectId", String(subjectId));
    localStorage.setItem("sectionId", String(sectionId));
    localStorage.setItem("topicId", String(id));

    onUpdate();
  };

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const response = await api.get("/subjects");
        if (response.data?.statusCode === 200) {
          const fetchedSubjects: Subject[] = response.data.subjects;
          setSubjects(fetchedSubjects);

          const storedSubjectId = localStorage.getItem("subjectId");
          const storedSectionId = localStorage.getItem("sectionId");
          const storedTopicId = localStorage.getItem("topicId");

          const parsedSubjectId = storedSubjectId ? Number(storedSubjectId) : null;
          const parsedSectionId = storedSectionId ? Number(storedSectionId) : null;
          const parsedTopicId = storedTopicId ? Number(storedTopicId) : null;

          if (parsedTopicId !== null && parsedSectionId !== null && parsedSubjectId !== null) {
            setActiveTopicId(parsedTopicId);
            setOpenSubjectIds(new Set([parsedSubjectId]));
            setOpenSectionIds(new Set([parsedSectionId]));
          } else if (parsedSectionId !== null) {
            setActiveSectionId(parsedSectionId);
            let subjectIdForSection: number | null = null;
            for (const subj of fetchedSubjects) {
              if (subj.sections.find((sec) => sec.id === parsedSectionId)) {
                subjectIdForSection = subj.id;
                break;
              }
            }

            if (subjectIdForSection !== null) {
              setOpenSubjectIds(new Set([subjectIdForSection]));
            }

            setOpenSectionIds(new Set());
          } else if (parsedSubjectId !== null) {
            setActiveSubjectId(parsedSubjectId);
            setOpenSubjectIds(new Set());
          } else if (fetchedSubjects.length > 0) {
            const firstSubject = fetchedSubjects[0];
            setActiveSubjectId(firstSubject.id);
            setOpenSubjectIds(new Set());

            localStorage.setItem("subjectId", String(firstSubject.id));
            localStorage.setItem("sectionId", "");
            localStorage.setItem("topicId", "");

            onUpdate();
          }
        } else {
          showAlert(response.data.statusCode, response.data.message);
        }
      } catch (error: unknown) {
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
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, [onUpdate]);

  return (
    <div className="dropdown no-select word-break" ref={dropdownRef}>
      <button
        className="dropbtn"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Toggle menu"
        onClick={toggleDropdown}
      >
        <div className="menuLine"></div>
        <div className="menuLine"></div>
        <div className="menuLine"></div>
      </button>

      <div className={`dropdown-content ${isOpen ? "show" : ""}`}>
        {loading ? (
          <div className="spinner-wrapper">
            <Spinner noText />
          </div>
        ) : (
          subjects.map((subject) => {
            const isSubjectOpen = openSubjectIds.has(subject.id);
            const isActiveSubject = activeSubjectId === subject.id;
            const hasSections = subject.sections.length > 0;

            return (
              <div key={subject.id}>
                <div
                  className={`element subject ${isActiveSubject ? "active" : ""}`}
                  onClick={() => selectSubject(subject.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      selectSubject(subject.id);
                    }
                  }}
                >
                  <span>
                    <FormatText content={subject.name} />
                  </span>
                  {hasSections && <span className="dropIcon">▼</span>}
                </div>

                <div className={`sections ${isSubjectOpen ? "show" : ""}`}>
                  {subject.sections.map((section) => {
                    const isSectionOpen = openSectionIds.has(section.id);
                    const isActiveSection = activeSectionId === section.id;
                    const hasTopics = section.topics.length > 0;

                    return (
                      <div key={section.id}>
                        <div
                          className={`element section ${isActiveSection ? "active" : ""}`}
                          onClick={() => selectSection(subject.id, section.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              selectSection(subject.id, section.id);
                            }
                          }}
                        >
                          <span>
                            <FormatText content={section.name} />
                          </span>
                          {hasTopics && <span className="dropIcon">▼</span>}
                        </div>

                        <div className={`topics ${isSectionOpen ? "show" : ""}`}>
                          {section.topics.map((topic) => {
                            const isActiveTopic = activeTopicId === topic.id;
                            return (
                              <div
                                key={topic.id}
                                className={`element topic ${isActiveTopic ? "active" : ""}`}
                                onClick={() => selectTopic(subject.id, section.id, topic.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    selectTopic(subject.id, section.id, topic.id);
                                  }
                                }}
                              >
                                <FormatText content={topic.name} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}