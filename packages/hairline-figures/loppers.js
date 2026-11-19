/**
 * Loppers: one pair lying flat, two long handles crossed at a pivot, short
 * hooked blades one way and padded grips the other. The pointer over them
 * spreads the handles and the hooked jaws gape. At rest the jaws are nearly
 * shut, the upper hook bright.
 */
const { Cam, fit, facing, hull, open, poly, proj, rrect, ringAt, run, rad, spring, stepS, disposer, mk, pointer, put, solid } = HL;
const { register } = HL;

const REST = 12, OPEN = 66;
const xf = (ring, a, du, dv) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s + du, v: q.u * s + q.v * c + dv, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
// [ring, inner, bend, du, dv, width z] in the lever's own frame; bend turns the hook inward
const PART = (h) => [
  [rrect(-6, -7, 26, 7, 6, 4), rrect(-4, -5, 24, 5, 4.5, 4), 0, 0, 0],
  [rrect(0, -6, 26, 5, 5, 4), rrect(2, -4, 24, 3, 3.5, 4), h * 0.5, 22, 0],
  [rrect(-104, -3, -4, 3, 3, 4), rrect(-102, -1.6, -6, 1.6, 1.5, 4), 0, 0, 0],
  [rrect(-150, -5.5, -96, 5.5, 5, 4), rrect(-148, -3.8, -98, 3.8, 3.6, 4), 0, 0, 0],
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.85);
  const A = rad(OPEN / 2);
  fit(C, [[46 * Math.cos(A), 46 * Math.sin(A), 0], [46 * Math.cos(A), -46 * Math.sin(A), 0], [-150 * Math.cos(A), 150 * Math.sin(A), 0], [-150 * Math.cos(A), -150 * Math.sin(A), 0], [0, 0, 12]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const parts = [PART(-1), PART(1)];
  const levers = [0, 1].map((k) => { const lg = mk("g", {}, g); return parts[k].map(() => solid(lg)); });
  const bolt = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function slab(s, ring, inner, a, z0, z1) {
    put(s, { sil: poly(hull(ringAt(P, ring, z0).concat(ringAt(P, ring, z1)))), crease: open(ringAt(P, run(inner, front), z1)) });
  }
  function draw(deg) {
    if (deg === last) return; last = deg;
    const a = rad(deg / 2);
    levers.forEach((L, k) => {
      const s = k ? -a : a, z0 = k * 3.6;
      L.forEach((sol, j) => {
        const [ring, inner, bend, du] = parts[k][j];
        const R = xf(xf(ring, bend, du, 0), s, 0, 0), I = xf(xf(inner, bend, du, 0), s, 0, 0);
        slab(sol, R, I, s, z0, z0 + 3.2);
      });
    });
    slab(bolt, rrect(-5, -5, 5, 5, 5, 4), rrect(-3.5, -3.5, 3.5, 3.5, 3.5, 4), 0, 6.8, 9.6);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const pts = [P(50, 40, 0), P(50, -40, 0), P(-150, 60, 0), P(-150, -60, 0)];
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys) - 10, y1 = Math.max(...ys) + 10;
  let act = false;
  const target = () => REST + (OPEN - REST) * (0.4 + 0.6 * amt);
  function setA(on) {
    sp.t = on ? target() : REST;
    levers[1][1].sil.classList.toggle("hi", true);
    read.textContent = on ? "jaw " + Math.round(sp.t) + "°" : "rest";
    act = on; B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { sp.t = target(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "loppers",
  means: "Loppers lying flat, long handles crossed at a pivot: the pointer over them spreads the handles and the short hooked jaws gape.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[345, 223], [222, 80], [98, 122], null],
  mount,
});
