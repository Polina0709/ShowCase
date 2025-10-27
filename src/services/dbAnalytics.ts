import { ref, set } from "firebase/database";
import { db } from "./firebase";

export const initAnalytics = (resumeId: string) => {
    set(ref(db, `analytics/${resumeId}`), {
        views: 0,
        sectionViews: {},
        projectClicks: {}
    });
};
