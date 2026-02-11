// Firebase SDK import (CDN 사용)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

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

function parseNumber(value) {
  if (value == null) return 0;

  const normalized = String(value).replace(/,/g, "").trim();
  const n = Number(normalized);

  return Number.isFinite(n) ? n : 0;
}

// ===== 설문조사 계산 =====

// B1-2 컨테이너 위수탁 차량수 계산
function bindContainerVehicleConsignedCalc() {
  const totalEl = document.getElementById("containerVehicleTotal");
  const directEl = document.getElementById("containerVehicleDirect");
  const consignedEl = document.getElementById("containerVehicleConsigned");

  if (!totalEl || !directEl || !consignedEl) return;

  const update = () => {
    const total = parseNumber(totalEl.value);
    const direct = parseNumber(directEl.value);
    const consigned = total - direct;
    consignedEl.textContent = Number.isFinite(consigned) ? String(consigned) : "";
  };

  totalEl.addEventListener("input", update);
  directEl.addEventListener("input", update);
  update();
}
bindContainerVehicleConsignedCalc();

// B2 연안해운 운송량 계산
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

// B3 합계 계산
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

// B3 퍼센트 계산
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

// B5 퍼센트 계산
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
    overaweekEl.textContent = Number.isFinite(overaweek) ? String(overaweek) : "";
  };

  samedayEl.addEventListener("input", update);
  nextdayEl.addEventListener("input", update);
  withinawekEl.addEventListener("input", update);
  update();
}
bindB5PercentageCalc();

// B6 운송량 계산
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
    importEl.textContent = Number.isFinite(volumeImport) ? String(volumeImport) : "";

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

// ===== 다중 페이지 설문조사 데이터 관리 =====

// A 페이지 데이터 저장
function savePageAData() {
  const data = {
    respondentName: document.getElementById("respondentName")?.value || "",
    respondentDepartment: document.getElementById("respondentDepartment")?.value || "",
    respondentPosition: document.getElementById("respondentPosition")?.value || "",
    respondentPhone: document.getElementById("respondentPhone")?.value || "",
    respondentEmail: document.getElementById("respondentEmail")?.value || "",
    companyName: document.getElementById("companyName")?.value || "",
    companyAddress: document.getElementById("companyAddress")?.value || "",
  };
  sessionStorage.setItem("surveyPageA", JSON.stringify(data));
  return data;
}

// A 페이지 데이터 불러오기
function loadPageAData() {
  const saved = sessionStorage.getItem("surveyPageA");
  return saved ? JSON.parse(saved) : null;
}

// A 페이지 폼에 데이터 채우기
function fillPageAForm(data) {
  if (!data) return;

  if (data.respondentName) document.getElementById("respondentName").value = data.respondentName;
  if (data.respondentDepartment) document.getElementById("respondentDepartment").value = data.respondentDepartment;
  if (data.respondentPosition) document.getElementById("respondentPosition").value = data.respondentPosition;
  if (data.respondentPhone) document.getElementById("respondentPhone").value = data.respondentPhone;
  if (data.respondentEmail) document.getElementById("respondentEmail").value = data.respondentEmail;
  if (data.companyName) document.getElementById("companyName").value = data.companyName;
  if (data.companyAddress) document.getElementById("companyAddress").value = data.companyAddress;
}

// A 페이지 필수 항목 검증
function validatePageA() {
  const requiredFields = [
    { id: "respondentName", label: "응답자 성명" },
    { id: "respondentDepartment", label: "소속부서명" },
    { id: "respondentPosition", label: "직위" },
    { id: "respondentPhone", label: "전화번호" },
    { id: "respondentEmail", label: "이메일" },
    { id: "companyName", label: "사업체명" },
    { id: "companyAddress", label: "주소" },
  ];

  const emptyFields = [];

  for (const field of requiredFields) {
    const element = document.getElementById(field.id);
    const value = element?.value?.trim();

    if (!value) {
      emptyFields.push(field.label);
      // 빈 필드에 시각적 표시
      if (element) {
        element.style.borderColor = "red";
        element.style.borderWidth = "2px";
      }

      element.addEventListener("input", () => {
        element.style.borderColor = "";
        element.style.borderWidth = "";
      });
      // } else {
      //   // 입력된 필드는 원래 스타일로 복원
      //   if (element) {
      //     element.style.borderColor = "";
      //     element.style.borderWidth = "";
      //   }
    }
  }

  if (emptyFields.length > 0) {
    alert(`다음 항목을 입력해주세요:\n\n${emptyFields.join("\n")}`);
    return false;
  }

  return true;
}

