import { useState, useRef } from "react";
import type { VideoSection } from "../../../types/resume";
import { uploadUserVideoWithProgress } from "../../../services/dbUsers";
import { useAuth } from "../../../hooks/useAuth";

interface Props {
    section: VideoSection;
    onChange: (data: VideoSection["data"]) => void;
}

export default function VideoEditor({ section, onChange }: Props) {
    const { user } = useAuth();

    const currentUrl = section.data?.url ?? "";
    const [value, setValue] = useState(currentUrl);

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const dropRef = useRef<HTMLDivElement | null>(null);

    // Apply link from input
    const applyLink = () => {
        const trimmed = value.trim();
        onChange({ url: trimmed });
    };

    // Upload handler
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
            onChange({ url: uploadedUrl });
        } finally {
            setUploading(false);
        }
    };

    // File select input
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    // ----- Drag and drop -----
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

    return (
        <div className="inner-card" style={{ padding: "20px" }}>

            {/* ===================== */}
            {/* 1 — INPUT BY URL     */}
            {/* ===================== */}
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

            {/* ===================== */}
            {/* 2 — FILE UPLOAD       */}
            {/* ===================== */}
            <div className="inner-card" style={{ padding: "18px" }}>
                <p className="input-label" style={{ marginBottom: "10px" }}>
                    Or upload a video:
                </p>

                {/* DRAG & DROP AREA */}
                <div
                    ref={dropRef}
                    className="video-drop-area"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    Drag & Drop video here
                </div>

                {/* FILE INPUT */}
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="round-input"
                    style={{ marginTop: "10px", padding: "10px" }}
                />

                {/* Upload progress bar */}
                {uploading && (
                    <div className="upload-progress">
                        <div
                            className="upload-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* ===================== */}
            {/* 3 — VIDEO PREVIEW     */}
            {/* ===================== */}
            {value && !uploading && (
                <div style={{ marginTop: "28px" }}>
                    <p className="input-label" style={{ marginBottom: "8px" }}>Preview:</p>

                    {/* YouTube */}
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
