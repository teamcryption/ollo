/**
 * Chess board: a board of eight by eight squares on a thick plate, with six
 * abstract turned pieces standing on it: pawns, a rook and a king. The
 * pointer picks the piece nearest it, by each piece's resting middle on
 * screen: that piece lifts off the board, and the pieces nearby rise a
 * little, staggered by distance. At rest the king is raised, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many, picked by rest pose (cloches).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CELL = 11, N = 8, BW = CELL * N, BZ = 5, LIFT = 20, FAV = 3;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const at = (c) => (c + 0.5) * CELL;
// [col, row, kind]: 0 pawn, 1 rook, 2 king; sorted far to near (col + row)
const PIECES = [[1, 1, 1], [4, 1, 0], [2, 3, 0], [5, 3, 2], [3, 5, 0], [6, 5, 0]];
const K = 1.4, HTS = [11 * K, 12 * K, 20 * K];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [BW + 4, BW + 4, 0], [BW + 4, -4, 0], [-4, BW + 4, 0], [at(1), at(1), BZ + 18 + LIFT], [at(5), at(3), BZ + 34 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, BW + 4, BW + 4, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the squares: a grid of dim lines on the board's top
  let d = "";
  for (let i = 0; i <= N; i++) d += seg(P(i * CELL, 0, BZ), P(i * CELL, BW, BZ)) + seg(P(0, i * CELL, BZ), P(BW, i * CELL, BZ));
  mk("path", { d, class: "nf lo" }, g);
  // the dark squares: a short dim hatch in each
  let h = "";
  for (let c = 0; c < N; c++) for (let r = 0; r < N; r++) if ((c + r) % 2) h += seg(P(c * CELL + 3, r * CELL + 3, BZ), P(c * CELL + 8, r * CELL + 8, BZ));
  mk("path", { d: h, class: "nf lo" }, g);

  const items = PIECES.map(([c, r, kind], k) => {
    const grp = mk("g", {}, g), body = mk("path", { class: "sil" }, grp), head = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    return { k, x: at(c), y: at(r), kind, grp, body, head, cr, z: tween(k === FAV ? 5 : 0), last: NaN };
  });

  function ball(x, y, z, r) {
    const pts = [];
    for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, r * Math.cos(t) + 0.01, 20), z + r * Math.sin(t))); }
    return poly(hull(pts));
  }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y } = it, z = BZ + lift;
    if (it.kind === 1) {
      it.body.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 4.6 * K, 28), z).concat(ringAt(P, disc(x, y, 3.4 * K, 28), z + 8 * K)))));
      it.head.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 4.2 * K, 28), z + 8 * K).concat(ringAt(P, disc(x, y, 4.2 * K, 28), z + 12 * K)))));
      it.cr.setAttribute("d", poly(ringAt(P, disc(x, y, 2.6 * K, 24), z + 12 * K)) + seg(P(x - 4 * K, y, z + 12 * K), P(x + 4 * K, y, z + 12 * K)) + seg(P(x, y - 4 * K, z + 12 * K), P(x, y + 4 * K, z + 12 * K)));
    } else {
      const top = HTS[it.kind] - (it.kind === 2 ? 6 : 4.5) * K, hr = (it.kind === 2 ? 2.4 : 2.8) * K;
      it.body.setAttribute("d", poly(hull(ringAt(P, disc(x, y, 4.4 * K, 28), z).concat(ringAt(P, disc(x, y, 4.4 * K, 28), z + 1.6 * K), ringAt(P, disc(x, y, 1.6 * K, 20), z + top)))));
      it.head.setAttribute("d", ball(x, y, z + top + hr * 0.8, hr));
      const tz = z + top + hr * 1.8;
      it.cr.setAttribute("d", poly(ringAt(P, disc(x, y, 2.6 * K, 20), z + top - 0.4)) + (it.kind === 2 ? seg(P(x, y, tz), P(x, y, tz + 4 * K)) + seg(P(x - 1.6 * K, y + 1.6 * K, tz + 2.6 * K), P(x + 1.6 * K, y - 1.6 * K, tz + 2.6 * K)) : ""));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BZ + HTS[it.kind] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 0.8); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dist = a < 0 ? 0 : Math.hypot(it.x - items[a].x, it.y - items[a].y) / CELL;
      const z = a < 0 ? (k === FAV ? 5 : 0) : k === a ? LIFT : dist < 2.5 ? 3 : 0;
      const dl = from < 0 ? 0 : (Math.hypot(it.x - items[from].x, it.y - items[from].y) / CELL / 2) * stag;
      tset(it.z, z, now, dl);
      const on = k === (a < 0 ? FAV : a);
      it.body.classList.toggle("hi", on); it.head.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "piece " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chessboard",
  means: "A chess board with six turned pieces: the piece nearest the pointer lifts off the board, and pieces close by rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[200, 133], [230, 166], [170, 172], null],
  mount,
});
