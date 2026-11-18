/**
 * Delivery van: a short box van with a snub cab and a roller shutter on the
 * back. The pointer near the back rolls the shutter up, the nearer the
 * higher, showing the parcels inside; away it settles just cracked open.
 * The shutter is bright at rest. The slider is how far it may roll up.
 *
 * The pattern: one part answering where the pointer stands (spring).
 */
const {
  Cam, fit, facing, fillet, poly, seg, prism, proj, rings, unproj, clamp, lerp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 38, W = 42, Z0 = 8, ZT = 54, OY0 = 3, OY1 = W - 3, OZ0 = Z0 + 2, OZ1 = ZT - 6, AJAR = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxO = value / 100;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-36, 0, 0], [L + 1, W + 1, 0], [L + 1, 0, 0], [-36, W, 24], [0, 0, ZT], [L, 0, ZT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (cx, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(cx + 8 * Math.cos(t), y, 8 + 8 * Math.sin(t))); }
    return poly(pts);
  };
  for (const cx of [-18, 27]) mk("path", { d: wheel(cx, 3), class: "lo" }, g);
  // snub nose, cab, then the cargo box
  const [nR, nI] = rings(-36, 2, -20, W - 2, 5, 1.4);
  put(solid(g), prism(P, front, nR, nI, Z0, 22));
  const [cR, cI] = rings(-24, 1, 2, W - 1, 6, 1.6);
  put(solid(g), prism(P, front, cR, cI, Z0, 40));
  const [bR, bI] = rings(0, 0, L, W, 4, 1.6);
  put(solid(g), prism(P, front, bR, bI, Z0, ZT));
  // the opening and the parcels behind the shutter
  const hole = [[L, OY0, OZ0], [L, OY1, OZ0], [L, OY1, OZ1], [L, OY0, OZ1]].map((q) => P(...q));
  mk("path", { d: poly(fillet(hole, [1.5, 1.5, 1.5, 1.5])), class: "lo" }, g);
  for (const [y0, y1, z0, z1] of [[6, 18, 10, 24], [19, 32, 10, 19], [20, 31, 19, 30], [7, 17, 24, 35], [11, 27, 35, 43]]) {
    const [pR, pI] = rings(L - 9, y0, L - 1, y1, 1.5, 0.8);
    const p = solid(g);
    put(p, prism(P, front, pR, pI, z0, z1));
  }
  for (const cx of [-18, 27]) mk("path", { d: wheel(cx, W), class: "sil" }, g);
  // the shutter: a plate from its bottom edge up to the drum, with slats
  const sh = mk("path", { class: "sil" }, g);
  const slats = mk("path", { class: "nf lo" }, g);
  const grip = mk("path", { class: "nf sil" }, g);
  mk("path", { d: poly(fillet([[L, OY0 - 1, OZ1], [L, OY1 + 1, OZ1], [L, OY1 + 1, OZ1 + 4], [L, OY0 - 1, OZ1 + 4]].map((q) => P(...q)), [1.5, 1.5, 1.5, 1.5])) }, g);
  const o = spring(AJAR);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const zb = lerp(OZ0, OZ1 - 1, v);
    sh.setAttribute("d", poly([P(L, OY0, zb), P(L, OY1, zb), P(L, OY1, OZ1), P(L, OY0, OZ1)]));
    let d = "";
    for (let z = zb + 5; z < OZ1 - 1; z += 5) d += seg(P(L, OY0 + 1, z), P(L, OY1 - 1, z));
    slats.setAttribute("d", d || "M0 0");
    grip.setAttribute("d", seg(P(L, W / 2 - 5, zb + 2), P(L, W / 2 + 5, zb + 2)));
  }
  const B = register(stage, (dt) => { const m = stepS(o, dt); draw(o.x); return m; });
  bag.add(B.unregister);
  draw(AJAR);

  let on = null;
  function setOpen(t) {
    const live = t !== null;
    if (live !== on) { on = live; [sh, grip].forEach((e) => e.classList.toggle("hi", true)); }
    o.t = live ? AJAR + t * (maxO - AJAR) : AJAR;
    read.textContent = live ? Math.round(o.t * 100) + "%" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -40 || x > L + 30 || y < -30 || y > W + 30) return setOpen(null);
    setOpen(clamp((x + 36) / 24, 0, 1));
  }
  setOpen(null);
  bag.add(pointer(stage, { move, leave: () => setOpen(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxO = v / 100; if (on) B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "deliveryvan",
  means: "A delivery van whose rear roller shutter rolls up as the pointer nears the back, showing the parcels; the shutter is lit at rest.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[145, 162], [205, 170], [262, 178], null],
  mount,
});
