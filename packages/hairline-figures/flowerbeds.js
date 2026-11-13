/**
 * Flower beds: a raised garden bed of planks holding three rows of five
 * tulips, each a stem with two leaves and a cup bloom. The pointer is the
 * sun over the bed: tulips near it grow taller and open their blooms, each on
 * its own spring, falling off with distance, and the one under it grows
 * tallest and is bright. At rest the tulips stand at uneven heights, one
 * bright. The slider is the reach of the field.
 *
 * The pattern: a field (terrain); the hit is on the bed's soil plane, which
 * never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 5, ROWS = 3, SP = 22, BH = 12, GROW = 20, FAV = [1, 2];
const W = COLS * SP, D = ROWS * SP;
const H0 = [[22, 27, 24, 30, 21], [26, 23, 31, 25, 28], [24, 29, 22, 26, 23]];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-3, -3, 0], [W + 3, D + 3, 0], [W + 3, -3, 0], [-3, D + 3, 0], [SP / 2, SP / 2, BH + 31 + GROW + 9], [W - SP / 2, SP / 2, BH + 31 + GROW + 9]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-3, -3, W + 3, D + 3, 3, 2.4);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  // a plank seam along the two near walls
  mk("path", { class: "nf lo", d: open([P(-3, D + 3, BH / 2), P(W + 3, D + 3, BH / 2), P(W + 3, -3, BH / 2)]) }, g);

  const tulips = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = SP / 2 + c * SP + (r % 2 ? 2 : -2), y = SP / 2 + r * SP, fav = r === FAV[0] - 1 && c === FAV[1] - 1;
    tulips.push({ r, c, x, y, h0: H0[r][c], sp: spring(fav ? 0.45 : 0), last: NaN });
  }
  tulips.sort((p, q) => p.x + p.y - (q.x + q.y));
  for (const t of tulips) {
    t.grp = mk("g", {}, g);
    const dir = (t.c + t.r) % 2 ? 1 : -1, z = BH;
    const leaf = (s, len, up) => poly([P(t.x, t.y, z), P(t.x + s * 2.4, t.y + s * 1.2, z + up * 0.45), P(t.x + s * len, t.y + s * 0.4, z + up), P(t.x + s * 0.8, t.y, z + up * 0.5)]);
    mk("path", { d: leaf(dir, 6.5, 13), class: "nf" }, t.grp);
    mk("path", { d: leaf(-dir, 5, 10), class: "nf" }, t.grp);
    t.stem = mk("path", { class: "nf" }, t.grp);
    t.bloom = solid(t.grp);
  }

  function draw(t) {
    const a = t.sp.x;
    if (Math.abs(a - t.last) < 1e-4) return;
    t.last = a;
    const top = BH + t.h0 + GROW * a, ro = 3.4 + 2.4 * a;
    t.stem.setAttribute("d", open([P(t.x, t.y, BH), P(t.x, t.y, top)]));
    const pts = ringAt(P, disc(t.x, t.y, 1.4), top).concat(ringAt(P, disc(t.x, t.y, 3.6), top + 3.5), ringAt(P, disc(t.x, t.y, ro), top + 8 + a));
    put(t.bloom, { sil: poly(hull(pts)), crease: poly(ringAt(P, disc(t.x, t.y, ro - 0.8, 24), top + 7.6 + a)) });
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const t of tulips) { if (stepS(t.sp, dt)) m = true; draw(t); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null, bd = Infinity;
    if (over) for (const t of tulips) { const d = Math.hypot(over[0] - t.x, over[1] - t.y); if (d < bd) { bd = d; near = t; } }
    if (bd > SP * 0.75) near = null;
    for (const t of tulips) {
      const fav = t.r === FAV[0] - 1 && t.c === FAV[1] - 1;
      if (over) {
        const d = Math.hypot(over[0] - t.x, over[1] - t.y), f = Math.exp(-(d * d) / (2 * reach * reach));
        t.sp.t = t === near ? 1 : clamp(0.08 + 0.72 * f, 0, 0.8);
      } else t.sp.t = fav ? 0.45 : 0;
      t.bloom.sil.classList.toggle("hi", near ? t === near : !over && fav);
    }
    read.textContent = near ? "tulip " + (near.r + 1) + "·" + (near.c + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], BH);
      over = x < -SP || y < -SP || x > W + SP || y > D + SP ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "flowerbeds",
  means: "A raised bed of tulips: tulips near the pointer grow and open their blooms, and the one under it grows tallest.",
  rules: [1, 3, 5, 8],
  range: [10, 20, 34],
  tour: [[172, 146], [203, 200], [236, 236], null],
  mount,
});
