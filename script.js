const song = document.querySelector("#song");
const heroMusicButton = document.querySelector("#musicToggle");
const playerButton = document.querySelector("#playerButton");
const playerTrack = document.querySelector(".player__track");
let unlockArmed = false;

function setButtons(isPlaying) {
  const heroLabel = isPlaying ? "Pausar canción" : "Escuchar canción";
  const playerLabel = isPlaying ? "Pausar" : "Reproducir";
  heroMusicButton.textContent = heroLabel;
  playerButton.textContent = playerLabel;
}

async function startMusic() {
  try {
    song.volume = 0.82;
    await song.play();
    setButtons(true);
    return true;
  } catch {
    setButtons(false);
    return false;
  }
}

function armGestureStart() {
  if (unlockArmed) {
    return;
  }

  unlockArmed = true;
  const events = ["pointerdown", "touchstart", "click", "keydown"];

  const unlock = async (event) => {
    const target = event.target;
    const isControl =
      target instanceof Element &&
      target.closest("#musicToggle, #playerButton, a");

    if (isControl) {
      return;
    }

    const started = await startMusic();
    if (started) {
      events.forEach((name) => document.removeEventListener(name, unlock));
    }
  };

  events.forEach((name) => {
    document.addEventListener(name, unlock, { passive: true });
  });
}

async function toggleMusic() {
  if (song.paused) {
    await startMusic();
  } else {
    song.pause();
    setButtons(false);
  }
}

function updateProgress() {
  if (!song.duration) {
    playerTrack.style.setProperty("--progress", "0%");
    return;
  }

  const progress = Math.min(100, (song.currentTime / song.duration) * 100);
  playerTrack.style.setProperty("--progress", `${progress}%`);
}

heroMusicButton.addEventListener("click", toggleMusic);
playerButton.addEventListener("click", toggleMusic);
song.addEventListener("play", () => setButtons(true));
song.addEventListener("pause", () => setButtons(false));
song.addEventListener("ended", () => setButtons(false));
song.addEventListener("timeupdate", updateProgress);

startMusic().then((started) => {
  if (!started) {
    armGestureStart();
  }
});
