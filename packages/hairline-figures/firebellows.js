/**
 * Bellows: two paddle boards hinged at a brass nozzle. The pointer squeezes the top board shut. At rest it stands open, bright.
 */
const { Cam, fit, proj, hull, poly, spring, stepS, disposer, mk, pointer, register, rad } = HL;

function cylPts(a, b, r1, r2) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d) || 1, w = d.map((q) => q / L);
  const t = Math.abs(w[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [w[1] * t[2] - w[2] * t[1], w[2] * t[0] - w[0] * t[2], w[0] * t[1] - w[1] * t[0]];
  const ul = Math.hypot(...u); u = u.map((q) => q / ul);
  const v = [w[1] * u[2] - w[2] * u[1], w[2] * u[0] - w[0] * u[2], w[0] * u[1] - w[1] * u[0]], out = [];
  for (let i = 0; i < 24; i++) {
    const c = Math.cos((i / 24) * 2 * Math.PI), s = Math.sin((i / 24) * 2 * Math.PI);
    for (const [p, r] of [[a, r1], [b, r2]]) out.push([0, 1, 2].map((j) => p[j] + r * (c * u[j] + s * v[j])));
  }
  return out;
}
function boxPts(c, s) {
  const out = [];
  for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) out.push([c[0] + i * s[0] / 2, c[1] + j * s[1] / 2, c[2] + k * s[2] / 2]);
  return out;
}
const shapePts = (h) => (h[0] === "box" ? boxPts(h[1], h[2]) : cylPts(h[1], h[2], h[3], h[4] ?? h[3]));
function turn(p, piv, ax, th) {
  const c = Math.cos(th), s = Math.sin(th), q = [p[0] - piv[0], p[1] - piv[1], p[2] - piv[2]];
  let r;
  if (ax === "x") r = [q[0], q[1] * c - q[2] * s, q[1] * s + q[2] * c];
  else if (ax === "y") r = [q[0] * c + q[2] * s, q[1], -q[0] * s + q[2] * c];
  else r = [q[0] * c - q[1] * s, q[0] * s + q[1] * c, q[2]];
  return [r[0] + piv[0], r[1] + piv[1], r[2] + piv[2]];
}

const STATIC = [["box",[0,0,2],[56,34,3]],["box",[-38,0,2],[22,8,3]],["cyl",[28,0,4],[50,0,4],4.5,1.6],["box",[6,0,6],[40,26,5]]];
const MOVING = [["box",[0,0,10],[56,34,3]],["box",[-38,0,10],[22,8,3]]];
const PIV = [28,0,8], AX = "y", REST = 20, ACT = 2, BRIGHT = 0, DZ = 1;
const HIT = [0,0,8], HITR = 110, ON_TXT = "puff";

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const parts = [...STATIC.map((h) => ({ h, mov: false, pts: shapePts(h) })), ...MOVING.map((h) => ({ h, mov: true, pts: shapePts(h) }))];
  const posed = (pt, th) => turn(pt, PIV, AX, th);
  const all = [];
  for (const p of parts) for (const q of p.pts) { all.push(q); if (p.mov) { all.push(posed(q, rad(REST))); all.push(posed(q, rad(ACT))); } }
  const C0 = Cam(45, 0.5, 1); fit(C0, all, 200, 160);
  const P0 = proj(C0), sp = all.map((q) => P0(...q));
  const w = Math.max(...sp.map((q) => q[0])) - Math.min(...sp.map((q) => q[0])), hgt = Math.max(...sp.map((q) => q[1])) - Math.min(...sp.map((q) => q[1]));
  const C = Cam(45, 0.5, Math.min(300 / w, 236 / hgt)); fit(C, all, 200, 162);
  const P = proj(C), g = mk("g", {}, svg);
  for (const p of parts) {
    p.el = mk("path", { class: "sil" }, g);
    p.mid = p.pts.reduce((m, q) => [m[0] + q[0] / p.pts.length, m[1] + q[1] / p.pts.length, m[2] + q[2] / p.pts.length], [0, 0, 0]);
  }
  parts[STATIC.length + BRIGHT].el.classList.add("hi");
  const ang = spring(REST);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const t = rad(th), keyed = parts.map((p) => {
      const m = p.mov ? posed(p.mid, t) : p.mid;
      p.el.setAttribute("d", poly(hull((p.mov ? p.pts.map((q) => posed(q, t)) : p.pts).map((q) => P(...q)))));
      return [m[0] + m[1] + m[2] * DZ + (p.h[5] || 0), p];
    });
    keyed.sort((a, b) => a[0] - b[0]).forEach(([, p]) => g.appendChild(p.el));
  }
  const B = register(stage, (dt) => { const mv = stepS(ang, dt); draw(ang.x); return mv; });
  bag.add(B.unregister);
  const ctr = P(...HIT);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    ang.t = a ? REST + (ACT - REST) * amt : REST;
    read.textContent = a ? ON_TXT : "rest";
    B.wake();
  }
  draw(REST);
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.hypot(sx - ctr[0], sy - ctr[1]) < HITR), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { ang.t = REST + (ACT - REST) * amt; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "firebellows",
  means: "Two paddle boards hinged at a nozzle: the pointer squeezes the open top board shut to puff air.",
  rules: [1, 3, 4, 5],
  range: [40, 75, 100],
  tour: [[176,153],[120,140],[230,170],null],
  mount,
});
