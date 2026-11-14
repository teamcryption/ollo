/**
 * Road barriers: a line of tapered barrier blocks along a lane. The pointer
 * picks a block by where it stands: it slides out of the line toward the
 * road, and the blocks beside it shift a little, staggered from it. At rest
 * one block stands out of line, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, BW = 26, GAP = 4, STEP = BW + GAP, BD = 16, BH = 22, SL = 22, FAV = 2;
const X1 = N * STEP - GAP;
const REST = [0, 2.5, SL * 0.6, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -8, 0], [X1 + 6, BD + SL + 10, 0], [X1 + 6, -8, 0], [-6, BD + SL + 10, 0], [0, 0, BH + 2], [X1, BD + SL, BH + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-6, -8, X1 + 6, BD + SL + 10, 3, 1.5);
  put(solid(g), prism(P, front, rr, ri, 0, 2));
  mk("path", { d: seg(P(-2, BD + SL + 4, 2), P(X1 + 2, BD + SL + 4, 2)), class: "dash" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g), s = solid(grp), band = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, s, band, y: tween(REST[k]), last: NaN });
  }

  function draw(it, dy) {
    if (dy === it.last) return;
    it.last = dy;
    const x = it.x, z0 = 2;
    const foot = rrect(x, dy, x + BW, dy + BD, 3, 4), top = rrect(x + 1.5, dy + 5, x + BW - 1.5, dy + BD - 5, 2, 4);
    const inner = rrect(x + 2.5, dy + 6, x + BW - 2.5, dy + BD - 6, 1, 4);
    put(it.s, { sil: poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z0 + BH)))), crease: open(ringAt(P, run(inner, front), z0 + BH)) });
    // the reflective band: a line across the near slope
    const f = 0.62, bz = z0 + BH * f, by = dy + BD - 5 * f;
    it.band.setAttribute("d", seg(P(x + 3, by, bz), P(x + BW - 3, by, bz)));
  }

  function order() {
    const sorted = items.slice().sort((a, b) => (a.x + a.last) - (b.x + b.last));
    for (let i = 1; i < sorted.length; i++) if (sorted[i].grp.previousSibling !== sorted[i - 1].grp) sorted[i - 1].grp.after(sorted[i].grp);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    order();
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + BW / 2, BD / 2, BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? REST[k] : dd === 0 ? SL : dd === 1 ? 4 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "block " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "roadbarriers",
  means: "A line of road barrier blocks: the block under the pointer slides out toward the lane, and its neighbours shift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[153, 124], [238, 167], [281, 188], null],
  mount,
});
