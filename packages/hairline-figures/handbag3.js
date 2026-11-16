/**
 * Tote bag stand: three totes hang from the crossbar of a stand. The pointer
 * picks a tote by where it stands: it swings forward on its handles, and the
 * totes beside it swing a little, staggered from it. At rest one tote hangs
 * swung out, bright. The slider is the stagger.
 */
const { Cam, fit, hull, poly, open, proj, rings, prism, facing, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const XS = [16, 46, 76], BAR = 70, W = 11, D = 4.5, TOP = 56, BOT = 26, FAV = 2, SW = 34;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rot = (q, a) => { const c = Math.cos(a), s = Math.sin(a), dz = q[2] - BAR; return [q[0], q[1] * c - dz * s, BAR + q[1] * s + dz * c]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-8, -14, 0], [100, 14, 0], [0, 0, BAR + 3], [92, 30, 40]], 200, 160);
  const P = proj(C), front = facing(C);
  const hp = (pts) => poly(hull(pts.map((q) => P(...q))));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-8, -14, 100, 14, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  for (const x of [0, 92]) mk("path", { d: hp(box(x - 1.5, -1.5, 3, x + 1.5, 1.5, BAR + 2)), class: "sil" }, g);
  mk("path", { d: hp(box(-2, -1.5, BAR - 1.5, 94, 1.5, BAR + 1.5)), class: "sil" }, g);
  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    const handle = mk("path", { class: "nf" }, grp), body = mk("path", { class: "sil" }, grp), seam = mk("path", { class: "nf lo" }, grp);
    return { k, x, handle, body, seam, a: tween(k === FAV ? 16 : 0), last: NaN };
  });
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const r = (q) => P(...rot(q, rad(a))), x = it.x;
    it.body.setAttribute("d", hp(box(x - W, -D, BOT, x + W, D, TOP).map((q) => rot(q, rad(a)))));
    it.handle.setAttribute("d", open([[x - 6, D * 0.6, TOP], [x - 4, 0, BAR + 0.5], [x + 4, 0, BAR + 0.5], [x + 6, D * 0.6, TOP]].map(r)) + open([[x - 6, -D * 0.6, TOP], [x - 4, 0, BAR + 0.5], [x + 4, 0, BAR + 0.5], [x + 6, -D * 0.6, TOP]].map(r)));
    it.seam.setAttribute("d", open([[x - W, D, TOP - 5], [x + W, D, TOP - 5]].map(r)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, 0, (TOP + BOT) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 16 : 0) : dd === 0 ? SW : dd === 1 ? 12 : 4;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tote " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "handbag3",
  means: "Three totes hang on a stand: the tote under the pointer swings forward on its handles, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 121], [204, 144], [249, 166], null],
  mount,
});
