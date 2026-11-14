/**
 * Book trolley: a library return trolley, a deep tray on a low deck and four
 * castors, with returned books standing in the tray. The pointer picks a book
 * by where it is along the tray: it is drawn up out of the row, the others
 * lift a little, staggered from it. At rest the books stand at uneven heights,
 * one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest resting
 * centre by screen x, inside the tray's fixed band. The tray's front lip and
 * end are painted after the books, so they hide the books' feet.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 6, X0 = 3, T = 4.2, Z0 = 9, LIP = 19;
const HT = [24, 19, 27, 21, 25, 18, 22], DEP = [11, 9, 12, 10, 11, 9, 10];
const FAV = 2, LIFT = 18, BUMP = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const XE = X0 + (N - 1) * STEP + 4;
  const C = Cam(45, 0.5, 4.1);
  fit(C, [[-2, -1, 0], [XE + 2, 15, 0], [-2, 15, 0], [XE + 2, -1, 0], [X0, 1, Z0 + 27 + LIFT], [XE, 1, Z0 + 27 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // castors, the deck, its posts, then the tray behind the books
  const deck = solid(g);
  [[1, 1], [XE - 1, 1]].forEach(([x, y]) => put(solid(g), prism(P, front, circ(1.6, 12).map((s) => ({ ...s, u: s.u + x, v: s.v + y })), circ(1, 12).map((s) => ({ ...s, u: s.u + x, v: s.v + y })), 0, 2.4)));
  put(deck, prism(P, front, ...rings(-1, -0.5, XE + 1, 14.5, 1.6, 0.6), 2.4, 4.2));
  mk("path", { class: "nf lo", d: seg(P(0.5, 0.5, 4.2), P(0.5, 0.5, Z0)) + seg(P(XE - 0.5, 0.5, 4.2), P(XE - 0.5, 0.5, Z0)) }, g);
  put(solid(g), prism(P, front, ...rings(-2, -1, XE + 2, 15, 1.8, 0.7), Z0, LIP));

  const books = [];
  for (let k = 0; k < N; k++) books.push({ x: X0 + k * STEP, s: solid(g), z: tween(0), last: NaN, k });
  // the tray's near end and front lip, painted over the books' feet
  put(solid(g), prism(P, front, ...rings(XE + 0.6, -1, XE + 2, 15, 0.6, 0.3), Z0, LIP));
  put(solid(g), prism(P, front, ...rings(-2, 13.6, XE + 2, 15, 0.6, 0.3), Z0, LIP));
  [[1, 14], [XE - 1, 14]].forEach(([x, y]) => put(solid(g), prism(P, front, circ(1.6, 12).map((s) => ({ ...s, u: s.u + x, v: s.v + y })), circ(1, 12).map((s) => ({ ...s, u: s.u + x, v: s.v + y })), 0, 2.4)));

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const z = Z0 + 1 + lift;
    put(b.s, prism(P, front, ...rings(b.x, 13 - DEP[b.k] - 1, b.x + T, 13, 0.8, 0.4), z, z + HT[b.k]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    books.forEach((b) => { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest resting centre by screen x, inside the band the tray rests in
  const cx = books.map((b) => P(b.x + T / 2, 8, Z0 + HT[b.k] / 2)[0]);
  function hit([sx, sy]) {
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    const b = books[best], top = P(b.x, 2, Z0 + 1 + HT[best] + LIFT)[1] - 6, bot = P(b.x, 15, 0)[1] + 6;
    if (Math.abs(sx - cx[best]) > 14 || sy < top || sy > bot) return -1;
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    books.forEach((b, k) => {
      const z = a < 0 ? (k === FAV ? 4 : 0) : k === a ? LIFT : clamp(BUMP - Math.abs(k - a), 0, BUMP);
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "book " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookreturn",
  means: "A library return trolley: the book under the pointer is drawn up out of the tray, its neighbours lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 163], [219, 191], [254, 215], null],
  mount,
});
