/**
 * Mop bucket: three squat mop buckets on a floor, each with a wringer box on
 * its rim and a long press lever hinged at the back of the wringer. The
 * pointer picks a bucket by where it stands: its lever swings down over the
 * wringer, and the levers beside it dip, staggered from it. At rest one
 * lever is half down, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, each lever swinging on a hinge.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 30, D = 26, STEP = 40, ZT = 28, ZW = 38, LL = 40, FAV = 1;
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-4, -4, 0], [X1 + 4, -4, 0], [X1 + 4, D + 4, 0], [-4, D + 4, 0], [0, 4, ZW + LL + 4], [X1, 4, ZW + LL + 4], [X1, D + 20, ZW + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + W, xc = x0 + W / 2, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x1, D, 6, 2.2);
    put(solid(grp), prism(P, front, br, bi, 0, ZT));
    // the wringer box sits on the back half of the rim
    const [wr, wi] = rings(x0 + 5, 3, x1 - 5, D / 2 + 2, 2, 1.4);
    put(solid(grp), prism(P, front, wr, wi, ZT, ZW));
    const lever = mk("path", { class: "sil" }, grp), grip = mk("path", { class: "nf" }, grp);
    const rest = k === FAV ? 70 : k === 0 ? 8 : 16;
    items.push({ k, x0, x1, xc, lever, grip, rest, a: tween(rest), last: NaN });
  }

  // a point on the lever: u across, d along from the hinge, o through its thickness
  const at = (a, u, d, o) => {
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    return P(u, 5 + d * s + o * c, ZW + d * c - o * s);
  };
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [];
    for (const u of [it.xc - 6, it.xc + 6]) for (const d of [0, LL]) for (const o of [0, 2]) pts.push(at(a, u, d, o));
    it.lever.setAttribute("d", poly(hull(pts)));
    const gp = [];
    for (const u of [it.xc - 11, it.xc + 11]) for (const d of [LL - 4, LL + 1]) for (const o of [-1, 3]) gp.push(at(a, u, d, o));
    it.grip.setAttribute("d", poly(hull(gp)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.xc, D / 2, ZT));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 100 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? it.rest : dd === 0 ? 88 : dd === 1 ? 30 : 6;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lever.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "wring " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mopbucket",
  means: "Three mop buckets with wringers: the lever under the pointer swings down to wring, and its neighbours dip, staggered from it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[262, 217], [138, 155], [200, 213], null],
  mount,
});
