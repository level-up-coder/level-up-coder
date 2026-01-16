    const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const RX_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    const TX_CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    const CORRECT_CODE ="122011"; 
    
    let rxChar, timerInterval, endTime;

    function log(msg, color = '#888') {
        const entry = document.createElement('div');
        entry.innerHTML = `<span style="color: ${color}">> ${msg}</span>`;
        document.getElementById('console').appendChild(entry);
        document.getElementById('console').scrollTop = document.getElementById('console').scrollHeight;
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
            
            // Listen for the "TILT" signal from the microbit
            const txChar = await service.getCharacteristic(TX_CHARACTERISTIC);
            await txChar.startNotifications();
            txChar.addEventListener('characteristicvaluechanged', (event) => {
                const value = new TextDecoder().decode(event.target.value);
                let secondsLeft = (endTime - Date.now()) / 1000;
                if (value.includes("TILT")) {
                    document.getElementById('defuseArea').style.display = "block";
                    log("REMOTE_EVENT: MOTION DETECTED", "orange");
                }
            });

            document.getElementById('connectBtn').style.display = "none";
            document.getElementById('startTimerBtn').style.display = "inline-block";
            log("UPLINK_STABLE", "#00ff41");
        } catch (e) { log("ERR: " + e.message, "#ff3e3e"); }
    };

    document.getElementById('startTimerBtn').onclick = () => {
        endTime = Date.now() + 3600000;
        document.getElementById('timerDisplay').style.display = "block";
        document.getElementById('startTimerBtn').style.display = "none";
        log("PAYLOAD_ARMED", "#ff3e3e");
        
        timerInterval = setInterval(async () => {
            let secondsLeft = (endTime - Date.now()) / 1000;
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                document.getElementById("progressBar").style.width="0%";
                document.getElementById('timerDisplay').innerText = "DETONATED";
                await rxChar.writeValue(new TextEncoder().encode("BOOM\n"));
                
                const sfx = document.getElementById('explosion');
                sfx.play().catch(e => console.log("Audio play failed: ", e));
            
            } else {
                let percentage=(secondsLeft/3600)*100;
                document.getElementById('progressBar').style.width = percentage + "%";
                if (secondsLeft<5){
                    document.getElementById('progressBar').style.background = (Math.floor(Date.now()/100)%2) ? "#fff" : "#ff3e3e";
                }
                document.getElementById('timerDisplay').innerText = secondsLeft.toFixed(secondsLeft < 10 ? 2 : 0) + "s";
            }
        }, 10);
    };

    document.getElementById('defuseBtn').onclick = () => {
        // 1. CHECK IF THE BOMB HAS ALREADY EXPLODED
        let secondsLeft = (endTime - Date.now()) / 1000;
    
        if (secondsLeft <= 0) {
            log("ERROR: CANNOT DISARM. PAYLOAD HAS DETONATED.", "#ff3e3e");
            document.getElementById('defuseArea').style.display = "none";
            return; // This stops the rest of the code from running!
        }

        // 2. IF NOT EXPLODED, CHECK THE CODE
        const input = document.getElementById('passcodeInput').value;
        if (input === CORRECT_CODE) {
            clearInterval(timerInterval);
            document.getElementById('timerDisplay').innerText = "SAFE";
            document.getElementById('timerDisplay').style.color = "#00ff41";
            document.getElementById('defuseArea').style.display = "none";
            log("ACCESS_GRANTED: SYSTEM_DISARMED", "#00ff41");
        } else {
            endTime -= 5000; // Penalty
            document.getElementById('passcodeInput').value = "";
            log("ACCESS_DENIED: PENALTY -5s", "#ff3e3e");
        }
    };