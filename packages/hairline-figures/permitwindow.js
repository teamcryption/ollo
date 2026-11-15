/**
 * Service counter: a thick wall with a hatch opening, a counter ledge
 * under it and a bell on the ledge. The hatch is hinged along its top and
 * swings up and out like an awning as the pointer comes near the counter,
 * falling shut as it goes. At rest it is propped a little open, bright.
 * The slider is how far it rests open.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, clamp, rad, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 96, T = 8, H = 84, X0 = 24, X1 = 72, ZB = 34, ZT = 68, HL_ = ZT - ZB, MAX = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rest = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-3, -3, 0], [W + 3, T + 26, 0], [W, 0, H + 3], [0, T + HL_ + 4, ZT], [W, T + 26, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const add = (x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  add(-3, -3, W + 3, T + 3, 0, 3, 2, 1);
  add(0, 0, W, T, 3, H, 2, 1);
  mk("path", { d: poly([P(X0, T, ZB), P(X1, T, ZB), P(X1, T, ZT), P(X0, T, ZT)]) }, g);
  mk("path", { class: "nf lo", d: poly([P(X0, 0, ZB), P(X1, 0, ZB), P(X1, 0, ZT), P(X0, 0, ZT)]) + seg(P(X0, 0, ZT), P(X0, T, ZT)) + seg(P(X0, 0, ZB), P(X0, T, ZB)) + seg(P(X1, 0, ZT), P(X1, T, ZT)) }, g);
  add(X0 - 6, T, X1 + 6, T + 22, ZB - 4, ZB, 2, 1);
  const bell = ringAt(P, circ(4.5, 20).map((q) => ({ ...q, u: q.u + X1 - 6, v: q.v + T + 13 })), ZB);
  const top = ringAt(P, circ(1.5, 12).map((q) => ({ ...q, u: q.u + X1 - 6, v: q.v + T + 13 })), ZB + 5);
  mk("path", { d: poly(hull(bell.concat(top))) }, g);
  const hatch = mk("path", { class: "sil hi" }, g), slats = mk("path", { class: "nf lo" }, g), prop = mk("path", { class: "nf" }, g);

  const A = spring(rest);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), y = T + 0.5 + HL_ * Math.sin(a), z = ZT - HL_ * Math.cos(a), yt = T + 0.5;
    hatch.setAttribute("d", poly([P(X0, yt, ZT), P(X1, yt, ZT), P(X1, y, z), P(X0, y, z)]));
    let d = "";
    for (let k = 1; k < 5; k++) { const t = k / 5; d += seg(P(X0 + 2, yt + (y - yt) * t, ZT + (z - ZT) * t), P(X1 - 2, yt + (y - yt) * t, ZT + (z - ZT) * t)); }
    slats.setAttribute("d", d);
    prop.setAttribute("d", seg(P(X0 + 3, T + 1, ZB), P(X0 + 3, y, z)) + seg(P(X1 - 3, T + 1, ZB), P(X1 - 3, y, z)));
  }
  draw(rest);
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);

  const mid = [(X0 + X1) / 2, T + 20];
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZB);
    const t = clamp(1 - Math.hypot(x - mid[0], y - mid[1]) / 90, 0, 1);
    A.t = clamp(rest + (MAX - rest) * t * 1.5, rest, MAX);
    read.textContent = "open " + Math.round(A.t) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { A.t = rest; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rest = v; A.t = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "permitwindow",
  means: "A service counter in a thick wall: its hatch swings up and out like an awning as the pointer nears the ledge.",
  rules: [1, 3, 5, 8],
  range: [8, 18, 34],
  tour: [[44, 159], [193, 156], [282, 203], null],
  mount,
});
