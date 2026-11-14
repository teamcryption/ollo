/**
 * Pinball table: a rounded playfield with a rail round its edge, three round
 * bumpers up the far end and two flippers at the near end. The pointer picks
 * a flipper by which side of the table it is over: that flipper swings up,
 * the other drops back. At rest the left flipper is cocked half up, bright.
 * The slider is how far a flipper swings.
 *
 * The pattern: two parts on a fixed plane, picked by side; each turns about
 * its own pivot, its ring rotated and stood as a solid.
 */
const { Cam, circ, facing, fit, poly, prism, proj, rings, ringAt, rrect, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const TX = 96, TY = 54, TT = 4, FL = 17, FZ = 3.4, PX = 80, PIV = [[PX, 12], [PX, 42]];
const BUMP = [[18, 18], [18, 36], [32, 27]], REST = [-14, -26], FAV = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [TX, TY, 0], [TX, 0, 0], [0, TY, 0], [0, 0, TT + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [to, ti] = rings(0, 0, TX, TY, 12, 1.6);
  put(solid(g), prism(P, front, to, ti, 0, TT));
  // the rail's inner edge and the lanes, printed on the playfield
  const lanes = mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(4, 4, TX - 4, TY - 4, 9, 10), TT)) }, g);
  lanes.setAttribute("d", lanes.getAttribute("d") + poly([P(PX - 6, 5, TT), P(PX - 14, 8, TT), P(PX - 6, 11, TT)]) + poly([P(PX - 6, TY - 5, TT), P(PX - 14, TY - 8, TT), P(PX - 6, TY - 11, TT)]));
  BUMP.forEach(([cx, cy], k) => {
    const shift = (r) => r.map((s) => ({ ...s, u: s.u + cx, v: s.v + cy }));
    put(solid(g), prism(P, front, shift(circ(5, 16)), shift(circ(3.6, 16)), TT, TT + 5 + (k % 2) * 2));
  });

  // a flipper: a tapered bar about its pivot, swung by angle a (degrees, up is toward the bumpers)
  const flips = PIV.map(([px, py], k) => ({ k, px, py, side: k ? -1 : 1, s: solid(g), a: tween(REST[k]), last: NaN }));
  function ringFor(f, a) {
    const t = (a * Math.PI) / 180, dx = -Math.sin(t), dy = Math.cos(t) * f.side;
    const nx = -dy * f.side, ny = dx * f.side;
    const mapR = (r) => r.map((s) => ({ u: f.px + s.u * dx + s.v * nx, v: f.py + s.u * dy + s.v * ny, nu: s.nu * dx + s.nv * nx, nv: s.nu * dy + s.nv * ny }));
    return [mapR(rrect(-2.6, -2.6, FL, 2.6, 2.5, 4)), mapR(rrect(-1.8, -1.8, FL - 0.8, 1.8, 1.7, 4))];
  }
  function draw(f, a) {
    if (a === f.last) return;
    f.last = a;
    const [r, i] = ringFor(f, a);
    put(f.s, prism(P, front, r, i, TT, TT + FZ));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    flips.forEach((f) => { draw(f, tval(f.a, now)); if (!tdone(f.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TT);
    if (x < -3 || x > TX + 3 || y < -3 || y > TY + 3) return -1;
    return y < TY / 2 ? 0 : 1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    flips.forEach((f) => {
      tset(f.a, a < 0 ? REST[f.k] : f.k === a ? 12 + swing : -26, now, 0);
      f.s.sil.classList.toggle("hi", f.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a ? "R flip" : "L flip";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; act = -3; }, destroy: bag.dispose };
}

hairline({
  name: "pinball",
  means: "A pinball table: the flipper on the pointer's side swings up toward the bumpers, the other drops back.",
  rules: [1, 4, 5, 8],
  range: [0, 20, 30],
  tour: [[150, 145], [245, 170], [198, 193], null],
  mount,
});
