/**
 * Slide puzzle: a tray of eight square tiles in a three by three frame,
 * one corner slot empty. The pointer picks a tile on the tiles' top plane:
 * when it shares a row or column with the gap, it and the tiles between
 * slide one slot into the gap, staggered from it. At rest one tile sits
 * half way into the gap, bright. The slider is the stagger.
 *
 * The pattern: one of many on a grid (lockers), parts sliding one slot.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, T = 20, G = 1.5, F = 5, TZ = 4, TH = 7, W = 2 * F + N * T;
const GX = 2, GY = 2, FAV = 5; // gap at (2,2); tile index 5 is (1,2)

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [0, 0, TZ + TH], [W, W, TZ + TH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(0, 0, W, W, 5, 1.8);
  put(solid(g), prism(P, front, fr, fi, 0, TZ));
  const well = rings(F - 1, F - 1, W - F + 1, W - F + 1, 2, 0.5)[0];
  mk("path", { d: "M" + well.map((q) => P(q.u, q.v, TZ).join(",")).join("L") + "Z", class: "nf lo" }, g);
  const tl = mk("g", {}, g);

  const tiles = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    if (i === GX && j === GY) continue;
    const el = solid(tl);
    const dir = i === GX ? [0, 1] : j === GY ? [1, 0] : [0, 0];
    tiles.push({ i, j, el, dir, s: tween(0), last: NaN, key: 0 });
  }
  tiles.forEach((t, k) => { t.rest = k === FAV ? 0.5 : 0; t.s = tween(t.rest); });

  function draw(t, s) {
    const x0 = F + t.i * T + G / 2 + s * T * t.dir[0], y0 = F + t.j * T + G / 2 + s * T * t.dir[1];
    t.key = x0 + y0;
    put(t.el, prism(P, front, ...rings(x0, y0, x0 + T - G, y0 + T - G, 3, 1.4), TZ, TZ + TH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, dirty = false;
    for (const t of tiles) {
      const s = tval(t.s, now);
      if (s !== t.last) { draw(t, s); t.last = s; dirty = true; }
      if (!tdone(t.s, now)) moving = true;
    }
    if (dirty) [...tiles].sort((a, b) => a.key - b.key).forEach((t) => tl.appendChild(t.el.g));
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ + TH);
    const i = Math.floor((x - F) / T), j = Math.floor((y - F) / T);
    if (i < 0 || j < 0 || i >= N || j >= N) return -1;
    return tiles.findIndex((t) => t.i === i && t.j === j);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now(), at = a >= 0 ? tiles[a] : null;
    tiles.forEach((t, k) => {
      let s = t.rest, d = 0;
      if (at) {
        s = 0;
        if (at.dir[0] && t.dir[0] && t.i >= at.i) { s = 1; d = t.i - at.i; }
        if (at.dir[1] && t.dir[1] && t.j >= at.j) { s = 1; d = t.j - at.j; }
      }
      tset(t.s, s, now, d * stag);
      t.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = at ? `tile ${at.i + 1}·${at.j + 1}` : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "slidepuzzle",
  means: "A sliding tile puzzle with one empty corner: the tile under the pointer and those between it and the gap slide one slot over.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 160], [240, 190], [170, 150], null],
  mount,
});
