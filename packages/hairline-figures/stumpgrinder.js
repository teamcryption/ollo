/**
 * Stump grinder: a squat chassis on two wheels with an engine box and a pair
 * of handlebars, and a long arm out front carrying the toothed cutting wheel
 * under its hood. Over the machine the arm swings the wheel sideways across
 * the cut on the 700ms ease; leaving swings it back, the wheel bright. The
 * slider is the swing angle.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 12, L = 44, PZ = 15, R = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.15);
  const pts = [[-62, -16, 0], [-62, 16, 44], [-40, 16, 0]];
  for (const a of [REST, -60]) { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); pts.push([L * c, L * s, PZ + R + 4], [L * c + 18 * c, L * s + 18 * s, 0], [L * c - 18 * c, L * s - 18 * s, 0]); }
  fit(C, pts, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y) => { const w = []; for (let i = 0; i < 18; i++) { const t = (i / 18) * Math.PI * 2; w.push(P(x + 8 * Math.cos(t), y, 8 + 8 * Math.sin(t))); } mk("path", { d: poly(w) }, g); };
  wheel(-26, -15);
  const bars = mk("path", { class: "nf" }, g);
  bars.setAttribute("d", [-8, 8].map((y) => "M" + P(-40, y, 20).join(",") + "L" + P(-60, y * 1.3, 42).join(",")).join("") + "M" + P(-60, -10.4, 42).join(",") + "L" + P(-60, 10.4, 42).join(","));
  box(-42, -12, 2, 12, 3, 1.2, 8, 20);
  box(-36, -10, -10, 10, 3, 1.2, 20, 34);
  box(-4, -6, 6, 6, 3, 1, 20, 24);
  wheel(-26, 15);
  const arm = mk("path", {}, g);
  const disc = mk("path", { class: "sil hi" }, g), teeth = mk("path", { class: "lo nf" }, g);
  const hood = mk("path", {}, g);
  const hub = mk("circle", { class: "dot m", r: 2.2 }, g);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const q = (u, n, z) => P(u * c - n * s, u * s + n * c, z);
    const ab = [];
    for (const u of [0, L]) for (const n of [-3, 3]) for (const z of [PZ - 3, PZ + 3]) ab.push(q(u, n, z));
    arm.setAttribute("d", poly(hull(ab)));
    const dp = [], hp = [];
    let t = "";
    for (let i = 0; i < 24; i++) {
      const th = (i / 24) * Math.PI * 2, cu = Math.cos(th), sz = Math.sin(th);
      for (const n of [-2.5, 2.5]) dp.push(q(L + R * cu, n, PZ + R * sz));
      if (i % 2 === 0) t += "M" + q(L + R * cu, 3.2, PZ + R * sz).join(",") + "L" + q(L + (R - 3) * cu, 3.2, PZ + (R - 3) * sz).join(",");
      if (sz >= -0.01) for (const n of [-5, 5]) hp.push(q(L + (R + 3) * cu, n, PZ + (R + 3) * sz), q(L + 5 * cu, n, PZ + 5 * sz));
    }
    disc.setAttribute("d", poly(hull(dp)));
    teeth.setAttribute("d", t);
    hood.setAttribute("d", poly(hull(hp)));
    const [hx, hy] = q(L, 3, PZ);
    hub.setAttribute("cx", hx); hub.setAttribute("cy", hy);
  }

  const B = register(stage, (dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 160 || sy < 10 || sy > 310) return leave();
    tset(ang, -top, performance.now(), 0);
    read.textContent = "swing " + Math.round(top) + "°";
    B.wake();
  }
  function leave() { tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 20, 60); }, destroy: bag.dispose };
}

hairline({
  name: "stumpgrinder",
  means: "A stump grinder: over it the arm swings the toothed cutting wheel sideways across the cut; the slider sets the swing angle.",
  rules: [3, 5, 8],
  range: [20, 40, 60],
  tour: [[247, 176], [286, 124], [84, 77], null],
  mount,
});
