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

// B7 B6 정보 가져오기1 (내륙, 철도 경유지)
function bindB7GetB6Input1() {
  const b6SidoEl = document.getElementById("b6-inland-sido");
  const b6SigunEl = document.getElementById("b6-inland-sigun");
  const b6GuEl = document.getElementById("b6-inland-gu");
  const b6PointEl = document.getElementById("b6-inland-point");

  const b6RailInter1El = document.getElementById("b6-rail-inter-1");
  const b6RailInter2El = document.getElementById("b6-rail-inter-2");

  const b7SidoEl = document.getElementById("b7-inland-sido");
  const b7SigunEl = document.getElementById("b7-inland-sigun");
  const b7GuEl = document.getElementById("b7-inland-gu");
  const b7PointEl = document.getElementById("b7-inland-point");

  const b8SidoEl = document.getElementById("b8-inland-sido");
  const b8SigunEl = document.getElementById("b8-inland-sigun");
  const b8GuEl = document.getElementById("b8-inland-gu");
  const b8PointEl = document.getElementById("b8-inland-point");

  const b7InterStation1El = document.getElementById("b7-inter1-station");
  const b7InterStation2El = document.getElementById("b7-inter2-station");

  if (
    !b6SidoEl ||
    !b6SigunEl ||
    !b6GuEl ||
    !b6PointEl ||
    !b6RailInter1El ||
    !b6RailInter2El ||
    !b7SidoEl ||
    !b7SigunEl ||
    !b7GuEl ||
    !b7PointEl ||
    !b8SidoEl ||
    !b8SigunEl ||
    !b8GuEl ||
    !b8PointEl ||
    !b7InterStation1El ||
    !b7InterStation2El
  )
    return;

  const update = () => {
    const sido = b6SidoEl.value || "0";
    b7SidoEl.textContent = sido;
    b8SidoEl.textContent = sido;

    const sigun = b6SigunEl.value || "0";
    b7SigunEl.textContent = sigun;
    b8SigunEl.textContent = sigun;

    const gu = b6GuEl.value || "0";
    b7GuEl.textContent = gu;
    b8GuEl.textContent = gu;

    const point = b6PointEl.value || "0";
    b7PointEl.textContent = point;
    b8PointEl.textContent = point;

    b7InterStation1El.textContent = b6RailInter1El.value || "0";
    b7InterStation2El.textContent = b6RailInter2El.value || "0";
  };

  b6SidoEl.addEventListener("input", update);
  b6SigunEl.addEventListener("input", update);
  b6GuEl.addEventListener("input", update);
  b6PointEl.addEventListener("input", update);
  b6RailInter1El.addEventListener("input", update);
  b6RailInter2El.addEventListener("input", update);
  update();
}

// B7 B6 정보 가져오기2
function bindB7GetB6Input2() {
  const b6SidoEl = document.getElementById("b6-port-sido");
  const b6SigunEl = document.getElementById("b6-port-sigun");
  const b6GuEl = document.getElementById("b6-port-gu");
  const b6PointEl = document.getElementById("b6-port-point");

  const b7SidoEl = document.getElementById("b7-port-sido");
  const b7SigunEl = document.getElementById("b7-port-sigun");
  const b7GuEl = document.getElementById("b7-port-gu");
  const b7PointEl = document.getElementById("b7-port-point");

  const b8SidoEl = document.getElementById("b8-port-sido");
  const b8SigunEl = document.getElementById("b8-port-sigun");
  const b8GuEl = document.getElementById("b8-port-gu");
  const b8PointEl = document.getElementById("b8-port-point");

  if (
    !b6SidoEl ||
    !b6SigunEl ||
    !b6GuEl ||
    !b6PointEl ||
    !b7SidoEl ||
    !b7SigunEl ||
    !b7GuEl ||
    !b7PointEl ||
    !b8SidoEl ||
    !b8SigunEl ||
    !b8GuEl ||
    !b8PointEl
  )
    return;

  const update = () => {
    const sido = b6SidoEl.value || "0";
    b7SidoEl.textContent = sido;
    b8SidoEl.textContent = sido;

    const sigun = b6SigunEl.value || "0";
    b7SigunEl.textContent = sigun;
    b8SigunEl.textContent = sigun;

    const gu = b6GuEl.value || "0";
    b7GuEl.textContent = gu;
    b8GuEl.textContent = gu;

    const point = b6PointEl.value || "0";
    b7PointEl.textContent = point;
    b8PointEl.textContent = point;
  };

  b6SidoEl.addEventListener("input", update);
  b6SigunEl.addEventListener("input", update);
  b6GuEl.addEventListener("input", update);
  b6PointEl.addEventListener("input", update);
  update();
}

