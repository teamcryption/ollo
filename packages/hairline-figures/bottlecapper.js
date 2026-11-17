/**
 * Bottle capper: a bench capper on a base plate, a bottle under its bell.
 * The pointer over the capper pulls the long lever down: it swings on its
 * pivot at the column top, and the head with its bell slides down the
 * column onto the cap. At rest the lever is raised, bright. The slider is
 * how far the lever travels.
 *
 * The pattern: one part turning on a pivot, a second sliding with it.
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BX = 46, BY = 22, PX = 11, PZ = 96, L = 74, A0 = 0.62, A1 = -0.2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [64, 44, 0], [PX + L * Math.cos(A0), 22, PZ + L * Math.sin(A0) + 4], [PX, 22, PZ + 6], [0, 44, 0], [64, 0, 0]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, z0, x1, y1, z1) => hull([x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => P(x, y, z)))));
  const cyl = (x, y, r, z0, z1) => hull(ringAt(P, disc(x, y, r), z0).concat(ringAt(P, disc(x, y, r), z1)));

  mk("path", { d: poly(box(0, 0, 0, 64, 44, 4)) }, g);
  mk("path", { d: poly(box(PX - 4, 18, 4, PX + 4, 26, PZ)) }, g);
  // the bottle: body, shoulder, neck, crown cap
  const bottle = [];
  for (const [r, z] of [[9, 4], [9, 36], [6, 44], [3.6, 52], [3.6, 60]]) bottle.push(...ringAt(P, disc(BX, BY, r), z));
  mk("path", { d: poly(hull(bottle)) }, g);
  mk("path", { d: poly(cyl(BX, BY, 4.4, 60, 63)) }, g);
  const head = mk("path", {}, g), bell = mk("path", {}, g);
  const lever = mk("path", { class: "sil" }, g), grip = mk("path", { class: "sil" }, g);
  mk("path", { d: poly(cyl(PX, 22, 3, PZ - 1, PZ + 1)), class: "nf" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const a = A0 + (A1 - A0) * p, ca = Math.cos(a), sa = Math.sin(a);
    const pt = (s, dz, y) => P(PX + s * ca - dz * sa, y, PZ + s * sa + dz * ca);
    const lv = [];
    for (const s of [-6, L]) for (const dz of [-2.5, 2.5]) for (const y of [19.5, 24.5]) lv.push(pt(s, dz, y));
    lever.setAttribute("d", poly(hull(lv)));
    const gp = [];
    for (const s of [L - 14, L + 2]) for (const dz of [-4, 4]) for (const y of [18.5, 25.5]) gp.push(pt(s, dz, y));
    grip.setAttribute("d", poly(hull(gp)));
    const hz = 80 - 16 * p;
    head.setAttribute("d", poly(box(PX - 6, 17, hz, BX + 2, 27, hz + 7)));
    bell.setAttribute("d", poly(cyl(BX, BY, 6, hz - 9, hz)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(32, 22, 48), end = P(PX + (L - 6) * Math.cos(A0), 22, PZ + (L - 6) * Math.sin(A0));
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a > 0 ? reach : 0, performance.now(), 0);
    read.textContent = a > 0 ? "cap " + Math.round(reach * 100) : "rest";
    B.wake();
  }
  setActive(0);
  lever.classList.add("hi");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 95 || Math.hypot(sx - end[0], sy - end[1]) < 50 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "bottlecapper",
  means: "A bench bottle capper: the pointer pulls its long lever down, and the head slides down the column to crimp the cap.",
  rules: [1, 3, 5, 6],
  range: [40, 100, 100],
  tour: [[260, 22], [200, 180], [216, 300], null],
  mount,
});
