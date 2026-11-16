/**
 * Kettle stand: a kettle on a round three-footed trivet. The pointer tips the kettle forward to pour.
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
  const REST = 4;
  const STAT = [cyl(32, 32, 4, 1, 0, 5), cyl(16, 18, 4, 1, 0, 5), cyl(16, 46, 4, 1, 0, 5), cyl(30, 32, 30, 2, 5, 9)];
  STAT.unshift(STAT.pop());
  const feet = [STAT[1], STAT[2], STAT[3]]; STAT.length = 1;
  const MOVE = [cyl(30, 32, 22, 2.2, 9, 38), box(47, 29, 66, 35, 2.5, 0.9, 20, 26), cyl(30, 32, 5, 1.2, 38, 43)];
  const XF = (a) => rotY(53, 9, -a);
  const HIT = [30, 32, 22];
  const C = Cam(45, 0.5, 3.15);
  const fp = [];
  for (const s of STAT) fp.push(...worldPts(s, ID));
  for (const a of [rad(REST), rad(45)]) for (const s of MOVE) fp.push(...worldPts(s, XF(a)));
  fit(C, fp, 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const draw = (el, s, xf) => {
    el.sil.setAttribute("d", poly(hull(worldPts(s, xf).map((p) => P(...p)))));
    el.cr.setAttribute("d", poly(at(s[1], s[3], xf).map((p) => P(...p))));
  };
  const make = (parent) => { const q = mk("g", {}, parent); return { sil: mk("path", { class: "sil" }, q), cr: mk("path", { class: "lo nf" }, q) }; };
  feet.slice().sort((a, b) => (a[0][0].u + a[0][0].v) - (b[0][0].u + b[0][0].v)).forEach((s) => draw(make(g), s, ID));
  STAT.forEach((s) => draw(make(g), s, ID));
  const mv = MOVE.map(() => make(g));
  const handle = mk("path", { class: "nf" }, g);
  mv[0].sil.classList.add("hi");
  const tw = tween(REST);
  let last = NaN;
  function frame(deg) {
    if (deg === last) return;
    last = deg;
    const xf = XF(rad(deg));
    MOVE.forEach((s, k) => draw(mv[k], s, xf));
    const hp = [];
    for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; hp.push(P(...xf([30, 32 - 16 * Math.cos(t), 38 + 13 * Math.sin(t)]))); }
    handle.setAttribute("d", open(hp));
  }
  const B = register(stage, (_dt, now) => { frame(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(...HIT), HR = 105;
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? amax : REST, performance.now(), 0);
    read.textContent = on ? "pour" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < HR), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; if (act) { tset(tw, amax, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "trivet",
  means: "A kettle on a round three-footed stand: the kettle tips forward on the trivet's rim to pour when the pointer comes near.",
  rules: [1, 4, 5, 6],
  range: [20, 32, 45],
  tour: [[187, 121], [187, 143], [191, 190], null],
  mount,
});
