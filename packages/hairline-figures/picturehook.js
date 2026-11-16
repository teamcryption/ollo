/**
 * Picturehook: a picture rail along a wall, with three framed pictures
 * hanging from hooks on cords. The pointer picks a frame by where it hangs:
 * it swings on its hook, and the frames beside it swing a little the other
 * way, staggered from it. At rest the frames hang a touch crooked, one bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZR = 80, DROP = 14, FAV = 1, SW = 14;
const F = [{ x: 24, w: 34, h: 44, r: 3 }, { x: 76, w: 40, h: 30, r: -4 }, { x: 128, w: 28, h: 36, r: 2 }];
const X1 = 152, D = Math.PI / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -3, ZR + 6], [X1 + 4, 3, ZR + 6], [-4, 3, 10], [X1 + 4, 3, 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-2, -4, X1 + 2, 0, 1.5, 0.8);
  put(solid(g), prism(P, front, rr, ri, ZR, ZR + 4));

  const items = F.map((f, k) => {
    const grp = mk("g", {}, g);
    mk("path", { d: open([P(f.x, -2, ZR + 4.5), P(f.x, 1.5, ZR + 4.5), P(f.x, 1.5, ZR + 1), P(f.x, 0.5, ZR - 2)]), class: "nf" }, grp);
    const cord = mk("path", { class: "nf lo" }, grp), sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    const out = rrect(-f.w / 2, DROP, f.w / 2, DROP + f.h, 2, 3), inn = rrect(-f.w / 2 + 5, DROP + 5, f.w / 2 - 5, DROP + f.h - 5, 1, 2);
    return { k, f, cord, sil, cr, out, inn, a: tween(f.r), last: NaN };
  });

  function at(it, th, u, w, y) {
    return P(it.f.x + u * Math.cos(th) + w * Math.sin(th), y, ZR - 2 + u * Math.sin(th) - w * Math.cos(th));
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const th = deg * D, pts = [];
    for (const q of it.out) pts.push(at(it, th, q.u, q.v, 0), at(it, th, q.u, q.v, 2.6));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.cr.setAttribute("d", poly(it.inn.map((q) => at(it, th, q.u, q.v, 2.6))));
    const c = it.f.w / 2 - 4;
    it.cord.setAttribute("d", open([at(it, th, -c, DROP + 2, 1.5), at(it, th, 0, 0, 1.5), at(it, th, c, DROP + 2, 1.5)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.f.x, 1, ZR - DROP - it.f.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? it.f.r : dd === 0 ? SW : dd === 1 ? 8 : 3;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "frame " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "picturehook",
  means: "Framed pictures hung on cords from a picture rail: the frame under the pointer swings on its hook, its neighbours sway after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[129, 120], [203, 157], [276, 194], null],
  mount,
});
