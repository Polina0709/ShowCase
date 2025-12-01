import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    type User,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { ref, get, set } from "firebase/database";

/**
 * Sign up using email and password
 */
export async function signupWithEmail(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
}

/**
 * Login using email and password
 */
export async function loginWithEmail(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
}

/**
 * Sign in with Google (popup)
 */
export async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    const user = userCredential.user;
    if (!user) return userCredential;

    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
        const [name = "", lastName = ""] = (user.displayName ?? "").split(" ");

        await set(userRef, {
            name,
            lastName,
            email: user.email,
            photoURL: user.photoURL ?? null,
            createdAt: Date.now(),
        });
    }

    return userCredential;
}

/**
 * Update user's displayName (shown in Firebase Auth user object)
 */
export async function updateUserProfile(displayName: string) {
    const user = auth.currentUser;

    if (!user) throw new Error("No authenticated user");

    await updateProfile(user, { displayName });
}

/**
 * Log out
 */
export async function logout() {
    await signOut(auth);
}

/**
 * Helper to get current user safely (typed)
 */
export function getCurrentUser(): User | null {
    return auth.currentUser;
}
