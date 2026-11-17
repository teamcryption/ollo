/**
 * Probe dish: a lander pad with a mast and a big dish on a gimbal. At rest
 * the dish leans back, bright. The pointer swings it round and tips it up to
 * aim at the sky; leaving lets it settle back. The slider is the reach.
 */
const { Cam, circ, rrect, fit, hull, poly, open, proj, spring, stepS, clamp, rad, mk, pointer, register, disposer } = HL;

const RX = (a) => ([x, y, z]) => { const c = Math.cos(a), s = Math.sin(a); return [x, y * c - z * s, y * s + z * c]; };
const RZ = (a) => ([x, y, z]) => { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c, z]; };
const blk = (P, x0, y0, x1, y1, z0, z1, r) => { const pts = []; for (const z of [z0, z1]) for (const q of rrect(x0, y0, x1, y1, r, 4)) pts.push(P(q.u, q.v, z)); return poly(hull(pts)); };
const PV = [30, 30, 46], R = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [64, 64, 0], [64, -4, 0], [-4, 64, 0], [30, 30, 80], [2, 30, 60], [58, 30, 60]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: blk(P, 0, 0, 60, 60, 0, 6, 6) }, g);
  mk("path", { class: "nf lo", d: poly(rrect(2, 2, 58, 58, 5, 4).map((q) => P(q.u, q.v, 6))) }, g);
  for (const [x, y] of [[10, 10], [50, 10], [10, 50], [50, 50]]) mk("path", { class: "nf lo", d: open([P(x, y, 6), P(30, 30, 22)]) }, g);
  mk("path", { class: "sil", d: blk(P, 26, 26, 34, 34, 6, 42, 4) }, g);
  mk("path", { class: "sil", d: blk(P, 23, 23, 37, 37, 38, 46, 4) }, g);
  const dish = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g), feed = mk("path", { class: "nf" }, g);
  const sp = spring(0);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const T = (p) => { const q = RZ(rad(-30 + o * amp * 150))(RX(rad(40 + o * amp * 40))(p)); return P(q[0] + PV[0], q[1] + PV[1], q[2] + PV[2]); };
    const pts = [];
    for (const [r, z] of [[R, 10], [R * 0.7, 5], [8, 0]]) for (const q of circ(r, 32)) pts.push(T([q.u, q.v, z]));
    dish.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(circ(R - 2, 32).map((q) => T([q.u, q.v, 9.5]))));
    const tip = T([0, 0, 26]);
    feed.setAttribute("d", open([T([R * 0.8, 0, 8]), tip, T([-R * 0.8, 0, 8])]) + " " + poly(circ(3, 12).map((q) => T([q.u, q.v, 26]))));
  }
  draw(0);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(p) { sp.t = p ? clamp(0.7 + (p[0] - 200) / 400, 0.6, 1) : 0; read.textContent = p ? "aim " + Math.round(sp.t * 100) : "rest"; B.wake(); }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "probelaunch",
  means: "A probe's dish on a mast: it leans back at rest, and swings round and tips up to aim when the pointer arrives.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 100],
  tour: [[213, 91], [250, 110], [170, 120], null],
  mount,
});
