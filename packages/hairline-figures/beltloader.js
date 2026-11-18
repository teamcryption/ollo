/**
 * Belt loader: a low chassis on four wheels with a driver's cowl at the back
 * and a long conveyor ramp hinged behind it, cleats across its belt. Over
 * the machine the ramp's nose rises on the 700ms ease, a strut pushing it up
 * from the chassis; leaving lowers it almost flat, the ramp bright. The
 * slider is the ramp's top angle.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 5, LEN = 100, PX = -30, PZ = 20, W = 10, T = 4, N = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.3);
  const at = (a, u, n) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [PX + u * c + n * s, PZ + u * s - n * c]; };
  const pts = [[-50, -16, 0], [50, 16, 0], [50, -16, 0], [-50, 16, 0]];
  for (const a of [REST, 36]) { const [ex, ez] = at(a, LEN, 0); pts.push([ex, -W, ez + 2], [ex, W, ez + 2], [ex, W, ez - 6]); }
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-48, -14, 46, 14, 4, 1.6, 6, 13);
  for (const x of [-32, 30]) {
    const w = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; w.push(P(x + 6.5 * Math.cos(a), 14.5, 6.5 + 6.5 * Math.sin(a))); }
    mk("path", { d: poly(w) }, g);
  }
  box(-47, -13, -34, 13, 5, 1.4, 13, 30);
  box(PX - 4, -12, PX + 4, 12, 3, 1, 13, PZ);
  const strut = mk("path", { class: "nf" }, g);
  const ramp = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "lo nf" }, g), cleats = mk("path", { class: "lo nf" }, g);
  const hinge = mk("circle", { class: "dot m", r: 2.2 }, g);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const q = (u, n, y) => { const [x, z] = at(a, u, n); return P(x, y, z); };
    const box8 = [];
    for (const u of [0, LEN]) for (const n of [0, T]) for (const y of [-W, W]) box8.push(q(u, n, y));
    ramp.setAttribute("d", poly(hull(box8)));
    face.setAttribute("d", poly([q(2, 0, -W + 2), q(LEN - 2, 0, -W + 2), q(LEN - 2, 0, W - 2), q(2, 0, W - 2)]));
    let d = "";
    for (let i = 1; i <= N; i++) { const u = (i / (N + 1)) * LEN; d += "M" + q(u, 0, -W + 2).join(",") + "L" + q(u, 0, W - 2).join(","); }
    cleats.setAttribute("d", d);
    const [mx, mz] = at(a, LEN * 0.6, T);
    strut.setAttribute("d", "M" + P(18, 0, 13).join(",") + "L" + P(mx, 0, mz).join(",") + "M" + P(18, -6, 13).join(",") + "L" + P(mx, -6, mz).join(","));
    const [hx, hy] = P(PX, W + 1, PZ);
    hinge.setAttribute("cx", hx); hinge.setAttribute("cy", hy);
  }

  const B = register(stage, (dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 150 || sy < 15 || sy > 305) return leave();
    tset(ang, top, performance.now(), 0);
    read.textContent = "ramp " + Math.round(top) + "°";
    B.wake();
  }
  function leave() { tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 16, 36); }, destroy: bag.dispose };
}

hairline({
  name: "beltloader",
  means: "An airport belt loader: over it the conveyor ramp's nose rises toward the hold door; the slider sets the ramp's top angle.",
  rules: [3, 5, 8],
  range: [16, 26, 36],
  tour: [[221, 171], [124, 131], [287, 132], null],
  mount,
});
