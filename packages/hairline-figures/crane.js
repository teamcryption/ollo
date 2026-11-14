/**
 * Crane: a mobile crane on a truck, outriggers down on pads, a turntable
 * behind the cab and a boom with a hook on its rope. The pointer on the
 * ground is where the load should go: the boom slews to face it and luffs,
 * steep when the spot is near, low when it is far. At rest the boom stands
 * over the rear quarter and the hook block is the bright mark. The slider
 * telescopes the boom.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 30, PY = 15, PZ = 23, REST_A = 130, REST_E = 42, ROPE = 26;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let L = value;
  const C = Cam(45, 0.5, 1.85);
  const ext = [[-4, -16, 0], [96, -16, 0], [96, 46, 0], [-4, 46, 0], [90, 20, 36]];
  for (const a of [0, 90, 180, 210]) for (const e of [24, 66]) {
    const h = 92 * Math.cos(rad(e));
    ext.push([PX + h * Math.cos(rad(a)), PY + h * Math.sin(rad(a)), PZ + 92 * Math.sin(rad(e))]);
  }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 3, b = 1.2) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const pad = (x, y) => put(solid(g), prism(P, front, disc(x, y, 6), disc(x, y, 4.6), 0, 2));

  // far outriggers, then the chassis, then the near ones
  for (const x of [8, 62]) { pad(x, -12); box(x - 2, -12, x + 2, 0, 2, 12, 1.5, 0.6); box(x - 3, -12, x + 3, 0, 9, 13, 1.5, 0.6); }
  box(0, 0, 94, 30, 6, 16, 4, 1.5);
  for (const x of [14, 38, 80]) {
    const w = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; w.push(P(x + 7 * Math.cos(t), 30.2, 7 + 7 * Math.sin(t))); }
    mk("path", { d: poly(w) }, g);
    mk("path", { d: poly(w.map(([sx, sy], i) => [sx + (w[(i + 12) % 24][0] - sx) * 0.3, sy + (w[(i + 12) % 24][1] - sy) * 0.3])), class: "nf lo" }, g);
  }
  for (const x of [8, 62]) { box(x - 3, 30, x + 3, 42, 9, 13, 1.5, 0.6); pad(x, 42); box(x - 2, 40, x + 2, 44, 2, 12, 1.5, 0.6); }
  box(72, 2, 93, 28, 16, 34, 4, 1.5);
  mk("path", { d: poly([P(93, 6, 24), P(93, 24, 24), P(93, 24, 31), P(93, 6, 31)]), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(PX, PY, 12), disc(PX, PY, 10.5), 16, 21));
  box(PX - 22, PY - 8, PX - 10, PY + 8, 16, 26, 3, 1.2);

  const boom = mk("path", { class: "sil" }, g), crease = mk("path", { class: "nf lo" }, g);
  const rope = mk("path", { class: "dash nf" }, g), hook = solid(g);
  const sa = spring(REST_A), se = spring(REST_E), sl = spring(L);
  let last = "";

  function draw() {
    const a = rad(sa.x), e = rad(se.x), len = sl.x, key = [sa.x, se.x, len].map((v) => v.toFixed(2)).join();
    if (key === last) return;
    last = key;
    const d = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
    const s = [-Math.sin(a), Math.cos(a), 0], u = [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)];
    const at = (t, b, c, w = 6) => P(PX + t * d[0] + b * w * s[0] + c * w * u[0], PY + t * d[1] + b * w * s[1] + c * w * u[1], PZ + t * d[2] + b * w * s[2] + c * w * u[2]);
    const pts = [];
    for (const t of [-4, len]) for (const b of [-0.5, 0.5]) for (const c of [-0.5, 0.5]) pts.push(at(t, b, c, t < 0 ? 8 : 5));
    boom.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", open([at(2, 0, 0.32), at(len - 3, 0, 0.32, 5)]));
    const tip = [PX + len * d[0], PY + len * d[1], PZ + len * d[2] - 3];
    const hz = Math.max(4, tip[2] - ROPE);
    rope.setAttribute("d", open([P(...tip), P(tip[0], tip[1], hz + 5)]));
    const [o, i] = rings(tip[0] - 3, tip[1] - 3, tip[0] + 3, tip[1] + 3, 1.5, 0.8);
    put(hook, prism(P, front, o, i, hz, hz + 5));
  }

  const B = register(stage, (dt) => {
    const m = [stepS(sa, dt), stepS(se, dt), stepS(sl, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let ang = REST_A, el = REST_E;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      ang = (Math.atan2(wy - PY, wx - PX) * 180) / Math.PI;
      if (ang < -90) ang += 360;
      ang = clamp(ang, 0, 210);
      el = clamp(72 - Math.hypot(wx - PX, wy - PY) * 0.45, 24, 66);
    }
    sa.t = ang; se.t = el;
    const act = !!p;
    if (act !== on) { on = act; boom.classList.toggle("hi", act); hook.sil.classList.toggle("hi", !act); }
    read.textContent = act ? String(Math.round(ang)).padStart(3, "0") + "°" : "rest";
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { L = v; sl.t = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "crane",
  means: "A mobile crane on its outriggers: the boom slews to face the pointer and luffs, steep for a near spot, low for a far one.",
  rules: [1, 3, 5, 8],
  range: [60, 76, 92],
  tour: [[106, 279], [74, 178], [290, 280], null],
  mount,
});
