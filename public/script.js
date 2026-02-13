// Firebase SDK import (CDN 사용)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { ApageFieldMapping, BpageFieldMapping, CpageFieldMapping } from "./field_map.js";
import questions from "./question.js";

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

function formatNumber(num) {
  if (num == null) return "0";
  if (typeof num === "string") return num;

  // 소수점이 있는 경우
  if (!Number.isInteger(num)) {
    const fixed = num.toFixed(1);
    const [integer, decimal] = fixed.split(".");
    return `${Number(integer).toLocaleString("ko-KR")}.${decimal}`;
  }

  // 정수인 경우
  return num.toLocaleString("ko-KR");
}

function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

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

// ===== 설문조사 계산 =====

// 합계 계산
function bindSumCalc(ids, targetId) {
  const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const targetEl = document.getElementById(targetId);

  if (els.length !== ids.length || !targetEl) return;

  const update = () => {
    const result = els.reduce((total, el) => total + parseNumber(el.value), 0);

    targetEl.textContent = Number.isFinite(result) ? formatNumber(result) : "";
  };

  els.forEach((el) => el.addEventListener("input", update));
  update();
}

// 전체에서 나머지 계산
function bindTotalCalc(ids, totalId, targetId) {
  const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const totalEl = document.getElementById(totalId);
  const targetEl = document.getElementById(targetId);

  if (els.length !== ids.length || !totalEl || !targetEl) return;

  const update = () => {
    const total = parseNumber(totalEl.value);
    const result = total - els.reduce((total, el) => total + parseNumber(el.value), 0);

    targetEl.textContent = Number.isFinite(result) ? formatNumber(result) : "";
  };

  const allEls = [...els, totalEl];
  allEls.forEach((el) => el.addEventListener("input", update));
  update();
}

// 퍼센트 계산
function bindPercentCalc(ids, targetId) {
  const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
  const targetEl = document.getElementById(targetId);

  if (els.length !== ids.length || !targetEl) return;

  const update = () => {
    const result = 100 - els.reduce((total, el) => total + parseNumber(el.value), 0);
    targetEl.textContent = Number.isFinite(result) ? String(result) : "";
  };

  els.forEach((el) => el.addEventListener("input", update));
  update();
}

// 입력값 불러오기
function bindLoadInput(ids, inputPrefix, outputPrefix) {
  const inputEls = ids.map((id) => document.getElementById(`${inputPrefix}-${id}`)).filter(Boolean);
  const outputEls = ids.map((id) => document.getElementById(`${outputPrefix}-${id}`)).filter(Boolean);

  if (inputEls.length !== ids.length || outputEls.length !== ids.length) return;

  const update = () => {
    outputEls.forEach((el, index) => {
      el.textContent = inputEls[index].value || "";
    });
  };

  inputEls.forEach((el) => el.addEventListener("input", update));
  update();
}

// 운송시간 최종 계산
function bindDurationCalc(ids, prefix) {
  const daysIds = ids.map((id) => `${id}-days`);
  const hoursIds = ids.map((id) => `${id}-hours`);
  const minutesIds = ids.map((id) => `${id}-minutes`);
  const daysEls = daysIds.map((id) => document.getElementById(id)).filter(Boolean);
  const hoursEls = hoursIds.map((id) => document.getElementById(id)).filter(Boolean);
  const minutesEls = minutesIds.map((id) => document.getElementById(id)).filter(Boolean);

  const daysSumEl = document.getElementById(`${prefix}-days`);
  const hoursSumEl = document.getElementById(`${prefix}-hours`);
  const minutesSumEl = document.getElementById(`${prefix}-minutes`);

  if (
    daysEls.length !== daysIds.length ||
    hoursEls.length !== hoursIds.length ||
    minutesEls.length !== minutesIds.length ||
    !daysSumEl ||
    !hoursSumEl ||
    !minutesSumEl
  )
    return;

  const update = () => {
    let d = daysEls.reduce((total, el) => total + parseNumber(el.value), 0);
    let h = hoursEls.reduce((total, el) => total + parseNumber(el.value), 0);
    let m = minutesEls.reduce((total, el) => total + parseNumber(el.value), 0);

    while (m >= 60) {
      h += 1;
      m -= 60;
    }

    while (h >= 24) {
      d++;
      h -= 24;
    }

    daysSumEl.textContent = Number.isFinite(d) ? String(d) : "";
    hoursSumEl.textContent = Number.isFinite(h) ? String(h) : "";
    minutesSumEl.textContent = Number.isFinite(m) ? String(m) : "";
  };

  const els = [...daysEls, ...hoursEls, ...minutesEls];
  els.forEach((el) => el.addEventListener("input", update));
  update();
}

