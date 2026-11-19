/**
 * Marble run: a centre post holding a fixed lower chute and, on its top, a
 * long tipping chute that rocks on a pivot like a seesaw, with a marble in
 * its groove. The pointer's side of the post tips the chute down that way
 * and the marble rolls to the low end. At rest the chute leans a little
 * left, the marble bright partway down. The slider is how far it tips.
 *
 * The pattern: one value along a path (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 150, W = 16, R = 7, XC = L / 2, ZP = 74, REST = -0.45;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  const ext = 26;
  fit(C, [[XC - 30, -24, 0], [XC + 30, W + 10, 0], [0, W / 2, ZP + ext + 10], [L, W / 2, ZP + ext + 10], [0, W / 2, ZP - ext - 4], [L, W / 2, ZP - ext]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(XC - 30, -24, XC + 30, W + 10, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const [pr, pi] = rings(XC - 4, -16, XC + 4, -8, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 5, ZP + 2));
  // the fixed lower chute, sloping down to the left
  const lo = (x) => 20 + ((x - 20) / (L - 40)) * 14;
  const ls = solid(g), c0 = [];
  for (const x of [20, L - 20]) for (const y of [0, W]) for (const dz of [-3, 0]) c0.push(P(x, y, lo(x) + dz));
  ls.sil.setAttribute("d", poly(hull(c0)));
  ls.cr.setAttribute("d", seg(P(21, W - 1.5, lo(21) + 1.6), P(L - 21, W - 1.5, lo(L - 21) + 1.6)));
  mk("path", { class: "nf lo", d: seg(P(21, 1.5, lo(21) + 1.6), P(L - 21, 1.5, lo(L - 21) + 1.6)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(XC, -12, 3, 12), ZP - 3)) }, g);
  // the tipping chute and its marble
  const up = solid(g), lip = mk("path", { class: "nf lo" }, g), stops = mk("path", { class: "nf lo" }, g);
  const mg = mk("g", {}, g), ball = mk("path", { class: "sil hi" }, mg), eq = mk("path", { class: "nf lo" }, mg);
  const pin = mk("path", { class: "nf" }, g);

  const tilt = spring(REST), roll = spring(REST);
  const max = () => rad(6 + (value / 100) * 18);
  let last = "";
  function at(x, y, dz, a) { const d = x - XC; return P(XC + d * Math.cos(a), y, ZP + d * Math.sin(a) + dz); }
  function draw() {
    const key = tilt.x.toFixed(4) + roll.x.toFixed(4) + value;
    if (key === last) return;
    last = key;
    const a = -tilt.x * max(), c = [];
    for (const x of [0, L]) for (const y of [0, W]) for (const dz of [-4, 0]) c.push(at(x, y, dz, a));
    up.sil.setAttribute("d", poly(hull(c)));
    up.cr.setAttribute("d", seg(at(1, W - 1.5, 1.6, a), at(L - 1, W - 1.5, 1.6, a)));
    lip.setAttribute("d", seg(at(1, 1.5, 1.6, a), at(L - 1, 1.5, 1.6, a)));
    stops.setAttribute("d", seg(at(3, 1.5, 0, a), at(3, W - 1.5, 0, a)) + seg(at(L - 3, 1.5, 0, a), at(L - 3, W - 1.5, 0, a)));
    pin.setAttribute("d", poly(ringAt(P, disc(XC, W / 2, 2.5, 12), ZP - 2)));
    const x = XC + clamp(roll.x, -1, 1) * (L / 2 - R - 4), d = x - XC;
    const cx = XC + d * Math.cos(a), cz = ZP + d * Math.sin(a) + R;
    const pts = [];
    for (let i = -5; i <= 5; i++) { const b = (i / 5) * (Math.PI / 2); pts.push(...ringAt(P, disc(cx, W / 2, R * Math.cos(b)), cz + R * Math.sin(b))); }
    ball.setAttribute("d", poly(hull(pts)));
    eq.setAttribute("d", seg(P(cx - R * 0.7, W / 2 + R * 0.7, cz), P(cx + R * 0.7, W / 2 + R * 0.7, cz)));
  }

  const B = register(stage, (dt) => { const m1 = stepS(tilt, dt), m2 = stepS(roll, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  const xa = P(0, W / 2, 0)[0], xb = P(L, W / 2, 0)[0], xm = (xa + xb) / 2;
  function move([sx]) {
    const s = clamp((sx - xm) / ((xb - xa) / 2), -1, 1);
    tilt.t = s; roll.t = Math.sign(s) * Math.min(1, Math.abs(s) * 1.6);
    read.textContent = (s < 0 ? "left " : "right ") + Math.round(Math.abs(s) * (6 + (value / 100) * 18)) + "°";
    B.wake();
  }
  function leave() { tilt.t = REST; roll.t = REST; read.textContent = "rest"; B.wake(); }
  draw(); read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { value = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "marblerun",
  means: "A marble run's tipping chute rocks on its post like a seesaw toward the pointer, and the marble rolls down to the low end.",
  rules: [1, 3, 5, 6],
  range: [0, 60, 100],
  tour: [[107, 99], [287, 165], [293, 192], null],
  mount,
});
