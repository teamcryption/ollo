/**
 * Cricket stumps: three stumps standing in a patch of pitch, two bails
 * resting across their tops. The pointer picks a stump by where it stands:
 * it is knocked back, its bails jump off the top, and the stumps beside it
 * rock a little, staggered from it. At rest the middle stump leans a touch
 * and one bail sits loose, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 15, SR = 2.6, H = 72, BZ = 3, KNOCK = 24, BL = 13, FAV = 1;
const REST = [-2, 4, 1.5];
const NAMES = ["off", "mid", "leg"];
const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-26, -22, 0], [56, 22, 0], [56, -22, 0], [-26, 22, 0], [0, 0, H + 4 + BL], [30, 0, H + 4 + BL], [0, -30, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-26, -22, 56, 22, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, BZ));
  // the popping crease, a guide painted on the patch
  mk("path", { d: poly([P(-20, 6, BZ), P(50, 6, BZ)]), class: "dash nf" }, g);

  const stumps = [];
  for (let k = 0; k < N; k++) {
    const x = k * GAP, sil = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g);
    stumps.push({ k, x, sil, top, a: tween(REST[k]), last: NaN });
  }
  const bails = [];
  for (let k = 0; k < N - 1; k++) {
    const grp = mk("g", {}, g), s = solid(grp);
    bails.push({ k, grp, s, z: tween(k === 0 ? 3 : 0), last: "" });
  }

  const tip = (st, deg) => [st.x, -Math.sin(rad(deg)) * H, Math.cos(rad(deg)) * H + BZ];
  function drawStump(st, deg) {
    if (deg === st.last) return;
    st.last = deg;
    const [x, y, z] = tip(st, deg);
    st.sil.setAttribute("d", poly(hull(ringAt(P, disc(st.x, 0, SR), BZ).concat(ringAt(P, disc(x, y, SR), z)))));
    st.top.setAttribute("d", poly(ringAt(P, disc(x, y, SR - 0.8), z)));
  }
  function drawBail(b, lift, now) {
    const t0 = tip(stumps[b.k], tval(stumps[b.k].a, now)), t1 = tip(stumps[b.k + 1], tval(stumps[b.k + 1].a, now));
    const mx = (t0[0] + t1[0]) / 2, my = (t0[1] + t1[1]) / 2, mz = Math.max(t0[2], t1[2]) + lift;
    const key = [mx, my, mz].map((n) => n.toFixed(2)).join();
    if (key === b.last) return;
    b.last = key;
    const [r, i] = rings(mx - BL / 2, my - 1.4, mx + BL / 2, my + 1.4, 1.4, 0.5);
    put(b.s, prism(P, front, r, i, mz, mz + 2.6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const st of stumps) { drawStump(st, tval(st.a, now)); if (!tdone(st.a, now)) moving = true; }
    for (const b of bails) { drawBail(b, tval(b.z, now), now); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = stumps.map((st) => P(st.x, 0, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 95 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stumps.forEach((st, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? KNOCK : dd === 1 ? 6 : REST[k];
      tset(st.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      st.sil.classList.toggle("hi", a >= 0 && k === a);
    });
    bails.forEach((b, k) => {
      const z = a < 0 ? (k === 0 ? 3 : 0) : (k === a || k + 1 === a) ? BL : 0;
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k + 0.5 - from) * stag);
      b.s.sil.classList.toggle("hi", a < 0 && k === 0);
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cricketstumps",
  means: "Three stumps with bails on a patch of pitch: the stump under the pointer is knocked back and its bails jump off.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[178, 146], [200, 157], [222, 167], null],
  mount,
});
