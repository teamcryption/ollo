/**
 * Probe sonicator: a base plate with a stand rod, a clamp arm holding the
 * converter, its tapering horn and a thin probe, over a beaker of sample.
 * The pointer over the stand lowers the converter down the rod so the probe
 * dips into the beaker. At rest the probe hangs above the rim, the converter
 * bright. The slider is how far the probe lowers.
 *
 * The pattern: one part sliding down a guide.
 */
const { Cam, circ, fit, hull, open, poly, prism, proj, facing, rings, ringAt, run, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BX = 40, BY = 40, BR = 16, BH = 34, RX = 10, RY = 12, RH = 132, PL = 30, HL_ = 12, CL = 34, CR = 11, REST = 48;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-2, -2, 0], [64, 64, 0], [64, -2, 0], [-2, 64, 0], [RX, RY, RH + 4], [BX + CR, BY, REST + PL + HL_ + CL + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-2, -2, 64, 64, 8, 2), 0, 5));
  put(solid(g), prism(P, front, disc(RX, RY, 2.6, 16), disc(RX, RY, 1.8, 16), 5, RH));
  // the beaker: an open glass with its rim and the sample's surface
  put(solid(g), prism(P, front, disc(BX, BY, BR), disc(BX, BY, BR - 1.4), 5, 5 + BH));
  mk("path", { d: poly(ringAt(P, disc(BX, BY, BR - 1.4), 5 + BH)) + open(ringAt(P, run(disc(BX, BY, BR - 1.4), front), 5 + BH * 0.62)), class: "nf lo" }, g);

  const mv = mk("g", {}, g);
  const collar = solid(mv), arm = solid(mv), probe = solid(mv), horn = solid(mv), conv = solid(mv);
  const knob = mk("path", { class: "nf" }, mv);
  conv.sil.classList.add("hi");
  const z = tween(REST);
  let last = NaN;
  function cone(sol, x, y, r0, r1, z0, z1) {
    put(sol, { sil: poly(hull(ringAt(P, disc(x, y, r0), z0).concat(ringAt(P, disc(x, y, r1), z1)))), crease: open(ringAt(P, run(disc(x, y, r1 - 1), front), z1)) });
  }
  function draw(t) {
    if (t === last) return;
    last = t;
    const top = t + PL + HL_ + CL, az = top - 12;
    put(collar, prism(P, front, disc(RX, RY, 5, 16), disc(RX, RY, 4, 16), az - 4, az + 4));
    const ends = [[RX, RY], [BX, BY]].flatMap(([x, y]) => ringAt(P, disc(x, y, 2.6, 12), az - 2).concat(ringAt(P, disc(x, y, 2.6, 12), az + 2)));
    put(arm, { sil: poly(hull(ends)), crease: open([P(RX, RY, az + 2), P(BX, BY, az + 2)]) });
    // the probe: only the part above the rim shows, the rest is in the glass
    const p0 = Math.max(t, 5 + BH);
    put(probe, prism(P, front, disc(BX, BY, 1.6, 12), disc(BX, BY, 1, 12), p0, t + PL + 0.5));
    cone(horn, BX, BY, 3, 7.5, t + PL, t + PL + HL_);
    put(conv, prism(P, front, disc(BX, BY, CR), disc(BX, BY, CR - 1.6), t + PL + HL_, top));
    knob.setAttribute("d", poly(hull(ringAt(P, disc(BX, BY, 3.5, 12), top).concat(ringAt(P, disc(BX, BY, 3.5, 12), top + 4)))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(32, 32, 50);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? REST - travel : REST, performance.now(), 0);
    read.textContent = on ? "down " + Math.round(travel) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 0.8) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; if (act) { read.textContent = "down " + Math.round(v); tset(z, REST - v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sonicator",
  means: "A probe sonicator: the pointer over the stand lowers the converter and horn so the thin probe dips into the beaker.",
  rules: [1, 3, 5, 6],
  range: [10, 30, 38],
  tour: [[200, 121], [168, 196], [236, 176], null],
  mount,
});