// 운송비용 합계 계산
function bindCostSumCalc(ids, prefix, is_20ft) {
  const suffix = is_20ft ? "20ft" : "40ft";

  const costIds = ids.map((id) => `${id}-cost-${suffix}`);
  const costEls = costIds.map((id) => document.getElementById(id)).filter(Boolean);

  const sumEl = document.getElementById(`${prefix}-cost-${suffix}`);

  if (costEls.length !== costIds.length || !sumEl) return;

  const update = () => {
    const costSum = costEls.reduce((total, el) => total + parseNumber(el.value), 0);
    sumEl.textContent = Number.isFinite(costSum) ? String(costSum) : "";
  };

  costEls.forEach((el) => el.addEventListener("input", update));
  update();
}

// 여러행 합계 구하기
function calcSum(ids, data, dataMap) {
  const values = ids.map((id) => {
    const field = dataMap[id];
    return getNestedValue(data, field);
  });
  return values.reduce((sum, value) => sum + parseNumber(value), 0);
}

// 여러행 총 시간 구하기
function calcSumTime(daysIds, hoursIds, minutesIds, data, dataMap) {
  const days = calcSum(daysIds, data, dataMap);
  const hours = calcSum(hoursIds, data, dataMap);
  const minutes = calcSum(minutesIds, data, dataMap);

  const sum = days * 24 + hours + minutes / 60;
  return Math.round(sum * 1000) / 1000;
}

