/**
 * Shopping trolley: a tapered wire basket on a wheeled chassis, a push bar
 * at the back and the child-seat flap hinged on the basket's back rim. Over
 * the trolley the flap folds down into a seat; leaving, it swings back to
 * lean on the rim. At rest the flap leans ajar, bright. The slider is how
 * far the flap folds.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, fit, fillet, hull, open, poly, proj, rrect, ringAt, circ, seg, facing, run, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const L = 80, Wd = 44, ZB = 34, ZT = 72, FL = 38, REST = -24;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let fold = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-12, 0, 0], [L, Wd, 0], [L, 0, 0], [-12, Wd, 0], [-12, -2, ZT + 14], [L, Wd, ZT]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // chassis and wheels
  const wheel = (x, y) => mk("path", { d: poly(hull(ringAt(P, disc(x, y, 4), 4).concat(ringAt(P, disc(x, y, 4), 0)))), class: "nf" }, g);
  wheel(2, 4); wheel(L - 4, 6);
  mk("path", { d: open([P(2, 4, 8), P(L - 4, 6, 8), P(L - 4, Wd - 6, 8), P(2, Wd - 4, 8), P(2, 4, 8)]) + seg(P(2, 4, 8), P(0, 2, ZT)) + seg(P(L - 4, 6, 8), P(L - 10, 8, ZB)), class: "nf lo" }, g);
  // the basket: a tapered hull, top rim and a weave
  const top = rrect(0, 0, L, Wd, 3, 3), foot = rrect(4, 6, L - 10, Wd - 6, 3, 3), inner = rrect(2, 2, L - 2, Wd - 2, 2, 3);
  mk("path", { d: poly(hull(ringAt(P, foot, ZB).concat(ringAt(P, top, ZT)))), class: "sil" }, g);
  mk("path", { d: open(ringAt(P, run(inner, front), ZT)), class: "nf lo" }, g);
  let weave = "";
  for (let k = 1; k <= 2; k++) { const z = ZB + (ZT - ZB) * k / 3, f = k / 3; weave += open([P(L - 10 + 10 * f, 6 - 6 * f, z), P(L - 10 + 10 * f, Wd - 6 + 6 * f, z), P(4 - 4 * f, Wd - 6 + 6 * f, z)]); }
  mk("path", { d: weave, class: "nf lo" }, g);
  wheel(2, Wd - 4); wheel(L - 4, Wd - 6);
  // push bar on two uprights
  mk("path", { d: seg(P(0, 3, ZT), P(-10, 3, ZT + 14)) + seg(P(0, Wd - 3, ZT), P(-10, Wd - 3, ZT + 14)), class: "nf" }, g);
  mk("path", { d: poly(fillet([P(-11, 0, ZT + 13), P(-11, Wd, ZT + 13), P(-9, Wd, ZT + 16), P(-9, 0, ZT + 16)], [1, 1, 1, 1])), class: "nf" }, g);
  const flap = mk("path", { class: "sil hi" }, g);
  const legs = mk("path", { class: "nf lo" }, g);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180);
    const Q = (t, y) => P(1 + t * s, y, ZT - t * c);
    flap.setAttribute("d", poly(fillet([Q(0, 3), Q(0, Wd - 3), Q(FL, Wd - 3), Q(FL, 3)], [1.5, 1.5, 1.5, 1.5])));
    legs.setAttribute("d", seg(Q(10, 8), Q(10, Wd - 8)) + seg(Q(FL - 4, Wd / 2 - 7), Q(FL - 4, Wd / 2 + 7)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = [P(-12, 0, ZT + 16), P(L, Wd, 0), P(L, 0, ZT), P(-12, Wd, 0), P(L, 0, 0), P(0, Wd, ZT)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? fold : REST, performance.now(), 0);
    read.textContent = v ? "seat " + Math.round(fold) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { fold = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "shoppingcart",
  means: "A shopping trolley: over it, the child-seat flap on the back rim folds down into a seat; leaving, it leans back up.",
  rules: [1, 4, 5, 6],
  range: [60, 112, 130],
  tour: [[153, 92], [200, 170], [234, 250], null],
  mount,
});
