/* ============ SETTINGS (yahan apni details badlo) ============ */
const WHATSAPP_NUMBER = "919999999999"; // country code ke saath, + ya space ke bina
const BUSINESS_NAME = "Sharma Plywood & Hardware";

// Dukaan ka time (24-hour format). closedDays: 0 = Sunday, 1 = Monday ... 6 = Saturday
const SHOP_HOURS = { open: "09:00", close: "20:00", closedDays: [0] };

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ============ Smooth inertia scrolling (bina kisi library ke) ============ */
const smooth = (() => {
  if (reduceMotion || !canHover) return null; // phone/touch par natural scroll hi best hai
  let target = window.scrollY, current = window.scrollY;
  let running = false, stopped = false, last = 0;
  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const clamp = y => Math.max(0, Math.min(maxScroll(), y));

  function loop(now) {
    const dt = Math.min(now - last, 50);
    last = now;
    const diff = target - current;
    if (Math.abs(diff) < 0.4) {
      current = target;
      window.scrollTo({ top: current, behavior: "instant" });
      running = false;
      return;
    }
    current += diff * (1 - Math.exp(-dt / 170)); // frame-rate independent glide
    window.scrollTo({ top: current, behavior: "instant" });
    requestAnimationFrame(loop);
  }
  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  window.addEventListener("wheel", e => {
    if (e.ctrlKey || stopped || e.defaultPrevented) return;      // pinch-zoom / menu open
    if (e.target.closest && e.target.closest("textarea")) return; // textarea ka apna scroll
    e.preventDefault();
    let d = e.deltaY;
    if (e.deltaMode === 1) d *= 32;
    else if (e.deltaMode === 2) d *= window.innerHeight;
    target = clamp(target + d);
    start();
  }, { passive: false });

  // keyboard / scrollbar drag se scroll ho to sync rakho
  window.addEventListener("scroll", () => {
    if (!running) { target = current = window.scrollY; }
  }, { passive: true });
  window.addEventListener("resize", () => { target = clamp(target); });

  return {
    to(y) { target = clamp(y); start(); },
    stop() { stopped = true; document.documentElement.style.overflow = "hidden"; },
    start() { stopped = false; document.documentElement.style.overflow = ""; target = current = window.scrollY; }
  };
})();

// menu / anchor links: lamba smooth glide
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const el = document.querySelector(a.getAttribute("href"));
    if (!el || !smooth) return; // smooth na ho to CSS smooth scroll chalega
    e.preventDefault();
    smooth.to(el.getBoundingClientRect().top + window.scrollY - 70);
  });
});

/* ============ Hero title: word by word reveal ============ */
function wrapWords(node, counter) {
  [...node.childNodes].forEach(child => {
    if (child.nodeType === 3) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        const w = document.createElement("span");
        w.className = "w";
        const inner = document.createElement("span");
        inner.textContent = part;
        inner.style.transitionDelay = ((counter.base ?? 0.35) + counter.n * 0.09) + "s";
        counter.n++;
        w.appendChild(inner);
        frag.appendChild(w);
      });
      child.replaceWith(frag);
    } else if (child.nodeType === 1 && child.tagName !== "BR") {
      wrapWords(child, counter);
    }
  });
}
const splitTitle = document.querySelector(".split");
if (splitTitle) wrapWords(splitTitle, { n: 0 });

// section headings: scroll par word-by-word aate hain
document.querySelectorAll("h2").forEach(h => {
  wrapWords(h, { n: 0, base: 0.05 });
  h.classList.add("split-in");
});

/* ============ Scroll effects ============ */
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");
const heroBg = document.getElementById("heroBg");
const heroContent = document.querySelector(".hero-content");
const parallaxEls = [...document.querySelectorAll("[data-parallax]")];

let lastY = 0;
const menuEl = document.getElementById("menu");

