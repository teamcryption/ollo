/**
 * First aid kit: an open case on a table, its lid standing up behind it, four
 * compartments along its top holding a bandage roll, a plaster box, a bottle
 * and a roll of tape. The pointer picks the compartment nearest it: that item
 * lifts clear out of its slot, the others lift less the farther they are,
 * staggered from it. At rest the items sit at uneven depths, the bottle
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the case's top.
 */
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, SX = 25, X0 = 13, Y1 = 34, YC = 17, TOP = 18, CLEAR = 8;
const X1 = X0 + (N - 1) * SX + 13;
const FALL = [1, 0.5, 0.24, 0.12], FAV = 2;
// each item: its kind, height, and how much of it shows above the case at rest
const ITEMS = [{ kind: "roll", H: 20, vis: 6 }, { kind: "box", H: 18, vis: 3 }, { kind: "bottle", H: 15, vis: 7 }, { kind: "tape", H: 7, vis: 2 }];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-12, -8, -4], [X1 + 12, Y1 + 12, -4], [X1 + 12, -8, -4], [-12, Y1 + 12, -4], [0, -6, TOP + 32], [X1, -6, TOP + 32]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the table, the lid standing open behind, the case with its compartments and latch
  const [rt, it] = rings(-12, -8, X1 + 12, Y1 + 12, 7, 1.8);
  put(solid(g), prism(P, front, rt, it, -4, 0));
  const [rl, il] = rings(0, -6, X1, 0, 4, 1.4);
  const lid = solid(g);
  put(lid, prism(P, front, rl, il, TOP - 3, TOP + 30));
  mk("path", { class: "nf lo", d: seg(P(6, 0, TOP + 12), P(X1 - 6, 0, TOP + 12)) + seg(P(6, 0, TOP + 17), P(X1 - 6, 0, TOP + 17)) }, lid.g);
  const [rc, ic] = rings(0, 0, X1, Y1, 6, 1.6);
  const cs = solid(g);
  put(cs, prism(P, front, rc, ic, 0, TOP));
  const slots = [];
  for (let k = 0; k < N; k++) slots.push(poly(ringAt(P, rrect(X0 + k * SX - 11, 4, X0 + k * SX + 11, Y1 - 4, 3, 4), TOP)));
  mk("path", { class: "nf lo", d: slots.join("") }, cs.g);
  const [rk, ik] = rings(X1 / 2 - 6, Y1, X1 / 2 + 6, Y1 + 1.6, 0.7, 0.4);
  put(solid(g), prism(P, front, rk, ik, TOP - 7, TOP - 2));

  const items = ITEMS.map((it, k) => {
    const grp = mk("g", {}, g), parts = [solid(grp), solid(grp), solid(grp)];
    const hole = mk("path", { class: "nf lo" }, grp);
    return { ...it, k, x: X0 + k * SX, parts, hole, t: tween(0), last: NaN };
  });

  function piece(s, ring, inner, z0, z1) {
    const a = Math.max(TOP, z0);
    if (z1 <= a + 0.05) { s.sil.setAttribute("d", ""); s.cr.setAttribute("d", ""); return; }
    put(s, prism(P, front, ring, inner, a, z1));
  }
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const zb = TOP - it.H + it.vis + t * (it.H - it.vis + CLEAR), zt = zb + it.H, [p0, p1, p2] = it.parts;
    let hole = "";
    if (it.kind === "roll" || it.kind === "tape") {
      const r = it.kind === "roll" ? 8.5 : 7.5;
      piece(p0, disc(it.x, YC, r), disc(it.x, YC, r - 1.2), zb, zt);
      hole = poly(ringAt(P, disc(it.x, YC, r * 0.38, 24), zt));
    } else if (it.kind === "box") {
      const [rb, ib] = rings(it.x - 6, YC - 11, it.x + 6, YC + 11, 2, 1);
      piece(p0, rb, ib, zb, zt);
      hole = open([P(it.x - 6, YC + 4, zt), P(it.x + 6, YC + 4, zt)]);
    } else {
      piece(p0, disc(it.x, YC, 7), disc(it.x, YC, 5.8), zb, zt);
      piece(p1, disc(it.x, YC, 2.8, 20), null, zt, zt + 3);
      piece(p2, disc(it.x, YC, 3.6, 24), disc(it.x, YC, 2.8, 24), zt + 3, zt + 7);
    }
    it.hole.setAttribute("d", zt > TOP ? hole : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    items.forEach((it) => { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the plane through the case's top, nearest compartment along x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    if (x < -6 || x > X1 + 6 || y < -8 || y > Y1 + 6) return -1;
    return clamp(Math.round((x - X0) / SX), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.t, a < 0 ? 0 : FALL[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.parts.forEach((p) => p.sil.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "slot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "firstaidkit",
  means: "An open first aid kit: the item in the compartment nearest the pointer lifts out, the others lift less, staggered.",
  rules: [1, 2, 3, 5],
  range: [0, 45, 90],
  tour: [[141, 142], [182, 163], [224, 183], null],
  mount,
});
