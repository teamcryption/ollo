/**
 * Soda maker: a slim column on a drip base, a head with a press button,
 * and a tall bottle locked under it. The bottle tilts out forward on its
 * foot hinge to be swapped; how far follows the pointer from back to
 * front. At rest the bottle leans out a touch, bright. The slider is the
 * widest tilt.
 *
 * The pattern: one part swinging on a hinge, hit on the ground plane.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 13, D = 22, H = 72, REST = 0.1, PY = 11, PZ = 5;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PROF = [[10, 5], [11, 9], [11, 38], [8, 46], [4.5, 51], [4.5, 55], [5, 56], [5, 60]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxa = (value / 100) * 0.75 + 0.1;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-W, -D, 0], [W, D + 30, 0], [W, -D, 0], [-W, D + 30, 0], [0, -D, H + 6], [0, D + 34, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the drip base, the column at the back, the head over the bottle
  const [br, bi] = rings(-W, -D, W, D, 7, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(0, PY - 11, 9, 28), 5)) }, g);
  const [cr, ci] = rings(-W + 1, -D + 1, W - 1, -D + 13, 5, 1.4);
  put(solid(g), prism(P, front, cr, ci, 5, H));
  const [hr, hi] = rings(-W + 1, -D + 1, W - 1, 6, 6, 1.4);
  put(solid(g), prism(P, front, hr, hi, H - 11, H));
  const [kr, ki] = rings(-5, -D + 4, 5, -D + 12, 3, 1);
  put(solid(g), prism(P, front, kr, ki, H, H + 3));
  // the bottle: a lathe profile, rings tilted about its foot hinge
  const sil = mk("path", { class: "sil hi" }, g), bands = mk("path", { class: "nf lo" }, g);
  const rot = ([x, y, z], a) => {
    const dy = y - PY, dz = z - PZ;
    return [x, PY + dy * Math.cos(a) + dz * Math.sin(a), PZ - dy * Math.sin(a) + dz * Math.cos(a)];
  };
  const ringW = (r, z) => disc(0, PY - 11, r, 28).map((q) => [q.u, q.v, z]);
  const shell = PROF.map(([r, z]) => ringW(r, z));
  const marks = [ringW(11, 14), ringW(11, 32), ringW(5, 56)];
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pr = (p) => P(...rot(p, a));
    sil.setAttribute("d", poly(hull(shell.flat().map(pr))));
    bands.setAttribute("d", marks.map((m) => poly(m.map(pr))).join(""));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.abs(x) > W + 12 || y < -D - 8 || y > D + 34) return leave();
    const t = clamp((y + D) / (2 * D + 20), 0, 1);
    ang.t = REST + (0.3 + 0.7 * t) * (maxa - REST);
    read.textContent = "tilt " + Math.round((ang.t * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxa = (v / 100) * 0.75 + 0.1; }, destroy: bag.dispose };
}

hairline({
  name: "sodamaker",
  means: "A soda maker: the bottle under the head tilts out forward on its foot hinge, further as the pointer comes to the front.",
  rules: [1, 3, 5, 8],
  range: [0, 100, 100],
  tour: [[240, 240], [189, 269], [150, 288], null],
  mount,
});