// C 기본값 계산
function calcPageCDefaults() {
  const data = loadSessionData("surveyPageB");
  if (!data) return;

  let ids = [
    "b7-suttle1-cost-40ft",
    "b7-inter1-cost-40ft",
    "b7-main-cost-40ft",
    "b7-inter2-cost-40ft",
    "b7-suttle2-cost-40ft",
  ];
  const sumRailCost40ft = calcSum(ids, data, BpageFieldMapping);

  ids = [
    "b7-suttle1-cost-20ft",
    "b7-inter1-cost-20ft",
    "b7-main-cost-20ft",
    "b7-inter2-cost-20ft",
    "b7-suttle2-cost-20ft",
  ];
  const sumRailCost20ft = calcSum(ids, data, BpageFieldMapping);

  let daysIds = ["b7-suttle1-days", "b7-inter1-days", "b7-main-days", "b7-inter2-days", "b7-suttle2-days"];
  let hoursIds = ["b7-suttle1-hours", "b7-inter1-hours", "b7-main-hours", "b7-inter2-hours", "b7-suttle2-hours"];
  let minutesIds = [
    "b7-suttle1-minutes",
    "b7-inter1-minutes",
    "b7-main-minutes",
    "b7-inter2-minutes",
    "b7-suttle2-minutes",
  ];
  const sumRailDuration = calcSumTime(daysIds, hoursIds, minutesIds, data, BpageFieldMapping);

  ids = ["b8-main1-cost-40ft", "b8-inter-cost-40ft", "b8-main2-cost-40ft"];
  const sumRoadCost40ft = calcSum(ids, data, BpageFieldMapping);

  ids = ["b8-main1-cost-20ft", "b8-inter-cost-20ft", "b8-main2-cost-20ft"];
  const sumRoadCost20ft = calcSum(ids, data, BpageFieldMapping);

  daysIds = ["b8-main1-days", "b8-inter-days", "b8-main2-days"];
  hoursIds = ["b8-main1-hours", "b8-inter-hours", "b8-main2-hours"];
  minutesIds = ["b8-main1-minutes", "b8-inter-minutes", "b8-main2-minutes"];
  const sumRoadDuration = calcSumTime(daysIds, hoursIds, minutesIds, data, BpageFieldMapping);

  return {
    rail: {
      costFt20: sumRailCost20ft,
      costFt40: sumRailCost40ft,
      duration: sumRailDuration,
    },
    road: {
      costFt20: sumRoadCost20ft,
      costFt40: sumRoadCost40ft,
      duration: sumRoadDuration,
    },
  };
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

// B 페이지 데이터 수집
function savePageBData() {
  const getRadioValue = (name) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : 0;
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
      levelOfDecisionMakingPower: parseNumber(getRadioValue("b4")),
    },
    B5: {
      sameDayPercentage: parseNumber(document.getElementById("b5-same-day")?.value),
      nextDayPercentage: parseNumber(document.getElementById("b5-next-day")?.value),
      withinAWeekPercentage: parseNumber(document.getElementById("b5-within-a-week")?.value),
      overAWeekPercentage: parseNumber(document.getElementById("b5-over-a-week")?.textContent),
      average: {
        days: parseNumber(document.getElementById("b5-average-days")?.value),
        hours: parseNumber(document.getElementById("b5-average-hours")?.value),
        minutes: 0,
      },
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
        railInter1: document.getElementById("b6-rail-inter1-station")?.value || "",
        railInter2: document.getElementById("b6-rail-inter2-station")?.value || "",
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
    B7: {
      suttle1: {
        duration: {
          days: parseNumber(document.getElementById("b7-suttle1-days")?.value),
          hours: parseNumber(document.getElementById("b7-suttle1-hours")?.value),
          minutes: parseNumber(document.getElementById("b7-suttle1-minutes")?.value),
        },
        cost: {
          ft20: parseNumber(document.getElementById("b7-suttle1-cost-20ft")?.value),
          ft40: parseNumber(document.getElementById("b7-suttle1-cost-40ft")?.value),
        },
      },
      transshipment1: {
        loadAndUnload: {
          duration: {
            days: parseNumber(document.getElementById("b7-inter1-days")?.value),
            hours: parseNumber(document.getElementById("b7-inter1-hours")?.value),
            minutes: parseNumber(document.getElementById("b7-inter1-minutes")?.value),
          },
          cost: {
            ft20: parseNumber(document.getElementById("b7-inter1-cost-20ft")?.value),
            ft40: parseNumber(document.getElementById("b7-inter1-cost-40ft")?.value),
          },
        },
        storage: {
          duration: {
            days: parseNumber(document.getElementById("b7-storage1-days")?.value),
            hours: parseNumber(document.getElementById("b7-storage1-hours")?.value),
            minutes: parseNumber(document.getElementById("b7-storage1-minutes")?.value),
          },
          cost: {
            ft20: parseNumber(document.getElementById("b7-storage1-cost-20ft")?.value),
            ft40: parseNumber(document.getElementById("b7-storage1-cost-40ft")?.value),
          },
        },
      },
      main: {
        duration: {
          days: parseNumber(document.getElementById("b7-main-days")?.value),
          hours: parseNumber(document.getElementById("b7-main-hours")?.value),
          minutes: parseNumber(document.getElementById("b7-main-minutes")?.value),
        },
        cost: {
          ft20: parseNumber(document.getElementById("b7-main-cost-20ft")?.value),
          ft40: parseNumber(document.getElementById("b7-main-cost-40ft")?.value),
        },
      },
      transshipment2: {
        loadAndUnload: {
          duration: {
            days: parseNumber(document.getElementById("b7-inter2-days")?.value),
            hours: parseNumber(document.getElementById("b7-inter2-hours")?.value),
            minutes: parseNumber(document.getElementById("b7-inter2-minutes")?.value),
          },
          cost: {
            ft20: parseNumber(document.getElementById("b7-inter2-cost-20ft")?.value),
            ft40: parseNumber(document.getElementById("b7-inter2-cost-40ft")?.value),
          },
        },
        storage: {
          duration: {
            days: parseNumber(document.getElementById("b7-storage2-days")?.value),
            hours: parseNumber(document.getElementById("b7-storage2-hours")?.value),
            minutes: parseNumber(document.getElementById("b7-storage2-minutes")?.value),
          },
          cost: {
            ft20: parseNumber(document.getElementById("b7-storage2-cost-20ft")?.value),
            ft40: parseNumber(document.getElementById("b7-storage2-cost-40ft")?.value),
          },
        },
      },
      suttle2: {
        duration: {
          days: parseNumber(document.getElementById("b7-suttle2-days")?.value),
          hours: parseNumber(document.getElementById("b7-suttle2-hours")?.value),
          minutes: parseNumber(document.getElementById("b7-suttle2-minutes")?.value),
        },
        cost: {
          ft20: parseNumber(document.getElementById("b7-suttle2-cost-20ft")?.value),
          ft40: parseNumber(document.getElementById("b7-suttle2-cost-40ft")?.value),
        },
      },
    },
    B8: {
      main1: {
        duration: {
          days: parseNumber(document.getElementById("b8-main1-days")?.value),
          hours: parseNumber(document.getElementById("b8-main1-hours")?.value),
          minutes: parseNumber(document.getElementById("b8-main1-minutes")?.value),
        },
        cost: {
          ft20: parseNumber(document.getElementById("b8-main1-cost-20ft")?.value),
          ft40: parseNumber(document.getElementById("b8-main1-cost-40ft")?.value),
        },
      },
      transshipment: {
        loadAndUnload: {
          duration: {
            days: parseNumber(document.getElementById("b8-inter-days")?.value),
            hours: parseNumber(document.getElementById("b8-inter-hours")?.value),
            minutes: parseNumber(document.getElementById("b8-inter-minutes")?.value),
          },
          cost: {
            ft20: parseNumber(document.getElementById("b8-inter-cost-20ft")?.value),
            ft40: parseNumber(document.getElementById("b8-inter-cost-40ft")?.value),
          },
        },
        storage: {
          duration: {
            days: parseNumber(document.getElementById("b8-storage-days")?.value),
            hours: parseNumber(document.getElementById("b8-storage-hours")?.value),
            minutes: parseNumber(document.getElementById("b8-storage-minutes")?.value),
          },
          cost: {
            ft20: parseNumber(document.getElementById("b8-storage-cost-20ft")?.value),
            ft40: parseNumber(document.getElementById("b8-storage-cost-40ft")?.value),
          },
        },
      },
      main2: {
        duration: {
          days: parseNumber(document.getElementById("b8-main2-days")?.value),
          hours: parseNumber(document.getElementById("b8-main2-hours")?.value),
          minutes: parseNumber(document.getElementById("b8-main2-minutes")?.value),
        },
        cost: {
          ft20: parseNumber(document.getElementById("b8-main2-cost-20ft")?.value),
          ft40: parseNumber(document.getElementById("b8-main2-cost-40ft")?.value),
        },
      },
    },
    B9: {
      duration: {
        days: 0,
        hours: parseNumber(document.getElementById("b9-duration-hours")?.value),
        minutes: 0,
      },
    },
    B10: {
      rail: {
        under3Hours: parseNumber(document.getElementById("b10-rail-under3Hours")?.value),
        underB9Hours: parseNumber(document.getElementById("b10-rail-underB9Hours")?.value),
      },
      road: {
        under3Hours: parseNumber(document.getElementById("b10-road-under3Hours")?.value),
        underB9Hours: parseNumber(document.getElementById("b10-road-underB9Hours")?.value),
      },
    },
    B11: {
      first: parseNumber(document.getElementById("b11-first")?.value),
      second: parseNumber(document.getElementById("b11-second")?.value),
      third: parseNumber(document.getElementById("b11-third")?.value),
    },
    B12: {
      costFactor: parseNumber(getRadioValue("b12-1-select")),
      timeFactor: parseNumber(getRadioValue("b12-2-select")),
      reliabilityFactor: parseNumber(getRadioValue("b12-3-select")),
      frequencyFactor: parseNumber(getRadioValue("b12-4-select")),
      safetyFactor: parseNumber(getRadioValue("b12-5-select")),
      flexibilityFactor: parseNumber(getRadioValue("b12-6-select")),
      stabilityFactor: parseNumber(getRadioValue("b12-7-select")),
      ecoFactor: parseNumber(getRadioValue("b12-8-select")),
      distanceFactor: parseNumber(getRadioValue("b12-9-select")),
      accessibilityFactor: parseNumber(getRadioValue("b12-10-select")),
      volumeFactor: parseNumber(getRadioValue("b12-11-select")),
      serviceFactor: parseNumber(getRadioValue("b12-12-select")),
    },
    B13: {
      text: document.getElementById("b13-text")?.value,
    },
  };

  sessionStorage.setItem("surveyPageB", JSON.stringify(data));
  return data;
}

