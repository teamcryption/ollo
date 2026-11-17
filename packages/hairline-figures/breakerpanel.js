/**
 * Breaker switch: a knife switch on a base plate, two blades hinged at one
 * end and a handle on their crossbar. At rest the blades sit lifted a little,
 * the handle bright. The pointer over the switch throws the blades open out
 * of their jaws. The slider is how far they swing.
 *
 * The pattern: one part turning on a hinge.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, unproj, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const V = [0.612, 0.612, 0.5], REST = 14, HX = 11, HZ = 14;
const shift = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [98, 42, 0], [98, 0, 0], [0, 42, 0], [40, 20, 96], [-20, 20, 70]], 200, 172);
  const P = proj(C), front = facing(C);
  function slab(s, ring, inner, f, w0, w1) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    const c0 = f(0, 0, w0), c1 = f(0, 0, w1), vis = (c1[0] - c0[0]) * V[0] + (c1[1] - c0[1]) * V[1] + (c1[2] - c0[2]) * V[2] > 0;
    s.cr.setAttribute("d", poly(inner.map((q) => P(...f(q.u, q.v, vis ? w1 : w0)))));
  }
  const g = mk("g", {}, svg);
  const block = (par, x, y) => { const [r, i] = rings(x, y, x + 10, y + 8, 2, 1.2); put(solid(par), prism(P, front, r, i, 5, HZ)); };
  const [br, bi] = rings(0, 0, 98, 42, 6, 2.2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  for (const x of [HX - 5, 74]) block(g, x, 6);
  const back = mk("g", {}, g);
  for (const x of [HX - 5, 74]) block(g, x, 28);
  const front2 = mk("g", {}, g);
  const hand = mk("g", {}, g);
  const bl = (y) => [rrect(0, y - 1.8, 72, y + 1.8, 1.4, 3), rrect(0.8, y - 0.9, 71.2, y + 0.9, 0.8, 3)];
  const b1 = solid(back), b2 = solid(front2), bar = solid(hand), hd = solid(hand);
  hd.sil.classList.add("hi");
  const [r1, i1] = bl(10), [r2, i2] = bl(32);
  const [xr, xi] = [rrect(52, 7, 60, 35, 2, 3), rrect(53.2, 8.2, 58.8, 33.8, 1.2, 3)];
  const hr = shift(circ(4.2, 24), 56, 21), hi = shift(circ(2.4, 24), 56, 21);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    const f = (u, v, w) => [HX + u * c - w * s, v, HZ + u * s + w * c];
    slab(b1, r1, i1, f, 0, 3);
    slab(b2, r2, i2, f, 0, 3);
    slab(bar, xr, xi, f, 3, 6);
    slab(hd, hr, hi, f, 6, 28);
    if (-s * V[0] + c * V[2] < 0) back.before(hand); else front2.after(hand);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? open : REST, performance.now(), 0);
    read.textContent = o ? "off" : "rest";
    B.wake();
  }
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, 5); return x > -10 && x < 108 && y > -40 && y < 52; }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "breakerpanel",
  means: "A knife switch resting just off its jaws: the pointer over it throws the blades open by the handle.",
  rules: [1, 5, 6, 8],
  range: [40, 70, 85],
  tour: [[154, 193], [200, 232], [242, 262], null],
  mount,
});
