'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import Header from "@/app/components/header";
import { useRouter } from 'next/navigation';
import Spinner from "../components/spinner";
import { ChevronDown, ChevronUp } from "lucide-react";
import "@/app/styles/components.css";
import "@/app/styles/main.css";
import api from "../utils/api";
import showAlert from "../scripts/showAlert";
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
        const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || "210");
        const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop || "0");
        const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom || "0");
        const totalPadding = paddingTop + paddingBottom;

        const rows = Math.floor((textarea.scrollHeight - totalPadding) / lineHeight);
        return rows;
    }

    const updateHeader = useCallback(() => {
        router.push('/'); 
    }, []);

    function handleAddSubtopicCancel() {
        router.push('/');
    }

    async function handleAddSubtopicSubmit() {
        showSpinner(true, "Trwa dodawanie podtematu...");

        try {
            const response = await api.post(`/subjects/${subjectId}/sections/${sectionId}/topics/${topicId}/subtopics`, {
                name: typeSubtopicAddText,
            });

            showAlert(response.data.statusCode, response.data.message);

            setTimeout(() => {
                resetSpinner();
                if (response.data.statusCode === 201)
                    router.push("/");
            }, 1000);
        }
        catch (error: unknown) {
            handleApiError(error);
            setTimeout(() => {
                resetSpinner();
            }, 1000);
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
        <Header onUpdate={updateHeader} />
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