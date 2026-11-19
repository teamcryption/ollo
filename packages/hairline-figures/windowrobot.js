/**
 * Window robot: a square window-cleaning robot stuck to a pane of glass in
 * its frame, a round cleaning pad on its face. The pointer over the glass
 * draws the robot sliding across the pane toward it, on a spring, and it
 * stops at the frame. At rest it sits low in one corner, its pad bright.
 * The slider is its reach: how far toward the pointer it slides.
 *
 * The pattern: one part sliding on a plane (follow), hit on the fixed pane.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rrect, lerp, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const GW = 100, GH = 76, F = 5, RS = 30, RD = 9, REST = [24, 22];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-F, 0, -F], [GW + F, 0, -F], [-F, 0, GH + F], [GW + F, 0, GH + F], [-F, 8, -F], [GW + F, 8, -F], [GW, RD + 2, 0], [0, RD + 2, GH]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  // a ring in the x–z plane, standing at depth y
  const face = (ring, x, z, y) => ring.map((q) => P(x + q.u, y, z + q.v));

  // the frame, the glass, the sill
  const outer = rrect(-F, -F, GW + F, GH + F, 6, 6), inner = rrect(0, 0, GW, GH, 2, 4);
  mk("path", { class: "sil", d: poly(hull(face(outer, 0, 0, -2).concat(face(outer, 0, 0, 2)))) }, g);
  mk("path", { class: "nf lo", d: poly(face(inner, 0, 0, 2)) + poly(face(rrect(1.5, 1.5, GW - 1.5, GH - 1.5, 1, 4), 0, 0, 0)) }, g);
  mk("path", { class: "sil", d: poly(hull(face(rrect(-F - 3, -F - 3, GW + F + 3, -F, 1.5, 4), 0, 0, -2).concat(face(rrect(-F - 3, -F - 3, GW + F + 3, -F, 1.5, 4), 0, 0, 8)))) }, g);
  const wipe = mk("path", { class: "nf dash" }, g);

  // the robot: a rounded square body, its face, its pad, a tether eye on top
  const body = mk("path", { class: "sil" }, g), cr = mk("path", { class: "nf lo" }, g);
  const pad = mk("path", { class: "nf" }, g), eye = mk("path", { class: "nf lo" }, g);
  const sq = rrect(-RS / 2, -RS / 2, RS / 2, RS / 2, 8, 8), sqi = rrect(-RS / 2 + 2, -RS / 2 + 2, RS / 2 - 2, RS / 2 - 2, 6, 8);
  const ring = (r, n) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return { u: r * Math.cos(t), v: r * Math.sin(t) }; });
  const padR = ring(8, 24), eyeR = ring(2, 10);

  const sx = spring(REST[0]), sz = spring(REST[1]);
  let last = "";
  function draw(x, z) {
    const key = x.toFixed(2) + "," + z.toFixed(2);
    if (key === last) return;
    last = key;
    body.setAttribute("d", poly(hull(face(sq, x, z, 1).concat(face(sq, x, z, RD)))));
    cr.setAttribute("d", poly(face(sqi, x, z, RD)));
    pad.setAttribute("d", poly(face(padR, x, z, RD + 0.4)));
    eye.setAttribute("d", poly(face(eyeR, x, z + RS / 2 - 4, RD + 0.4)));
    wipe.setAttribute("d", poly([P(REST[0], 0.5, REST[1]), P(x, 0.5, z), P(x, 0.5, z)]));
  }

  const B = register(stage, (dt) => {
    const m = stepS(sx, dt) | stepS(sz, dt);
    draw(sx.x, sz.x);
    return !!m;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the glass plane, which never moves
  const o = P(0, 0, 0), ex = P(1, 0, 0), ez = P(0, 0, 1);
  const ax = [ex[0] - o[0], ex[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ax[0] * az[1] - ax[1] * az[0];
  function onGlass([px, py]) {
    const dx = px - o[0], dy = py - o[1];
    const x = (dx * az[1] - dy * az[0]) / det, z = (ax[0] * dy - ax[1] * dx) / det;
    return x < -F || x > GW + F || z < -F || z > GH + F ? null : [x, z];
  }

  let tgt = null;
  function aim(p) {
    tgt = p;
    const lo = RS / 2 + 1;
    const x = p ? clamp(lerp(REST[0], p[0], reach), lo, GW - lo) : REST[0];
    const z = p ? clamp(lerp(REST[1], p[1], reach), lo, GH - lo) : REST[1];
    sx.t = x; sz.t = z;
    body.classList.toggle("hi", !!p);
    pad.classList.toggle("hi", !p);
    read.textContent = p ? Math.round(x) + "·" + Math.round(z) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(onGlass(p)), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; aim(tgt); }, destroy: bag.dispose };
}

hairline({
  name: "windowrobot",
  means: "A window-cleaning robot on a pane of glass: it slides across the glass toward the pointer and stops at the frame.",
  rules: [1, 3, 4, 5],
  range: [30, 70, 100],
  tour: [[255, 143], [280, 240], [165, 175], null],
  mount,
});
