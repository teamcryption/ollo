/**
 * Bottle bank: a street glass bank with a round porthole and a rubber flap.
 * The pointer over it tips a big bottle neck-first into the porthole while
 * the flap swings in; leaving lets the bottle stand back up beside it,
 * bright. The slider is how far the bottle tips.
 *
 * The pattern: one part answering presence (a pivot).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, clamp, lerp, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 70, Y1 = 56, Z1 = 60, PX = 35, PZ = 46, PR = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-4, -4, 0], [X1 + 4, Y1 + 4, 0], [X1, 0, Z1 + 8], [0, Y1, Z1], [PX, Y1 + 40, 0], [PX, Y1 + 30, PZ + 26]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z1));
  const [tr, ti] = rings(6, 6, X1 - 6, Y1 - 6, 10, 2);
  put(solid(g), prism(P, front, tr, ti, Z1, Z1 + 5));
  const circ3 = (cx, cz, r, y) => { const a = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; a.push(P(cx + r * Math.cos(t), y, cz + r * Math.sin(t))); } return a; };
  mk("path", { d: poly(circ3(PX, PZ, PR + 2.5, Y1)), class: "nf" }, g);
  mk("path", { d: poly(circ3(PX, PZ, PR, Y1)) }, g);
  const flap = mk("path", { class: "nf lo" }, g);
  mk("path", { d: poly([P(10, Y1, 8), P(60, Y1, 8), P(60, Y1, 24), P(10, Y1, 24)]), class: "nf lo" }, g);
  const bottle = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf" }, g);
  const tw = tween(0.12);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const fa = rad(lerp(0, 70, clamp(t * 1.6, 0, 1)));
    flap.setAttribute("d", poly([P(PX - PR, Y1, PZ + PR), P(PX + PR, Y1, PZ + PR), P(PX + PR, Y1 - Math.sin(fa) * 2 * PR, PZ + PR - Math.cos(fa) * 2 * PR), P(PX - PR, Y1 - Math.sin(fa) * 2 * PR, PZ + PR - Math.cos(fa) * 2 * PR)]));
    // bottle: base point and axis; upright beside the bank at 0, tipped neck-down into the porthole at 1
    const a = rad(lerp(0, 125, t)), base = [PX, lerp(Y1 + 26, Y1 + 30, t), lerp(2, PZ + 4, t) + Math.sin(a) * 6];
    const d = [0, -Math.sin(a), Math.cos(a)], e1 = [1, 0, 0], e2 = [0, d[2], -d[1]];
    const pts = [], lp = [];
    for (const [s, r] of [[0, 8], [22, 8], [28, 5], [31, 3], [40, 3]]) for (let i = 0; i < 20; i++) {
      const q = (i / 20) * Math.PI * 2, c = Math.cos(q) * r, n = Math.sin(q) * r;
      const p = P(base[0] + d[0] * s + e1[0] * c + e2[0] * n, base[1] + d[1] * s + e1[1] * c + e2[1] * n, base[2] + d[2] * s + e1[2] * c + e2[2] * n);
      pts.push(p); if (s === 40) lp.push(p);
    }
    bottle.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(lp));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(X1 / 2, Y1 / 2, Z1 / 2);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? maxT : 0.12, performance.now(), 0);
    read.textContent = o ? "glass in" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - mid[0]) < 120 && Math.abs(sy - mid[1]) < 110), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = clamp(v, 0.4, 1); if (on) { tset(tw, maxT, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "recyclebank",
  means: "A street bottle bank: the pointer tips a bottle neck-first into the porthole as the rubber flap swings in.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[159, 128], [215, 200], [105, 200], null],
  mount,
});
