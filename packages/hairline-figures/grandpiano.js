/**
 * Grand piano: a curved case on three legs, keyboard at the near end, a lid
 * hinged along the straight side. The pointer over the piano props the lid
 * open, wider the further toward the tail it stands; leaving lowers it to a
 * half-stick rest. At rest the lid is up a little, bright. The slider is the
 * widest the lid will open.
 *
 * The pattern: a continuous aim on one hinge (a spring on an angle); the hit
 * is the case's rest footprint on its own height, which never moves.
 */
const {
  Cam, clamp, fillet, fit, facing, hull, poly, open, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 28, Z1 = 40, REST = 10;
// the case outline, tail at x 0, keyboard side at x 100; hinge along y 0
const OUT = fillet([[0, 6], [10, 0], [100, 0], [100, 60], [62, 60], [26, 34]], [6, 6, 2, 2, 14, 16], 4);
const ring = (pts) => pts.map(([u, v]) => ({ u, v }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.35);
  const lidPt = (a) => ([u, v]) => [u, v * Math.cos(a), Z1 + 1 + v * Math.sin(a)];
  const ext = OUT.map(lidPt((60 * Math.PI) / 180));
  fit(C, [[0, 0, 0], [114, 60, 0], [0, 60, 0], [114, 0, 0], ...ext], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // legs: tail, and two under the keyboard end
  for (const [x, y] of [[14, 8], [92, 6], [92, 54]]) {
    const [lr, li] = rings(x - 3, y - 3, x + 3, y + 3, 3, 0.8);
    put(solid(g), prism(P, front, lr, li, 0, Z0));
  }
  // the case: a convex hull of the curved rim at both heights, the rim as its crease
  const cs = solid(g);
  cs.sil.setAttribute("d", poly(hull(OUT.map(([u, v]) => P(u, v, Z0)).concat(OUT.map(([u, v]) => P(u, v, Z1))))));
  cs.cr.setAttribute("d", poly(OUT.map(([u, v]) => P(u, v, Z1))));
  // the harp inside: a few strings running tail to keys, dim
  const harp = mk("path", { class: "nf lo" }, g);
  let hd = "";
  for (let i = 1; i < 6; i++) { const v = i * 9; hd += seg(P(Math.max(14, 40 - v * 0.5 + v * 0.6), v, Z1 - 1), P(96, v, Z1 - 1)); }
  harp.setAttribute("d", hd);
  // keyboard: a slab at the near end, black keys as short dim marks
  const [kr, ki] = rings(100, 2, 114, 58, 2, 1);
  put(solid(g), prism(P, front, kr, ki, Z0 + 2, Z0 + 8));
  let kd = "";
  for (let i = 0; i < 12; i++) { if (i % 7 === 2 || i % 7 === 6) continue; const y = 6 + i * 4.3; kd += seg(P(103, y, Z0 + 8), P(108, y, Z0 + 8)); }
  mk("path", { d: kd, class: "nf lo" }, g);

  const prop = mk("path", { class: "dash nf" }, g);
  const lid = mk("path", { class: "sil hi" }, g), lidT = mk("path", { class: "nf lo" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    const d = Math.round(deg * 10) / 10;
    if (d === last) return;
    last = d;
    const a = (d * Math.PI) / 180, f = lidPt(a);
    const top = OUT.map((p) => P(...f(p))), bot = OUT.map(([u, v]) => P(u, v * Math.cos(a), Z1 + v * Math.sin(a) - 0.6 * Math.cos(a)));
    lid.setAttribute("d", poly(hull(top.concat(bot))));
    lidT.setAttribute("d", poly(top));
    // the stick: from the rim near the bent side up to the lid's edge
    prop.setAttribute("d", d > 3 ? seg(P(58, 46, Z1), P(...f([58, 46]))) : "");
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim([sx, sy]) {
    const [u, v] = unproj(C, sx, sy, Z1);
    if (u < -6 || u > 120 || v < -10 || v > 66) return null;
    return clamp(max * (0.55 + 0.45 * u / 100), 12, max);
  }
  function set(t) {
    ang.t = t === null ? REST : t;
    read.textContent = t === null ? "rest" : "lid " + Math.round(t) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => set(aim(p)), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "grandpiano",
  means: "A grand piano on three legs: the pointer props its lid open, wider toward the keys, and leaving lowers it to half-stick.",
  rules: [1, 3, 5, 8],
  range: [24, 45, 60],
  tour: [[150, 150], [200, 170], [260, 200], null],
  mount,
});
