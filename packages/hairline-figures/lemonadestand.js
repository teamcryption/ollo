/**
 * Lemonade stand: a wooden counter with plank lines, two posts and a striped
 * awning over it, a pitcher on the counter behind a row of four cups. The
 * pointer picks a cup by where it stands: the pitcher moves behind it and
 * tilts its spout over it, and that cup fills, its neighbours a little,
 * staggered from it. At rest the pitcher leans over one cup, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the cup
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, D = 32, TOP = 34, N = 4, CY = 24, CR = 4.6, CH = 10, PY = 9, PR = 6, PH = 15, TILT = 0.55, FAV = 1;
const cx = (k) => 15 + k * 18, LV = [0.3, 0.55, 0.2, 0.4];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-4, -4, 0], [W + 4, D + 8, 0], [W + 4, -4, 100], [-4, -4, 100], [-4, D + 8, 90], [W + 4, D + 8, 90]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x) => { const [r, i] = rings(x, 0, x + 3, 3, 1, 0.4); put(solid(g), prism(P, front, r, i, TOP, 96)); };
  post(1); post(W - 4);
  const counter = solid(g);
  { const [r, i] = rings(0, 0, W, D, 3, 1.2); put(counter, prism(P, front, r, i, 0, TOP)); }
  let planks = "";
  for (const z of [11, 22]) planks += seg(P(1.5, D, z), P(W - 1.5, D, z)) + seg(P(W, 1.5, z), P(W, D - 1.5, z));
  mk("path", { class: "nf lo", d: planks }, counter.g);

  const pg = mk("g", {}, g), pit = mk("path", { class: "sil" }, pg), pcr = mk("path", { class: "nf lo" }, pg);
  const cups = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = cx(k);
    const el = solid(grp);
    put(el, prism(P, front, disc(x, CY, CR), disc(x, CY, CR - 0.9), TOP, TOP + CH));
    cups.push({ k, x, el, lvl: mk("path", { class: "nf lo" }, el.g), f: tween(LV[k]), last: NaN });
  }
  // the awning: a sloped plate, front lower than back, with its stripes
  const aw = [[-4, -4, 100], [W + 4, -4, 100], [W + 4, D + 8, 90], [-4, D + 8, 90]];
  const awd = aw.map((p) => P(...p)).concat(aw.map((p) => P(p[0], p[1], p[2] - 2)));
  mk("path", { class: "sil", d: poly(hull(awd)) }, g);
  let stripes = open([P(-4, D + 8, 90), P(W + 4, D + 8, 90)]);
  for (let s = 1; s < 8; s++) { const x = -4 + (s * (W + 8)) / 8; stripes += seg(P(x, -2, 99.4), P(x, D + 6, 90.6)); }
  mk("path", { class: "nf lo", d: stripes }, g);

  const px = tween(cx(FAV)), pt = tween(TILT * 0.6);
  let plast = "";
  function drawPitcher(x, t) {
    const key = x.toFixed(2) + t.toFixed(3);
    if (key === plast) return;
    plast = key;
    // tilt about the pitcher's front foot, toward the cups (+y)
    const hy = PY + PR, rot = ([u, v, z]) => { const dy = v - hy, dz = z; return [u, hy + dy * Math.cos(t) + dz * Math.sin(t), TOP + dz * Math.cos(t) - dy * Math.sin(t)]; };
    const ring = (z, r) => circ(r, 24).map((q) => P(...rot([x + q.u, PY + q.v, z])));
    const spout = P(...rot([x, PY + PR + 3, PH + 1.5]));
    const handle = [[0, -PR, 3], [0, -PR - 4, 5], [0, -PR - 4, 11], [0, -PR, 13]].map(([u, v, z]) => P(...rot([x + u, PY + v, z])));
    pit.setAttribute("d", poly(hull(ring(0, PR).concat(ring(PH, PR), [spout]))) + open(handle));
    pcr.setAttribute("d", poly(ring(PH - 1, PR - 1)));
  }
  function drawCup(c, f) {
    if (f === c.last) return;
    c.last = f;
    c.lvl.setAttribute("d", poly(ringAt(P, disc(c.x, CY, CR - 0.9), TOP + 1 + f * (CH - 2.5))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = !tdone(px, now) || !tdone(pt, now);
    drawPitcher(tval(px, now), tval(pt, now));
    for (const c of cups) { drawCup(c, tval(c.f, now)); if (!tdone(c.f, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cups.map((c) => P(c.x, CY, TOP + CH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cups.forEach((c, k) => {
      const dd = Math.abs(k - a), f = a < 0 ? LV[k] : dd === 0 ? 1 : Math.min(1, LV[k] + (dd === 1 ? 0.15 : 0));
      tset(c.f, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.el.sil.classList.toggle("hi", k === (a < 0 ? -1 : a));
    });
    pit.classList.toggle("hi", a < 0);
    tset(px, cx(a < 0 ? FAV : a), now, 0);
    tset(pt, a < 0 ? TILT * 0.6 : TILT, now, 0);
    read.textContent = a < 0 ? "rest" : "cup " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lemonadestand",
  means: "A lemonade stand: the pitcher tilts over the cup under the pointer and that cup fills, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[157, 170], [192, 187], [227, 205], null],
  mount,
});
