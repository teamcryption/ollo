/**
 * Dice: five rounded dice on a shallow felt tray, each showing a different
 * face of pips on top. The pointer picks the die nearest it on the tray
 * floor: that die hops up and turns a quarter, and the dice beside it hop a
 * little, staggered by distance. At rest one die sits half turned, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many, picked on the ground plane (terrain).
 */
const {
  Cam, fit, facing, flatDot, place, poly, prism, proj, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TW = 120, TD = 76, TZ = 3, RIM = 7, S = 14, HOP = 16, FAV = 2;
// [x, y, face, yaw at rest in degrees], far to near
const DICE = [[28, 22, 5, 12], [62, 18, 2, -8], [40, 50, 6, -14], [92, 30, 4, 20], [78, 56, 3, 6]];
const PIPS = { 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [TW, TD, 0], [TW, 0, 0], [0, TD, 0], [28, 22, TZ + S + HOP + 4], [92, 30, TZ + S + HOP + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, TW, TD, 8, 1.6);
  put(solid(g), prism(P, front, tr, ti, 0, RIM));
  // the felt floor: the rim's inner lip and the floor line seen inside it
  const lip = rrect(5, 5, TW - 5, TD - 5, 5, 6);
  mk("path", { d: poly(lip.map((q) => P(q.u, q.v, RIM))), class: "nf" }, g);
  mk("path", { d: poly(lip.map((q) => P(q.u, q.v, TZ))), class: "nf lo" }, g);

  const items = DICE.map(([x, y, face, yaw], k) => {
    const el = solid(g), pips = (PIPS[face] || [[0, 0]]).map(() => flatDot(el.g, C, 1.3, "dot off"));
    return { k, x, y, face, yaw, el, pips, t: tween(k === FAV ? 1 : 0), last: NaN };
  });

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const hop = HOP * t * (it.k === act ? 1 : 0.35), a = ((it.yaw + 90 * t) * Math.PI) / 180;
    const ca = Math.cos(a), sa = Math.sin(a), h = S / 2;
    const rot = (ring) => ring.map((q) => ({ u: it.x + q.u * ca - q.v * sa, v: it.y + q.u * sa + q.v * ca, nu: q.nu * ca - q.nv * sa, nv: q.nu * sa + q.nv * ca }));
    const z0 = TZ + hop, z1 = z0 + S;
    put(it.el, prism(P, front, rot(rrect(-h, -h, h, h, 3, 4)), rot(rrect(-h + 1.2, -h + 1.2, h - 1.2, h - 1.2, 2, 4)), z0, z1));
    (PIPS[it.face] || [[0, 0]]).forEach(([pu, pv], i) => {
      const u = pu * 3.6, v = pv * 3.6;
      place(it.pips[i], P(it.x + u * ca - v * sa, it.y + u * sa + v * ca, z1));
    });
  }

  let act = -1;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // pick on the plane of the dice's middles at rest, which never moves
  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, TZ + S / 2);
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(it.x - wx, it.y - wy); if (d < bd) { bd = d; best = k; } });
    return bd < 22 ? best : -1;
  }

  let cur = -2;
  function setActive(a) {
    if (a === cur) return;
    const now = performance.now(), from = a >= 0 ? a : cur;
    cur = a; act = a < 0 ? FAV : a;
    items.forEach((it, k) => {
      const d = a < 0 ? 99 : Math.hypot(it.x - items[a].x, it.y - items[a].y);
      const t = a < 0 ? (k === FAV ? 1 : 0) : k === a ? 1 : d < 40 ? 0.6 : 0;
      tset(it.t, t, now, from < 0 ? 0 : (Math.hypot(it.x - items[from].x, it.y - items[from].y) / 30) * stag);
      const on = k === act;
      it.el.sil.classList.toggle("hi", on);
      it.pips.forEach((p) => p.setAttribute("class", on ? "dot" : "dot off"));
      it.last = NaN;
    });
    read.textContent = a < 0 ? "rest" : "die " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dicetower",
  means: "Five dice on a felt tray: the die nearest the pointer hops and turns a quarter, and the dice beside it hop a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[177, 118], [258, 170], [154, 147], null],
  mount,
});
