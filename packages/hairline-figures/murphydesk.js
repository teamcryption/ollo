/**
 * Fold-down wall desk: a shallow cabinet hung on a wall, its front a flap
 * hinged at the bottom, pigeonholes behind it, two stays at its sides. The
 * pointer on the cabinet lowers the flap on its stays into a level desk.
 * At rest the flap stands a little open, bright. The slider is how far the
 * flap comes down.
 */
const {
  Cam, fit, proj, hull, poly, seg, rrect, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register, solid,
} = HL;

const W = 66, D = 16, Z0 = 74, H = 50, FT = 2.6, REST = 16;
function slab(P, s, m, ring, b0, b1, ins) {
  const pts = [];
  for (const q of ring) pts.push(P(...m(q.u, b0, q.v)), P(...m(q.u, b1, q.v)));
  s.sil.setAttribute("d", poly(hull(pts)));
  if (ins) s.cr.setAttribute("d", poly(ins.map((q) => P(...m(q.u, b1, q.v)))));
}
const rr = (a0, c0, a1, c1, r) => rrect(a0, c0, a1, c1, r, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.95);
  const FIT = [[-16, -3, 30], [-16, -3, Z0 + H + 22], [W + 16, -3, 30], [W + 16, -3, Z0 + H + 22], [0, D + H + 2, Z0], [W, D + H + 2, Z0 - 4]];
  fit(C, FIT, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const wall = (a, b, c) => [a, b, c];
  slab(P, solid(g), wall, rr(-16, 30, W + 16, Z0 + H + 22, 3), -3, 0, rr(-14, 32, W + 14, Z0 + H + 20, 2));
  slab(P, solid(g), wall, rr(0, Z0, W, Z0 + H, 2.5), 0, D, rr(2.5, Z0 + 2.5, W - 2.5, Z0 + H - 2.5, 1));
  // pigeonholes and a shelf behind the flap
  const F = (x0, x1, z0, z1) => poly([P(x0, D, z0), P(x1, D, z0), P(x1, D, z1), P(x0, D, z1)]);
  let d = F(6, W - 6, Z0 + 6, Z0 + 16);
  for (let i = 0; i < 5; i++) d += F(6 + i * 11, 15 + i * 11, Z0 + 22, Z0 + H - 6);
  mk("path", { d, class: "nf lo" }, g);
  const stays = mk("path", { class: "nf" }, g);
  const flap = solid(g), lock = solid(g);
  flap.sil.classList.add("hi");

  const ang = tween(REST);
  let last = NaN;
  function draw(ph) {
    if (ph === last) return;
    last = ph;
    const c = Math.cos(rad(ph)), s = Math.sin(rad(ph));
    const m = (a, b, z) => [a, D + z * s + b * c, Z0 + z * c - b * s];
    // the face that shows: the outer one while upright, the writing top once down
    const out = ph < 45;
    slab(P, flap, (a, b, z) => m(a, b, z - Z0), rr(0.5, Z0, W - 0.5, Z0 + H - 0.5, 2.2), out ? 0 : FT, out ? FT : 0, rr(3, Z0 + 3, W - 3, Z0 + H - 3.5, 1));
    slab(P, lock, (a, b, z) => m(a, b, z - Z0), rr(W / 2 - 4, Z0 + H - 7, W / 2 + 4, Z0 + H - 4, 1), FT, FT + 1.6, null);
    if (out !== (lock.g.previousSibling === flap.g)) { if (out) flap.g.after(lock.g); else flap.g.before(lock.g); }
    const k = 0.72 * H;
    stays.setAttribute("d", [3, W - 3].map((x) => { const e = m(x, 0, k); return seg(P(x, D - 4, Z0 + H - 12), P(...e)); }).join(""));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit: the cabinet's rest box on screen, fixed
  const bx = [[0, D, Z0], [W, D, Z0], [W, D, Z0 + H], [0, D, Z0 + H], [0, 0, Z0 + H], [W, 0, Z0]].map((p) => P(...p));
  const x0 = Math.min(...bx.map((p) => p[0])), x1 = Math.max(...bx.map((p) => p[0]));
  const y0 = Math.min(...bx.map((p) => p[1])), y1 = Math.max(...bx.map((p) => p[1])) + 10;
  const hit = ([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1;

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    const a = clamp(max, 30, 90);
    tset(ang, v ? a : REST, performance.now(), 0);
    read.textContent = v ? "desk " + Math.round(a) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "murphydesk",
  means: "A wall-hung cabinet whose front flap folds down on two stays into a level desk, pigeonholes behind it.",
  rules: [1, 3, 5, 8],
  range: [30, 90, 90],
  tour: [[212, 142], [180, 170], [244, 150], null],
  mount,
});
