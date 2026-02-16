'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import HeaderDropDown from "@/app/components/headerDropDown";
import { useRouter } from 'next/navigation';
import Spinner from "../components/spinner";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import "@/app/styles/components.css";
import "@/app/styles/main.css";
import "@/app/styles/alert.css";
import api from "../utils/api";
import { showAlert } from "../scripts/showAlert";
import axios from "axios";

export default function EditSubtopic() {
    const router = useRouter();
    
    const [loading, setLoading] = useState(true);
    const [spinnerText, setSpinnerText] = useState("Ładowanie podtematu...");

    const [typeSubtopicEditText, setTypeSubtopicEditText] = useState("");

    const typeSubtopicEditTextareaRef = useRef<HTMLTextAreaElement>(null);
    const [typeSubtopicEditTextareaExpanded, setPromptSubtopicsTextareaExpanded] = useState(false);
    const [typeSubtopicEditTextareaRows, setPromptSubtopicsTextareaRows] = useState(5);

    const [subjectId, setSubjectId] = useState<number>(-1);
    const [sectionId, setSectionId] = useState<number>(-1);
    const [topicId, setTopicId] = useState<number>(-1);
    const [subtopicId, setSubtopicId] = useState<number>(-1);

    const handleLogout = async () => {
        showSpinner(true, "");

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
            resetSpinner();

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

    const updateFromStorage = useCallback(() => {
        const storedSubjectId = localStorage.getItem("subjectId");
        const storedSectionId = localStorage.getItem("sectionId");
        const storedTopicId = localStorage.getItem("topicId");
        const storedSubtopicId = localStorage.getItem("subtopicId");

        setSubjectId(storedSubjectId ? Number(storedSubjectId) || -1 : -1);
        setSectionId(storedSectionId ? Number(storedSectionId) || -1 : -1);
        setTopicId(storedTopicId ? Number(storedTopicId) || -1 : -1);
        setSubtopicId(storedSubtopicId ? Number(storedSubtopicId) || -1 : -1);
    }, []);

    const fetchSubtopic = useCallback(async () => {
        if (subtopicId === -1) return;

        try {
            const response = await api.get(
                `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/${subtopicId}`
            );
            setTypeSubtopicEditText(response.data.subtopic.name);
        } catch (error: unknown) {
            handleApiError(error);
            setLoading(false);
        }
    }, [subtopicId, subjectId, sectionId, topicId]);

    const updateHeader = useCallback(() => {
        localStorage.removeItem("subtopicId");
        router.push('/dashboard');
    }, [router]);

    useEffect(() => {
        updateFromStorage();
    }, [updateFromStorage]);

    useEffect(() => {
        if (subjectId !== -1 && sectionId !== -1 && topicId !== -1 && subtopicId !== -1) {
            fetchSubtopic();
        }
    }, [subjectId, sectionId, topicId, subtopicId, fetchSubtopic]);

    useEffect(() => {
        if (typeSubtopicEditText !== "" && subtopicId !== -1) {
            setLoading(false);
        }
    }, [typeSubtopicEditText, subtopicId]);

    function showSpinner(visible: boolean, text: string = "") {
        setLoading(visible);
        setSpinnerText(text);
    }

    function resetSpinner() {
        setLoading(false);
        setSpinnerText("");
    }

    function toggleSubtopicEditTextarea() {
        if (typeSubtopicEditTextareaRef.current) {
            if (!typeSubtopicEditTextareaExpanded) {
                const rows = calculateRows(typeSubtopicEditTextareaRef.current);
                setPromptSubtopicsTextareaRows(rows);
            } else {
                setPromptSubtopicsTextareaRows(5);
            }
        }

        setPromptSubtopicsTextareaExpanded(prev => !prev);
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

    function handleEditSubtopicCancel() {
        localStorage.removeItem("subtopicId");
        router.push('/dashboard');
    }

    async function handleEditSubtopicSubmit() {
        showSpinner(true, "Trwa aktualizacja podtematu...");

        try {
            const response = await api.put(
                `/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics/${subtopicId}`,
                { name: typeSubtopicEditText }
            );

            showAlert(response.data.statusCode, response.data.message);

            resetSpinner();
            if (response.data.statusCode === 200) {
                localStorage.removeItem("subtopicId");
                router.push("/dashboard");
            }
        } catch (error: unknown) {
            handleApiError(error);
            resetSpinner();
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

    return (
        <>
            <HeaderDropDown onUpdate={updateHeader}>
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
            <main>
                <div className={loading ? "container-center" : ""}>
                    {loading ? (
                        <div className="spinner-wrapper">
                            <Spinner text={spinnerText} />
                        </div>
                    ) : (
                        <>
                            <div className="options-container">
                                {typeSubtopicEditTextareaExpanded ? (
                                    <ChevronUp
                                        size={28}
                                        style={{ top: "28px" }}
                                        className="btnTextAreaOpen"
                                        onClick={toggleSubtopicEditTextarea}
                                    />
                                ) : (
                                    <ChevronDown
                                        size={28}
                                        style={{ top: "28px" }}
                                        className="btnTextAreaOpen"
                                        onClick={toggleSubtopicEditTextarea}
                                    />
                                )}

                                <label htmlFor="EditSubtopic" className="label">
                                    Nazwa Podtematu:
                                </label>

                                <textarea
                                    id="EditSubtopic"
                                    rows={typeSubtopicEditTextareaRows}
                                    ref={typeSubtopicEditTextareaRef}
                                    name="text-container"
                                    value={typeSubtopicEditText}
                                    onInput={(e) =>
                                        setTypeSubtopicEditText((e.target as HTMLTextAreaElement).value)
                                    }
                                    className="text-container"
                                    spellCheck={true}
                                    placeholder="Proszę napisać nazwę podtematu..."
                                />
                            </div>

                            <div style={{ marginTop: "4px", display: "flex" }}>
                                <button
                                    className="button"
                                    style={{ padding: "10px 24px", marginRight: "12px" }}
                                    onClick={handleEditSubtopicSubmit}
                                >
                                    Aktualizować
                                </button>

                                <button
                                    className="button cancel"
                                    style={{ padding: "10px 24px" }}
                                    onClick={handleEditSubtopicCancel}
                                >
                                    Anuluj
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}