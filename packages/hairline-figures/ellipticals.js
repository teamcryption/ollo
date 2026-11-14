/**
 * Elliptical: a cross-trainer on a long rail, a flywheel housing at the
 * front, two pedal plates and two tall handles. The pointer's place along the
 * machine is the stride: one pedal slides forward as its handle swings back,
 * the other the opposite way, on a spring. At rest the stride is part-way
 * through, the near handle bright. The slider is the stride's length.
 *
 * The pattern: a continuous input driving a linkage (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 9, PIV = [-40, 66], REST = 0.45;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-60, -14, 0], [62, 14, 0], [-60, 14, 0], [62, -14, 0], [-56, 0, 104], [-10, 0, 104]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-60, -14, 62, 14, 6, 2);
  put(solid(g), prism(P, front, rr, ri, 0, 4));
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(b[0], b[1], r), b[2]))));
  const side = (y) => ({ arm: mk("path", { class: "sil" }, g), pedal: mk("path", { class: "sil" }, g), y });
  const far = side(-W);
  // the front: flywheel housing and column, in the middle plane
  const fw = [];
  for (const y of [-5, 5]) for (let i = 0; i < 28; i++) { const t = (i / 28) * 2 * Math.PI; fw.push(P(-44 + 17 * Math.cos(t), y, 22 + 17 * Math.sin(t))); }
  mk("path", { d: poly(hull(fw)) }, g);
  const cap = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * 2 * Math.PI; cap.push(P(-44 + 12 * Math.cos(t), 5, 22 + 12 * Math.sin(t))); }
  mk("path", { d: poly(cap), class: "nf lo" }, g);
  put(solid(g), prism(P, front, ...rings(-44, -3, -36, 3, 3, 1), 38, PIV[1] + 4));
  const near = side(W);
  const s = spring(REST);
  let last = NaN, lastL = NaN;
  function draw(f) {
    if (f === last && len === lastL) return;
    last = f; lastL = len;
    for (const [sd, k] of [[far, -1], [near, 1]]) {
      const ph = f * k, px = 12 + len * ph, ang = -0.35 * ph;
      const top = [PIV[0] - 34 * Math.sin(ang) * -1, sd.y, PIV[1] + 36 * Math.cos(ang)];
      const foot = [PIV[0] + 40 * Math.sin(-ang) + 6, sd.y, PIV[1] - 40 * Math.cos(ang)];
      sd.arm.setAttribute("d", rod([top[0], sd.y, top[2]], [foot[0], sd.y, foot[2]], 2) + rod([foot[0], sd.y, foot[2]], [px - 10, sd.y, 9], 1.6));
      sd.pedal.setAttribute("d", poly(hull(ringAt(P, rings(px - 14, sd.y - 4, px + 6, sd.y + 4, 3, 1)[0], 8).concat(ringAt(P, rings(px - 14, sd.y - 4, px + 6, sd.y + 4, 3, 1)[0], 11)))));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function stride(p) {
    on = !!p;
    near.arm.classList.toggle("hi", !on);
    near.pedal.classList.toggle("hi", on);
    if (!p) { s.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x] = unproj(C, p[0], p[1], 0);
    s.t = clamp(x / 45, -1, 1);
    read.textContent = "step " + Math.round(s.t * 100);
    B.wake();
  }
  stride(null);
  draw(REST);
  bag.add(pointer(stage, { move: stride, leave: () => stride(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "ellipticals",
  means: "An elliptical trainer: the pointer's place along it sets the stride, pedals sliding and handles swinging opposite.",
  rules: [1, 3, 5, 8],
  range: [10, 22, 30],
  tour: [[262, 281], [135, 217], [205, 250], null],
  mount,
});