// B7 일수 합계 계산
function bindB7DaysSumCalc() {
  const b7Suttle1DaysEl = document.getElementById("b7-suttle1-days");
  const b7Inter1DaysEl = document.getElementById("b7-inter1-days");
  const b7Storage1DaysEl = document.getElementById("b7-storage1-days");
  const b7MainDaysEl = document.getElementById("b7-main-days");
  const b7Inter2DaysEl = document.getElementById("b7-inter2-days");
  const b7Storage2DaysEl = document.getElementById("b7-storage2-days");
  const b7Suttle2DaysEl = document.getElementById("b7-suttle2-days");
  const b7SumDaysEl = document.getElementById("b7-sum-days");

  if (
    !b7Suttle1DaysEl ||
    !b7Inter1DaysEl ||
    !b7Storage1DaysEl ||
    !b7MainDaysEl ||
    !b7Inter2DaysEl ||
    !b7Storage2DaysEl ||
    !b7Suttle2DaysEl ||
    !b7SumDaysEl
  )
    return;

  const update = () => {
    const sumDays =
      parseNumber(b7Suttle1DaysEl.value) +
      parseNumber(b7Inter1DaysEl.value) +
      parseNumber(b7Storage1DaysEl.value) +
      parseNumber(b7MainDaysEl.value) +
      parseNumber(b7Inter2DaysEl.value) +
      parseNumber(b7Storage2DaysEl.value) +
      parseNumber(b7Suttle2DaysEl.value);

    b7SumDaysEl.textContent = Number.isFinite(sumDays) ? String(sumDays) : "";
  };

  b7Suttle1DaysEl.addEventListener("input", update);
  b7Inter1DaysEl.addEventListener("input", update);
  b7Storage1DaysEl.addEventListener("input", update);
  b7MainDaysEl.addEventListener("input", update);
  b7Inter2DaysEl.addEventListener("input", update);
  b7Storage2DaysEl.addEventListener("input", update);
  b7Suttle2DaysEl.addEventListener("input", update);
  update();
}

// B7 시간 합계 계산
function bindB7HoursSumCalc() {
  const b7Suttle1HoursEl = document.getElementById("b7-suttle1-hours");
  const b7Inter1HoursEl = document.getElementById("b7-inter1-hours");
  const b7Storage1HoursEl = document.getElementById("b7-storage1-hours");
  const b7MainHoursEl = document.getElementById("b7-main-hours");
  const b7Inter2HoursEl = document.getElementById("b7-inter2-hours");
  const b7Storage2HoursEl = document.getElementById("b7-storage2-hours");
  const b7Suttle2HoursEl = document.getElementById("b7-suttle2-hours");
  const b7SumHoursEl = document.getElementById("b7-sum-hours");

  if (
    !b7Suttle1HoursEl ||
    !b7Inter1HoursEl ||
    !b7Storage1HoursEl ||
    !b7MainHoursEl ||
    !b7Inter2HoursEl ||
    !b7Storage2HoursEl ||
    !b7Suttle2HoursEl ||
    !b7SumHoursEl
  )
    return;

  const update = () => {
    const sumHours =
      parseNumber(b7Suttle1HoursEl.value) +
      parseNumber(b7Inter1HoursEl.value) +
      parseNumber(b7Storage1HoursEl.value) +
      parseNumber(b7MainHoursEl.value) +
      parseNumber(b7Inter2HoursEl.value) +
      parseNumber(b7Storage2HoursEl.value) +
      parseNumber(b7Suttle2HoursEl.value);

    b7SumHoursEl.textContent = Number.isFinite(sumHours) ? String(sumHours) : "";
  };

  b7Suttle1HoursEl.addEventListener("input", update);
  b7Inter1HoursEl.addEventListener("input", update);
  b7Storage1HoursEl.addEventListener("input", update);
  b7MainHoursEl.addEventListener("input", update);
  b7Inter2HoursEl.addEventListener("input", update);
  b7Storage2HoursEl.addEventListener("input", update);
  b7Suttle2HoursEl.addEventListener("input", update);
  update();
}

