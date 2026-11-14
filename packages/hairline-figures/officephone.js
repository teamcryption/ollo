/**
 * Desk phones: three phones in a row on a desk, each a sloped base with a
 * key field and a handset in its cradle. The pointer picks a phone by where
 * it stands: its handset lifts from the cradle, and the handsets beside it
 * rise a little, staggered from it. At rest one handset is up, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot,
} = HL;

const N = 3, STEP = 46, W = 36, D = 40, BZ = 9, LIFT = 22, FAV = 1;
const X1 = (N - 1) * STEP + W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-2, -2, 0], [X1 + 2, D + 2, 0], [X1 + 2, -2, 0], [-2, D + 2, 0], [W / 2, 8, BZ + 8 + LIFT], [X1 - W / 2, 8, BZ + 8 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const phones = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + W, grp = mk("g", {}, g);
    const [br, bi] = rings(x0, 0, x1, D, 6, 1.8);
    put(solid(grp), prism(P, front, br, bi, 0, BZ));
    const keys = mk("g", {}, grp);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const d = mk("ellipse", { class: "dot off" }, keys), [sx, sy] = P(x0 + 9 + i * 7, 20 + j * 6, BZ);
      d.setAttribute("cx", sx); d.setAttribute("cy", sy); d.setAttribute("rx", 1.6); d.setAttribute("ry", 0.9);
    }
    const [cr, ci] = rings(x0 + 4, 3, x1 - 4, 13, 4, 1);
    put(solid(grp), prism(P, front, cr, ci, BZ, BZ + 3));
    const hs = solid(grp), [hr, hi] = rings(x0 + 2, 4, x1 - 2, 12, 4, 1.4);
    phones.push({ k, x: (x0 + x1) / 2, hs, hr, hi, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    put(p.hs, prism(P, front, p.hr, p.hi, BZ + 3 + lift, BZ + 8 + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of phones) { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = phones.map((p) => P(p.x, D / 2, BZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    phones.forEach((p, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.hs.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "line " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "officephone",
  means: "Three desk phones in a row: the handset under the pointer lifts from its cradle, and the ones beside it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[132, 142], [200, 176], [268, 210], null],
  mount,
});
