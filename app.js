// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("Service Worker registered", reg))
    .catch((err) => console.log("Service Worker not registered", err));
}

// Pomodoro timer
const WORKING_TIME = 0.05;
const REST_TIME = 0.05;
const NUMBER_OF_SESSIONS = 3;
let sessionNumber = 0;

const timerEl = document.querySelector(".timer");

const timers = JSON.parse(localStorage.getItem("timers")) || [];

const sessions = JSON.parse(localStorage.getItem("sessions")) || [];

// Define timer buttons
document.querySelector(".start").addEventListener("click", () => {
  timer.start();
});

document.querySelector(".stop").addEventListener("click", () => {
  timer.stop();
});

document.querySelector(".pause").addEventListener("click", () => {
  timer.pause();
});


class Timer {
  constructor(time) {
    if (timers != null && timers.length > 0) {
      const t = timers.pop();
      this.time = t.time;
      this.intervalId = t.intervalId;
      this.numberOfIntervals = t.numberOfIntervals;
      this.intervalCount = t.intervalCount;
      this.isWorking = t.isWorking;
    } else {
      this.time = time;
      this.intervalId = null;
      this.numberOfIntervals = NUMBER_OF_SESSIONS * 2;
      this.intervalCount = 1;
      this.isWorking = true;
    }

    const s = sessions.pop();
    if(s != null && s.length > 0) {
      sessionNumber = s.nrSessions;
    }
  }

  start() {
    console.log("Starting timer");
    this.update();

    this.intervalId = setInterval(() => {
      if (this.time <= 0) {
        clearInterval(this.intervalId);
        this.intervalCount++;

        if (this.intervalCount > this.numberOfIntervals) {
          alert("All intervals completed!");
          sessionNumber++;
          this.save();
          this.stop();
        } else {
          this.toggleMode();
          this.start();
        }
      } else {
        this.time--;
        this.update();
      }
    }, 1000);
  }

  stop() {
    console.log("Stopping timer");
    clearInterval(this.intervalId);
    this.time = WORKING_TIME * 60;
    this.intervalCount = 1;

    this.update();
    this.save();
  }

  pause() {
    console.log("Pausing timer");
    clearInterval(this.intervalId);
    this.save();
  }

  update() {
    changeDisplay(
      this.time,
      this.isWorking ? "Work" : "Rest",
      `${this.intervalCount}/${this.numberOfIntervals}`
    );

    // if is working change background to red else green
    document.body.style.backgroundImage = this.isWorking
      ? "linear-gradient(to right, #f78ca0 0%, #f9748f 19%, #fd868c 60%, #fe9a8b 100%)"
      : "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)";
  }

  toggleMode() {
    this.isWorking = !this.isWorking;
    this.time = this.isWorking ? WORKING_TIME * 60 : REST_TIME * 60;
    this.update();
  }

  save() {
    if (this.intervalCount >= this.numberOfIntervals){
      timers.pop();
      sessions.push({
        sessionNumber: sessionNumber,
        date: new Date()
      });
      localStorage.setItem("sessions", JSON.stringify(sessions));
      console.log("SESSIONS: " + JSON.stringify(sessions));
    }else{
      timers.push({
        time: this.time,
        intervalId: this.intervalId,
        numberOfIntervals: this.numberOfIntervals,
        intervalCount: this.intervalCount,
        isWorking: this.isWorking,
      });
    }
    localStorage.setItem("timers", JSON.stringify(timers));
    
  }
}

// Create timer
const timer = new Timer(WORKING_TIME * 60);

// Set initial time display
changeDisplay(
  timer.time,
  timer.isWorking ? "Work" : "Rest",
  `${timer.intervalCount}/${timer.numberOfIntervals}`
);

function changeDisplay(time, mode, intervalCount = null) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  timerEl.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} ${mode} ${intervalCount ? `(${intervalCount})` : ""}`;
}
