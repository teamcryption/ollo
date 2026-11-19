/**
 * PCR machine: a thermal cycler, a low rounded body with a display on its
 * face and a heated lid hinged along its back edge, closing over a block of
 * sample wells. The pointer over the machine swings the lid up on its hinge
 * to show the block. At rest the lid sits just ajar, bright. The slider is
 * how far the lid opens.
 *
 * The pattern: one part turning on a hinge.
 */
const { Cam, circ, fit, hull, open, poly, prism, proj, facing, rings, ringAt, rrect, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 70, D = 64, H = 24, LT = 9, HY = 6, REST = 12;
const disc = (x, y, r, n = 10) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, HY - LT, H + D - HY], [W, HY - LT, H + D - HY]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(0, 0, W, D, 7, 2), 0, H));
  // the display and the vent slits on the face toward us
  const fy = (x, z) => P(x, D, z);
  mk("path", { d: poly([fy(10, 8), fy(32, 8), fy(32, 17), fy(10, 17)]) + [42, 47, 52, 57].map((x) => poly([fy(x, 7), fy(x + 2, 7), fy(x + 2, 18), fy(x, 18)])).join(""), class: "nf lo" }, g);
  // the block of sample wells, under the lid
  put(solid(g), prism(P, front, ...rings(12, 12, W - 12, D - 10, 3, 1.2), H, H + 2));
  let d = "";
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) d += poly(ringAt(P, disc(17.5 + i * 7, 17 + j * 8.4, 2.2), H + 2));
  mk("path", { d, class: "nf lo" }, g);

  // the lid: a rounded slab turned about the hinge line y = HY, z = H
  const lid = mk("g", {}, g);
  const sil = mk("path", { class: "sil hi" }, lid), cr = mk("path", { class: "nf lo" }, lid), latch = mk("path", { class: "nf" }, lid);
  const outer = rrect(1, HY - 4, W - 1, D + 1, 6, 6), inner = rrect(3, HY - 2, W - 3, D - 1, 4, 6), lat = rrect(W / 2 - 9, D + 1, W / 2 + 9, D + 4, 1.5, 3);
  const z = tween(REST);
  let last = NaN;
  function turn(a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return (ring, zz) => ring.map((q) => { const dy = q.v - HY, dz = zz - H; return P(q.u, HY + dy * c - dz * s, H + dy * s + dz * c); });
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = turn(a);
    sil.setAttribute("d", poly(hull(T(outer, H).concat(T(outer, H + LT)))));
    cr.setAttribute("d", poly(T(inner, H + LT)));
    latch.setAttribute("d", poly(hull(T(lat, H + 2).concat(T(lat, H + LT - 2)))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(W / 2, D / 2, H);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? ang : REST, performance.now(), 0);
    read.textContent = on ? "lid " + Math.round(ang) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.3) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang = v; if (act) { read.textContent = "lid " + Math.round(v) + "°"; tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "pcrmachine",
  means: "A PCR thermal cycler: the pointer over it swings the heated lid up on its back hinge to show the block of sample wells.",
  rules: [1, 3, 5, 6],
  range: [40, 80, 95],
  tour: [[197, 208], [150, 214], [246, 200], null],
  mount,
});
