/**
 * Stethoscopes: three stethoscopes hung on hooks along a clinic wall, each a
 * pair of ear tubes, one long tube and a chest piece. The pointer picks one
 * by where it stands: it swings out on its hook, and the ones beside it sway
 * a little, staggered from it. At rest the middle one hangs aside, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 36, HZ = 64, SW = 30, FAV = 1, REST = [-5, 12, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const X1 = (N - 1) * STEP;
  fit(C, [[-18, -4, 0], [X1 + 18, -4, 0], [-18, 8, 0], [X1 + 18, 8, 0], [-18, -4, 72], [X1 + 18, 0, 72]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-18, -4, X1 + 18, 0, 1.5, 0.7);
  put(solid(g), prism(P, front, wr, wi, 0, 72));

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = k * STEP;
    const [hr, hi] = rings(x - 1.6, 0, x + 1.6, 6, 1.2, 0.5);
    put(solid(grp), prism(P, front, hr, hi, HZ - 1.6, HZ + 1.6));
    const it = { x, grp, a: tween(REST[k]), last: NaN };
    it.ears = mk("path", { class: "sil nf" }, grp);
    it.tube = mk("path", { class: "sil nf" }, grp);
    it.chest = mk("path", { class: "sil" }, grp);
    it.bell = mk("path", { class: "nf lo" }, grp);
    it.sils = [it.ears, it.tube, it.chest];
    items.push(it);
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const t = rad(deg), c = Math.cos(t), s = Math.sin(t), y = 5;
    const W = (u, w) => P(it.x + u * c - w * s, y, HZ + u * s + w * c);
    const side = (m) => [W(m * 6, 3), W(m * 7, -2), W(m * 5.5, -12), W(m * 2, -18), W(0, -21)];
    it.ears.setAttribute("d", open(side(-1)) + " " + open(side(1)));
    const tube = [];
    for (let i = 0; i <= 12; i++) { const q = i / 12; tube.push(W(Math.sin(q * Math.PI) * 6, -21 - q * 26)); }
    it.tube.setAttribute("d", open(tube));
    const disc = (r) => { const pts = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push(W(r * Math.cos(a), -53 + r * Math.sin(a))); } return poly(pts); };
    it.chest.setAttribute("d", disc(6));
    it.bell.setAttribute("d", disc(3.6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 5, HZ - 26));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 36 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? SW : dd === 1 ? 7 * Math.sign(k - a) : 0;
      tset(it.a, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const p of it.sils) p.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "hook " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "stethoscopes",
  means: "Three stethoscopes on wall hooks: the one under the pointer swings out on its hook, and its neighbours sway a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137, 135], [195, 164], [254, 194], null],
  mount,
});
