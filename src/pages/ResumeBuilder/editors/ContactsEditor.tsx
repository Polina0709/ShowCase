import { useState, useEffect } from "react";
import type { ContactsSection, ResumeContactsData } from "../../../types/resume";

interface Props {
    section: ContactsSection;
    onChange: (data: ContactsSection["data"]) => void;
}

export default function ContactsEditor({ section, onChange }: Props) {
    const initial: ResumeContactsData = section.data ?? {};

    // ✅ Локальний стан — миттєвий, без лагів
    const [form, setForm] = useState<ResumeContactsData>(initial);

    // ✅ Якщо зовнішні дані змінилися — синхронізуємо
    useEffect(() => {
        setForm(initial);
    }, [section.data]);

    const updateField = (field: keyof ResumeContactsData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // ✅ Зберігаємо лише коли фокус пішов
    const commit = () => {
        onChange(form);
    };

    return (
        <div className="space-y-4 max-w-xl">

            <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                    className="input mt-1"
                    placeholder="example@gmail.com"
                    value={form.email ?? ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={commit}
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Phone</label>
                <input
                    className="input mt-1"
                    placeholder="+380 ..."
                    value={form.phone ?? ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    onBlur={commit}
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">LinkedIn</label>
                <input
                    className="input mt-1"
                    placeholder="https://linkedin.com/in/username"
                    value={form.linkedin ?? ""}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    onBlur={commit}
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">GitHub</label>
                <input
                    className="input mt-1"
                    placeholder="https://github.com/username"
                    value={form.github ?? ""}
                    onChange={(e) => updateField("github", e.target.value)}
                    onBlur={commit}
                />
            </div>

            <div>
                <label className="text-sm text-gray-600">Website / Portfolio</label>
                <input
                    className="input mt-1"
                    placeholder="https://my-portfolio.com"
                    value={form.portfolio ?? ""}
                    onChange={(e) => updateField("portfolio", e.target.value)}
                    onBlur={commit}
                />
            </div>

        </div>
    );
}

