/**
 * Thrust reverser: a jet engine nacelle on its pylon, the fan face at the
 * front, the exhaust plug at the back, and between them the translating
 * cowl. At rest the cowl sits closed, bright. The pointer over the engine
 * deploys the reverser: the cowl slides aft and opens a band of cascade
 * vanes. The slider is how far the cowl travels.
 *
 * The pattern: one part on a slide, a discrete change on the 700ms tween.
 * Paint order is fixed far to near along the axis; the cascade is drawn only
 * where the cowl has opened it.
 */
const {
  Cam, fit, hull, open, poly, proj, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 26, ZC = 34, XF = 72, XI = 132, LS = 60, A0 = XF - LS;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-44, -R, ZC], [XI + 2, R, ZC - R], [XI + 2, -R, ZC + R + 16], [-44, R, ZC - R], [-10, 0, ZC + R + 16]], 200, 166);
  const P = proj(C);
  const o = P(0, 0, 0), e = [P(1, 0, 0), P(0, 1, 0), P(0, 0, 1)].map((q) => [q[0] - o[0], q[1] - o[1]]);
  const r1 = e.map((q) => q[0]), r2 = e.map((q) => q[1]);
  let V = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]];
  if (V[0] + V[1] + V[2] < 0) V = V.map((v) => -v);
  const ring = (x, r, n = 40) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return P(x, r * Math.cos(a), ZC + r * Math.sin(a)); });
  const half = (x, r, n = 40) => {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2, s = Math.cos(a) * V[1] + Math.sin(a) * V[2];
      pts.push(s > 0 ? P(x, r * Math.cos(a), ZC + r * Math.sin(a)) : null);
    }
    const k = pts.findIndex((p) => p === null), rot = k < 0 ? pts : pts.slice(k).concat(pts.slice(0, k));
    return rot.filter(Boolean);
  };

  const g = mk("g", {}, svg);
  // the pylon, the plug, the cowl, the cascade, the fan cowl: far to near
  const pyl = [];
  for (const x of [20, 112]) for (const z of [ZC + R - 4, ZC + R + 14]) for (const y of [-2, 2]) pyl.push(P(x + (z > ZC + R ? -6 : 0), y, z));
  put(solid(g), { sil: poly(hull(pyl)), crease: open([P(16, 0, ZC + R + 14), P(104, 0, ZC + R + 14)]) });
  put(solid(g), { sil: poly(hull(ring(16, 11, 24).concat(ring(-8, 2.5, 12)))), crease: open(half(10, 9, 24)) });
  const cowl = solid(g), casc = mk("g", {}, g), cascSil = mk("path", { class: "sil" }, casc), vanes = mk("path", { class: "nf lo" }, casc);
  put(solid(g), { sil: poly(hull(ring(XF, R).concat(ring(XI, R + 1)))), crease: open(half(XF + 2, R - 0.5)) });
  mk("path", { d: poly(ring(XI, R - 3)), class: "nf lo" }, g);
  const blades = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; blades.push(seg(P(XI, 6 * Math.cos(a), ZC + 6 * Math.sin(a)), P(XI, 22 * Math.cos(a + 0.25), ZC + 22 * Math.sin(a + 0.25)))); }
  mk("path", { d: blades.join(" "), class: "nf lo" }, g);
  mk("path", { d: poly(hull(ring(XI, 6, 20).concat([P(XI + 7, 0, ZC)]))) }, g);

  const sl = tween(3);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const a = A0 - s, f = XF - s;
    put(cowl, { sil: poly(hull(ring(f, R).concat(ring(a, R - 5)))), crease: open(half(f - 2, R - 0.5)) });
    const show = s > 1.5;
    if (!show) { cascSil.setAttribute("d", ""); vanes.setAttribute("d", ""); return; }
    cascSil.setAttribute("d", poly(hull(ring(f, R - 2.5).concat(ring(XF, R - 2.5)))));
    const ls = [], n = Math.max(1, Math.floor(s / 4));
    for (let i = 1; i < n; i++) ls.push(open(half(f + (i * s) / n, R - 2.5, 30)));
    vanes.setAttribute("d", ls.join(" "));
  }

  const B = register(stage, (_dt, now) => { draw(tval(sl, now)); return !tdone(sl, now); });
  bag.add(B.unregister);

  const box = [P(A0, 0, ZC + R), P(A0, 0, ZC - R), P(XI, R, ZC - R), P(XI, -R, ZC + R), P(XI, R, ZC), P(A0, -R, ZC)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inBox = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(sl, v ? travel : 3, performance.now(), 0);
    read.textContent = v ? "rev" : "rest";
    B.wake();
  }
  cowl.sil.classList.add("hi");
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inBox(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (on) { tset(sl, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "thrustreverser",
  means: "A jet engine nacelle: the pointer deploys the thrust reverser, sliding the aft cowl back to open a band of cascade vanes.",
  rules: [1, 5, 6, 8],
  range: [14, 30, 36],
  tour: [[193, 114], [285, 160], [280, 233], null],
  mount,
});