function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  nav.classList.toggle("scrolled", y > 40);

  // navbar: neeche scroll karo to chhup jata hai, upar karo to wapas aata hai
  const dy = y - lastY;
  if (Math.abs(dy) > 4) {
    nav.classList.toggle("hide", dy > 0 && y > 400 && !menuEl.classList.contains("open"));
    lastY = y;
  }

  // scroll progress bar
  const h = document.documentElement.scrollHeight - vh;
  progress.style.width = (y / h) * 100 + "%";

  if (reduceMotion) return;

  // hero: background dheere, text thoda fade hota hua
  if (y < vh) {
    heroBg.style.transform = `translateY(${y * 0.35}px)`;
    heroContent.style.transform = `translateY(${y * 0.18}px)`;
    heroContent.style.opacity = Math.max(0, 1 - (y / vh) * 1.2);
  }

  // parallax elements
  parallaxEls.forEach(el => {
    const r = el.getBoundingClientRect();
    const offset = r.top + r.height / 2 - vh / 2;
    el.style.transform = `translateY(${offset * -parseFloat(el.dataset.parallax)}px)`;
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ============ Mobile menu ============ */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
function setMenu(open) {
  burger.classList.toggle("open", open);
  menu.classList.toggle("open", open);
  if (smooth) open ? smooth.stop() : smooth.start();
}
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ============ Active menu link (scroll spy) ============ */
const menuLinks = [...document.querySelectorAll('.menu a[href^="#"]:not(.btn)')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    menuLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("section[id]").forEach(s => spy.observe(s));

/* ============ Scroll reveal + counters (page load ke baad shuru) ============ */
function startReveals() {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("in");
      // reveal ke baad delay hata do, taaki hover instantly chale
      setTimeout(() => { el.style.transitionDelay = "0s"; }, 1600);
      revealObserver.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .split-in").forEach(el => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const duration = 2000;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4); // smooth slow-down
        el.textContent = Math.floor(eased * target).toLocaleString("en-IN") + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(el => counterObserver.observe(el));
}

/* ============ Page load intro ============ */
let started = false;
function onLoaded() {
  if (started) return;
  started = true;
  setTimeout(() => {
    document.body.classList.add("loaded");
    startReveals();
  }, 250);
}
if (document.readyState === "complete") onLoaded();
else window.addEventListener("load", onLoaded);
setTimeout(onLoaded, 2500); // safety: kuch atak jaye to bhi site khul jaye

/* ============ Hover effects: card tilt + magnetic buttons ============ */
const hoverFx = canHover && !reduceMotion;

function attachTilt(el) {
  if (!hoverFx) return;
  el.addEventListener("mousemove", e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-8px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
}

function attachMagnet(b) {
  if (!hoverFx) return;
  b.addEventListener("mousemove", e => {
    const r = b.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    b.style.translate = `${x * 0.25}px ${y * 0.35}px`;
  });
  b.addEventListener("mouseleave", () => { b.style.translate = ""; });
}

document.querySelectorAll("[data-tilt]").forEach(attachTilt);
document.querySelectorAll(".btn").forEach(attachMagnet);

/* ============ WhatsApp links ============ */
const defaultMsg = encodeURIComponent(`Hello ${BUSINESS_NAME}, mujhe kuch products ke baare me jaankari chahiye.`);
document.getElementById("waFloat").href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;

document.getElementById("quoteForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("fName").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const msg = document.getElementById("fMsg").value.trim();
  const text = `Hello ${BUSINESS_NAME},\nName: ${name}\nPhone: ${phone}\nEnquiry: ${msg}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
});

/* ============ Footer year ============ */
document.getElementById("year").textContent = new Date().getFullYear();

/* ============ PRODUCT CATALOG (products.js se banta hai) ============ */
(function initCatalog() {
  const grid = document.getElementById("catalogGrid");
  if (!grid || typeof PRODUCTS === "undefined") return;

  const chipsBox = document.getElementById("chips");
  const search = document.getElementById("search");
  const moreBtn = document.getElementById("moreBtn");
  const emptyMsg = document.getElementById("empty");
  const count = document.getElementById("count");

  const PAGE_SIZE = 9; // ek baar me kitne products dikhne chahiye
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  let activeCat = "All";
  let query = "";
  let list = [];
  let shown = 0;

  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const textureOf = cat => "t" + (((categories.indexOf(cat) - 1) % 6) + 1);

  // scroll par cards ek ek karke aate hain
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("show");
      setTimeout(() => { el.style.transitionDelay = "0s"; }, 1400);
      cardObserver.unobserve(el);
    });
  }, { threshold: 0.12 });

  function cardHTML(p, i) {
    const msg = encodeURIComponent(`Hello ${BUSINESS_NAME}, I would like to enquire about: ${p.name}. Is it available at the shop?`);
    const img = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : "";
    return `<article class="card pcard" data-tilt style="transition-delay:${(i % 3) * 0.1}s">
      <div class="card-top ${textureOf(p.category)}">${img}</div>
      <span class="tag">${esc(p.category)}</span>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.desc || "")}</p>
      <a class="enq" href="https://wa.me/${WHATSAPP_NUMBER}?text=${msg}" target="_blank" rel="noopener">Enquire &rarr;</a>
    </article>`;
  }

  function draw(from, to) {
    const slice = list.slice(from, to);
    const start = grid.children.length;
    grid.insertAdjacentHTML("beforeend", slice.map((p, i) => cardHTML(p, i)).join(""));
    [...grid.children].slice(start).forEach(el => { attachTilt(el); cardObserver.observe(el); });
    shown = Math.min(to, list.length);
    moreBtn.hidden = shown >= list.length;
  }

  function applyFilters() {
    const q = query.trim().toLowerCase();
    list = PRODUCTS.filter(p =>
      (activeCat === "All" || p.category === activeCat) &&
      (!q || `${p.name} ${p.category} ${p.desc || ""}`.toLowerCase().includes(q))
    );
    grid.innerHTML = "";
    count.textContent = `${list.length} ${list.length === 1 ? "product" : "products"}`;
    emptyMsg.hidden = list.length > 0;
    draw(0, PAGE_SIZE);
  }

  // category buttons
  chipsBox.innerHTML = categories.map(c => `<button class="chip${c === "All" ? " active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  chipsBox.addEventListener("click", e => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCat = btn.dataset.cat;
    chipsBox.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === btn));
    applyFilters();
  });

  search.addEventListener("input", () => { query = search.value; applyFilters(); });
  moreBtn.addEventListener("click", () => draw(shown, shown + PAGE_SIZE));
  attachMagnet(moreBtn);

  applyFilters();
})();


