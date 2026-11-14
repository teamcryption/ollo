/**
 * Cubbies: a classroom cubby unit, four open bays in a row, each with a bag
 * tucked in and a hook on the rail above. The pointer picks a bay by where it
 * stands: its bag slides out toward the viewer, and the bags beside it ease
 * out a little, staggered from it. At rest the bags sit at uneven depths and
 * one is pulled out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, open, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, seg, circ,
} = HL;

const N = 4, BAY = 27, D = 24, H = 36, W = N * BAY + 4, OUT = 20, FAV = 2;
const REST = [5, 9, 13, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, D + OUT + 2, 0], [W, 0, H + 10], [0, D + OUT + 2, 0], [0, 0, H + 10], [W, D, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // hook rail along the back top, painted behind the unit's top
  const [rr, ri] = rings(2, 0, W - 2, 3, 1.2, 0.6);
  put(solid(g), prism(P, front, rr, ri, H, H + 8));
  const [ur, ui] = rings(0, 3, W, D, 2.5, 1.6);
  put(solid(g), prism(P, front, ur, ui, 0, H));
  const hooks = mk("path", { class: "nf lo" }, g);
  let hd = "";
  for (let k = 0; k < N; k++) {
    const x = 4 + k * BAY + 11.5;
    hd += seg(P(x, 3, H + 5), P(x, 6, H + 5)) + seg(P(x, 6, H + 5), P(x, 6, H + 7.5));
  }
  hooks.setAttribute("d", hd);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = 4 + k * BAY, x1 = x0 + BAY - 4;
    const face = [[x0, 4], [x1, 4], [x1, H - 4], [x0, H - 4]].map(([x, z]) => P(x, D, z));
    mk("path", { d: poly(fillet(face, [2, 2, 2, 2])), class: "nf lo" }, g);
    const grp = mk("g", {}, g), s = solid(grp), strap = mk("path", { class: "nf" }, grp);
    items.push({ k, x0: x0 + 2.5, x1: x1 - 2.5, grp, s, strap, p: tween(REST[k]), last: NaN });
  }

  function draw(it, p) {
    if (p === it.last) return;
    it.last = p;
    const y1 = D + p, [br, bi] = rings(it.x0, D, it.x1, y1, 2.5, 1.4);
    put(it.s, prism(P, front, br, bi, 4, 22));
    const xm = (it.x0 + it.x1) / 2, pts = [];
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; pts.push(P(xm - 6 * Math.cos(t), y1 - Math.min(3, p / 2), 22 + 5 * Math.sin(t))); }
    it.strap.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.p, now)); if (!tdone(it.p, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), p = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 9 : 4;
      tset(it.p, p, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockercubbies",
  means: "A classroom cubby unit with four bays: the bag under the pointer slides out of its bay, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 155], [196, 206], [254, 221], null],
  mount,
});
