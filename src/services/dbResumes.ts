import {
    ref,
    push,
    set,
    onValue,
    update,
    remove,
    get,
} from "firebase/database";
import { db } from "./firebase";
import type {Resume} from "../types/resume";
import { query, orderByChild, equalTo } from "firebase/database";

/**
 * Створення нового резюме (чернетки)
 */
export const createResume = async (uid: string) => {
    const resumeRef = push(ref(db, "resumes")); // генеруємо унікальний ID
    const id = resumeRef.key as string;

    const newResume: Resume = {
        id,
        owner: uid,
        title: "Untitled Resume",
        sections: [],
        isPublished: false,
        lastUpdated: Date.now(),
        views: 0,
    };

    await set(resumeRef, newResume);
    return newResume;
};

/**
 * Отримання одного резюме за ID
 */
export const getResumeById = async (resumeId: string) => {
    const snapshot = await get(ref(db, `resumes/${resumeId}`));
    return snapshot.val() as Resume | null;
};

/**
 * Реaltime listener на резюме за ID
 * (використовується у Resume Builder для auto-update)
 */
export const listenToResume = (resumeId: string, cb: (res: Resume) => void) => {
    onValue(ref(db, `resumes/${resumeId}`), (snap) => {
        const data = snap.val();
        if (data) cb(data as Resume);
    });
};

/**
 * Отримання всіх резюме користувача (Dashboard list)
 */
export const getUserResumes = (uid: string, cb: (r: Resume[]) => void) => {
    const resumesQuery = query(
        ref(db, "resumes"),
        orderByChild("owner"),
        equalTo(uid)
    );

    const unsubscribe = onValue(resumesQuery, (snap) => {
        const data = snap.val();
        if (!data) {
            cb([]); // немає резюме → повертаємо пустий масив
            return;
        }
        cb(Object.values(data));
    });

    return () => unsubscribe();
};

/**
 * Оновлення резюме (Autosave)
 */
export const updateResume = async (
    resumeId: string,
    changes: Partial<Resume>
) => {
    return update(ref(db, `resumes/${resumeId}`), {
        ...changes,
        lastUpdated: Date.now(),
    });
};

/**
 * Видалення резюме
 */
export const deleteResume = async (resumeId: string) => {
    return remove(ref(db, `resumes/${resumeId}`));
};

/**
 * Публікація резюме (для публічного доступу без Auth)
 */
export const publishResume = async (resumeId: string) => {
    return update(ref(db, `resumes/${resumeId}`), {
        isPublished: true,
        lastUpdated: Date.now(),
    });
};

/**
 * Приховування резюме
 */
export const unpublishResume = async (resumeId: string) => {
    return update(ref(db, `resumes/${resumeId}`), {
        isPublished: false,
        lastUpdated: Date.now(),
    });
};
