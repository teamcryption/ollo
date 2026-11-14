/**
 * Hurdles: four hurdles standing down a lane, each two posts and a board.
 * The pointer picks a hurdle by where it stands: it tips forward on its
 * feet as if clipped, and the ones beside it rock a little, staggered.
 * At rest one hurdle leans, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, H = 30, Y0 = 4, Y1 = 40, FAV = 1, TIP = 62, LZ = 3;
const X1 = (N - 1) * STEP + 32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X1 + 14, Y1 + 6, 0], [X1 + 14, -4, 0], [-4, Y1 + 6, 0], [16, Y0, H + 6], [X1 - 16, Y1, H + 6]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [lr, li] = rings(-4, -4, X1 + 14, Y1 + 6, 6, 2);
  put(solid(g), prism(P, front, lr, li, 0, LZ));
  mk("path", { d: seg(P(-2, (Y0 + Y1) / 2, LZ), P(X1 + 12, (Y0 + Y1) / 2, LZ)), class: "dash" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 16 + k * STEP, grp = mk("g", {}, g);
    for (const y of [Y0, Y1]) mk("path", { d: seg(P(x - 9, y, LZ), P(x + 3, y, LZ)), class: "nf" }, grp);
    const posts = mk("path", { class: "nf" }, grp), board = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, posts, board, edge, a: tween(k === FAV ? 22 : 0), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const s = Math.sin(rad(deg)), c = Math.cos(rad(deg));
    const at = (dx, y, h) => P(it.x + dx * c + h * s, y, LZ - dx * s + h * c);
    it.posts.setAttribute("d", seg(at(0, Y0, 0), at(0, Y0, H - 7)) + seg(at(0, Y1, 0), at(0, Y1, H - 7)));
    const pts = [];
    for (const dx of [-1, 1]) for (const y of [Y0 - 2, Y1 + 2]) for (const h of [H - 8, H]) pts.push(at(dx, y, h));
    const hl = hull(pts);
    it.board.setAttribute("d", poly(fillet(hl, hl.map(() => 1.6), 3)));
    it.edge.setAttribute("d", seg(at(1, Y0 - 1, H - 1), at(1, Y1 + 1, H - 1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, (Y0 + Y1) / 2, LZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), t = a < 0 ? (k === FAV ? 22 : 0) : d === 0 ? TIP : d === 1 ? 12 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.board.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hurdle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hurdles",
  means: "Four hurdles down a lane: the hurdle under the pointer tips forward on its feet as if clipped, and its neighbours rock a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[119, 121], [167, 145], [264, 193], null],
  mount,
});
