let clicks = 0;
let timeLeft = 5;
let timer = null;
let timerRunning = false;

const clickBtn = document.getElementById("clickBtn");
const restartBtn = document.getElementById("restartBtn");
const timerText = document.getElementById("timer");
const cpsText = document.getElementById("cps");

clickBtn.onclick = () => {
    if (!timerRunning) {
        timerRunning = true;
        startCountdown();
    }

    if (timeLeft > 0) {
        clicks++;
    }
};

function startCountdown() {
    timerText.innerText = "Time Left: " + timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = "Time Left: " + timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerRunning = false;

            const cps = (clicks / 5).toFixed(2);
            cpsText.innerText = `Time up! Total Clicks: ${clicks} | CPS: ${cps}`;

            clickBtn.disabled = true;
        }
    }, 1000);
}

restartBtn.onclick = () => {
    clearInterval(timer);
    alert("restart button")
    // RESET STATE
    clicks = 0;
    timeLeft = 5;
    timerRunning = false;
    timer = null;

    // RESET UI
    timerText.innerText = "Time Left: 5";
    cpsText.innerText = "CPS: 0";
    clickBtn.disabled = false;
};
