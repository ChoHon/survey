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

function parseNumber(value) {
  if (value == null) return 0;
  const normalized = String(value).replace(/,/g, "").trim();
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

function bindContainerVehicleConsignedCalc() {
  const totalEl = document.getElementById("containerVehicleTotal");
  const directEl = document.getElementById("containerVehicleDirect");
  const consignedEl = document.getElementById("containerVehicleConsigned");

  if (!totalEl || !directEl || !consignedEl) return;

  const update = () => {
    const total = parseNumber(totalEl.value);
    const direct = parseNumber(directEl.value);
    const consigned = total - direct;
    consignedEl.textContent = Number.isFinite(consigned)
      ? String(consigned)
      : "";
  };

  totalEl.addEventListener("input", update);
  directEl.addEventListener("input", update);
  update();
}

bindContainerVehicleConsignedCalc();

function bindB2CoastalCalc() {
  const totalEl = document.getElementById("b2-total");
  const roadEl = document.getElementById("b2-road");
  const railEl = document.getElementById("b2-rail");
  const coastalEl = document.getElementById("b2-coastal");

  if (!totalEl || !roadEl || !railEl || !coastalEl) return;

  const update = () => {
    const total = parseNumber(totalEl.value);
    const road = parseNumber(roadEl.value);
    const rail = parseNumber(railEl.value);
    const coastal = total - road - rail;
    coastalEl.textContent = Number.isFinite(coastal) ? String(coastal) : "";
  };

  totalEl.addEventListener("input", update);
  roadEl.addEventListener("input", update);
  railEl.addEventListener("input", update);
  update();
}

bindB2CoastalCalc();

function bindB3SumCalc() {
  const under9El = document.getElementById("b3-under9-number");
  const under100El = document.getElementById("b3-under100-number");
  const over100El = document.getElementById("b3-over100-number");
  const sumEl = document.getElementById("b3-number-sum");

  if (!under9El || !under100El || !over100El || !sumEl) return;

  const update = () => {
    const under9 = parseNumber(under9El.value);
    const under100 = parseNumber(under100El.value);
    const over100 = parseNumber(over100El.value);
    const sum = under9 + under100 + over100;
    sumEl.textContent = Number.isFinite(sum) ? String(sum) : "";
  };

  under9El.addEventListener("input", update);
  under100El.addEventListener("input", update);
  over100El.addEventListener("input", update);
  update();
}

bindB3SumCalc();

function bindB3PercentageCalc() {
  const under9El = document.getElementById("b3-under9-percent");
  const under100El = document.getElementById("b3-under100-percent");
  const over100El = document.getElementById("b3-over100-percent");

  if (!under9El || !under100El || !over100El) return;

  const update = () => {
    const under9 = parseNumber(under9El.value);
    const under100 = parseNumber(under100El.value);
    const over100 = 100 - under9 - under100;
    over100El.textContent = Number.isFinite(over100) ? String(over100) : "";
  };

  under9El.addEventListener("input", update);
  under100El.addEventListener("input", update);
  over100El.addEventListener("input", update);
  update();
}

bindB3PercentageCalc();

function bindB5PercentageCalc() {
  const samedayEl = document.getElementById("b5-same-day");
  const nextdayEl = document.getElementById("b5-next-day");
  const withinawekEl = document.getElementById("b5-within-a-week");
  const overaweekEl = document.getElementById("b5-over-a-week");

  if (!samedayEl || !nextdayEl || !withinawekEl || !overaweekEl) return;

  const update = () => {
    const sameday = parseNumber(samedayEl.value);
    const nextday = parseNumber(nextdayEl.value);
    const withinawek = parseNumber(withinawekEl.value);
    const overaweek = 100 - sameday - nextday - withinawek;
    overaweekEl.textContent = Number.isFinite(overaweek)
      ? String(overaweek)
      : "";
  };

  samedayEl.addEventListener("input", update);
  nextdayEl.addEventListener("input", update);
  withinawekEl.addEventListener("input", update);
  update();
}

bindB5PercentageCalc();

function bindB6VolumeCalc() {
  const totalEl = document.getElementById("b6-volume-total");
  const exportEl = document.getElementById("b6-volume-export");
  const importEl = document.getElementById("b6-volume-import");
  const railEl = document.getElementById("b6-volume-rail");
  const roadEl = document.getElementById("b6-volume-road");

  if (!totalEl || !exportEl || !importEl || !railEl || !roadEl) return;

  const update = () => {
    const volumeTotal = parseNumber(totalEl.value);
    const volumeExport = parseNumber(exportEl.value);
    const volumeImport = volumeTotal - volumeExport;
    importEl.textContent = Number.isFinite(volumeImport)
      ? String(volumeImport)
      : "";

    const volumeRail = parseNumber(railEl.value);
    const volumeRoad = volumeTotal - volumeRail;
    roadEl.textContent = Number.isFinite(volumeRoad) ? String(volumeRoad) : "";
  };

  totalEl.addEventListener("input", update);
  exportEl.addEventListener("input", update);
  railEl.addEventListener("input", update);
  update();
}

bindB6VolumeCalc();

if (surveyForm) {
  surveyForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지

    const nameEl = document.getElementById("name");
    const commentsEl = document.getElementById("comments");
    const name = nameEl ? nameEl.value : "";
    const favoriteColor = document.querySelector(
      'input[name="favoriteColor"]:checked',
    )?.value;
    const comments = commentsEl ? commentsEl.value : "";

    try {
      // Firestore에 데이터 추가
      const docRef = await addDoc(collection(db, "surveyResponses"), {
        name: name,
        favoriteColor: favoriteColor,
        comments: comments,
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      if (messageElement)
        showMessage("설문조사가 성공적으로 제출되었습니다!", "success");
      surveyForm.reset(); // 폼 초기화
    } catch (e) {
      console.error("Error adding document: ", e);
      if (messageElement) {
        showMessage(
          "설문조사 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
          "error",
        );
      }
    }
  });
}

function showMessage(msg, type) {
  if (!messageElement) return;
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