// B7 분 합계 계산
function bindB7MinutesSumCalc() {
  const b7Suttle1MinutesEl = document.getElementById("b7-suttle1-minutes");
  const b7Inter1MinutesEl = document.getElementById("b7-inter1-minutes");
  const b7Storage1MinutesEl = document.getElementById("b7-storage1-minutes");
  const b7MainMinutesEl = document.getElementById("b7-main-minutes");
  const b7Inter2MinutesEl = document.getElementById("b7-inter2-minutes");
  const b7Storage2MinutesEl = document.getElementById("b7-storage2-minutes");
  const b7Suttle2MinutesEl = document.getElementById("b7-suttle2-minutes");
  const b7SumMinutesEl = document.getElementById("b7-sum-minutes");

  if (
    !b7Suttle1MinutesEl ||
    !b7Inter1MinutesEl ||
    !b7Storage1MinutesEl ||
    !b7MainMinutesEl ||
    !b7Inter2MinutesEl ||
    !b7Storage2MinutesEl ||
    !b7Suttle2MinutesEl ||
    !b7SumMinutesEl
  )
    return;

  const update = () => {
    const sumMinutes =
      parseNumber(b7Suttle1MinutesEl.value) +
      parseNumber(b7Inter1MinutesEl.value) +
      parseNumber(b7Storage1MinutesEl.value) +
      parseNumber(b7MainMinutesEl.value) +
      parseNumber(b7Inter2MinutesEl.value) +
      parseNumber(b7Storage2MinutesEl.value) +
      parseNumber(b7Suttle2MinutesEl.value);

    b7SumMinutesEl.textContent = Number.isFinite(sumMinutes) ? String(sumMinutes) : "";
  };

  b7Suttle1MinutesEl.addEventListener("input", update);
  b7Inter1MinutesEl.addEventListener("input", update);
  b7Storage1MinutesEl.addEventListener("input", update);
  b7MainMinutesEl.addEventListener("input", update);
  b7Inter2MinutesEl.addEventListener("input", update);
  b7Storage2MinutesEl.addEventListener("input", update);
  b7Suttle2MinutesEl.addEventListener("input", update);
  update();
}

