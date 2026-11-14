/**
 * Rug rolls: four rolled rugs lying end to end along the floor, uneven in
 * length and girth. The pointer picks a roll by where it stands: it rolls
 * toward the viewer, laying its rug flat behind it, and the rolls beside it
 * give a little rug, staggered from it. At rest one roll is half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LEN = [34, 28, 40, 30], RAD = [9, 7, 10, 8], GAP = 8, OUT = 44, REST = 20, FAV = 2;
const X0 = LEN.map((_, k) => LEN.slice(0, k).reduce((s, l) => s + l + GAP, 0));
const X1 = X0[3] + LEN[3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, -10, 0], [X1, -10, 0], [0, OUT + 12, 0], [X1, OUT + 12, 0], [0, -10, 22], [X1, -10, 22]], 200, 168);
  const P = proj(C), front = facing(C);
  const flat = mk("g", {}, svg), rolls = mk("g", {}, svg);
  const unit = circ(1, 28);

  const items = LEN.map((L, k) => {
    const rug = solid(flat);
    const grp = mk("g", {}, rolls);
    const sil = mk("path", { class: "sil" }, grp), end = mk("path", { class: "nf lo" }, grp), core = mk("path", { class: "nf lo" }, grp);
    return { k, x0: X0[k], x1: X0[k] + L, R: RAD[k], rug, grp, sil, end, core, d: tween(k === FAV ? REST : 0), last: NaN };
  });

  function circle(x, yc, r, rr) { return unit.map((q) => P(x, yc + rr * q.u, r + rr * q.v)); }
  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const r = it.R * (1 - d / (OUT * 2.2)), yc = d;
    it.sil.setAttribute("d", poly(hull(circle(it.x0, yc, r, r).concat(circle(it.x1, yc, r, r)))));
    it.end.setAttribute("d", poly(circle(it.x1, yc, r, r)));
    it.core.setAttribute("d", poly(circle(it.x1, yc, r, r * 0.4)));
    if (d < 2) put(it.rug, { sil: "", crease: "" });
    else put(it.rug, prism(P, front, ...rings(it.x0 + 0.5, 0, it.x1 - 0.5, d, 1.5, 0.6), 0, 0.8));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, 0, it.R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? REST : 0) : dd === 0 ? OUT : dd === 1 ? 7 : 0;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    // the roll that lies nearest is painted last
    items.slice().sort((p, q) => (p.x0 + p.x1) / 2 + p.d.to - (q.x0 + q.x1) / 2 - q.d.to)
      .forEach((it) => rolls.appendChild(it.grp));
    read.textContent = a < 0 ? "rest" : "rug " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rugrolls",
  means: "Four rolled rugs end to end on the floor: the roll under the pointer rolls forward and lays its rug out flat.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[145, 111], [262, 165], [348, 214], null],
  mount,
});
