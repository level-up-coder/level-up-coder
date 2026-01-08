let device;
let uartCharacteristic;
let seconds = 20; // 5 minutes
let interval;

// Nordic UART Service UUIDs
const UART_SERVICE = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

document.getElementById("connectBtn").onclick = connect;
document.getElementById("startBtn").onclick = startTimer;

async function connect() {
  device = await navigator.bluetooth.requestDevice({
    filters: [{ namePrefix: "BBC micro:bit" }],
    optionalServices: [UART_SERVICE]
  });

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(UART_SERVICE);
  uartCharacteristic = await service.getCharacteristic(UART_TX);

  alert("micro:bit connected");
}

function startTimer() {
  if (!uartCharacteristic) {
    alert("Connect to micro:bit first!");
    return;
  }

  interval = setInterval(() => {
    seconds--;
    updateTimer();

    if (seconds <= 0) {
      clearInterval(interval);
      explode();
    }
  }, 1000);
}

function updateTimer() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").innerText = `${m}:${s}`;
}

async function explode() {
  document.body.style.backgroundColor = "darkred";
  document.getElementById("timer").innerText = "00:00";

  await uartCharacteristic.writeValue(
    new TextEncoder().encode("BOOM\n")
  );
}
