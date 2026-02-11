// Firebase SDK import (CDN 사용)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { ApageFieldMapping, BpageFieldMapping, CpageFieldMapping } from "./field_map.js";

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

// ===== 유틸리티 함수 =====

function parseNumber(value) {
  if (value == null) return 0;

  const normalized = String(value).replace(/,/g, "").trim();
  const n = Number(normalized);

  return Number.isFinite(n) ? n : 0;
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
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

// ===== 다중 페이지 설문조사 데이터 관리 =====

// A 페이지 데이터 저장
function savePageAData() {
  const data = {
    respondent: {
      name: document.getElementById("respondentName")?.value || "",
      department: document.getElementById("respondentDepartment")?.value || "",
      position: document.getElementById("respondentPosition")?.value || "",
      phone: document.getElementById("respondentPhone")?.value || "",
      email: document.getElementById("respondentEmail")?.value || "",
    },
    company: {
      name: document.getElementById("companyName")?.value || "",
      address: document.getElementById("companyAddress")?.value || "",
    },
  };
  sessionStorage.setItem("surveyPageA", JSON.stringify(data));
  return data;
}

// A 페이지 데이터 불러오기
function loadPageAData() {
  const saved = sessionStorage.getItem("surveyPageA");
  return saved ? JSON.parse(saved) : null;
}

// 폼에 데이터 채우기
function fillPageForm(fieldMap, data) {
  if (!data) return;

  Object.entries(fieldMap).forEach(([elementId, dataPath]) => {
    const value = getNestedValue(data, dataPath);
    if (value != null) {
      const element = document.getElementById(elementId);
      if (element) element.value = value;
    }
  });
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
    showNotification("다음 항목을 입력해주세요: " + emptyFields.join(", "), "error");
    return false;
  }

  return true;
}

// B 페이지 데이터 수집
function savePageBData() {
  const getRadioValue = (name) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.id : "";
  };

  const data = {
    B1: {
      numberOfEmployees: parseNumber(document.getElementById("numberOfEmployees")?.value),
      containerTransportation: {
        containerVehicle: {
          total: parseNumber(document.getElementById("containerVehicleTotal")?.value),
          direct: parseNumber(document.getElementById("containerVehicleDirect")?.value),
          consigned: parseNumber(document.getElementById("containerVehicleConsigned")?.textContent),
        },
        privateVehicle: parseNumber(document.getElementById("privateVehicle")?.value),
      },
      annualRevenue: {
        total: parseNumber(document.getElementById("annualRevenueTotal")?.value),
        inland: parseNumber(document.getElementById("annualRevenueInland")?.value),
      },
    },
    B2: {
      total: parseNumber(document.getElementById("b2-total")?.value),
      road: parseNumber(document.getElementById("b2-road")?.value),
      rail: parseNumber(document.getElementById("b2-rail")?.value),
      coastal: parseNumber(document.getElementById("b2-coastal")?.textContent),
    },
    B3: {
      underTen: {
        number: parseNumber(document.getElementById("b3-under9-number")?.value),
        percentage: parseNumber(document.getElementById("b3-under9-percent")?.value),
      },
      underHundred: {
        number: parseNumber(document.getElementById("b3-under100-number")?.value),
        percentage: parseNumber(document.getElementById("b3-under100-percent")?.value),
      },
      overHundred: {
        number: parseNumber(document.getElementById("b3-over100-number")?.value),
        percentage: parseNumber(document.getElementById("b3-over100-percent")?.textContent),
      },
    },
    B4: {
      selection: getRadioValue("b4"),
    },
    B5: {
      sameDayPercentage: parseNumber(document.getElementById("b5-same-day")?.value),
      nextDayPercentage: parseNumber(document.getElementById("b5-next-day")?.value),
      withinAWeekPercentage: parseNumber(document.getElementById("b5-within-a-week")?.value),
      overAWeekPercentage: parseNumber(document.getElementById("b5-over-a-week")?.textContent),
      // TODO: 구현 필요
      // average: {
      //   days: document.getElementById("b5-average")?.value || "",
      //   hours: 0,
      //   minutes: 0,
      // },
    },
    B6: {
      inlandOD: {
        sido: document.getElementById("b6-inland-sido")?.value || "",
        sigun: document.getElementById("b6-inland-sigun")?.value || "",
        gu: document.getElementById("b6-inland-gu")?.value || "",
        point: document.getElementById("b6-inland-point")?.value || "",
      },
      portOD: {
        sido: document.getElementById("b6-port-sido")?.value || "",
        sigun: document.getElementById("b6-port-sigun")?.value || "",
        gu: document.getElementById("b6-port-gu")?.value || "",
        point: document.getElementById("b6-port-point")?.value || "",
      },
      intermediate: {
        railInter1: document.getElementById("b6-rail-inter-1")?.value || "",
        railInter2: document.getElementById("b6-rail-inter-2")?.value || "",
        road: {
          sido: document.getElementById("b6-road-inter-sido")?.value || "",
          sigun: document.getElementById("b6-road-inter-sigun")?.value || "",
          gu: document.getElementById("b6-road-inter-gu")?.value || "",
          point: document.getElementById("b6-road-inter-point")?.value || "",
        },
      },
      annualTransportVolume: {
        total: parseNumber(document.getElementById("b6-volume-total")?.value),
        direction: {
          export: parseNumber(document.getElementById("b6-volume-export")?.value),
          import: parseNumber(document.getElementById("b6-volume-import")?.textContent),
        },
        transport: {
          rail: parseNumber(document.getElementById("b6-volume-rail")?.value),
          road: parseNumber(document.getElementById("b6-volume-road")?.textContent),
        },
      },
    },
  };

  sessionStorage.setItem("surveyPageB", JSON.stringify(data));
  return data;
}

