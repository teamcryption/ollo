/**
 * Tile game: a row of tiles standing on a wooden rack. The pointer picks a
 * tile by where it stands: it rises out of the rack, and the tiles beside it
 * rise a little, staggered from it. At rest one tile is half raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 17, TW = 14, TD = 7, TH = 22, LIFT = 16, FAV = 2, RZ = 6;
const REST = [1, 0, 0, 2, 0.5, 0];
const X1 = (N - 1) * STEP + TW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-6, -8, 0], [X1 + 6, TD + 14, 0], [X1 + 6, -8, 0], [-6, TD + 14, 0], [0, 2, RZ + TH + LIFT], [X1, 2, RZ + TH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rack: a low back wall and a ledge the tiles stand on
  const [br, bi] = rings(-6, -8, X1 + 6, -2, 2, 1);
  put(solid(g), prism(P, front, br, bi, 0, RZ + 10));
  const [lr, li] = rings(-6, -2, X1 + 6, TD + 14, 3, 1.5);
  put(solid(g), prism(P, front, lr, li, 0, RZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g), s = solid(grp);
    s.sil.classList.add("sil");
    const pip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, s, pip, z: tween(k === FAV ? LIFT * 0.6 : REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [r, i] = rings(it.x, 0, it.x + TW, TD, 2, 1);
    const z0 = RZ + lift;
    put(it.s, prism(P, front, r, i, z0, z0 + TH));
    // a dot pair on the front face, carved into the tile
    const a = P(it.x + TW * 0.5, TD, z0 + TH * 0.66), b = P(it.x + TW * 0.5, TD, z0 + TH * 0.34);
    const c = (p) => "M" + (p[0] - 1.6) + "," + p[1] + "a1.6,1.6 0 1,0 3.2,0a1.6,1.6 0 1,0 -3.2,0";
    it.pip.setAttribute("d", c(a) + c(b));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + TW / 2, TD / 2, RZ + TH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : REST[k]) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "tilegame",
  means: "A row of game tiles on a rack: the tile under the pointer rises out of it, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
