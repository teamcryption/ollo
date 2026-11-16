/**
 * Baby monitor: a nursery camera on a round foot, a neck, a boxy head with a
 * round lens on its face and a short antenna on top. The pointer is the baby
 * it watches: the head pans on its spring to face it. At rest it looks a
 * little off to one side, its lens bright. The slider is how quickly it pans.
 *
 * The pattern: a continuous aim (officechairs' swivel, on one head); the hit
 * is on the floor's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = (45 + 30) * (Math.PI / 180), LIM = 70 * (Math.PI / 180), MID = 45 * (Math.PI / 180);
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.0);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([22 * Math.cos(a), 22 * Math.sin(a), 0], [16 * Math.cos(a), 16 * Math.sin(a), 56]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(18, 48), circ(16.4, 48), 0, 3));
  put(solid(g), prism(P, front, circ(3.2, 24), null, 3, 15));
  const head = solid(g), ant = solid(g), knob = solid(g);
  const lens = mk("path", { class: "nf" }, g), eye = mk("path", { class: "nf lo" }, g);
  const HR = rings(-10, -12, 10, 12, 4, 1.4), AR = circ(1.4, 16), KR = circ(2.6, 16);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const T = (r) => turn(r, a);
    put(head, prism(P, front, T(HR[0]), T(HR[1]), 14, 34));
    const ax = -5 * Math.cos(a) - 8 * Math.sin(a), ay = -5 * Math.sin(a) + 8 * Math.cos(a);
    const at = (r) => r.map((q) => ({ ...q, u: q.u + ax, v: q.v + ay }));
    put(ant, prism(P, front, at(AR), null, 34, 52));
    put(knob, prism(P, front, at(KR), null, 51, 55));
    const c = Math.cos(a), s = Math.sin(a), ring = (R) => {
      const pts = [];
      for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2, v = R * Math.cos(t), z = 24 + R * Math.sin(t); pts.push(P(10.4 * c - v * s, 10.4 * s + v * c, z)); }
      return poly(pts);
    };
    const vis = c + s > 0.1;
    lens.setAttribute("d", vis ? ring(6.5) : "");
    eye.setAttribute("d", vis ? ring(3) : "");
  }
  draw(REST);
  lens.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    let t = REST;
    if (p) t = MID + Math.max(-LIM, Math.min(LIM, wrap(Math.atan2(p[1], p[0]) - MID)));
    sp.t = t;
    read.textContent = p ? "pan " + Math.round(((t - MID) * 180) / Math.PI) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (q) => { const [x, y] = unproj(C, q[0], q[1], 0), r = Math.hypot(x, y); aim(r > 6 && r < 90 ? [x, y] : null); },
    leave: () => aim(null),
  }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "babymonitor",
  means: "A nursery camera on a round foot: its head pans to face the pointer, lens bright, antenna turning with it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 217], [100, 300], [300, 300], null],
  mount,
});