// B 페이지: 페이지 로드 시 저장된 데이터 불러오기
function loadPageBData() {
  const saved = sessionStorage.getItem("surveyPageB");
  return saved ? JSON.parse(saved) : null;
}

// C 페이지: 페이지 저장
function savePageCData() {
  const data = {};
  sessionStorage.setItem("surveyPageC", JSON.stringify(data));
  return data;
}

// C 페이지: 페이지 로드 시 저장된 데이터 불러오기
function loadPageCData() {
  const saved = sessionStorage.getItem("surveyPageC");
  return saved ? JSON.parse(saved) : null;
}

// A 페이지: 페이지 로드 시 저장된 데이터 불러오기
if (window.location.pathname.includes("a.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const savedData = loadPageAData();
    if (savedData) {
      fillPageForm(ApageFieldMapping, savedData);
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

// B 페이지: 페이지 로드
if (window.location.pathname.includes("b.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const pageAData = loadPageAData();
    if (!pageAData) {
      console.warn("A 페이지 데이터가 없습니다.");
    }

    const savedData = loadPageBData();
    if (savedData) {
      fillPageForm(BpageFieldMapping, savedData);
    }

    bindContainerVehicleConsignedCalc();
    bindB2CoastalCalc();
    bindB3SumCalc();
    bindB3PercentageCalc();
    bindB5PercentageCalc();
    bindB6VolumeCalc();
  });

  const nextButton = document.getElementById("b-to-c");
  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      savePageBData();
    });
  }

  const previousButton = document.getElementById("b-to-a");
  if (previousButton) {
    previousButton.addEventListener("click", (e) => {
      savePageBData();
    });
  }
}

// C 페이지: 페이지 로드
if (window.location.pathname.includes("c.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const pageAData = loadPageAData();
    if (!pageAData) {
      console.warn("A 페이지 데이터가 없습니다.");
    }

    const pageBData = loadPageBData();
    if (!pageBData) {
      console.warn("B 페이지 데이터가 없습니다.");
    }

    const savedData = loadPageCData();
    if (savedData) {
      fillPageForm(CpageFieldMapping, savedData);
    }
  });

  const previousButton = document.getElementById("c-to-b");
  if (previousButton) {
    previousButton.addEventListener("click", (e) => {
      savePageCData();
    });
  }

  const nextButton = document.getElementById("submit");
  if (nextButton && surveyForm) {
    nextButton.addEventListener("click", (e) => {
      e.preventDefault();
      savePageCData();
      surveyForm.requestSubmit();
    });
  }
}

// 커스텀 알림 함수
function showNotification(message, type = "warning") {
  const existingNotification = document.getElementById("custom-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const colors = {
    warning: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      subtext: "text-yellow-700",
      icon: "text-yellow-400",
    },
    success: {
      bg: "bg-green-50",
      text: "text-green-800",
      subtext: "text-green-700",
      icon: "text-green-400",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-800",
      subtext: "text-red-700",
      icon: "text-red-400",
    },
  };

  const color = colors[type] || colors.warning;

  const notification = document.createElement("div");
  notification.id = "custom-notification";
  notification.className = "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-96 animate-fade-in";
  notification.innerHTML = `
    <div class="rounded-md ${color.bg} p-4 shadow-lg">
      <div class="flex">
        <div class="shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" class="size-5 ${color.icon}">
            <path d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" fill-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium ${color.text}">${message}</p>
        </div>
        <button onclick="this.closest('#custom-notification').remove()" class="ml-3 ${color.text} hover:opacity-70">
          <svg class="size-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

if (surveyForm) {
  surveyForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지

    if (sessionStorage.getItem("surveySubmitted") === "true") {
      showNotification("이미 제출된 설문입니다.", "warning");
      return;
    }

    savePageCData();

    const data = {
      ...loadPageAData(),
      ...loadPageBData(),
      ...loadPageCData(),
      created_at: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "surveys"), data);
      // surveyForm.reset();
      // sessionStorage.removeItem("surveyPageA");
      // sessionStorage.removeItem("surveyPageB");
      // sessionStorage.removeItem("surveyPageC");
      sessionStorage.setItem("surveySubmitted", "true");
      showNotification("설문조사가 성공적으로 제출되었습니다!", "success");
    } catch (error) {
      console.error("Error adding document: ", error);
      showNotification("설문조사 제출 중 오류가 발생했습니다.", "error");
    }
  });
}
