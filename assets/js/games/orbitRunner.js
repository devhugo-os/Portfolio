(function () {
  function init() {
    const canvas = document.getElementById("orbit-runner");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("orbit-score");
    const livesEl = document.getElementById("orbit-lives");
    const comboEl = document.getElementById("orbit-combo");
    const startButton = document.getElementById("orbit-start");
    const resetButton = document.getElementById("orbit-reset");

    const state = {
      width: 920,
      height: 420,
      running: false,
      gameOver: false,
      score: 0,
      lives: 3,
      combo: 1,
      lastTime: 0,
      obstacleTimer: 0.6,
      pickupTimer: 1.1,
      player: { x: 120, y: 210, targetY: 210, radius: 18 },
      obstacles: [],
      pickups: [],
      particles: [],
      stars: [],
      keys: { up: false, down: false }
    };

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function syncCanvasSize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.width = Math.max(320, rect.width || 920);
      state.height = Math.max(180, rect.height || 420);
      canvas.width = Math.floor(state.width * dpr);
      canvas.height = Math.floor(state.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!state.stars.length) {
        createStars();
      }
    }

    function createStars() {
      state.stars = Array.from({ length: 90 }, () => ({
        x: random(0, state.width),
        y: random(0, state.height),
        speed: random(20, 90),
        size: random(1, 2.4),
        color: Math.random() > 0.5 ? "#42f2b7" : "#f5f2e8"
      }));
    }

    function reset() {
      state.running = false;
      state.gameOver = false;
      state.score = 0;
      state.lives = 3;
      state.combo = 1;
      state.obstacleTimer = 0.6;
      state.pickupTimer = 1.1;
      state.player.y = state.height / 2;
      state.player.targetY = state.height / 2;
      state.obstacles = [];
      state.pickups = [];
      state.particles = [];
      updateHud();
      updateStartButton();
      render();
    }

    function start() {
      if (state.gameOver) {
        reset();
      }
      state.running = true;
      state.lastTime = performance.now();
      updateStartButton();
    }

    function toggleRunning() {
      if (state.running) {
        state.running = false;
      } else {
        start();
      }
      updateStartButton();
      render();
    }

    function updateStartButton() {
      if (!startButton) return;
      const icon = state.running ? "bi-pause-fill" : "bi-play-fill";
      const label = state.running ? "Pausar" : "Jogar";
      startButton.innerHTML = `<i class="bi ${icon}"></i>${label}`;
    }

    function updateHud() {
      if (scoreEl) scoreEl.textContent = Math.floor(state.score).toString();
      if (livesEl) livesEl.textContent = state.lives.toString();
      if (comboEl) comboEl.textContent = `${state.combo}x`;
    }

    function setTargetFromClientY(clientY) {
      const rect = canvas.getBoundingClientRect();
      state.player.targetY = clamp(clientY - rect.top, 30, state.height - 30);
    }

    function spawnObstacle() {
      const radius = random(16, 32);
      state.obstacles.push({
        x: state.width + radius,
        y: random(38, state.height - 38),
        radius,
        speed: random(170, 245) + Math.min(state.score * 0.08, 120),
        spin: random(-0.05, 0.05),
        angle: random(0, Math.PI * 2)
      });
    }

    function spawnPickup() {
      state.pickups.push({
        x: state.width + 22,
        y: random(34, state.height - 34),
        radius: 11,
        speed: random(145, 210),
        pulse: random(0, Math.PI * 2)
      });
    }

    function createBurst(x, y, color) {
      for (let i = 0; i < 14; i += 1) {
        state.particles.push({
          x,
          y,
          vx: random(-140, 140),
          vy: random(-140, 140),
          life: random(0.32, 0.62),
          maxLife: 0.62,
          color
        });
      }
    }

    function distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function update(dt) {
      if (!state.running) return;

      const keyDirection = Number(state.keys.down) - Number(state.keys.up);
      if (keyDirection) {
        state.player.targetY = clamp(state.player.targetY + keyDirection * 360 * dt, 30, state.height - 30);
      }

      state.player.y += (state.player.targetY - state.player.y) * Math.min(1, dt * 9);
      state.score += dt * 9 * state.combo;
      state.obstacleTimer -= dt;
      state.pickupTimer -= dt;

      if (state.obstacleTimer <= 0) {
        spawnObstacle();
        state.obstacleTimer = random(0.52, 0.95);
      }

      if (state.pickupTimer <= 0) {
        spawnPickup();
        state.pickupTimer = random(0.9, 1.55);
      }

      state.stars.forEach((star) => {
        star.x -= star.speed * dt;
        if (star.x < -8) {
          star.x = state.width + 8;
          star.y = random(0, state.height);
        }
      });

      state.obstacles.forEach((obstacle) => {
        obstacle.x -= obstacle.speed * dt;
        obstacle.angle += obstacle.spin;
      });

      state.pickups.forEach((pickup) => {
        pickup.x -= pickup.speed * dt;
        pickup.pulse += dt * 5;
      });

      state.particles.forEach((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.life -= dt;
      });

      const playerCircle = { x: state.player.x, y: state.player.y };

      state.obstacles = state.obstacles.filter((obstacle) => {
        const hit = distance(playerCircle, obstacle) < state.player.radius + obstacle.radius * 0.78;
        if (hit) {
          state.lives -= 1;
          state.combo = 1;
          createBurst(obstacle.x, obstacle.y, "#ff6b57");
          if (state.lives <= 0) {
            state.running = false;
            state.gameOver = true;
            updateStartButton();
          }
          return false;
        }
        return obstacle.x > -obstacle.radius * 2;
      });

      state.pickups = state.pickups.filter((pickup) => {
        const collected = distance(playerCircle, pickup) < state.player.radius + pickup.radius + 4;
        if (collected) {
          state.score += 50 * state.combo;
          state.combo = clamp(state.combo + 1, 1, 5);
          createBurst(pickup.x, pickup.y, "#42f2b7");
          return false;
        }
        return pickup.x > -40;
      });

      state.particles = state.particles.filter((particle) => particle.life > 0);
      updateHud();
    }

    function drawPlayer() {
      const { x, y, radius } = state.player;
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.moveTo(radius + 12, 0);
      ctx.lineTo(-radius, -radius * 0.72);
      ctx.lineTo(-radius * 0.52, 0);
      ctx.lineTo(-radius, radius * 0.72);
      ctx.closePath();
      ctx.fillStyle = "#42f2b7";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#42f2b7";
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#10130f";
      ctx.beginPath();
      ctx.arc(3, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawObstacle(obstacle) {
      ctx.save();
      ctx.translate(obstacle.x, obstacle.y);
      ctx.rotate(obstacle.angle);
      ctx.strokeStyle = "#ff6b57";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ff6b57";
      for (let i = 0; i < 6; i += 1) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(obstacle.radius, 0);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, obstacle.radius * 0.52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    function drawPickup(pickup) {
      const pulse = Math.sin(pickup.pulse) * 4;
      ctx.save();
      ctx.translate(pickup.x, pickup.y);
      ctx.fillStyle = "#f7c948";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#f7c948";
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const angle = -Math.PI / 2 + i * ((Math.PI * 2) / 5);
        const x = Math.cos(angle) * (pickup.radius + pulse);
        const y = Math.sin(angle) * (pickup.radius + pulse);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawOverlay(title, subtitle) {
      ctx.save();
      ctx.fillStyle = "rgba(9, 10, 8, 0.62)";
      ctx.fillRect(0, 0, state.width, state.height);
      ctx.textAlign = "center";
      ctx.fillStyle = "#f5f2e8";
      ctx.font = "700 28px Space Grotesk, sans-serif";
      ctx.fillText(title, state.width / 2, state.height / 2 - 8);
      ctx.fillStyle = "#b7baad";
      ctx.font = "600 14px Inter, sans-serif";
      ctx.fillText(subtitle, state.width / 2, state.height / 2 + 24);
      ctx.restore();
    }

    function render() {
      ctx.clearRect(0, 0, state.width, state.height);

      const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
      gradient.addColorStop(0, "#070906");
      gradient.addColorStop(0.48, "#10130f");
      gradient.addColorStop(1, "#17110d");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, state.width, state.height);

      ctx.strokeStyle = "rgba(245, 242, 232, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < state.width; x += 54) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - 80, state.height);
        ctx.stroke();
      }

      state.stars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      state.pickups.forEach(drawPickup);
      state.obstacles.forEach(drawObstacle);
      drawPlayer();

      state.particles.forEach((particle) => {
        const alpha = clamp(particle.life / particle.maxLife, 0, 1);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (state.gameOver) {
        drawOverlay("Fim de rota", "Reinicie para tentar um combo maior");
      } else if (!state.running && state.score === 0) {
        drawOverlay("Orbit Runner", "Clique em jogar e guie a nave");
      } else if (!state.running) {
        drawOverlay("Pausado", "Clique em jogar para continuar");
      }
    }

    function loop(time) {
      const dt = Math.min((time - state.lastTime) / 1000 || 0, 0.04);
      state.lastTime = time;
      update(dt);
      render();
      requestAnimationFrame(loop);
    }

    canvas.addEventListener("pointermove", (event) => setTargetFromClientY(event.clientY), { passive: true });
    canvas.addEventListener("pointerdown", (event) => {
      setTargetFromClientY(event.clientY);
      if (!state.running) start();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") state.keys.up = true;
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") state.keys.down = true;
      if (event.code === "Space" && document.activeElement === document.body) {
        event.preventDefault();
        toggleRunning();
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") state.keys.up = false;
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") state.keys.down = false;
    });

    if (startButton) startButton.addEventListener("click", toggleRunning);
    if (resetButton) resetButton.addEventListener("click", reset);
    window.addEventListener("resize", () => {
      state.stars = [];
      syncCanvasSize();
      reset();
    }, { passive: true });

    syncCanvasSize();
    reset();
    requestAnimationFrame(loop);
  }

  window.Portfolio = window.Portfolio || {};
  window.Portfolio.OrbitRunner = { init };
})();
