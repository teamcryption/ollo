/**
 * Lightboard: an upright lightbox sign on a low foot, its face carrying three
 * rails of letter tiles set as words. The pointer picks the tile nearest it:
 * that tile slides out of its rail and up, and the tiles beside it in the same
 * word ease out a little, staggered from it. At rest one tile stands out,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many on a face plane.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 144, D = 12, H = 94, TW = 13, TH = 18, TS = 16, OUT = 22, UP = 11;
const ROWS = [[64, [1, 2, 3, 4, 5]], [39, [0, 1, 2, 4, 5, 6, 7]], [14, [2, 3, 4, 5]]];
const FAV = 7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-4, -4, 0], [W + 4, D + 8, 0], [W + 4, -4, 0], [-4, D + 8, 0], [0, 0, H + 4], [W, 0, H + 4], [W / 2, D + OUT + 3, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-4, -4, W + 4, D + 8, 4, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(solid(g), prism(P, front, br, bi, 4, H));
  // the lit face: an inset frame, and a rail under each row
  const fz = (x, z) => P(x, D, z);
  mk("path", { d: poly([fz(6, 10), fz(W - 6, 10), fz(W - 6, H - 6), fz(6, H - 6)]), class: "nf lo" }, g);
  for (const [z] of ROWS) mk("path", { d: open([fz(6, z - 1), fz(W - 6, z - 1)]), class: "nf lo" }, g);

  const layer = mk("g", {}, g), tiles = [];
  ROWS.forEach(([z, cols], r) => cols.forEach((c, k) => {
    const x = 10 + c * TS, s = solid(layer);
    s.sil.classList.add("sil");
    tiles.push({ r, k, x, z, s, o: tween(tiles.length === FAV ? 0.75 : 0), last: NaN });
  }));

  function draw(t, o) {
    if (o === t.last) return;
    t.last = o;
    const y = D + o * OUT, z = t.z + o * UP;
    const [a, b] = rings(t.x, y, t.x + TW, y + 2.6, 1, 0.6);
    put(t.s, prism(P, front, a, b, z, z + TH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tiles) { draw(t, tval(t.o, now)); if (!tdone(t.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = tiles.map((t) => P(t.x + TW / 2, D + 1, t.z + TH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, i) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = i; } });
    return bd < 16 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const on = a < 0 ? FAV : a, A = tiles[on];
    tiles.forEach((t, i) => {
      const dd = t.r === A.r ? Math.abs(t.k - A.k) : 9;
      const o = a < 0 ? (i === FAV ? 0.75 : 0) : dd === 0 ? 1 : dd === 1 ? 0.62 : dd === 2 ? 0.4 : dd === 3 ? 0.2 : 0;
      tset(t.o, o, now, from < 0 ? 0 : Math.min(dd, 6) * stag);
      t.s.sil.classList.toggle("hi", i === on);
    });
    layer.appendChild(A.s.g);
    read.textContent = a < 0 ? "rest" : "r" + (A.r + 1) + "·" + (A.k + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lightboard",
  means: "A lightbox sign with words of tiles on rails: the tile under the pointer slides out and up, its neighbours ease out.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[189, 127], [141, 183], [261, 202], null],
  mount,
});
