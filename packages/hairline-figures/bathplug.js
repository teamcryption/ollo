/**
 * Bath plug: a corner of tub floor with a round drain, a rubber plug seated in
 * it and a bead chain running to the overflow post, the plug bright at rest.
 * Over it the plug is pulled: it rises out of the drain, tips toward the post
 * and the chain draws up. The slider is how high it comes.
 *
 * The pattern: one object, one part that lifts and tilts.
 */
const { Cam, circ, fit, hull, poly, proj, rad, rings, prism, facing, put, solid, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const PX = -24, PY = 12, PH = 36;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-34, -34, 0], [34, 34, 0], [-34, 34, 0], [34, -34, 0], [PX, PY, PH + 6], [0, 0, 44]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-34, -34, 34, 34, 12, 2);
  put(solid(g), prism(P, front, sr, si, 0, 4));
  put(solid(g), prism(P, front, disc(PX, PY, 4), disc(PX, PY, 3), 4, PH));
  put(solid(g), prism(P, front, disc(PX, PY, 7), disc(PX, PY, 5.5), PH, PH + 3));
  mk("path", { d: poly(disc(0, 0, 16, 48).map((q) => P(q.u, q.v, 4))), class: "nf lo" }, g);
  mk("path", { d: poly(disc(0, 0, 11, 40).map((q) => P(q.u, q.v, 4))), class: "nf lo" }, g);
  const chain = mk("path", { class: "nf" }, g), plug = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "nf lo" }, g), loop = mk("path", { class: "nf" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(4 + v * 28), lift = 1 + v * amt, sl = v * 8;
    const X = (x, y, z) => { const dz = z - 4, dx = (x + y) / Math.SQRT2; const k = dx * Math.cos(a) - dz * Math.sin(a) - dx; return [x + k / Math.SQRT2 - sl, y + k / Math.SQRT2 - sl, 4 + lift + dx * Math.sin(a) + dz * Math.cos(a)]; };
    const ring = (r, z) => disc(0, 0, r, 40).map((q) => P(...X(q.u, q.v, z)));
    plug.setAttribute("d", poly(hull(ring(12.5, 2).concat(ring(14.5, 12)))));
    top.setAttribute("d", poly(ring(12.5, 12)));
    const k0 = X(0, 0, 12), k1 = X(0, 0, 17);
    loop.setAttribute("d", poly(hull(disc(0, 0, 2.5, 12).map((q) => P(k0[0] + q.u, k0[1] + q.v, k0[2])).concat(disc(0, 0, 2.5, 12).map((q) => P(k1[0] + q.u, k1[1] + q.v, k1[2]))))));
    const A = [PX, PY, PH + 1], n = 16;
    let d = "";
    for (let i = 0; i <= n; i++) {
      const s = i / n, sag = Math.sin(s * Math.PI) * (14 - v * 9);
      const p = P(A[0] + (k1[0] - A[0]) * s, A[1] + (k1[1] - A[1]) * s, A[2] + (k1[2] - A[2]) * s - sag);
      d += poly(circ(1.4, 8).map((q) => [p[0] + q.u * 1.3, p[1] + q.v * 1.3]));
    }
    chain.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(-6, -6, 10);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "pulled" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 90), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bathplug",
  means: "A bath plug on a bead chain: over the drain the plug is pulled, rising out, tipping toward the post as the chain draws up.",
  rules: [1, 4, 5, 8],
  range: [10, 20, 30],
  tour: [[200, 155], [130, 87], [200, 155], null],
  mount,
});
