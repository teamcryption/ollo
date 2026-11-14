/**
 * Hanging planters: three pots hung by cords from a rail, each holding a
 * mound of leaves. The pointer picks a pot by where it hangs: its cords pay
 * out and it lowers to be watered, its neighbours dip a little, staggered.
 * At rest the pots hang at uneven heights and the middle one is bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, hull, open, poly, prism, proj, rings, ringAt, seg, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid, put,
} = HL;

const N = 3, STEP = 50, H = 110, PH = 18, RT = 12, RB = 8, DROP = 22, FAV = 1;
const REST = [10, 24, 4];
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const low = H - 30 - DROP - 24 - PH;
  fit(C, [[-14, 0, H + 4], [X1 + 14, 0, H + 4], [-RT, RT, low], [X1 + RT, RT, low], [0, -RT, low], [X1, 0, low]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-16, -3, X1 + 16, 3, 3, 1);
  put(solid(g), prism(P, front, rr, ri, H, H + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const cords = mk("path", { class: "nf lo" }, grp);
    const leaf = mk("path", { class: "nf" }, grp);
    const body = mk("path", { class: "sil" }, grp);
    const rim = mk("path", { class: "nf lo" }, grp);
    mk("path", { class: "nf", d: poly(ringAt(P, disc(x, 0, 2.4, 12), H - 1)) }, grp);
    items.push({ k, x, cords, leaf, body, rim, z: tween(REST[k]), last: NaN });
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const top = H - 30 - d, x = it.x, hook = P(x, 0, H - 1);
    let c = "";
    for (const a of [90, 210, 330]) { const t = (a * Math.PI) / 180; c += seg(hook, P(x + RT * Math.cos(t), RT * Math.sin(t), top)); }
    it.cords.setAttribute("d", c);
    const lp = [];
    for (const [r, z, dx] of [[9, 0, 0], [8, 6, -2], [5, 11, 1], [2, 14, 3]]) lp.push(...ringAt(P, disc(x + dx, dx, r, 18), top + z));
    it.leaf.setAttribute("d", poly(hull(lp)));
    it.body.setAttribute("d", poly(hull(ringAt(P, disc(x, 0, RB), top - PH).concat(ringAt(P, disc(x, 0, RT), top)))));
    it.rim.setAttribute("d", open(ringAt(P, disc(x, 0, RT - 1.6), top - 0.6).filter((_, i) => i > 3 && i < 13)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it, k) => P(it.x, 0, H - 30 - REST[k] - PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = REST[k] + (a < 0 ? 0 : dd === 0 ? DROP : dd === 1 ? 5 : 0);
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "plantpots",
  means: "Three planters hung by cords from a rail: the pot under the pointer lowers on its cords, and its neighbours dip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 133], [207, 194], [280, 195], null],
  mount,
});
