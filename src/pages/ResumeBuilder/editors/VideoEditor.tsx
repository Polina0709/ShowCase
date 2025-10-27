import type {VideoSection} from "../../../types/resume";

interface Props {
    section: VideoSection;
    update: (section: VideoSection) => void;
}

export default function VideoEditor({ section, update }: Props) {
    return (
        <div className="space-y-3">
            <input
                className="border rounded p-2 w-full"
                placeholder="YouTube Video URL"
                value={section.url || ""}
                onChange={(e) => update({ ...section, url: e.target.value })}
            />

            {section.url && (
                <iframe
                    className="w-full aspect-video rounded"
                    src={section.url.replace("watch?v=", "embed/")}
                    allowFullScreen
                ></iframe>
            )}
        </div>
    );
}
