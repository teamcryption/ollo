/**
 * Vacuum nozzle: the floor head of a stick vacuum, a wide low shoe on a
 * swivel knuckle, with the wand rising behind it. The pointer is where to
 * steer: the head swivels on its knuckle to face it, and the wand twists a
 * little with it. At rest the head is turned slightly and the knuckle is
 * bright. The slider is how far the swivel can turn.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, proj, rad, ringAt, rrect, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 14, WL = 96, WR = 3.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  const pts = [];
  for (let a = 0; a < 360; a += 30) pts.push([Math.cos(rad(a)) * 52, Math.sin(rad(a)) * 52, 0]);
  pts.push([-WL * 0.5, -WL * 0.5, WL * 0.78], [-WL * 0.62, -WL * 0.25, WL * 0.78], [-WL * 0.25, -WL * 0.62, WL * 0.78]);
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  let maxA = value;
  const g = mk("g", {}, svg);
  const head = solid(g), brush = mk("path", { class: "nf lo" }, g);
  const wand = mk("path", { class: "sil" }, g), grip = mk("path", { class: "sil" }, g);
  const knuckle = solid(g);
  const HEAD = rrect(-50, -9, 50, 20, 9, 6), INNER = rrect(-48.4, -7.4, 48.4, 18.4, 7.4, 6);
  const th = spring(REST);
  let last = null, over = false;

  /** The ring turned by a (degrees) about the knuckle, normals with it. */
  function turn(ring, a) {
    const w = [Math.cos(rad(a - 45)), Math.sin(rad(a - 45))], d = [Math.cos(rad(a + 45)), Math.sin(rad(a + 45))];
    return ring.map((q) => ({ u: q.u * w[0] + q.v * d[0], v: q.u * w[1] + q.v * d[1], nu: q.nu * w[0] + q.nv * d[0], nv: q.nu * w[1] + q.nv * d[1] }));
  }
  /** A tube between two world points, as the hull of its end rings. */
  function tube(a, b, r) {
    const dd = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...dd), d = dd.map((x) => x / n);
    let u = [d[1], -d[0], 0]; const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const ring = (c) => Array.from({ length: 20 }, (_, i) => {
      const t = (i / 20) * Math.PI * 2, q = (j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    return poly(hull(ring(a).concat(ring(b))));
  }

  function draw() {
    const a = th.x;
    if (last !== null && Math.abs(a - last) < 0.01) return;
    last = a;
    const ring = turn(HEAD, a), inner = turn(INNER, a);
    put(head, { sil: poly(hull(ringAt(P, ring, 10).concat(ringAt(P, ring, 0)))), crease: open(ringAt(P, run(inner, front), 10)) });
    brush.setAttribute("d", open(ringAt(P, run(ring, front), 3.5)));
    const wa = rad(225 + a * 0.35), top = [Math.cos(wa) * WL * 0.7, Math.sin(wa) * WL * 0.7, WL * 0.72];
    const gtop = [Math.cos(wa) * WL * 0.74, Math.sin(wa) * WL * 0.74, WL * 0.78];
    wand.setAttribute("d", tube([0, 0, 12], top, WR));
    grip.setAttribute("d", tube([top[0] * 0.8, top[1] * 0.8, top[2] * 0.8], gtop, WR + 1.8));
    const k = circ(7.5, 24), ki = circ(6, 24);
    put(knuckle, { sil: poly(hull(ringAt(P, k, 9).concat(ringAt(P, k, 17)))), crease: open(ringAt(P, run(ki, front), 17)) });
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget(p) {
    over = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r < 120 && r > 3) {
        let t = Math.atan2(y, x) * 180 / Math.PI - 45;
        t = ((t + 540) % 360) - 180;
        if (Math.abs(t) <= 120) { over = true; th.t = clamp(t, -maxA, maxA); }
      }
    }
    if (!over) th.t = REST;
    head.sil.classList.toggle("hi", over);
    knuckle.sil.classList.toggle("hi", !over);
    read.textContent = over ? `turn ${Math.round(th.t)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => retarget(p), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());
  retarget(null);
  draw();
  return {
    set: (v) => { maxA = v; if (over) th.t = clamp(th.t, -v, v); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "vacuumhead",
  means: "The floor head of a stick vacuum: it swivels on its knuckle to face the pointer, and the wand twists a little with it.",
  rules: [1, 3, 5, 8],
  range: [20, 45, 70],
  tour: [[290, 265], [93, 263], [200, 290], null],
  mount,
});
