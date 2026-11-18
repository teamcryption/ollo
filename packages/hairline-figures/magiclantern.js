/**
 * Magic lantern: a box lamp with a chimney, a brass lens tube in front and a
 * long slide carrier passing through the gate between them. The pointer picks
 * one of three stops along the carrier's run, and the carrier slides through
 * the gate to that stop. At rest it sits part-way in, bright. The slider is
 * how far the carrier travels.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const Y0 = 34, Y1 = 37, CL = -26, CR = 50, Z0 = 7, Z1 = 33, REST = -8, LX = 20, LZ = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[CL - 8, Y0, Z0], [CR + 48, Y1, Z1], [0, 0, 66], [40, 0, 0], [20, 62, 10], [CR + 48, Y0, 0], [0, 34, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 40, Y0, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 40));
  const [hr, hi] = rings(13, 9, 27, 25, 3, 1.2);
  put(solid(g), prism(P, front, hr, hi, 40, 58));
  const [kr, ki] = rings(9, 5, 31, 29, 4, 1.4);
  put(solid(g), prism(P, front, kr, ki, 58, 63));
  const vent = [];
  for (let i = 0; i < 3; i++) vent.push(P(14 + i * 6, Y0, 47), P(14 + i * 6, Y0, 53));
  mk("path", { d: vent.reduce((d, p, i) => d + (i % 2 ? "L" : "M") + p[0].toFixed(2) + " " + p[1].toFixed(2), ""), class: "nf lo" }, g);

  const car = solid(g), wins = mk("path", { class: "nf lo" }, car.g), slot = mk("path", { class: "nf lo" }, car.g);
  // lens tube, drawn after the carrier: it stands in front of the gate
  const ring = (y, r, n = 28) => circ(r, n).map((q) => P(LX + q.u, y, LZ + q.v));
  mk("path", { d: poly(hull(ring(Y1, 9).concat(ring(56, 9)))) }, g);
  mk("path", { d: poly(hull(ring(52, 11).concat(ring(60, 11)))) }, g);
  mk("path", { d: poly(ring(60, 11)), class: "nf lo" }, g);
  mk("path", { d: poly(ring(60, 7)), class: "nf lo" }, g);
  car.sil.classList.add("hi");

  const sh = tween(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const [r, i] = rings(CL + s, Y0, CR + s, Y1, 1.2, 0.5);
    put(car, prism(P, front, r, i, Z0, Z1));
    let d = "";
    for (const wx of [CL + 18 + s, CR - 18 + s]) d += poly(circ(9, 24).map((q) => P(wx + q.u, Y1, 20 + q.v)));
    wins.setAttribute("d", d);
    slot.setAttribute("d", open([P(CL + 3 + s, Y1, Z1 - 3), P(CL + 3 + s, Y1, Z0 + 3)]) + open([P(CR - 3 + s, Y1, Z1 - 3), P(CR - 3 + s, Y1, Z0 + 3)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sh, now)); return !tdone(sh, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < CL - 10 || x > CR + 30 || y < -10 || y > 70) return -1;
    return x < 10 ? 0 : x < 40 ? 1 : 2;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(sh, a < 0 ? REST : REST + (travel * (a + 1)) / 3 + 8, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "slide " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "magiclantern",
  means: "A magic lantern: the pointer picks a stop and the long slide carrier slides through the gate in front of the lamp.",
  rules: [1, 3, 5, 6],
  range: [12, 36, 48],
  tour: [[100, 175], [248, 220], [311, 227], null],
  mount,
});
