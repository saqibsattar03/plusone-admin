// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyApw1DJOH2WxO3ZBX_t3opoB0R-YDIkwog",
    authDomain: "rrestapp.firebaseapp.com",
    projectId: "rrestapp",
    storageBucket: "rrestapp.appspot.com",
    messagingSenderId: "340474485320",
    appId: "1:340474485320:web:f61abd44fc8a287325d67d",
    measurementId: "G-81HT1F35G1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseStorage = getStorage(app);