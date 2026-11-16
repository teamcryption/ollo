/**
 * Coin pusher: a shelf of coins with a heavy pusher block at the back. The
 * pointer is where the stroke reaches: the pusher slides out toward it and
 * shoves the coins in its way toward the lip. At rest the pusher sits back,
 * bright, the coins scattered unevenly. The slider is how far the stroke goes.
 */
const { Cam, fit, proj, facing, rings, prism, circ, unproj, spring, stepS, clamp, disposer, mk, solid, put, register, pointer } = HL;
const W = 46, D = 34, SH = 6, PH = 18, L = 16, REST = 3;
const COINS = [[-30, 2], [-12, 12], [6, -2], [26, 8], [-22, 24], [14, 25], [34, 26]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-W, -D, 0], [W, D, 0], [-W, -D, SH + PH], [W, -D, SH + PH], [-W, D, 0], [W, D, 0]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-W, -D, W, D, 4, 1.6), 0, SH));
  const pu = solid(g);
  const coins = COINS.map(([x, y]) => ({ x, y0: y, s: null })).sort((a, b) => a.x + a.y0 - (b.x + b.y0));
  for (const c of coins) c.s = solid(g);
  let reach = 22 * value;
  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-3) return;
    drawn = sp.x;
    const f = -D + L + sp.x;
    put(pu, prism(P, front, ...rings(-W + 3, -D + 2, W - 3, f, 3, 1.4), SH, SH + PH));
    for (const c of coins) {
      const y = clamp(Math.max(c.y0, f + 5.5), -D, D - 4);
      put(c.s, prism(P, front, disc(c.x, y, 5.2), disc(c.x, y, 4.2), SH, SH + 2.2));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(over) {
    let near = null;
    if (over) {
      const f = Math.max(over[1], -D + L + REST + reach);
      sp.t = clamp(f + D - L, REST, REST + reach);
      let bd = Infinity;
      for (const c of coins) { const d = Math.abs(c.x - over[0]); if (d < bd) { bd = d; near = c; } }
    } else sp.t = REST;
    pu.sil.classList.toggle("hi", !over);
    for (const c of coins) c.s.sil.classList.toggle("hi", c === near);
    read.textContent = over ? "lane " + (1 + Math.round(clamp((over[0] + W) / (2 * W), 0, 1) * 3)) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], SH); set(Math.abs(x) < W + 8 && Math.abs(y) < D + 8 ? [x, y] : null); },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null); draw();
  return { set: (v) => { reach = 22 * v; }, destroy: bag.dispose };
}

hairline({
  name: "claw2",
  means: "A coin pusher shelf: the pusher block slides out toward the pointer and shoves the coins in its path to the lip.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[215, 136], [170, 160], [250, 190], null],
  mount,
});
