/* ==========================================================================
   LeonY34 Personal Homepage — Interactive Animations & Mini-Games
   Matches /blog (Hexo NexT Gemini) Style
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Web Audio Synthesizer (Lightweight, Zero-Dependency SFX)
     -------------------------------------------------------------------------- */
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, type, duration, vol = 0.08, slideTo = null) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, audioCtx.currentTime + duration);
      }
      gain.gain.setValueAtTime(vol, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignore audio context restrictions
    }
  }

  window.toggleGameSound = function () {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.innerHTML = soundEnabled
        ? '<i class="fa-solid fa-volume-high"></i> 音效: 开'
        : '<i class="fa-solid fa-volume-xmark"></i> 音效: 关';
    }
    if (soundEnabled) playTone(660, 'sine', 0.12, 0.06, 880);
  };

  /* --------------------------------------------------------------------------
     2. Top Reading Progress Bar & Back-to-Top Button
     -------------------------------------------------------------------------- */
  const progressBar = document.querySelector('.reading-progress-bar');
  const backToTop = document.querySelector('.back-to-top');

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (progressBar) {
      progressBar.style.width = pct + '%';
    }
    if (backToTop) {
      if (scrollTop > 220) {
        backToTop.classList.add('back-to-top-on');
      } else {
        backToTop.classList.remove('back-to-top-on');
      }
    }
  }

  window.addEventListener('scroll', updateScrollUI, { passive: true });
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Toggle
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById('mobile-nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('site-nav-on');
      navToggle.classList.toggle('toggle-close');
    });
  }

  /* --------------------------------------------------------------------------
     4. Typewriter Subtitle Effect in Hero Card
     -------------------------------------------------------------------------- */
  const phrases = [
    'Life is like a box of chocolates.',
    'Algorithms · Data Structures · Number Theory · RL',
    'Welcome to CleverL (LeonY34)\'s Digital Garden!',
    'Explore /blog for 77+ notes & test your speed in CPS!'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeEl = document.getElementById('typewriter-text');

  function tickTypewriter() {
    if (!typeEl) return;
    const current = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      typeEl.textContent = current.substring(0, charIdx);
    } else {
      charIdx++;
      typeEl.textContent = current.substring(0, charIdx);
    }

    let delay = isDeleting ? 32 : 65;
    if (!isDeleting && charIdx === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(tickTypewriter, delay);
  }
  setTimeout(tickTypewriter, 600);

  /* --------------------------------------------------------------------------
     5. Interactive Background Canvas (Subtle Geometric Nodes & Ribbons)
     -------------------------------------------------------------------------- */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const bgCtx = bgCanvas.getContext('2d');
    let bw = 0;
    let bh = 0;
    const nodes = [];
    const NODE_COUNT = 36;
    const mouse = { x: -9999, y: -9999 };

    function resizeBg() {
      bw = bgCanvas.width = window.innerWidth;
      bh = bgCanvas.height = window.innerHeight;
    }
    resizeBg();
    window.addEventListener('resize', resizeBg);
    window.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * bw,
        y: Math.random() * bh,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: 2 + Math.random() * 2.2,
        color: i % 3 === 0 ? '#ffa500' : i % 3 === 1 ? '#37c6c0' : '#fc6423'
      });
    }

    function renderBg() {
      bgCtx.clearRect(0, 0, bw, bh);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > bw) n.vx *= -1;
        if (n.y < 0 || n.y > bh) n.vy *= -1;

        // Gentle attraction to cursor
        const dxm = mouse.x - n.x;
        const dym = mouse.y - n.y;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < 150 && dm > 1) {
          n.x += (dxm / dm) * 0.35;
          n.y += (dym / dm) * 0.35;
        }

        bgCtx.beginPath();
        bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        bgCtx.fillStyle = n.color;
        bgCtx.globalAlpha = 0.35;
        bgCtx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 135) {
            bgCtx.beginPath();
            bgCtx.moveTo(n.x, n.y);
            bgCtx.lineTo(m.x, m.y);
            bgCtx.strokeStyle = '#ffa500';
            bgCtx.globalAlpha = (1 - dist / 135) * 0.16;
            bgCtx.lineWidth = 1;
            bgCtx.stroke();
          }
        }
      }
      bgCtx.globalAlpha = 1;
      requestAnimationFrame(renderBg);
    }
    requestAnimationFrame(renderBg);
  }

  /* --------------------------------------------------------------------------
     6. Portal Card Ripple & Mini CPS Live Tester on Homepage
     -------------------------------------------------------------------------- */
  const cpsPreviewClicks = [];
  const cpsPreviewBtn = document.getElementById('mini-cps-trigger');
  const cpsPreviewVal = document.getElementById('mini-cps-live');

  if (cpsPreviewBtn && cpsPreviewVal) {
    cpsPreviewBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const now = Date.now();
      cpsPreviewClicks.push(now);
      while (cpsPreviewClicks.length > 0 && now - cpsPreviewClicks[0] > 1000) {
        cpsPreviewClicks.shift();
      }
      cpsPreviewVal.textContent = cpsPreviewClicks.length + ' CPS';
      cpsPreviewBtn.classList.remove('pulse-hit');
      void cpsPreviewBtn.offsetWidth;
      cpsPreviewBtn.classList.add('pulse-hit');
      playTone(480 + cpsPreviewClicks.length * 30, 'triangle', 0.06, 0.05);
    });

    setInterval(function () {
      const now = Date.now();
      while (cpsPreviewClicks.length > 0 && now - cpsPreviewClicks[0] > 1000) {
        cpsPreviewClicks.shift();
      }
      cpsPreviewVal.textContent = cpsPreviewClicks.length + ' CPS';
    }, 200);
  }

  /* --------------------------------------------------------------------------
     7. Code Block Copy Button
     -------------------------------------------------------------------------- */
  const copyBtn = document.getElementById('copy-code-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const codeText = document.getElementById('hero-code-content')?.innerText || '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeText);
      }
      copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
      setTimeout(function () {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
      }, 1600);
    });
  }

  /* --------------------------------------------------------------------------
     8. NexT Tabs Switcher for the Mini-Game Center
     -------------------------------------------------------------------------- */
  const gameTabs = document.querySelectorAll('.game-nav-tabs .tab');
  const gamePanes = document.querySelectorAll('.game-tab-content .tab-pane');

  gameTabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = tab.getAttribute('data-target');
      gameTabs.forEach((t) => t.classList.remove('active'));
      gamePanes.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const pane = document.getElementById(targetId);
      if (pane) pane.classList.add('active');
      playTone(520, 'sine', 0.08, 0.05, 660);
    });
  });

  /* ==========================================================================
     9. MINI-GAME 1: "AC Runner: Codeforces Dash" (横版算法跃迁小游戏)
        - Styled in /blog's Kimbie Light & NexT Orange/Teal palette
        - Jump (Space / Up / W / Click) & Double Jump, Duck (Down / S)
        - Collect green AC stars & teal O(1) shields, dodge WA / TLE / RE bugs
     ========================================================================== */
  const runnerCanvas = document.getElementById('ac-runner-canvas');
  if (runnerCanvas) {
    const ctx = runnerCanvas.getContext('2d');
    const W = runnerCanvas.width;
    const H = runnerCanvas.height;
    const GROUND_Y = H - 42;

    let gameState = 'idle'; // 'idle' | 'playing' | 'gameover'
    let score = 0;
    let bestScore = parseInt(localStorage.getItem('leony34_ac_runner_best') || '0', 10);
    let combo = 0;
    let speed = 5.2;
    let frameCount = 0;
    let shakeFrames = 0;

    const scoreEl = document.getElementById('runner-score');
    const bestEl = document.getElementById('runner-best');
    const comboEl = document.getElementById('runner-combo');
    const sidebarBestEl = document.getElementById('sidebar-best-score');
    const startBtn = document.getElementById('runner-start-btn');

    function syncScoreUI() {
      if (scoreEl) scoreEl.textContent = Math.floor(score);
      if (bestEl) bestEl.textContent = Math.floor(bestScore);
      if (comboEl) comboEl.textContent = combo > 1 ? 'x' + combo : 'x1';
      if (sidebarBestEl) sidebarBestEl.textContent = Math.floor(bestScore);
    }
    syncScoreUI();

    const player = {
      x: 72,
      y: GROUND_Y - 38,
      w: 36,
      h: 38,
      vy: 0,
      jumpsLeft: 2,
      ducking: false,
      shield: false,
      shieldTimer: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0
    };

    let obstacles = [];
    let collectibles = [];
    let particles = [];
    let floatingTexts = [];
    let bgFormulas = [
      { text: 'O(n log n)', x: 120, y: 55, s: 0.4 },
      { text: '∑ f(i) = ans', x: 340, y: 85, s: 0.3 },
      { text: 'dp[i][j]', x: 560, y: 48, s: 0.5 },
      { text: 'FFT(A, ω)', x: 700, y: 95, s: 0.35 }
    ];

    function spawnParticles(x, y, color, count = 10) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 1.2 + Math.random() * 4.2;
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1,
          r: 2 + Math.random() * 3,
          alpha: 1,
          color: color
        });
      }
    }

    function addFloatingText(text, x, y, color) {
      floatingTexts.push({
        text: text,
        x: x,
        y: y,
        vy: -1.4,
        alpha: 1,
        color: color
      });
    }

    function resetGame() {
      score = 0;
      combo = 0;
      speed = 5.2;
      frameCount = 0;
      player.y = GROUND_Y - 38;
      player.vy = 0;
      player.h = 38;
      player.jumpsLeft = 2;
      player.ducking = false;
      player.shield = false;
      player.shieldTimer = 0;
      player.scaleX = 1;
      player.scaleY = 1;
      obstacles = [];
      collectibles = [];
      particles = [];
      floatingTexts = [];
      gameState = 'playing';
      if (startBtn) {
        startBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> 重新开始 (R)';
      }
      syncScoreUI();
      playTone(440, 'sine', 0.1, 0.06, 660);
    }

    function doJump() {
      if (gameState !== 'playing') {
        resetGame();
        return;
      }
      if (player.jumpsLeft > 0) {
        player.vy = player.jumpsLeft === 2 ? -11.2 : -9.8;
        player.jumpsLeft--;
        player.ducking = false;
        player.h = 38;
        player.scaleX = 0.82;
        player.scaleY = 1.22;
        spawnParticles(
          player.x + player.w / 2,
          player.y + player.h,
          player.jumpsLeft === 1 ? '#ffa500' : '#37c6c0',
          8
        );
        playTone(player.jumpsLeft === 1 ? 420 : 580, 'triangle', 0.12, 0.07, player.jumpsLeft === 1 ? 680 : 880);
      }
    }

    function setDuck(isDuck) {
      if (gameState !== 'playing') return;
      if (isDuck && !player.ducking) {
        player.ducking = true;
        player.h = 24;
        if (player.y + player.h < GROUND_Y) {
          player.vy += 4.5; // Fast fall
        } else {
          player.y = GROUND_Y - player.h;
        }
      } else if (!isDuck && player.ducking) {
        player.ducking = false;
        player.h = 38;
        player.y = Math.min(player.y, GROUND_Y - player.h);
      }
    }

    // Controls: Canvas click/touch, button, keyboard
    runnerCanvas.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      doJump();
    });

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        resetGame();
      });
    }

    const jumpBtn = document.getElementById('runner-jump-btn');
    if (jumpBtn) {
      jumpBtn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        doJump();
      });
    }

    const duckBtn = document.getElementById('runner-duck-btn');
    if (duckBtn) {
      duckBtn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        setDuck(true);
      });
      duckBtn.addEventListener('pointerup', function () {
        setDuck(false);
      });
      duckBtn.addEventListener('pointerleave', function () {
        setDuck(false);
      });
    }

    window.addEventListener('keydown', function (e) {
      const runnerPane = document.getElementById('game-pane-runner');
      if (!runnerPane || !runnerPane.classList.contains('active')) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        doJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        setDuck(true);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetGame();
      }
    });

    window.addEventListener('keyup', function (e) {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        setDuck(false);
      }
    });

    function spawnEntities() {
      // Spawn obstacle every ~65-110 frames depending on speed
      const minGap = Math.max(48, Math.floor(95 - speed * 3));
      if (frameCount > 30 && frameCount % minGap === 0 && Math.random() < 0.78) {
        const types = [
          { label: 'WA', color: '#dc3958', bg: '#fae8eb', w: 34, h: 36, flying: false },
          { label: 'TLE', color: '#f0ad4e', bg: '#fcf6e1', w: 42, h: 30, flying: false },
          { label: 'RE', color: '#6f42c1', bg: '#efe6f7', w: 32, h: 46, flying: false },
          { label: 'MLE', color: '#2962ff', bg: '#e5f2f8', w: 44, h: 24, flying: true }
        ];
        const t = types[Math.floor(Math.random() * types.length)];
        const yPos = t.flying ? GROUND_Y - 56 - (Math.random() > 0.5 ? 16 : 0) : GROUND_Y - t.h;
        obstacles.push({
          x: W + 20,
          y: yPos,
          w: t.w,
          h: t.h,
          label: t.label,
          color: t.color,
          bg: t.bg
        });
      }

      // Spawn AC Star or O(1) Shield collectible
      if (frameCount % 55 === 0 && Math.random() < 0.65) {
        const isShield = Math.random() < 0.16 && !player.shield;
        collectibles.push({
          x: W + 30,
          y: GROUND_Y - 45 - Math.random() * 65,
          r: 13,
          type: isShield ? 'shield' : 'ac',
          label: isShield ? 'O(1)' : 'AC',
          bobPhase: Math.random() * Math.PI * 2
        });
      }
    }

    function updateRunner() {
      if (gameState !== 'playing') return;
      frameCount++;
      speed = Math.min(11.5, 5.2 + frameCount * 0.0018);
      score += 0.15 * (1 + Math.min(combo, 10) * 0.1);

      if (score > bestScore) {
        bestScore = Math.floor(score);
        localStorage.setItem('leony34_ac_runner_best', String(bestScore));
      }
      if (frameCount % 5 === 0) syncScoreUI();

      // Player physics
      player.vy += 0.62; // gravity
      player.y += player.vy;
      const targetH = player.ducking ? 24 : 38;
      player.h = targetH;

      if (player.y + player.h >= GROUND_Y) {
        if (player.jumpsLeft < 2) {
          player.scaleX = 1.18;
          player.scaleY = 0.84;
        }
        player.y = GROUND_Y - player.h;
        player.vy = 0;
        player.jumpsLeft = 2;
      }

      // Spring scale back to 1
      player.scaleX += (1 - player.scaleX) * 0.22;
      player.scaleY += (1 - player.scaleY) * 0.22;

      if (player.shield) {
        player.shieldTimer--;
        if (player.shieldTimer <= 0) player.shield = false;
      }

      // Spawn entities
      spawnEntities();

      // Update obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const ob = obstacles[i];
        ob.x -= speed;

        // AABB Collision with slight forgiveness padding
        const pad = 4;
        if (
          player.x + pad < ob.x + ob.w - pad &&
          player.x + player.w - pad > ob.x + pad &&
          player.y + pad < ob.y + ob.h - pad &&
          player.y + player.h - pad > ob.y + pad
        ) {
          if (player.shield) {
            player.shield = false;
            spawnParticles(ob.x + ob.w / 2, ob.y + ob.h / 2, '#37c6c0', 16);
            addFloatingText('Shield Blocked!', player.x, player.y - 10, '#00a896');
            obstacles.splice(i, 1);
            playTone(320, 'sawtooth', 0.15, 0.07, 520);
            continue;
          } else {
            // Game Over
            gameState = 'gameover';
            shakeFrames = 12;
            spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#dc3958', 22);
            playTone(220, 'sawtooth', 0.28, 0.09, 110);
            syncScoreUI();
            break;
          }
        }

        if (ob.x + ob.w < -20) {
          obstacles.splice(i, 1);
        }
      }

      // Update collectibles
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const c = collectibles[i];
        c.x -= speed;
        c.bobPhase += 0.08;
        const cy = c.y + Math.sin(c.bobPhase) * 4;

        const dx = player.x + player.w / 2 - c.x;
        const dy = player.y + player.h / 2 - cy;
        if (Math.sqrt(dx * dx + dy * dy) < c.r + 20) {
          if (c.type === 'shield') {
            player.shield = true;
            player.shieldTimer = 420;
            addFloatingText('O(1) Shield!', c.x, cy, '#00a896');
            spawnParticles(c.x, cy, '#37c6c0', 14);
            playTone(580, 'sine', 0.18, 0.08, 920);
          } else {
            combo++;
            const bonus = 25 + combo * 5;
            score += bonus;
            if (score > bestScore) {
              bestScore = Math.floor(score);
              localStorage.setItem('leony34_ac_runner_best', String(bestScore));
            }
            addFloatingText('+' + bonus + ' AC!', c.x, cy, '#5cb85c');
            spawnParticles(c.x, cy, '#5cb85c', 12);
            playTone(660 + Math.min(combo * 30, 300), 'sine', 0.12, 0.07, 980);
          }
          syncScoreUI();
          collectibles.splice(i, 1);
          continue;
        }

        if (c.x < -30) {
          if (c.type === 'ac') combo = 0;
          collectibles.splice(i, 1);
        }
      }
    }

    function drawRoundedRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawRunner() {
      ctx.save();
      if (shakeFrames > 0) {
        shakeFrames--;
        ctx.translate((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7);
      }

      // Warm Kimbie-Light codeblock sky background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#fff9f0');
      grad.addColorStop(1, '#fbebd4');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle grid lines (like notebook / math graph paper)
      ctx.strokeStyle = 'rgba(132, 97, 61, 0.07)';
      ctx.lineWidth = 1;
      const gridOffset = (frameCount * 1.5) % 32;
      for (let gx = -gridOffset; gx < W; gx += 32) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, GROUND_Y);
        ctx.stroke();
      }
      for (let gy = 24; gy < GROUND_Y; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }

      // Scrolling math & algorithm watermarks in background
      ctx.font = 'bold 14px "Roboto Slab", monospace';
      ctx.fillStyle = 'rgba(132, 97, 61, 0.16)';
      bgFormulas.forEach(function (f) {
        if (gameState === 'playing') {
          f.x -= f.s * (speed * 0.25);
          if (f.x < -120) f.x = W + 40;
        }
        ctx.fillText(f.text, f.x, f.y);
      });

      // Ground line & NexT orange headband stripe
      ctx.fillStyle = '#efddc4';
      ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
      ctx.fillStyle = '#ffa500';
      ctx.fillRect(0, GROUND_Y, W, 3);

      // Ground dashes
      ctx.fillStyle = 'rgba(132, 97, 61, 0.28)';
      const dashOffset = (frameCount * speed) % 40;
      for (let dx = -dashOffset; dx < W; dx += 40) {
        ctx.fillRect(dx, GROUND_Y + 14, 18, 3);
      }

      // Collectibles (AC Stars & O(1) Shields)
      collectibles.forEach(function (c) {
        const cy = c.y + Math.sin(c.bobPhase) * 4;
        ctx.save();
        ctx.translate(c.x, cy);
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.type === 'shield' ? '#e5f2f8' : '#e7f4e9';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = c.type === 'shield' ? '#00a896' : '#5cb85c';
        ctx.stroke();

        ctx.fillStyle = c.type === 'shield' ? '#008577' : '#3c8d40';
        ctx.font = 'bold 10px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.label, 0, 1);
        ctx.restore();
      });

      // Obstacles (WA / TLE / RE / MLE blocks styled like blog labels)
      obstacles.forEach(function (ob) {
        ctx.save();
        drawRoundedRect(ob.x, ob.y, ob.w, ob.h, 5);
        ctx.fillStyle = ob.bg;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = ob.color;
        ctx.stroke();

        // Top warning bar
        ctx.fillStyle = ob.color;
        ctx.fillRect(ob.x + 2, ob.y + 2, ob.w - 4, 5);

        ctx.fillStyle = ob.color;
        ctx.font = 'bold 11px Consolas, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ob.label, ob.x + ob.w / 2, ob.y + ob.h / 2 + 2);
        ctx.restore();
      });

      // Player Character (Cute Orange NexT Block Mascot "CleverL Bot")
      ctx.save();
      const px = player.x + player.w / 2;
      const py = player.y + player.h;
      ctx.translate(px, py);
      ctx.scale(player.scaleX, player.scaleY);

      if (player.shield) {
        ctx.beginPath();
        ctx.arc(0, -player.h / 2, 26, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(55, 198, 192, 0.75)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(55, 198, 192, 0.12)';
        ctx.fill();
      }

      drawRoundedRect(-player.w / 2, -player.h, player.w, player.h, 7);
      const pGrad = ctx.createLinearGradient(0, -player.h, 0, 0);
      pGrad.addColorStop(0, '#ffa500');
      pGrad.addColorStop(1, '#fc6423');
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#fff';
      const eyeY = -player.h + 11;
      ctx.beginPath();
      ctx.arc(4, eyeY, 4.2, 0, Math.PI * 2);
      ctx.arc(13, eyeY, 4.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.arc(5.2, eyeY, 2, 0, Math.PI * 2);
      ctx.arc(14.2, eyeY, 2, 0, Math.PI * 2);
      ctx.fill();

      // Little headband / crown detail
      ctx.fillStyle = '#37c6c0';
      ctx.fillRect(-player.w / 2 + 4, -player.h + 2, player.w - 8, 3);
      ctx.restore();

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.032;
        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Floating texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.024;
        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = 'bold 13px "Roboto Slab", sans-serif';
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      }

      // Overlays for Idle or GameOver
      if (gameState === 'idle') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#222';
        ctx.font = 'bold 20px "Roboto Slab", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏃‍♂️ AC Runner · 算法跑酷', W / 2, H / 2 - 18);
        ctx.fillStyle = '#555';
        ctx.font = '14px "Roboto Slab", sans-serif';
        ctx.fillText('点击画面 / 按 [Space] 跳跃（支持二段跳），收集 AC 绿星，躲避 WA / TLE！', W / 2, H / 2 + 12);
        ctx.fillStyle = '#fc6423';
        ctx.font = 'bold 13px "Roboto Slab", sans-serif';
        ctx.fillText('▶ 点击任意处开始游戏', W / 2, H / 2 + 40);
      } else if (gameState === 'gameover') {
        ctx.fillStyle = 'rgba(38, 42, 48, 0.68)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px "Roboto Slab", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('💥 Verdict: Unaccepted — 得分 ' + Math.floor(score), W / 2, H / 2 - 16);
        ctx.fillStyle = '#ffa500';
        ctx.font = '14px "Roboto Slab", sans-serif';
        ctx.fillText('最高纪录: ' + Math.floor(bestScore) + '   |   最大连击: x' + Math.max(1, combo), W / 2, H / 2 + 12);
        ctx.fillStyle = '#37c6c0';
        ctx.font = 'bold 14px "Roboto Slab", sans-serif';
        ctx.fillText('↻ 点击画面或按 [Space / R] 再次挑战', W / 2, H / 2 + 40);
      }

      ctx.restore();
    }

    function loopRunner() {
      updateRunner();
      drawRunner();
      requestAnimationFrame(loopRunner);
    }
    requestAnimationFrame(loopRunner);
  }

  /* ==========================================================================
     10. MINI-GAME 2: "2048 · 2^k Bitwise Edition" (Kimbie 暖色风 2048)
         - Keyboard (Arrows / WASD) + Touch Swipe + Undo 1 Step
     ========================================================================== */
  const boardEl = document.getElementById('grid-2048');
  if (boardEl) {
    let grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    let prevGrid = null;
    let score2048 = 0;
    let prevScore2048 = 0;
    let best2048 = parseInt(localStorage.getItem('leony34_2048_best') || '0', 10);

    const score2048El = document.getElementById('score-2048');
    const best2048El = document.getElementById('best-2048');
    const msg2048El = document.getElementById('msg-2048');

    function cloneGrid(g) {
      return g.map((row) => row.slice());
    }

    function addRandomTile() {
      const empty = [];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 0) empty.push([r, c]);
        }
      }
      if (empty.length === 0) return;
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];
      grid[r][c] = Math.random() < 0.88 ? 2 : 4;
    }

    function render2048() {
      if (score2048El) score2048El.textContent = score2048;
      if (best2048El) best2048El.textContent = best2048;

      boardEl.innerHTML = '';
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const val = grid[r][c];
          const cell = document.createElement('div');
          cell.className = 'tile-2048 tile-val-' + (val <= 2048 ? val : 'super');
          if (val > 0) {
            const exp = Math.round(Math.log2(val));
            cell.innerHTML =
              '<span class="tile-num">' + val + '</span>' +
              '<small class="tile-exp">2<sup>' + exp + '</sup></small>';
          }
          boardEl.appendChild(cell);
        }
      }
    }

    function canMove() {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (grid[r][c] === 0) return true;
          if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
          if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
        }
      }
      return false;
    }

    function slideRowLeft(row) {
      const arr = row.filter((v) => v !== 0);
      let gained = 0;
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          gained += arr[i];
          arr[i + 1] = 0;
        }
      }
      const merged = arr.filter((v) => v !== 0);
      while (merged.length < 4) merged.push(0);
      return { row: merged, gained: gained };
    }

    function rotateGrid(g) {
      const res = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          res[c][3 - r] = g[r][c];
        }
      }
      return res;
    }

    function move2048(dir) {
      // dir: 0=left, 1=up, 2=right, 3=down
      const snapshot = cloneGrid(grid);
      const oldScore = score2048;

      let work = cloneGrid(grid);
      const rotations = dir === 0 ? 0 : dir === 1 ? 3 : dir === 2 ? 2 : 1;
      for (let i = 0; i < rotations; i++) work = rotateGrid(work);

      let totalGained = 0;
      for (let r = 0; r < 4; r++) {
        const res = slideRowLeft(work[r]);
        work[r] = res.row;
        totalGained += res.gained;
      }

      const backRotations = (4 - rotations) % 4;
      for (let i = 0; i < backRotations; i++) work = rotateGrid(work);

      let changed = false;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (work[r][c] !== grid[r][c]) changed = true;
        }
      }

      if (!changed) return;

      prevGrid = snapshot;
      prevScore2048 = oldScore;
      grid = work;
      score2048 += totalGained;
      if (score2048 > best2048) {
        best2048 = score2048;
        localStorage.setItem('leony34_2048_best', String(best2048));
      }

      addRandomTile();
      render2048();

      if (totalGained > 0) {
        playTone(520, 'triangle', 0.1, 0.06, 780);
      } else {
        playTone(340, 'sine', 0.06, 0.04);
      }

      if (msg2048El) {
        if (!canMove()) {
          msg2048El.textContent = '棋盘已满！可点击「悔棋一步」或「新局」继续。';
        } else {
          msg2048El.textContent = '使用方向键 / WASD / 滑动屏幕合并相同 2^k 方块';
        }
      }
    }

    function init2048() {
      grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      prevGrid = null;
      score2048 = 0;
      addRandomTile();
      addRandomTile();
      render2048();
      if (msg2048El) {
        msg2048El.textContent = '使用方向键 / WASD / 滑动屏幕合并相同 2^k 方块';
      }
    }

    document.getElementById('btn-2048-new')?.addEventListener('click', function () {
      init2048();
      playTone(480, 'sine', 0.1, 0.06, 660);
    });

    document.getElementById('btn-2048-undo')?.addEventListener('click', function () {
      if (prevGrid) {
        grid = cloneGrid(prevGrid);
        score2048 = prevScore2048;
        prevGrid = null;
        render2048();
        playTone(380, 'sine', 0.09, 0.05, 300);
      }
    });

    // D-pad buttons for mouse/mobile
    document.querySelectorAll('[data-2048-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const d = parseInt(btn.getAttribute('data-2048-dir'), 10);
        move2048(d);
      });
    });

    // Keyboard controls when 2048 tab is active
    window.addEventListener('keydown', function (e) {
      const pane2048 = document.getElementById('game-pane-2048');
      if (!pane2048 || !pane2048.classList.contains('active')) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        move2048(0);
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        move2048(1);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        move2048(2);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        move2048(3);
      }
    });

    // Touch swipe on 2048 board
    let touchStartX = 0;
    let touchStartY = 0;
    boardEl.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length > 0) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      },
      { passive: true }
    );

    boardEl.addEventListener(
      'touchend',
      function (e) {
        if (e.changedTouches.length > 0) {
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = e.changedTouches[0].clientY - touchStartY;
          if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) {
            if (Math.abs(dx) > Math.abs(dy)) {
              move2048(dx > 0 ? 2 : 0);
            } else {
              move2048(dy > 0 ? 3 : 1);
            }
          }
        }
      },
      { passive: true }
    );

    init2048();
  }
})();
