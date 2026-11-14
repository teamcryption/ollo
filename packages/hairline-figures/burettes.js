/**
 * Burette stand: a rod and arm over a plate, four glass burettes hung from
 * the arm at uneven heights, each with a tip. The pointer picks a burette by
 * where it stands: it slides up in its clamp, its neighbours a little,
 * staggered from it. At rest one burette is bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, L = 48, LIFT = 36, FAV = 2, AZ = 86;
const REST = [10, 4, 14, 6];
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-24, -16, 0], [X1 + 12, 14, 0], [X1 + 12, -16, 0], [-24, 14, 0], [-16, -10, AZ + 4], [X1, 0, AZ + 36]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-24, -16, X1 + 12, 14, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  put(solid(g), prism(P, front, disc(-16, -10, 2.2), disc(-16, -10, 1.4), 4, AZ + 4));
  const [ar, ai] = rings(-18, -12, X1 + 6, -8, 2, 0.8);
  put(solid(g), prism(P, front, ar, ai, AZ - 2, AZ + 1));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    const tip = solid(grp), tube = solid(grp);
    items.push({ k, x, tip, tube, z: tween(k === FAV ? REST[k] + LIFT * 0.6 : REST[k]), last: NaN });
  }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const b = 16 + h;
    put(it.tip, prism(P, front, disc(it.x, 0, 1, 12), disc(it.x, 0, 0.5, 12), b - 9, b));
    put(it.tube, prism(P, front, disc(it.x, 0, 3.4), disc(it.x, 0, 2.4), b, b + L));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, 40));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? REST[k] + LIFT * 0.6 : REST[k]) : REST[k] + (dd === 0 ? LIFT : dd === 1 ? 16 : 0);
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.tube.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tube " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "burettes",
  means: "Four burettes hung from a lab stand: the one under the pointer slides up in its clamp, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[188, 164], [152, 146], [260, 200], null],
  mount,
});
