/**
 * Rotary dial: a telephone base with a finger plate of ten holes. The pointer
 * picks a hole by where it rests; the plate winds round to the finger stop by
 * that digit's distance. At rest one hole is bright and the plate sits a
 * little wound. The slider is how far the plate winds.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const CX = 45, CY = 45, BZ = 14, DZ = 18, R = 34, HR = 23, HOLE = 6.2, FAV = 3, REST = 0.35;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const holeA = (k) => rad(120 + k * 27);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [90, 90, 0], [90, 0, 0], [0, 90, 0], [CX, CY, DZ + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 90, 90, 18, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  put(solid(g), prism(P, front, disc(CX, CY, R + 3), disc(CX, CY, R + 1.5), BZ, BZ + 1.5));
  const plate = solid(g);
  put(plate, prism(P, front, disc(CX, CY, R), disc(CX, CY, R - 1.5), BZ + 1.5, DZ));
  const holes = [], wells = [];
  for (let k = 0; k < 10; k++) {
    wells.push(mk("path", { class: "nf lo" }, g));
    holes.push(mk("path", { class: "nf" }, g));
  }
  put(solid(g), prism(P, front, disc(CX, CY, 11), disc(CX, CY, 9.5), DZ, DZ + 2.5));
  // the finger stop, fixed, past the last hole
  const sa = rad(40), sx = CX + (R - 2) * Math.cos(sa), sy = CY + (R - 2) * Math.sin(sa);
  mk("path", { d: poly(hull([...ringAt(P, disc(sx, sy, 2.2, 12), DZ), ...ringAt(P, disc(sx, sy, 2.2, 12), DZ + 6)])) }, g);

  const turn = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    for (let k = 0; k < 10; k++) {
      const a = holeA(k) - t, x = CX + HR * Math.cos(a), y = CY + HR * Math.sin(a);
      holes[k].setAttribute("d", poly(ringAt(P, disc(x, y, HOLE, 24), DZ)));
      wells[k].setAttribute("d", poly(ringAt(P, disc(x, y, HOLE, 24), BZ + 2)));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(turn, now)); return !tdone(turn, now); });
  bag.add(B.unregister);

  function hit([px, py]) {
    const [x, y] = unproj(C, px, py, DZ);
    let best = -1, bd = 9;
    for (let k = 0; k < 10; k++) {
      const a = holeA(k), d = Math.hypot(CX + HR * Math.cos(a) - x, CY + HR * Math.sin(a) - y);
      if (d < bd) { bd = d; best = k; }
    }
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const k = a < 0 ? FAV : a;
    tset(turn, a < 0 ? REST : -(rad(40 + 360) - holeA(a)) * amt, performance.now(), 0);
    holes.forEach((h, i) => h.classList.toggle("hi", i === k));
    read.textContent = a < 0 ? "rest" : "dial " + ((a + 1) % 10);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "rotaryphone",
  means: "A rotary telephone dial: the hole under the pointer winds the finger plate round towards the stop, further for higher digits.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[142, 134], [196, 112], [240, 148], null],
  mount,
});
