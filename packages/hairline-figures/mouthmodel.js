/**
 * Jaw model: a dentist's teaching model, a lower jaw with its row of teeth
 * and an upper jaw hinged to it at the back. The pointer opens it: the
 * nearer it comes to the front, the wider the upper jaw swings up. At rest
 * the jaw stands a little open, its rim bright. The slider is how far it opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, ringAt, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 30, D = 26, T = 7, REST = 0.2, MAX = 1.15;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-W, -D, 0], [W, D, 0], [-W, -D, 2 * T + 2 * D * Math.sin(MAX) + 4], [W, D, T + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(-W, -D, W, D, 14, 2);
  put(solid(g), prism(P, front, lr, li, 0, T));
  for (let i = 0; i < 10; i++) {
    const a = Math.PI * (0.08 + 0.84 * (i / 9)), x = -(W - 6) * Math.cos(a), y = -D + 6 + (2 * D - 14) * Math.sin(a);
    put(solid(g), prism(P, front, disc(x, y, 2.6), disc(x, y, 1.6), T, T + 4));
  }
  const upper = mk("path", { class: "sil" }, g), crease = mk("path", { class: "nf lo" }, g);
  const foot = rrect(-W, -D, W, D, 14, 6), inner = rrect(-W + 2, -D + 2, W - 2, D - 2, 12, 6);
  const HZ = T + 4;
  const rot = (ring, z, a) => ring.map((q) => { const y = q.v + D, zz = z; return P(q.u, -D + y * Math.cos(a) - zz * Math.sin(a), HZ + y * Math.sin(a) + zz * Math.cos(a)); });

  const op = spring(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const a = o * MAX;
    upper.setAttribute("d", poly(hull(rot(foot, 0, a).concat(rot(foot, T, a)))));
    crease.setAttribute("d", poly(rot(inner, T, a)));
  }
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);

  const c = P(0, 0, T);
  function aim(p) {
    const inside = p && Math.abs(p[0] - c[0]) < 120 && Math.abs(p[1] - c[1]) < 120;
    const o = inside ? clamp(0.4 + (p[1] - c[1] + 60) / 150, 0.4, 1) * reach : REST;
    op.t = o;
    upper.classList.add("hi");
    read.textContent = inside ? Math.round((o * MAX * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "mouthmodel",
  means: "A dental jaw model: the upper jaw swings open on its back hinge, wider as the pointer comes to the front.",
  rules: [1, 3, 4, 5],
  range: [40, 80, 100],
  tour: [[200, 271], [200, 210], [150, 240], null],
  mount,
});
