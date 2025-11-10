import { ref as dbRef, get, update } from "firebase/database";
import { db, storage } from "./firebase";
import {
    ref as storageRef,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";

/**
 * Отримання даних користувача
 */
export const getUserRecord = async (uid: string) => {
    const snapshot = await get(dbRef(db, `users/${uid}`));
    return snapshot.val();
};

/**
 * Завантаження фото користувача
 */
export const uploadUserPhoto = async (uid: string, file: File) => {
    const fileRef = storageRef(storage, `users/${uid}/profilePhoto.jpg`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    await new Promise<void>((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, resolve);
    });

    const url = await getDownloadURL(fileRef);
    await update(dbRef(db, `users/${uid}`), { photoURL: url });
    return url;
};

/**
 * ✅ Завантаження відео користувача + прогрес
 */
export async function uploadUserVideoWithProgress(
    uid: string,
    file: File,
    onProgress: (percent: number) => void
) {
    const fileRef = storageRef(storage, `user_videos/${uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Promise<string>((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress(Math.round(percent));
            },
            reject,
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
            }
        );
    });
}
