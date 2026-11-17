/**
 * M.2 drive: a gumstick SSD seated in its slot on a patch of motherboard,
 * held flat at its far end by a screw on a standoff. The pointer over the
 * board backs the screw out and the drive springs up on its connector, the
 * way it does when you free it. At rest it sits just off flat, bright. The
 * slider is how far it tilts.
 *
 * The pattern: one part on a hinge; the hit is the board's fixed plane.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, rad, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, W = 22, T = 1.6, Z0 = 4, REST = 5, SX = 3, SY = W / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 2.55);
  const tipZ = Z0 + L * Math.sin(rad(52));
  fit(C, [[-10, -8, -4], [L + 14, W + 8, -4], [L + 14, -8, -4], [-10, W + 8, -4], [L * 0.4, 0, tipZ], [L * 0.4, W, tipZ], [SX, SY, tipZ + 12]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the board, the slot and the standoff
  const [br, bi] = rings(-10, -8, L + 14, W + 8, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const [cr, ci] = rings(L - 3, -3, L + 8, W + 3, 1.6, 0.7);
  put(solid(g), prism(P, front, cr, ci, 0, 6));
  const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
  put(solid(g), prism(P, front, disc(SX, SY, 3.2), disc(SX, SY, 2.4), 0, Z0));
  mk("path", { class: "nf lo", d: seg(P(14, W + 4, 0), P(L - 10, W + 4, 0)) + seg(P(34, -4, 0), P(L - 10, -4, 0)) }, g);

  // the drive: a thin plate on a hinge at the slot, with its chips
  const sg = mk("g", {}, g);
  const stick = { sil: mk("path", { class: "sil hi" }, sg), cr: mk("path", { class: "nf lo" }, sg), chips: mk("path", { class: "nf lo" }, sg), a: tween(REST), last: NaN };
  const ring = rrect(0, 0, L, W, 2, 4), inner = rrect(1, 1, L - 1, W - 1, 1, 4);
  const screw = { g: mk("g", {}, g), z: tween(Z0 + T), last: NaN };
  const head = solid(screw.g), slot = mk("path", { class: "nf lo" }, screw.g);

  function at(a, u, v, h) { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return P(L - u * c + h * s, v, Z0 + u * s + h * c); }
  function draw(a) {
    if (a === stick.last) return;
    stick.last = a;
    const pts = ring.map((q) => at(a, q.u, q.v, 0)).concat(ring.map((q) => at(a, q.u, q.v, T)));
    stick.sil.setAttribute("d", poly(hull(pts)));
    stick.cr.setAttribute("d", poly(inner.map((q) => at(a, q.u, q.v, T))));
    const box = (u0, v0, u1, v1) => poly([[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => at(a, u, v, T + 0.05)));
    stick.chips.setAttribute("d", box(8, 4, 22, 18) + box(28, 3, 50, 19) + box(55, 3, 75, 19) + poly(disc(L - SX, SY, 3.4, 16).map((q) => at(a, q.u, q.v, T + 0.05))));
  }
  function drawScrew(z) {
    if (z === screw.last) return;
    screw.last = z;
    put(head, prism(P, front, disc(SX, SY, 3.4), disc(SX, SY, 2.6), z, z + 2));
    slot.setAttribute("d", seg(P(SX - 2.2, SY - 2.2, z + 2), P(SX + 2.2, SY + 2.2, z + 2)));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(stick.a, now));
    drawScrew(tval(screw.z, now));
    return !tdone(stick.a, now) || !tdone(screw.z, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -20 && x < L + 18 && y > -18 && y < W + 12;
  }
  let on = null;
  function apply(o) {
    const now = performance.now();
    tset(stick.a, o ? tilt : REST, now, o ? 120 : 0);
    tset(screw.z, o ? Z0 + L * Math.sin(rad(tilt)) + 10 : Z0 + T, now, 0);
    read.textContent = o ? "tilt " + Math.round(tilt) : "rest";
    B.wake();
  }
  function setOn(o) { if (o === on) return; on = o; apply(o); }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = clamp(v, 12, 52); if (on) apply(true); }, destroy: bag.dispose };
}

hairline({
  name: "ssdslot",
  means: "An M.2 drive in its slot: the pointer backs out the screw and the drive tilts up on its connector.",
  rules: [1, 3, 5, 6],
  range: [12, 32, 52],
  tour: [[159, 203], [211, 232], [260, 297], null],
  mount,
});
