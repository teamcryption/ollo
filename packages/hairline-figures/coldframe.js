/**
 * Cold frame: a low box bed with a glazed lid hinged along its back edge.
 * The pointer's place across the frame tilts the lid open; at rest it is
 * propped a little ajar, bright. The slider is how far it may open.
 */

const { Cam, fit, hull, poly, proj, rrect, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const rotX = (p, y0, z0, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)), y = p[1] - y0, z = p[2] - z0; return [p[0], y0 + y * c - z * s, z0 + y * s + z * c]; };
const rotZ = (p, x0, y0, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)), x = p[0] - x0, y = p[1] - y0; return [x0 + x * c - y * s, y0 + x * s + y * c, p[2]]; };
const AX = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]];
function beam(a, b, up) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), U = d.map((q) => q / L);
  let V = [up[1] * U[2] - up[2] * U[1], up[2] * U[0] - up[0] * U[2], up[0] * U[1] - up[1] * U[0]];
  const n = Math.hypot(...V); V = V.map((q) => q / n);
  const W = [U[1] * V[2] - U[2] * V[1], U[2] * V[0] - U[0] * V[2], U[0] * V[1] - U[1] * V[0]];
  return { f: [a, U, V, W], L };
}
const wpt = (f, u, v, w) => [0, 1, 2].map((i) => f[0][i] + u * f[1][i] + v * f[2][i] + w * f[3][i]);
const area = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return s; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const parts = PARTS();
  for (const pt of parts) { const [u0, v0, u1, v1, r] = pt.r, b = Math.min(pt.b || 1.4, r * 0.8 + 0.6); pt.ring = rrect(u0, v0, u1, v1, r, 5); pt.inner = rrect(u0 + b, v0 + b, u1 - b, v1 - b, Math.max(0, r - b), 5); pt.f = pt.f || AX; }
  const world = (pt, q, w, a) => { const p = wpt(pt.f, q.u, q.v, w); return pt.m ? MOVE(p, a) : p; };
  const all = [];
  for (const a of [REST, AMAX[0], AMAX[2]]) for (const pt of parts) for (const w of pt.w) for (const q of pt.ring) all.push(world(pt, q, w, a));
  const C0 = Cam(45, 0.5, 1); fit(C0, all, 200, 160);
  const P0 = proj(C0), sp = all.map((p) => P0(...p));
  const W0 = Math.max(...sp.map((p) => p[0])) - Math.min(...sp.map((p) => p[0])), H0 = Math.max(...sp.map((p) => p[1])) - Math.min(...sp.map((p) => p[1]));
  const C = Cam(45, 0.5, Math.min(330 / W0, 262 / H0)); fit(C, all, 200, 162);
  const P = proj(C);
  const ref = Math.sign(area(rrect(0, 0, 10, 10, 2, 2).map((q) => P(q.u, q.v, 0))));
  const g = mk("g", {}, svg);
  for (const pt of parts) { pt.el = solid(g); if (pt.hi) pt.el.sil.classList.add("hi"); }
  function draw(pt, a) {
    const top = pt.ring.map((q) => P(...world(pt, q, pt.w[1], a))), bot = pt.ring.map((q) => P(...world(pt, q, pt.w[0], a)));
    const up = Math.sign(area(top)) === ref;
    pt.el.sil.setAttribute("d", poly(hull(top.concat(bot))));
    pt.el.cr.setAttribute("d", poly(pt.inner.map((q) => P(...world(pt, q, up ? pt.w[1] : pt.w[0], a)))));
  }
  for (const pt of parts) draw(pt, REST);
  const ang = spring(REST);
  let last = REST;
  const B = register(stage, (dt) => {
    const moving = stepS(ang, dt);
    if (ang.x !== last) { last = ang.x; for (const pt of parts) if (pt.m) draw(pt, ang.x); }
    return moving;
  });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { ang.t = REST; read.textContent = "rest"; }
    else { const t = clamp((p[0] - 90) / 220, 0, 1); ang.t = lerp(REST, amax, t); read.textContent = Math.round(Math.abs(ang.t)) + "°"; }
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; }, destroy: bag.dispose };
}


const REST = 14, AMAX = [45, 70, 95];
const MOVE = (p, a) => rotX(p, 0, 16, a);
const PARTS = () => [
  { r: [0, 0, 84, 52, 4], w: [0, 16] },
  { r: [0, 0, 84, 52, 3], w: [16, 18.5], m: 1, hi: 1 },
  { r: [40, 1.5, 44, 50.5, 1], w: [18.5, 20], m: 1 },
];

hairline({
  name: "coldframe",
  means: "A cold frame bed with a glazed lid hinged at the back: the pointer's place across it tilts the lid open.",
  rules: [1, 3, 5, 8],
  range: [45, 70, 95],
  tour: [[151, 219], [230, 200], [300, 190], null],
  mount,
});
