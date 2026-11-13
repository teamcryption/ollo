/**
 * Fridge: a tall cabinet with its door swung open, three shelves of jars and
 * bottles showing through the opening and ledges on the door's inner face.
 * The pointer picks an item by where it stands: it slides forward off its
 * shelf, and the items beside it ease forward a little, staggered from it.
 * The door swings wider as the pointer comes near it. At rest one jar stands
 * half out, bright. The slider is the stagger.
 *
 * The pattern: a grid on a face plane (depositboxes); the pick is the item
 * whose resting middle is nearest the pointer on screen.
 */
const {
  Cam, clamp, fillet, fit, hull, open, poly, prism, proj, rad, rings, rrect, seg, ringAt, run, spring, stepS, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 46, D = 34, H = 104, T = 5, OX0 = 3, OX1 = W - 3, OZ0 = 8, OZ1 = 96, SD = 7;
const LV = [64, 38, 12], XS = [11, 22, 33], FAV = 4, OUT = 12, PH0 = 100, PH1 = 128;
// per item: [radius, height, kind] — 0 jar with a lid, 1 bottle with a neck
const KIND = [[4, 8, 0], [3, 13, 1], [4.5, 10, 0], [3.2, 15, 1], [4.5, 9, 0], [3, 12, 1], [4.2, 11, 0], [3.4, 14, 1], [4.5, 8, 0]];
const REST = [1, 0, 2, 0, 5, 1, 0, 2, 0];

/** The door's ring at angle ph: u along the door from the hinge, t through it, mapped to world x, y. */
function doorRing(ph, u0, u1, t0, t1, r) {
  const a = rad(ph), c = Math.cos(a), s = Math.sin(a);
  return rrect(u0, t0, u1, t1, r, 4).map((q) => ({ u: q.u * c - q.v * s, v: D + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.86);
  const ext = [[W, 0, H], [W, D, 0], [0, 0, H]];
  for (const ph of [PH0, PH1]) for (const q of doorRing(ph, 0, W, 0, T, 2)) ext.push([q.u, q.v, 0], [q.u, q.v, H]);
  ext.push([XS[0], D + OUT, 0]);
  fit(C, ext, 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the door, with its ledges on the inner face, redrawn as it swings
  const door = solid(g), ledges = [0, 1, 2].map(() => solid(g));
  let dLast = NaN;
  function drawDoor(ph) {
    if (Math.abs(ph - dLast) < 0.01) return;
    dLast = ph;
    put(door, prism(P, front, doorRing(ph, 0, W, 0, T, 2), doorRing(ph, 1, W - 1, 1, T - 1, 1.2), 0, H));
    ledges.forEach((l, i) => put(l, prism(P, front, doorRing(ph, 5, W - 5, -5, 0, 1.4), doorRing(ph, 5.7, W - 5.7, -4.3, -0.7, 0.8), LV[i] + 8, LV[i] + 14)));
  }

  // the cabinet, its opening, and the shelves as plates that stop short of the hidden right wall
  const [br, bi] = rings(0, 0, W, D, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const op = fillet([P(OX0, D, OZ0), P(OX1, D, OZ0), P(OX1, D, OZ1), P(OX0, D, OZ1)], [2, 2, 2, 2], 3);
  mk("path", { d: poly(op) }, g);
  mk("path", { class: "nf lo", d: seg(P(OX0, D, OZ0), P(OX0, D - 6, OZ0)) }, g);
  for (const z of LV) {
    const top = [[OX0, D], [OX1, D], [OX1 - SD, D - SD], [OX0, D - SD]];
    const pts = [...top.map(([x, y]) => P(x, y, z)), ...top.map(([x, y]) => P(x, y, z - 1.6))];
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(pts)));
    s.cr.setAttribute("d", open(top.slice(0, 2).map(([x, y]) => P(x, y - 0.6, z))));
  }

  const items = KIND.map(([r, h, kind], i) => {
    const s = Math.floor(i / 3), c = i % 3, grp = mk("g", {}, g);
    return { i, s, c, r, h, kind, grp, body: solid(grp), cap: solid(grp), y: tween(REST[i]), last: NaN };
  });
  function drawItem(it, dy) {
    if (dy === it.last) return;
    it.last = dy;
    const x = XS[it.c], y = D - 5 + dy, z = LV[it.s], r = it.r, h = it.h;
    const [r1, i1] = rings(x - r, y - r, x + r, y + r, r, 0.9);
    put(it.body, prism(P, front, r1, i1, z, z + h));
    const cr = it.kind ? 1.4 : r + 0.4, ch = it.kind ? 4 : 2.2;
    const [r2, i2] = rings(x - cr, y - cr, x + cr, y + cr, cr, Math.min(0.6, cr * 0.4));
    put(it.cap, prism(P, front, r2, i2, z + h, z + h + ch));
  }

  const door_ph = spring(PH0);
  let painted = "";
  const B = register(stage, (dt, now) => {
    let moving = stepS(door_ph, dt);
    drawDoor(door_ph.x);
    for (const it of items) { drawItem(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    const order = items.slice().sort((a, b) => b.s - a.s || XS[a.c] + tval(a.y, now) - (XS[b.c] + tval(b.y, now)));
    const key = order.map((it) => it.i).join();
    if (key !== painted) { painted = key; for (const it of order) g.appendChild(it.grp); }
    return moving;
  });
  bag.add(B.unregister);

  /** The item whose resting middle is nearest the pointer on screen; -1 when none is near. */
  const mids = items.map((it) => P(XS[it.c], D - 5, LV[it.s] + it.h / 2));
  const hinge = P(0, D + W * 0.5, H * 0.55);
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 18 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = a < 0 ? 9 : Math.abs(it.s - items[a].s) + Math.abs(it.c - items[a].c);
      const y = a < 0 ? REST[k] : d === 0 ? OUT : d === 1 ? 3.5 : 0;
      const fd = from < 0 ? 0 : (Math.abs(it.s - items[from].s) + Math.abs(it.c - items[from].c)) * stag;
      tset(it.y, y, now, fd);
      const on = k === (a < 0 ? FAV : a);
      it.body.sil.classList.toggle("hi", on); it.cap.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "shelf " + (items[a].s + 1) + "·" + (items[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: (p) => {
      door_ph.t = PH0 + (PH1 - PH0) * clamp(1 - (Math.hypot(p[0] - hinge[0], p[1] - hinge[1]) - 30) / 110, 0, 1);
      setActive(hit(p)); B.wake();
    },
    leave: () => { door_ph.t = PH0; setActive(-1); B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fridge",
  means: "An open fridge: the jar under the pointer slides forward off its shelf, its neighbours a little; the door swings wider as you near it.",
  rules: [1, 2, 3, 5],
  range: [0, 40, 80],
  tour: [[156, 162], [226, 184], [240, 233], null],
  mount,
});
