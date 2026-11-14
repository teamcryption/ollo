/**
 * Shop shelving: a shelf board on a back panel with a row of six products of
 * different sizes faced up along it. The pointer picks a product by where it
 * is along the shelf: that one is pulled forward to the shelf edge, the
 * neighbours shift a little after it, staggered from it. At rest the row is
 * faced unevenly, one product already pulled forward, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest resting
 * centre by screen x, paint order follows x + y as products move forward.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = [12, 16, 10, 14, 18, 12], H = [22, 30, 16, 26, 20, 34], D = [12, 14, 10, 12, 16, 10];
const N = W.length, GAP = 3, X1 = W.reduce((s, w) => s + w + GAP, GAP), DEPTH = 26, PULL = 9;
const REST = [1, 0, 3, 0, 2, 1], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, -3, 0], [X1, -3, 0], [X1, DEPTH, -4], [0, DEPTH, -4], [0, -3, 48], [X1, -3, 48]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the back panel and the shelf board, a thin plate with a lip
  const back = solid(g);
  { const [r, i] = rings(0, -3, X1, 0, 1.2, 0.6); put(back, prism(P, front, r, i, -4, 48)); }
  const board = solid(g);
  { const [r, i] = rings(0, 0, X1, DEPTH, 2, 1.2); put(board, prism(P, front, r, i, -4, 0)); }
  const lip = solid(g);
  { const [r, i] = rings(1, DEPTH - 1.6, X1 - 1, DEPTH, 0.6, 0.3); put(lip, prism(P, front, r, i, 0, 2.2)); }

  const items = [];
  let x = GAP;
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    items.push({ k, x0: x, x1: x + W[k], s, y: tween(REST[k]), last: NaN, cx: P(x + W[k] / 2, 2 + D[k] / 2, H[k] / 2)[0] });
    x += W[k] + GAP;
  }
  function draw(it, dy) {
    if (dy === it.last) return false;
    it.last = dy;
    const y0 = 2 + dy, [r, i] = rings(it.x0, y0, it.x1, y0 + D[it.k], 2.2, 1);
    put(it.s, prism(P, front, r, i, 0, H[it.k]));
    return true;
  }
  function order() {
    const sorted = items.slice().sort((a, b) => (a.x0 + a.last) - (b.x0 + b.last) || a.k - b.k);
    sorted.forEach((it) => g.appendChild(it.s.g));
    g.appendChild(lip.g);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false, changed = false;
    items.forEach((it) => { if (draw(it, tval(it.y, now))) changed = true; if (!tdone(it.y, now)) moving = true; });
    if (changed) order();
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest resting centre by screen x, inside the shelf's footprint
  function hit([sx, sy]) {
    const [hx, hy] = unproj(C, sx, sy, 14);
    if (hx < -6 || hx > X1 + 6 || hy < -10 || hy > DEPTH + 10) return -1;
    let best = -1, bd = 1e9;
    items.forEach((it) => { const d = Math.abs(it.cx - sx); if (d < bd) { bd = d; best = it.k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const y = a < 0 ? REST[k] : k === a ? clamp(DEPTH - 4 - D[k], 4, PULL) : clamp(2 - Math.abs(k - a), 0, 2);
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "item " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shopshelves",
  means: "A shop shelf of six products: the one under the pointer is pulled forward to the edge, its neighbours shift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[155, 148], [225, 196], [264, 194], null],
  mount,
});
