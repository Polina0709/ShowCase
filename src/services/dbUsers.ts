import { ref, set, get } from "firebase/database";
import { db } from "./firebase";

/**
 * Створення запису користувача в DB після signup
 */
export const createUserRecord = async (
    uid: string,
    data: {
        name: string;
        lastName: string;
        email: string;
    }
) => {
    await set(ref(db, `users/${uid}`), {
        ...data,
        createdAt: Date.now(),
    });
};

/**
 * Отримання даних користувача
 */
export const getUserRecord = async (uid: string) => {
    const snapshot = await get(ref(db, `users/${uid}`));
    return snapshot.val();
};
