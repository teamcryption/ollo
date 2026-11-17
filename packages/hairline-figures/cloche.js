/**
 * Cloche: a glass bell cloche over a seedling on a round of soil. The pointer
 * over the bell tips it open on its back edge to show the sprout. At rest the
 * bell sits slightly ajar, bright. The slider is how far it tips.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 30, H = 34, SR = 40, SZ = 6, REST = 0.12;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-SR, -SR, 0], [SR, SR, 0], [SR, -SR, 0], [-SR, SR, 0], [0, 0, SZ + H + 8], [-R - 30, 0, SZ + 60], [-R, 0, SZ + R * 2]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-SR, -SR, SR, SR, SR, 3);
  put(solid(g), prism(P, front, disc(0, 0, SR), disc(0, 0, SR - 4), 0, SZ));
  // the sprout: stem and two leaves
  const sp = mk("g", {}, g);
  const ln = (a, b) => mk("path", { d: "M" + P(...a).join(",") + "L" + P(...b).join(","), class: "nf" }, sp);
  ln([0, 0, SZ], [0, 0, SZ + 14]);
  mk("path", { d: poly(hull(ringAt(P, disc(5, 0, 5, 14), SZ + 15).concat(ringAt(P, disc(5, 0, 2, 10), SZ + 18)))), class: "nf" }, sp);
  mk("path", { d: poly(hull(ringAt(P, disc(-4, 2, 4, 14), SZ + 12).concat(ringAt(P, disc(-4, 2, 1.5, 10), SZ + 15)))), class: "nf" }, sp);
  const bell = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const t = tween(REST);
  // tip about the hinge at the back edge (x = -R, z = SZ)
  const rot = (x, y, z, a) => { const dx = x + R, dz = z - SZ; return P(-R + dx * Math.cos(a) - dz * Math.sin(a), y, SZ + dx * Math.sin(a) + dz * Math.cos(a)); };
  const ring = (r, z, a, n = 32) => circ(r, n).map((q) => rot(q.u, q.v, z, a));
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const a = f * 1.15, pts = [];
    for (let i = 0; i <= 8; i++) { const th = (i / 8) * (Math.PI / 2); pts.push(...ring(R * Math.cos(th) * (1 - 0.15 * Math.sin(th)) + 0.01, SZ + 0.5 + H * Math.sin(th), a)); }
    bell.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ring(R, SZ + 0.5, a, 40)) + "Z");
    knob.setAttribute("d", poly(hull(ring(4, SZ + H, a, 16).concat(ring(3, SZ + H + 6, a, 16)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, SZ + H / 2);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.25 + 0.75 * amt : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  bell.classList.add("hi");
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 75), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, 0.25 + 0.75 * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cloche",
  means: "A glass bell cloche over a seedling: the pointer tips the bell open on its back edge to show the sprout beneath.",
  rules: [3, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 163], [170, 120], [230, 190], null],
  mount,
});
