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

    const applyLink = () => {
        onChange({ url: value.trim() });
    };

    const handleFile = async (file: File) => {
        if (!user) return;
        setUploading(true);
        setProgress(0);

        try {
            const uploadedUrl = await uploadUserVideoWithProgress(user.uid, file, (p) =>
                setProgress(p)
            );
            setValue(uploadedUrl);
            onChange({ url: uploadedUrl });
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    // ---- DRAG & DROP HANDLERS ----
    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        dropRef.current?.classList.add("ring", "ring-blue-400");
    };

    const onDragLeave = () => {
        dropRef.current?.classList.remove("ring", "ring-blue-400");
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dropRef.current?.classList.remove("ring", "ring-blue-400");
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    return (
        <div className="space-y-6 max-w-xl">

            {/* ВАРІАНТ 1: ЛІНК */}
            <div className="p-4 border rounded-lg space-y-3 bg-white">
                <p className="text-sm text-gray-600">Insert a video link:</p>

                <input
                    className="input"
                    placeholder="https://youtube.com/watch?v=..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />

                <button
                    onClick={applyLink}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Save Link
                </button>
            </div>

            {/* ВАРІАНТ 2: ЗАВАНТАЖЕННЯ */}
            <div className="p-4 border rounded-lg bg-white space-y-4">
                <p className="text-sm text-gray-600">Or upload a video:</p>

                {/* DRAG & DROP AREA */}
                <div
                    ref={dropRef}
                    className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500 cursor-pointer transition"
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    Drag & Drop video here
                </div>

                {/* FILE INPUT */}
                <input type="file" accept="video/*" onChange={handleFileSelect} />

                {/* PROGRESS BAR */}
                {uploading && (
                    <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            {/* ПРЕВ'Ю */}
            {value && !uploading && (
                <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>

                    {value.includes("youtube") || value.includes("youtu.be") ? (
                        <iframe
                            className="w-full rounded aspect-video"
                            src={value
                                .replace("watch?v=", "embed/")
                                .replace("youtu.be/", "youtube.com/embed/")
                            }
                            allowFullScreen
                        />
                    ) : (
                        <video className="w-full rounded" src={value} controls />
                    )}
                </div>
            )}
        </div>
    );
}
