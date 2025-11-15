// --- Intro fade sequence ---
const texts = ["introText1", "introText2", "introText3"];
let current = 0;

function showNextIntro() {
  if (current > 0) {
    document.getElementById(texts[current - 1]).style.opacity = 0;
  }
  if (current < texts.length) {
    const el = document.getElementById(texts[current]);
    el.style.opacity = 1;
    current++;
    setTimeout(showNextIntro, 3000);
  } else {
    setTimeout(() => {
      document.querySelector(".intro").style.display = "none";
      document.getElementById("gallery").classList.remove("hidden");
      confettiBurst();
      init3D();
      document.getElementById("message").classList.remove("hidden");
    }, 2000);
  }
}

window.onload = () => {
  showNextIntro();
  heartAnim();
};
document.addEventListener('click', () => {
  const audio = document.getElementById('bg-music');
  if (audio) {
    audio.muted = false;
    audio.volume = 1;
    audio.play().catch(() => {});
  }
}, { once: true });

// --- Floating hearts ---
function heartAnim() {
  const canvas = document.getElementById("hearts"),
    ctx = canvas.getContext("2d");

  function sizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  sizeCanvas();
  addEventListener("resize", sizeCanvas);

  const hearts = [];
  function Heart() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 20 + 10;
    this.speed = Math.random() * 1 + 0.5;
    this.alpha = Math.random();
    this.color = `rgba(255,105,180,${this.alpha})`;
  }
  for (let i = 0; i < 30; i++) hearts.push(new Heart());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let h of hearts) {
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(
        h.x - h.size / 2,
        h.y - h.size / 2,
        h.x - h.size,
        h.y + h.size / 3,
        h.x,
        h.y + h.size
      );
      ctx.bezierCurveTo(
        h.x + h.size,
        h.y + h.size / 3,
        h.x + h.size / 2,
        h.y - h.size / 2,
        h.x,
        h.y
      );
      ctx.fillStyle = h.color;
      ctx.fill();
      h.y -= h.speed;
      if (h.y < -100) h.y = canvas.height + 100;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// --- 3D Photo Ring ---
function init3D() {
  const ospin = document.getElementById("spin-container");
  const aImg = ospin.getElementsByTagName("img");
  const radius = 300;

  for (let i = 0; i < aImg.length; i++) {
    aImg[i].style.transform = `rotateY(${i * (360 / aImg.length)}deg) translateZ(${radius}px)`;
  }
  ospin.style.animation = `spin 40s infinite linear`;

  // Pause on hover (nice touch)
  ospin.addEventListener("mouseenter", () => (ospin.style.animationPlayState = "paused"));
  ospin.addEventListener("mouseleave", () => (ospin.style.animationPlayState = "running"));
}

// Add keyframes programmatically (keeps CSS tidy)
const style = document.createElement("style");
style.innerHTML = `@keyframes spin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}`;
document.head.appendChild(style);

// --- Confetti burst when gallery appears ---
function confettiBurst() {
  const duration = 3000;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 5,
      startVelocity: 20,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// --- Unmute toggle for mobile (for <audio>) ---
document.getElementById("unmute")?.addEventListener("click", () => {
  const audio = document.getElementById("bg-music");
  if (!audio) return;
  audio.muted = false;
  audio.volume = 0; // start low then fade
  audio.play().catch(() => {});
  let v = 0;
  const fade = setInterval(() => {
    v = Math.min(1, v + 0.05);
    audio.volume = v;
    if (v >= 1) clearInterval(fade);
  }, 120);
  document.getElementById("unmute").style.display = "none";
});

// 🌸 Smooth fade-in for background music (when autoplay is allowed)
window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-music");
  if (!audio) return;

  // Many mobile browsers start audio muted unless user interacts.
  // We'll try to play quietly; if blocked, the unmute button handles it.
  audio.volume = 0;
  audio.play().then(() => {
    let vol = 0;
    const fade = setInterval(() => {
      vol = Math.min(1, vol + 0.02);
      audio.volume = vol;
      if (vol >= 1) clearInterval(fade);
    }, 100);
  }).catch(() => {
    // Autoplay blocked — keep the unmute pill visible
  });
});
// Playlist for two songs
const songs = [
  "music/ehdewafa.mp3",
  "music/shayar.mp3"
];

const audio = document.getElementById("bg-music");
let currentSong = 0;

// Function to play a song by index
function playSong(index) {
  audio.src = songs[index];
  audio.play().catch(() => {});
}

// Play the first song
playSong(currentSong);

// When a song ends, play the next one
audio.addEventListener("ended", () => {
  currentSong++;
  if (currentSong < songs.length) {
    playSong(currentSong);
  } else {
    currentSong = 0; // optional: loop back to first song
    playSong(currentSong);
  }
});

// Unmute for mobile / autoplay
document.getElementById("unmute").addEventListener("click", () => {
  audio.muted = false;
  audio.volume = 1;
  audio.play().catch(() => {});
  document.getElementById("unmute").style.display = "none";
});
