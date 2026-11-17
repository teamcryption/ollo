/**
 * Ukulele: a small four-string ukulele lying on its back, pegs on the
 * headstock. The pointer over it lifts the neck: the ukulele tips up on its
 * tail as if picked up to tune. At rest the pegs are bright; when the
 * pointer plays, the body is. The slider is how far the neck lifts.
 *
 * The pattern: one part turning about a hinge (tilt).
 */
const { Cam, circ, fit, hull, poly, proj, rad, open, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const RL = 26, RU = 19, XU = 32, TH = 10, TAIL = -RL, REST = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[RL, -RL, 0], [RL, RL, 0], [-96, 0, 0], [0, RL, 0], [-XU, -RU, 0], [-16, 0, 120], [-92, 0, 48]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const upper = mk("path", { class: "sil" }, g), lower = mk("path", { class: "sil" }, g), hole = mk("path", { class: "nf lo" }, g);
  const bridge = mk("path", { class: "nf" }, g);
  const neck = mk("path", { class: "nf" }, g), head = mk("path", { class: "nf" }, g), strings = mk("path", { class: "nf lo" }, g);
  const pegs = Array.from({ length: 4 }, () => mk("path", { class: "nf" }, g));

  let W = (p) => p;
  const disc = (x, r, z, n = 36) => circ(r, n).map((q) => W([x + q.u, q.v, z]));
  const box = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(W([x, y, z])); return poly(hull(o)); };
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = rad(deg), c = Math.cos(f), s = Math.sin(f);
    W = ([x, y, z]) => { const dx = x - TAIL; return P(-(TAIL + dx * c - z * s), y, z * c + dx * s); };
    lower.setAttribute("d", poly(hull(disc(0, RL, 0).concat(disc(0, RL, TH)))));
    upper.setAttribute("d", poly(hull(disc(XU, RU, 0).concat(disc(XU, RU, TH)))));
    hole.setAttribute("d", poly(disc(XU - 2, 7, TH)));
    bridge.setAttribute("d", box(-8, -4, -9, 9, TH, TH + 1.5));
    neck.setAttribute("d", box(XU + 14, 82, -4, 4, TH - 4, TH));
    head.setAttribute("d", box(82, 98, -6.5, 6.5, TH - 5, TH - 1));
    strings.setAttribute("d", [-3, -1, 1, 3].map((y) => open([W([-6, y * 1.3, TH + 1.5]), W([84, y, TH])])).join(" "));
    pegs.forEach((el, k) => {
      const x = 86 + (k % 2) * 7, y = k < 2 ? -6.5 : 6.5, d = k < 2 ? -5 : 5;
      el.setAttribute("d", poly(hull(circ(2.4, 12).map((q) => W([x + q.u, y, TH - 3 + q.v])).concat(circ(2.4, 12).map((q) => W([x + q.u, y + d, TH - 3 + q.v]))))));
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(-10, 0, 30);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + 45 * amp : REST, performance.now(), 0);
    lower.classList.toggle("hi", on);
    upper.classList.toggle("hi", on);
    pegs.forEach((el) => el.classList.toggle("hi", !on));
    read.textContent = on ? "lift" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], (sy - mid[1]) * 1.4) < 120;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "tuningpeg",
  means: "A ukulele on its back: over it, the neck lifts and the ukulele tips up on its tail, pegs first, to be tuned.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[219, 201], [180, 160], [250, 220], null],
  mount,
});
