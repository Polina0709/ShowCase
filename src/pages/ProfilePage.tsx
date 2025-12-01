import { useEffect, useRef, useState } from "react";
import { getUserRecord, uploadUserPhoto } from "../services/dbUsers";
import { useAuth } from "../hooks/useAuth";
import { update } from "firebase/database";
import { db } from "../services/firebase";
import { ref as dbRef } from "firebase/database";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bg.jpg";
import "./ProfilePage.css";

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [form, setForm] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: "",
        linkedin: "",
        city: "",
        country: "",
        photoURL: "",
    });

    useEffect(() => {
        if (!user) return;
        getUserRecord(user.uid).then((data) => {
            if (data) setForm((f) => ({ ...f, ...data }));
        });
    }, [user]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!user) return;
        await update(dbRef(db, `users/${user.uid}`), form);
        navigate("/dashboard");
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        const url = await uploadUserPhoto(user.uid, file);
        setForm((prev) => ({ ...prev, photoURL: url }));
    };

    return (
        <div className="profile-root" style={{ backgroundImage: `url(${bg})` }}>

            <header className="profile-header">
                <h1 className="profile-title">SHOWCASE</h1>
            </header>

            <div className="profile-card">

                <div className="profile-photo" onClick={() => fileInputRef.current?.click()}>
                    {form.photoURL ? (
                        <img src={form.photoURL} alt="user" />
                    ) : (
                        <span className="profile-photo-placeholder">
                            +<br />ADD<br />PHOTO
                        </span>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhotoUpload}
                    />
                </div>

                <div className="profile-input-row">
                    <input
                        placeholder="Name..."
                        value={form.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                    />
                    <input
                        placeholder="Last Name..."
                        value={form.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                </div>

                <input
                    placeholder="email..."
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />

                <input
                    placeholder="Phone number..."
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                />

                <input
                    placeholder="LinkedIn..."
                    value={form.linkedin}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                />

                <input
                    placeholder="City, Country"
                    value={
                        [form.city, form.country].filter(Boolean).join(", ")
                    }
                    onChange={(e) => {
                        const value = e.target.value;

                        const commaCount = (value.match(/,/g) || []).length;
                        if (commaCount > 1) return;

                        const [cityPart, countryPart] = value.split(",").map((v) => v.trim());

                        handleChange("city", cityPart ?? "");
                        handleChange("country", countryPart ?? "");
                    }}
                />


                <button className="profile-save" onClick={handleSave}>
                    SAVE
                </button>
            </div>
        </div>
    );
}
