/**
 * Dovecote: a gabled pigeon house on a tall pole, round entry holes in its
 * gable, a perch rail, and a front door hinged at its far edge. The pointer
 * near the house swings the door out, wider the nearer the door side it
 * comes, showing the nest shelves. At rest the door stands ajar, bright.
 * The slider is the widest swing.
 *
 * The pattern: one door turning on a hinge (open).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, open, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 26, Z0 = 64, Z1 = 112, RZ = 136, O = 5, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-16, -16, 0], [16, 16, 0], [-W - O, -W - O, RZ], [W + O, W + O, Z1], [W + 2 * W, W, Z0], [-W, W + O, Z0]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -14, 14, 14, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const [pr, pi] = rings(-3.5, -3.5, 3.5, 3.5, 1.5, 1);
  put(solid(g), prism(P, front, pr, pi, 3, Z0 - 6));
  const [sr, si] = rings(-W - 3, -W - 3, W + 3, W + 3, 2, 1.5);
  put(solid(g), prism(P, front, sr, si, Z0 - 6, Z0));
  // the house: walls and the near gable as one solid
  const box = [];
  for (const x of [-W, W]) for (const y of [-W, W]) box.push(P(x, y, Z0), P(x, y, Z1));
  box.push(P(0, -W, RZ - 2), P(0, W, RZ - 2));
  mk("path", { d: poly(hull(box)), class: "sil" }, g);
  let d = seg(P(-W, W, Z1), P(W, W, Z1));
  const hole = (x, z, r) => { const p = []; for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI * 2; p.push(P(x + r * Math.cos(t), W, z + r * Math.sin(t))); } return open(p); };
  d += hole(-11, Z0 + 26, 5) + hole(11, Z0 + 26, 5) + hole(0, Z1 + 10, 4);
  d += seg(P(-18, W, Z0 + 18), P(-18, W + 6, Z0 + 18)) + seg(P(-18, W + 6, Z0 + 18), P(18, W + 6, Z0 + 18)) + seg(P(18, W + 6, Z0 + 18), P(18, W, Z0 + 18));
  mk("path", { d, class: "nf lo" }, g);
  // the door opening and the shelves behind it
  d = poly([P(W, -W + 3, Z0 + 3), P(W, W - 3, Z0 + 3), P(W, W - 3, Z1 - 3), P(W, -W + 3, Z1 - 3)]);
  for (const z of [Z0 + 18, Z0 + 33]) d += seg(P(W, -W + 3, z), P(W - 8, -W + 3, z)) + seg(P(W, -W + 3, z), P(W, W - 3, z));
  mk("path", { d, class: "nf lo" }, g);
  // the roof
  const rp = [];
  for (const y of [-W - O, W + O]) rp.push(P(-W - O, y, Z1 - 2), P(-W - O, y, Z1), P(0, y, RZ), P(0, y, RZ + 3), P(W + O, y, Z1), P(W + O, y, Z1 - 2));
  mk("path", { d: poly(hull(rp)), class: "sil" }, g);
  mk("path", { d: seg(P(0, -W - O, RZ + 3), P(0, W + O, RZ + 3)) + seg(P(-W - O, W + O, Z1), P(0, W + O, RZ + 3)) + seg(P(0, W + O, RZ + 3), P(W + O, W + O, Z1)), class: "nf lo" }, g);

  const door = mk("g", {}, g);
  const sil = mk("path", { class: "sil hi" }, door), faces = mk("path", { class: "nf lo" }, door);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    // hinge: vertical line at (W, -W + 2); u runs along the door, t its thickness
    const at = (u, t, z) => P(W + u * s + t * c, -W + 2 + u * c - t * s, z);
    const L = 2 * W - 4, pts = [];
    for (const u of [0, L]) for (const t of [0, 2]) pts.push(at(u, t, Z0 + 2), at(u, t, Z1 - 2));
    sil.setAttribute("d", poly(hull(pts)));
    faces.setAttribute("d", seg(at(L, 2, Z0 + 2), at(L, 2, Z1 - 2)) +
      seg(at(L - 6, 2, Z0 + 22), at(L - 6, 2, Z0 + 28)) + seg(at(4, 2, Z1 - 10), at(L - 4, 2, Z1 - 10)) + seg(at(4, 2, Z0 + 10), at(L - 4, 2, Z0 + 10)));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function swing(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], Z0);
      if (wy > -W - 30 && wy < W + 40 && wx > -W - 30 && wx < W + 70) a = maxA * clamp((wx + W + 20) / (2 * W + 30), 0.35, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "door " + a + "°";
    B.wake();
  }
  swing(null);
  bag.add(pointer(stage, { move: swing, leave: () => swing(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; swing(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "dovecote",
  means: "A dovecote on a pole: its front door is hinged at the far edge and swings out as the pointer comes near the house.",
  rules: [1, 3, 5, 6],
  range: [50, 90, 120],
  tour: [[178, 178], [227, 191], [256, 202], null],
  mount,
});