// B 페이지 데이터 수집
function collectPageBData() {
  const getRadioValue = (name) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.id : "";
  };

  return {
    numberOfEmployees: document.getElementById("numberOfEmployees")?.value || "",
    containerVehicleTotal: document.getElementById("containerVehicleTotal")?.value || "",
    containerVehicleDirect: document.getElementById("containerVehicleDirect")?.value || "",
    privateVehicle: document.getElementById("privateVehicle")?.value || "",
    annualRevenueTotal: document.getElementById("annualRevenueTotal")?.value || "",
    annualRevenueInland: document.getElementById("annualRevenueInland")?.value || "",
    b2Total: document.getElementById("b2-total")?.value || "",
    b2Road: document.getElementById("b2-road")?.value || "",
    b2Rail: document.getElementById("b2-rail")?.value || "",
    b3Under9Number: document.getElementById("b3-under9-number")?.value || "",
    b3Under9Percent: document.getElementById("b3-under9-percent")?.value || "",
    b3Under100Number: document.getElementById("b3-under100-number")?.value || "",
    b3Under100Percent: document.getElementById("b3-under100-percent")?.value || "",
    b3Over100Number: document.getElementById("b3-over100-number")?.value || "",
    b4Selection: getRadioValue("b4"),
    b5SameDay: document.getElementById("b5-same-day")?.value || "",
    b5NextDay: document.getElementById("b5-next-day")?.value || "",
    b5WithinAWeek: document.getElementById("b5-within-a-week")?.value || "",
    b6InlandSido: document.getElementById("b6-inland-sido")?.value || "",
    b6InlandSigun: document.getElementById("b6-inland-sigun")?.value || "",
    b6InlandGu: document.getElementById("b6-inland-gu")?.value || "",
    b6InlandPoint: document.getElementById("b6-inland-point")?.value || "",
    b6RailInter1: document.getElementById("b6-rail-inter-1")?.value || "",
    b6RailInter2: document.getElementById("b6-rail-inter-2")?.value || "",
    b6RoadInterSido: document.getElementById("b6-road-inter-sido")?.value || "",
    b6RoadInterSigun: document.getElementById("b6-road-inter-sigun")?.value || "",
    b6RoadInterGu: document.getElementById("b6-road-inter-gu")?.value || "",
    b6RoadInterPoint: document.getElementById("b6-road-inter-point")?.value || "",
    b6PortSido: document.getElementById("b6-port-sido")?.value || "",
    b6PortSigun: document.getElementById("b6-port-sigun")?.value || "",
    b6PortGu: document.getElementById("b6-port-gu")?.value || "",
    b6PortPoint: document.getElementById("b6-port-point")?.value || "",
    b6VolumeTotal: document.getElementById("b6-volume-total")?.value || "",
    b6VolumeExport: document.getElementById("b6-volume-export")?.value || "",
    b6VolumeRail: document.getElementById("b6-volume-rail")?.value || "",
  };
}

// A 페이지: 페이지 로드 시 저장된 데이터 불러오기
if (window.location.pathname.includes("a.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const savedData = loadPageAData();
    if (savedData) {
      fillPageAForm(savedData);
    }
  });

  // 다음 버튼 클릭 시 검증 후 데이터 저장
  const nextButton = document.getElementById("a-to-b");
  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      if (!validatePageA()) {
        e.preventDefault(); // 검증 실패 시 페이지 이동 방지
        return false;
      }
      savePageAData();
    });
  }
}

// B 페이지: 페이지 로드 시 A 페이지 데이터 확인
if (window.location.pathname.includes("b.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const pageAData = loadPageAData();
    if (!pageAData) {
      console.warn("A 페이지 데이터가 없습니다.");
    }
  });
}

if (surveyForm) {
  surveyForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지
  });
}
