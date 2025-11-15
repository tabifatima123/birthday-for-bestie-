// --- Playlist ---
const songs = [
  "music/ehdewafa.mp3",
  "music/shayar.mp3"
];

const audio = document.getElementById("bg-music");
let currentSong = 0;

// Play song by index
function playSong(index) {
  audio.src = songs[index];
  audio.play().catch(() => {
    // Autoplay blocked, wait for user
    console.log("Autoplay blocked, waiting for user interaction");
  });
}

// Start first song
playSong(currentSong);

// Play next song on ended
audio.addEventListener("ended", () => {
  currentSong++;
  if (currentSong >= songs.length) currentSong = 0;
  playSong(currentSong);
});

// --- Unmute & start audio for mobile ---
function unmuteAndPlay() {
  audio.muted = false;
  audio.volume = 1;
  audio.play().catch(() => {});
  document.getElementById("unmute").style.display = "none";
}

// Attach unmute to button
document.getElementById("unmute").addEventListener("click", unmuteAndPlay);

// Optional: also unmute/play on first click anywhere
document.addEventListener('click', unmuteAndPlay, { once: true });

// --- Intro Fade Sequence ---
const texts = ["introText1", "introText2", "introText3"];
let current = 0;

function showNextIntro() {
  if (current > 0) document.getElementById(texts[current - 1]).style.opacity = 0;
  if (current < texts.length) {
    document.getElementById(texts[current]).style.opacity = 1;
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

// --- Floating Hearts ---
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
    hearts.forEach(h => {
      ctx.beginPath();
      ctx.moveTo(h.x, h.y);
      ctx.bezierCurveTo(h.x - h.size / 2, h.y - h.size / 2, h.x - h.size, h.y + h.size / 3, h.x, h.y + h.size);
      ctx.bezierCurveTo(h.x + h.size, h.y + h.size / 3, h.x + h.size / 2, h.y - h.size / 2, h.x, h.y);
      ctx.fillStyle = h.color;
      ctx.fill();
      h.y -= h.speed;
      if (h.y < -100) h.y = canvas.height + 100;
    });
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
  ospin.addEventListener("mouseenter", () => (ospin.style.animationPlayState = "paused"));
  ospin.addEventListener("mouseleave", () => (ospin.style.animationPlayState = "running"));
}

// Add keyframes programmatically
const style = document.createElement("style");
style.innerHTML = `@keyframes spin{from{transform:rotateY(0deg)}to{transform:rotateY(360deg)}}`;
document.head.appendChild(style);

// --- Confetti Burst ---
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
