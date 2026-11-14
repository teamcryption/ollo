/**
 * Ticker board: four rows of price tiles on a low board, each tile standing
 * at its own height like a quote. The pointer picks a row and a column by
 * where it falls on the board: that row's tiles rise, spreading out from the
 * column under the pointer. At rest one tile stands tall, bright. The slider
 * is the stagger.
 *
 * The pattern: a field picked on the ground plane (terrain).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 4, M = 6, W = 14, D = 14, G = 3, BZ = 3;
const PR = [[3, 5, 4, 7, 6, 8], [6, 4, 5, 3, 4, 2], [2, 3, 5, 4, 6, 5], [5, 6, 4, 5, 3, 4]];
const FAV = [1, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const X1 = M * (W + G) + G, Y1 = R * (D + G) + G;
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, 0, BZ + 28], [X1, 0, BZ + 28]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 5, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const rest = (r, c) => PR[r][c] + (r === FAV[0] && c === FAV[1] ? 9 : 0);
  const cells = [];
  for (let s = 0; s <= R + M - 2; s++) for (let r = 0; r < R; r++) {
    const c = s - r; if (c < 0 || c >= M) continue;
    const x = G + c * (W + G), y = G + r * (D + G);
    const [ring, inner] = rings(x, y, x + W, y + D, 2.5, 1.2);
    cells.push({ r, c, ring, inner, s: solid(g), z: tween(rest(r, c)), last: NaN });
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of cells) {
      const h = tval(it.z, now);
      if (h !== it.last) { it.last = h; put(it.s, prism(P, front, it.ring, it.inner, BZ, BZ + h)); }
      if (!tdone(it.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(L.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    if (x < 0 || y < 0 || x > X1 || y > Y1) return null;
    return [clamp(Math.floor((y - G / 2) / (D + G)), 0, R - 1), clamp(Math.floor((x - G / 2) / (W + G)), 0, M - 1)];
  }

  let key = "";
  function setActive(a) {
    const k = a ? a.join() : "rest";
    if (k === key) return;
    const now = performance.now();
    key = k;
    for (const it of cells) {
      const on = a ? it.r === a[0] : false;
      tset(it.z, on ? PR[it.r][it.c] + 18 : a ? 2 : rest(it.r, it.c), now, a ? Math.abs(it.c - a[1]) * stag : 0);
      it.s.sil.classList.toggle("hi", a ? on && it.c === a[1] : it.r === FAV[0] && it.c === FAV[1]);
    }
    read.textContent = a ? "row " + (a[0] + 1) + "·" + (a[1] + 1) : "rest";
    L.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "stocktick",
  means: "Rows of price tiles on a ticker board: the row under the pointer rises, spreading out from the tile it touches.",
  rules: [1, 2, 3, 5],
  range: [0, 40, 80],
  tour: [[172, 136], [221, 197], [223, 253], null],
  mount,
});
