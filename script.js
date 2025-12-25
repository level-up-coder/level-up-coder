let clicks = 0;
let counter = 5;
let timeLeft = counter;
let timerRunning = false;
let timer;
let timerText = document.getElementById("timer")
let cpsText = document.getElementById("cps")
let clickBtn = document.getElementById("clickBtn")

document.getElementById("clickBtn").onclick = () => {

    if (!timerRunning) {
        timerRunning = true;
        startCountdown();
    }

    if (timeLeft > 0) {
        clicks++;
    }
};

function func() {
        
    timeLeft--;

    timerText.innerText = "Time Left: " + timeLeft;

    if (timeLeft === 0) {
        
        clearInterval(timer);

        let cps = (clicks / counter).toFixed(2);
        timerText.innerText = "Time up!"
        cpsText.innerText ="Total Clicks: " + clicks + " | CPS: " + cps;

        clickBtn.disabled = true;
    }

}


function startCountdown() {
    timer = setInterval(func, 1000);
}

document.getElementById("restartBtn").onclick = () =>{
    clearInterval(timer);
    clicks = 0;
    timeLeft = counter;
    timerRunning = false;

    timerText.innerText = "Time Left: " + counter;
    cpsText.innerText = "CPS: 0";

    clickBtn.disabled = false;

};