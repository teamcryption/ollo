/**
 * Nutmeg grater: a rotary grater, a ribbed drum on a foot with a spindle on
 * top and a crank arm with an upright knob. The pointer over the grater turns
 * the crank half a turn; at rest the knob stands to the right, bright.
 * The hit is a fixed screen box, so it never moves with the drawing.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const corners = (P, c, f) => { const o = []; for (const x of [c[0], c[1]]) for (const y of [c[2], c[3]]) for (const z of [c[4], c[5]]) { const w = f(x, y, z); o.push(P(w[0], w[1], w[2])); } return o; };
const box = (P, c, f) => poly(hull(corners(P, c, f)));
const lid = (P, c, f) => poly([[c[0], c[2]], [c[1], c[2]], [c[1], c[3]], [c[0], c[3]]].map(([x, y]) => { const w = f(x, y, c[5]); return P(w[0], w[1], w[2]); }));

const REST = -55, TURN = 160, L = 34, TOPZ = 56;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.9);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(L + 6) * Math.cos(a), (L + 6) * Math.sin(a), TOPZ + 18], [19 * Math.cos(a), 19 * Math.sin(a), 0]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 18), disc(0, 0, 16.5), 0, 3));
  const [br, bi] = rings(-13, -13, 13, 13, 13, 1.6);
  put(solid(g), prism(P, front, br, bi, 3, 46));
  for (const z of [14, 24, 34]) mk("path", { class: "nf lo", d: poly(ringAt(P, disc(0, 0, 13), z)) }, g);
  put(solid(g), prism(P, front, disc(0, 0, 16), disc(0, 0, 14), 46, 50));
  put(solid(g), prism(P, front, disc(0, 0, 2.4, 16), null, 50, TOPZ));
  const arm = mk("path", { class: "sil" }, g), armTop = mk("path", { class: "nf lo" }, g), knob = solid(g);
  knob.sil.classList.add("hi");
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(REST + v * TURN * amt), c = Math.cos(a), s = Math.sin(a);
    const f = (x, y, z) => [x * c - y * s, x * s + y * c, TOPZ + z];
    arm.setAttribute("d", box(P, [-4, L, -3, 3, 0, 3.5], f));
    armTop.setAttribute("d", lid(P, [-4, L, -3, 3, 0, 3.5], f));
    put(knob, prism(P, front, disc(L * c, L * s, 5, 24), disc(L * c, L * s, 3.8, 24), TOPZ + 3.5, TOPZ + 18));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "turn" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 125 && Math.abs(sy - 165) < 140), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "nutmeggrater",
  means: "A rotary nutmeg grater: the pointer turns the crank on its top half a turn round the spindle.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[200, 168], [163, 250], [200, 82], null],
  mount,
});