// C 페이지: 페이지 저장
function savePageCData(picked, calcData) {
  const getRadioValue = (name) => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : "X";
  };

  let data = {};
  for (let num = 1; num <= 10; num++) {
    const name = `C${num}`;

    data[name] = {
      rail: {
        cost: Math.round(calcData[num].rail.cost),
        duration: calcData[num].rail.duration,
        acc: calcData[num].rail.acc,
        times: calcData[num].rail.times,
        usePercent: parseNumber(document.getElementById(`c${num}-rail-use-percent`)?.value),
      },
      road: {
        cost: Math.round(calcData[num].road.cost),
        duration: calcData[num].road.duration,
        acc: calcData[num].road.acc,
        usePercent: parseNumber(document.getElementById(`c${num}-road-use-percent`)?.textContent),
      },
      select: getRadioValue(`c${num}-select`),
    };
  }

  data["weight_type"] = picked.map((num) => num + 1);

  sessionStorage.setItem("surveyPageC", JSON.stringify(data));
  return data;
}

// 세션 데이터 불러오기
function loadSessionData(key) {
  const saved = sessionStorage.getItem(key);
  return saved ? JSON.parse(saved) : null;
}

// 폼에 데이터 채우기
function fillPageForm(fieldMap, data) {
  if (!data) return;

  Object.entries(fieldMap).forEach(([elementId, dataPath]) => {
    const value = getNestedValue(data, dataPath);

    if (value != null) {
      // 선택지 불러오기
      if (value != "X" && value != 0 && elementId.includes("select")) {
        const element = document.querySelector(`input[name="${elementId}"][value="${value}"]`);
        if (element) element.checked = true;
      }

      const element = document.getElementById(elementId);
      if (element) element.value = value;
    }
  });
}

