/**
 * Radial arm saw: a bench with a board across it, a round column at the back
 * and an arm reaching out over the table. The saw head hangs from the arm,
 * motor on one side and a guarded blade on the other. The pointer's place
 * along the arm pulls the head out along it, on a spring. At rest the head
 * sits a little out from the column and the blade is bright. The slider is
 * how far the head can travel.
 *
 * The pattern: one part following a continuous input (slide).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.3, X0 = 6, RUN = 74, TZ = 30, AZ = 84;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-14, 0, 0], [96, 56, 0], [96, 0, 0], [-14, 56, 0], [-7, 28, AZ + 8], [96, 28, AZ + 8], [X0 + RUN + 26, 34, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); return s; };
  // a disc standing in the x-z plane, from y0 to y1
  const wheel = (cx, cz, r, y0, y1, n = 28) => circ(r, n).flatMap((q) => [P(cx + q.u, y0, cz + q.v), P(cx + q.u, y1, cz + q.v)]);
  const ring = (cx, cz, r, y, n = 28) => circ(r, n).map((q) => P(cx + q.u, y, cz + q.v));
  box(solid(g), -14, 0, 96, 56, 0, TZ - 4, 5, 2);
  box(solid(g), -2, -2, 98, 58, TZ - 4, TZ, 3, 1.2);
  put(solid(g), prism(P, front, disc(-7, 28, 6.5), disc(-7, 28, 5), 0, AZ + 8));
  box(solid(g), 52, 2, 64, 54, TZ, TZ + 5, 1.5, 1);
  box(solid(g), -12, 23, 96, 33, AZ, AZ + 8, 4, 1.6);
  const motor = mk("path", {}, g), mcap = mk("path", { class: "nf lo" }, g), carr = solid(g);
  const blade = mk("path", { class: "sil hi" }, g), arbor = mk("path", { class: "nf lo" }, g);
  const guard = mk("path", { class: "sil" }, g), handle = mk("path", { class: "sil" }, g);
  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const hx = X0 + v * RUN * reach / 100;
    motor.setAttribute("d", poly(hull(wheel(hx, 62, 12, 8, 22))));
    mcap.setAttribute("d", poly(ring(hx, 62, 9, 8)));
    box(carr, hx - 9, 21, hx + 9, 35, 72, AZ, 3, 1.2);
    blade.setAttribute("d", poly(hull(wheel(hx, 54, 21, 29, 31, 36))));
    arbor.setAttribute("d", poly(ring(hx, 54, 4, 31, 14)));
    const half = [];
    for (let i = 0; i <= 12; i++) { const a = Math.PI * (0.08 + 0.84 * i / 12); half.push([hx + 24 * Math.cos(a), 24 * Math.sin(a)]); }
    guard.setAttribute("d", poly(hull(half.flatMap(([x, d]) => [P(x, 27, 54 + d), P(x, 35, 54 + d)]).concat([P(hx - 10, 27, 60), P(hx + 10, 35, 60)]))));
    handle.setAttribute("d", poly(hull(ring(hx + 16, 66, 2.2, 31, 10).concat(ring(hx + 30, 70, 2.6, 31, 10), ring(hx + 30, 70, 2.6, 36, 10)))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const xa = P(X0, 28, AZ)[0], xb = P(X0 + RUN, 28, AZ)[0], yT = P(-7, 28, AZ + 20)[1], yB = P(96, 56, 0)[1];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xa - 30 && p[0] < xb + 30 && p[1] > yT && p[1] < yB) { t = clamp((p[0] - xa) / (xb - xa), 0, 1); on = true; }
    sp.t = t;
    const s = on ? Math.round(t * RUN * reach / 100) + "cm" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "radialarmsaw",
  means: "A radial arm saw over a board: the pointer's place along the arm pulls the saw head and its blade out across the cut.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[178, 168], [238, 184], [292, 200], null],
  mount,
});
