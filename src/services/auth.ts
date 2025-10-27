import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const signupWithEmail = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider);

export const updateUserProfile = (displayName: string) =>
    updateProfile(auth.currentUser!, { displayName });
