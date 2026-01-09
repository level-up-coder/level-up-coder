let device;
let server;
let uartService;
let uartRX;
let uartTX;

// micro:bit UART UUIDs (CORRECT)
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // micro:bit → browser
const UART_RX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"; // browser → micro:bit

document.addEventListener("DOMContentLoaded", () => {

  const connectBtn = document.getElementById("connect");
  const startBtn = document.getElementById("start");

  // ---------- CONNECT ----------
  connectBtn.addEventListener("click", async () => {
    try {
      console.log("Connect clicked");

      device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [UART_SERVICE_UUID] }]
      });

      server = await device.gatt.connect();
      uartService = await server.getPrimaryService(UART_SERVICE_UUID);

      uartTX = await uartService.getCharacteristic(UART_TX_UUID);
      uartRX = await uartService.getCharacteristic(UART_RX_UUID);

      alert("micro:bit connected ✅");
    } catch (err) {
      console.error(err);
      alert("Bluetooth connection failed");
    }
  });

  // ---------- START ----------
  startBtn.addEventListener("click", async () => {
    if (!uartRX) {
      alert("Connect micro:bit first!");
      return;
    }

    try {
      console.log("Start clicked");

      // Send BOOM\n to micro:bit
      const encoder = new TextEncoder();
      await uartRX.writeValue(encoder.encode("BOOM\n"));

      alert("💥 BOOM sent to micro:bit!");
    } catch (err) {
      console.error(err);
      alert("Failed to send command");
    }
  });

});
