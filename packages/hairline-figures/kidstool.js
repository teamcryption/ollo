/**
 * Step stool: a folding two-step stool. The front ladder frame swings out
 * on its hinge under the top platform as the pointer nears, its steps
 * levelling. At rest it is nearly folded and its upper step is bright.
 */
const { Cam, clamp, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 30, H = 36, HY = 15, OPEN = 0.55, REST = 0.1;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const rot = (hy, hz, a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => { const dy = y - hy, dz = z - hz; return [x, hy + dy * c - dz * s, hz + dy * s + dz * c]; }; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, HY + H * 0.6, 0], [W, HY + H * 0.6, 0], [0, -2, H + 3], [W, 16, H + 3]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hb = (pts) => poly(hull(pts.map((p) => P(...p))));
  for (const b of [box(0, 0, 0, 3, 3, H), box(3, 0, 12, W - 3, 2, 15), box(W - 3, 0, 0, W, 3, H)]) mk("path", { class: "sil", d: hb(b) }, g);
  const fl = mk("g", {}, g);
  const r1 = mk("path", { class: "sil" }, fl), s1 = mk("path", { class: "sil" }, fl), s2 = mk("path", { class: "sil hi" }, fl), r2 = mk("path", { class: "sil" }, fl);
  mk("path", { class: "sil", d: hb(box(-1, -2, H, W + 1, 17, H + 3)) }, g);
  const pre = rot(HY, H, -OPEN);
  const step = (z) => box(3, HY - 1, z, W - 3, HY + 11, z + 2.5).map(pre);
  const la = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = rot(HY, H, a);
    r1.setAttribute("d", hb(box(0, HY - 2, 0, 3, HY + 1, H).map(T)));
    r2.setAttribute("d", hb(box(W - 3, HY - 2, 0, W, HY + 1, H).map(T)));
    s1.setAttribute("d", hb(step(10).map(T)));
    s2.setAttribute("d", hb(step(22).map(T)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(la, now)); return !tdone(la, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, HY + 6, H / 2);
  function near(p) {
    const now = performance.now();
    const f = p ? clamp(1.4 - Math.hypot(p[0] - mid[0], p[1] - mid[1]) / 90, 0, 1) : 0;
    tset(la, REST + f * (OPEN - REST), now, lag);
    read.textContent = p && f > 0 ? Math.round(f * 100) + "%" : "rest";
    B.wake();
  }
  near(null);
  bag.add(pointer(stage, { move: (p) => near(p), leave: () => near(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kidstool",
  means: "A folding step stool: its front ladder frame swings out and the steps level as the pointer comes near.",
  rules: [1, 2, 5, 6],
  range: [0, 0, 200],
  tour: [[177, 156], [210, 184], [250, 110], null],
  mount,
});
