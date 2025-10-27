import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {Resume} from "../../types/resume";
import { listenToResume, updateResume } from "../../services/dbResumes";
import SectionSidebar from "./SectionSidebar";
import SectionEditor from "./SectionEditor";

export default function ResumeBuilder() {
    const { resumeId } = useParams();
    const [resume, setResume] = useState<Resume | null>(null);
    const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!resumeId) return;
        listenToResume(resumeId, setResume);
    }, [resumeId]);

    const saveChanges = (changes: Partial<Resume>) => {
        if (!resumeId) return;
        if (saveTimer) clearTimeout(saveTimer);

        const timer = setTimeout(() => {
            updateResume(resumeId, changes);
        }, 600);

        setSaveTimer(timer);
    };

    if (!resume) {
        return <div className="p-6">Loading resume...</div>;
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <SectionSidebar resume={resume} saveChanges={saveChanges} />

            {/* Editor area */}
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-4">
                    <input
                        className="text-3xl font-bold w-full border-b border-gray-200 outline-none"
                        value={resume.title}
                        onChange={(e) => saveChanges({ title: e.target.value })}
                    />

                    <div className="flex gap-2 ml-4">
                        {resume.isPublished ? (
                            <button
                                onClick={() => saveChanges({ isPublished: false })}
                                className="bg-yellow-600 text-white px-3 py-2 rounded"
                            >
                                Unpublish
                            </button>
                        ) : (
                            <button
                                onClick={() => saveChanges({ isPublished: true })}
                                className="bg-green-600 text-white px-3 py-2 rounded"
                            >
                                Publish
                            </button>
                        )}
                    </div>
                </div>

                <SectionEditor resume={resume} saveChanges={saveChanges} />
            </div>
        </div>
    );
}