// B7 20ft 합계 계산
function bindB720ftSumCalc() {
  const b7Suttle1Cost20ftEl = document.getElementById("b7-suttle1-cost-20ft");
  const b7Inter1Cost20ftEl = document.getElementById("b7-inter1-cost-20ft");
  const b7Storage1Cost20ftEl = document.getElementById("b7-storage1-cost-20ft");
  const b7MainCost20ftEl = document.getElementById("b7-main-cost-20ft");
  const b7Inter2Cost20ftEl = document.getElementById("b7-inter2-cost-20ft");
  const b7Storage2Cost20ftEl = document.getElementById("b7-storage2-cost-20ft");
  const b7Suttle2Cost20ftEl = document.getElementById("b7-suttle2-cost-20ft");
  const b7SumCost20ftEl = document.getElementById("b7-sum-cost-20ft");

  if (
    !b7Suttle1Cost20ftEl ||
    !b7Inter1Cost20ftEl ||
    !b7Storage1Cost20ftEl ||
    !b7MainCost20ftEl ||
    !b7Inter2Cost20ftEl ||
    !b7Storage2Cost20ftEl ||
    !b7Suttle2Cost20ftEl ||
    !b7SumCost20ftEl
  )
    return;

  const update = () => {
    const sumCost20ft =
      parseNumber(b7Suttle1Cost20ftEl.value) +
      parseNumber(b7Inter1Cost20ftEl.value) +
      parseNumber(b7Storage1Cost20ftEl.value) +
      parseNumber(b7MainCost20ftEl.value) +
      parseNumber(b7Inter2Cost20ftEl.value) +
      parseNumber(b7Storage2Cost20ftEl.value) +
      parseNumber(b7Suttle2Cost20ftEl.value);

    b7SumCost20ftEl.textContent = Number.isFinite(sumCost20ft) ? String(sumCost20ft) : "";
  };

  b7Suttle1Cost20ftEl.addEventListener("input", update);
  b7Inter1Cost20ftEl.addEventListener("input", update);
  b7Storage1Cost20ftEl.addEventListener("input", update);
  b7MainCost20ftEl.addEventListener("input", update);
  b7Inter2Cost20ftEl.addEventListener("input", update);
  b7Storage2Cost20ftEl.addEventListener("input", update);
  b7Suttle2Cost20ftEl.addEventListener("input", update);
  update();
}

// B7 40ft 합계 계산
function bindB740ftSumCalc() {
  const b7Suttle1Cost40ftEl = document.getElementById("b7-suttle1-cost-40ft");
  const b7Inter1Cost40ftEl = document.getElementById("b7-inter1-cost-40ft");
  const b7Storage1Cost40ftEl = document.getElementById("b7-storage1-cost-40ft");
  const b7MainCost40ftEl = document.getElementById("b7-main-cost-40ft");
  const b7Inter2Cost40ftEl = document.getElementById("b7-inter2-cost-40ft");
  const b7Storage2Cost40ftEl = document.getElementById("b7-storage2-cost-40ft");
  const b7Suttle2Cost40ftEl = document.getElementById("b7-suttle2-cost-40ft");
  const b7SumCost40ftEl = document.getElementById("b7-sum-cost-40ft");

  if (
    !b7Suttle1Cost40ftEl ||
    !b7Inter1Cost40ftEl ||
    !b7Storage1Cost40ftEl ||
    !b7MainCost40ftEl ||
    !b7Inter2Cost40ftEl ||
    !b7Storage2Cost40ftEl ||
    !b7Suttle2Cost40ftEl ||
    !b7SumCost40ftEl
  )
    return;

  const update = () => {
    const sumCost40ft =
      parseNumber(b7Suttle1Cost40ftEl.value) +
      parseNumber(b7Inter1Cost40ftEl.value) +
      parseNumber(b7Storage1Cost40ftEl.value) +
      parseNumber(b7MainCost40ftEl.value) +
      parseNumber(b7Inter2Cost40ftEl.value) +
      parseNumber(b7Storage2Cost40ftEl.value) +
      parseNumber(b7Suttle2Cost40ftEl.value);

    b7SumCost40ftEl.textContent = Number.isFinite(sumCost40ft) ? String(sumCost40ft) : "";
  };

  b7Suttle1Cost40ftEl.addEventListener("input", update);
  b7Inter1Cost40ftEl.addEventListener("input", update);
  b7Storage1Cost40ftEl.addEventListener("input", update);
  b7MainCost40ftEl.addEventListener("input", update);
  b7Inter2Cost40ftEl.addEventListener("input", update);
  b7Storage2Cost40ftEl.addEventListener("input", update);
  b7Suttle2Cost40ftEl.addEventListener("input", update);
  update();
}

