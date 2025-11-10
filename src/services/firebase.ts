import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCyYT8gR0wdUDFvsMHi0i3GS1DFa00cLFc",
    authDomain: "showcase-33bff.firebaseapp.com",
    databaseURL: "https://showcase-33bff-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "showcase-33bff",
    storageBucket: "showcase-33bff.firebasestorage.app",
    messagingSenderId: "123336267781",
    appId: "1:123336267781:web:24e8679b143c44794b246c"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
