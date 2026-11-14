/**
 * Jackhammer: a breaker standing on a square of road, its chisel on the
 * surface, a T-handle on top. The nearer the pointer comes to the tool, the
 * harder it is pressed: the body drives down on its chisel and chips fly up
 * round the bit. At rest it leans its weight a little, handle bright. The
 * slider is how far the pointer reaches.
 *
 * The pattern: one object answering distance (terrain falloff).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const SZ = 10, BIT = 16, BODY = 34, DROP = 10, REST = 0.25;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [-20, 0, SZ + BIT + BODY + 10], [20, 0, SZ + BIT + BODY + 10]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-40, -40, 40, 40, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // cracks on the road round the bit
  mk("path", { class: "nf lo", d: seg(P(3, 2, SZ), P(16, 9, SZ)) + seg(P(16, 9, SZ), P(24, 7, SZ)) + seg(P(-2, 4, SZ), P(-6, 18, SZ)) + seg(P(-3, -3, SZ), P(-15, -10, SZ)) }, g);
  const chips = [[9, -4], [-8, 6], [6, 9], [-6, -8], [12, 3]].map(([x, y]) => ({ x, y, el: flatDot(g, C, 1.6, "dot off") }));
  const bit = mk("path", { class: "sil" }, g), body = solid(g), neck = solid(g), handle = solid(g);
  handle.sil.classList.add("hi");
  const [br, bi] = rings(-8, -7, 8, 7, 5, 1.4), [nr, ni] = rings(-3, -3, 3, 3, 2, 0.6), [hr, hi] = rings(-20, -2, 20, 2, 2, 0.6);

  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const zb = SZ + BIT - DROP * p, top = zb + BODY;
    bit.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 2.2), SZ).concat(ringAt(P, disc(0, 0, 2.2), zb)))));
    put(body, prism(P, front, br, bi, zb, top));
    put(neck, prism(P, front, nr, ni, top, top + 6));
    put(handle, prism(P, front, hr, hi, top + 6, top + 9));
    chips.forEach((c, i) => {
      const up = p * (4 + i * 1.5);
      place(c.el, P(c.x * (0.6 + p * 0.6), c.y * (0.6 + p * 0.6), SZ + up));
      c.el.setAttribute("class", p > 0.5 ? (i === 0 ? "dot m" : "dot off") : "dot off");
    });
  }

  const press = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(press, dt); draw(press.x); return m; });
  bag.add(B.unregister);

  function aim(pt) {
    const [x, y] = unproj(C, pt[0], pt[1], SZ), R = 20 + reach * 0.5, d = Math.hypot(x, y);
    if (Math.abs(x) > 44 || Math.abs(y) > 44) return leave();
    const f = clamp(1 - d / R, 0.15, 1);
    press.t = f;
    read.textContent = Math.round(f * DROP) + " mm";
    B.wake();
  }
  function leave() { press.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "jackhammer",
  means: "A breaker on a square of road: the nearer the pointer comes, the harder it drives down on its chisel and the chips fly.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[200, 193], [236, 204], [168, 176], null],
  mount,
});
