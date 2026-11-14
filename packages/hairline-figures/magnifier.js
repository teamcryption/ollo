/**
 * Magnifier: a hand lens held over a specimen slide strewn with grains. The
 * lens slides to follow the pointer across the slide, clamped to its edge,
 * and the grains under the glass come up a step. At rest the lens sits off
 * centre with its rim bright. The slider is the lens's height.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 46, LR = 15, RX = -10, RY = 8;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let LZ = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-W, -W, 0], [W, W, 0], [W, -W, 0], [-W, W, 0], [W, W, 40], [-W, -W, 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-W, -W * 0.62, W, W * 0.62, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 3));
  const grains = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 34; i++) {
    const x = (rnd() * 2 - 1) * (W - 8), y = (rnd() * 2 - 1) * (W * 0.62 - 6), d = flatDot(g, C, 1.6, "dot off");
    place(d, P(x, y, 3)); grains.push({ x, y, d, on: false });
  }
  const lg = mk("g", {}, svg);
  const handle = solid(lg), lens = mk("path", { class: "sil hi nf" }, lg), inner = mk("path", { class: "nf lo" }, lg);
  const mx = spring(RX), my = spring(RY);
  let lx = NaN, ly = NaN, lz = NaN;
  function draw(x, y) {
    if (x === lx && y === ly && LZ === lz) return;
    lx = x; ly = y; lz = LZ;
    const a = ringAt(P, disc(x, y, LR), LZ), b = ringAt(P, disc(x, y, LR), LZ + 2.5);
    lens.setAttribute("d", poly(hull(a.concat(b))) + " " + poly(ringAt(P, disc(x, y, LR - 2.2), LZ + 2.5)));
    inner.setAttribute("d", poly(ringAt(P, disc(x, y, LR - 3.4), LZ + 2.5)));
    const [hr, hi] = rings(x + LR - 1, y - 2.2, x + LR + 26, y + 2.2, 2.2, 0.8);
    put(handle, prism(P, front, hr, hi, LZ, LZ + 4.5));
    for (const gr of grains) {
      const on = Math.hypot(gr.x - x, gr.y - y) < LR - 3;
      if (on !== gr.on) { gr.on = on; gr.d.setAttribute("class", on ? "dot m" : "dot off"); place(gr.d, P(gr.x, gr.y, on ? 6 : 3)); }
    }
  }
  const B = register(stage, (dt) => { const m = stepS(mx, dt) | stepS(my, dt); draw(mx.x, my.x); return !!m; });
  bag.add(B.unregister);
  function aim(x, y, rest) {
    mx.t = clamp(x, -W + 8, W - 8); my.t = clamp(y, -W * 0.62 + 6, W * 0.62 - 6);
    read.textContent = rest ? "rest" : "x" + Math.round(mx.t) + " y" + Math.round(my.t);
    B.wake();
  }
  draw(RX, RY); read.textContent = "rest";
  bag.add(pointer(stage, { move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(x, y, false); }, leave: () => aim(RX, RY, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { LZ = v; lz = NaN; B.wake(); draw(mx.x, my.x); }, destroy: bag.dispose };
}

hairline({
  name: "magnifier",
  means: "A hand lens over a specimen slide: it slides after the pointer, and the grains under the glass come up a step.",
  rules: [1, 3, 4, 8],
  range: [12, 20, 30],
  tour: [[294, 212], [78, 189], [228, 264], null],
  mount,
});
