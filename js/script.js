/* ===== Café em Família: script.js =====
   Parte 1: vitrine (catálogo)  |  Parte 2: animações (GSAP + Lenis) */

(() => {
  /* ===== EDITE AQUI: seu catálogo =====
   foto: endereço da imagem (deixe "" para mostrar o desenho no lugar) */
  const WHATS = "5581900000000";
  const CATALOG = [
    {
      nome: "Bolo de rolo",
      cat: "Bolos",
      preco: "",
      sym: "s-rolo",
      foto: "",
      desc: "Descrição real em breve.",
    },
    {
      nome: "Cesta de café da manhã",
      cat: "Cestas",
      preco: "",
      sym: "s-cafe",
      foto: "",
      desc: "Descrição real em breve.",
    },
    {
      nome: "Bolo de aniversário",
      cat: "Bolos",
      preco: "",
      sym: "s-rolo",
      foto: "",
      desc: "Descrição real em breve.",
    },
    {
      nome: "Salgados (cento)",
      cat: "Salgados",
      preco: "",
      sym: "s-queijo",
      foto: "",
      desc: "Descrição real em breve.",
    },
    {
      nome: "Pão de queijo (kg)",
      cat: "Pães",
      preco: "",
      sym: "s-queijo",
      foto: "",
      desc: "Descrição real em breve.",
    },
    {
      nome: "Pão artesanal",
      cat: "Pães",
      preco: "",
      sym: "s-pao",
      foto: "",
      desc: "Descrição real em breve.",
    },
  ];
  const $ = (s) => document.querySelector(s);
  const esc = (t) =>
    String(t).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const ph = (p) =>
    '<div class="ph">' +
    (p.foto
      ? '<img src="' +
        esc(p.foto) +
        '" alt="' +
        esc(p.nome) +
        '" loading="lazy">'
      : '<div class="em"><svg viewBox="0 0 120 120"><use href="#' +
        (p.sym || "s-pao") +
        '"/></svg></div>') +
    "</div>";
  const cats = ["Todos", ...new Set(CATALOG.map((p) => p.cat))];
  const flt = $("#flt"),
    cat = $("#cat"),
    dlg = $("#dlg"),
    dg = $("#dg");
  let cur = "Todos";
  function bar() {
    flt.innerHTML = cats
      .map(
        (c) =>
          '<button aria-pressed="' +
          (c === cur) +
          '" data-c="' +
          esc(c) +
          '">' +
          esc(c) +
          "</button>",
      )
      .join("");
  }
  function draw(anim) {
    cat.innerHTML = CATALOG.map((p, i) => [p, i])
      .filter((o) => cur === "Todos" || o[0].cat === cur)
      .map(
        (o) =>
          '<button class="it" data-k="' +
          o[1] +
          '">' +
          ph(o[0]) +
          "<h3>" +
          esc(o[0].nome) +
          "</h3><small>" +
          esc(o[0].cat) +
          " · " +
          esc(o[0].preco || "Sob consulta") +
          "</small></button>",
      )
      .join("");
    if (
      anim &&
      window.gsap &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      gsap.from(".it", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "all",
      });
    window.__refresh && window.__refresh();
  }
  flt.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    cur = b.dataset.c;
    bar();
    draw(true);
  });
  cat.addEventListener("click", (e) => {
    const b = e.target.closest(".it");
    if (!b) return;
    const p = CATALOG[b.dataset.k];
    dg.innerHTML =
      ph(p) +
      '<div><p class="lab">' +
      esc(p.cat) +
      "</p><h3>" +
      esc(p.nome) +
      '</h3><p style="margin:1rem 0;color:var(--mut)">' +
      esc(p.desc || "") +
      '</p><p class="serif" style="font-size:1.8rem">' +
      esc(p.preco || "Sob consulta") +
      '</p><a class="wa" target="_blank" rel="noopener" href="https://wa.me/' +
      WHATS +
      "?text=" +
      encodeURIComponent("Olá! Quero encomendar: " + p.nome) +
      '">Encomendar no WhatsApp</a></div>';
    dlg.showModal();
    window.__l && window.__l.stop();
  });
  dlg.addEventListener("close", () => window.__l && window.__l.start());
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  });
  $("#dx").addEventListener("click", () => dlg.close());
  bar();
  draw();
})();

