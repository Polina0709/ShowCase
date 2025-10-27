import type {Resume} from "../../types/resume";
import { Link } from "react-router-dom";

interface Props {
    resume: Resume;
    onDelete: (id: string) => void;
}

export const ResumeCard = ({ resume, onDelete }: Props) => {
    return (
        <div className="border rounded-xl p-4 shadow-sm bg-white flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{resume.title}</h3>

                <span
                    className={`text-xs px-2 py-1 rounded ${
                        resume.isPublished ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                    }`}
                >
          {resume.isPublished ? "Published" : "Draft"}
        </span>
            </div>

            <p className="text-sm text-gray-500">
                Last updated: {new Date(resume.lastUpdated).toLocaleString()}
            </p>

            <p className="text-xs text-gray-400">
                Views: {resume.views}
            </p>

            <div className="flex gap-2 mt-auto">
                <Link
                    to={`/builder/${resume.id}`}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md"
                >
                    Edit
                </Link>

                {resume.isPublished && (
                    <Link
                        to={`/r/${resume.id}`}
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md"
                    >
                        View
                    </Link>
                )}

                <button
                    onClick={() => onDelete(resume.id)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-md"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};
