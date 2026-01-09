let device = null;
let uartCharacteristic = null;
let seconds = 20;
let timerInterval = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("connect").addEventListener("click", connect);
  document.getElementById("start").addEventListener("click", startTimer);
});

// ---------------- CONNECT ----------------
async function connect() {
  try {
    console.log("Connect clicked");

    device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [
        "6e400001-b5a3-f393-e0a9-e50e24dcca9e" // UART
      ]
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(
      "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
    );

    uartCharacteristic = await service.getCharacteristic(
      "6e400003-b5a3-f393-e0a9-e50e24dcca9e"
    );

    alert("micro:bit connected ✅");
  } catch (err) {
    console.error(err);
    alert("Bluetooth popup blocked ❌");
  }
}

// ---------------- TIMER ----------------
function startTimer() {
  if (timerInterval) return;

  updateDisplay();

  timerInterval = setInterval(() => {
    seconds--;
    updateDisplay();

    if (seconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      sendBoom();
    }
  }, 1000);
}

// ---------------- DISPLAY ----------------
function updateDisplay() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").innerText = `${m}:${s}`;
}

// ---------------- SEND BOOM ----------------
function sendBoom() {
  if (!uartCharacteristic) {
    alert("micro:bit not connected");
    return;
  }

  const encoder = new TextEncoder();
  uartCharacteristic.writeValue(encoder.encode("BOOM\n"));
  alert("💥 BOOM sent");
}
