/**
 * Photocopier: one office copier, a cabinet with two paper drawers and an
 * output tray, the scan glass on top under a hinged lid. The pointer over
 * the copier swings the lid up on its back hinge to bare the glass; leaving
 * lets it fall back to its rest, held a little ajar, bright. The slider is
 * how far the lid opens.
 *
 * The pattern: one part answering the whole figure (hover in a fixed box).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DX = 40, DY = 52, H = 36, T = 3, REST = 0.22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value;
  const C = Cam(45, 0.5, 2.9);
  const ext = [[0, 0, 0], [DX, DY + 10, 0], [DX, 0, 0], [0, DY + 10, 0], [0, 0, H + DX + 2], [0, DY, H + DX + 2], [DX * 0.3, DY, H + DX]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [o, i] = rings(0, 0, DX, DY, 4, 1.4);
  put(solid(g), prism(P, front, o, i, 0, H));
  mk("path", { class: "nf lo", d: poly([[4, 6], [DX - 4, 6], [DX - 4, DY - 6], [4, DY - 6]].map(([x, y]) => P(x, y, H))) }, g);
  mk("path", { class: "nf lo", d: [8, 18].map((z) => seg(P(DX, 5, z), P(DX, DY - 5, z)) + seg(P(DX, DY / 2 - 6, z + 4), P(DX, DY / 2 + 6, z + 4))).join("") + seg(P(DX, 5, 27), P(DX, DY - 5, 27)) }, g);
  const [to, ti] = rings(8, DY - 2, DX - 6, DY + 9, 2, 0.8);
  put(solid(g), prism(P, front, to, ti, 22, 23.5));       // output tray

  const lid = solid(g);
  lid.sil.classList.add("hi");
  const ring = rrect(0, 1, DX, DY - 1, 3, 4), inner = rrect(3, 4, DX - 3, DY - 4, 1.5, 4);
  const L = (t, y, n, c, s) => P(t * c - n * s, y, H + t * s + n * c);
  const a = tween(REST);
  let last = NaN;
  function draw(q) {
    if (q === last) return;
    last = q;
    const c = Math.cos(q), s = Math.sin(q), pts = [];
    for (const n of [0, T]) for (const p of ring) pts.push(L(p.u, p.v, n, c, s));
    lid.sil.setAttribute("d", poly(hull(pts)));
    const n = -0.61 * s + 0.5 * c > 0 ? T : 0;
    lid.cr.setAttribute("d", poly(inner.map((p) => L(p.u, p.v, n, c, s))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(a, now)); return !tdone(a, now); });
  bag.add(B.unregister);

  // the hit: a fixed screen box around the copier at rest
  const sp = ext.slice(0, 4).concat([[0, 0, H + 12], [0, DY, H + 12]]).map((q) => P(...q));
  const xs = sp.map((q) => q[0]), ys = sp.map((q) => q[1]);
  const inBox = ([sx, sy]) => sx > Math.min(...xs) - 6 && sx < Math.max(...xs) + 6 && sy > Math.min(...ys) - 6 && sy < Math.max(...ys) + 6;

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(a, v ? ang : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inBox(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang = v; if (on) { tset(a, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "photocopier",
  means: "A photocopier: the pointer over it swings the lid up on its back hinge to bare the scan glass, and it drops back on leaving.",
  rules: [1, 3, 5, 6, 8],
  range: [0.8, 1.3, 1.75],
  tour: [[210, 170], [260, 230], [150, 225], null],
  mount,
});
