import { useEffect, useRef, useState } from "react";
import { createResume, getUserResumes, deleteResume } from "../../services/dbResumes";
import type { Resume } from "../../types/resume";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import bg from "../../assets/bg.jpg";
import { getUserRecord, uploadUserPhoto } from "../../services/dbUsers";

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

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    useEffect(() => {
        if (!user) return;

        const unsubscribe = getUserResumes(user.uid, setResumes);

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

        return unsubscribe;
    }, [user]);

    const handleCreate = async () => {
        if (!user) return;
        const newResume = await createResume(user.uid);
        navigate(`/builder/${newResume.id}`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this resume permanently?")) return;
        await deleteResume(id);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const url = await uploadUserPhoto(user.uid, file);
        setProfile((prev) => ({ ...prev, photoURL: url }));
    };

    return (
        <div className="dash-root" style={{ backgroundImage: `url(${bg})` }}>
            {/* HEADER */}
            <header className="dash-header">
                <h1 className="dash-brand">SHOWCASE</h1>

                <div className="dash-header-actions">
                    <button onClick={handleLogout} className="dash-logout">
                        Logout
                    </button>
                </div>
            </header>

            {/* MAIN GRID */}
            <div className="dash-grid">
                {/* PROFILE PANEL */}
                <aside className="dash-profile">
                    <div className="dash-avatar-wrap">
                        <div className="dash-avatar">
                            {profile.photoURL ? (
                                <img src={profile.photoURL} alt="avatar" />
                            ) : (
                                <div className="dash-avatar-fallback">
                                    {(profile.name ?? "U")[0]}
                                </div>
                            )}
                        </div>

                        <button
                            className="dash-attach"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            📎
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handlePhotoUpload}
                        />
                    </div>

                    <button
                        className="dash-profile-edit"
                        onClick={() => navigate("/profile")}
                    >
                        Edit Profile
                    </button>

                    <div className="dash-name">
                        {(profile.name || "").toUpperCase()} {(profile.lastName || "").toUpperCase()}
                    </div>

                    {(profile.city || profile.country) && (
                        <div className="dash-muted">
                            {profile.city}
                            {profile.city && profile.country ? ", " : ""}
                            {profile.country}
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

                {/* RESUME LIST */}
                <section className="dash-resumes">

                    {/* CASE 1 — NO RESUMES */}
                    {resumes.length === 0 && (
                        <button className="dash-first-card" onClick={handleCreate}>
                            <div className="dash-first-plus">+</div>
                            <div className="dash-first-text">
                                ADD <br /> YOUR FIRST CV
                            </div>
                        </button>
                    )}

                    {/* CASE 2 — RESUME GRID */}
                    {resumes.length > 0 && (
                        <div className="dash-cards">

                            {/* Resume cards */}
                            {resumes.map((resume) => (
                                <div
                                    key={resume.id}
                                    className={`dash-card ${resume.isPublished ? "" : "draft"}`}
                                    onClick={() => navigate(`/builder/${resume.id}`)}
                                >
                                    {!resume.isPublished && (
                                        <div className="dash-card-badge">DRAFT</div>
                                    )}

                                    <div className="dash-card-title">{resume.title}</div>

                                    <div className="dash-card-meta">
                                        <span>{resume.views} views</span>
                                    </div>

                                    <button
                                        className="dash-card-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(resume.id);
                                        }}
                                    >
                                        ✕
                                    </button>

                                    {resume.isPublished && (
                                        <a
                                            href={`/r/${resume.id}`}
                                            className="dash-card-view"
                                            target="_blank"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View →
                                        </a>
                                    )}
                                </div>
                            ))}

                            {/* Floating + but positioned after all cards */}
                            <button className="dash-add-circle" onClick={handleCreate}>
                                +
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

