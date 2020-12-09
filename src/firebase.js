import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCJ8SjElIJwUXYHX_Xw_46IFh2uln6IalY",
    authDomain: "instagram-clone-r-7f2ce.firebaseapp.com",
    projectId: "instagram-clone-r-7f2ce",
    storageBucket: "instagram-clone-r-7f2ce.appspot.com",
    messagingSenderId: "236611678404",
    appId: "1:236611678404:web:b10e6b8f73687cb892d991",
    measurementId: "G-MQCRHGVEQ7"
})

const db = firebaseApp.firestore()
// User authentication
const auth = firebase.auth()
// Image storage
const storage = firebase.storage()

export {db,auth,storage}