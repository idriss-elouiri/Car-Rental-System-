import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBAS_URL,
  authDomain: "mern-estate-fb7ab.firebaseapp.com",
  projectId: "mern-estate-fb7ab",
  storageBucket: "mern-estate-fb7ab.appspot.com",
  messagingSenderId: "807852899237",
  appId: "1:807852899237:web:fd28d58ac4bd2b17ca864c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

async function initAnalytics() {
  const analyticsSupported = await isSupported();
  if (analyticsSupported) {
    const analytics = getAnalytics(app);
  }
}

if (typeof window !== "undefined") {
  initAnalytics();
}
