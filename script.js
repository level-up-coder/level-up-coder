let clicks = 0;
let timeLeft = 5;
let timerRunning = false;

document.getElementById("clickBtn").onclick = () => {

    if (!timerRunning) {
        timerRunning = true;
        startCountdown();
    }

    if (timeLeft > 0) {
        clicks++;
    }
};

function startCountdown() {
    let timer = setInterval(() => {
        timeLeft--;

        document.getElementById("timer").innerText = "Time Left: " + timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);

            let cps = (clicks / 5).toFixed(2);

            document.getElementById("cps").innerText =
                "Time up! Total Clicks: " + clicks + " | CPS: " + cps;

            document.getElementById("clickBtn").disabled = true;
        }

    }, 1000);
}

document.getElementById("restartBtn").onclick = () =>{
    clearInterval(timer);

    clicks = 0;
    timeLeft = 5;
    timerRunning = false;

    timerText.innerText = "Time Left: 5";
    cpsText.innerText = "CPS: 0";

    clickBtn.disabled = false;

};