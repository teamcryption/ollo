/**
 * Sprinkler: a rotary garden sprinkler on a sled base, a riser, a hub and two
 * long arms with nozzle caps at their tips. The pointer is where the water
 * goes: the rotor swings on a spring until one arm points at it, and that arm
 * is bright. At rest the rotor sits askew with its first arm bright. The
 * slider is how stiffly the rotor follows.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 50, AZ = 21, REST = -0.55;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.1);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([(L + 2) * Math.cos(a), (L + 2) * Math.sin(a), 0], [(L + 2) * Math.cos(a), (L + 2) * Math.sin(a), AZ + 8]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // sled base: two runners and a cross plate, then the riser
  put(solid(g), prism(P, front, ...rings(-20, -16, 20, -10, 3, 1), 0, 3));
  put(solid(g), prism(P, front, ...rings(-20, 10, 20, 16, 3, 1), 0, 3));
  put(solid(g), prism(P, front, ...rings(-7, -14, 7, 14, 3, 1.2), 3, 6));
  put(solid(g), prism(P, front, circ(3, 24), null, 6, AZ - 3));

  const ARM = rings(2, -2.4, L - 6, 2.4, 1.2, 0.8), CAP = rings(L - 8, -4.5, L, 4.5, 2.2, 1);
  const rotor = mk("g", {}, g);
  const halves = [0, 1].map((i) => {
    const hg = mk("g", {}, rotor);
    return { i, g: hg, arm: solid(hg), cap: solid(hg) };
  });
  const hub = solid(rotor);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, lit = 0;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    for (const h of halves) {
      const b = a + h.i * Math.PI;
      const T = (r) => turn(r, b);
      put(h.arm, prism(P, front, T(ARM[0]), T(ARM[1]), AZ, AZ + 3.4));
      put(h.cap, prism(P, front, T(CAP[0]), T(CAP[1]), AZ - 2, AZ + 7));
    }
    put(hub, prism(P, front, circ(6, 32), circ(4.8, 32), AZ - 3, AZ + 6));
    // the far arm goes behind the hub, the near one in front of it
    const far = Math.cos(a) + Math.sin(a) < 0 ? halves[0] : halves[1];
    const near = far === halves[0] ? halves[1] : halves[0];
    rotor.prepend(far.g);
    rotor.append(near.g);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function mark(i, label) {
    lit = i;
    for (const h of halves) { const on = h.i === i; h.arm.sil.classList.toggle("hi", on); h.cap.sil.classList.toggle("hi", on); }
    read.textContent = label;
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r > L + 30) { sp.t = sp.t + wrap(REST - sp.t); mark(0, "rest"); return; }
      if (r < 5) return;
      const aim = Math.atan2(y, x);
      // swing whichever arm is closer to the aim
      const d0 = wrap(aim - sp.t), d1 = wrap(aim - Math.PI - sp.t);
      const use = Math.abs(d0) <= Math.abs(d1) ? 0 : 1;
      sp.t = sp.t + (use ? d1 : d0);
      const deg = Math.round(((aim * 180) / Math.PI + 360) % 360);
      mark(use, String(deg).padStart(3, "0") + "°");
    },
    leave: () => { sp.t = sp.t + wrap(REST - sp.t); mark(0, "rest"); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  mark(0, "rest");
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "sprinkler",
  means: "A rotary garden sprinkler: the rotor swings until one arm points at the pointer, and that arm is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[353, 238], [112, 249], [25, 161], null],
  mount,
});
