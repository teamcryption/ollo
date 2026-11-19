/**
 * Ironing board cupboard: a tall shallow cupboard on a wall, an ironing
 * board stored upright inside on a hinge. The pointer on the cupboard swings
 * the door wide, then the board folds down out of it on its brace to lie
 * level. At rest the door stands ajar, the board bright. The slider is how
 * far the board comes down.
 */
const {
  Cam, fit, proj, hull, poly, seg, rrect, fillet, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid,
} = HL;

const W = 34, D = 10, Z0 = 20, Z1 = 128, YH = 6, ZH = 52, L = 72, BW = 12;
// a slab from a flat outline [[a, c]]: two layers along b, its hull and an inset crease on the b1 face
function slab(P, s, m, ring, b0, b1, inner) {
  const pts = [];
  for (const [a, c] of ring) pts.push(P(...m(a, b0, c)), P(...m(a, b1, c)));
  s.sil.setAttribute("d", poly(hull(pts)));
  if (inner) s.cr.setAttribute("d", poly(inner.map(([a, c]) => P(...m(a, b1, c)))));
}
const rr = (a0, c0, a1, c1, r) => rrect(a0, c0, a1, c1, r, 4).map((q) => [q.u, q.v]);
const board = (w, l, i) => fillet([[-w + i, i], [w - i, i], [w - i, l - 30], [3, l - i], [-3, l - i], [-w + i, l - 30]], [2, 2, 8, 3, 3, 8], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.9);
  const FIT = [[-30, -3, 10], [W + 30, -3, Z1 + 6], [W / 2 + BW, YH + L + 4, ZH], [-W * 0.4, D + W, Z0], [-W * 0.4, D + W, Z1], [W + 30, 0, 10], [-30, -3, Z1 + 6]];
  fit(C, FIT, 200, 164);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const id = (a, b, c) => [a, b, c];
  // the wall, the cupboard body and its open front
  slab(P, solid(g), id, rr(-30, 10, W + 30, Z1 + 6, 3), -3, 0, rr(-28, 12, W + 28, Z1 + 4, 2));
  slab(P, solid(g), id, rr(0, Z0, W, Z1, 2), 0, D, rr(2.5, Z0 + 2.5, W - 2.5, Z1 - 2.5, 1));
  const strut = mk("path", { class: "nf" }, g);
  const bd = solid(g);
  bd.sil.classList.add("hi");
  const door = solid(g), knob = solid(g);
  const dg = [door.g, knob.g];

  const sw = tween(52), fold = tween(4);
  let last = "";
  function draw(ps, ph) {
    const key = ps.toFixed(2) + "/" + ph.toFixed(2);
    if (key === last) return;
    last = key;
    const c = Math.cos(rad(ph)), s = Math.sin(rad(ph));
    const mb = (a, b, z) => [W / 2 + a, YH + z * s + b * c, ZH + z * c - b * s];
    slab(P, bd, mb, board(BW, L, 0), -2.5, 0, board(BW, L, 1.6));
    const tip = mb(0, -2.5, 36);
    strut.setAttribute("d", seg(P(W / 2 - 4, 3, Z0 + 3), P(tip[0] - 4, tip[1], tip[2])) + seg(P(W / 2 + 4, 3, Z0 + 3), P(tip[0] + 4, tip[1], tip[2])));
    const dc = Math.cos(rad(ps)), ds = Math.sin(rad(ps));
    const md = (a, b, z) => [a * dc - b * ds, D + a * ds + b * dc, z];
    slab(P, door, md, rr(0.5, Z0 + 0.5, W - 0.5, Z1 - 0.5, 2), 0, 2, rr(3, Z0 + 3, W - 3, Z1 - 3, 1));
    slab(P, knob, md, rr(W - 6, 68, W - 3.5, 82, 1.2), 2, 4, null);
    // the door paints behind the board once it has swung past the cupboard's side
    if (ps > 70 && dg[0].nextSibling !== bd.g) { g.insertBefore(dg[0], bd.g); g.insertBefore(dg[1], bd.g); }
    if (ps <= 70 && dg[1].nextSibling) { g.appendChild(dg[0]); g.appendChild(dg[1]); }
  }
  const B = register(stage, (_dt, now) => {
    draw(tval(sw, now), tval(fold, now));
    return !(tdone(sw, now) && tdone(fold, now));
  });
  bag.add(B.unregister);

  // hit: the cupboard's rest box on screen, fixed
  const bx = [[0, D, Z0], [W, D, Z0], [W, D, Z1], [0, D, Z1], [-W * 0.6, D + W * 0.8, Z0]].map((p) => P(...p));
  const x0 = Math.min(...bx.map((p) => p[0])), x1 = Math.max(...bx.map((p) => p[0]));
  const y0 = Math.min(...bx.map((p) => p[1])), y1 = Math.max(...bx.map((p) => p[1]));
  const hit = ([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1;

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const now = performance.now(), a = clamp(max, 30, 90);
    tset(sw, v ? 112 : 52, now, v ? 0 : 420);
    tset(fold, v ? a : 4, now, v ? 260 : 0);
    read.textContent = v ? "down " + Math.round(a) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "ironingcupboard",
  means: "A wall cupboard holding an ironing board: the pointer swings the door open and the board folds down level on its brace.",
  rules: [1, 3, 5, 8],
  range: [30, 90, 90],
  tour: [[203, 159], [216, 112], [188, 205], null],
  mount,
});
