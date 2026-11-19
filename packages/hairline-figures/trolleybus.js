/**
 * Trolleybus: a long rounded body on two axles with a roof pod, two trolley
 * poles trailing back from a pivot on the pod, and two overhead wires above.
 * The nearer the pointer comes, the further the poles swing up off the roof
 * until their shoes meet the wires. At rest the poles lie low and bright.
 * The slider sets how far the poles rise.
 */
const {
  Cam, circ, clamp, fit, facing, lerp, open, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 22, PZ = 52, L = 92, A0 = 5, A1 = 30, REST = 0, WZ = PZ + L * Math.sin(rad(A1));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  const tx1 = PX - L * Math.cos(rad(A1));
  fit(C, [[-64, -16, 0], [64, 16, 0], [64, -16, 48], [-64, 16, 0], [tx1 - 20, -8, WZ], [50, 8, WZ]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "nf lo", d: [-7, 7].map((y) => seg(P(tx1 - 20, y, WZ), P(50, y, WZ))).join("") }, g);
  const wheel = (x, y) => { const pts = circ(9, 18).map((q) => P(x + q.u, y, 9 + q.v)); return mk("path", { class: "sil", d: poly(pts) + seg(P(x, y, 9), P(x + 3, y, 9)) }, g); };
  [-36, 38].forEach((x) => wheel(x, -14));
  const [br, bi] = rings(-62, -15, 62, 15, 7, 1.6);
  put(solid(g), prism(P, front, br, bi, 8, 48));
  mk("path", { class: "nf lo", d: open([P(-56, 15, 26), P(56, 15, 26)]) + open([P(-56, 15, 42), P(56, 15, 42)]) + open([P(62, -11, 26), P(62, -11, 42), P(62, 11, 42), P(62, 11, 26)]) + [-30, -6, 18, 40].map((x) => seg(P(x, 15, 26), P(x, 15, 42))).join("") }, g);
  const [pr, pi] = rings(-6, -10, 28, 10, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 48, PZ));
  [-36, 38].forEach((x) => wheel(x, 14));
  const poles = [-7, 7].map(() => mk("path", { class: "sil hi" }, g));
  const bar = (y, th) => {
    const dx = -Math.cos(th), dz = Math.sin(th), ox = -dz * 1.6, oz = dx * 1.6;
    const tx = PX + L * dx, tz = PZ + L * dz;
    return poly([P(PX + ox, y, PZ + oz), P(tx + ox, y, tz + oz), P(tx - ox, y, tz - oz), P(PX - ox, y, PZ - oz)]) +
      seg(P(tx - 5, y, tz + 3), P(tx + 5, y, tz + 3)) + seg(P(tx, y, tz), P(tx, y, tz + 3));
  };

  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const th = rad(lerp(A0, A1, p));
    poles[0].setAttribute("d", bar(-7, th));
    poles[1].setAttribute("d", bar(7, th));
  }

  const lift = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);
  const ax = P(-10, 0, 40);

  function aim(pt) {
    const d = Math.hypot(pt[0] - ax[0], (pt[1] - ax[1]) * 0.7);
    if (d > 160) return leave();
    lift.t = clamp(1.25 - d / 120, 0.15, 1) * (0.3 + 0.7 * reach / 100);
    read.textContent = Math.round(lerp(A0, A1, lift.t)) + "°";
    B.wake();
  }
  function leave() { lift.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "trolleybus",
  means: "A trolleybus: the nearer the pointer, the further its two trolley poles swing up off the roof to meet the overhead wires.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 100],
  tour: [[167, 155], [205, 190], [126, 138], null],
  mount,
});
