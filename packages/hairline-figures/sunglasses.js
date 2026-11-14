/**
 * Sunglasses: a tall display stand on a foot, four pairs of sunglasses in a
 * column on its face, each pair resting on a thin ledge with its temples
 * running back to the board. The pointer picks a pair by height: it slides
 * out off the stand, as if taken to try on, and the pairs beside it ease out
 * a little, staggered from it. At rest one pair stands out, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single column (riffle, by screen y).
 */
const {
  Cam, fillet, fit, facing, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ROWS = [24, 48, 72, 96], CX = 30, LW = 16, LH = 12, YB = 4, TL = 18, YF = YB + TL, OUT = 16, FAV = 2;
const REST = [3, 1.5, OUT * 0.7, 2.5];

function lens(x0, z0, x1, z1, inner) {
  const pts = [[x0, z1], [x1, z1], [x1, z0], [x0, z0]];
  const rr = inner ? [1.2, 3, 5.5, 2] : [2.5, 4, 6.5, 3];
  return fillet(pts, rr, 4);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-8, -10, 0], [68, 40, 0], [68, -10, 0], [-8, 40, 0], [0, 0, 118], [60, 4, 118]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-8, -10, 68, 40, 7, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [br, bi] = rings(0, 0, 60, YB, 1.6, 0.8);
  put(solid(g), prism(P, front, br, bi, 4, 118));

  const items = ROWS.map((cz, k) => {
    const grp = mk("g", {}, g);
    const [lr, li] = rings(CX - 22, YB, CX + 22, YB + 5, 1, 0.6);
    put(solid(grp), prism(P, front, lr, li, cz - 9, cz - 7.6));
    const temples = mk("path", { class: "lo nf" }, grp), bridge = mk("path", { class: "nf" }, grp);
    const lens = [0, 1].map(() => ({ o: mk("path", { class: "sil" }, grp), i: mk("path", { class: "lo nf" }, grp) }));
    return { k, cz, grp, temples, bridge, lens, s: tween(REST[k]), last: NaN };
  });

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const y = YF + s, z0 = it.cz - LH / 2, z1 = it.cz + LH / 2, at = (pts) => pts.map(([x, z]) => P(x, y, z));
    const x0 = CX - 2.5 - LW, x1 = CX - 2.5, o = lens(x0, z0, x1, z1, false), n = lens(x0 + 1.4, z0 + 1.4, x1 - 1.4, z1 - 1.4, true);
    const mir = (pts) => pts.map(([x, z]) => [2 * CX - x, z]);
    [[o, n], [mir(o), mir(n)]].forEach(([oo, nn], j) => { it.lens[j].o.setAttribute('d', poly(at(oo))); it.lens[j].i.setAttribute('d', poly(at(nn))); });
    const xo = LW + 2.5;
    it.temples.setAttribute("d", [-1, 1].map((sd) => seg(P(CX + sd * xo, y, z1 - 1.5), P(CX + sd * (xo + 1), YB + 0.5, z1 - 3))).join(""));
    it.bridge.setAttribute("d", open([P(CX - 3, y, z1 - 2.5), P(CX - 1.5, y, z1 - 1), P(CX + 1.5, y, z1 - 1), P(CX + 3, y, z1 - 2.5)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(CX, YF, it.cz));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][0] - sx) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 4 : 1;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.lens.forEach((l) => l.o.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "pair " + (4 - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sunglasses",
  means: "A display stand with four pairs of sunglasses: the pair under the pointer slides out to try on, its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[190, 99], [190, 184], [190, 227], null],
  mount,
});
