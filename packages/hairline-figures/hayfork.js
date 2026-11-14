/**
 * Hay rake: a wooden rake head with a row of pegged tines and a long handle
 * running back from its middle. The pointer picks a tine by where it stands
 * along the head: that tine drives down into the hay, its neighbours a little,
 * staggered from it. At rest one tine is down, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, proj, prism, put, rings, solid, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const N = 9, STEP = 14, X0 = 8, HZ = 18, DROP = 16, FAV = 6;
const RX = X0 * 2 + (N - 1) * STEP;
const rest = (k) => (k === FAV ? DROP * 0.8 : [1, 0, 2, 0.5, 1.5, 0, 0, 1, 0][k]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, -4, HZ + 8], [RX, 4, HZ + 8], [RX / 2, -96, HZ + 10], [0, 0, -DROP], [RX, 0, -DROP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the handle, running back from the head's middle, with a ferrule at the joint
  const [hr, hi] = rings(RX / 2 - 3, -96, RX / 2 + 3, -4, 3, 1);
  put(solid(g), prism(P, front, hr, hi, HZ + 3, HZ + 8));
  const [fr, fi] = rings(RX / 2 - 5, -14, RX / 2 + 5, -3, 3, 1.2);
  put(solid(g), prism(P, front, fr, fi, HZ + 1, HZ + 10));

  const tines = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, s = solid(g);
    tines.push({ x, s, z: tween(rest(k)), last: NaN });
  }
  const [br, bi] = rings(0, -4, RX, 4, 3, 1.2);
  const head = solid(g);
  put(head, prism(P, front, br, bi, HZ, HZ + 7));

  const ring = (x) => rings(x - 2.5, -2.5, x + 2.5, 2.5, 2, 0.7);
  function draw(t, d) {
    if (d === t.last) return;
    t.last = d;
    const [r, i] = ring(t.x);
    put(t.s, prism(P, front, r, i, 2 - d, HZ + 1 - d * 0.2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tines) { draw(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = tines.map((t) => P(t.x, 0, HZ / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 12 && Math.abs(mids[best][1] - sy) < 40 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tines.forEach((t, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? rest(k) : dd === 0 ? DROP : dd === 1 ? DROP * 0.6 : dd === 2 ? DROP * 0.25 : 0;
      tset(t.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      t.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tine " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hayfork",
  means: "A hay rake's head of pegged tines: the tine under the pointer drives down into the hay, and its neighbours follow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[111, 142], [210, 192], [249, 211], null],
  mount,
});
