/**
 * Beach huts: three gabled huts on a boardwalk, each with a pair of doors in
 * its front. The pointer picks a hut by where it stands: its doors swing wide
 * open, and the huts beside it open a crack, staggered from it. At rest one
 * hut stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, doors swinging on hinges.
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 40, D = 30, H = 38, GAP = 18, STEP = W + GAP, BZ = 4, DH = 31, DI = 4, DW = (W - 2 * DI) / 2, FAV = 1;
const REST = [0, 24, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = (N - 1) * STEP + W, Y1 = D;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, 0], [X1 + 6, Y1 + 18, 0], [X1 + 6, -6, 0], [-6, Y1 + 18, 0], [W / 2, D / 2, BZ + H + 16], [X1 - W / 2, D / 2, BZ + H + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, Y1 + 18, 4, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // boardwalk planks: dim seams across the deck
  let seams = "";
  for (let x = 8; x < X1; x += 12) seams += "M" + P(x, -4, BZ).join(",") + "L" + P(x, Y1 + 16, BZ).join(",");
  mk("path", { d: seams, class: "lo nf" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + W, grp = mk("g", {}, g);
    const [hr, hi] = rings(x0, 0, x1, D, 2, 1.4);
    put(solid(grp), prism(P, front, hr, hi, BZ, BZ + H));
    // gable roof: ridge runs front to back, gable faces the boardwalk
    const xm = (x0 + x1) / 2, foot = rrect(x0 - 2, -2, x1 + 2, D + 2, 2, 4);
    const top = rrect(xm - 1.5, -2, xm + 1.5, D + 2, 1, 4), inner = rrect(xm - 0.8, -1.3, xm + 0.8, D + 1.3, 0.6, 4);
    put(solid(grp), {
      sil: poly(hull(ringAt(P, foot, BZ + H).concat(ringAt(P, top, BZ + H + 15)))),
      crease: open(ringAt(P, run(inner, front), BZ + H + 15)),
    });
    // doorway on the front face
    const a = DI + x0, b = x1 - DI;
    mk("path", { d: poly([P(a, D, BZ), P(a, D, BZ + DH), P(b, D, BZ + DH), P(b, D, BZ)]), class: "lo" }, grp);
    const door = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "lo nf" }, grp);
    items.push({ k, a, b, door, edge, t: tween(REST[k]), last: NaN, mid: P(xm, D / 2, BZ + H / 2) });
  }

  function leaf(h, dir, ang) {
    const r = (ang * Math.PI) / 180, fx = h + dir * DW * Math.cos(r), fy = D + DW * Math.sin(r);
    return [[h, D], [fx, fy]];
  }
  function draw(it, ang) {
    if (ang === it.last) return;
    it.last = ang;
    let d = "", e = "";
    for (const [h, dir] of [[it.a, 1], [it.b, -1]]) {
      const [p, q] = leaf(h, dir, ang);
      d += poly([P(p[0], p[1], BZ), P(p[0], p[1], BZ + DH), P(q[0], q[1], BZ + DH), P(q[0], q[1], BZ)]);
      // a panel line across each leaf, a third of the way down
      const m = (s) => P(lerp2(p[0], q[0], s), lerp2(p[1], q[1], s), BZ + DH * 0.62);
      e += "M" + m(0.18).join(",") + "L" + m(0.82).join(",");
    }
    it.door.setAttribute("d", d);
    it.edge.setAttribute("d", e);
  }
  const lerp2 = (u, v, s) => u + (v - u) * s;

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const dd = Math.abs(it.mid[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(items[best].mid[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? REST[k] : dd === 0 ? 88 : dd === 1 ? 46 : 12;
      tset(it.t, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.door.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hut " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beachhut",
  means: "Three beach huts on a boardwalk: the hut under the pointer swings its double doors wide, its neighbours open a crack.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[248, 213], [176, 177], [104, 141], null],
  mount,
});
