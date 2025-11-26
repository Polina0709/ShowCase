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
import type { Resume } from "../types/resume";
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
        lastViewedBy: {}, // <-- нове поле для аналітики
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
 */
export const listenToResume = (resumeId: string, cb: (res: Resume) => void) => {
    onValue(ref(db, `resumes/${resumeId}`), (snap) => {
        const data = snap.val();
        if (data) cb(data as Resume);
    });
};

/**
 * Отримання всіх резюме користувача (Dashboard)
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
            cb([]);
            return;
        }
        cb(Object.values(data));
    });

    return () => unsubscribe();
};

/**
 * Оновлення резюме (autosave)
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
 * Публікація
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

/**
 * 🔥 АНАЛІТИКА ПЕРЕГЛЯДІВ РЕЗЮМЕ
 *
 * - Не рахує автора
 * - Рахує унікальні перегляди раз на 24 години
 * - Працює для анонімних і авторизованих
 */
export const addResumeView = async (
    resumeId: string,
    viewerId: string | null
) => {
    const resumeRef = ref(db, `resumes/${resumeId}`);
    const snap = await get(resumeRef);

    if (!snap.exists()) return;

    const resume = snap.val() as Resume;
    const now = Date.now();

    // Автор → не рахуємо
    if (viewerId && viewerId === resume.owner) return;

    const viewLog: Record<string, number> = resume.lastViewedBy || {};

    // Авторизований юзер
    if (viewerId) {
        // Переглядав за останні 24 години?
        if (viewLog[viewerId] && now - viewLog[viewerId] < 86400000) {
            return;
        }
        viewLog[viewerId] = now;
    } else {
        // Анонімний користувач
        const anonKey = `anon_${Math.floor(now / 86400000)}`;
        if (viewLog[anonKey] && now - viewLog[anonKey] < 86400000) {
            return;
        }
        viewLog[anonKey] = now;
    }

    await update(resumeRef, {
        views: (resume.views ?? 0) + 1,
        lastViewedBy: viewLog,
        lastUpdated: Date.now(),
    });
};


