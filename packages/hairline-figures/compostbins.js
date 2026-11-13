/**
 * Compost bins: three slatted bins in a row, each with a lid hinged at its
 * back edge and a grip near the front, and a garden fork leaning on the last
 * one. The pointer picks a bin by where it stands: its lid swings up on the
 * hinge, and the lids beside it lift a little, staggered from it. At rest one
 * lid stands ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the bin
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, BW = 34, BD = 34, BH = 30, GAP = 7, LT = 2.4, OV = 1.6, FAV = 1;
const OPEN = 64, AJAR = 20, NB = 16;
const X1 = N * BW + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const tallest = BH + (BD + OV) * Math.sin((OPEN * Math.PI) / 180) + 4;
  fit(C, [[0, 0, 0], [X1 + 16, BD, 0], [X1 + 16, 0, 0], [0, BD, 0], [0, -OV, tallest], [X1, -OV, tallest]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const bins = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (BW + GAP), x1 = x0 + BW, grp = mk("g", {}, g);
    const [r, i] = rings(x0, 0, x1, BD, 3, 1.8);
    put(solid(grp), prism(P, front, r, i, 0, BH));
    // the slats: a gap line round the two near faces every few units
    let d = "";
    for (let z = 6; z < BH - 2; z += 6) d += open([P(x0 + 2, BD, z), P(x1, BD, z), P(x1, 2, z)]);
    mk("path", { class: "nf lo", d }, grp);
    const lid = solid(grp), grip = mk("path", { class: "nf" }, grp);
    const a0 = k === FAV ? AJAR : k === 2 ? 4 : 0;
    bins.push({ k, x0, x1, lid, grip, a: tween(a0), a0, ring: rrect(x0 - OV, 0, x1 + OV, BD + 2 * OV, 3, 4), last: NaN });
  }

  // the garden fork, leaning on the last bin's end
  const fx = X1 + 9, top = [X1 + 1.5, BD * 0.45, BH + 14], foot = [fx, BD * 0.55, 8];
  let fork = seg(P(...top), P(...foot));
  fork += poly([P(top[0], top[1] - 3, top[2] + 6), P(top[0], top[1] + 3, top[2] + 6), P(top[0], top[1] + 2, top[2]), P(top[0], top[1] - 2, top[2])]);
  fork += seg(P(fx, BD * 0.55 - 4.5, 8), P(fx, BD * 0.55 + 4.5, 8));
  for (let t = 0; t < 4; t++) { const y = BD * 0.55 - 4.5 + t * 3; fork += seg(P(fx, y, 8), P(fx + 1.2, y, 0)); }
  mk("path", { class: "nf sil", d: fork }, g);

  // a point of the lid, hinged at its back edge (y = -OV), tilted a degrees, w above its underside
  const lidPt = (q, a, w) => {
    const v = q.v + OV, s = Math.sin(a), c = Math.cos(a);
    return P(q.u, -OV + v * c - w * s, BH + v * s + w * c);
  };
  function draw(b, deg) {
    if (Math.abs(deg - b.last) < 1e-3) return;
    b.last = deg;
    const a = (deg * Math.PI) / 180, lo = b.ring.map((q) => lidPt(q, a, 0)), hiR = b.ring.map((q) => lidPt(q, a, LT));
    const inner = rrect(b.x0 - OV + 1.4, 1.4, b.x1 + OV - 1.4, BD + 2 * OV - 1.4, 2, 4).map((q) => lidPt(q, a, a > 0.68 ? 0 : LT));
    put(b.lid, { sil: poly(hull(lo.concat(hiR))), crease: poly(inner) });
    const m = (b.x0 + b.x1) / 2;
    b.grip.setAttribute("d", open([lidPt({ u: m - 6, v: BD - 3 }, a, LT), lidPt({ u: m - 5, v: BD - 3 }, a, LT + 2), lidPt({ u: m + 5, v: BD - 3 }, a, LT + 2), lidPt({ u: m + 6, v: BD - 3 }, a, LT)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bins) { draw(b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = bins.map((b) => P((b.x0 + b.x1) / 2, BD / 2, BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 44 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bins.forEach((b, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? b.a0 : dd === 0 ? OPEN : dd === 1 ? NB : 0;
      tset(b.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bin " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "compostbins",
  means: "Three slatted compost bins: the lid of the bin under the pointer swings up, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[131, 167], [189, 196], [247, 225], null],
  mount,
});
