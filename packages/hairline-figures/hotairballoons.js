/**
 * Hot air balloons: five balloons over a low hill, each an envelope of gores
 * on a throat, with a basket hung on four ropes. The pointer is a warm draught:
 * the balloons near it rise, each on its own spring, the one under it highest
 * and bright. At rest they float at different heights, the middle one bright.
 * The slider is how far they rise.
 *
 * The pattern: a continuous field (terrain) along one row; the hit is each
 * balloon's rest centre on screen x, which never moves.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, proj, ringAt, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SPOT = [[-36, 36, 38], [-20, 8, 54], [4, 4, 42], [22, -18, 60], [40, -38, 44]], FAV = 2;
// the envelope's profile above its throat: [height, radius]
const PROF = [[0, 2.6], [3, 6], [8, 10.5], [14, 13], [20, 12.5], [25, 9.5], [28.5, 5], [30, 0.5]];
const HILL = [[0, 50], [8, 43], [16, 31], [22, 18], [25, 6]];
const GORE = [-56, -28, 0, 28, 56].map((d) => ((45 + d) * Math.PI) / 180);
const falloff = (u) => 0.09 + 0.91 * Math.exp(-u * u * 2.2);
const at = (r, x, y, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let L = 22 * value, over = null;
  const C = Cam(45, 0.5, 1.85);
  const ext = [[50, 0, 0], [-50, 0, 0], [0, 50, 0], [0, -50, 0]];
  for (const [x, y, z] of SPOT) ext.push([x - 10, y + 10, z - 11], [x + 10, y - 10, z + 30 + 33]);
  fit(C, ext, 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hill: a low mound, its silhouette and one dim contour
  const hill = solid(g);
  put(hill, {
    sil: poly(hull([].concat(...HILL.map(([z, r]) => ringAt(P, at(r, 0, 0, 64), z))))),
    crease: open(ringAt(P, run(at(37, 0, 0, 64), front), 12)),
  });

  const balloons = SPOT.map(([x, y, z], k) => ({ k, x, y, z, sx: P(x, y, 0)[0], sp: spring(0, { eps: 0.02 }), drawn: NaN }));
  for (const b of [...balloons].sort((p, q) => p.x + p.y - (q.x + q.y))) {
    const grp = mk("g", {}, g);
    b.basket = solid(grp);
    b.ropes = mk("path", { class: "nf lo" }, grp);
    b.env = solid(grp);
    b.gores = mk("path", { class: "nf lo" }, b.env.g);
  }

  function draw(b) {
    const lift = Math.max(0, b.sp.x);
    if (Math.abs(lift - b.drawn) < 0.01) return;
    b.drawn = lift;
    const z = b.z + lift, { x, y } = b;
    let pts = [];
    for (const [h, r] of PROF) pts = pts.concat(ringAt(P, at(r, x, y), z + h));
    put(b.env, { sil: poly(hull(pts)), crease: open(ringAt(P, run(at(2.6, x, y, 16), front), z)) });
    b.gores.setAttribute("d", GORE.map((t) => open(PROF.slice(1, -1).map(([h, r]) => P(x + r * Math.cos(t), y + r * Math.sin(t), z + h)))).join(""));
    const top = z - 7, bot = z - 11, sq = [[-2.6, -2.6], [2.6, -2.6], [2.6, 2.6], [-2.6, 2.6]];
    let base = [];
    for (const zz of [bot, top]) base = base.concat(sq.map(([u, v]) => P(x + u, y + v, zz)));
    put(b.basket, { sil: poly(hull(base)), crease: open([2, 3, 0].map((i) => P(x + sq[i][0] * 0.8, y + sq[i][1] * 0.8, top))) });
    b.ropes.setAttribute("d", sq.map(([u, v]) => seg(P(x + u * 0.75, y + v * 0.75, z + 0.4), P(x + u, y + v, top))).join(""));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of balloons) { if (stepS(b.sp, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let near = null, bd = Infinity;
    if (over) for (const b of balloons) { const d = Math.abs(over[0] - b.sx); if (d < bd) { bd = d; near = b; } }
    for (const b of balloons) {
      b.sp.t = over ? L * falloff(Math.abs(over[0] - b.sx) / 60) : 0;
      b.env.sil.classList.toggle("hi", near ? b === near : b.k === FAV);
    }
    read.textContent = near ? "balloon " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  for (const b of balloons) draw(b);
  retarget();
  return { set: (v) => { L = 22 * v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "hotairballoons",
  means: "Five hot air balloons over a hill: the balloons near the pointer rise, the one under it highest and bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[159, 125], [248, 104], [298, 150], null],
  mount,
});
