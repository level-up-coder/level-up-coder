    const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    let rxChar, timerInterval, timeLeft = 20;

    function log(msg, color = '#888') {
        const entry = document.createElement('div');
        entry.innerHTML = `<span style="color: ${color}">> ${msg}</span>`;
        const c = document.getElementById('console');
        c.appendChild(entry);
        c.scrollTop = c.scrollHeight;
    }

    document.getElementById('connectBtn').onclick = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'BBC micro:bit' }],
                optionalServices: [SERVICE_UUID]
            });
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(SERVICE_UUID);
            rxChar = await service.getCharacteristic(RX_CHARACTERISTIC);
            
            document.getElementById('status-text').innerText = "ONLINE";
            document.getElementById('status-text').style.color = "var(--neon-green)";
            document.getElementById('startTimerBtn').style.display = "inline-block";
            log("CONNECTION ESTABLISHED", "var(--neon-green)");
        } catch (e) { log("ERR: " + e.message, "var(--danger)"); }
    };

    document.getElementById('startTimerBtn').onclick = () => {
        document.getElementById('timerDisplay').style.display = "block";
        document.getElementById('defuseBtn').style.display = "inline-block";
        document.getElementById('startTimerBtn').style.display = "none";
        log("TIMER_START: 20s", "var(--danger)");
        
        timerInterval = setInterval(async () => {
            timeLeft--;
            document.getElementById('timerDisplay').innerText = timeLeft + "s";
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                const encoder = new TextEncoder();
                // Send BOOM command
                await rxChar.writeValue(encoder.encode("BOOM\n"));
                log("SIGNAL_SENT: BOOM", "var(--danger)");
                document.getElementById('timerDisplay').innerText = "DETONATED";
            }
        }, 1000);
    };

    document.getElementById('defuseBtn').onclick = () => {
        clearInterval(timerInterval);
        document.getElementById('timerDisplay').innerText = "SAFE";
        log("DEFUSE_SUCCESSFUL", "var(--neon-green)");
        document.getElementById('defuseBtn').style.display = "none";
    };