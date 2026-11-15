/**
 * Scissors: a pair of safety scissors lying on the desk, two halves on one
 * pivot screw, each a blade with a round-nosed tip and a finger loop. The
 * pointer is what they reach for: the pair swivels on a spring to aim at it
 * and the blades open around it. At rest they lie a little open, the screw
 * bright. The slider is how wide the blades open.
 */
const {
  Cam, fit, prism, proj, facing, fillet, circ, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid, flatDot, place, unproj,
} = HL;

const R = Math.PI / 180, BASE = -24, SW = 22, REST_W = 16, OPEN = 26;
const BLADE = [[54, 0], [40, 3], [6, 4.5], [-6, 5], [-14, 9], [-17, 4], [-7, -2.5], [6, -4], [44, -2.5]];
const BR = [2.6, 3, 4, 3, 2, 2, 3, 3, 3];
const LOOP = [-25, 11], LR = 9.5;
function ringOf(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
  const sg = a > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const pr = pts[(i - 1 + pts.length) % pts.length], nx = pts[(i + 1) % pts.length];
    const dx = nx[0] - pr[0], dy = nx[1] - pr[1], l = Math.hypot(dx, dy) || 1;
    return { u: p[0], v: p[1], nu: (sg * dy) / l, nv: (-sg * dx) / l };
  });
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.6);
  const ext = [];
  for (let k = 0; k < 24; k++) { const a = (BASE + (k / 23 - 0.5) * 2 * (SW + 40)) * R; ext.push([56 * Math.cos(a), 56 * Math.sin(a), 0]); }
  for (let k = 0; k < 24; k++) { const a = (180 + BASE + (k / 23 - 0.5) * 2 * (SW + 40)) * R; ext.push([38 * Math.cos(a), 38 * Math.sin(a), 6]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const flip = (pts, s) => pts.map(([u, v]) => [u, v * s]);
  const halves = [-1, 1].map((s, k) => {
    const blade = ringOf(fillet(flip(BLADE, s), BR, 3));
    const loop = circ(LR, 32).map((q) => ({ ...q, u: q.u + LOOP[0], v: q.v + LOOP[1] * s }));
    const hole = circ(LR - 3.5, 32).map((q) => ({ ...q, u: q.u + LOOP[0], v: q.v + LOOP[1] * s }));
    const grp = mk("g", {}, g);
    return { s, z: 1 + k * 2, blade, loop, hole, grp, L: solid(grp), B: solid(grp), H: solid(grp) };
  });
  const screw = flatDot(g, C, 2.2, "dot");
  const aim = spring(BASE), open = spring(REST_W);
  let drawn = "";

  function turn(ring, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
  }
  function draw() {
    const key = aim.x.toFixed(3) + open.x.toFixed(3);
    if (key === drawn) return;
    drawn = key;
    for (const h of halves) {
      const a = (aim.x - h.s * open.x) * R;
      put(h.L, prism(P, front, turn(h.loop, a), null, h.z, h.z + 2));
      put(h.B, prism(P, front, turn(h.blade, a), null, h.z, h.z + 2));
      put(h.H, prism(P, front, turn(h.hole, a), null, h.z + 1.9, h.z + 2));
    }
    place(screw, P(0, 0, 5.2));
  }

  const Bk = register(stage, (dt) => {
    const m1 = stepS(aim, dt), m2 = stepS(open, dt);
    draw();
    return m1 || m2;
  });
  bag.add(Bk.unregister);

  function hi(on) {
    for (const h of halves) { h.B.sil.classList.toggle("hi", on); h.L.sil.classList.toggle("hi", on); }
    screw.setAttribute("class", on ? "dot m" : "dot");
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
      const ang = Math.atan2(y, x) / R, rel = ((ang - BASE + 540) % 360) - 180;
      if (d < 10 || d > 90 || Math.abs(rel) > 90) { aim.t = BASE; open.t = REST_W; hi(false); read.textContent = "rest"; }
      else {
        aim.t = BASE + clamp(rel, -SW, SW);
        open.t = clamp(REST_W + OPEN * value * (1 - clamp((d - 20) / 60, 0, 0.8)), REST_W, 40);
        hi(true);
        read.textContent = Math.round(open.t * 2) + "°";
      }
      Bk.wake();
    },
    leave: () => { aim.t = BASE; open.t = REST_W; hi(false); read.textContent = "rest"; Bk.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  hi(false);
  read.textContent = "rest";
  draw();
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "scissors",
  means: "Safety scissors on a desk: they swivel to aim at the pointer and their blades open around it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[269, 185], [300, 150], [269, 236], null],
  mount,
});
