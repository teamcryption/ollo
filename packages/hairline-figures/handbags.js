/**
 * Handbags: a boutique shelf holding a tote with two straps, a box bag with
 * a top handle and a clutch with a wrist loop. The pointer picks a bag by
 * where it stands: it lifts by its handle, and the bags beside it rise a
 * little, staggered from it. At rest the box bag is half lifted, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the bag
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, hull, open, poly, proj, rrect, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, rings, prism, put, register, solid,
} = HL;

// [x, half width foot, half width top, half depth, height, handle height, handle half span, kind]
const BAGS = [[22, 11, 15, 6, 26, 16, 6, "tote"], [62, 12, 12, 7, 19, 9, 5, "box"], [98, 13, 13, 3.2, 13, 7, 3.5, "clutch"]];
const X = 120, SZ = 5, LIFT = 16, FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -6, 0], [X + 4, 18, 0], [X + 4, -6, 0], [-4, 18, 0], [22, 0, SZ + 26 + 16 + LIFT], [98, 0, SZ + 30 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-4, -12, X + 4, 18, 3, 1.2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  const [wr, wi] = rings(-4, -16, X + 4, -12, 1.5, 0.6);
  put(solid(g), prism(P, front, wr, wi, 0, 62));

  const items = BAGS.map(([x, wf, wt, hd, h, hh, hs, kind], k) => {
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "nf lo" }, grp), body = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp), hand = mk("path", { class: "nf sil" }, grp);
    return { k, x, wf, wt, hd, h, hh, hs, kind, back, body, cr, hand, z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN };
  });

  const arc = (x, y, z, hs, hh) => Array.from({ length: 13 }, (_, i) => { const t = (i / 12) * Math.PI; return P(x - hs * Math.cos(t), y, z + hh * Math.sin(t)); });
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = SZ + lift, z1 = z0 + it.h;
    const foot = rrect(it.x - it.wf, -it.hd, it.x + it.wf, it.hd, 2.5, 4), top = rrect(it.x - it.wt, -it.hd, it.x + it.wt, it.hd, 1.5, 4);
    const inner = rrect(it.x - it.wt + 1, -it.hd + 1, it.x + it.wt - 1, it.hd - 1, 0.8, 4);
    it.body.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    let cr = open(ringAt(P, run(inner, front), z1));
    if (it.kind === "box") cr += " " + open([P(it.x - it.wt, it.hd, z1 - 6), P(it.x + it.wt, it.hd, z1 - 6)]);
    if (it.kind === "clutch") cr += " " + open([P(it.x - it.wt, it.hd, z1), P(it.x, it.hd, z1 - 7), P(it.x + it.wt, it.hd, z1)]);
    it.cr.setAttribute("d", cr);
    if (it.kind === "tote") {
      it.back.setAttribute("d", open(arc(it.x, -it.hd + 1, z1, it.hs, it.hh)));
      it.hand.setAttribute("d", open(arc(it.x, it.hd - 1, z1, it.hs, it.hh)));
    } else if (it.kind === "box") {
      it.hand.setAttribute("d", open(arc(it.x, 0, z1, it.hs, it.hh)) + open(arc(it.x, 0, z1, it.hs - 1.5, it.hh - 1.5)));
    } else {
      it.hand.setAttribute("d", open(arc(it.x + it.wt - 3, 0, z1, it.hs, it.hh)));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, SZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : d === 0 ? LIFT : d === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const lit = k === (a < 0 ? FAV : a);
      it.body.classList.toggle("hi", lit); it.hand.classList.toggle("hi", lit);
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "handbags",
  means: "A tote, a box bag and a clutch on a boutique shelf: the bag under the pointer lifts by its handle, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[154, 127], [210, 165], [264, 206], null],
  mount,
});
