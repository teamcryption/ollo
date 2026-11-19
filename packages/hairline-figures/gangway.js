/**
 * Gangway: a ship's hull with its deckhouse and funnel, a quay across the
 * gap, and the railed gangway hinged at the ship's rail. At rest the gangway
 * is stowed, swung back along the hull and tilted up, bright. The pointer
 * over the quay swings the gangway out towards it and tilts it down until its
 * tip lands on the quay. The slider is how far it swings out.
 *
 * The pattern: a continuous aim (spotlights' spring, on two angles); the hit
 * is on the quay's plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, lerp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PIV = [-10, -30, 36], L = 72, W = 11, QZ = 14, REST_T = 78, REST_P = 22;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-84, -64, 0], [84, -64, 0], [84, 62, 0], [-84, 62, 0], [-40, -50, 80], [40, -50, 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the ship: hull, deckhouse, funnel (far side first)
  const [hr, hi] = rings(-84, -64, 84, -30, 16, 2);
  put(solid(g), prism(P, front, hr, hi, 0, 36));
  const [dr, di] = rings(-52, -58, 20, -38, 4, 1.5);
  put(solid(g), prism(P, front, dr, di, 36, 54));
  put(solid(g), prism(P, front, disc(-28, -48, 6), disc(-28, -48, 4.5), 54, 72));
  // the quay, with two bollards
  const [qr, qi] = rings(-84, 26, 84, 62, 3, 1.5);
  put(solid(g), prism(P, front, qr, qi, 0, QZ));
  for (const x of [-56, 48]) put(solid(g), prism(P, front, disc(x, 34, 3, 16), disc(x, 34, 2, 16), QZ, QZ + 6));
  // the gangway
  const deck = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "nf lo" }, g), rails = mk("path", { class: "nf" }, g);
  const th = spring(REST_T), ph = spring(REST_P);
  let last = "";

  function draw() {
    const key = th.x.toFixed(2) + "," + ph.x.toFixed(2);
    if (key === last) return;
    last = key;
    const t = rad(th.x), p = rad(ph.x);
    const d = [Math.sin(t) * Math.cos(p), Math.cos(t) * Math.cos(p), Math.sin(p)], w = [Math.cos(t), -Math.sin(t), 0];
    const pt = (s, off, z) => P(PIV[0] + d[0] * s + w[0] * off, PIV[1] + d[1] * s + w[1] * off, PIV[2] + d[2] * s + z);
    const q = (z) => [pt(0, -W / 2, z), pt(L, -W / 2, z), pt(L, W / 2, z), pt(0, W / 2, z)];
    deck.setAttribute("d", poly(hull(q(0).concat(q(-2.5)))));
    top.setAttribute("d", poly(q(0)));
    let r = "";
    for (const off of [-W / 2, W / 2]) {
      r += seg(pt(0, off, 9), pt(L, off, 9));
      for (let i = 0; i <= 6; i++) r += seg(pt((L * i) / 6, off, 0), pt((L * i) / 6, off, 9));
    }
    rails.setAttribute("d", r);
  }

  const B = register(stage, (dt) => { const a = stepS(th, dt), b = stepS(ph, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { th.t = REST_T; ph.t = REST_P; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], QZ);
    if (y < -20 || Math.abs(x) > 100) { aim(null); return; }
    const ta = clamp((Math.atan2(x - PIV[0], Math.max(8, y - PIV[1])) * 180) / Math.PI, -45, 45);
    const pa = -Math.asin((PIV[2] - QZ - 1) / L) * 180 / Math.PI;
    th.t = lerp(REST_T, ta, reach); ph.t = lerp(REST_P, pa, reach);
    read.textContent = Math.round(th.t) + "°";
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "gangway",
  means: "A ship's gangway, stowed along the hull: the pointer over the quay swings it out and tilts it down onto the quay.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[139, 211], [205, 258], [47, 179], null],
  mount,
});
