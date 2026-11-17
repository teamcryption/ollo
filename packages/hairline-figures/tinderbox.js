/**
 * Tinder box: a small tin with a hinged lid and a steel striker lying
 * inside. At rest the lid sits ajar, bright. The pointer over the box
 * swings the lid open on its back hinge to show the striker. The slider
 * is how far the lid opens.
 *
 * The pattern: one hinged part swinging open (swing).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 70, D = 46, H = 26, T = 6, REST = 14;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, -T, H + D], [W, -T, H + D], [0, D, 0], [W, D, 0], [0, 0, 0], [W, D, H + 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const H2 = (pts) => poly(hull(pts.map((p) => P(p[0], p[1], p[2]))));
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g), body = mk("g", {}, g), str = mk("g", {}, g);
  const [r0, r1] = rings(0, 0, W, D, 3, 3);
  put(solid(body), prism(P, front, r0, r1, 0, H));
  // the striker: a flat steel bar with a curled grip, lying inside
  const bar = [];
  for (const x of [14, 52]) for (const y of [16, 26]) for (const z of [H - 3, H + 1]) bar.push([x, y, z]);
  mk("path", { d: H2(bar) }, str);
  mk("path", { d: H2([[52, 16, H - 3], [52, 26, H - 3], [60, 16, H + 5], [60, 26, H + 5], [56, 16, H + 8], [56, 26, H + 8]]) }, str);
  const lid = mk("path", { class: "sil hi" }, lidG), seam = mk("path", { class: "nf lo" }, lidG);
  const th = tween(REST);
  let last = NaN;
  // a point of the lid: v from the hinge toward the front, w up through its thickness
  const L = (x, v, w, a) => [x, v * Math.cos(a) - w * Math.sin(a), H + v * Math.sin(a) + w * Math.cos(a)];
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [];
    for (const x of [0, W]) for (const v of [0, D]) for (const w of [0, T]) pts.push(L(x, v, w, a));
    lid.setAttribute("d", H2(pts));
    seam.setAttribute("d", poly([L(0, D, T, a), L(W, D, T, a), L(W, 0, T, a), L(0, 0, T, a)].map((p) => P(...p))));
    if (deg > 70) g.prepend(lidG); else g.append(lidG);
  }
  const B = register(stage, (_dt, now) => { draw(tval(th, now)); return !tdone(th, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, H / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(th, on ? open : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(th, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "tinderbox",
  means: "A tin tinder box: the pointer swings its hinged lid open on the back hinge to show the steel striker inside.",
  rules: [1, 3, 5, 6],
  range: [60, 105, 120],
  tour: [[153, 192], [299, 196], [90, 231], null],
  mount,
});
