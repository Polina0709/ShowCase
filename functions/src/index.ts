import * as functions from "firebase-functions";

export const hello = functions.https.onRequest((req, res) => {
    res.send("Hello from Cloud Functions!");
});
