/**
 * Rattle: a baby's rattle, a round head on a short handle with a ring grip,
 * standing on its ring. The pointer's place left or right swings it over on
 * its ring,, the shake. At rest it
 * leans a little left; the head is the bright mark. The slider is how far it
 * may swing.
 *
 * The pattern: one object answering where (a spring), hit by screen x.
 */
const { Cam, fit, hull, open, poly, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const REST = -12, V = [0.612, 0.612, 0.5], RC = 21, BZ = 92, BR = 19;
const circle = (f, n = 32) => { const o = []; for (let i = 0; i < n; i++) o.push(f((i / n) * Math.PI * 2)); return o; };
const sphere = (z, r) => { const o = []; for (let j = 0; j <= 8; j++) { const b = (j / 8) * Math.PI - Math.PI / 2; o.push(...circle((a) => [r * Math.cos(b) * Math.cos(a), r * Math.cos(b) * Math.sin(a), z + r * Math.sin(b)], 24)); } return o; };
const tube = (z0, z1, r) => circle((a) => [r * Math.cos(a), r * Math.sin(a), z0], 16).concat(circle((a) => [r * Math.cos(a), r * Math.sin(a), z1], 16));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  const rot = ([x, y, z], th) => { const c = Math.cos(th), s = Math.sin(th); return [x, y * c - z * s, y * s + z * c]; };
  const ball = sphere(BZ, BR), ringO = circle((a) => [0, (RC) * Math.sin(a), RC + RC * Math.cos(a)]);
  const ext = [];
  for (const d of [-44, 0, 44]) for (const p of ball.concat(ringO)) ext.push(rot(p, rad(d)));
  fit(C, ext, 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const ring = mk("path", { class: "sil" }, g), ringCr = mk("path", { class: "nf lo" }, g);
  const handle = mk("path", { class: "sil" }, g), collar = mk("path", { class: "sil" }, g), collarCr = mk("path", { class: "nf lo" }, g);
  const head = mk("path", { class: "sil hi" }, g), bands = mk("path", { class: "nf lo" }, g);
  const tilt = spring(REST);
  let last = NaN;

  function band(z, th) {
    const r = Math.sqrt(BR * BR - (z - BZ) ** 2);
    const pts = circle((a) => [r * Math.cos(a), r * Math.sin(a), z], 48).map((p) => rot(p, th));
    const ctr = rot([0, 0, BZ], th);
    const vis = pts.map((p) => (p[0] - ctr[0]) * V[0] + (p[1] - ctr[1]) * V[1] + (p[2] - ctr[2]) * V[2] > 0);
    const s = vis.indexOf(false);
    if (s < 0) return "";
    const run = [];
    for (let i = 1; i <= 48; i++) { const k = (s + i) % 48; if (vis[k]) run.push(P(...pts[k])); }
    return run.length > 1 ? open(run) : "";
  }

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg), W = (p) => P(...rot(p, th));
    const outer = [], inner = [];
    for (const x of [-3, 3]) outer.push(...circle((a) => [x, (RC) * Math.sin(a), RC + RC * Math.cos(a)]).map(W));
    for (let i = 31; i >= 0; i--) { const a = (i / 32) * Math.PI * 2; inner.push(W([0, 14 * Math.sin(a), RC + 14 * Math.cos(a)])); }
    ring.setAttribute("d", poly(hull(outer)) + poly(inner));
    ringCr.setAttribute("d", poly(circle((a) => [3, 17.5 * Math.sin(a), RC + 17.5 * Math.cos(a)]).map(W)));
    handle.setAttribute("d", poly(hull(tube(RC * 2 - 2, 70, 3.6).map(W))));
    collar.setAttribute("d", poly(hull(tube(68, 74, 7.5).map(W))));
    collarCr.setAttribute("d", poly(circle((a) => [6.3 * Math.cos(a), 6.3 * Math.sin(a), 74], 16).map(W)));
    head.setAttribute("d", poly(hull(ball.map(W))));
    bands.setAttribute("d", band(BZ - 6, th) + band(BZ + 6, th));
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(Math.round(tilt.x * 100) / 100); return m; });
  bag.add(B.unregister);
  const ox = P(0, 0, 0)[0];
  function aim(p) {
    if (!p) { tilt.t = REST; read.textContent = "rest"; B.wake(); return; }
    const d = Math.round(clamp((p[0] - ox) / 45, -1, 1) * reach);
    tilt.t = d;
    read.textContent = (d >= 0 ? "+" : "") + d + "°";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rattle",
  means: "A baby's rattle on its ring grip: it swings over toward the pointer's side and back, a shake.",
  rules: [3, 5, 8, 9],
  range: [12, 30, 44],
  tour: [[249, 46], [140, 200], [300, 120], null],
  mount,
});