// B8 일수 합계 계산
function bindB8DaysSumCalc() {
  const b8Main1DaysEl = document.getElementById("b8-main1-days");
  const b8InterDaysEl = document.getElementById("b8-inter-days");
  const b8StorageDaysEl = document.getElementById("b8-storage-days");
  const b8Main2DaysEl = document.getElementById("b8-main2-days");
  const b8SumDaysEl = document.getElementById("b8-sum-days");

  if (!b8Main1DaysEl || !b8InterDaysEl || !b8StorageDaysEl || !b8Main2DaysEl || !b8SumDaysEl) return;

  const update = () => {
    const sumDays =
      parseNumber(b8Main1DaysEl.value) +
      parseNumber(b8InterDaysEl.value) +
      parseNumber(b8StorageDaysEl.value) +
      parseNumber(b8Main2DaysEl.value);

    b8SumDaysEl.textContent = Number.isFinite(sumDays) ? String(sumDays) : "";
  };

  b8Main1DaysEl.addEventListener("input", update);
  b8InterDaysEl.addEventListener("input", update);
  b8StorageDaysEl.addEventListener("input", update);
  b8Main2DaysEl.addEventListener("input", update);
  update();
}

// B8 시간 합계 계산
function bindB8HoursSumCalc() {
  const b8Main1HoursEl = document.getElementById("b8-main1-hours");
  const b8InterHoursEl = document.getElementById("b8-inter-hours");
  const b8StorageHoursEl = document.getElementById("b8-storage-hours");
  const b8Main2HoursEl = document.getElementById("b8-main2-hours");
  const b8SumHoursEl = document.getElementById("b8-sum-hours");

  if (!b8Main1HoursEl || !b8InterHoursEl || !b8StorageHoursEl || !b8Main2HoursEl || !b8SumHoursEl) return;

  const update = () => {
    const sumHours =
      parseNumber(b8Main1HoursEl.value) +
      parseNumber(b8InterHoursEl.value) +
      parseNumber(b8StorageHoursEl.value) +
      parseNumber(b8Main2HoursEl.value);

    b8SumHoursEl.textContent = Number.isFinite(sumHours) ? String(sumHours) : "";
  };

  b8Main1HoursEl.addEventListener("input", update);
  b8InterHoursEl.addEventListener("input", update);
  b8StorageHoursEl.addEventListener("input", update);
  b8Main2HoursEl.addEventListener("input", update);
  update();
}

// B8 분 합계 계산
function bindB8MinutesSumCalc() {
  const b8Main1MinutesEl = document.getElementById("b8-main1-minutes");
  const b8InterMinutesEl = document.getElementById("b8-inter-minutes");
  const b8StorageMinutesEl = document.getElementById("b8-storage-minutes");
  const b8Main2MinutesEl = document.getElementById("b8-main2-minutes");
  const b8SumMinutesEl = document.getElementById("b8-sum-minutes");

  if (!b8Main1MinutesEl || !b8InterMinutesEl || !b8StorageMinutesEl || !b8Main2MinutesEl || !b8SumMinutesEl) return;

  const update = () => {
    const sumMinutes =
      parseNumber(b8Main1MinutesEl.value) +
      parseNumber(b8InterMinutesEl.value) +
      parseNumber(b8StorageMinutesEl.value) +
      parseNumber(b8Main2MinutesEl.value);

    b8SumMinutesEl.textContent = Number.isFinite(sumMinutes) ? String(sumMinutes) : "";
  };

  b8Main1MinutesEl.addEventListener("input", update);
  b8InterMinutesEl.addEventListener("input", update);
  b8StorageMinutesEl.addEventListener("input", update);
  b8Main2MinutesEl.addEventListener("input", update);
  update();
}

