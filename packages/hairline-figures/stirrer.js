/**
 * Magnetic stirrer: a low stir plate with a front knob and a glass beaker of
 * liquid on it, a stir bar lying on the bottom. The pointer over it starts
 * the stirrer: the bar turns and the liquid's surface pulls down into a deep
 * vortex, ring by ring, on a spring. At rest the surface is bright. The
 * slider is how deep the vortex pulls.
 *
 * The pattern: a single object on a spring (terrain's spring, on a depth).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const CX = 30, CY = 28, BR = 22, Z0 = 12, LZ = 46, TOP = 58;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [60, 0, 0], [60, 56, 0], [0, 56, 0], [CX - BR, CY, TOP], [CX + BR, CY, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(0, 0, 60, 56, 8, 2), 0, Z0));
  const kb = disc(0, 0, 4.5, 20);
  mk("path", { d: poly(hull(kb.map((q) => P(44 + q.u, 56, 6 + q.v)).concat(kb.map((q) => P(44 + q.u, 59, 6 + q.v))))) }, g);
  const glassBack = mk("path", { class: "nf lo" }, g);
  glassBack.setAttribute("d", open(ringAt(P, run(disc(CX, CY, BR), (q) => !front(q)), TOP)));
  const bar = mk("path", { class: "nf" }, g);
  const surf = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => mk("path", { class: i === 0 ? "nf hi" : "nf lo" }, g));
  const glass = mk("path", { class: "sil nf" }, g);
  glass.setAttribute("d", poly(hull(ringAt(P, disc(CX, CY, BR), Z0).concat(ringAt(P, disc(CX, CY, BR), TOP)))));
  mk("path", { d: open(ringAt(P, run(disc(CX, CY, BR), front), TOP)), class: "nf" }, g);

  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const a = d / 3;
    surf.forEach((p, i) => {
      const f = i / 9, r = (BR - 0.8) * (1 - f * 0.7);
      p.setAttribute("d", poly(ringAt(P, disc(CX, CY, r), Math.max(Z0 + 5, LZ - d * Math.pow(f, 0.4) * 1.5))));
    });
    const c = Math.cos(a) * 15, s = Math.sin(a) * 15;
    bar.setAttribute("d", poly(hull([P(CX - c, CY - s, Z0 + 1), P(CX + c, CY + s, Z0 + 1), P(CX - c, CY - s, Z0 + 4), P(CX + c, CY + s, Z0 + 4)])));
  }

  const sp = spring(3);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(3);

  const c0 = P(CX, CY, 0), cTop = P(CX, CY, TOP + 12), cNear = P(60, 56, 0);
  let on = false;
  function setOn(a) {
    on = a;
    sp.t = a ? reach : 3;
    read.textContent = a ? "stir" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => Math.abs(sx - c0[0]) < 75 && sy > cTop[1] - 10 && sy < cNear[1] + 6;
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "stirrer",
  means: "A magnetic stirrer with a beaker on it: the pointer starts the stir bar, and the liquid's surface pulls down into a deep vortex.",
  rules: [1, 3, 5, 8],
  range: [18, 26, 30],
  tour: [[200, 115], [200, 186], [203, 250], null],
  mount,
});
