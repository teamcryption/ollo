/**
 * Teacher desk: a desk on two legs and a pedestal of three drawers, an apple
 * on its top. The pointer picks a drawer by where it stands: it slides out,
 * and the drawers beside it ease out a little, staggered from it. At rest the
 * drawers stand at uneven depths and the top one is open, bright. The slider
 * is the stagger.
 *
 * The pattern: a stack picked by height (riffle on z).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, seg,
} = HL;

const N = 3, OUT = 22, FAV = 2, FY = 46, X0 = 72, X1 = 106;
const REST = [3, 6, 12], ZS = [[3, 13], [15, 25], [27, 37]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [110, 0, 44], [0, 50, 44], [110, FY + OUT, 0], [0, 50, 0], [30, 25, 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.5, b = 1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, o, i, z0, z1); };
  put(solid(g), box(3, 3, 9, 9, 0, 40));
  put(solid(g), box(3, 41, 9, 47, 0, 40));
  put(solid(g), box(70, 2, 108, FY, 0, 40, 2, 1.2));
  put(solid(g), box(0, 0, 110, 50, 40, 44, 2.5, 1.6));
  // the apple: a round body and a short stem
  const ap = [];
  for (const [r, z] of [[3, 0], [5.5, 1.5], [6, 4], [5, 7], [3, 8.5]]) ap.push(...ringAt(P, disc(28, 22, r), 44 + z));
  mk("path", { d: poly(hull(ap)) }, g);
  mk("path", { d: seg(P(28, 22, 52), P(29, 22, 56)), class: "nf" }, g);

  const items = ZS.map(([z0, z1], k) => {
    const grp = mk("g", {}, g), s = solid(grp), pull = mk("path", { class: "nf" }, grp);
    return { k, z0, z1, s, pull, p: tween(REST[k]), last: NaN };
  });

  function draw(it, p) {
    if (p === it.last) return;
    it.last = p;
    const y1 = FY + p, [o, i] = rings(X0, FY, X1, y1, 1.5, 1);
    put(it.s, prism(P, front, o, i, it.z0, it.z1));
    const zm = (it.z0 + it.z1) / 2 + 1.5, xm = (X0 + X1) / 2;
    it.pull.setAttribute("d", seg(P(xm - 6, y1, zm), P(xm + 6, y1, zm)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.p, now)); if (!tdone(it.p, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((X0 + X1) / 2, FY, (it.z0 + it.z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][0] - sx) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), p = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 6 : 2;
      tset(it.p, p, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "teacherdesk",
  means: "A teacher's desk with an apple on top and a pedestal of three drawers: the drawer under the pointer slides out.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[204, 184], [204, 205], [204, 227], null],
  mount,
});
