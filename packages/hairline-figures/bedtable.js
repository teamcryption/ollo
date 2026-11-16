/**
 * Overbed table: a U-shaped base on casters, a tall post, and a long
 * tabletop held at one end. The top swings round the post to follow the
 * pointer. At rest it points off to one side, bright. The slider is how far
 * it may swing either way.
 *
 * The pattern: one part turning to face the pointer (swing).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZT = 70, L = 84, HW = 19, REST = -40;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lim = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-L, -L, 0], [L, L, 0], [L, -L, 0], [-L, L, 0], [0, 0, ZT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x0, y0, x1, y1] of [[-8, -34, 6, -24], [-8, 24, 6, 34]]) { const [r, i] = rings(x0, y0, x1 + 50, y1, 4, 1); put(solid(g), prism(P, front, r, i, 2, 6)); }
  const [cr, ci] = rings(-10, -34, 2, 34, 4, 1);
  put(solid(g), prism(P, front, cr, ci, 2, 7));
  for (const [x, y] of [[-6, -29], [52, -29], [-6, 29], [52, 29]]) put(solid(g), prism(P, front, disc(x, y, 2.4, 12), disc(x, y, 1.4, 12), 0, 2));
  put(solid(g), prism(P, front, disc(-4, 0, 4), disc(-4, 0, 2.6), 7, ZT - 2));
  put(solid(g), prism(P, front, disc(-4, 0, 6), disc(-4, 0, 4.5), 30, 34));

  const top = solid(g);
  top.sil.classList.add("hi");
  const ring = rrect(-10, -HW, L - 10, HW, 6, 4), inner = rrect(-8, -HW + 2, L - 12, HW - 2, 4, 4), lip = rrect(L - 22, -HW + 4, L - 16, HW - 4, 2, 2);
  const lipEl = mk("path", { class: "nf lo" }, top.g);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a + 45)), c = Math.cos(rad(a + 45));
    const at = (q, z) => P(-4 + q.u * c - q.v * s, q.u * s + q.v * c, z);
    top.sil.setAttribute("d", poly(hull(ring.map((q) => at(q, ZT)).concat(ring.map((q) => at(q, ZT + 3))))));
    top.cr.setAttribute("d", poly(inner.map((q) => at(q, ZT + 3))));
    lipEl.setAttribute("d", poly(lip.map((q) => at(q, ZT + 3))));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function aim(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], ZT);
      if (Math.hypot(wx + 4, wy) < 130) {
        let t = Math.atan2(wy, wx + 4) * 180 / Math.PI - 45;
        t = ((t + 540) % 360) - 180;
        a = clamp(t, -lim, lim);
      }
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "turn " + a + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lim = v; tgt = null; aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "bedtable",
  means: "An overbed table whose long top swings round its post to follow the pointer, over a U-shaped base on casters.",
  rules: [1, 3, 5, 6],
  range: [45, 80, 110],
  tour: [[200, 110], [140, 60], [260, 60], null],
  mount,
});
