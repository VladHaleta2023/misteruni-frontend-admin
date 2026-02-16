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

export default function AddSubtopic() {
    const router = useRouter();
    const [spinnerVisible, setSpinnerVisible] = useState(false);
    
    const [spinnerText, setSpinnerText] = useState("");

    const [typeSubtopicAddText, setTypeSubtopicAddText] = useState("");

    const typeSubtopicAddTextareaRef = useRef<HTMLTextAreaElement>(null);
    const [typeSubtopicAddTextareaExpanded, setPromptSubtopicsTextareaExpanded] = useState(false);
    const [typeSubtopicAddTextareaRows, setPromptSubtopicsTextareaRows] = useState(5);

    const [subjectId, setSubjectId] = useState<number>(-1);
    const [sectionId, setSectionId] = useState<number>(-1);
    const [topicId, setTopicId] = useState<number>(-1);

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

    const updateHeader = useCallback(() => {
        router.push('/dashboard'); 
    }, [router]);

    useEffect(() => {
        updateFromStorage();
    }, [updateFromStorage]);

    function showSpinner(visible: boolean, text: string = "") {
        setSpinnerVisible(visible);
        setSpinnerText(text);
    }

    function resetSpinner() {
        setSpinnerVisible(false);
        setSpinnerText("");
    }

    function toggleSubtopicAddTextarea() {
        if (typeSubtopicAddTextareaRef.current) {
            if (!typeSubtopicAddTextareaExpanded) {
                const rows = calculateRows(typeSubtopicAddTextareaRef.current);
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

    function handleAddSubtopicCancel() {
        router.push('/dashboard');
    }

    async function handleAddSubtopicSubmit() {
        showSpinner(true, "Trwa dodawanie podtematu...");

        try {
            const response = await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics`, {
                name: typeSubtopicAddText,
            });

            showAlert(response.data.statusCode, response.data.message);

            resetSpinner();
            if (response.data.statusCode === 201)
                router.push("/dashboard");
        }
        catch (error: unknown) {
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

    return (<>
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
            <div className={spinnerVisible ? "container-center" : ""}>
                {spinnerVisible ? (
                    <div className="spinner-wrapper">
                        <Spinner text={spinnerText} />
                    </div>
                ) : (
                    <>
                        <div className="options-container">
                            {typeSubtopicAddTextareaExpanded ?
                            <ChevronUp
                                size={28}
                                style={{top: "28px"}}
                                className="btnTextAreaOpen"
                                onClick={toggleSubtopicAddTextarea}
                            /> :
                            <ChevronDown
                                size={28}
                                style={{top: "28px"}}
                                className="btnTextAreaOpen"
                                onClick={toggleSubtopicAddTextarea}
                            />
                            }
                            <label htmlFor="AddSubtopic" className="label">Nazwa Podtematu:</label>
                            <textarea
                                id="AddSubtopic"
                                rows={typeSubtopicAddTextareaRows}
                                ref={typeSubtopicAddTextareaRef}
                                name="text-container"
                                value={typeSubtopicAddText}
                                onInput={(e) => setTypeSubtopicAddText((e.target as HTMLTextAreaElement).value)}
                                className="text-container"
                                spellCheck={true}
                                placeholder="Proszę napisać nazwę podtamatu..."
                            />
                        </div>
                        <div style={{
                            marginTop: "4px",
                            display: "flex",
                        }}>
                            <button
                                className="button"
                                style={{ padding: "10px 24px", marginRight: "12px" }}
                                onClick={handleAddSubtopicSubmit}
                                >
                                    Dodać
                            </button>
                            <button
                                className="button cancel"
                                style={{ padding: "10px 24px" }}
                                onClick={handleAddSubtopicCancel}
                                >
                                    Anuluj
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    </>);
}