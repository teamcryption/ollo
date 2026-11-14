/**
 * Barn: a gabled barn seen from its door end. Two braced leaves hang on a
 * rail across the big doorway, and a hayloft door sits in the gable above.
 * The pointer picks a door by where it stands: over the doorway the leaves
 * slide apart along the rail; over the loft the loft door swings out on its
 * hinge. At rest the loft door stands ajar, bright. The slider is how far
 * the leaves travel.
 *
 * The pattern: a few parts of one object, each with its own gesture.
 */
const {
  Cam, fit, facing, hull, open, poly, proj, rings, ringAt, seg, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 72, D = 56, H = 34, R = 22, OV = 3, DW = 13, DH = 27, MY = D / 2;
const LY0 = 21, LY1 = 35, LZ0 = 38, LZ1 = 49, LW = LY1 - LY0, AJAR = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, -OV, 0], [L, -OV, 0], [L, D + OV, 0], [0, D + OV, 0], [0, MY, H + R], [L, MY, H + R], [L + LW, LY1, LZ1]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the barn: walls, eaves and the ridge, as one hull
  const [fr] = rings(0, 0, L, D, 2.5, 1.5);
  const pts = ringAt(P, fr, 0).concat([[0, -OV], [L, -OV], [L, D + OV], [0, D + OV]].map(([x, y]) => P(x, y, H - 1)), [P(0, MY, H + R), P(L, MY, H + R)]);
  const body = solid(g);
  put(body, { sil: poly(hull(pts)), crease: open([P(0.8, D + OV - 0.8, H - 0.4), P(L - 0.8, D + OV - 0.8, H - 0.4)]) });
  // rake of the near slope, the wall under the eave, the ridge cap
  mk("path", { class: "nf lo", d: seg(P(L, D + OV, H - 1), P(L, MY, H + R)) + seg(P(0, MY, H + R - 1.5), P(L - 1, MY, H + R - 1.5)) + seg(P(L - 0.6, 1, H - 1.4), P(L - 0.6, D - 1, H - 1.4)) }, g);

  // doorway: the dark gap the leaves uncover, with the floor line inside
  const F = (y, z, dx = 0) => P(L + dx, y, z);
  mk("path", { class: "nf lo", d: poly([F(MY - DW, 0), F(MY + DW, 0), F(MY + DW, DH), F(MY - DW, DH)]) + seg(P(L - 10, MY - DW + 2, 0.2), P(L - 10, MY + DW - 2, 0.2)) }, g);
  // the rail the leaves hang from
  mk("path", { class: "nf", d: seg(F(MY - 2 * DW - 1, DH + 2, 0.4), F(MY + 2 * DW + 1, DH + 2, 0.4)) }, g);
  const leaves = [-1, 1].map((s) => ({ s, sil: mk("path", { class: "sil" }, g), br: mk("path", { class: "nf lo" }, g) }));

  // hayloft: its opening, the hoist beam over it, and the hinged door
  mk("path", { class: "nf lo", d: poly([F(LY0, LZ0), F(LY1, LZ0), F(LY1, LZ1), F(LY0, LZ1)]) }, g);
  const beam = solid(g);
  put(beam, { sil: poly(hull(ringAt(P, rings(L - 2, MY - 1.4, L + 9, MY + 1.4, 1, 0.5)[0], LZ1 + 3).concat(ringAt(P, rings(L - 2, MY - 1.4, L + 9, MY + 1.4, 1, 0.5)[0], LZ1 + 5.4)))), crease: "" });
  const loft = { sil: mk("path", { class: "sil" }, g), br: mk("path", { class: "nf lo" }, g) };

  const slide = tween(2), swing = tween(AJAR);
  let lastS = NaN, lastA = NaN;
  function draw(now) {
    const s = tval(slide, now), a = tval(swing, now);
    if (s !== lastS) {
      lastS = s;
      for (const lf of leaves) {
        const y0 = lf.s < 0 ? MY - DW - s : MY + s, y1 = y0 + DW;
        const q = [F(y0, 0.4, 0.8), F(y1, 0.4, 0.8), F(y1, DH, 0.8), F(y0, DH, 0.8)];
        lf.sil.setAttribute("d", poly(q));
        lf.br.setAttribute("d", seg(q[0], q[2]) + seg(F(y0, DH / 2, 0.8), F(y1, DH / 2, 0.8)));
      }
    }
    if (a !== lastA) {
      lastA = a;
      const t = rad(a), hx = L + 0.6, ex = hx + LW * Math.sin(t), ey = LY1 - LW * Math.cos(t);
      const q = [P(hx, LY1, LZ0), P(ex, ey, LZ0), P(ex, ey, LZ1), P(hx, LY1, LZ1)];
      loft.sil.setAttribute("d", poly(q));
      loft.br.setAttribute("d", seg(q[0], q[2]));
    }
  }
  const B = register(stage, (_dt, now) => { draw(now); return !(tdone(slide, now) && tdone(swing, now)); });
  bag.add(B.unregister);

  // hit by the rest pose: the doorway's middle and the loft's middle on the gable
  const mids = [P(L, MY, DH / 2), P(L, (LY0 + LY1) / 2, (LZ0 + LZ1) / 2)];
  function hit([sx, sy]) {
    let best = -1, bd = 34;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(k) {
    if (k === act) return;
    act = k;
    const now = performance.now();
    tset(slide, k === 0 ? travel : 2, now, 0);
    tset(swing, k === 1 ? 105 : k < 0 ? AJAR : 0, now, k === 0 ? 60 : 0);
    for (const lf of leaves) lf.sil.classList.toggle("hi", k === 0);
    loft.sil.classList.toggle("hi", k !== 0);
    read.textContent = k === 0 ? "doors" : k === 1 ? "loft" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (act === 0) { act = -2; setActive(0); } }, destroy: bag.dispose };
}

hairline({
  name: "barn",
  means: "A gabled barn: over the doorway its braced leaves slide apart on their rail; over the gable the hayloft door swings out.",
  rules: [1, 4, 5, 6],
  range: [5, 13, 13],
  tour: [[207, 156], [260, 157], [260, 218], null],
  mount,
});
