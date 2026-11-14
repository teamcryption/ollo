/**
 * Security arch: a walk-through scanner on a floor plate, two pillars of
 * stacked detection zones under a beam. The pointer picks a zone by its
 * height on the arch: that zone's panels on both pillars push outward, the
 * zones beside it a little, staggered from it. At rest the zones sit a
 * little uneven, the middle one pushed out, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a stack; the hit is each zone's rest centre on
 * screen y.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, ZH = 10, Z0 = 2, W = 6, GAPX = 34, D = 12, PUSH = 6, BUMP = 2.5;
const ZT = Z0 + N * ZH, XR = GAPX + W;
const REST = [0.5, 1, 3, 1.5, 0], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-6 - PUSH, -14, 0], [XR + 6 + PUSH, 26, 0], [-6, 26, 0], [XR + 6, -14, 0], [-PUSH, 0, ZT + 6], [XR + PUSH, D, ZT + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const floor = solid(g), [fo, fi] = rings(-6, -14, XR + 6, 26, 5, 1.6);
  put(floor, prism(P, front, fo, fi, 0, 2));
  // the walkway's line through the arch, on the plate
  mk("path", { class: "nf lo dash", d: "M" + P(GAPX / 2 + 3, -12, 2).join(" ") + "L" + P(GAPX / 2 + 3, 24, 2).join(" ") }, g);

  const gl = mk("g", {}, g), gr = mk("g", {}, g);
  const zones = [];
  for (let k = 0; k < N; k++) zones.push({ k, l: solid(gl), r: solid(gr), off: tween(REST[k]), last: NaN });
  const beam = solid(g), [bo, bi] = rings(-1, -0.5, XR + 1, D + 0.5, 3, 1);
  put(beam, prism(P, front, bo, bi, ZT, ZT + 6));

  function draw(s, off) {
    if (off === s.last) return;
    s.last = off;
    const z0 = Z0 + s.k * ZH + 0.6, z1 = z0 + ZH - 1.2;
    let [o, i] = rings(-off, 0, W - off, D, 2.2, 0.8);
    put(s.l, prism(P, front, o, i, z0, z1));
    [o, i] = rings(GAPX + off, 0, XR + off, D, 2.2, 0.8);
    put(s.r, prism(P, front, o, i, z0, z1));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    zones.forEach((s) => { draw(s, tval(s.off, now)); if (!tdone(s.off, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: inside the arch's screen band, the zone whose rest centre is nearest on screen y
  const xa = Math.min(P(-6, D, 0)[0], P(-6, 0, 0)[0]) - 6, xb = Math.max(P(XR + 6, 0, 0)[0], P(XR + 6, D, 0)[0]) + 6;
  function hit([sx, sy]) {
    if (sx < xa || sx > xb) return -1;
    const t = clamp((sx - P(0, D / 2, 0)[0]) / (P(XR, D / 2, 0)[0] - P(0, D / 2, 0)[0]), 0, 1);
    let best = -1, bd = 1e9;
    zones.forEach((s, k) => { const d = Math.abs(P(t * XR, D / 2, Z0 + (k + 0.5) * ZH)[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < ZH * 2.9 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    zones.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? PUSH : clamp(BUMP - (Math.abs(k - a) - 1) * 1.5, 0, BUMP);
      tset(s.off, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.l.sil.classList.toggle("hi", on);
      s.r.sil.classList.toggle("hi", on);
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
  name: "securityarch",
  means: "A walk-through security arch: the detection zone at the pointer's height pushes its panels out, the zones beside it less.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 111], [200, 173], [200, 198], null],
  mount,
});