// B8 20ft 합계 계산
function bindB8Cost20ftSumCalc() {
  const b8Main1Cost20ftEl = document.getElementById("b8-main1-cost-20ft");
  const b8InterCost20ftEl = document.getElementById("b8-inter-cost-20ft");
  const b8StorageCost20ftEl = document.getElementById("b8-storage-cost-20ft");
  const b8Main2Cost20ftEl = document.getElementById("b8-main2-cost-20ft");
  const b8SumCost20ftEl = document.getElementById("b8-sum-cost-20ft");

  if (!b8Main1Cost20ftEl || !b8InterCost20ftEl || !b8StorageCost20ftEl || !b8Main2Cost20ftEl || !b8SumCost20ftEl)
    return;

  const update = () => {
    const sumCost20ft =
      parseNumber(b8Main1Cost20ftEl.value) +
      parseNumber(b8InterCost20ftEl.value) +
      parseNumber(b8StorageCost20ftEl.value) +
      parseNumber(b8Main2Cost20ftEl.value);

    b8SumCost20ftEl.textContent = Number.isFinite(sumCost20ft) ? String(sumCost20ft) : "";
  };

  b8Main1Cost20ftEl.addEventListener("input", update);
  b8InterCost20ftEl.addEventListener("input", update);
  b8StorageCost20ftEl.addEventListener("input", update);
  b8Main2Cost20ftEl.addEventListener("input", update);
  update();
}

// B8 40ft 합계 계산
function bindB8Cost40ftSumCalc() {
  const b8Main1Cost40ftEl = document.getElementById("b8-main1-cost-40ft");
  const b8InterCost40ftEl = document.getElementById("b8-inter-cost-40ft");
  const b8StorageCost40ftEl = document.getElementById("b8-storage-cost-40ft");
  const b8Main2Cost40ftEl = document.getElementById("b8-main2-cost-40ft");
  const b8SumCost40ftEl = document.getElementById("b8-sum-cost-40ft");

  if (!b8Main1Cost40ftEl || !b8InterCost40ftEl || !b8StorageCost40ftEl || !b8Main2Cost40ftEl || !b8SumCost40ftEl)
    return;

  const update = () => {
    const sumCost40ft =
      parseNumber(b8Main1Cost40ftEl.value) +
      parseNumber(b8InterCost40ftEl.value) +
      parseNumber(b8StorageCost40ftEl.value) +
      parseNumber(b8Main2Cost40ftEl.value);

    b8SumCost40ftEl.textContent = Number.isFinite(sumCost40ft) ? String(sumCost40ft) : "";
  };

  b8Main1Cost40ftEl.addEventListener("input", update);
  b8InterCost40ftEl.addEventListener("input", update);
  b8StorageCost40ftEl.addEventListener("input", update);
  b8Main2Cost40ftEl.addEventListener("input", update);
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

// 페이지 필수 항목 검증
function validatePage(fieldMap) {
  const fields = Object.keys(fieldMap);

  for (const field of fields) {
    const element = document.getElementById(field);
    const value = element?.value?.trim();

    if (!value) {
      // 빈 필드에 시각적 표시
      if (element) {
        element.style.borderColor = "red";
        element.style.borderWidth = "2px";
      }

      element.addEventListener("input", () => {
        element.style.borderColor = "";
        element.style.borderWidth = "";
      });

      showNotification("입력하지 않은 항목이 있습니다", "error");

      // 첫 번째 빈 필드로 스크롤 이동 및 포커스
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      return false;
    }
  }

  return true;
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
    bindB7GetB6Input1();
    bindB7GetB6Input2();

    bindB7DaysSumCalc();
    bindB7HoursSumCalc();
    bindB7MinutesSumCalc();
    bindB720ftSumCalc();
    bindB740ftSumCalc();

    bindB8DaysSumCalc();
    bindB8HoursSumCalc();
    bindB8MinutesSumCalc();
    bindB8Cost20ftSumCalc();
    bindB8Cost40ftSumCalc();
  });

  const nextButton = document.getElementById("b-to-c");
  if (nextButton) {
    nextButton.addEventListener("click", (e) => {
      // if (!validatePage(BpageFieldMapping)) {
      //   e.preventDefault(); // 검증 실패 시 페이지 이동 방지
      //   return false;
      // }
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

      if (!validatePage(CpageFieldMapping)) {
        return false;
      }

      savePageCData();
      surveyForm.requestSubmit();
    });
  }
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
