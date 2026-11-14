/**
 * Game keyboard: a low case holding three rows of tall mechanical keycaps,
 * the nearest row broken by a long space bar. The pointer presses the key
 * under it all the way down, and the keys around it dip a little, staggered
 * by distance. At rest one key is held down, bright. The slider is the stagger.
 *
 * The pattern: a field of keys pressing (pianokeys, on a grid).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PIT = 17, KW = 15, BZ = 6, KH = 9, TRAVEL = 6, FAV = 2;
const ROWS = [[0, [1, 1, 1, 1, 1, 1, 1]], [5, [1, 1, 1, 1, 1, 1, 1]], [0, [1.5, 1, 4, 1.5]]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X1 = 7 * PIT + 5 + 6, Y1 = 3 * PIT + 6;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [X1, 0, 0], [0, Y1, 0], [X1, Y1, 0], [0, 0, BZ + KH], [X1, 0, BZ + KH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, X1, Y1, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, BZ));

  const keys = [];
  ROWS.forEach(([off, ws], r) => {
    let x = 6 + off;
    ws.forEach((w) => {
      const x0 = x, x1 = x + w * PIT - (PIT - KW), y0 = 6 + r * PIT, y1 = y0 + KW;
      keys.push({ r, x0, x1, y0, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 });
      x += w * PIT;
    });
  });
  keys.sort((a, b) => a.r - b.r || a.cx - b.cx);
  keys.forEach((k, i) => {
    k.i = i;
    k.s = solid(mk("g", {}, g));
    k.d = tween(i === FAV ? TRAVEL : 0);
    k.last = NaN;
  });

  function draw(k, d) {
    if (d === k.last) return;
    k.last = d;
    const [a, i] = rings(k.x0, k.y0, k.x1, k.y1, 3, 1.6);
    put(k.s, prism(P, front, a, i, BZ, BZ + KH - d));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of keys) { draw(k, tval(k.d, now)); if (!tdone(k.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ + KH);
    let best = -1, bd = Infinity;
    keys.forEach((k, i) => {
      const dx = Math.max(k.x0 - x, 0, x - k.x1), dy = Math.max(k.y0 - y, 0, y - k.y1), dd = dx + dy;
      if (dd < bd) { bd = dd; best = i; }
    });
    return bd < 4 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const src = keys[from >= 0 ? from : FAV];
    keys.forEach((k, i) => {
      const dist = Math.hypot(k.cx - src.cx, k.cy - src.cy) / PIT;
      const d = a < 0 ? (i === FAV ? TRAVEL : 0) : i === a ? TRAVEL : dist < 1.6 ? 2 : 0;
      tset(k.d, d, now, from < 0 ? 0 : dist * stag);
      k.s.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + (keys[a].r + 1) + "·" + (keys.filter((k) => k.r === keys[a].r && k.cx <= keys[a].cx).length);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keyboardtray",
  means: "A mechanical keyboard: the key under the pointer presses all the way down, and the keys around it dip a little.",
  rules: [1, 2, 5, 9],
  range: [0, 40, 80],
  tour: [[145, 103], [205, 162], [239, 203], null],
  mount,
});
