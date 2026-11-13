/**
 * Sun loungers: four loungers along the edge of a pool deck, each a frame on
 * four legs with a seat pad and a hinged backrest, a towel folded over the
 * foot of one. The pointer picks a lounger by where it stands: its backrest
 * raises, and the backrests beside it raise a little, staggered from it. At
 * rest the backrests sit at different angles, one raised, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the lounger
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, LW = 18, SL = 30, BL = 20, LZ = 9, X0 = 4, FAV = 1, TOWEL = 2;
const X1 = 2 * X0 + (N - 1) * STEP + LW, REST = [4, 30, 12, 2], UP = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-8, -BL - 10, -8], [X1 + 8, SL + 40, -8], [X1 + 8, -BL - 10, -8], [-8, SL + 40, -8], [X0, -BL * 0.31, LZ + BL + 4], [X1 - X0, -BL * 0.31, LZ + BL + 4]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-8, -BL - 10, X1 + 8, SL + 12, 4, 2);
  put(solid(g), prism(P, front, dr, di, -4, 0));
  const [wr, wi] = rings(-8, SL + 16, X1 + 8, SL + 40, 4, 2);
  put(solid(g), prism(P, front, wr, wi, -9, -6));
  mk("path", { class: "nf lo", d: [[10, 24, 0.3], [40, 70, 0.55], [80, 100, 0.8]].map(([a, b, f]) => seg(P(a, SL + 16 + 24 * f, -6), P(b, SL + 16 + 24 * f, -6))).join("") }, g);

  const lounge = [];
  for (let k = 0; k < N; k++) {
    const x0 = X0 + k * STEP, x1 = x0 + LW, grp = mk("g", {}, g);
    for (const y of [-BL + 2, SL - 4]) for (const x of [x0 + 1, x1 - 3]) { const [r, i] = rings(x, y, x + 2, y + 2, 0.8, 0.4); put(solid(grp), prism(P, front, r, i, 0, LZ - 2)); }
    const [fr, fi] = rings(x0, -BL, x1, SL, 2, 0.8);
    put(solid(grp), prism(P, front, fr, fi, LZ - 2, LZ));
    const back = solid(grp);
    const [sr, si] = rings(x0 + 0.6, 0.6, x1 - 0.6, SL - 0.6, 2.5, 1);
    put(solid(grp), prism(P, front, sr, si, LZ, LZ + 2.5));
    if (k === TOWEL) {
      const [tr, ti] = rings(x0 + 2.5, 10, x1 - 2.5, SL + 0.4, 1.4, 0.6);
      put(solid(grp), prism(P, front, tr, ti, LZ + 2.5, LZ + 3.1));
      mk("path", { d: poly([P(x0 + 2.5, SL + 0.4, LZ + 3.1), P(x1 - 2.5, SL + 0.4, LZ + 3.1), P(x1 - 2.5, SL + 0.9, LZ - 6), P(x0 + 2.5, SL + 0.9, LZ - 6)]) }, grp);
      mk("path", { class: "nf lo", d: seg(P(x0 + 2.5, 18, LZ + 3.1), P(x1 - 2.5, 18, LZ + 3.1)) }, grp);
    }
    lounge.push({ k, x0, x1, back, a: tween(REST[k]), last: NaN });
  }

  function draw(l, deg) {
    if (deg === l.last) return;
    l.last = deg;
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
    const Q = (x, y, z) => { const dz = z - LZ; return P(x, y * c + dz * s, LZ - y * s + dz * c); };
    const [br, bi] = rings(l.x0 + 0.6, -BL + 0.6, l.x1 - 0.6, -0.2, 2.5, 1);
    put(l.back, prism(Q, front, br, bi, LZ, LZ + 2.5));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const l of lounge) { draw(l, tval(l.a, now)); if (!tdone(l.a, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  const mids = lounge.map((l) => P((l.x0 + l.x1) / 2, 4, LZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    lounge.forEach((l, k) => {
      const d = Math.abs(k - a), deg = a < 0 ? REST[k] : Math.max(REST[k] * 0.5, [UP, 30, 12][d] || 0);
      tset(l.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      l.back.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lounger " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sunloungers",
  means: "Four sun loungers on a pool deck: the backrest under the pointer raises, and its neighbours raise a little in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[165, 121], [201, 139], [274, 176], null],
  mount,
});
