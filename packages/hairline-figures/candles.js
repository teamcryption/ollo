/**
 * Candles: six pillar candles of different heights on a long tray, each with
 * a wick and a teardrop flame. The pointer is a warm hand: flames near it
 * grow taller, each on its own spring, falling off with screen distance, and
 * the flame over the candle under it is tallest and bright. At rest one flame
 * is bright. The slider is the reach of the field.
 *
 * The pattern: a continuous field (terrain) along one row; the pick is the
 * candle whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fit, prism, proj, seg, rings, spring, stepS, r2,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 19, H = [34, 48, 26, 40, 54, 30], R = [7, 7.5, 6.5, 8, 7, 6], Y = [2, -3, 4, -2, 3, -1];
const FR = [8, 10, 7, 9, 11, 8], GROW = 16, FAV = 3, TZ = 4, S = 2.05;
const X1 = (N - 1) * STEP + 12;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.69 : u <= 1 ? 0.31 - ((u - 0.42) / 0.58) * 0.22 : 0.09);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, S);
  const pts = [[-12, -14, 0], [X1, 14, 0], [X1, -14, 0], [-12, 14, 0]];
  H.forEach((h, k) => pts.push([k * STEP, Y[k], TZ + h + 3 + FR[k] + GROW]));
  fit(C, pts, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-12, -14, X1, 14, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const cs = H.map((h, k) => {
    const x = k * STEP, y = Y[k], top = TZ + h, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R[k]), disc(x, y, R[k] - 1.4), TZ, top));
    mk("path", { d: seg(P(x, y, top), P(x, y, top + 2.4)), class: "nf lo" }, grp);
    const flame = mk("path", { class: "sil" }, grp);
    return { k, x, y, top, flame, sp: spring(FR[k], { eps: 0.02 }), last: NaN, mid: P(x, y, TZ + h / 2) };
  });

  const rr = 2.2 * S;
  function draw(c) {
    const h = c.sp.x;
    if (h === c.last) return;
    c.last = h;
    const [bx, by] = P(c.x, c.y, c.top + 2.4), [tx, ty] = P(c.x, c.y, c.top + 2.4 + h);
    const cy = by - rr, mid = cy - (cy - ty) * 0.55;
    c.flame.setAttribute("d", `M${r2(tx)} ${r2(ty)}C${r2(tx + rr * 0.25)} ${r2(mid)} ${r2(bx + rr)} ${r2(cy - rr * 0.8)} ${r2(bx + rr)} ${r2(cy)}` +
      `A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(bx - rr)} ${r2(cy)}C${r2(bx - rr)} ${r2(cy - rr * 0.8)} ${r2(tx - rr * 0.25)} ${r2(mid)} ${r2(tx)} ${r2(ty)}Z`);
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cs) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    cs.forEach((c, k) => { const d = Math.abs(c.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 15 && Math.abs(cs[best].mid[1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function aim(p) {
    const a = p ? hit(p) : -1;
    cs.forEach((c) => {
      c.sp.t = a < 0 ? FR[c.k] : FR[c.k] + GROW * (c.k === a ? 1 : 0.85 * falloff(Math.abs(c.mid[0] - p[0]) / reach));
    });
    if (a !== act) {
      act = a;
      cs.forEach((c) => c.flame.classList.toggle("hi", c.k === (a < 0 ? FAV : a)));
      read.textContent = a < 0 ? "rest" : "candle " + (a + 1);
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "candles",
  means: "Six pillar candles on a tray: flames near the pointer grow taller, the one under it tallest and bright.",
  rules: [1, 3, 4, 8],
  range: [30, 60, 110],
  tour: [[128, 126], [217, 147], [270, 200], null],
  mount,
});
