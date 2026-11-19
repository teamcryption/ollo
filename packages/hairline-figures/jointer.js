/**
 * Jointer: a long base carrying a lower infeed table and an outfeed table with
 * the cutterhead gap between them, a tall fence standing along the back and
 * a pork-chop guard over the gap. The pointer's height over the jointer tilts
 * the fence in over the tables on a spring, and the guard swings aside with
 * it. At rest the fence leans in a little, bright.
 *
 * The pattern: one part following a continuous input (tilt).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.12, TZ = 22, MAXA = 45;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, -6, 0], [130, 32, 0], [0, 32, 0], [130, -6, 0], [30, -6, TZ + 34], [100, -6, TZ + 34], [80, 50, TZ]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(6, 4, 124, 26, 0, TZ - 8, 4, 1.6);
  box(0, 0, 61, 30, TZ - 8, TZ - 1.5, 3, 1.4);
  box(67, 0, 130, 30, TZ - 8, TZ, 3, 1.4);
  const guard = solid(g), fence = solid(g);
  const gOut = rrect(-5, -26, 9, 2, 6, 6), gIn = rrect(-3.6, -24.6, 7.6, 0.6, 4.6, 6);
  const fOut = rrect(28, 0, 102, 30, 4, 6), fIn = rrect(29.6, 1.6, 100.4, 28.4, 2.6, 6);
  const sp = spring(REST);
  let last = NaN;
  const lean = (ring, y, a) => ring.map((q) => { const dy = y + 1, dz = q.v; return P(q.u, -1 + dy * Math.cos(a) + dz * Math.sin(a), TZ - dy * Math.sin(a) + dz * Math.cos(a)); });
  const swing = (ring, z, b) => ring.map((q) => P(64 + q.u * Math.cos(b) - q.v * Math.sin(b), 30 + q.u * Math.sin(b) + q.v * Math.cos(b), z));
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const k = v * reach / 100, a = rad(k * MAXA), b = rad(k * 80);
    guard.sil.setAttribute("d", poly(hull(swing(gOut, TZ + 0.5, b).concat(swing(gOut, TZ + 3, b)))));
    guard.cr.setAttribute("d", poly(swing(gIn, TZ + 3, b)));
    fence.sil.setAttribute("d", poly(hull(lean(fOut, -5, a).concat(lean(fOut, -1, a)))));
    fence.cr.setAttribute("d", poly(lean(fIn, -1, a)));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(65, -3, TZ + 30)[1], yB = P(65, 15, 0)[1], xs = [P(0, 32, 0)[0] - 10, P(130, -6, 0)[0] + 10];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] && p[0] < xs[1] && p[1] > yT - 40 && p[1] < yB + 30) { t = clamp((yB - p[1]) / (yB - yT), 0, 1); on = true; }
    sp.t = t;
    const s = on ? Math.round(t * MAXA * reach / 100) + "°" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  fence.sil.classList.add("hi");
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "jointer",
  means: "A jointer with infeed and outfeed tables: the pointer's height tilts the tall fence in over the bed and swings the guard aside.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[225, 200], [225, 150], [225, 106], null],
  mount,
});
