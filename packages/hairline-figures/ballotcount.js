/**
 * Ballot count: four ballot boxes in a row on a low table, each with a slot in
 * its lid. The pointer picks a box by where it stands: a folded ballot rises
 * out of its slot to be counted, and the boxes beside it push theirs up a
 * little, staggered from it. At rest a few ballots stand part way out, one
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), items popping from slots.
 */
const {
  Cam, fit, facing, fillet, open, poly, run, prism, proj, rings, rrect, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 38, BW = 28, BD = 26, BH = 30, TZ = 4, UP = 36, FAV = 2;
const REST = [6, 0, 14, 4];
const X1 = (N - 1) * STEP + BW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-7, -7, 0], [X1 + 7, BD + 7, 0], [X1 + 7, -7, 0], [-7, BD + 7, 0], [BW / 2, BD / 2, TZ + BH + UP + 6], [X1 - BW / 2, BD / 2, TZ + BH + UP + 6]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-7, -7, X1 + 7, BD + 7, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, xc = x0 + BW / 2, yc = BD / 2, grp = mk("g", {}, g);
    const [r, ri] = rings(x0, 0, x0 + BW, BD, 4, 1.6);
    put(solid(grp), prism(P, front, r, ri, TZ, TZ + BH));
    // the lid's seam a little under the top, and the slot in the lid
        mk("path", { d: open(ringAt(P, run(rrect(x0, 0, x0 + BW, BD, 4, 4), front), TZ + BH - 5)), class: "nf lo" }, grp);
    mk("path", { d: poly(ringAt(P, rrect(xc - 9, yc - 1.4, xc + 9, yc + 1.4, 1.2, 3), TZ + BH)), class: "nf lo" }, grp);
    const card = mk("path", { class: "" }, grp), fold = mk("path", { class: "nf lo" }, grp);
    items.push({ k, xc, yc, card, fold, h: tween(REST[k]), last: NaN });
  }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const show = h > 0.4;
    if (!show) { it.card.setAttribute("d", ""); it.fold.setAttribute("d", ""); return; }
    const z0 = TZ + BH, z1 = z0 + h, w = 10;
    const pts = [P(it.xc - w, it.yc, z0), P(it.xc - w, it.yc, z1), P(it.xc + w, it.yc, z1), P(it.xc + w, it.yc, z0)];
    it.card.setAttribute("d", poly(fillet(pts, [0, 1.5, 1.5, 0])));
    const fz = z1 - 7;
    it.fold.setAttribute("d", fz > z0 + 1 ? "M" + P(it.xc - w, it.yc, fz).join(",") + "L" + P(it.xc + w, it.yc, fz).join(",") : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.xc, it.yc, TZ + BH / 2));
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
      const dd = Math.abs(k - a), h = a < 0 ? REST[k] : dd === 0 ? UP : dd === 1 ? 12 : 0;
      tset(it.h, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.card.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ballotcount",
  means: "Four ballot boxes on a table: the box under the pointer pushes a folded ballot up out of its slot, its neighbours a little less.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[177, 143], [269, 189], [131, 120], null],
  mount,
});
