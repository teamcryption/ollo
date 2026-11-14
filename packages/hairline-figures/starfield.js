/**
 * Star chart dome: a planetarium dome on a round plinth, its sky drawn as
 * meridians and stars. The dome turns to the pointer's bearing round it,
 * on a spring, so the meridians and stars sweep across its face; the pole
 * star stays put, bright. The slider is how far one lap of the pointer
 * turns the sky.
 *
 * The pattern: one continuous reading (dial).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid, place,
} = HL;

const R = 42, B0 = 7, NM = 8;
const V = [Math.cos(Math.PI / 4) * 0.866, Math.sin(Math.PI / 4) * 0.866, 0.5];
const STARS = [[0.3, 0.2], [1.1, 0.5], [1.9, 0.3], [2.6, 0.9], [3.3, 0.4], [4.0, 0.7], [4.6, 0.25], [5.4, 0.55], [0.8, 1.0], [2.2, 0.75], [3.8, 1.05], [5.9, 0.9], [1.5, 0.15], [4.9, 1.1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-R - 6, -R - 6, 0], [R + 6, R + 6, 0], [R + 6, -R - 6, 0], [-R - 6, R + 6, 0], [0, 0, B0 + R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R + 6, 48), circ(R + 3.5, 48), 0, B0));
  const sph = (a, t) => [R * Math.cos(t) * Math.cos(a), R * Math.cos(t) * Math.sin(a), B0 + R * Math.sin(t)];
  const vis = (q) => (q[0] * V[0] + q[1] * V[1] + (q[2] - B0) * V[2]) > 0;
  const shell = [];
  for (let i = 0; i <= 10; i++) { const t = (i / 10) * (Math.PI / 2); shell.push(...ringAt(P, circ(R * Math.cos(t), 48), B0 + R * Math.sin(t))); }
  mk("path", { d: poly(hull(shell)), class: "sil" }, g);
  // parallels stay still
  let par = "";
  for (const t of [0.45, 0.9]) { const pts = []; for (let i = 0; i <= 48; i++) { const q = sph((i / 48) * 2 * Math.PI, t); pts.push(vis(q) ? P(...q) : null); } let run = []; for (const p of pts.concat([null])) { if (p) run.push(p); else { if (run.length > 1) par += open(run); run = []; } } }
  mk("path", { d: par, class: "nf lo" }, g);
  const mer = mk("path", { class: "nf lo" }, g);
  const stars = STARS.map(() => mk("circle", { r: 1.7, class: "dot m" }, g));
  const pole = mk("circle", { r: 2.6, class: "dot" }, g);
  place(pole, P(0, 0, B0 + R));

  let last = NaN;
  function draw(rot) {
    if (rot === last) return;
    last = rot;
    let d = "";
    for (let k = 0; k < NM; k++) {
      const a = rot + (k / NM) * 2 * Math.PI;
      let run = [];
      for (let i = 0; i <= 14; i++) { const q = sph(a, (i / 14) * (Math.PI / 2 - 0.12)); if (vis(q)) run.push(P(...q)); else { if (run.length > 1) d += open(run); run = []; } }
      if (run.length > 1) d += open(run);
    }
    mer.setAttribute("d", d);
    STARS.forEach(([a, t], i) => { const q = sph(a + rot, t); place(stars[i], P(...q)); stars[i].setAttribute("r", vis(q) && q[2] > B0 + 4 ? 1.7 : 0); });
  }
  const sp = spring(0.35);
  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(L.unregister);
  draw(0.35);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    let tgt = 0.35 + Math.atan2(y, x) * gain;
    const hrs = (((tgt / (2 * Math.PI)) * 24) % 24 + 24) % 24;
    sp.t = tgt;
    read.textContent = Math.floor(hrs) + "h";
    L.wake();
  }
  function leave() { sp.t = 0.35; read.textContent = "rest"; L.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.5, 1.8); }, destroy: bag.dispose };
}

hairline({
  name: "starfield",
  means: "A planetarium dome: its meridians and stars turn to the pointer's bearing around it, sweeping across the face while the pole star holds.",
  rules: [3, 5, 8],
  range: [0.5, 1.5, 1.8],
  tour: [[296, 196], [200, 228], [108, 196], null],
  mount,
});
