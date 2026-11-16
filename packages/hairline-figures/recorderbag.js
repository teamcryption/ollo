/**
 * Cymbal stand: a tripod with a tall pole and a cymbal on the tilter at its
 * top. The pointer tips the cymbal toward itself, bright, the bell and rim
 * leaning as one plate. At rest it sits tilted toward the drummer. The
 * slider is the tilt's reach.
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
const PZ = 104, R = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-52, -52, 0], [52, 52, 0], [-50, -50, PZ + 30], [50, 50, PZ + 30], [-50, 50, PZ], [50, -50, PZ]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const S = (pts) => pts.map((p) => P(p[0], p[1], p[2]));
  const tube = (a, b, r) => { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]; let all = []; for (let i = 0; i <= 4; i++) all = all.concat(disk(a.map((v, j) => v + (d[j] * i) / 4), d, r, 12)); return poly(hull(S(all))); };
  const hub = [0, 0, 30], legs = [0, 120, 240].map((t) => [44 * Math.cos(rad(t + 15)), 44 * Math.sin(rad(t + 15)), 0]);
  legs.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  mk("path", { d: tube(legs[0], hub, 1.8) }, g);
  mk("path", { d: tube([0, 0, 0], [0, 0, PZ - 6], 2.6) }, g);
  mk("path", { d: tube([0, 0, 26], [0, 0, 36], 4.2) }, g);
  mk("path", { d: tube(legs[1], hub, 1.8) }, g);
  mk("path", { d: tube(legs[2], hub, 1.8) }, g);
  mk("path", { d: tube([0, 0, PZ - 10], [0, 0, PZ - 2], 4) }, g);
  const plate = mk("path", { class: "sil hi" }, g), groove = mk("path", { class: "nf lo" }, g), bell = mk("path", { class: "nf" }, g);
  const tx = spring(-9), ty = spring(-12);
  let last = "", on = false;
  function draw() {
    const key = tx.x.toFixed(3) + ty.x.toFixed(3) + amp + on;
    if (key === last) return; last = key;
    const n = nrm([Math.sin(rad(tx.x)), Math.sin(rad(ty.x)), 1]), c = [0, 0, PZ], at = (h) => c.map((v, j) => v + n[j] * h);
    plate.setAttribute("d", poly(hull(S(disk(at(0), n, R, 48).concat(disk(at(4), n, 14, 20), disk(at(1.2), n, R - 1, 48))))));
    groove.setAttribute("d", open(S(arc(disk(at(2.6), n, 28, 48)))) + open(S(arc(disk(at(1.6), n, 40, 48)))));
    bell.setAttribute("d", poly(hull(S(disk(at(4), n, 13, 24).concat(disk(at(8), n, 9, 20), disk(at(10), n, 3, 12))))));
    read.textContent = on ? Math.round(Math.hypot(tx.x, ty.x)) + "°" : "rest";
  }
  const B = register(stage, (dt) => { const a = stepS(tx, dt), b = stepS(ty, dt); draw(); return a || b; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const w = unproj(C, sx, sy, PZ), d = Math.hypot(w[0], w[1]) || 1, m = clamp(d / R, 0, 1) * amp;
      tx.t = (w[0] / d) * m; ty.t = (w[1] / d) * m; on = true; B.wake();
    },
    leave: () => { tx.t = -9; ty.t = -12; on = false; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { amp = v; last = ""; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "recorderbag",
  means: "A cymbal on a tripod stand: the cymbal tips toward the pointer on its tilter, bell and rim leaning as one plate.",
  rules: [1, 3, 5, 8],
  range: [0, 24, 34],
  tour: [[150, 110], [200, 152], [250, 110], null],
  mount,
});
