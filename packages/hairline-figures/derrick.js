/**
 * Derrick: a guy derrick, a tall mast held by four guy ropes to ground
 * anchors, and a long boom hinged at the mast foot with a topping lift from
 * the mast head and a hook on its rope. The pointer on the ground is where
 * the load should go: the boom slews round the mast to face it and luffs,
 * steep for a near spot, low for a far one. At rest the hook block is the
 * bright mark. The slider sets how far the boom swings from rest.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MH = 78, FZ = 8, LEN = 86, REST_A = 70, REST_E = 38, ROPE = 22, GR = 52;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let K = value / 100;
  const C = Cam(45, 0.5, 1.75);
  const ext = [[0, 0, MH + 4]];
  for (let a = 0; a < 360; a += 45) { ext.push([GR * Math.cos(rad(a)), GR * Math.sin(rad(a)), 0]); for (const e of [20, 64]) { const h = LEN * Math.cos(rad(e)); ext.push([h * Math.cos(rad(a)), h * Math.sin(rad(a)), FZ + LEN * Math.sin(rad(e))]); } }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 2, b = 0.8) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(par), prism(P, front, o, i, z0, z1)); };
  const guys = [45, 135, 225, 315].map((a) => [GR * Math.cos(rad(a)), GR * Math.sin(rad(a))]);
  const far = mk("g", {}, g), boomBack = mk("g", {}, g), mastG = mk("g", {}, g), boomFront = mk("g", {}, g), near = mk("g", {}, g);
  for (const [x, y] of guys) {
    const par = x + y > 0 ? near : far;
    mk("path", { d: open([P(0, 0, MH), P(x, y, 3)]), class: "nf lo" }, par);
    box(par, x - 4, y - 4, x + 4, y + 4, 0, 3, 2, 0.8);
  }
  box(mastG, -9, -9, 9, 9, 0, 5, 3, 1.2);
  put(solid(mastG), prism(P, front, disc(0, 0, 2.8), disc(0, 0, 2), 5, MH));
  put(solid(mastG), prism(P, front, disc(0, 0, 4.2), disc(0, 0, 3.2), MH - 2, MH + 2));

  const bg = mk("g", {}, boomFront);
  const lift = mk("path", { class: "nf lo" }, bg);
  const boom = mk("path", { class: "sil" }, bg), crease = mk("path", { class: "nf lo" }, bg);
  const rope = mk("path", { class: "dash nf" }, bg), hook = solid(bg);
  const sa = spring(REST_A), se = spring(REST_E);
  let last = "", side = 1;

  function draw() {
    const a = rad(sa.x), e = rad(se.x), key = sa.x.toFixed(2) + se.x.toFixed(2);
    if (key === last) return;
    last = key;
    const s1 = Math.cos(a) + Math.sin(a) >= 0 ? 1 : 0;
    if (s1 !== side) { side = s1; (s1 ? boomFront : boomBack).appendChild(bg); }
    const d = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
    const s = [-Math.sin(a), Math.cos(a), 0], u = [-Math.sin(e) * Math.cos(a), -Math.sin(e) * Math.sin(a), Math.cos(e)];
    const at = (t, b, c, w) => P(t * d[0] + b * w * s[0] + c * w * u[0], t * d[1] + b * w * s[1] + c * w * u[1], FZ + t * d[2] + b * w * s[2] + c * w * u[2]);
    const pts = [];
    for (const t of [0, LEN]) for (const b of [-0.5, 0.5]) for (const c of [-0.5, 0.5]) pts.push(at(t, b, c, t ? 4 : 9));
    boom.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", open([at(3, 0, 0.3, 8), at(LEN - 3, 0, 0.3, 4)]));
    const tip = [LEN * d[0], LEN * d[1], FZ + LEN * d[2] - 2];
    lift.setAttribute("d", open([P(0, 0, MH), P(...tip)]));
    const hz = Math.max(4, tip[2] - ROPE);
    rope.setAttribute("d", open([P(...tip), P(tip[0], tip[1], hz + 6)]));
    const [o, i] = rings(tip[0] - 3.5, tip[1] - 3.5, tip[0] + 3.5, tip[1] + 3.5, 1.5, 0.8);
    put(hook, prism(P, front, o, i, hz, hz + 6));
  }

  const B = register(stage, (dt) => { const m = [stepS(sa, dt), stepS(se, dt)].some(Boolean); draw(); return m; });
  bag.add(B.unregister);

  let on = null, tgt = null;
  function aim(p) {
    tgt = p;
    let ang = REST_A, el = REST_E;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      let dA = (Math.atan2(wy, wx) * 180) / Math.PI - REST_A;
      dA = ((dA + 540) % 360) - 180;
      ang = REST_A + clamp(dA, -170, 170) * K;
      el = REST_E + (clamp(74 - Math.hypot(wx, wy) * 0.6, 20, 64) - REST_E) * K;
    }
    sa.t = ang; se.t = el;
    const act = !!p;
    if (act !== on) { on = act; boom.classList.toggle("hi", act); hook.sil.classList.toggle("hi", !act); }
    read.textContent = act ? String(Math.round(((ang % 360) + 360) % 360)).padStart(3, "0") + "°" : "rest";
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { K = v / 100; aim(tgt); }, destroy: bag.dispose };
}

hairline({
  name: "derrick",
  means: "A guy derrick held by its guy ropes: the boom slews round the mast to face the pointer and luffs, steep for near, low for far.",
  rules: [1, 3, 5, 8],
  range: [30, 80, 100],
  tour: [[237, 255], [188, 181], [132, 246], null],
  mount,
});
