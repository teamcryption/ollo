/**
 * Coat hooks: a hallway rail with five hooks, four coats of different
 * lengths and a bag hanging from them. The pointer picks a coat by where it
 * hangs: it swings out on its hook toward the reader, and its neighbours swing
 * a little, staggered from it. At rest the coats hang a little askew and one
 * is swung out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the coat
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fillet, fit, hull, open, poly, prism, proj, rings, seg, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [-52, -26, 0, 26, 52], LEN = [46, 40, 50, 0, 43], REST = [3, 11, 2, 5, 1], FAV = 1, BAG = 3;
const PY = 4, PZ = 72;
const COAT = (L) => [[-3, 0], [3, 0], [10, -5], [12, -L], [-12, -L], [-10, -5]];
const BAGP = [[-9, -14], [9, -14], [10, -31], [-10, -31]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-66, -4, 82], [66, -4, 82], [-66, 34, 22], [66, 34, 22], [66, 0, 20], [-66, 0, 20]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-66, -4, 66, 0, 1.4, 0.6);
  put(solid(g), prism(P, () => true, rr, ri, 68, 80));
  mk("path", { class: "nf lo", d: XS.map((x) => seg(P(x - 2, 0, 76), P(x + 2, 0, 76))).join("") }, g);

  // a point of a hanging item, local (u along x, w out from the wall, h down from the hook), swung by a
  const W = (x, a) => (u, w, h) => P(x + u, PY + w * Math.cos(a) - h * Math.sin(a), PZ + w * Math.sin(a) + h * Math.cos(a));
  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g), el = solid(grp), marks = mk("path", { class: "nf lo" }, grp), hook = mk("path", { class: "nf sil" }, grp);
    hook.setAttribute("d", open([P(x, 0, 75), P(x, 7, 73), P(x, 9.5, 76.5)]));
    return { k, x, grp, el, marks, a: tween(REST[k]), last: NaN };
  });

  function draw(it, deg) {
    if (Math.abs(deg - it.last) < 0.01) return;
    it.last = deg;
    const f = W(it.x, rad(deg)), pts = [];
    if (it.k === BAG) {
      for (const w of [-1, 7]) for (const [u, h] of BAGP) pts.push(f(u, w, h));
      it.el.sil.setAttribute("d", poly(fillet(hull(pts), hull(pts).map(() => 3), 3)));
      it.marks.setAttribute("d", open([f(-7, 3, -14), f(0, 3, 0), f(7, 3, -14)]) + seg(f(-9.4, 7, -20), f(9.4, 7, -20)));
    } else {
      const L = LEN[it.k];
      for (const w of [-2, 5]) for (const [u, h] of COAT(L)) pts.push(f(u, w, h));
      it.el.sil.setAttribute("d", poly(fillet(hull(pts), hull(pts).map(() => 3.5), 3)));
      it.marks.setAttribute("d", open([f(-3, 5, 0), f(0, 5, -8), f(3, 5, 0)]) + seg(f(0, 5, -8), f(0, 5, -L + 1.5)));
    }
  }

  // far to near: a coat swung toward the reader goes after its neighbours
  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    const key0 = (it) => it.x + Math.sin(rad(tval(it.a, now))) * (LEN[it.k] || 30) * 0.9;
    const order = items.slice().sort((p, q) => key0(p) - key0(q)), key = order.map((it) => it.k).join();
    if (key !== painted) { painted = key; for (const it of order) g.appendChild(it.grp); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, PY, PZ - (LEN[it.k] || 30) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), deg = a < 0 ? REST[k] : d === 0 ? 34 : d === 1 ? 9 : d === 2 ? 4 : 1;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : (a === BAG ? "bag " : "coat ") + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coathooks",
  means: "Coats and a bag on a hallway rail: the coat under the pointer swings out toward you, its neighbours a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[133, 119], [218, 161], [302, 203], null],
  mount,
});
