/**
 * Timing light: a strobe gun stood on its grip on the bench, a long body
 * with a wide lamp head at the front and a trigger under it. The pointer is
 * the mark on the crank pulley: the gun turns on its grip to aim the head
 * at it, on a spring. At rest it points off to one side, its head bright.
 * The slider is how stiffly it turns.
 *
 * The pattern: a continuous aim (terrain's spring, on an angle); the depth
 * order of head and body swaps as it turns.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 0.5;
const box = (u0, v0, u1, v1, r, b) => rings(u0, v0, u1, v1, r, b);
// footprints in the gun's own frame: +u is where it aims
const GRIP = box(-22, -6, -8, 6, 4, 1.4), BODY = box(-30, -8, 20, 8, 6, 1.6), HEAD = box(18, -14, 32, 14, 6, 1.8), TRIG = box(-6, -3, 2, 3, 2, 0.8);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, 48], [-36, 36, 48], [0, 0, 50]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -14, 14, 14, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const cord = mk("path", { class: "nf lo" }, g);
  const grip = solid(g), trig = solid(g), body = solid(g), head = solid(g);
  head.sil.classList.add("hi");

  const ang = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const rot = (ring, a) => ring.map((q) => {
    const c = Math.cos(a), s = Math.sin(a);
    const uu = q.u + 15;
    return { u: uu * c - q.v * s, v: uu * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c };
  });
  const rp = (r, a) => [rot(r[0], a), rot(r[1], a)];
  let last = NaN;
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    let [o, i] = rp(GRIP, a); put(grip, prism(P, front, o, i, 3, 30));
    [o, i] = rp(TRIG, a); put(trig, prism(P, front, o, i, 22, 31));
    [o, i] = rp(BODY, a); put(body, prism(P, front, o, i, 30, 44));
    [o, i] = rp(HEAD, a); put(head, prism(P, front, o, i, 26, 48));
    const c = Math.cos(a), s = Math.sin(a), tail = [-15 * c, -15 * s];
    cord.setAttribute("d", seg(P(tail[0], tail[1], 36), P(tail[0] - 10 * c, tail[1] - 10 * s, 20)) + seg(P(tail[0] - 10 * c, tail[1] - 10 * s, 20), P(-30, 6, 3)));
    // the head sits in front of the body when it aims toward the viewer
    if (c + s > 0) body.g.after(head.g); else body.g.before(head.g);
  }
  draw();
  read.textContent = "rest";

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      let t = Math.atan2(y, x);
      while (t - ang.t > Math.PI) t -= 2 * Math.PI;
      while (t - ang.t < -Math.PI) t += 2 * Math.PI;
      ang.t = t;
      read.textContent = ((Math.round(t * 180 / Math.PI) % 360) + 360) % 360 + "°";
      B.wake();
    },
    leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang.k = 100 * v; ang.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "timinglight",
  means: "A strobe timing light stood on its grip: the gun turns to aim its lamp head at the pointer, like the mark on a pulley.",
  rules: [1, 3, 5, 6, 8],
  range: [0.5, 1, 1.6],
  tour: [[348, 196], [76, 184], [52, 196], null],
  mount,
});
