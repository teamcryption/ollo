/**
 * Cant hook: a long-handled lever with a hinged hook, set against a log on a
 * slab. The pointer sets the lever: as it moves across, the handle swings
 * down over the log to roll it. At rest the handle leans up, its hook bright.
 * The slider is how quickly the lever follows.
 *
 * The pattern: a continuous angle on a spring; the hit is on the ground plane.
 */
const { Cam, fit, proj, facing, circ, rings, prism, put, solid, mk, poly, hull, rrect, spring, stepS, register, pointer, disposer, unproj, clamp, lerp, rad } = HL;

const PV = [-15, 0, 18], LEN = 96, REST = 70, HI = 100, LO = 22;

function beam(P, a, b, w, h, up) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d) || 1, D = d.map((x) => x / n);
  let s = [D[1] * up[2] - D[2] * up[1], D[2] * up[0] - D[0] * up[2], D[0] * up[1] - D[1] * up[0]];
  const sn = Math.hypot(...s) || 1; s = s.map((x) => x / sn);
  const t = [s[1] * D[2] - s[2] * D[1], s[2] * D[0] - s[0] * D[2], s[0] * D[1] - s[1] * D[0]];
  const ring = rrect(-w / 2, -h / 2, w / 2, h / 2, Math.min(w, h) * 0.45, 4);
  const at = (o) => ring.map((q) => P(...[0, 1, 2].map((j) => o[j] + q.u * s[j] + q.v * t[j])));
  return [poly(hull(at(a).concat(at(b)))), poly(at(b))];
}

function pose(th) {
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  const E = [PV[0] - LEN * c, 0, PV[2] + LEN * s];
  const k1 = [PV[0] - 12 * c, 0, PV[2] + 12 * s];
  const hk = [k1[0] + 22 * s + 6 * c, 0, k1[2] + 22 * c - 6 * s];
  const tip = [hk[0] + 10 * c, 0, hk[2] - 10 * s];
  return { E, k1, hk, tip };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.8);
  const ex = [[-70, -50, -5], [50, 50, -5], [50, -50, -5], [-70, 50, -5]];
  for (const th of [LO, REST, HI]) { const q = pose(th); ex.push(q.E, q.hk); }
  fit(C, ex, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-70, -50, 50, 50, 12, 2);
  put(solid(g), prism(P, front, gr, gi, -5, 0));
  const [lg, le] = beam(P, [2, -46, 16], [2, 4, 16], 32, 32, [0, 0, 1]);
  mk("path", { class: "sil", d: lg }, g);
  mk("path", { class: "nf lo", d: le }, g);
  mk("path", { class: "nf lo", d: poly(circ(5, 16).map((q) => P(2 + q.u, 4, 16 + q.v))) }, g);
  const handle = mk("path", { class: "sil" }, g), hookA = mk("path", { class: "sil hi" }, g), hookB = mk("path", { class: "sil hi" }, g);
  const th = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "";
  function draw() {
    const key = th.x.toFixed(2);
    if (key === last) return;
    last = key;
    const q = pose(th.x), up = [0, 1, 0];
    handle.setAttribute("d", beam(P, [PV[0], 8, PV[2]].map((v, j) => (j === 1 ? 8 : v)), [q.E[0], 8, q.E[2]], 5, 6, up)[0]);
    hookA.setAttribute("d", beam(P, [q.k1[0], 8, q.k1[2]], [q.hk[0], 8, q.hk[2]], 3.5, 4, up)[0]);
    hookB.setAttribute("d", beam(P, [q.hk[0], 8, q.hk[2]], [q.tip[0], 8, q.tip[2]], 3.5, 4, up)[0]);
  }
  const L = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(L.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -110 || x > 80 || Math.abs(y) > 80) { th.t = REST; read.textContent = "rest"; }
      else { th.t = lerp(HI, LO, clamp((x + 90) / 140, 0, 1)); read.textContent = `lever ${Math.round(th.t)}°`; }
      L.wake();
    },
    leave: () => { th.t = REST; read.textContent = "rest"; L.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return { set: (v) => { th.k = 100 * v; th.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "peavey",
  means: "A cant hook set against a log: the pointer sets the lever, and the long handle swings down over the log to roll it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[264, 255], [130, 188], null],
  mount,
});
