import { useEffect, useRef, useState } from "react";
import { createResume, getUserResumes } from "../../services/dbResumes";
import type { Resume } from "../../types/resume";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import bg from "../../assets/bg.jpg";
import { getUserRecord } from "../../services/dbUsers";

type UserProfile = {
    name?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    city?: string;
    country?: string;
    photoURL?: string;
};

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [profile, setProfile] = useState<UserProfile>({});
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!user) return;

        getUserResumes(user.uid, setResumes);

        (async () => {
            const p = await getUserRecord(user.uid);
            setProfile({
                name: p?.name,
                lastName: p?.lastName,
                email: p?.email,
                phone: p?.phone,
                linkedin: p?.linkedin,
                city: p?.city,
                country: p?.country,
                photoURL: p?.photoURL || user.photoURL || "",
            });
        })();
    }, [user]);

    const handleCreate = async () => {
        if (!user) return;
        const newResume = await createResume(user.uid);
        navigate(`/builder/${newResume.id}`);
    };

    return (
        <div className="dash-root" style={{ backgroundImage: `url(${bg})` }}>
            {/* HEADER */}
            <header className="dash-header">
                <h1 className="dash-brand">SHOWCASE</h1>
                <button className="dash-gear">⚙️</button>
            </header>

            {/* SEARCH ROW */}
            <div className="dash-search-row">
                <div className="dash-search">
                    <button onClick={handleCreate} className="dash-add">+</button>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="dash-grid">
                {/* PROFILE PANEL */}
                <aside className="dash-profile">
                    <div className="dash-avatar-wrap">
                        <div className="dash-avatar">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} />
                            ) : (
                                <div className="dash-avatar-fallback">
                                    {(profile.name ?? "U")[0]}
                                </div>
                            )}
                        </div>
                        <button className="dash-attach" onClick={() => fileInputRef.current?.click()}>
                            📎
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" hidden />
                    </div>

                    <div className="dash-name">
                        {(profile.name || "").toUpperCase()} {(profile.lastName || "").toUpperCase()}
                    </div>

                    {(profile.city || profile.country) && (
                        <div className="dash-muted">
                            {profile.city}{profile.city && profile.country ? ", " : ""}{profile.country}
                        </div>
                    )}

                    <div className="dash-info">
                        <label>Phone number:</label>
                        <div>{profile.phone || "—"}</div>

                        <label>Email:</label>
                        <div>{profile.email}</div>

                        <label>LinkedIn:</label>
                        <div>{profile.linkedin || "—"}</div>
                    </div>
                </aside>

                {/* RESUME AREA */}
                <section className="dash-resumes">
                    {resumes.length === 0 ? (
                        <button onClick={handleCreate} className="dash-empty">
                            <span className="dash-empty-plus">+</span>
                            <span>ADD<br/>YOUR FIRST CV</span>
                        </button>
                    ) : (
                        <div className="dash-cards">
                            {resumes.map((resume) => (
                                <div key={resume.id} className="dash-card" onClick={() => navigate(`/builder/${resume.id}`)}>
                                    <div className="dash-card-title">{resume.title}</div>
                                    <div className="dash-card-meta">
                                        <span>{resume.isPublished ? "Published" : "Draft"}</span>
                                        <span>•</span>
                                        <span>{resume.views} views</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

