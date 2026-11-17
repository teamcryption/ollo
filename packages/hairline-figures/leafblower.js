/**
 * Leaf blower: a motor housing on the ground with a loop handle on top and a
 * long blow tube coupled at its front. The pointer over it swings the tube
 * round to sweep. At rest the tube points ahead, its tip bright.
 */
const { Cam, fit, facing, hull, open, poly, proj, rrect, ringAt, run, rad, lerp, spring, stepS, disposer, mk, pointer, put, solid } = HL;
const { register } = HL;

const xf = (ring, a, du, dv) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s + du, v: q.u * s + q.v * c + dv, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
const ring2 = (u0, v0, u1, v1, r, b) => [rrect(u0, v0, u1, v1, r, 4), rrect(u0 + b, v0 + b, u1 - b, v1 - b, Math.max(r - b, 0.5), 4)];
const PIV = [30, 0];
const TUBE = [ring2(0, -7, 92, 7, 6.5, 2), ring2(88, -9, 104, 9, 4, 2)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-40, -30, 0], [30, 30, 40], [134, 0, 6], [30 + 104 * Math.cos(rad(50)), 104 * Math.sin(rad(50)), 0], [30 + 104 * Math.cos(rad(-20)), 104 * Math.sin(rad(-20)), 0]], 228, 182);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tg = mk("g", {}, g);
  const tube = TUBE.map(() => solid(tg));
  const bg = mk("g", {}, g);
  const housing = solid(bg), grip = solid(bg), collar = solid(bg);
  function slab(s, R, I, z0, z1) {
    put(s, { sil: poly(hull(ringAt(P, R, z0).concat(ringAt(P, R, z1)))), crease: open(ringAt(P, run(I, front), z1)) });
  }
  const [hr, hi] = ring2(-40, -28, 28, 28, 14, 2.2);
  slab(housing, hr, hi, 0, 30);
  const [gr, gi] = ring2(-30, -5, 16, 5, 5, 1.6);
  slab(grip, gr, gi, 30, 42);
  const [cr, ci] = ring2(22, -11, 36, 11, 5, 1.8);
  slab(collar, cr, ci, 4, 24);
  const sp = spring(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return; last = t;
    const a = rad(lerp(-14, 48, t));
    TUBE.forEach(([r, i], j) => slab(tube[j], xf(r, a, PIV[0], PIV[1]), xf(i, a, PIV[0], PIV[1]), 7, 21));
    if (a > 0) g.append(tg); else g.append(bg);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const pts = [P(-45, -35, 0), P(140, 0, 0), P(100, 90, 0), P(-45, 35, 0), P(130, -40, 0)];
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 10;
  let act = false;
  const target = () => 0.45 + 0.55 * amt;
  function setA(on) {
    sp.t = on ? target() : 0;
    tube[1].sil.classList.toggle("hi", true);
    read.textContent = on ? "sweep " + Math.round(lerp(-14, 48, sp.t)) + "°" : "rest";
    act = on; B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { sp.t = target(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "leafblower",
  means: "A leaf blower on the ground, housing and loop handle: the pointer over it swings the long blow tube round to sweep.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[183, 221], [294, 214], [120, 110], null],
  mount,
});
