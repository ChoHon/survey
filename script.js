// Firebase SDK import (CDN 사용)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtOOLO66RbPiaJu8NHeV6dloT1MeUlhM4",
  authDomain: "test-78d71.firebaseapp.com",
  projectId: "test-78d71",
  storageBucket: "test-78d71.firebasestorage.app",
  messagingSenderId: "37584604720",
  appId: "1:37584604720:web:712c728408c1ac2c80a7f5",
  measurementId: "G-EE36ZB4LHR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Survey form handling
const surveyForm = document.getElementById("surveyForm");
const messageElement = document.getElementById("message");

surveyForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // 폼 기본 제출 방지

  const name = document.getElementById("name").value;
  const favoriteColor = document.querySelector(
    'input[name="favoriteColor"]:checked',
  )?.value;
  const comments = document.getElementById("comments").value;

  try {
    // Firestore에 데이터 추가
    const docRef = await addDoc(collection(db, "surveyResponses"), {
      name: name,
      favoriteColor: favoriteColor,
      comments: comments,
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    showMessage("설문조사가 성공적으로 제출되었습니다!", "success");
    surveyForm.reset(); // 폼 초기화
  } catch (e) {
    console.error("Error adding document: ", e);
    showMessage(
      "설문조사 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
      "error",
    );
  }
});

function showMessage(msg, type) {
  messageElement.textContent = msg;
  messageElement.className = ""; // 기존 클래스 제거
  messageElement.classList.add(
    type === "success" ? "success-message" : "error-message",
  );
  messageElement.classList.remove("hidden");
  setTimeout(() => {
    messageElement.classList.add("hidden");
  }, 5000); // 5초 후 메시지 숨김
}
