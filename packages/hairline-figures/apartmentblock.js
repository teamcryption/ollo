/**
 * Apartment block: a tower of five floors with a balcony on each, along its
 * front face, and a row of windows down its side. The pointer picks a floor
 * by height: its balcony slides out from the wall, and the balconies beside
 * it slide a little, staggered from it. At rest the middle balcony stands
 * out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column (riffle, stood up).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, D = 40, FL = 16, N = 5, H = FL * N + 6, BX0 = 12, BX1 = 48, FAV = 2;
const REST = [4, 7, 11, 5, 8], OUT = 15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [W + 4, D + OUT + 4, 0], [W + 4, -4, 0], [-4, D + OUT + 4, 0], [0, 0, H], [W, D + OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-4, -4, W + 4, D + OUT + 4, 5, 1.6);
  put(solid(g), prism(P, front, gr, gi, 0, 2));
  const [tr, ti] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, tr, ti, 2, H));
  // windows down the side face, one row per floor
  let wd = "";
  for (let j = 0; j < N; j++) for (let i = 0; i < 4; i++) {
    const y = 6 + i * 9, z = 2 + FL * j + 6;
    wd += seg(P(W, y, z), P(W, y, z + 6)) + seg(P(W, y + 4, z), P(W, y + 4, z + 6));
  }
  mk("path", { d: wd, class: "nf lo" }, g);
  // the door on the front face, between the ground and the first balcony
  mk("path", { d: seg(P(26, D, 2), P(26, D, 12)) + seg(P(26, D, 12), P(34, D, 12)) + seg(P(34, D, 12), P(34, D, 2)), class: "nf lo" }, g);

  const items = [];
  for (let j = 0; j < N; j++) {
    const s = solid(g), z0 = 2 + FL * (j + 1) - 2;
    items.push({ j, s, z0, d: tween(REST[j]), last: NaN });
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const [r, i] = rings(BX0, D - 2, BX1, D + d, 1.6, 1);
    put(it.s, prism(P, front, r, i, it.z0, it.z0 + 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((BX0 + BX1) / 2, D + REST[it.j] / 2, it.z0 + 2.5));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][0] - sx) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 8 : 3;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "fl " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "apartmentblock",
  means: "A five-floor tower: the balcony at the pointer's floor slides out from the wall, and the ones beside it slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[172, 220], [172, 165], [172, 109], null],
  mount,
});
