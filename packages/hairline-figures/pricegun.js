/**
 * Price labeller: a hand labeller, roll on top, a strip of price labels fed
 * out of its nose on a backing tape. The pointer picks a label by where it
 * stands along the strip: that label peels up off the tape, its neighbours
 * lift a corner, staggered from it. At rest the first label is half peeled,
 * bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, rrect, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, LW = 20, ST = 23, X0 = 66, YH = 11, ZS = 46, FAV = 0, RZ = 86, RR = 16;
const restA = (k) => (k === FAV ? 0.75 : 0.06 * k);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  const XE = X0 + N * ST + 4;
  fit(C, [[0, -12, 0], [XE, YH, ZS - 10], [20, 0, RZ + RR], [0, 12, 0], [X0 + LW, YH, ZS + LW + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // handle: a slanted grip, foot back, top under the head
  const foot = rrect(30, -8, 48, 8, 6, 4), top = rrect(18, -9, 38, 9, 6, 4), inn = rrect(19.5, -7.5, 36.5, 7.5, 4.5, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, ZS - 6)))), crease: open(ringAt(P, inn, ZS - 6)) });
  const [tr, ti] = rings(44, -3, 52, 3, 3, 1);
  put(solid(g), prism(P, front, tr, ti, ZS - 22, ZS - 8));
  const [hr, hi] = rings(0, -12, X0, 12, 9, 2);
  put(solid(g), prism(P, front, hr, hi, ZS - 8, RZ - 12));
  // the label roll, standing on its axle across y
  const roll = [];
  for (let i = 0; i < 28; i++) { const t = (i / 28) * 2 * Math.PI; for (const y of [-YH, YH]) roll.push(P(22 + RR * Math.cos(t), y, RZ + RR * 0.6 * Math.sin(t) - 2)); }
  mk("path", { d: poly(hull(roll)), class: "sil" }, g);
  const hubp = []; for (let i = 0; i < 16; i++) { const t = (i / 16) * 2 * Math.PI; hubp.push(P(22 + 4 * Math.cos(t), YH, RZ - 2 + 4 * Math.sin(t))); }
  mk("path", { d: poly(hubp), class: "lo" }, g);
  // the backing tape out of the nose
  const tape = [P(X0 - 2, -YH, ZS), P(XE, -YH, ZS), P(XE + 4, -YH, ZS - 10), P(XE + 4, YH, ZS - 10), P(XE, YH, ZS), P(X0 - 2, YH, ZS)];
  mk("path", { d: poly(fillet(tape, [1, 3, 1, 1, 3, 1])), class: "sil" }, g);

  const labels = [];
  for (let k = 0; k < N; k++) {
    const el = mk("path", { class: "sil" }, g), dot = mk("path", { class: "lo nf" }, g);
    labels.push({ k, el, dot, x: X0 + 2 + k * ST, a: tween(restA(k)), last: NaN });
  }
  function draw(l, a) {
    if (a === l.last) return;
    l.last = a;
    const c = Math.cos(a) * LW, s = Math.sin(a) * LW, z = ZS + 0.6 + a * 6, y0 = -YH + 2, y1 = YH - 2;
    l.el.setAttribute("d", poly(fillet([P(l.x, y0, z), P(l.x + c, y0, z + s), P(l.x + c, y1, z + s), P(l.x, y1, z)], [2, 2, 2, 2])));
    l.dot.setAttribute("d", open([P(l.x + c * 0.3, -3, z + s * 0.3), P(l.x + c * 0.7, -3, z + s * 0.7)]) + open([P(l.x + c * 0.3, 3, z + s * 0.3), P(l.x + c * 0.55, 3, z + s * 0.55)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const l of labels) { draw(l, tval(l.a, now)); if (!tdone(l.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = labels.map((l) => P(l.x + LW / 2, 0, ZS));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    labels.forEach((l, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? restA(k) : dd === 0 ? 1.45 : dd === 1 ? 0.35 : 0;
      tset(l.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      l.el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pricegun",
  means: "A hand price labeller feeding a strip of labels: the label under the pointer peels up off the tape, its neighbours lift a corner.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[211, 191], [273, 221], [301, 236], null],
  mount,
});
