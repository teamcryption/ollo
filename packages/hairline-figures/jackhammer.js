/**
 * Jackhammer: a pneumatic breaker standing on its chisel in a slab of road,
 * a fat cylinder body, an air hose stub and a wide T-handle. The nearer the
 * pointer comes, the further the whole body drives down its chisel into the
 * slab and the grips spread. At rest it is half pressed, handle bright. The
 * slider sets how far the stroke goes.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const SZ = 6, BIT = 30, BODY = 44, REST = 0.3;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stroke = value;
  const C = Cam(45, 0.5, 2.2);
  const TOP = SZ + BIT + BODY + 14;
  fit(C, [[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0], [-24, 0, TOP], [24, 0, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-26, -26, 26, 26, 5, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  mk("path", { class: "nf lo", d: seg(P(3, 2, SZ), P(14, 9, SZ)) + seg(P(14, 9, SZ), P(21, 6, SZ)) + seg(P(-3, 4, SZ), P(-6, 17, SZ)) + seg(P(-3, -3, SZ), P(-14, -10, SZ)) }, g);
  const chips = [[8, -4], [-7, 6], [6, 8], [-6, -7]].map(([x, y]) => ({ x, y, el: flatDot(g, C, 1.6, "dot off") }));
  const bit = mk("path", { class: "sil" }, g), collar = solid(g), body = solid(g), neck = solid(g), handle = solid(g);
  const hose = mk("path", { class: "nf lo" }, g);
  handle.sil.classList.add("hi");
  const [cr, ci] = rings(-6, -6, 6, 6, 5, 1), [br, bi] = rings(-10, -10, 10, 10, 9, 1.6), [nr, ni] = rings(-3.5, -3.5, 3.5, 3.5, 3, 0.8);

  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const drop = BIT * 0.7 * p, zb = SZ + BIT - drop, top = zb + 6 + BODY;
    bit.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 2.6), SZ).concat(ringAt(P, disc(0, 0, 2.6), zb)))));
    put(collar, prism(P, front, cr, ci, zb, zb + 6));
    put(body, prism(P, front, br, bi, zb + 6, top));
    put(neck, prism(P, front, nr, ni, top, top + 6));
    const w = 18 + 4 * p, [hr, hh] = rings(-w, -2.5, w, 2.5, 2.4, 0.7);
    put(handle, prism(P, front, hr, hh, top + 6, top + 10));
    hose.setAttribute("d", seg(P(8, 6, top - 8), P(18, 14, top - 12)) + seg(P(18, 14, top - 12), P(22, 20, SZ + 2)));
    chips.forEach((c, i) => {
      const up = p * (5 + i * 3);
      place(c.el, P(c.x * (0.6 + p), c.y * (0.6 + p), SZ + up));
      c.el.setAttribute("class", p > 0.6 && i === 0 ? "dot m" : "dot off");
    });
  }

  const press = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(press, dt); draw(press.x); return m; });
  bag.add(B.unregister);
  const ax = P(0, 0, SZ + 40);

  function aim(pt) {
    const d = Math.hypot(pt[0] - ax[0], (pt[1] - ax[1]) * 0.5);
    if (d > 110) return leave();
    const f = clamp(1 - d / 110, 0.1, 1) * (0.35 + 0.65 * stroke / 100);
    press.t = clamp(f * 1.3, REST * 0.5, 1);
    read.textContent = Math.round(press.t * BIT * 0.7) + " mm";
    B.wake();
  }
  function leave() { press.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stroke = v; }, destroy: bag.dispose };
}

hairline({
  name: "jackhammer",
  means: "A breaker on its chisel in a slab of road: the nearer the pointer, the further the body drives down the chisel and chips fly.",
  rules: [1, 3, 5, 8],
  range: [0, 60, 100],
  tour: [[200, 130], [200, 204], [214, 170], null],
  mount,
});
