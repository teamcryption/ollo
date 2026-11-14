/**
 * Air compressor: a tank lying on its feet with a gauge on top, and a hose
 * running to a tyre standing beside it. The pointer's place along the floor
 * is the pressure: the tyre swells as it moves out, clamped to a full tyre,
 * and the hose lifts with it. At rest the tyre sits soft and the gauge is
 * bright.
 *
 * The pattern: a continuous input driving one part (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TL = 56, TR = 15, TX = 96, TW = 14, R0 = 15, R1 = 24, REST = 0.3;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let span = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, -TR - 4, 0], [TX + R1, TW + 4, 0], [TX + R1, -TR - 4, 0], [-4, TR + 4, 0], [0, 0, 2 * TR + 14], [TX, TW, 2 * R1 + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const fx of [8, TL - 8]) put(solid(g), prism(P, front, disc(fx, 0, 5), disc(fx, 0, 3.5), 0, 5));
  const ring = (x, r) => { const o = []; for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2; o.push(P(x, r * Math.cos(t), 4 + TR + r * Math.sin(t))); } return o; };
  mk("path", { d: poly(hull(ring(0, TR).concat(ring(TL, TR)))), class: "sil" }, g);
  mk("path", { d: poly(ring(TL - 2, TR - 1)), class: "nf lo" }, g);
  const gauge = solid(g);
  put(gauge, prism(P, front, disc(TL / 2, 0, 5.5), disc(TL / 2, 0, 4), 4 + 2 * TR - 1, 4 + 2 * TR + 6));
  const hose = mk("path", { class: "nf" }, g);
  const tyre = mk("g", {}, g);
  const sil = mk("path", { class: "sil" }, tyre), face = mk("path", { class: "nf lo" }, tyre), hub = mk("path", { class: "nf" }, tyre);
  const p = spring(REST);
  let last = NaN;

  const wheel = (y, r, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push([TX + r * Math.cos(t), y, r * Math.sin(t)]); } return o; };
  function draw() {
    const v = Math.round(p.x * 400) / 400;
    if (v === last) return;
    last = v;
    const R = lerp(R0, R1, v), w = lerp(TW - 3, TW, v), at = (q) => P(q[0], q[1], R + q[2]);
    sil.setAttribute("d", poly(hull(wheel(0, R).concat(wheel(w, R)).map(at))));
    face.setAttribute("d", poly(wheel(w, R - 2.5).map(at)));
    hub.setAttribute("d", poly(wheel(w + 0.5, 7, 24).map(at)));
    const a = [TL / 2 + 6, 0, 4 + 2 * TR + 3], b = [TX - 7 * 0.7, w + 0.5, R + 5], pts = [];
    for (let i = 0; i <= 18; i++) { const u = i / 18; pts.push(P(lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u) + Math.sin(Math.PI * u) * (8 + 10 * v))); }
    hose.setAttribute("d", open(pts));
  }

  const B = register(stage, (dt) => { const m = stepS(p, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(on, wx) {
    p.t = on ? clamp((wx + 10) / span, 0, 1) : REST;
    sil.classList.toggle("hi", on);
    gauge.sil.classList.toggle("hi", !on);
    read.textContent = on ? "psi " + Math.round(lerp(12, 36, p.t)) : "rest";
    B.wake();
  }
  aim(false, 0);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => aim(true, unproj(C, sx, sy, 0)[0]),
    leave: () => aim(false, 0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { span = v; }, destroy: bag.dispose };
}

hairline({
  name: "airpump",
  means: "A compressor tank with a gauge and a hose to a tyre: the pointer's place along the floor sets the pressure and the tyre swells.",
  rules: [1, 3, 5, 8],
  range: [60, 110, 160],
  tour: [[97, 111], [186, 134], [262, 206], null],
  mount,
});
