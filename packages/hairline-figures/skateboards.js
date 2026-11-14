/**
 * Skateboards: four decks stand on a wall rack, wheels out, leaning back
 * against its rail, each a deck with two kick tails bent back, two trucks
 * (baseplate and hanger) and four wheels. The deck under the pointer tilts
 * out toward the reader and lifts off the rack, and its neighbours tilt a
 * little, staggered from it. At rest one deck is half out, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the deck
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, facing, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [0, 21, 42, 63], Y0 = 6, FAV = 2, L = 66, HW = 5.6;
const REST = [-6, -3, 4, -7], OUT = 19, LIFT = 6, NB = [6, 2];
const uv = (r) => r.map((q) => [q.u, q.v]);
const MID = uv(rrect(-HW, 9, HW, L - 9, 0.8, 3));
const half = (v0, dir) => circ(HW, 24).filter((q) => q.v * dir > 0.01).map((q) => [q.u, v0 + q.v]);
const TAIL0 = half(HW, -1).concat([[HW, HW], [HW, 10], [-HW, 10], [-HW, HW]]);
const TAIL1 = half(L - HW, 1).concat([[-HW, L - HW], [-HW, L - 10], [HW, L - 10], [HW, L - HW]]);
const bend = (v0, v1) => (u, v) => -2.6 * Math.max(0, Math.min(1, (v - v0) / (v1 - v0)));
const TRUCKS = [15, L - 15];
const inset = (pts, d) => {
  const cu = pts.reduce((s, p) => s + p[0], 0) / pts.length, cv = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([u, v]) => { const l = Math.hypot(u - cu, v - cv) || 1; return [u - ((u - cu) / l) * d, v - ((v - cv) / l) * d]; });
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-12, -4, -4], [76, 14, -4], [-12, -4, 66], [76, -4, 66], [-8, 34, 76], [70, 34, 76]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the rail behind, then the ledge the decks stand on
  { const [r, i] = rings(-12, -4, 76, -1, 1.2, 0.6); put(solid(g), prism(P, front, r, i, 50, 55)); }
  { const [r, i] = rings(-12, -4, 76, 14, 2, 1); put(solid(g), prism(P, front, r, i, -4, 0)); }

  const rk = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    const deck = [solid(grp), solid(grp), solid(grp)];
    const parts = TRUCKS.map(() => [solid(grp), solid(grp), solid(grp), solid(grp)]);
    return { k, x, deck, parts, th: tween(REST[k]), z: tween(0), last: "" };
  });

  function draw(b, deg, lift) {
    const key = deg.toFixed(2) + "," + lift.toFixed(2);
    if (key === b.last) return false;
    b.last = key;
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const X = (u, v, w) => P(b.x + u, Y0 + w * c + v * s, lift + v * c - w * s);
    // a slab: its front face at w0 + wf(u, v), its back t behind; the crease is the front face inset
    const slab = (el, pts, w0, t, wf, ins) => {
      const W = (u, v) => w0 + wf(u, v);
      const f = pts.map(([u, v]) => X(u, v, W(u, v))), bk = pts.map(([u, v]) => X(u, v, W(u, v) - t));
      el.sil.setAttribute("d", poly(hull(f.concat(bk))));
      el.cr.setAttribute("d", poly(inset(pts, ins).map(([u, v]) => X(u, v, W(u, v)))));
    };
    const flat = () => 0;
    slab(b.deck[0], TAIL0, 0.6, 1.2, bend(10, 0), 0.9);
    slab(b.deck[1], TAIL1, 0.6, 1.2, bend(L - 10, L), 0.9);
    slab(b.deck[2], MID, 0.6, 1.2, flat, 0.9);
    TRUCKS.forEach((v, i) => {
      const [base, hang, w0, w1] = b.parts[i];
      slab(base, uv(rrect(-2.6, v - 2.2, 2.6, v + 2.2, 0.8, 2)), 1.8, 1.2, flat, 0.6);
      slab(hang, uv(rrect(-6.2, v - 1.2, 6.2, v + 1.2, 0.9, 2)), 3.4, 1.8, flat, 0.45);
      slab(w0, uv(rrect(-HW - 2.6, v - 2.3, -HW + 0.6, v + 2.3, 1.3, 3)), 4.6, 3.6, flat, 0.6);
      slab(w1, uv(rrect(HW - 0.6, v - 2.3, HW + 2.6, v + 2.3, 1.3, 3)), 4.6, 3.6, flat, 0.6);
    });
    return true;
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of rk) { draw(b, tval(b.th, now), tval(b.z, now)); if (!tdone(b.th, now) || !tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The deck whose resting middle is nearest the pointer's x on screen; -1 off the rack. */
  const mids = rk.map((b) => P(b.x, Y0, L / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    rk.forEach((b, k) => {
      const d = Math.abs(k - a);
      const th = a < 0 ? REST[k] : d === 0 ? OUT : d <= 2 ? NB[d - 1] : REST[k];
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(b.th, th, now, delay); tset(b.z, d === 0 ? LIFT : 0, now, delay);
      for (const el of b.deck) el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "deck " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "skateboards",
  means: "Four skateboards on a wall rack: the deck under the pointer tilts out and lifts off, its neighbours tilt a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[227, 128], [160, 95], [260, 145], null],
  mount,
});
