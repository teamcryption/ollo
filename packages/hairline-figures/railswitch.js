/**
 * Rail switch: a ground lever on its stand beside a stock rail, linked to a
 * switch blade. The pointer throws the lever: across the figure it swings
 * from one side to the other on a spring, and the blade swings with it,
 * closing on the rail. At rest the lever leans back and the blade stands open.
 * The slider is how far the lever throws.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PIV = [0, 34, 22], LEN = 78, REST = -0.8, BL = [-62, -16, 7];

function rot(p, o, ax, a) {
  const c = Math.cos(a), s = Math.sin(a), [x, y, z] = [p[0] - o[0], p[1] - o[1], p[2] - o[2]], [u, v, w] = ax;
  const d = u * x + v * y + w * z;
  return [o[0] + x * c + (v * z - w * y) * s + u * d * (1 - c), o[1] + y * c + (w * x - u * z) * s + v * d * (1 - c), o[2] + z * c + (u * y - v * x) * s + w * d * (1 - c)];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-66, -40, 0], [66, 50, 0], [-50, 34, 90], [50, 34, 90]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (x0, y0, x1, y1, z0, z1, r, b) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  slab(-14, -44, 14, 46, 0, 6, 3, 1.2);
  slab(-66, -32, 66, -26, 6, 12, 2, 1);
  const blade = solid(g);
  slab(-12, 26, 12, 42, 6, 20, 3, 1.2);
  const lever = solid(g), knob = solid(g);
  lever.sil.classList.add("hi"); knob.sil.classList.add("hi");

  function bar(s, A, B, ra, rb) {
    const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], n = Math.hypot(...d), e = d.map((q) => q / n);
    let u = [e[1], -e[0], 0]; if (Math.hypot(...u) < 0.1) u = [1, 0, 0];
    const un = Math.hypot(...u); u = u.map((q) => q / un);
    const v = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]];
    const ring = (c, r) => circ(r, 20).map((q) => P(...[0, 1, 2].map((j) => c[j] + r * 0 + q.u * u[j] + q.v * v[j])));
    const rA = ring(A, ra), rB = ring(B, rb);
    s.sil.setAttribute("d", poly(hull(rA.concat(rB))));
    s.cr.setAttribute("d", poly(ring(B, rb * 0.6)));
  }
  function ball(s, c, r) {
    const pts = [];
    for (const q of circ(r, 24)) pts.push(P(c[0] + q.u, c[1] + q.v, c[2]), P(c[0] + q.u, c[1], c[2] + q.v), P(c[0], c[1] + q.u, c[2] + q.v));
    s.sil.setAttribute("d", poly(hull(pts)));
  }

  const t = spring(REST);
  let last = "", over = null;
  function draw() {
    const key = t.x.toFixed(3);
    if (key === last) return;
    last = key;
    const a = rad(32) * t.x, top = rot([PIV[0], PIV[1], PIV[2] + LEN], PIV, [0, 1, 0], a);
    bar(lever, PIV, top, 4, 3.4);
    ball(knob, top, 7);
    const ba = rad(5) * (t.x + 1) / 2 - rad(5);
    bar(blade, BL, rot([54, -16, 7], BL, [0, 0, 1], -ba), 3, 2.4);
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(); return m; });
  bag.add(B.unregister);
  let gain = value;
  function retarget() {
    t.t = over === null ? REST : clamp(over * gain, -1, 1);
    read.textContent = over === null ? "rest" : `${Math.round(32 * t.t)}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) < 80 && Math.abs(y) < 70 ? clamp(x / 50, -1, 1) : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget(); draw();
  return { set: (v) => { gain = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "railswitch",
  means: "A ground lever beside a rail: the pointer throws it across, and the switch blade swings shut on the rail.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[118, 195], [279, 226], [200, 190], null],
  mount,
});
