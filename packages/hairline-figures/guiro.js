/**
 * Guiro: a ridged gourd balanced on a post above a tray, with a scraper
 * stick lying across its back. The pointer slides the scraper along the
 * ridges and the gourd tilts toward it like a seesaw. At rest the scraper
 * is bright near the left end. The slider is the tilt's reach.
 */
const { Cam, circ, clamp, fit, facing, hull, poly, open, prism, proj, rings, spring, stepS, unproj, disposer, mk, pointer, put, register, solid, rad } = HL;

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

const L = 124, PZ = 34, prof = (t) => 4 + 12 * Math.pow(Math.sin(Math.PI * t), 0.6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-66, -24, 0], [66, 24, 0], [-62, 0, PZ + 44], [62, 0, PZ + 44], [-62, 0, PZ - 28], [62, 0, PZ - 28]], 200, 160);
  const P = proj(C), fr = facing(C), g = mk("g", {}, svg);
  const S = (pts) => pts.map((p) => P(p[0], p[1], p[2]));
  const [r0, r1] = rings(-64, -22, 64, 22, 9, 2);
  put(solid(g), prism(P, fr, r0, r1, 0, 4));
  put(solid(g), prism(P, fr, circ(4, 24), circ(3, 24), 4, PZ - 14));
  const body = mk("path", { class: "sil" }, g), ridges = mk("path", { class: "nf lo" }, g);
  const stick = mk("path", { class: "sil" }, g), knob = mk("path", { class: "nf" }, g);
  const s = spring(0.3, { k: 90, c: 17 }), active = { on: false };
  let last = "";

  function draw() {
    const a = rad(-(s.x - 0.5) * 2 * amp), d = [Math.cos(a), 0, Math.sin(a)], up = [-Math.sin(a), 0, Math.cos(a)];
    const ax = (t) => [d[0] * (t - 0.5) * L, 0, PZ + d[2] * (t - 0.5) * L];
    const key = a.toFixed(4) + s.x.toFixed(4);
    if (key === last) return; last = key;
    let all = [];
    for (let i = 0; i <= 16; i++) all = all.concat(disk(ax(i / 16), d, prof(i / 16), 24));
    body.setAttribute("d", poly(hull(S(all))));
    let rd = "";
    for (let t = 0.2; t < 0.81; t += 0.04) rd += open(S(arc(disk(ax(t), d, prof(t) + 0.2, 36))));
    ridges.setAttribute("d", rd);
    const c = ax(s.x).map((v, j) => v + up[j] * (prof(s.x) + 2.6));
    const e0 = [c[0] - 5, c[1] - 30, c[2] + 6], e1 = [c[0] + 5, c[1] + 30, c[2] - 3], sd = [10, 60, -9];
    let sp = [];
    for (let i = 0; i <= 6; i++) sp = sp.concat(disk(e0.map((v, j) => v + (sd[j] * i) / 6), sd, 2.2, 14));
    stick.setAttribute("d", poly(hull(S(sp))));
    knob.setAttribute("d", poly(hull(S(disk(e1, sd, 4, 18).concat(disk(e1.map((v, j) => v + sd[j] * 0.06), sd, 4, 18))))));
    read.textContent = active.on ? Math.round(-a * 57.3) + "°" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(); return m; });
  bag.add(B.unregister);
  function setOn(on) { active.on = on; last = ""; body.classList.toggle("hi", on); stick.classList.toggle("hi", !on); }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const w = unproj(C, sx, sy, PZ + 12); s.t = clamp((w[0] + L / 2) / L, 0.14, 0.86); setOn(true); B.wake(); },
    leave: () => { s.t = 0.3; setOn(false); B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { amp = v; last = ""; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "guiro",
  means: "A ridged guiro balanced on a post: the scraper slides along its ridges to the pointer and the gourd tilts toward it.",
  rules: [1, 3, 5, 8],
  range: [0, 16, 24],
  tour: [[150, 140], [269, 183], [220, 172], null],
  mount,
});
