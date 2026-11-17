/**
 * Kneeler: a padded garden kneeler with an upturned handle frame at each end.
 * The pointer across it flips the kneeler over its long edge, handles down,
 * into a seat: further the further right the pointer goes. At rest it sits
 * pad up and a little tipped, the pad bright. The slider is the widest flip.
 *
 * The pattern: one object turning about an axis (turn).
 */
const {
  Cam, clamp, fit, hull, poly, proj, rad, spring, stepS, unproj,
  disposer, mk, pointer, register,
} = HL;

const L = 84, HW = 15, PT = 9, HH = 44, LW = 11, B = 1.8, REST = 12;
const box = (x0, x1, y0, y1, z0, z1) => { const c = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) c.push([x, y, z]); return c; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, -HH - 6, 0], [L, HH + 6, 0], [0, 0, HH + PT + 4], [L, 0, HH + PT + 4], [0, -HH, 30], [L, HH, 30]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = [{ c: box(0, L, -HW, HW, 0, PT), pad: true }];
  for (const x0 of [4, L - 10]) {
    for (const y of [-LW, LW]) parts.push({ c: box(x0, x0 + 6, y - B, y + B, PT, PT + HH) });
    parts.push({ c: box(x0, x0 + 6, -LW - B, LW + B, PT + HH - 2 * B, PT + HH + 1) });
  }
  for (const pt of parts) {
    pt.g = mk("g", {}, g);
    pt.sil = mk("path", { class: "sil" }, pt.g);
    if (pt.pad) pt.cr = mk("path", { class: "nf lo" }, pt.g);
  }
  const pad = parts[0];
  const ang = spring(REST);
  let last = NaN, order = "";

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const rot = ([x, y, z]) => [x, y * c - z * s, y * s + z * c];
    let mz = Infinity;
    for (const pt of parts) { pt.w = pt.c.map(rot); for (const q of pt.w) mz = Math.min(mz, q[2]); }
    const W = (q) => P(q[0], q[1], q[2] - mz);
    for (const pt of parts) {
      pt.sil.setAttribute("d", poly(hull(pt.w.map(W))));
      let sx = 0, sy = 0, sz = 0;
      for (const q of pt.w) { sx += q[0]; sy += q[1]; sz += q[2]; }
      pt.depth = 0.612 * (sx + sy) + 0.5 * sz;
    }
    // the visible broad face of the pad, inset a little: its crease
    const up = -0.612 * s + 0.5 * c > 0, z = up ? PT : 0, i = 2;
    pad.cr.setAttribute("d", poly([[i, -HW + i, z], [L - i, -HW + i, z], [L - i, HW - i, z], [i, HW - i, z]].map((q) => W(rot(q)))));
    const sorted = parts.slice().sort((p, q) => p.depth - q.depth), key = sorted.map((p) => parts.indexOf(p)).join();
    if (key !== order) { order = key; for (const p of sorted) g.appendChild(p.g); }
  }

  const Bk = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(Bk.unregister);

  let tgt = null, lastP = null;
  function flip(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wx > -30 && wx < L + 30 && wy > -HH - 30 && wy < HH + 30) a = maxA * clamp((wx - wy + 40) / (L + 60), 0.3, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    pad.sil.classList.add("hi");
    read.textContent = !p || a === REST ? "rest" : a > 120 ? "seat" : "flip " + a + "°";
    Bk.wake();
  }
  flip(null);
  bag.add(pointer(stage, { move: flip, leave: () => flip(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; flip(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "gardenkneeler",
  means: "A garden kneeler with a handle frame at each end: the pointer flips it over its long edge, handles down, into a seat.",
  rules: [1, 3, 5, 6],
  range: [90, 150, 180],
  tour: [[160, 180], [229, 200], [262, 232], null],
  mount,
});
