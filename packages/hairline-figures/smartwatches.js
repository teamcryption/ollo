/**
 * Smartwatches: four watches lying on their charging pucks along a shelf,
 * each a rounded case with a screen crease, a crown and a strap running out
 * both sides. The pointer picks a watch by where it stands: it lifts off its
 * puck, and the watches beside it rise a little, staggered from it. At rest
 * one watch is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 32, CW = 18, CL = 21, SL = 13, PZ = 4, LIFT = 20, FAV = 1;
const X1 = (N - 1) * STEP + CW;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -SL - 6, 0], [X1 + 6, CL + SL + 6, 0], [X1 + 6, -SL - 6, 0], [-6, CL + SL + 6, 0], [CW / 2, CL / 2, PZ + 8 + LIFT], [X1 - CW / 2, CL / 2, PZ + 8 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -SL - 6, X1 + 6, CL + SL + 6, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, cx = x0 + CW / 2, cy = CL / 2, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(cx, cy, 7), disc(cx, cy, 5.5), PZ, PZ + 2));
    const parts = [solid(grp), solid(grp), solid(grp), solid(grp)];
    parts[1].sil.classList.add("sil");
    items.push({ k, x0, parts, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z = PZ + 2 + lift, x0 = it.x0;
    const [ba, bi] = rings(x0 + 4, -SL, x0 + CW - 4, 2, 2, 1);
    put(it.parts[0], prism(P, front, ba, bi, z + 0.5, z + 2));
    const [ca, ci] = rings(x0, 0, x0 + CW, CL, 5, 2.2);
    put(it.parts[1], prism(P, front, ca, ci, z, z + 6));
    const [cra, cri] = rings(x0 + CW, CL / 2 - 2.5, x0 + CW + 2.5, CL / 2 + 2.5, 1, 0.5);
    put(it.parts[2], prism(P, front, cra, cri, z + 2, z + 4.5));
    const [fa, fi] = rings(x0 + 4, CL - 2, x0 + CW - 4, CL + SL, 2, 1);
    put(it.parts[3], prism(P, front, fa, fi, z + 0.5, z + 2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + CW / 2, CL / 2, PZ + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.parts[1].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "watch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "smartwatches",
  means: "Four smartwatches on charging pucks: the watch under the pointer lifts off its puck, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 134], [223, 179], [269, 202], null],
  mount,
});
