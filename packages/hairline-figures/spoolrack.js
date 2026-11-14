/**
 * Spool rack: a board with a row of five pegs, a thread spool on each. The
 * pointer picks a spool by where it is along the row: it lifts up its peg,
 * the neighbours rise a little after it. At rest the spools sit at uneven
 * heights on their pegs, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest rest
 * spool along screen x.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 13, BZ = 3, PEG = 26, LIFT = 18;
const REST = [2, 0, 5, 1, 3], FAV = 2, FLR = 5.4, COR = 3.2, SH = 12;

function shift(ring, x) { return ring.map((s) => ({ ...s, u: s.u + x })); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.7);
  const XN = (N - 1) * STEP;
  fit(C, [[-9, -9, 0], [XN + 9, 9, 0], [XN + 9, -9, 0], [-9, 9, 0], [0, 0, BZ + SH + LIFT + 6], [XN, 0, BZ + SH + LIFT + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-9, -9, XN + 9, 9, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const F = circ(FLR, 20), FI = circ(FLR - 0.8, 20), K = circ(COR, 16), KI = circ(COR - 0.6, 16);
  const pk = circ(0.8, 10), pki = circ(0.5, 10);
  const spools = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP;
    put(solid(g), prism(P, front, shift(pk, x), shift(pki, x), BZ, BZ + PEG));
    const lo = solid(g), core = solid(g), hi = solid(g);
    spools.push({ x, lo, core, hi, z: tween(REST[k]), last: NaN });
  }
  function draw(s, lift) {
    if (lift === s.last) return;
    s.last = lift;
    const z = BZ + lift;
    put(s.lo, prism(P, front, shift(F, s.x), shift(FI, s.x), z, z + 1.4));
    put(s.core, prism(P, front, shift(K, s.x), shift(KI, s.x), z + 1.4, z + SH - 1.4));
    put(s.hi, prism(P, front, shift(F, s.x), shift(FI, s.x), z + SH - 1.4, z + SH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    spools.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  const cen = spools.map((s) => P(s.x, 0, BZ + SH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = 1e9;
    cen.forEach(([hx, hy], k) => { const d = Math.abs(sx - hx); if (d < bd && Math.abs(sy - hy) < 80) { bd = d; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    spools.forEach((s, k) => {
      const t = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, 6 - 2 * Math.abs(k - a));
      tset(s.z, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      [s.lo, s.core, s.hi].forEach((p) => p.sil.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "peg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "spoolrack",
  means: "A rack of thread spools on pegs: the spool under the pointer lifts up its peg, its neighbours rise a little after it.",
  rules: [1, 2, 4, 5],
  range: [0, 45, 90],
  tour: [[132, 151], [200, 184], [268, 219], null],
  mount,
});
