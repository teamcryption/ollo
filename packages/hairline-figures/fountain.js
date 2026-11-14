/**
 * Fountain: a round basin on a square, a pedestal, an upper bowl and a
 * nozzle. Eight jets arc from the nozzle and fall back into the bowl. The
 * pointer's height above the nozzle sets how high the water throws; leaving
 * lets it settle to a middle arc. The jets are the bright mark. The slider
 * is how far the jets reach.
 *
 * The pattern: one continuous value, on a spring.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 44, BZ = 9, PZ = 30, UR = 18, NZ = 38, HMIN = 6, HMAX = 46, REST = 22, NJ = 8;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, NZ + HMAX * 1.2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(BR), disc(BR - 3), 0, BZ));
  mk("path", { d: poly(ringAt(P, disc(BR - 3), BZ - 2)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(6, 24), disc(4.5, 24), BZ - 2, PZ));
  // the upper bowl: wider at the lip than at its foot
  put(solid(g), { sil: poly(hull(ringAt(P, disc(7, 24), PZ).concat(ringAt(P, disc(UR), PZ + 6)))), crease: poly(ringAt(P, disc(UR - 2), PZ + 6)) });
  put(solid(g), prism(P, front, disc(2.4, 16), disc(1.6, 16), PZ + 4, NZ));
  const jets = mk("path", { class: "nf hi" }, g);

  const h = spring(REST);
  let last = NaN;
  function draw(H) {
    if (H === last) return;
    last = H;
    let d = "";
    for (let j = 0; j < NJ; j++) {
      const a = (j / NJ) * Math.PI * 2 + 0.2, pts = [];
      for (let i = 0; i <= 16; i++) {
        const s = i / 16, r = s * reach, z = NZ + H * 4 * s * (1 - s) * 1.15 - (NZ - PZ - 5) * s * s;
        pts.push(P(r * Math.cos(a), r * Math.sin(a), z));
      }
      d += open(pts);
    }
    jets.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const mv = stepS(h, dt); draw(h.x); return mv; });
  bag.add(B.unregister);

  const nz = P(0, 0, NZ), unit = P(0, 0, NZ + 1)[1] - nz[1];
  function aim([sx, sy]) {
    if (Math.hypot(sx - nz[0], sy - nz[1]) > 170) return null;
    return clamp((sy - nz[1]) / unit, HMIN, HMAX);
  }
  function setH(t) {
    h.t = t === null ? REST : t;
    read.textContent = t === null ? "rest" : "jet " + Math.round(t);
    B.wake();
  }
  setH(null);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => setH(aim(p)), leave: () => setH(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; draw(h.x); }, destroy: bag.dispose };
}

hairline({
  name: "fountain",
  means: "A town fountain: the higher the pointer above the nozzle, the higher its eight jets throw before falling back to the bowl.",
  rules: [1, 3, 5, 8],
  range: [10, 16, 17],
  tour: [[200, 56], [200, 135], [230, 95], null],
  mount,
});
