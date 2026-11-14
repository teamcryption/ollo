/**
 * Security gate: a walk-through arch on a mat, each post faced with a column
 * of zone pads. The pointer picks a height through the arch: the pads of that
 * zone push out of both posts, and the zones beside it push a little,
 * staggered from it. At rest one zone is out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column, both sides answering as one.
 */
const {
  Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NZ = 6, GW = 64, PW = 12, D = 16, H = 84, BH = 12, MZ = 3, ZH = 12, Z0 = MZ + 6, OUT = 9, FAV = 2;
const REST = [1.5, 0.5, OUT * 0.8, 1, 2, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-14, -14, 0], [GW + 14, D + 30, 0], [GW + 14, -14, 0], [-14, D + 30, 0], [0, 0, H + BH], [GW, 0, H + BH], [0, D + OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-14, -14, GW + 14, D + 30, 6, 2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));

  const zones = Array.from({ length: NZ }, (_, k) => ({ k, pads: [], o: tween(REST[k]), last: NaN }));
  for (const x0 of [0, GW - PW]) {
    const [pr, pi] = rings(x0, 0, x0 + PW, D, 4, 1.6);
    put(solid(g), prism(P, front, pr, pi, MZ, H));
    for (const z of zones) {
      const s = solid(g);
      s.sil.classList.add("sil");
      z.pads.push({ s, x0 });
    }
  }
  const [br, bi] = rings(-2, -1, GW + 2, D + 1, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, H, H + BH));

  function draw(z, o) {
    if (o === z.last) return;
    z.last = o;
    const zb = Z0 + z.k * ZH;
    for (const p of z.pads) {
      const [r, i] = rings(p.x0 + 2, D - 4 + o, p.x0 + PW - 2, D + o, 1.5, 0.7);
      put(p.s, prism(P, front, r, i, zb, zb + ZH - 2.5));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const z of zones) { draw(z, tval(z.o, now)); if (!tdone(z.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // hit: rest centres of the left post's pads, by screen y; the arch's span by screen x
  const mids = zones.map((z) => P(PW / 2, D, Z0 + z.k * ZH + ZH / 2));
  const xl = P(-6, D + 6, 0)[0], xr = P(GW + 6, 0, 0)[0];
  function hit([sx, sy]) {
    if (sx < xl || sx > xr) return -1;
    const off = (sx - mids[0][0]) * 0.5;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] + off - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < ZH * 1.6 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const on = a < 0 ? FAV : a;
    zones.forEach((z) => {
      const dd = Math.abs(z.k - a), o = a < 0 ? REST[z.k] : dd === 0 ? OUT : dd === 1 ? 3 : 0.5;
      tset(z.o, o, now, from < 0 ? 0 : Math.abs(z.k - from) * stag);
      for (const p of z.pads) p.s.sil.classList.toggle("hi", z.k === on);
    });
    read.textContent = a < 0 ? "rest" : "zone " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "metaldetector",
  means: "A walk-through security arch: the zone pads at the pointer's height push out of both posts, and the zones beside them a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 209], [200, 171], [200, 134], null],
  mount,
});
