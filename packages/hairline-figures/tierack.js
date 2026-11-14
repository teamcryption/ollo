/**
 * Tie rack: a rail on two posts over a foot, six ties hanging from clips
 * along it. The pointer picks a tie by where it stands along the rail: it
 * swings out toward the viewer, and the ties beside it swing a little,
 * staggered from it. At rest one tie hangs swung out, bright, the others at
 * small uneven angles. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fillet, fit, facing, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 14, X0 = 15, YR = 6, ZR = 70, FAV = 3, SW = 48;
const REST = [5, 9, 3, 30, 7, 4];
const TIE = fillet([[-2.2, 0], [2.2, 0], [1.6, 6], [4.4, 44], [0, 49], [-4.4, 44], [-1.6, 6]], [0.8, 0.8, 0.6, 1.4, 1.2, 1.4, 0.6], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const tip = (a) => [YR + 53 * Math.sin(rad(a)), ZR - 3 - 53 * Math.cos(rad(a))];
  const [ty, tz] = tip(SW);
  fit(C, [[-10, -8, 0], [110, 20, 0], [110, -8, 0], [-10, 20, 0], [0, YR, ZR + 4], [100, YR, ZR + 4], [X0, ty, tz], [X0 + 5 * STEP, ty, tz]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-10, -8, 110, 20, 6, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const post = (x) => { const [r, i] = rings(x, YR - 2.5, x + 5, YR + 2.5, 2.4, 0.8); put(solid(g), prism(P, front, r, i, 4, ZR + 4)); };
  post(-3);
  const [rr, ri] = rings(-3, YR - 1.6, 103, YR + 1.6, 1.5, 0.6);
  put(solid(g), prism(P, front, rr, ri, ZR, ZR + 3.2));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const clip = mk("path", { class: "nf" }, grp), body = mk("path", { class: "sil" }, grp), knot = mk("path", { class: "lo nf" }, grp);
    items.push({ k, x, grp, clip, body, knot, a: tween(REST[k]), last: NaN });
  }
  post(98);

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), top = ZR - 3;
    const at = ([u, d]) => P(it.x + u, YR + d * s, top - d * c);
    it.body.setAttribute("d", poly(TIE.map(at)));
    it.knot.setAttribute("d", open([[-1.7, 5.4], [1.7, 5.4]].map(at)) + seg(at([-2.4, 16]), at([2.6, 12])));
    it.clip.setAttribute("d", seg(P(it.x, YR, ZR + 1), at([0, 0])) + seg(P(it.x - 2, YR, ZR + 1), P(it.x + 2, YR, ZR + 1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, YR, ZR - 28));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? REST[k] : dd === 0 ? SW : dd === 1 ? 14 : 4;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tie " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tierack",
  means: "A tie rack of six ties on a rail: the tie under the pointer swings out toward you, its neighbours swing a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 128], [190, 147], [250, 177], null],
  mount,
});
