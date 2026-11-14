/**
 * Fossil dig: a shallow pit cut into a slab of ground, four bones lying in a
 * row inside it, each a shaft with two knuckles at each end. The pointer
 * picks a bone by where it stands: it lifts out of the pit, and the bones
 * beside it rise a little, staggered from it. At rest one bone is half
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, LEN = [34, 42, 30, 38], W = 4, KR = 3.6, LIFT = 20, FAV = 1, GZ = 8, PZ = 3;
const X1 = (N - 1) * STEP + 40, Y1 = 60;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-10, -10, 0], [X1 + 10, Y1 + 10, 0], [X1 + 10, -10, 0], [-10, Y1 + 10, 0], [20, Y1 / 2, PZ + LIFT + 8], [X1 - 20, Y1 / 2, PZ + LIFT + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the ground slab, and the pit floor sunk into it: the pit walls show as its inner rim
  const [gr, gi] = rings(-10, -10, X1 + 10, Y1 + 10, 8, 2);
  put(solid(g), prism(P, front, gr, gi, 0, GZ));
  const [pr, pi] = rings(0, 0, X1, Y1, 6, 1.5);
  mk("path", { d: "M" + pr.map((q) => P(q.u, q.v, GZ).join(" ")).join("L") + "Z", class: "lo" }, g);
  mk("path", { d: "M" + pi.map((q) => P(q.u, q.v, PZ).join(" ")).join("L") + "Z", class: "nf lo dash" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 20 + k * STEP, y = Y1 / 2, L = LEN[k], grp = mk("g", {}, g);
    const parts = [solid(grp), solid(grp), solid(grp), solid(grp), solid(grp)];
    items.push({ k, x, y, L, grp, parts, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = PZ + lift, z1 = z0 + 3.4, h = it.L / 2 - KR;
    const tilt = lift * 0.15;
    const [sr, si] = rings(it.x - W / 2, it.y - h, it.x + W / 2, it.y + h, 2, 0.6);
    const knobs = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    // far knuckles first, then the shaft, then the near ones
    knobs.slice(0, 2).forEach(([sx, sy], i) => put(it.parts[i], prism(P, front, disc(it.x + sx * 2.6, it.y + sy * h, KR), disc(it.x + sx * 2.6, it.y + sy * h, KR - 0.8), z0 - tilt * 0.2, z1 + 0.6)));
    put(it.parts[2], prism(P, front, sr, si, z0 + 0.4, z1));
    knobs.slice(2).forEach(([sx, sy], i) => put(it.parts[3 + i], prism(P, front, disc(it.x + sx * 2.6, it.y + sy * h, KR), disc(it.x + sx * 2.6, it.y + sy * h, KR - 0.8), z0 + tilt * 0.2, z1 + 0.6 + tilt * 0.2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, PZ));
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
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.parts.forEach((s) => s.sil.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "bone " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fossildig",
  means: "Four bones in a dig pit: the bone under the pointer lifts out of the ground, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 134], [222, 142], [265, 199], null],
  mount,
});