(() => {
  const d = document,
    pre = d.getElementById("pre");
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || !window.ScrollTrigger) {
    pre && pre.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  let lenis;
  if (!rm && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on("scroll", ScrollTrigger.update);
    window.__l = lenis;
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  /* cursor + imagem do cardápio */
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    const c = d.querySelector(".cur"),
      f = d.querySelector(".fl"),
      u = f.querySelector("use");
    gsap.set(c, { xPercent: -50, yPercent: -50 });
    gsap.set(f, { xPercent: -50, yPercent: -50, scale: 0.6 });
    const cx = gsap.quickTo(c, "x", { duration: 0.2, ease: "power3" }),
      cy = gsap.quickTo(c, "y", { duration: 0.2, ease: "power3" });
    const fx = gsap.quickTo(f, "x", { duration: 0.6, ease: "power3" }),
      fy = gsap.quickTo(f, "y", { duration: 0.6, ease: "power3" });
    addEventListener("pointermove", (e) => {
      c.style.opacity = 1;
      cx(e.clientX);
      cy(e.clientY);
      fx(e.clientX + 110);
      fy(e.clientY - 40);
    });
    d.querySelectorAll(".row").forEach((r) => {
      r.addEventListener("pointerenter", () => {
        u.setAttribute("href", "#" + r.dataset.i);
        gsap.to(f, {
          opacity: 1,
          scale: 1,
          rotate: gsap.utils.random(-10, 10),
          duration: 0.45,
          ease: "power3.out",
        });
        c.classList.add("big");
      });
      r.addEventListener("pointerleave", () => {
        gsap.to(f, { opacity: 0, scale: 0.6, duration: 0.3 });
        c.classList.remove("big");
      });
    });
    d.querySelectorAll(".info .wa").forEach((b) => {
      const x = gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }),
        y = gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" });
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.3);
        y((e.clientY - r.top - r.height / 2) * 0.4);
      });
      b.addEventListener("pointerleave", () => {
        x(0);
        y(0);
      });
    });
    d.querySelectorAll("a").forEach((a) => {
      a.addEventListener("pointerenter", () => c.classList.add("big"));
      a.addEventListener("pointerleave", () => c.classList.remove("big"));
    });
  }
  if (rm) {
    pre.remove();
    return;
  }
  /* vapor e xícara */
  gsap.to(".steam path", {
    y: -14,
    opacity: 0.25,
    duration: 1.7,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.3,
  });
  gsap.to(".hero-art", {
    y: -10,
    duration: 3,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
  gsap.to(".cup", {
    rotate: -2,
    transformOrigin: "50% 100%",
    duration: 2.4,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
  /* intro */
  lenis && lenis.stop();
  gsap.set(".hero h1 .i", { yPercent: 115 });
  gsap.set(".hero-art", { scale: 0.85, opacity: 0 });
  gsap.set(".hero .fade", { opacity: 0, y: 14 });
  gsap
    .timeline({
      defaults: { ease: "power4.out" },
      onComplete: () => lenis && lenis.start(),
    })
    .from("#pre .i", { yPercent: 115, duration: 1.1 })
    .to(
      "#pre",
      {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
        onComplete: () => pre.remove(),
      },
      "+=.35",
    )
    .to(".hero h1 .i", { yPercent: 0, duration: 1.1, stagger: 0.12 }, "-=.6")
    .to(".hero-art", { scale: 1, opacity: 1, duration: 1.4 }, "<.1")
    .to(".hero .fade", { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, "<.3");
  /* ScrollTriggers criados na ordem em que aparecem na página */
  ScrollTrigger.config({ ignoreMobileResize: true });
  const rev = (el) =>
    gsap.from(el.querySelector(".i"), {
      yPercent: 120,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  gsap.to(".pg", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
  d.querySelectorAll(".row .rv").forEach(rev);
  /* 1. café sendo servido, preso ao scroll */
  const pctEl = d.getElementById("pct"),
    pc = { v: 0 };
  pctEl.textContent = "0";
  gsap.set("#str", { attr: { y2: 104 }, opacity: 0 });
  gsap.set("#cf", { attr: { y: 446 } });
  gsap.set("#stm", { opacity: 0 });
  gsap.set("#pot", { svgOrigin: "306 100", rotation: 0 });
  gsap
    .timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".pour",
        start: "top top",
        end: "+=220%",
        pin: true,
        scrub: 0.6,
      },
    })
    .to("#pot", { rotation: 24, duration: 2, ease: "power2.inOut" }, 0)
    .to("#str", { opacity: 1, duration: 0.1 }, 1.4)
    .to("#str", { attr: { y2: 436 }, duration: 1.2 }, 1.4)
    .to("#cf", { attr: { y: 338 }, duration: 5 }, 2.6)
    .to(
      pc,
      {
        v: 100,
        duration: 5,
        onUpdate: () => {
          pctEl.textContent = Math.round(pc.v);
        },
      },
      2.6,
    )
    .to("#str", { opacity: 0, duration: 0.6 }, 7.6)
    .to("#pot", { rotation: 0, duration: 1.6, ease: "power2.inOut" }, 7.6)
    .to("#stm", { opacity: 1, duration: 1.2 }, 8.4)
    .to({}, { duration: 0.8 });
  gsap.to("#stm path", {
    y: -8,
    duration: 1.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    stagger: 0.25,
  });
  /* 2. história pinada, linha a linha */
  const lines = gsap.utils.toArray(".story .i");
  gsap.set(lines, { yPercent: 120 });
  const st = gsap.timeline({
    defaults: { ease: "power4.out" },
    scrollTrigger: {
      trigger: ".story",
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: 0.6,
    },
  });
  lines.forEach((l, i) => st.to(l, { yPercent: 0, duration: 1 }, i * 0.9));
  st.to(
    ".bar i",
    { scaleX: 1, ease: "none", duration: lines.length * 0.9 },
    0,
  ).to({}, { duration: 0.6 });
  /* 3. vitrine, contato e rodapé */
  d.querySelectorAll("#vitrine .rv,#visite .rv").forEach(rev);
  gsap.from(".big", {
    yPercent: 40,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: { trigger: "footer", start: "top 90%" },
  });
  window.__refresh = () => ScrollTrigger.refresh();
  addEventListener("load", () => ScrollTrigger.refresh());
  d.fonts && d.fonts.ready.then(() => ScrollTrigger.refresh());
})();