// 페이지 필수 항목 검증
function validatePage(fieldMap) {
  const fields = Object.keys(fieldMap);

  for (const field of fields) {
    if (field.includes("select")) {
      const elements = document.querySelectorAll(`input[name="${field}"]`);
      if (Array.from(elements).some((el) => el.checked)) {
        continue;
      }

      showNotification("입력하지 않은 선택지가 있습니다", "error");

      // 첫 번째 빈 필드로 스크롤 이동 및 포커스
      elements[0].scrollIntoView({ behavior: "smooth", block: "center" });

      return false;
    }

    const element = document.getElementById(field);
    const value = element?.value?.trim();

    if (!value) {
      // 빈 필드에 시각적 표시
      if (element) {
        element.style.borderColor = "red";
        element.style.borderWidth = "2px";

        element.addEventListener("input", () => {
          element.style.borderColor = "";
          element.style.borderWidth = "";
        });
      }

      showNotification("입력하지 않은 항목이 있습니다", "error");

      // 첫 번째 빈 필드로 스크롤 이동 및 포커스
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      return false;
    }
  }

  return true;
}

// 입력값 쉼표 추가/제거 (미완)
function localeString() {
  document.querySelectorAll('input[type="text"]').forEach((input) => {
    // 포커스 시: 쉼표 제거 (편집 가능하도록)
    input.addEventListener("focus", function () {
      this.value = this.value.replace(/,/g, "");
    });

    // 포커스 아웃 시: 쉼표 추가
    input.addEventListener("blur", function () {
      const num = parseNumber(this.value);
      if (num !== 0 || this.value.trim() !== "") {
        this.value = formatNumber(num);
      }
    });
  });
}

