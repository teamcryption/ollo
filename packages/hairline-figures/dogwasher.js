/**
 * Dog bath: a raised tub on legs with a slatted ramp hinged at its rim.
 * The pointer over the bath swings the ramp down to the floor for the
 * dog to climb. At rest the ramp is folded up against the tub, bright.
 * The slider is how far the ramp swings.
 */
const { Cam, fit, ringAt, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const TL = 64, TW = 40, ZL = 16, TH = 24, RL = 62, NS = 7;
const UP = 1.15, DOWN = -Math.asin((ZL + TH) / RL);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-6, -6, 0], [TL + RL + 4, TW + 6, 0], [TL + RL + 4, -6, 0], [-6, TW + 6, 0], [0, 0, ZL + TH + 6], [TL + 26, 6, ZL + TH + 58]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const legs = mk("path", { class: "nf" }, g);
  let ld = "";
  for (const [x, y] of [[6, 6], [TL - 6, 6], [6, TW - 6], [TL - 6, TW - 6]]) ld += seg(P(x, y, 0), P(x, y, ZL));
  legs.setAttribute("d", ld);
  const [tr, ti] = rings(0, 0, TL, TW, 8, 3);
  put(solid(g), prism(P, front, tr, ti, ZL, ZL + TH));
  const [hr] = rings(5, 5, TL - 5, TW - 5, 6, 2);
  mk("path", { d: poly(ringAt(P, hr, ZL + TH)), class: "nf" }, g);
  const ramp = mk("path", { class: "sil" }, g), slats = mk("path", { class: "nf lo" }, g);
  const ang = tween(UP);
  let last = NaN;
  const pt = (s, y, a, dz = 0) => P(TL + s * Math.cos(a) - dz * Math.sin(a), y, ZL + TH + s * Math.sin(a) + dz * Math.cos(a));
  function draw(a) {
    if (a === last) return; last = a;
    const y0 = 6, y1 = TW - 6, c = [];
    for (const s of [0, RL]) for (const y of [y0, y1]) for (const dz of [0, -3]) c.push(pt(s, y, a, dz));
    ramp.setAttribute("d", poly(hull(c)));
    let d = "";
    for (let i = 1; i <= NS; i++) { const s = (i / (NS + 1)) * RL; d += seg(pt(s, y0 + 2, a), pt(s, y1 - 2, a)); }
    slats.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(TL / 2 + 20, TW / 2, ZL);
  let act = null;
  function setActive(a) {
    if (a === act) return; act = a;
    const now = performance.now();
    tset(ang, a ? UP + (DOWN - UP) * (0.4 + 0.6 * amp / 90) : UP, now, 0);
    ramp.classList.add("hi");
    read.textContent = a ? "ramp" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 130), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "dogwasher",
  means: "A raised dog bath on legs: the pointer swings its slatted ramp down from the rim to the floor for the dog to climb.",
  rules: [1, 4, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 111], [220, 190], [133, 147], null],
  mount,
});
