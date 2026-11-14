/**
 * Record crates: a wooden crate of record sleeves standing on edge. The
 * pointer picks a sleeve by where it stands: that sleeve slides up out of
 * the crate to be read, and the sleeves beside it rise a little, staggered
 * from it. At rest the sleeves stand uneven and one is pulled up, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, GAP = 7.5, W = 38, H = 24, SH = 36, LIFT = 24, FAV = 4;
const L = N * GAP + 6;
const REST = [1, 0, 3, 0, 15, 2, 0, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [L / 2, W / 2, SH + LIFT + 2], [0, 0, SH + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, cls) => {
    const s = solid(g), [rr, ri] = rings(x0, y0, x1, y1, r, b);
    put(s, prism(P, front, rr, ri, z0, z1));
    return s;
  };
  box(0, 0, L, W, 0, 2.5, 3, 1.2);
  box(0, 0, L, 3, 2.5, H, 1.2, 0.6);
  box(0, 0, 3, W, 2.5, H, 1.2, 0.6);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + k * GAP + 1.5, s = solid(g);
    items.push({ k, x, s, z: tween(REST[k]), last: NaN });
  }
  box(L - 3, 0, L, W, 2.5, H, 1.2, 0.6);
  box(0, W - 3, L, W, 2.5, H, 1.2, 0.6);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [rr, ri] = rings(it.x, 4.5, it.x + 1.8, W - 4.5, 0.8, 0.35);
    put(it.s, prism(P, front, rr, ri, 3 + lift, SH + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, W / 2, SH * 0.7));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 14 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 6 : dd === 2 ? 2 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lp " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "recordcrates",
  means: "A crate of record sleeves: the sleeve under the pointer slides up out of the crate, and its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[141, 116], [182, 137], [255, 173], null],
  mount,
});