// C 기본값에 문항가중치 적용
function calcQuestion(defaultData, pickedNum) {
  const picked = questions[pickedNum];

  // 비용 기본값 선택
  let railCost = defaultData.rail.costFt40 > 0 ? defaultData.rail.costFt40 : defaultData.rail.costFt20;
  let roadCost = defaultData.road.costFt40 > 0 ? defaultData.road.costFt40 : defaultData.road.costFt20;
  if (railCost == 0) railCost = roadCost * 1.1;

  // 비용 가중치 적용
  railCost *= picked.railCost;
  roadCost *= picked.roadCost;

  // 시간 가중치 적용
  let railDuration = Math.round(defaultData.rail.duration * picked.railDuration * 1000) / 1000;
  let roadDuration = Math.round(defaultData.road.duration * picked.roadDuration * 1000) / 1000;

  // 화면에 보여지는 값
  const railDisplayCost = formatNumber(Math.round(railCost / 1000) / 10);
  const roadDisplayCost = formatNumber(Math.round(roadCost / 1000) / 10);
  const railDisplayDuration = formatNumber(Math.round(railDuration * 10) / 10);
  const roadDisplayDuration = formatNumber(Math.round(roadDuration * 10) / 10);

  // 비교 문자열 생성 헬퍼 함수
  function compareValues(railValue, roadValue, unit, higherWord, lowerWord) {
    const diff = railValue - roadValue;
    const diffString = formatNumber(Math.abs(diff));

    if (diff > 0) {
      return `철도가 ${diffString} ${unit} ${higherWord}`;
    } else if (diff < 0) {
      return `철도가 ${diffString} ${unit} ${lowerWord}`;
    } else {
      return "동일";
    }
  }

  const costCmp = compareValues(railCost / 10000, roadCost / 10000, "만원", "비쌈", "쌈");
  const durationCmp = compareValues(railDuration, roadDuration, "시간", "느림", "빠름");
  const accCmp = compareValues(picked.railAcc, picked.roadAcc, "%p", "높음", "낮음");

  return {
    rail: {
      cost: railCost,
      displayCost: railDisplayCost,
      duration: railDuration,
      displayDuration: railDisplayDuration,
      acc: picked.railAcc,
      times: picked.railTimes,
    },
    road: {
      cost: roadCost,
      displayCost: roadDisplayCost,
      duration: roadDuration,
      displayDuration: roadDisplayDuration,
      acc: picked.roadAcc,
    },
    costCmp,
    durationCmp,
    accCmp,
    questionNum: pickedNum,
  };
}

// C 페이지: 문항 추가
function makePageC(i, data) {
  const QuestionEl = document.getElementById("c");

  const question = document.createElement("div");
  question.id = `c${i}`;
  question.className = "intro";
  question.innerHTML = `
        <p class="pl-10 -indent-10 text-lg font-bold">문C${i}</p>
        <div>
          <table class="w-full text-center">
            <tr class="h-[36px] border-1 bg-gray-200">
              <td class="w-[35%] border-1 px-2">운송조건</td>
              <td class="w-[22%] border-1 px-2">철도</td>
              <td class="w-[22%] border-1 px-2">도로</td>
              <td class="border-1 px-2">철도-도로 차이</td>
            </tr>
            <tr class="h-[36px] border-1">
              <td class="border-1 px-2">운송비용</td>
              <td class="border-1 px-2 text-right"><span id="c${i}-rail-cost">${data.rail.displayCost}</span> 만원</td>
              <td class="border-1 px-2 text-right"><span id="c${i}-road-cost">${data.road.displayCost}</span> 만원</td>
              <td class="border-1 px-2 text-sm">${data.costCmp}</td>
            </tr>
            <tr class="h-[36px] border-1">
              <td class="border-1 px-2">운송시간</td>
              <td class="border-1 px-2 text-right"><span id="c${i}-rail-duration">${data.rail.displayDuration}</span> 시간</td>
              <td class="border-1 px-2 text-right"><span id="c${i}-road-duration">${data.road.displayDuration}</span> 시간</td>
              <td class="border-1 px-2 text-sm">${data.durationCmp}</td>
            </tr>
            <tr class="h-[36px] border-1">
              <td class="border-1 px-2">정시도착율(지연시간 최대 3시간 이내)</td>
              <td class="border-1 px-2 text-right"><span id="c${i}-rail-acc">${data.rail.acc}</span>%</td>
              <td class="border-1 px-2 text-right"><span id="c${i}-road-acc">${data.road.acc}</span>%</td>
              <td class="border-1 px-2 text-sm">${data.accCmp}</td>
            </tr>
            <tr class="h-[36px] border-1">
              <td class="border-1 px-2">화물열차 운행횟수</td>
              <td class="border-1 px-2 text-right">일 <span id="c${i}-rail-times">${data.rail.times}</span> 회</td>
              <td class="border-1 px-2">-</td>
              <td class="border-1 px-2">-</td>
            </tr>
            <tr class="h-[36px] border-1">
              <td class="border-1 px-2">수단 이용비율</td>
              <td class="border-1 px-2 text-right">
                <input
                  id="c${i}-rail-use-percent"
                  type="text"
                  class="mx-2 h-[32px] w-[100px] rounded-md bg-white px-3 py-1.5 text-right text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                />%
              </td>
              <td class="border-1 px-2 text-right">
                <span id="c${i}-road-use-percent" class="font-bold text-blue-600"></span> %
              </td>
              <td class="border-1 px-2">-</td>
            </tr>
            <tr class="h-[36px] border-1">
              <td class="border-1 px-2">수단 선택</td>
              <td class="border-1 px-2">
                <input type="radio" name="c${i}-select" value="철도" class="h-full w-full outline-0" />
              </td>
              <td class="border-1 px-2">
                <input type="radio" name="c${i}-select" value="도로" class="h-full w-full outline-0" />
              </td>
              <td class="border-1 px-2">-</td>
            </tr>
          </table>
        </div>
      `;

  QuestionEl.appendChild(question);
}

