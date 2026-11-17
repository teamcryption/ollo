/**
 * Hedge shears: one pair lying flat, two long levers crossed at a bolt, blades
 * one way and grips the other. The pointer over them opens the blades wide.
 * At rest they are barely open, the upper blade bright.
 */
const { Cam, fit, facing, hull, open, poly, proj, rrect, ringAt, run, clamp, rad, spring, stepS, disposer, mk, pointer, put, solid } = HL;
const { register } = HL;

const REST = 10, OPEN = 52;
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
const PARTS = [[rrect(4, -7, 104, 6, 5, 4), rrect(6, -5, 102, 4, 3.5, 4)], [rrect(-60, -3.5, -4, 3.5, 3, 4), rrect(-58, -2, -6, 2, 1.8, 4)], [rrect(-110, -6, -56, 6, 5.5, 4), rrect(-108, -4.2, -58, 4.2, 4, 4)]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.56);
  const A = rad(OPEN / 2);
  fit(C, [[104 * Math.cos(A), 104 * Math.sin(A), 0], [104 * Math.cos(A), -104 * Math.sin(A), 0], [-110 * Math.cos(A), 110 * Math.sin(A), 0], [-110 * Math.cos(A), -110 * Math.sin(A), 0], [0, 0, 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const levers = [0, 1].map(() => { const lg = mk("g", {}, g); return PARTS.map(() => solid(lg)); });
  const bolt = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function slab(s, ring, inner, a, z0, z1) {
    const R = rot(ring, a), I = rot(inner, a);
    put(s, { sil: poly(hull(ringAt(P, R, z0).concat(ringAt(P, R, z1)))), crease: open(ringAt(P, run(I, front), z1)) });
  }
  function draw(deg) {
    if (deg === last) return; last = deg;
    const a = rad(deg / 2);
    levers.forEach((L, k) => { const s = k ? -a : a, z0 = k * 3.4; L.forEach((sol, j) => slab(sol, PARTS[j][0], PARTS[j][1], s, z0, z0 + 3)); });
    slab(bolt, rrect(-5, -5, 5, 5, 5, 4), rrect(-3.5, -3.5, 3.5, 3.5, 3.5, 4), 0, 6.4, 9);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const pts = [P(110, 40, 0), P(110, -40, 0), P(-115, 40, 0), P(-115, -40, 0)];
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys) - 10, y1 = Math.max(...ys) + 10;
  let act = false;
  const target = () => REST + (OPEN - REST) * (0.4 + 0.6 * amt);
  function setA(on) {
    sp.t = on ? target() : REST;
    levers[1][0].sil.classList.toggle("hi", true);
    levers[0][0].sil.classList.toggle("hi", false);
    read.textContent = on ? "open " + Math.round(sp.t) + "°" : "rest";
    act = on; B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { sp.t = target(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "shears",
  means: "Hedge shears lying flat, two levers crossed at a bolt: the pointer over them opens the long blades wide.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[271, 201], [200, 160], [140, 128], null],
  mount,
});
