/**
 * Gurney: a stretcher trolley on castors, its mattress in two sections. The
 * back section is hinged at the middle: the pointer's place along the bed,
 * read on the ground plane, sets how far the back is raised, on a spring.
 * At rest the back stands part-way up, bright. The slider is the top angle.
 *
 * The pattern: one part turning about a hinge (tilt).
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 128, W = 40, HZ = 40, DZ = 36, MT = 7, HX = 44, REST = 14;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [L + 8, W, 0], [L + 8, 0, 0], [0, W, 0], [HX - 44 * Math.cos(rad(85)), 0, HZ + 44 + MT], [HX, W, HZ + 44 + MT], [L + 8, 0, 60]], 200, 170);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  // castors, then the base frame and the column
  for (const [x, y] of [[8, 6], [L - 8, 6], [8, W - 6], [L - 8, W - 6]]) put(solid(g), prism(P, front, disc(x, y, 4.5), disc(x, y, 3), 0, 6));
  const [br, bi] = rings(2, 4, L - 2, W - 4, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 6, 10));
  for (const x of [34, 94]) { const [cr, ci] = rings(x - 4, W / 2 - 5, x + 4, W / 2 + 5, 2.5, 1); put(solid(g), prism(P, front, cr, ci, 10, DZ)); }
  const [dr, di] = rings(0, 0, L, W, 3, 1.2);
  put(solid(g), prism(P, front, dr, di, DZ, HZ));
  // back section: a slab hinged at x = HX, drawn from its own rounded ring
  const back = solid(g);
  const bRing = rrect(0, 1, HX - 1, W - 1, 5, 4), bIn = rrect(2, 3, HX - 3, W - 3, 3, 4);
  // foot section and the push handle
  const [fr, fi] = rings(HX + 1, 1, L - 1, W - 1, 5, 2);
  put(solid(g), prism(P, front, fr, fi, HZ, HZ + MT));
  const hd = [];
  for (const y of [4, W - 4]) hd.push(seg(P(L + 6, y, DZ), P(L + 6, y, 60)), seg(P(L, y, DZ + 2), P(L + 6, y, DZ + 2)));
  hd.push(seg(P(L + 6, 4, 60), P(L + 6, W - 4, 60)));
  mk("path", { d: hd.join(""), class: "nf" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (q, t) => P(HX - q.u * c - t * s, q.v, HZ + q.u * s + t * c);
    const pts = [];
    for (const q of bRing) pts.push(at(q, 0), at(q, MT));
    put(back, { sil: poly(hull(pts)), crease: poly(bIn.map((q) => at(q, MT))) });
  }
  back.cr.classList.add("nf");
  back.sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -20 || wx > L + 20 || wy < -30 || wy > W + 30) return leave();
    const a = Math.round(lerp(0, top, clamp((L - wx) / (L - 10), 0, 1)));
    ang.t = a;
    read.textContent = "back " + a + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; }, destroy: bag.dispose };
}

hairline({
  name: "gurney",
  means: "A stretcher trolley on castors: the pointer's place along the bed raises the hinged back section, further toward the head.",
  rules: [1, 3, 5, 8],
  range: [40, 70, 85],
  tour: [[150, 120], [220, 170], [290, 210], null],
  mount,
});
