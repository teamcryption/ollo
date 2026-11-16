/**
 * Mannequinleg: a hosiery leg form standing on its round foot plate. The
 * pointer tips the leg on its ankle pivot toward the side it stands on; the
 * leg swings like a display piece nudged on the counter. At rest the leg
 * leans a little, bright. The slider is the furthest lean.
 *
 * The pattern: one part following the pointer (tilt).
 */
const { Cam, circ, fit, hull, poly, proj, clamp, spring, stepS, mk, pointer, register, disposer } = HL;

const rot = (p, o, k, a) => {
  const x = p[0] - o[0], y = p[1] - o[1], z = p[2] - o[2], c = Math.cos(a), s = Math.sin(a), d = k[0] * x + k[1] * y + k[2] * z;
  return [o[0] + x * c + (k[1] * z - k[2] * y) * s + k[0] * d * (1 - c), o[1] + y * c + (k[2] * x - k[0] * z) * s + k[1] * d * (1 - c), o[2] + z * c + (k[0] * y - k[1] * x) * s + k[2] * d * (1 - c)];
};
const lev = (r, x, y, z, n = 28) => circ(r, n).map((q) => [x + q.u, y + q.v, z]);
const AX = [Math.SQRT1_2, Math.SQRT1_2, 0], PIV = [0, 0, 8], REST = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.8);
  const ext = [];
  for (const a of [-0.62, 0, 0.62]) for (const p of [[0, 0, 96], [10, -10, 96], [-10, 10, 96]]) ext.push(rot(p, PIV, AX, a));
  fit(C, ext.concat([[-28, -28, 0], [28, 28, 0], [28, -28, 0], [-28, 28, 0]]), 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const base = mk("path", { class: "sil" }, g), baseCr = mk("path", { class: "nf lo" }, g);
  base.setAttribute("d", poly(hull(lev(28, 0, 0, 0, 40).concat(lev(28, 0, 0, 5, 40)).map((p) => P(...p)))));
  baseCr.setAttribute("d", poly(lev(25, 0, 0, 5, 40).map((p) => P(...p))));
  const stem = mk("path", { class: "sil" }, g);
  stem.setAttribute("d", poly(hull(lev(3, 0, 0, 5, 16).concat(lev(3, 0, 0, 9, 16)).map((p) => P(...p)))));
  const lg = mk("g", {}, g);
  // foot, lower leg, thigh: three convex pieces of the form
  const parts = [
    { pts: lev(5.5, 0, 0, 8).concat(lev(5.5, 0, 0, 14), lev(3.6, 11, 11, 8, 20), lev(3.6, 11, 11, 11, 20)) },
    { pts: lev(4.6, 0, 0, 12).concat(lev(8.4, -1, -1, 38), lev(6.6, 0, 0, 58)) },
    { pts: lev(6.6, 0, 0, 57).concat(lev(9.6, 0, 0, 78), lev(10.4, 0, 0, 94)) },
  ];
  parts.forEach((pt) => { pt.el = mk("path", { class: "sil" }, lg); });
  const cap = mk("path", { class: "nf lo" }, lg), knee = mk("path", { class: "nf lo" }, lg);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = (p) => P(...rot(p, PIV, AX, a));
    for (const pt of parts) pt.el.setAttribute("d", poly(hull(pt.pts.map(T))));
    cap.setAttribute("d", poly(lev(8.6, 0, 0, 94, 32).map(T)));
    knee.setAttribute("d", poly(lev(6.6, 0, 0, 57.5, 24).map(T).filter((q, i) => i > 3 && i < 12).concat([])));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const piv = P(...PIV), top = P(0, 0, 96);
  function aim(p) {
    const inside = p && Math.abs(p[0] - piv[0]) < 120 && p[1] > top[1] - 30 && p[1] < piv[1] + 40;
    const t = inside ? clamp((p[0] - piv[0]) / 70, -1, 1) : null;
    sp.t = t === null ? REST : -t * (max * Math.PI / 180);
    parts.forEach((pt) => pt.el.classList.toggle("hi", true));
    read.textContent = t === null ? "rest" : (t < 0 ? "lean L" : "lean R");
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "mannequinleg",
  means: "A hosiery leg form on its foot plate: the leg tips on its ankle pivot toward the side the pointer stands on.",
  rules: [1, 3, 4, 5],
  range: [15, 30, 35],
  tour: [[299, 55], [101, 79], [260, 120], null],
  mount,
});
