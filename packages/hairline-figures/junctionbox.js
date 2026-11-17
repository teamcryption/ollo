/**
 * Junction box: a grey box with cable glands on its faces and a lid hinged
 * along the back edge. At rest the lid stands ajar, bright. The pointer over
 * the box swings the lid open to show the cavity. The slider is how far.
 *
 * The pattern: one part turning on a hinge.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, unproj, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 80, D = 56, H = 34, V = [0.612, 0.612, 0.5], REST = 16;
const shift = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-4, -4, 0], [W + 12, D + 12, 0], [W + 12, -4, 0], [-4, D + 12, 0], [0, -32, H + 52], [W, -32, H + 52]], 200, 168);
  const P = proj(C), front = facing(C);
  function slab(s, ring, inner, f, w0, w1) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    const c0 = f(0, 0, w0), c1 = f(0, 0, w1), vis = (c1[0] - c0[0]) * V[0] + (c1[1] - c0[1]) * V[1] + (c1[2] - c0[2]) * V[2] > 0;
    s.cr.setAttribute("d", poly(inner.map((q) => P(...f(q.u, q.v, vis ? w1 : w0)))));
  }
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 4.5);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { class: "nf lo", d: poly(bi.map((q) => P(q.u, q.v, H))) }, g);
  mk("path", { class: "nf lo", d: poly(rrect(9, 9, W - 9, D - 9, 3, 4).map((q) => P(q.u, q.v, H - 10))) }, g);
  // cable glands: short cylinders out of the front and the side
  const gl = circ(5, 24), gi = circ(3, 24);
  for (const cx of [22, 58]) slab(solid(g), gl, gi, (u, v, w) => [cx + u, D + w, 15 + v], 0, 8);
  slab(solid(g), shift(gl, 0, 0), gi, (u, v, w) => [W + w, 28 + u, 15 + v], 0, 8);

  const lid = solid(g);
  lid.sil.classList.add("hi");
  const ring = rrect(-1, 0, W + 1, D + 2, 7, 6), inner = rrect(3, 4, W - 3, D - 2, 4, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    slab(lid, ring, inner, (u, v, w) => [u, -1 + v * c - w * s, H + v * s + w * c], 0, 4);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? open : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, H); return x > -8 && x < W + 10 && y > -10 && y < D + 10; }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "junctionbox",
  means: "A junction box with its lid ajar: the pointer over the box swings the lid open on its back hinge.",
  rules: [1, 5, 6, 8],
  range: [60, 105, 120],
  tour: [[160, 150], [200, 170], [240, 190], null],
  mount,
});
