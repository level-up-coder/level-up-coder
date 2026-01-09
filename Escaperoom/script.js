let uartRX = null;

// micro:bit UART UUIDs
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_RX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

document.addEventListener("DOMContentLoaded", () => {

  const connectBtn = document.getElementById("connect");
  const startBtn = document.getElementById("start");

  if (!connectBtn || !startBtn) {
    console.error("Buttons not found in HTML");
    return;
  }

  // CONNECT BUTTON
  connectBtn.addEventListener("click", async () => {
    try {
      console.log("Connect clicked");

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [UART_SERVICE_UUID] }]
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(UART_SERVICE_UUID);
      uartRX = await service.getCharacteristic(UART_RX_UUID);

      alert("micro:bit connected ✅");
    } catch (e) {
      console.error(e);
      alert("Bluetooth connection failed");
    }
  });

  // START BUTTON
  startBtn.addEventListener("click", async () => {
    if (!uartRX) {
      alert("Connect micro:bit first!");
      return;
    }

    const encoder = new TextEncoder();
    await uartRX.writeValue(encoder.encode("BOOM\n"));

    alert("💥 BOOM sent");
  });

});
