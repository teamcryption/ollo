/**
 * Bondbox: a certificate folder on a desk, a board base holding a bond with
 * a round seal, and a cover hinged along its far edge. At rest the cover
 * stands ajar, bright. The pointer over the folder swings the cover open to
 * show the bond, and the seal takes the bright. The slider is how far it opens.
 */
const {
  Cam, circ, fit, facing, fillet, hull, poly, open, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 92, D = 66, H = 5, REST = 18;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -8, H + D], [W, -8, H + D]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [cr, ci] = rings(9, 8, W - 7, D - 8, 2, 1);
  put(solid(g), prism(P, front, cr, ci, H, H + 1.4));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rings(14, 13, W - 12, D - 13, 2, 1)[0], H + 1.4)) }, g);
  const seal = mk("path", { class: "nf", d: poly(ringAt(P, disc(W - 26, D - 24, 7), H + 1.4)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(W - 26, D - 24, 4), H + 1.4)) }, g);
  const lid = mk("path", { class: "sil" }, g), lidTop = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  const corners = [[0, 0], [W, 0], [W, D], [0, D]];
  function lay(a, dz) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return fillet(corners.map(([x, y]) => P(x, y * c - dz * s, H + 2.4 + y * s + dz * c)), [4, 4, 4, 4]);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const top = lay(a, 0), bot = lay(a, -2.2);
    lid.setAttribute("d", poly(hull(top.concat(bot))));
    lidTop.setAttribute("d", poly(a > 60 ? bot : top));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? maxA : REST, performance.now(), 0);
    lid.classList.toggle("hi", !v);
    seal.classList.toggle("hi", v);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 0); return x > -8 && x < W + 8 && y > -8 && y < D + 8; }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "bondbox",
  means: "A certificate folder: the pointer over it swings the cover open to show the bond and its seal.",
  rules: [1, 4, 5, 6],
  range: [50, 78, 90],
  tour: [[194, 227], [174, 200], [214, 280], null],
  mount,
});
