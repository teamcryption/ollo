/**
 * Road blocker: a steel wedge plate hinged in a pit across a road. As the
 * pointer comes up the road toward it, the plate tilts up on its ram, its
 * free edge rising to block the lane. At rest it stands a little raised,
 * bright. The slider is the full tilt.
 *
 * The pattern: a barrier answering how near the pointer is (spring).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, rrect, seg,
  disposer, mk, pointer, put, register, solid, spring, stepS, unproj, rad,
} = HL;

const SZ = 6, HX = 104, L = 62, W = 64, Y0 = 18, T = 4, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let H = value;
  const C = Cam(45, 0.5, 1.9);
  const a1 = rad(56);
  fit(C, [[0, 0, 0], [150, 100, 0], [150, 0, 0], [0, 100, 0], [HX - L * Math.cos(a1), Y0, SZ + L * Math.sin(a1) + 4], [HX - L * Math.cos(a1), Y0 + W, SZ + L * Math.sin(a1) + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(0, 0, 150, 100, 8, 2);
  put(solid(g), prism(P, front, rr, ri, 0, SZ));
  for (const y of [6, 94]) mk("path", { d: open([P(8, y, SZ), P(142, y, SZ)]), class: "nf lo" }, g);
  // the pit the plate folds into
  mk("path", { d: poly(rrect(HX - L - 2, Y0 - 2, HX + 2, Y0 + W + 2, 3, 3).map((q) => P(q.u, q.v, SZ))), class: "nf lo" }, g);
  mk("path", { d: open([P(HX + 14, 8, SZ), P(HX + 14, 92, SZ)]), class: "dash" }, g);
  const ram = mk("path", { class: "nf" }, g);
  const plate = solid(g);
  const outer = rrect(0, 0, L, W, 3, 4), inner = rrect(2.2, 2.2, L - 2.2, W - 2.2, 1.5, 4);
  const pt = (a, u, v, h) => P(HX - u * Math.cos(a) + h * Math.sin(a), Y0 + v, SZ + u * Math.sin(a) + h * Math.cos(a));
  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const a = rad(Math.max(ang.x, 0));
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const pts = [];
    for (const q of outer) { pts.push(pt(a, q.u, q.v, 0)); pts.push(pt(a, q.u, q.v, T)); }
    put(plate, { sil: poly(hull(pts)), crease: poly(inner.map((q) => pt(a, q.u, q.v, T))) });
    let d = "";
    for (const v of [W * 0.3, W * 0.7]) {
      d += seg(P(HX - L * 0.62, Y0 + v, SZ), pt(a, L * 0.55, v, 0)) + seg(P(HX - L * 0.62 + 2, Y0 + v, SZ), pt(a, L * 0.55 + 2, v, 0));
    }
    ram.setAttribute("d", d);
  }
  draw();
  plate.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let f = -1;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], SZ);
      if (x > -10 && x < 160 && y > -10 && y < 110) f = 1 - clamp((Math.abs(x - (HX - L / 2)) - 20) / 70, 0, 0.85);
    }
    ang.t = f < 0 ? REST : REST + (H - REST) * f;
    read.textContent = f < 0 ? "rest" : "up " + Math.round(ang.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { H = v; }, destroy: bag.dispose };
}

hairline({
  name: "roadblocker",
  means: "A wedge road blocker in its pit: as the pointer comes up the road the steel plate tilts up on its rams to bar the lane.",
  rules: [1, 3, 4, 5],
  range: [24, 46, 56],
  tour: [[113, 134], [197, 166], [236, 188], null],
  mount,
});
