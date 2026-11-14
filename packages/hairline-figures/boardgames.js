/**
 * Board game: a square board ruled into cells, with four pawns standing on
 * it and a die beside them. The pointer picks a pawn by where it stands: that
 * pawn hops up off its cell, and the pawns near it lift a little, staggered
 * by distance. At rest one pawn is mid-hop, bright. The slider is the stagger.
 *
 * The pattern: a few parts on a plane, picked by their own rest pose.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 100, CELLS = 5, CW = W / CELLS, TZ = 5, HOP = 16, FAV = 2;
const SPOTS = [[1, 1], [3, 1], [1, 3], [3, 3]].map(([i, j]) => [(i + 0.5) * CW, (j + 0.5) * CW]);
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  let stag = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [CW * 1.5, CW * 1.5, TZ + HOP + 16], [CW * 3.5, CW * 1.5, TZ + HOP + 16]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, W, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, TZ));
  let d = "";
  for (let k = 1; k < CELLS; k++) {
    d += seg(P(k * CW, 3, TZ), P(k * CW, W - 3, TZ)) + seg(P(3, k * CW, TZ), P(W - 3, k * CW, TZ));
  }
  mk("path", { d, class: "nf lo" }, g);

  const pawns = SPOTS.map(([x, y], k) => ({ k, x, y, z: tween(k === FAV ? HOP * 0.5 : 0), last: NaN }));
  // the die, at the near free corner of the board, painted with the pawns by depth
  const parts = pawns.map((p) => ({ s: p.x + p.y, p })).concat([{ s: 2 * (W - CW * 0.5) - 1, die: true }]).sort((a, b) => a.s - b.s);
  for (const it of parts) {
    const grp = mk("g", {}, g);
    if (it.die) {
      const x = W - CW * 0.5 + 3, y = W - CW * 0.5 - 2, h = 6;
      const [dr, di] = rings(x - h, y - h, x + h, y + h, 2.4, 1.2);
      put(solid(grp), prism(P, front, dr, di, TZ, TZ + 2 * h));
      continue;
    }
    const p = it.p;
    p.body = mk("path", { class: "sil" }, grp); p.head = mk("path", { class: "sil" }, grp); p.crease = mk("path", { class: "nf lo" }, grp);
  }

  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    const z = TZ + lift;
    p.body.setAttribute("d", poly(hull(ringAt(P, disc(p.x, p.y, 6.5), z).concat(ringAt(P, disc(p.x, p.y, 6.5), z + 2), ringAt(P, disc(p.x, p.y, 2.2), z + 11)))));
    const head = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI; head.push(...ringAt(P, disc(p.x, p.y, Math.max(0.3, 4.2 * Math.sin(t))), z + 14.5 - 4.2 * Math.cos(t))); }
    p.head.setAttribute("d", poly(hull(head)));
    p.crease.setAttribute("d", poly(ringAt(P, disc(p.x, p.y, 5.2), z + 2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pawns) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // rule 01: each pawn tests the pointer on a plane through its own rest middle
  function hit([sx, sy]) {
    let best = -1, bd = 14;
    for (const p of pawns) {
      const [wx, wy] = unproj(C, sx, sy, TZ + 8);
      const dd = Math.hypot(wx - p.x, wy - p.y);
      if (dd < bd) { bd = dd; best = p.k; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const src = from >= 0 ? pawns[from] : null;
    for (const p of pawns) {
      const dist = src ? Math.round(Math.hypot(p.x - src.x, p.y - src.y) / (2 * CW)) : 0;
      const z = a < 0 ? (p.k === FAV ? HOP * 0.5 : 0) : p.k === a ? HOP : dist === 1 ? 4 : 0;
      tset(p.z, z, now, dist * stag);
      const on = p.k === (a < 0 ? FAV : a);
      p.body.classList.toggle("hi", on); p.head.classList.toggle("hi", on);
    }
    read.textContent = a < 0 ? "rest" : "pawn " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "boardgames",
  means: "Four pawns and a die on a ruled board: the pawn under the pointer hops off its cell, and the pawns near it lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 127], [255, 155], [200, 182], null],
  mount,
});
