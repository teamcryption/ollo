/**
 * Handlebar bag: a boxy bag strapped under a bicycle's handlebar, its lid
 * hinged at the back and folding down over the front. The pointer over the
 * bag lifts the lid open; leaving lets it fall back ajar. The slider is how
 * far the lid swings.
 */
const {
  Cam, fit, fillet, hull, poly, prism, proj, rings, clamp, rad, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 34, H = 34, FL = 18, BY = -4, BZ = H - 2, BR = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.3);
  const rot = (x, y, z, a) => { const dy = y, dz = z - H, c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [x, dy * c - dz * s, H + dy * s + dz * c]; };
  const lidPts = (a) => [[0, 0, H], [W, 0, H], [W, D + 1, H], [0, D + 1, H], [0, D + 1, H - FL], [W, D + 1, H - FL]].map(([x, y, z]) => rot(x, y, z, a));
  fit(C, [[-22, BY, BZ], [W + 22, BY, BZ], [0, D, 0], [W, D, 0], [0, 0, 0], ...lidPts(115), ...lidPts(0)], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the handlebar: a round bar running across behind the bag
  const bar = [];
  for (const x of [-22, W + 22]) for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; bar.push(P(x, BY + BR * Math.cos(t), BZ + BR * Math.sin(t))); }
  const barG = mk("g", {}, g);
  mk("path", { d: poly(hull(bar)), class: "sil" }, barG);
  // two straps over the bar
  for (const x of [12, W - 12]) {
    const s = [];
    for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; s.push(P(x - 3, BY + (BR + 1.4) * Math.cos(t), BZ + (BR + 1.4) * Math.sin(t)), P(x + 3, BY + (BR + 1.4) * Math.cos(t), BZ + (BR + 1.4) * Math.sin(t))); }
    mk("path", { d: poly(hull(s)), class: "lo" }, barG);
  }

  const body = mk("g", {}, g);
  const [r0, r1] = rings(0, 0, W, D, 7, 2);
  put(solid(body), prism(P, front, r0, r1, 0, H));
  const lid = mk("g", {}, g);
  const top = mk("path", {}, lid), flap = mk("path", { class: "sil" }, lid), buckle = mk("path", { class: "lo" }, lid);

  const ang = tween(14);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const L = lidPts(a).map((p) => P(...p));
    top.setAttribute("d", poly(fillet([L[0], L[1], L[2], L[3]], [3, 3, 3, 3])));
    flap.setAttribute("d", poly(fillet([L[3], L[2], L[5], L[4]], [2, 2, 5, 5])));
    const bk = [[W / 2 - 6, D + 1, H - FL + 2], [W / 2 + 6, D + 1, H - FL + 2], [W / 2 + 6, D + 1, H - FL + 9], [W / 2 - 6, D + 1, H - FL + 9]].map((p) => P(...rot(...p, a)));
    buckle.setAttribute("d", poly(fillet(bk, [1.5, 1.5, 1.5, 1.5])));
    if (a > 95) lid.before(body); else body.after(lid);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = hull([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, H], [W, 0, H], [W, D, H], [0, D, H]].map((p) => P(...p)));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys) - 10, by1 = Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? maxA : 14, performance.now(), 0);
    flap.classList.add("hi");
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > bx0 && sx < bx1 && sy > by0 && sy < by1), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = clamp(v, 60, 115); if (on) { tset(ang, maxA, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "handlebar",
  means: "A bag strapped under a bicycle handlebar: the pointer over it swings its lid open, and leaving lets it fall back ajar.",
  rules: [1, 5, 6, 8],
  range: [60, 100, 115],
  tour: [[159, 183], [205, 200], [240, 170], null],
  mount,
});
