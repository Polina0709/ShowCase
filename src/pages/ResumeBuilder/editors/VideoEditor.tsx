import { useState, useRef } from "react";
import type { VideoSection } from "../../../types/resume";
import { uploadUserVideoWithProgress } from "../../../services/dbUsers";
import { useAuth } from "../../../hooks/useAuth";

interface Props {
    section: VideoSection;
    onChange: (data: {
        videoUrl: string;
        url: string;
    }) => void;
}

export default function VideoEditor({ section, onChange }: Props) {
    const { user } = useAuth();

    const currentUrl = section.data?.url ?? "";

    const [value, setValue] = useState(currentUrl);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const dropRef = useRef<HTMLDivElement | null>(null);

    /* ============================
       APPLY LINK
    ============================= */
    const applyLink = () => {
        const trimmed = value.trim();

        onChange({
            url: trimmed,
            videoUrl: trimmed
        });
    };

    /* ============================
       FILE UPLOAD
    ============================= */
    const handleFileUpload = async (file: File) => {
        if (!user) return;

        setUploading(true);
        setProgress(0);

        try {
            const uploadedUrl = await uploadUserVideoWithProgress(
                user.uid,
                file,
                (p) => setProgress(p)
            );

            setValue(uploadedUrl);

            onChange({
                url: uploadedUrl,
                videoUrl: uploadedUrl
            });

        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    /* ============================
       DRAG & DROP
    ============================= */
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        dropRef.current?.classList.add("dd-hover");
    };

    const onDragLeave = () => {
        dropRef.current?.classList.remove("dd-hover");
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dropRef.current?.classList.remove("dd-hover");
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileUpload(file);
    };

    /* ============================
       RENDER
    ============================= */
    return (
        <div className="inner-card" style={{ padding: "20px" }}>

            {/* URL INPUT */}
            <div className="inner-card" style={{ padding: "18px", marginBottom: "22px" }}>
                <p className="input-label" style={{ marginBottom: "8px" }}>
                    Insert a video link:
                </p>

                <input
                    className="round-input"
                    placeholder="https://youtube.com/watch?v=..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <button
                    onClick={applyLink}
                    className="purple-btn"
                    style={{ marginTop: "12px", width: "100%" }}
                >
                    Save Link
                </button>
            </div>

            {/* FILE UPLOAD */}
            <div className="inner-card" style={{ padding: "18px" }}>
                <p className="input-label" style={{ marginBottom: "10px" }}>
                    Or upload a video:
                </p>

                <div
                    ref={dropRef}
                    className="video-drop-area"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    Drag & Drop video here
                </div>

                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="round-input"
                    style={{ marginTop: "10px", padding: "10px" }}
                />

                {uploading && (
                    <div className="upload-progress">
                        <div
                            className="upload-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* PREVIEW */}
            {value && !uploading && (
                <div style={{ marginTop: "28px" }}>
                    <p className="input-label" style={{ marginBottom: "8px" }}>
                        Preview:
                    </p>

                    {value.includes("youtube") || value.includes("youtu.be") ? (
                        <iframe
                            className="video-preview"
                            src={value
                                .replace("watch?v=", "embed/")
                                .replace("youtu.be/", "youtube.com/embed/")
                            }
                            allowFullScreen
                        />
                    ) : (
                        <video className="video-preview" src={value} controls />
                    )}
                </div>
            )}
        </div>
    );
}

