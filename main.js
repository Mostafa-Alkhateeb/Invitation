(function () {
  // إعدادات العد التنازلي
  const weddingDate = new Date(2026, 5, 24, 20, 0, 0); // 24/6/2026 8:00 PM
  let countdownInterval;

  // 1. Canvas Animation : قلوب وورود متحركة
  const canvas = document.getElementById("heartCanvas");
  let ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class HeartParticle {
    constructor(x, y, size, speedY, type = "heart") {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speedY = speedY;
      this.type = type;
      this.angle = Math.random() * Math.PI * 2;
      this.opacity = 0.5 + Math.random() * 0.4;
    }
    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.type === "heart") {
        ctx.fillStyle = `rgba(235, 70, 110, ${0.4 + Math.random() * 0.3})`;
        ctx.beginPath();
        const x = this.x,
          y = this.y,
          size = this.size;
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size, y - size, x - size, y + size, x, y + size);
        ctx.bezierCurveTo(x + size, y + size, x + size, y - size, x, y);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(245, 150, 180, ${0.5})`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          let angleRad = (i * 72 * Math.PI) / 180;
          let px = this.x + Math.cos(angleRad) * this.size;
          let py = this.y + Math.sin(angleRad) * this.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(255,200,100,0.7)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, 2 * Math.PI);
        ctx.fill();
      }
      ctx.restore();
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.angle) * 0.3;
      this.angle += 0.02;
      if (this.y > height + 50) {
        this.y = -30;
        this.x = Math.random() * width;
      }
      if (this.x > width + 30) this.x = -20;
      if (this.x < -30) this.x = width + 20;
    }
  }

  function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      let type = Math.random() > 0.6 ? "flower" : "heart";
      let size = 8 + Math.random() * 18;
      let speed = 0.5 + Math.random() * 2;
      let x = Math.random() * width;
      let y = Math.random() * height;
      particles.push(new HeartParticle(x, y, size, speed, type));
    }
  }

  function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateParticles);
  }

  function startCanvasBackground() {
    resizeCanvas();
    initParticles(70);
    animateParticles();
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles(70);
  });

  // 2. دالة العد التنازلي
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const excitementMsg = document.getElementById("excitementMsg");

    if (distance <= 0) {
      if (daysEl) daysEl.innerText = "00";
      if (hoursEl) hoursEl.innerText = "00";
      if (minutesEl) minutesEl.innerText = "00";
      if (secondsEl) secondsEl.innerText = "00";
      if (excitementMsg) {
        excitementMsg.innerHTML =
          "🎉🎊 اليوم هو يوم الفرح العظيم! حفل الزفاف الآن 🎊🎉";
        excitementMsg.style.animation = "pulseText 0.6s infinite";
        excitementMsg.style.background = "#e84373";
        excitementMsg.style.color = "white";
        excitementMsg.style.padding = "0.7rem 1.8rem";
      }
      launchBalloons();
      if (countdownInterval) clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? "0" + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? "0" + hours : hours;
    if (minutesEl) minutesEl.innerText = minutes < 10 ? "0" + minutes : minutes;
    if (secondsEl) secondsEl.innerText = seconds < 10 ? "0" + seconds : seconds;

    if (days <= 7 && days > 0) {
      excitementMsg.innerHTML =
        "💖🔥 باقي أيام قليلة ,الحمدلله الذي بنعمته تتم الصالحات 🔥💖";
    } else if (days <= 30 && days > 7) {
      excitementMsg.innerHTML = "🥳✨العد التنازلي بدأ ✨🥳";
    } else {
      excitementMsg.innerHTML = "✨ ليلة تكتب وتتحكى، مستنيينكم بكل الحب ✨";
    }
  }

  function launchBalloons() {
    for (let i = 0; i < 35; i++) {
      setTimeout(() => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        const icons = ["🎈", "🎉", "💖", "🌸", "🎊", "💐", "🥳"];
        balloon.innerText = icons[Math.floor(Math.random() * icons.length)];
        balloon.style.left = Math.random() * 100 + "%";
        balloon.style.fontSize = 2 + Math.random() * 2 + "rem";
        balloon.style.animationDuration = 4 + Math.random() * 3 + "s";
        document.body.appendChild(balloon);
        setTimeout(() => {
          if (balloon && balloon.remove) balloon.remove();
        }, 6000);
      }, i * 120);
    }
  }

  // 3. منطق زر open invitation
  const openBtn = document.getElementById("openInviteBtn");
  const wrapper = document.getElementById("openBtnWrapper");
  const detailsDiv = document.getElementById("invitationDetails");

  if (openBtn) {
    openBtn.addEventListener("click", () => {
      wrapper.style.transition = "opacity 0.5s, transform 0.4s";
      wrapper.style.opacity = "0";
      wrapper.style.transform = "scale(0.9)";
      setTimeout(() => {
        wrapper.style.display = "none";
        detailsDiv.style.display = "block";
        detailsDiv.style.animation = "fadeSlideUp 0.8s ease-out";
        document.body.style.background =
          "linear-gradient(135deg, #ffeef4, #ffdfe8)";
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
      }, 400);
    });
  }

  // 4. زر الخريطة
  const mapBtn = document.getElementById("mapButton");
  if (mapBtn) {
    mapBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const address = "Grand Star Hall 2, Assuit, Egypt";
      const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(mapUrl, "_blank");
    });
  }

  // 5. بدء تشغيل الكانفاس والقلوب العائمة
  startCanvasBackground();

  setInterval(() => {
    const bgDiv = document.querySelector(".bg-animation");
    if (bgDiv && document.body) {
      let extra = document.createElement("div");
      extra.className = "floating-element";
      extra.style.position = "absolute";
      extra.style.fontSize = 1.2 + Math.random() * 1.2 + "rem";
      extra.style.left = Math.random() * 100 + "%";
      extra.style.top = "-5%";
      extra.style.animationDuration = 8 + Math.random() * 10 + "s";
      extra.style.opacity = 0.5;
      const isHeart = Math.random() > 0.4;
      extra.innerHTML = isHeart
        ? '<i class="fas fa-heart" style="color:#ff7b9c;"></i>'
        : '<i class="fas fa-feather-alt" style="color:#ff98b5;"></i>';
      bgDiv.appendChild(extra);
      setTimeout(() => {
        if (extra && extra.remove) extra.remove();
      }, 13000);
    }
  }, 3000);
})();
