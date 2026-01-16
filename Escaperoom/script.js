
    // --- CONFIGURATION ---
    const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    const TX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    
    // Set your long code here (Infinite digits supported)
    const CORRECT_CODE = "122011"; 
    const TOTAL_TIME_SECONDS = 3600; // 1 Hour
    
    let rxChar, timerInterval, endTime;
    let isDetonated = false;

    function log(msg, color = '#888') {
        const entry = document.createElement('div');
        entry.innerHTML = `<span style="color: ${color}">> ${msg}</span>`;
        document.getElementById('console').appendChild(entry);
        document.getElementById('console').scrollTop = document.getElementById('console').scrollHeight;
    }

    // --- 1. BLUETOOTH CONNECTION ---
    document.getElementById('connectBtn').onclick = async () => {
        try {
            log("SCANNING FOR BROADCAST...");
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ namePrefix: 'BBC micro:bit' }],
                optionalServices: [SERVICE_UUID]
            });
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(SERVICE_UUID);
            rxChar = await service.getCharacteristic(RX_CHARACTERISTIC);
            
            const txChar = await service.getCharacteristic(TX_CHARACTERISTIC);
            await txChar.startNotifications();

            txChar.addEventListener('characteristicvaluechanged', (event) => {
                const value = new TextDecoder().decode(event.target.value);
                // Only show keypad if the bomb hasn't gone off yet
                if (value.includes("TILT") && !isDetonated) {
                    document.getElementById('defuseArea').style.display = "block";
                    log("REMOTE_EVENT: MOTION DETECTED", "orange");
                }
            });

            document.getElementById('connectBtn').style.display = "none";
            document.getElementById('startTimerBtn').style.display = "inline-block";
            log("UPLINK_STABLE", "#00ff41");
        } catch (e) { log("ERR: " + e.message, "#ff3e3e"); }
    };

    // --- 2. TIMER LOGIC (1 HOUR) ---
    document.getElementById('startTimerBtn').onclick = () => {
        isDetonated = false;
        endTime = Date.now() + (TOTAL_TIME_SECONDS * 1000);
        
        document.getElementById('timerDisplay').style.display = "block";
        document.getElementById('startTimerBtn').style.display = "none";
        log("PAYLOAD_ARMED", "#ff3e3e");
        
        timerInterval = setInterval(async () => {
            let secondsLeft = (endTime - Date.now()) / 1000;
            
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                isDetonated = true;
                
                // Visuals
                document.getElementById('timerDisplay').innerText = "DETONATED";
                document.getElementById("progressBar").style.width = "0%";
                document.getElementById('defuseArea').style.display = "none";

                // Audio (Make sure ID matches your HTML)
                const sfx = document.getElementById('explosion');
                if(sfx) sfx.play().catch(e => console.log("Audio Error"));

                // Microbit Signal
                await rxChar.writeValue(new TextEncoder().encode("BOOM\n"));
                log("TERMINAL_LOCK: SYSTEM_EXPIRED", "#ff3e3e");
            } else {
                // FIXED MATH: Divide by 3600 so bar starts at 100%
                let percentage = (secondsLeft / TOTAL_TIME_SECONDS) * 100;
                document.getElementById('progressBar').style.width = percentage + "%";
                
                // Show seconds (e.g., 3599s)
                document.getElementById('timerDisplay').innerText = secondsLeft.toFixed(secondsLeft < 10 ? 2 : 0) + "s";

                // Critical Warning (last 5 seconds)
                if (secondsLeft < 5) {
                    document.getElementById('progressBar').style.background = (Math.floor(Date.now()/100)%2) ? "#fff" : "#ff3e3e";
                }
            }
        }, 10);
    };

    // --- 3. DEFUSE LOGIC (INFINITE DIGITS) ---
    document.getElementById('defuseBtn').onclick = () => {
        // Block if already exploded
        if (isDetonated) {
            log("ERROR: SYSTEM_OFFLINE", "#ff3e3e");
            return;
        }

        const input = document.getElementById('passcodeInput').value;
        
        // Exact string comparison for any length of digits
        if (input === CORRECT_CODE) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').innerText = "SAFE";
            document.getElementById('timerDisplay').style.color = "#00ff41";
            document.getElementById('defuseArea').style.display = "none";
            document.getElementById('progressBar').style.background = "#00ff41";
            log("ACCESS_GRANTED: DISARMED", "#00ff41");
        } else {
            endTime -= 5000; // 5-second penalty
            document.getElementById('passcodeInput').value = ""; // Clear input
            log("AUTH_FAILURE: -5s PENALTY", "#ff3e3e");
        }
    };
