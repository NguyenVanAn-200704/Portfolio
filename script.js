/* ============================================================
   PORTFOLIO - script.js
   Mỗi khối độc lập; tất cả tôn trọng prefers-reduced-motion.
   ============================================================ */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* 1. Hero name reveal: tách tên thành từng từ với delay tăng dần */
(function heroNameReveal() {
  const link = document.querySelector(".hero__name-link");
  if (!link || REDUCED_MOTION) return;
  const words = link.textContent.trim().split(/\s+/);
  link.innerHTML = words
    .map((w, i) => `<span class="word" style="--d:${0.15 + i * 0.12}s">${w}</span>`)
    .join(" ");
})();

/* 2. Typewriter chức danh (danh sách ở data-roles của #heroRole) */
(function roleTypewriter() {
  const el = document.getElementById("heroRole");
  if (!el) return;
  const textEl = el.querySelector(".hero__role-text");
  const roles = JSON.parse(el.dataset.roles || "[]");
  if (!roles.length) return;
  if (REDUCED_MOTION) { textEl.textContent = roles[0]; return; }

  let roleIdx = 0, charIdx = 0, deleting = false;
  function tick() {
    const current = roles[roleIdx];
    charIdx += deleting ? -1 : 1;
    textEl.textContent = current.slice(0, charIdx);

    let delay = deleting ? 40 : 70;
    if (!deleting && charIdx === current.length) {
      deleting = true; delay = 2000;
    } else if (deleting && charIdx === 0) {
      deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

/* 3. Avatar tilt 3D theo chuột (bỏ qua trên touch) */
(function avatarTilt() {
  const avatar = document.getElementById("avatarTilt");
  if (!avatar || REDUCED_MOTION || matchMedia("(hover: none)").matches) return;
  const hero = document.querySelector(".hero");
  hero.addEventListener("mousemove", (e) => {
    const r = avatar.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    avatar.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  hero.addEventListener("mouseleave", () => { avatar.style.transform = ""; });
})();

/* 4. Mạng node trên canvas ở hero */
(function heroNetwork() {
  const canvas = document.getElementById("heroNet");
  if (!canvas || REDUCED_MOTION) return;
  const ctx = canvas.getContext("2d");
  const LINK_DIST = 140;
  let w, h, nodes = [], running = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(70, (w * h) / 18000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
    }));
  }

  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK_DIST) {
          ctx.strokeStyle = `rgba(217,138,79,${0.12 * (1 - d / LINK_DIST)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(217,138,79,0.55)";
      ctx.beginPath(); ctx.arc(nodes[i].x, nodes[i].y, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener("resize", resize);
  // Dừng vẽ khi hero ra khỏi màn hình để tiết kiệm CPU
  new IntersectionObserver(([entry]) => {
    const wasRunning = running;
    running = entry.isIntersecting;
    if (running && !wasRunning) frame();
  }).observe(canvas);
  frame();
})();

/* 5. Reveal khi cuộn */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
})();

/* 6. Thanh progress + scroll-spy cho nav */
(function scrollProgressAndSpy() {
  const bar = document.getElementById("scrollProgress");
  const links = [...document.querySelectorAll(".nav__link")];
  const sections = links
    .map((l) => document.querySelector(l.getAttribute("href")))
    .filter(Boolean);

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;

    const y = window.scrollY + window.innerHeight * 0.35;
    let current = null;
    for (const s of sections) if (s.offsetTop <= y) current = s.id;
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${current}`));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* 7. Menu mobile */
(function mobileNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  const setOpen = (open) => { nav.classList.toggle("is-open", open); links.classList.toggle("is-open", open); };
  toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
})();

/* 8. Chuyển ngôn ngữ VI / EN (ghi nhớ lựa chọn) */
(function languageToggle() {
  const btn = document.getElementById("langToggle");
  const nodes = document.querySelectorAll("[data-i18n]");
  const vi = new Map([...nodes].map((n) => [n, n.textContent]));

  function apply(lang) {
    nodes.forEach((n) => {
      const key = n.dataset.i18n;
      n.textContent = lang === "en" && I18N_EN[key] ? I18N_EN[key] : vi.get(n);
    });
    document.documentElement.lang = lang;
    btn.textContent = lang === "en" ? "VI" : "EN";
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  let lang = "vi";
  try { lang = localStorage.getItem("lang") || "vi"; } catch (e) {}
  if (lang !== "vi") apply(lang);
  btn.addEventListener("click", () => apply(document.documentElement.lang === "en" ? "vi" : "en"));
})();

/* 9. Form liên hệ: mở ứng dụng email với nội dung đã điền */
(function contactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`Portfolio - ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n${data.get("name")} · ${data.get("email")}`);
    window.location.href = `mailto:nva2004gl81@gmail.com?subject=${subject}&body=${body}`;
  });
})();

document.getElementById("year").textContent = new Date().getFullYear();
