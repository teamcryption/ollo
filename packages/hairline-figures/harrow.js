/**
 * Folding harrow: a centre frame and two hinged wing frames, each a grid of
 * bars with rows of tines underneath, drawn on an A-frame hitch. The pointer
 * picks a wing by which side it stands: that wing folds up over its hinge,
 * and the other follows a little after. At rest the right wing is bright,
 * already tipped up a little. The slider is how far the wings fold.
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, rrect, seg, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 20, Y = 26, ZA = 10, L = 40, T = 3, TN = 9, MAXF = 110, REST = [5, 16];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.25);
  const W = (s, th, ox, y, oz) => { const c = Math.cos(rad(th)), n = Math.sin(rad(th)); return [s * (H + ox * c - oz * n), y, ZA + ox * n + oz * c]; };
  const ext = [[0, -48, 0]];
  for (const s of [-1, 1]) for (const th of [0, MAXF]) for (const ox of [0, L]) for (const oz of [-TN, T]) for (const y of [-Y, Y]) ext.push(W(s, th, ox, y, oz));
  fit(C, ext, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const mkWing = (s, i) => {
    const grp = mk("g", {}, g), tA = mk("path", { class: "nf" }, grp);
    const plate = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp), bars = mk("path", { class: "nf lo" }, grp);
    if (s > 0) grp.appendChild(tA);
    return { s, i, plate, cr, bars, tA, tw: tween(REST[i]), last: NaN };
  };
  const wl = mkWing(-1, 0);
  // centre: hitch, tines, plate
  const cg = mk("g", {}, g);
  let hs = "";
  for (const x of [-14, 14]) hs += seg(P(x, -Y, ZA + 1.5), P(0, -46, ZA + 1.5));
  mk("path", { d: hs, class: "nf" }, cg);
  put(solid(cg), prism(P, front, ...rings(-3, -50, 3, -44, 2, 1), ZA - 1, ZA + 3));
  let ct = "";
  for (const x of [-12, 0, 12]) for (let k = 0; k < 5; k++) { const y = -Y + 5 + k * ((2 * Y - 10) / 4); ct += seg(P(x, y, ZA), P(x, y, ZA - TN)); }
  mk("path", { d: ct, class: "nf" }, cg);
  const [fr, fi] = rings(-H + 0.5, -Y, H - 0.5, Y, 3, 2);
  put(solid(cg), prism(P, front, fr, fi, ZA, ZA + T));
  let cb = "";
  for (const x of [-7, 7]) cb += seg(P(x, -Y + 2, ZA + T), P(x, Y - 2, ZA + T));
  mk("path", { d: cb, class: "nf lo" }, cg);
  const wr = mkWing(1, 1);
  const wings = [wl, wr];
  const outer = rrect(1, -Y, L, Y, 3, 3), inner = rrect(3, -Y + 2, L - 2, Y - 2, 1.5, 3);

  function draw(w, th) {
    if (th === w.last) return;
    w.last = th;
    const Q = (ox, y, oz) => P(...W(w.s, th, ox, y, oz));
    const pts = [];
    for (const q of outer) for (const oz of [0, T]) pts.push(Q(q.u, q.v, oz));
    w.plate.setAttribute("d", poly(hull(pts)));
    w.cr.setAttribute("d", poly(inner.map((q) => Q(q.u, q.v, T))));
    let b = "", t = "";
    for (const ox of [14, 27]) b += seg(Q(ox, -Y + 2, T), Q(ox, Y - 2, T));
    for (const ox of [8, 21, 34]) for (let k = 0; k < 5; k++) { const y = -Y + 5 + k * ((2 * Y - 10) / 4); t += seg(Q(ox, y, 0), Q(ox, y, -TN)); }
    w.bars.setAttribute("d", b);
    w.tA.setAttribute("d", t);
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const w of wings) { draw(w, tval(w.tw, now)); if (!tdone(w.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const mid = P(0, 0, ZA);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now();
    wings.forEach((w, i) => {
      tset(w.tw, a < 0 ? REST[i] : MAXF * amt * (i === a ? 1 : 0.75), now, a < 0 ? 0 : Math.abs(i - a) * 60);
      w.plate.classList.toggle("hi", i === (a < 0 ? 1 : a));
    });
    read.textContent = a < 0 ? "rest" : (a ? "R " : "L ") + Math.round(MAXF * amt) + "°";
    B.wake();
  }
  setActive(-1);
  const hit = ([sx, sy]) => (Math.hypot(sx - mid[0], sy - mid[1]) > 170 ? -1 : sx < mid[0] ? 0 : 1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "harrow",
  means: "A folding tine harrow: the wing frame on the pointer's side folds up over its hinge, and the other wing follows.",
  rules: [1, 2, 3, 5, 6],
  range: [0.3, 0.85, 1],
  tour: [[264, 215], [140, 165], [250, 205], null],
  mount,
});
