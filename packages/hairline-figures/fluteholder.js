/**
 * Flute stand: a round base with a peg, and a flute standing on it. The
 * pointer leans the flute toward itself, pivoting on the peg; tone holes
 * and the lip plate lean with it. At rest it leans back, bright. The
 * slider is the lean.
 */
const { Cam, clamp, fit, hull, poly, open, proj, spring, stepS, unproj, disposer, mk, pointer, register, rad } = HL;

const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const VW = [0.612, 0.612, 0.5];
function disk(c, n, r, m = 28) {
  n = nrm(n); const u = nrm(crs(n, Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = crs(n, u), out = [];
  for (let i = 0; i < m; i++) {
    const a = (i / m) * 2 * Math.PI, w = [0, 1, 2].map((j) => Math.cos(a) * u[j] + Math.sin(a) * v[j]);
    out.push([c[0] + r * w[0], c[1] + r * w[1], c[2] + r * w[2], w[0] * VW[0] + w[1] * VW[1] + w[2] * VW[2]]);
  }
  return out;
}
function arc(pts) {
  const n = pts.length; let s = pts.findIndex((p, i) => p[3] <= 0 && pts[(i + 1) % n][3] > 0);
  if (s < 0) s = 0; const out = [];
  for (let k = 1; k <= n; k++) { const p = pts[(s + k) % n]; if (p[3] > 0) out.push(p); else break; }
  return out;
}
const PZ = 26, R = 50, FL = 132;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-50, -50, FL], [50, 50, FL], [-50, 50, FL], [50, -50, FL]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const S = (pts) => pts.map((p) => P(p[0], p[1], p[2]));
  const tube = (a, b, r) => { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; let all = []; for (let i = 0; i <= 4; i++) all = all.concat(disk(a.map((v, j) => v + (d[j] * i) / 4), d, r, 12)); return poly(hull(S(all))); };
  mk("path", { d: poly(hull(S(disk([0, 0, 0], [0, 0, 1], 26, 40).concat(disk([0, 0, 5], [0, 0, 1], 26, 40))))) }, g);
  mk("path", { d: tube([0, 0, 5], [0, 0, PZ], 3) }, g);
  const plate = mk("path", { class: "sil hi" }, g), groove = mk("path", { class: "nf lo" }, g), bell = mk("path", { class: "nf" }, g);
  const tx = spring(-16), ty = spring(14);
  let last = "", on = false;
  function draw() {
    const key = tx.x.toFixed(3) + ty.x.toFixed(3) + amp + on;
    if (key === last) return; last = key;
    const n = nrm([Math.sin(rad(tx.x)), Math.sin(rad(ty.x)), 1]), c = [0, 0, PZ], at = (h) => c.map((v, j) => v + n[j] * h);
    plate.setAttribute("d", tube(c, at(FL), 5.5));
    let h = ""; for (const t of [0.3, 0.38, 0.46, 0.54, 0.62, 0.7]) { const q = at(t * FL), pd = nrm(VW.map((v, j) => v - n[j] * (VW[0] * n[0] + VW[1] * n[1] + VW[2] * n[2]))); h += poly(S(disk(q.map((v, j) => v + pd[j] * 5.4), pd, 1.8, 12))); }
    groove.setAttribute("d", h + open(S(arc(disk(at(0.2 * FL), n, 5.7, 24)))) + open(S(arc(disk(at(0.8 * FL), n, 5.7, 24)))));
    const e = at(0.9 * FL); bell.setAttribute("d", poly(hull(S(disk(e, n, 6.6, 20).concat(disk(at(0.93 * FL), n, 6.6, 20))))));
    read.textContent = on ? Math.round(Math.hypot(tx.x, ty.x)) + "°" : "rest";
  }
  const B = register(stage, (dt) => { const a = stepS(tx, dt), b = stepS(ty, dt); draw(); return a || b; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const w = unproj(C, sx, sy, 60), d = Math.hypot(w[0], w[1]) || 1, m = clamp(d / R, 0, 1) * amp;
      tx.t = (w[0] / d) * m; ty.t = (w[1] / d) * m; on = true; B.wake();
    },
    leave: () => { tx.t = -16; ty.t = 14; on = false; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { amp = v; last = ""; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "fluteholder",
  means: "A flute standing on a peg stand: it leans toward the pointer, pivoting on the peg, tone holes leaning with it.",
  rules: [1, 3, 5, 8],
  range: [0, 14, 20],
  tour: [[160, 120], [200, 158], [240, 120], null],
  mount,
});
