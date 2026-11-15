/**
 * Drink dispenser: a tall glass jar with a lid and a tap, standing on a
 * low stand, a glass waiting on the counter in front of it. At rest the jar
 * leans back a touch, its tap bright. The pointer over it tilts the jar
 * forward on the stand's front edge, tap down toward the glass, to pour.
 * The slider is how far it tilts.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, unproj, tset, tval, tdone, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 17, Z0 = 12, JH = 46, REST = -4, S2 = Math.SQRT1_2;
const ring = (r, n) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-24, -24, 0], [40, 40, 0], [24, -24, 0], [-24, 24, 0], [0, 0, Z0 + JH + 8], [30, 30, Z0 + JH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-21, -21, 21, 21, 6, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, Z0));
  const jar = mk("path", { class: "sil" }, g), lid = mk("path", { class: "nf" }, g), band = mk("path", { class: "nf lo" }, g);
  const tap = mk("path", { class: "nf" }, g), lever = mk("path", { class: "nf" }, g);
  const gx = 34, gy = 34, gr = circ(6, 20).map((q) => ({ ...q, u: q.u + gx, v: q.v + gy })), gi = circ(4.8, 20).map((q) => ({ ...q, u: q.u + gx, v: q.v + gy }));
  put(solid(g), prism(P, front, gr, gi, 0, 13));
  const tilt = tween(REST);
  let last = NaN;

  function T(phi, x, y, z) {
    const a = (x + y) * S2, b = (x - y) * S2, a0 = a - R, h = z - Z0;
    const a2 = R + a0 * Math.cos(phi) + h * Math.sin(phi), h2 = h * Math.cos(phi) - a0 * Math.sin(phi);
    return P((a2 + b) * S2, (a2 - b) * S2, Z0 + h2);
  }
  const cyl = (phi, r, cx, cy, z0, z1, n = 28) => {
    const pts = [];
    for (const q of ring(r, n)) for (const z of [z0, z1]) pts.push(T(phi, q.u + cx, q.v + cy, z));
    return poly(hull(pts));
  };
  const loop = (phi, r, z) => poly(ring(r, 28).map((q) => T(phi, q.u, q.v, z)));

  function draw(a) {
    if (a === last) return;
    last = a;
    const phi = rad(a);
    jar.setAttribute("d", cyl(phi, R, 0, 0, Z0, Z0 + JH, 40));
    band.setAttribute("d", loop(phi, R - 1.5, Z0 + JH - 9));
    lid.setAttribute("d", cyl(phi, R - 2, 0, 0, Z0 + JH, Z0 + JH + 4) + cyl(phi, 3, 0, 0, Z0 + JH + 4, Z0 + JH + 8, 16));
    const tx = (R + 3) * S2;
    tap.setAttribute("d", cyl(phi, 3, tx, tx, Z0 + 1, Z0 + 9, 16));
    lever.setAttribute("d", cyl(phi, 1.4, tx, tx, Z0 + 9, Z0 + 16, 12));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tilt, a ? 12 + 18 * reach : REST, performance.now(), 0);
    tap.classList.toggle("hi", !a);
    jar.classList.toggle("hi", !!a);
    read.textContent = a ? "pour" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    for (const z of [0, Z0 + JH / 2, Z0 + JH]) { const [x, y] = unproj(C, sx, sy, z); if (Math.hypot(x, y) < R + 6) return true; }
    return false;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "buffet2",
  means: "A drink dispenser jar on its stand: the pointer tilts the jar forward on the stand's edge, tap down toward the glass.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[200, 68], [200, 134], [200, 177], null],
  mount,
});
