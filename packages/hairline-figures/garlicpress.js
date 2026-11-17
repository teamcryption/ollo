/**
 * Garlic press: a lower handle with its hopper and an upper handle on a hinge
 * at the far end, its plunger plate over the hopper. The pointer over the press
 * swings the upper handle open; at rest it stands a little open, bright.
 * The hit is a fixed screen box, so it never moves with the drawing.
 */
const {
  Cam, fit, hull, poly, proj, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const id = (x, y, z) => [x, y, z];
const corners = (P, c, f) => { const o = []; for (const x of [c[0], c[1]]) for (const y of [c[2], c[3]]) for (const z of [c[4], c[5]]) { const w = f(x, y, z); o.push(P(w[0], w[1], w[2])); } return o; };
const box = (P, c, f = id) => poly(hull(corners(P, c, f)));
const lid = (P, c, f = id) => poly([[c[0], c[2]], [c[1], c[2]], [c[1], c[3]], [c[0], c[3]]].map(([x, y]) => { const w = f(x, y, c[5]); return P(w[0], w[1], w[2]); }));
function slab(g, P, c, f) { mk("path", { class: "sil", d: box(P, c, f) }, g); mk("path", { class: "nf lo", d: lid(P, c, f) }, g); }

const REST = 12, OPEN = 30, HX = -40, HZ = 18;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.1);
  const tip = rad(REST + OPEN * 1.1);
  fit(C, [[-44, -10, 0], [44, 10, 0], [-44, 10, 0], [44, -10, 0], [HX + 84 * Math.cos(tip), 0, HZ + 84 * Math.sin(tip) + 3]], 200, 172);
  const P = proj(C);
  const g = mk("g", {}, svg);
  slab(g, P, [-44, 44, -5, 5, 0, 4], id);
  slab(g, P, [-38, -14, -10, 10, 4, 16], id);
  mk("path", { class: "nf lo", d: lid(P, [-35, -17, -7, 7, 0, 16], id) }, g);
  const plate = mk("path", { class: "sil" }, g), arm = mk("path", { class: "sil hi" }, g), armTop = mk("path", { class: "nf lo" }, g);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(REST + v * OPEN * amt), c = Math.cos(a), s = Math.sin(a);
    const f = (x, y, z) => [HX + x * c - z * s, y, HZ + x * s + z * c];
    plate.setAttribute("d", box(P, [4, 22, -7, 7, -8, -2], f));
    arm.setAttribute("d", box(P, [0, 84, -4.5, 4.5, -2, 2], f));
    armTop.setAttribute("d", lid(P, [0, 84, -4.5, 4.5, -2, 2], f));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 125 && Math.abs(sy - 165) < 140), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "garlicpress",
  means: "A garlic press: the pointer swings its upper handle open on the hinge, lifting the plunger out of the hopper.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.1],
  tour: [[244, 181], [82, 202], [255, 79], null],
  mount,
});
