/**
 * Forklift: a counterbalance forklift, a low chassis with a heavy rounded
 * counterweight at the back, a seat under an overhead guard on four posts,
 * four wheels and an upright mast with a carriage and two forks carrying a
 * pallet, facing a three-shelf pallet rack. The pointer's height sets the
 * forks' height: they ride up the mast on a spring, and the shelf level
 * nearest the pointer is bright. At rest the forks wait low and the middle
 * shelf is bright. The slider is how strongly the forks snap to a shelf.
 *
 * The pattern: a continuous value read from the pointer (height on a fixed
 * vertical line through the forks), on a spring; the hit never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = [4, 25, 46], F0 = 11, FMIN = 2, FMAX = 46, MAST = 58, RX0 = 32, RX1 = 54, FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let snap = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-36, -6, -3], [RX1 + 4, 26, -3], [RX1 + 4, -6, -3], [-36, 26, -3], [2, 4, MAST + 1], [RX0, 0, 56]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.6) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(g, -36, -6, RX1 + 4, 26, -3, 0, 5, 1.8);

  /** A wheel: a disc standing in the x–z plane at side y, with its hub on the outer face. */
  const ring = (cx, y, cz, r, n = 24) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(cx + r * Math.cos(t), y, cz + r * Math.sin(t)); });
  const wheel = (cx, y, dy) => {
    mk("path", { d: poly(hull(ring(cx, y, 5, 5).concat(ring(cx, y + dy, 5, 5)))), class: "sil" }, g);
    mk("path", { d: poly(ring(cx, y + (dy > 0 ? dy : 0), 5, 2)), class: "nf lo" }, g);
  };
  wheel(-24, -1, 3); wheel(-4, -1, 3);

  // chassis, counterweight, seat, overhead guard
  box(g, -33, 1, -24, 19, 3, 21, 4, 1.4);
  box(g, -24, 1, -1, 19, 3, 14, 2.5, 1);
  box(g, -20, 5, -13, 15, 14, 20, 2, 0.8);
  for (const [px, py] of [[-22, 2], [-4, 2], [-22, 16], [-4, 16]]) box(g, px, py, px + 2, py + 2, 14, 38, 0.8, 0.4);
  box(g, -24, 1, -2, 19, 38, 40, 2, 0.8);

  // the mast: two rails and a crosshead
  box(g, 0, 3, 2.5, 5.5, 3, MAST, 0.8, 0.4);
  box(g, 0, 14.5, 2.5, 17, 3, MAST, 0.8, 0.4);
  box(g, 0, 3, 2.5, 17, MAST - 3, MAST, 0.8, 0.4);

  // carriage, forks and pallet: redrawn with the fork height
  const lift = mk("g", {}, g);
  const back = solid(lift), forkA = solid(lift), forkB = solid(lift), pal = solid(lift), slats = mk("path", { class: "nf lo" }, lift);
  wheel(-24, 19, 3); wheel(-4, 19, 3);

  // the rack, built bottom up so a higher shelf covers what stands under it
  const POSTS = [[RX0, 0], [RX1 - 2, 0], [RX0, 18], [RX1 - 2, 18]];
  const shelves = [];
  let z = 0;
  for (const lv of L) {
    for (const [px, py] of POSTS) box(g, px, py, px + 2, py + 2, z, lv - 2, 0.6, 0.3);
    shelves.push(box(g, RX0 - 0.5, -0.5, RX1 + 0.5, 20.5, lv - 2, lv, 1.2, 0.6));
    z = lv;
  }
  for (const [px, py] of POSTS) box(g, px, py, px + 2, py + 2, z, 56, 0.6, 0.3);

  let last = NaN;
  function draw(f) {
    if (Math.abs(f - last) < 0.01) return;
    last = f;
    const [bo, bi] = rings(2.5, 2, 4.5, 18, 0.8, 0.4); put(back, prism(P, front, bo, bi, f, f + 13));
    const [ao, ai] = rings(4.5, 4, 24, 7, 0.8, 0.4); put(forkA, prism(P, front, ao, ai, f, f + 1.5));
    const [co, ci] = rings(4.5, 13, 24, 16, 0.8, 0.4); put(forkB, prism(P, front, co, ci, f, f + 1.5));
    const [po, pi] = rings(5, 1, 24, 19, 1, 0.6); put(pal, prism(P, front, po, pi, f + 1.5, f + 6));
    slats.setAttribute("d", seg(P(24, 6, f + 1.5), P(24, 6, f + 4.5)) + seg(P(24, 14, f + 1.5), P(24, 14, f + 4.5)));
  }

  const fz = spring(F0);
  const B = register(stage, (dt) => { const m = stepS(fz, dt); draw(fz.x); return m; });
  bag.add(B.unregister);

  // the hit: the pointer's height on a fixed vertical line through the forks' middle
  const base = P(14, 10, 0), unit = base[1] - P(14, 10, 1)[1];
  let over = null;
  function retarget() {
    let mark = FAV;
    if (over && over[0] > base[0] - 120 && over[0] < base[0] + 110) {
      const h = clamp((base[1] - over[1]) / unit, FMIN, FMAX);
      mark = L.reduce((a, _, k) => (Math.abs(L[k] - h) < Math.abs(L[a] - h) ? k : a), 0);
      fz.t = clamp(lerp(h, L[mark], snap), FMIN, FMAX);
      read.textContent = "shelf " + (mark + 1);
    } else { fz.t = F0; read.textContent = "rest"; }
    shelves.forEach((s, k) => s.sil.classList.toggle("hi", k === mark));
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { snap = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "forklift",
  means: "A forklift facing a pallet rack: the forks ride up the mast to the pointer's height, the nearest shelf lights.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[206, 203], [206, 156], [206, 108], null],
  mount,
});
