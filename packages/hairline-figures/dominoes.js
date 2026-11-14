/**
 * Dominoes: a row of six tiles standing on edge on a low board, each with
 * its centre bar and pips on the face. The pointer picks a tile by where it
 * stands: it tips forward on its foot edge, bright, and the tiles beside it
 * lean a little, staggered from it. At rest the row leans unevenly and one
 * tile is tipped. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, hull, open, poly, prism, proj, facing, rings, rrect, circ, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, rad, solid,
} = HL;

const N = 6, STEP = 15, T = 4, W = 16, H = 30, TIP = 17, FAV = 3, BZ = 3;
const X1 = (N - 1) * STEP + T + 12, Y0 = 6;
const RESTS = [2, 5, 0, TIP * 0.7, 3, 1];
const PIPS = [[1, 3], [2, 5], [4, 0], [3, 6], [5, 2], [6, 1]];
const SPOT = { 0: [], 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [X1, Y0 * 2 + W, 0], [X1, 0, 0], [0, Y0 * 2 + W, 0], [6, Y0 + W / 2, BZ + H + 2], [X1, Y0 + W / 2, BZ + H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y0 * 2 + W, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const ring = rrect(Y0, 0, Y0 + W, H, 2, 4), inner = rrect(Y0 + 1.2, 1.2, Y0 + W - 1.2, H - 1.2, 1, 4);
  const items = PIPS.map((pp, k) => {
    const x0 = 6 + k * STEP, grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp), marks = mk("path", { class: "nf" }, grp);
    return { k, x0, pp, sil, cr, marks, rest: RESTS[k], a: tween(RESTS[k]), last: NaN };
  });

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = rad(deg), ca = Math.cos(a), sa = Math.sin(a), ft = it.x0 + T;
    const W3 = (x, y, z) => P(ft + (x - T) * ca + z * sa, y, BZ + z * ca - (x - T) * sa);
    const back = ring.map((q) => W3(0, q.u, q.v)), face = ring.map((q) => W3(T, q.u, q.v));
    it.sil.setAttribute("d", poly(hull(back.concat(face))));
    it.cr.setAttribute("d", poly(inner.map((q) => W3(T, q.u, q.v))));
    let d = seg(W3(T, Y0 + 3, H / 2), W3(T, Y0 + W - 3, H / 2));
    it.pp.forEach((n, h) => {
      const zc = h === 0 ? H * 0.75 : H * 0.25;
      for (const [i, j] of SPOT[n]) d += poly(circ(1.2, 10).map((q) => W3(T, Y0 + W / 2 + i * 4 + q.u, zc + j * 4 + q.v)));
    });
    it.marks.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + T / 2, Y0 + W / 2, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? it.rest : dd === 0 ? TIP : dd === 1 ? 4 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tile " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dominoes",
  means: "A row of dominoes standing on edge: the tile under the pointer tips forward on its foot, and its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[214, 165], [130, 120], [270, 195], null],
  mount,
});
