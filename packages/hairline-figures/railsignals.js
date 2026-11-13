/**
 * Rail signals: a short length of track, two rails on sleepers over a ballast
 * bed, with four semaphore signals on posts along its far side, each a post
 * with a finial, an arm that pivots near its top and a spectacle plate below
 * the pivot. The pointer picks a signal: its arm swings up to clear, and the
 * arms beside it swing partway, staggered from it. At rest one arm stands
 * clear, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the post whose
 * resting middle is nearest the pointer on screen.
 */
const {
  Cam, fillet, fit, facing, hull, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const L = 150, SX = [18, 56, 94, 132], PH = [48, 56, 52, 44], SY = -13, FAV = 2, UP = 60;
const AY = SY + 2.4, PIV = 6;
// the arm in its own plane: r along it from the pivot, w across it, a blade that narrows to a square end
const BLADE = fillet([[2, -2.9], [27, -2.4], [27, 2.4], [2, 2.9]], [1.2, 0.7, 0.7, 1.2], 3);
const SPEC = fillet([[-1.5, -3], [-1.5, -12.5], [-9.5, -12.5], [-9.5, -3]], [1.4, 2.4, 2.4, 1.4], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, 24, -3], [L + 4, 24, -3], [L + 4, -6, -3], [SX[0] - 4, SY - 4, 0], [SX[1], SY, PH[1] + 3], [SX[1] + 16, SY, PH[1] - PIV + 24], [SX[3] + 28, SY, PH[3] - PIV]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const sigs = [];
  SX.forEach((px, k) => {
    const h = PH[k], pz = h - PIV;
    const [fr, fi] = rings(px - 4, SY - 4, px + 4, SY + 4, 1.6, 0.8);
    put(solid(g), prism(P, front, fr, fi, -1, 2));
    const [pr, pi] = rings(px - 1.8, SY - 1.8, px + 1.8, SY + 1.8, 0.9, 0.5);
    put(solid(g), prism(P, front, pr, pi, 2, h));
    const [cr, ci] = rings(px - 2.4, SY - 2.4, px + 2.4, SY + 2.4, 1.2, 0.6);
    put(solid(g), prism(P, front, cr, ci, h, h + 2.2));
    const spec = mk("path", { class: "sil" }, g), lens = mk("path", { class: "nf lo" }, g);
    const arm = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g);
    place(mk("circle", { r: 1.7, class: "dot m" }, g), P(px, AY + 0.8, pz));
    sigs.push({ k, px, pz, spec, lens, arm, band, a: tween(k === FAV ? UP : 0), last: NaN, mid: P(px, SY, h * 0.6) });
  });

  // the ballast bed, then sleepers, then the two rails on them
  const [br, bi] = rings(-4, -6, L + 4, 24, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, -3, 0));
  for (let x = 5; x < L; x += 14) {
    const [sr, si] = rings(x - 2.2, -2.5, x + 2.2, 20.5, 0.8, 0.5);
    put(solid(g), prism(P, front, sr, si, 0, 1.4));
  }
  for (const y of [3.2, 14.8]) {
    const [rr, ri] = rings(-2, y - 0.9, L + 2, y + 0.9, 0.6, 0.35);
    put(solid(g), prism(P, front, rr, ri, 1.4, 3.6));
  }

  /** The arm at angle a above level, turned about its pivot in the plane in front of the post. */
  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const t = rad(a), c = Math.cos(t), n = Math.sin(t);
    const at = ([r, w], y) => P(s.px + r * c - w * n, y, s.pz + r * n + w * c);
    const plate = (pts) => poly(hull([...pts.map((p) => at(p, AY)), ...pts.map((p) => at(p, AY + 0.9))]));
    s.spec.setAttribute("d", plate(SPEC));
    s.arm.setAttribute("d", plate(BLADE));
    s.band.setAttribute("d", seg(at([18, -2.6], AY + 0.9), at([18, 2.6], AY + 0.9)) + seg(at([21.5, -2.5], AY + 0.9), at([21.5, 2.5], AY + 0.9)));
    s.lens.setAttribute("d", [-5.6, -9.9].map((w) => open(Array.from({ length: 13 }, (_, i) => { const u = (i / 12) * Math.PI * 2; return at([-5.5 + 1.9 * Math.cos(u), w + 1.9 * Math.sin(u)], AY + 0.9); }))).join(""));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of sigs) { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    sigs.forEach((s, k) => { const d = Math.hypot(s.mid[0] - sx, (s.mid[1] - sy) * 0.35); if (d < bd) { bd = d; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sigs.forEach((s, k) => {
      const d = Math.abs(k - a), to = a < 0 ? (k === FAV ? UP : 0) : d === 0 ? UP : d === 1 ? 30 : 12;
      tset(s.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.arm.classList.toggle("hi", on);
      s.spec.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "signal " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "railsignals",
  means: "Four semaphore signals beside a track: the arm under the pointer swings up to clear, and its neighbours swing partway.",
  rules: [1, 2, 5, 10],
  range: [0, 45, 90],
  tour: [[141, 90], [195, 114], [302, 182], null],
  mount,
});
