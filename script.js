let clicks = 0;
let timeLeft = 5;
let timerRunning = false;
let timer = null;

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
    timer = setInterval(() => {
        timeLeft--;
        timerText.innerText = "Time Left: " + timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            timerRunning = false;

            let cps = (clicks / 5).toFixed(2);
            cpsText.innerText =
                "Time up! Total Clicks: " + clicks + " | CPS: " + cps;

            clickBtn.disabled = true;
        }
    }, 1000);
}

restartBtn.onclick = () => {
    clearInterval(timer);

    clicks = 0;
    timeLeft = 5;
    timerRunning = false;

    timerText.innerText = "Time Left: 5";
    cpsText.innerText = "CPS: 0";

    clickBtn.disabled = false;
};
