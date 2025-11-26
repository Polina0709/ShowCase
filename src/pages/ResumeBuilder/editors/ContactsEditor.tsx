import { useState, useEffect } from "react";
import type { ContactsSection, ResumeContactsData } from "../../../types/resume";

interface Props {
    section: ContactsSection;
    onChange: (data: ContactsSection["data"]) => void;
}

export default function ContactsEditor({ section, onChange }: Props) {
    const initial: ResumeContactsData = section.data ?? {};

    // локальний стан — миттєвий, без лагів
    const [form, setForm] = useState<ResumeContactsData>(initial);

    // синхронізація ззовні (коли міняється секція)
    useEffect(() => {
        setForm(initial);
    }, [section.id]);

    // оновлення конкретного поля
    const updateField = (field: keyof ResumeContactsData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    // відправляємо у resume тільки після завершення вводу
    const commit = () => {
        onChange(form);
    };

    return (
        <div>
            <br/>
            {/* Email */}
            <div style={{ marginBottom: "14px"}}>
                <label className="input-label">Email</label>
                <input
                    className="round-input"
                    placeholder="example@gmail.com"
                    value={form.email ?? ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={commit}
                />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "14px" }}>
                <label className="input-label">Phone</label>
                <input
                    className="round-input"
                    placeholder="+380 ..."
                    value={form.phone ?? ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    onBlur={commit}
                />
            </div>

            {/* LinkedIn */}
            <div style={{ marginBottom: "14px" }}>
                <label className="input-label">LinkedIn</label>
                <input
                    className="round-input"
                    placeholder="https://linkedin.com/in/username"
                    value={form.linkedin ?? ""}
                    onChange={(e) => updateField("linkedin", e.target.value)}
                    onBlur={commit}
                />
            </div>

            {/* GitHub */}
            <div style={{ marginBottom: "14px" }}>
                <label className="input-label">GitHub</label>
                <input
                    className="round-input"
                    placeholder="https://github.com/username"
                    value={form.github ?? ""}
                    onChange={(e) => updateField("github", e.target.value)}
                    onBlur={commit}
                />
            </div>

            {/* Portfolio */}
            <div style={{ marginBottom: "4px" }}>
                <label className="input-label">Portfolio / Website</label>
                <input
                    className="round-input"
                    placeholder="https://my-portfolio.com"
                    value={form.portfolio ?? ""}
                    onChange={(e) => updateField("portfolio", e.target.value)}
                    onBlur={commit}
                />
            </div>
        </div>
    );
}


