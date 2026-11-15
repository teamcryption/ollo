/**
 * Shelf talker: a store shelf plank on two brackets, with a price flag
 * clipped to its front edge and standing out into the aisle. The pointer
 * swings the flag on its clip toward the side it comes from, like a
 * shopper brushing past. At rest the flag stands out at a slant, bright.
 * The slider is how far it swings.
 *
 * The pattern: one part turning about a fixed axis; the hit is on a plane
 * through the shelf.
 */
const { Cam, facing, fit, hull, poly, open, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 40, D = 16, SZ = 22, AX = 20, AY = D + 1, FL = 26, FZ0 = 8, FZ1 = 32, T = 1.2, REST = 70;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 4.6);
  fit(C, [[0, 0, 0], [W, D, SZ + 4], [AX - FL, AY, FZ0], [AX + FL, AY, FZ0], [AX, AY + FL, FZ0], [AX, AY + FL, FZ1]], 200, 168);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r) => { const [o, i] = rings(x0, y0, x1, y1, r, 0.5); put(s, prism(P, front, o, i, z0, z1)); };

  const b1 = solid(g); box(b1, 6, 0, 9, D - 3, 6, SZ, 0.5);
  const b2 = solid(g); box(b2, W - 9, 0, W - 6, D - 3, 6, SZ, 0.5);
  const plank = solid(g); box(plank, 0, 0, W, D, SZ, SZ + 3, 1);
  const clip = solid(g); box(clip, AX - 2, D - 1, AX + 2, D + 2, SZ - 2, SZ + 4, 0.5);
  const flag = solid(g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = (a * Math.PI) / 180, ux = Math.cos(r), uy = Math.sin(r), nx = -uy * T / 2, ny = ux * T / 2;
    const pt = (u, z, s) => P(AX + ux * u + nx * s, AY + uy * u + ny * s, z);
    const pts = [];
    for (const s of [-1, 1]) for (const u of [2, FL]) for (const z of [FZ0, FZ1]) pts.push(pt(u, z, s));
    flag.sil.setAttribute("d", poly(hull(pts)));
    const m = (u, z) => pt(u, z, 1);
    flag.cr.setAttribute("d", open([m(6, FZ0 + 5), m(FL - 4, FZ0 + 5), m(FL - 4, FZ1 - 5), m(6, FZ1 - 5), m(6, FZ0 + 5)]) + open([m(2, SZ + 1.5), m(2, SZ - 1.5)]));
  }
  const R = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(R.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SZ);
    if (x < -10 || x > W + 10 || y < -14 || y > AY + FL + 6) return -1;
    return x < AX ? 0 : 1;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(ang, a < 0 ? REST : a === 0 ? REST + swing : REST - swing, performance.now(), 0);
    flag.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : a === 0 ? "swing <" : "swing >";
    R.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "mannequin3",
  means: "A price flag clipped to a shelf edge: the pointer swings the flag on its clip toward the side it comes from.",
  rules: [1, 3, 4, 5],
  range: [30, 60, 75],
  tour: [[167, 114], [205, 118], [240, 130], null],
  mount,
});
