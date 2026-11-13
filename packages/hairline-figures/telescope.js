/**
 * Telescope: a refractor on a tripod, a long tube with a dew shield, a finder
 * scope on top and a star diagonal at the back, on an alt-azimuth arm. The
 * pointer is a star: the tube swings in azimuth and tips in altitude to aim
 * at it, each on its own spring, and the star sits bright on the line of
 * sight. At rest it holds a star high to the left. The slider is how quickly
 * the tube follows (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (spotlights' spring, on two angles); the aim
 * reads the pointer alone, never the tube on screen.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PV = [0, 0, 64], R1 = 6, R2 = 7.4, BACK = rad(225), SPAN = rad(70), PMIN = rad(6), PMAX = rad(58);
const STAR = 64, DEEP = 80, FOOT = 34, TOP = 47, LEGS = [200, 320, 80].map(rad), REST = [rad(28), rad(34)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  const dirOf = (a, p) => [Math.cos(BACK + a) * Math.cos(p), Math.sin(BACK + a) * Math.cos(p), Math.sin(p)];
  const at = (o, ...t) => [0, 1, 2].map((j) => t.reduce((s, [v, k]) => s + v[j] * k, o[j]));
  const pts = LEGS.map((t) => [FOOT * Math.cos(t), FOOT * Math.sin(t), 0]);
  for (const a of [-SPAN, 0, SPAN]) for (const p of [PMIN, PMAX]) { const d = dirOf(a, p); pts.push(at(PV, [d, STAR + 3]), at(PV, [d, -30])); }
  fit(C, pts, 200, 154);
  const P = proj(C), front = facing(C);
  const zf = Math.sqrt(1 - C.k * C.k), vw = [Math.sin(C.az) * zf, Math.cos(C.az) * zf, C.k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const g = mk("g", {}, svg);

  /** The run of a closed ring off the hull, with the hull point at each end: the edge of an end not already on the silhouette. */
  function inside(ring, sil) {
    const n = ring.length, on = ring.map((p) => sil.some((q) => Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) < 1e-6));
    const s = on.findIndex((v, i) => v && !on[(i + 1) % n]);
    if (s < 0) return ring;
    const out = [ring[s]];
    for (let i = 1; i <= n; i++) { const j = (s + i) % n; out.push(ring[j]); if (on[j]) break; }
    return out;
  }
  /** A cylinder along ax through c, radius r from s0 to s1; e1, e2 span its rings. Its crease is the end that faces the reader. */
  function cyl(el, c, ax, e1, e2, r, s0, s1, n = 28) {
    const ring = (s) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(...at(c, [ax, s], [e1, r * Math.cos(t)], [e2, r * Math.sin(t)])); });
    const a = ring(s0), b = ring(s1), sil = hull(a.concat(b));
    el.sil.setAttribute("d", poly(sil));
    el.cr.setAttribute("d", open(inside(dot(ax, vw) > 0 ? b : a, sil)));
  }

  // the tripod: three legs, the far one first, then the head and the azimuth base
  const legs = LEGS.map((t) => {
    const f = [FOOT * Math.cos(t), FOOT * Math.sin(t), 0], h = [5 * Math.cos(t), 5 * Math.sin(t), TOP], ax = at(h, [f, -1]), L = Math.hypot(...ax);
    const d = ax.map((v) => v / L), e1 = [-Math.sin(t), Math.cos(t), 0], e2 = [d[1] * e1[2] - d[2] * e1[1], d[2] * e1[0] - d[0] * e1[2], d[0] * e1[1] - d[1] * e1[0]];
    const el = solid(g);
    cyl(el, f, d, e1, e2, 1.7, 0, L, 16);
    el.cr.setAttribute("d", seg(P(...at(f, [d, L * 0.5], [e1, -1.7])), P(...at(f, [d, L * 0.5], [e1, 1.7]))));
    return el;
  });
  put(solid(g), prism(P, front, circ(8, 40), circ(6.6, 40), TOP, TOP + 4));
  put(solid(g), prism(P, front, circ(5, 32), circ(3.8, 32), TOP + 4, TOP + 9));

  // the moving parts, in a group each, reordered by which way the tube faces
  const sight = mk("path", { class: "nf dash" }, g);
  const star = mk("circle", { r: 2.4, class: "dot" }, g);
  const parts = {};
  for (const k of ["armB", "dew", "body", "finder", "focus", "diag", "armF"]) parts[k] = solid(g);
  const brackets = mk("path", { class: "nf lo" }, parts.finder.g, );
  parts.finder.g.prepend(brackets);
  const ay = spring(REST[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), ap = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let lastKey = "", lastOrder = "";

  function draw() {
    const key = ay.x.toFixed(4) + "," + ap.x.toFixed(4);
    if (key === lastKey) return;
    lastKey = key;
    const y = BACK + ay.x, p = ap.x, d = dirOf(ay.x, p);
    const u = [-Math.sin(y), Math.cos(y), 0], v = [-Math.sin(p) * Math.cos(y), -Math.sin(p) * Math.sin(y), Math.cos(p)], nd = d.map((x) => -x);
    cyl(parts.dew, PV, d, u, v, R2, 27, 44);
    cyl(parts.body, PV, d, u, v, R1, -18, 28);
    const fc = at(PV, [v, R1 + 4.6]);
    cyl(parts.finder, fc, d, u, v, 2.2, 0, 17, 20);
    brackets.setAttribute("d", [3, 13].map((s) => seg(P(...at(PV, [d, s], [v, R1])), P(...at(fc, [d, s], [v, -2.2])))).join(""));
    cyl(parts.focus, PV, d, u, v, 3.2, -26, -18, 20);
    cyl(parts.diag, at(PV, [d, -24]), v, u, nd, 2.4, 2.5, 11, 18);
    // the altitude arm on the tube's +u side: a post from the base and a hub at the pivot
    const side = dot(u, vw) > 0 ? parts.armF : parts.armB, other = side === parts.armF ? parts.armB : parts.armF;
    const foot = at([0, 0, TOP + 7], [u, R1 + 4]);
    cyl(side, foot, [0, 0, 1], [1, 0, 0], [0, 1, 0], 2.3, 0, PV[2] - foot[2], 16);
    side.cr.setAttribute("d", side.cr.getAttribute("d") + poly(Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * Math.PI * 2; return P(...at(PV, [u, R1 + 1.5], [d, 3.4 * Math.cos(t)], [v, 3.4 * Math.sin(t)])); })));
    other.sil.setAttribute("d", ""); other.cr.setAttribute("d", "");
    const tip = at(PV, [d, STAR]);
    sight.setAttribute("d", seg(P(...at(PV, [d, 47])), P(...at(PV, [d, STAR - 4]))));
    star.setAttribute("cx", P(...tip)[0]); star.setAttribute("cy", P(...tip)[1]);
    // the end that faces away is painted first
    const order = dot(d, vw) < 0 ? ["armB", "dew", "body", "finder", "focus", "diag", "armF"] : ["armB", "diag", "focus", "body", "finder", "dew", "armF"];
    if (order.join() !== lastOrder) { lastOrder = order.join(); for (const k of order) g.append(parts[k].g); }
  }

  const B = register(stage, (dt) => { const a = stepS(ay, dt), b = stepS(ap, dt); draw(); return a || b; });
  bag.add(B.unregister);

  // the aim: the world point under the pointer, DEEP behind the pivot along the line of sight; it never reads the tube
  function aim([sx, sy]) {
    const X = (sx - C.ox) / C.S, Ys = (sy - C.oy) / C.S, dp = dot(PV, vw) - DEEP;
    const Y = C.k * Ys + zf * dp, z = -zf * Ys + C.k * dp, c = Math.cos(C.az), s = Math.sin(C.az);
    const t = [X * c + Y * s - PV[0], -X * s + Y * c - PV[1], z - PV[2]];
    let a = Math.atan2(t[1], t[0]) - BACK;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    return [clamp(a, -SPAN, SPAN), clamp(Math.atan2(t[2], Math.hypot(t[0], t[1])), PMIN, PMAX)];
  }

  function retarget(q) {
    const [a, p] = q ? aim(q) : REST;
    ay.t = a; ap.t = p;
    const az = Math.round(((((BACK + a) * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = q ? `az ${az}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (q) => retarget(q), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());
  retarget(null);
  return {
    set: (v) => { ay.k = ap.k = 100 * v; ay.c = ap.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "telescope",
  means: "A refracting telescope on a tripod swings and tips to aim at the pointer, as if tracking a star.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[120, 90], [280, 80], [200, 60], null],
  mount,
});