// A 페이지: 페이지 로드
if (window.location.pathname.includes("a.html")) {
  window.addEventListener("DOMContentLoaded", () => {
    const savedData = loadSessionData("surveyPageA");
    if (savedData) {
      fillPageForm(ApageFieldMapping, savedData);
    }
  });

  // 다음 버튼 클릭 시 검증 후 데이터 저장
  const nextButton = document.getElementById("a-to-b");
  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      if (!validatePage(ApageFieldMapping)) {
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
    const pageAData = loadSessionData("surveyPageA");
    if (!pageAData) {
      console.warn("A 페이지 데이터가 없습니다.");
    }

    const savedData = loadSessionData("surveyPageB");
    if (savedData) {
      fillPageForm(BpageFieldMapping, savedData);
    }

    const B1_2Ids = ["containerVehicleDirect"];
    const B1_2TotalId = "containerVehicleTotal";
    const B1_2TargetId = "containerVehicleConsigned";
    bindTotalCalc(B1_2Ids, B1_2TotalId, B1_2TargetId);

    const B2Ids = ["b2-road", "b2-rail"];
    const B2TotalId = "b2-total";
    const B2TargetId = "b2-coastal";
    bindTotalCalc(B2Ids, B2TotalId, B2TargetId);

    const B3NumberIds = ["b3-under9-number", "b3-under100-number", "b3-over100-number"];
    const B3NumberTargetId = "b3-number-sum";
    bindSumCalc(B3NumberIds, B3NumberTargetId);

    const B3PercentIds = ["b3-under9-percent", "b3-under100-percent"];
    const B3PercentTargetId = "b3-over100-percent";
    bindPercentCalc(B3PercentIds, B3PercentTargetId);

    const B5Ids = ["b5-same-day", "b5-next-day", "b5-within-a-week"];
    const B5TargetId = "b5-over-a-week";
    bindPercentCalc(B5Ids, B5TargetId);

    const B6TotalId = "b6-volume-total";
    const B6DirectionIds = ["b6-volume-export"];
    const B6DirectionTargetId = "b6-volume-import";
    bindTotalCalc(B6DirectionIds, B6TotalId, B6DirectionTargetId);

    const B6TransportIds = ["b6-volume-rail"];
    const B6TransportTargetId = "b6-volume-road";
    bindTotalCalc(B6TransportIds, B6TotalId, B6TransportTargetId);

    const LoadInputPrefix = "b6";
    const LoadIds = [
      "inland-sido",
      "inland-sigun",
      "inland-gu",
      "inland-point",
      "port-sido",
      "port-sigun",
      "port-gu",
      "port-point",
    ];
    const B7LoadOutputPrefix = "b7";
    bindLoadInput(LoadIds, LoadInputPrefix, B7LoadOutputPrefix);

    const B8LoadOutputPrefix = "b8";
    bindLoadInput(LoadIds, LoadInputPrefix, B8LoadOutputPrefix);

    const stationInputPrefix = "b6-rail";
    const stationIds = ["inter1-station", "inter2-station"];
    const stationOuputPrefix = "b7";
    bindLoadInput(stationIds, stationInputPrefix, stationOuputPrefix);

    const intermediateInputPrefix = "b6-road";
    const intermediateIds = ["inter-point"];
    const intermediateOuputPrefix = "b8";
    bindLoadInput(intermediateIds, intermediateInputPrefix, intermediateOuputPrefix);

    const B7Ids = ["b7-suttle1", "b7-inter1", "b7-storage1", "b7-main", "b7-inter2", "b7-storage2", "b7-suttle2"];
    const B7Prefix = "b7-sum";
    bindDurationCalc(B7Ids, B7Prefix);
    bindCostSumCalc(B7Ids, B7Prefix, true);
    bindCostSumCalc(B7Ids, B7Prefix, false);

    const B8Ids = ["b8-main1", "b8-inter", "b8-storage", "b8-main2"];
    const B8Prefix = "b8-sum";
    bindDurationCalc(B8Ids, B8Prefix);
    bindCostSumCalc(B8Ids, B8Prefix, true);
    bindCostSumCalc(B8Ids, B8Prefix, false);

    const latencyInputPrefix = "b9";
    const latencyIds = ["duration-hours"];
    const latencyOutputPrefix = "b10";
    bindLoadInput(latencyIds, latencyInputPrefix, latencyOutputPrefix);
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
  const randomNums = [...Array(18).keys()]
    .map((num) => num + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, 9)
    .sort((a, b) => a - b);

  const picked = [0, ...randomNums];
  const calcData = {};

  window.addEventListener("DOMContentLoaded", () => {
    const pageAData = loadSessionData("surveyPageA");
    if (!pageAData) {
      console.warn("A 페이지 데이터가 없습니다.");
    }

    const pageBData = loadSessionData("surveyPageB");
    if (!pageBData) {
      console.warn("B 페이지 데이터가 없습니다.");
    }

    const defaultData = calcPageCDefaults();

    for (let i = 0; i < 10; i++) {
      const pickedNum = picked[i];
      const data = calcQuestion(defaultData, pickedNum);
      makePageC(i + 1, data);
      calcData[i + 1] = data;
    }

    for (let i = 1; i <= 10; i++) {
      const ids = [`c${i}-rail-use-percent`];
      const targetId = `c${i}-road-use-percent`;
      bindPercentCalc(ids, targetId);
    }

    const savedData = loadSessionData("surveyPageC");
    if (savedData) {
      fillPageForm(CpageFieldMapping, savedData);
    }
  });

  const previousButton = document.getElementById("c-to-b");
  if (previousButton) {
    previousButton.addEventListener("click", (e) => {
      savePageCData(picked, calcData);
    });
  }

  const submitButton = document.getElementById("submit");
  if (submitButton && surveyForm) {
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();

      if (!validatePage(CpageFieldMapping)) {
        e.preventDefault();
        return false;
      }

      savePageCData(picked, calcData);
      surveyForm.requestSubmit();
    });
  }
}

// 제출 동작
if (surveyForm) {
  surveyForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지

    if (sessionStorage.getItem("surveySubmitted") === "true") {
      showNotification("이미 제출된 설문입니다.", "warning");
      return;
    }

    const data = {
      ...loadSessionData("surveyPageA"),
      ...loadSessionData("surveyPageB"),
      ...loadSessionData("surveyPageC"),
      created_at: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, "surveys"), data);
      sessionStorage.setItem("surveySubmitted", "true");
      showNotification("설문조사가 성공적으로 제출되었습니다! 5초 후에 처음 페이지로 돌아갑니다", "success");

      // 5초 후 index.html로 이동
      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      showNotification("설문조사 제출 중 오류가 발생했습니다.", "error");
    }
  });
}
