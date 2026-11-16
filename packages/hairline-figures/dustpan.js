/**
 * Dustpan: a lobby dustpan, a low pan on a tall handle with a hooded lid. The pointer flips the lid up on its back hinge.
 * At rest it sits a little open, bright. The slider is how far it opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, proj, rings, ringAt, run, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, register,
} = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const ID = (p) => p;
const at = (ring, z, xf) => ring.map((q) => xf([q.u, q.v, z]));
// pivot about a line along x (y, z) or along y (x, z)
const rotX = (py, pz, a) => ([x, y, z]) => { const dy = y - py, dz = z - pz, c = Math.cos(a), s = Math.sin(a); return [x, py + dy * c - dz * s, pz + dy * s + dz * c]; };
const rotY = (px, pz, a) => ([x, y, z]) => { const dx = x - px, dz = z - pz, c = Math.cos(a), s = Math.sin(a); return [px + dx * c - dz * s, y, pz + dx * s + dz * c]; };
const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return [o, i, z0, z1]; };
const cyl = (x, y, R, b, z0, z1) => [disc(x, y, R), disc(x, y, R - b), z0, z1];
const worldPts = (s, xf) => at(s[0], s[2], xf).concat(at(s[0], s[3], xf));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const REST = 10;
  const STAT = [cyl(-4, 28, 3, 0.8, 8, 92), cyl(-4, 28, 4.2, 1, 80, 96), box(0, 0, 44, 56, 4, 1.5, 0, 9)];
  const MOVE = [box(0, 1, 42, 55, 6, 2, 9, 22)];
  const XF = (a) => rotY(1, 9, a);
  const HIT = [22, 28, 18];
  const C = Cam(45, 0.5, 2.15);
  const fp = [];
  for (const s of STAT) fp.push(...worldPts(s, ID));
  for (const a of [rad(REST), rad(100)]) for (const s of MOVE) fp.push(...worldPts(s, XF(a)));
  fit(C, fp, 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const draw = (el, s, xf) => {
    el.sil.setAttribute("d", poly(hull(worldPts(s, xf).map((p) => P(...p)))));
    el.cr.setAttribute("d", poly(at(s[1], s[3], xf).map((p) => P(...p))));
  };
  const make = (parent) => { const q = mk("g", {}, parent); return { sil: mk("path", { class: "sil" }, q), cr: mk("path", { class: "lo nf" }, q) }; };
  STAT.forEach((s) => draw(make(g), s, ID));
  const mv = MOVE.map(() => make(g));
  mv[0].sil.classList.add("hi");
  const tw = tween(REST);
  let last = NaN;
  function frame(deg) {
    if (deg === last) return;
    last = deg;
    const xf = XF(rad(deg));
    MOVE.forEach((s, k) => draw(mv[k], s, xf));

  }
  const B = register(stage, (_dt, now) => { frame(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(...HIT), HR = 115;
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? amax : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < HR), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; if (act) { tset(tw, amax, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "dustpan",
  means: "A lobby dustpan on its tall handle: the hooded lid flips up on its back hinge when the pointer comes near.",
  rules: [1, 4, 5, 6],
  range: [45, 75, 100],
  tour: [[215, 204], [215, 217], [209, 242], null],
  mount,
});
