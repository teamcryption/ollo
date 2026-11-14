/**
 * Poker chips: four stacks of chips of different heights on a mat. The
 * pointer picks a stack by where it stands: its top chips lift off as a
 * small pile, and the stacks beside it lift theirs a little, staggered. At
 * rest one stack has its top chips raised, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, CR = 13, T = 3.2, LIFT = 18, FAV = 2, MZ = 3, TOP = 3;
const HS = [7, 11, 5, 9];
const X1 = (N - 1) * STEP + 2 * CR;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-8, -8, 0], [X1 + 8, 2 * CR + 8, 0], [X1 + 8, -8, 0], [-8, 2 * CR + 8, 0], [CR + STEP, CR, MZ + 11 * T + LIFT + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-8, -8, X1 + 8, 2 * CR + 8, 8, 2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = CR + k * STEP, y = CR, grp = mk("g", {}, g), ring = disc(x, y, CR), inner = disc(x, y, CR - 1.6);
    const n = HS[k], chips = [];
    for (let j = 0; j < n; j++) {
      const s = solid(grp);
      if (j < n - TOP) put(s, prism(P, front, ring, inner, MZ + j * T, MZ + (j + 1) * T));
      chips.push(s);
    }
    items.push({ k, n, ring, inner, chips, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    for (let j = it.n - TOP; j < it.n; j++) {
      const z0 = MZ + j * T + lift * (1 + (j - it.n + TOP) * 0.25);
      put(it.chips[j], prism(P, front, it.ring, it.inner, z0, z0 + T));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(CR + it.k * STEP, CR, MZ + (it.n * T) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.chips[it.n - 1].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "×" + items[a].n;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cardshoe",
  means: "Four stacks of poker chips on a mat: the stack under the pointer lifts its top chips, and its neighbours lift theirs a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 114], [176, 112], [272, 178], null],
  mount,
});