/* ============ Helper: WhatsApp link ============ */
function waLink(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* ============ OPEN NOW / CLOSED badge ============ */
/* OPEN-STATUS START */
function getOpenStatus(date = new Date()) {
  // hamesha India ke time ke hisaab se (Asia/Kolkata)
  const ist = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  const mins = ist.getHours() * 60 + ist.getMinutes();
  const [oh, om] = SHOP_HOURS.open.split(":").map(Number);
  const [ch, cm] = SHOP_HOURS.close.split(":").map(Number);
  const openAt = oh * 60 + om;
  const closeAt = ch * 60 + cm;
  const fmt = m => {
    const h = Math.floor(m / 60);
    return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const closedToday = SHOP_HOURS.closedDays.includes(day);

  if (!closedToday && mins >= openAt && mins < closeAt) {
    return { open: true, text: `Open now · closes ${fmt(closeAt)}` };
  }
  if (!closedToday && mins < openAt) {
    return { open: false, text: `Closed · opens today at ${fmt(openAt)}` };
  }
  let d = 1;
  while (d <= 7 && SHOP_HOURS.closedDays.includes((day + d) % 7)) d++;
  const when = d === 1 ? "tomorrow" : dayNames[(day + d) % 7];
  return { open: false, text: `Closed · opens ${when} at ${fmt(openAt)}` };
}
/* OPEN-STATUS END */

function updateOpenStatus() {
  const s = getOpenStatus();
  document.querySelectorAll("[data-open-status]").forEach(el => {
    el.textContent = s.text;
    el.classList.toggle("is-open", s.open);
    el.classList.toggle("is-closed", !s.open);
  });
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);

/* ============ SHEET CALCULATOR ============ */
(function initCalculator() {
  const $ = id => document.getElementById(id);
  if (!$("cLen")) return;
  const len = $("cLen"), wid = $("cWid"), unit = $("cUnit"), qty = $("cQty");
  const size = $("cSize"), waste = $("cWaste"), mat = $("cMat");
  const sheetsEl = $("cSheets"), detail = $("cDetail"), viz = $("cViz"), send = $("cSend");
  let shownN = 0, token = 0, message = "";

  function animateTo(n) {
    const my = ++token; // purana animation apne aap ruk jata hai
    if (reduceMotion) { sheetsEl.textContent = n; shownN = n; return; }
    const from = shownN, start = performance.now();
    (function tick(now) {
      if (my !== token) return;
      const p = Math.min((now - start) / 500, 1);
      const v = Math.round(from + (n - from) * (1 - Math.pow(1 - p, 3)));
      sheetsEl.textContent = v;
      shownN = v;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  const num = v => (Math.round(v * 10) / 10).toString();

  function update() {
    const f = parseFloat(unit.selectedOptions[0].dataset.f);
    const L = parseFloat(len.value), W = parseFloat(wid.value);
    const Q = Math.max(1, parseInt(qty.value, 10) || 1);

    if (!(L > 0 && W > 0)) {
      animateTo(0);
      detail.textContent = "Enter the length and width to see your estimate.";
      viz.innerHTML = "";
      send.disabled = true;
      return;
    }
    const area = L * f * W * f * Q;                 // sq ft
    const need = area * (1 + parseFloat(waste.value) / 100);
    const sheetArea = parseFloat(size.value);
    const exact = need / sheetArea;
    const sheets = Math.ceil(exact - 1e-9);

    animateTo(sheets);
    detail.textContent = `${num(area)} sq ft + ${waste.value}% wastage = ${num(need)} sq ft. One sheet covers ${sheetArea} sq ft.`;

    const MAX = 30;
    let html = "";
    for (let i = 0; i < Math.min(sheets, MAX); i++) {
      const fill = Math.max(0, Math.min(1, exact - i));
      html += `<i style="--fill:${fill.toFixed(2)};animation-delay:${Math.min(i * 0.03, 0.6)}s"></i>`;
    }
    if (sheets > MAX) html += `<span class="more">+ ${sheets - MAX} more</span>`;
    viz.innerHTML = html;

    const sizeLabel = size.selectedOptions[0].textContent;
    message = `Hello ${BUSINESS_NAME}, I used the sheet calculator on your website.\n` +
      `Material: ${mat.value}\n` +
      `Size: ${L} x ${W} ${unit.value}, ${Q} piece(s)\n` +
      `Estimated need: ${sheets} sheet(s) of ${sizeLabel}\n` +
      `Please confirm availability. I will visit the shop to see and select.`;
    send.disabled = false;
  }

  [len, wid, unit, qty, size, waste, mat].forEach(el => el.addEventListener("input", update));
  send.addEventListener("click", () => window.open(waLink(message), "_blank", "noopener"));
  update();
})();

/* ============ FINISH PLANNER ============ */
(function initFinishPlanner() {
  const wardrobe = document.getElementById("wardrobe");
  if (!wardrobe) return;

  // Finishes yahan se badal / add kar sakte ho
  const FINISHES = [
    { name: "Walnut",         css: "repeating-linear-gradient(92deg,#6b4226 0 6px,#5a361d 6px 11px,#764a2b 11px 15px,#5f3a20 15px 22px)" },
    { name: "Teak",           css: "repeating-linear-gradient(92deg,#b07a3f 0 5px,#9c6a33 5px 10px,#bb8648 10px 14px)" },
    { name: "Natural Oak",    css: "repeating-linear-gradient(92deg,#d9b98a 0 6px,#cba878 6px 12px,#e0c496 12px 16px)" },
    { name: "Wenge",          css: "repeating-linear-gradient(92deg,#3a2a22 0 6px,#2e2019 6px 11px,#43322a 11px 15px)" },
    { name: "Ivory White",    css: "linear-gradient(135deg,#fbf7ee,#efe7d6)" },
    { name: "Charcoal Matte", css: "linear-gradient(135deg,#3b3d40,#2b2d30)" },
    { name: "Sage Green",     css: "linear-gradient(135deg,#9db39a,#86a083)" },
    { name: "Navy Blue",      css: "linear-gradient(135deg,#2c4a6e,#1f3855)" },
    { name: "Terracotta",     css: "linear-gradient(135deg,#c76f4a,#b35b38)" },
    { name: "Mustard",        css: "linear-gradient(135deg,#e0a83a,#cc9526)" }
  ];
  const HANDLES = [
    { name: "Brass",       color: "#d4a64a" },
    { name: "Steel",       color: "#c4c9ce" },
    { name: "Matte Black", color: "#1e1e1e" }
  ];

  const state = { part: "door", door: 2, body: 0, handle: 0 };
  const finishSw = document.getElementById("finishSw");
  const handleSw = document.getElementById("handleSw");
  const label = document.getElementById("fLabel");
  const partBtns = [...document.querySelectorAll(".part-btn")];
  const cab = document.getElementById("wCab");
  const stage = document.getElementById("stage");

  finishSw.innerHTML = FINISHES.map((f, i) =>
    `<button type="button" class="sw" data-i="${i}" title="${f.name}" aria-label="${f.name}" style="background:${f.css}"></button>`).join("");
  handleSw.innerHTML = HANDLES.map((h, i) =>
    `<button type="button" class="sw" data-i="${i}" title="${h.name}" aria-label="${h.name}" style="background:${h.color}"></button>`).join("");

  function apply() {
    wardrobe.style.setProperty("--door", FINISHES[state.door].css);
    wardrobe.style.setProperty("--body", FINISHES[state.body].css);
    wardrobe.style.setProperty("--handle", HANDLES[state.handle].color);
    finishSw.querySelectorAll(".sw").forEach((b, i) => b.classList.toggle("active", i === state[state.part]));
    handleSw.querySelectorAll(".sw").forEach((b, i) => b.classList.toggle("active", i === state.handle));
    partBtns.forEach(b => b.classList.toggle("active", b.dataset.part === state.part));
    label.innerHTML =
      `<span><b>Doors</b>${FINISHES[state.door].name}</span>` +
      `<span><b>Body</b>${FINISHES[state.body].name}</span>` +
      `<span><b>Handles</b>${HANDLES[state.handle].name}</span>`;
  }

  partBtns.forEach(b => b.addEventListener("click", () => { state.part = b.dataset.part; apply(); }));
  finishSw.addEventListener("click", e => {
    const b = e.target.closest(".sw");
    if (!b) return;
    state[state.part] = +b.dataset.i;
    apply();
  });
  handleSw.addEventListener("click", e => {
    const b = e.target.closest(".sw");
    if (!b) return;
    state.handle = +b.dataset.i;
    apply();
  });

  // wardrobe kholna / band karna
  const toggle = () => wardrobe.classList.toggle("open");
  cab.addEventListener("click", toggle);
  cab.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });

  // mouse ke saath chamak (shine) chalti hai
  if (canHover && !reduceMotion) {
    stage.addEventListener("pointermove", e => {
      const r = wardrobe.getBoundingClientRect();
      wardrobe.style.setProperty("--sx", ((e.clientX - r.left) / r.width * 100).toFixed(0) + "%");
      wardrobe.style.setProperty("--sy", ((e.clientY - r.top) / r.height * 100).toFixed(0) + "%");
    });
  }

  // pehli baar dikhne par ek baar apne aap khul ke band hota hai (demo)
  if (!reduceMotion) {
    const demo = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      demo.disconnect();
      setTimeout(() => wardrobe.classList.add("open"), 500);
      setTimeout(() => wardrobe.classList.remove("open"), 2600);
    }, { threshold: 0.6 });
    demo.observe(stage);
  }

  document.getElementById("fSend").addEventListener("click", () => {
    const msg = `Hello ${BUSINESS_NAME}, I tried the finish planner on your website.\n` +
      `Doors: ${FINISHES[state.door].name}\nBody: ${FINISHES[state.body].name}\nHandles: ${HANDLES[state.handle].name}\n` +
      `Do you have similar laminates and finishes? I will visit the shop to see the samples.`;
    window.open(waLink(msg), "_blank", "noopener");
  });

  apply();
})();
