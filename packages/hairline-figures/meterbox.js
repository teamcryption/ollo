/**
 * Meter cabinet: a tall utility cabinet with three meters standing on its
 * front panel, closed by one hinged door. The pointer is where the door
 * swings to: it turns on its hinge to face the pointer, uncovering the meters.
 * At rest the door stands a little ajar and its handle is bright.
 */
const { Cam, fit, prism, proj, rings, unproj, spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid, clamp } = HL;

const W = 40, D = 14, H = 62, HX = 0, HY = 18, REST = 0.26, AMIN = 0.06, AMAX = 1.75;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: HX + q.u * c - q.v * s, v: HY + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, 0, 0], [W, 0, 0], [W, HY, 0], [0, 0, H + 2], [W, HY, H + 2], [0, HY + W, 0], [0, HY + W, H], [-4, HY + W * 0.6, 0]], 200, 160);
  const P = proj(C);
  const fr = HL.facing(C);
  const g = mk("g", {}, svg);
  // plinth, body, cap
  put(solid(g), prism(P, fr, ...rings(-1, -1, W + 1, D + 1, 2, 1), 0, 4));
  put(solid(g), prism(P, fr, ...rings(0, 0, W, D, 2.5, 1.2), 4, H));
  put(solid(g), prism(P, fr, ...rings(-1.5, -1.5, W + 1.5, D + 1.5, 2.5, 1.2), H, H + 2));
  // three meters on the front panel, at uneven heights
  const M = [[5, 17, 40, 52], [22, 35, 44, 54], [8, 32, 14, 24]];
  for (const [x0, x1, z0, z1] of M) {
    put(solid(g), prism(P, fr, ...rings(x0, D, x1, D + 3, 1.2, 0.6), z0, z1));
    place(flatDot(g, C, 1.6, "dot off"), P((x0 + x1) / 2, D + 1.5, z1));
  }
  // the door and its handle
  const DOOR = rings(0, -1, W, 1, 0.8, 0.4), HAND = rings(33, 1, 36, 3.2, 0.8, 0.4);
  const door = solid(g), hand = solid(g);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, handFirst = null, active = false;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    put(door, prism(P, fr, turn(DOOR[0], a), turn(DOOR[1], a), 4.5, H - 0.5));
    put(hand, prism(P, fr, turn(HAND[0], a), turn(HAND[1], a), 26, 38));
    const hf = Math.cos(a) - Math.sin(a) < 0;
    if (hf !== handFirst) { handFirst = hf; if (hf) door.g.before(hand.g); else hand.g.before(door.g); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function paint() {
    door.sil.classList.toggle("hi", active);
    hand.sil.classList.toggle("hi", !active);
    read.textContent = active ? "open " + Math.round((sp.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), dx = x - HX, dy = y - HY;
      if (Math.hypot(dx, dy) > 95 || (dx < -30 && dy < 0)) { active = false; sp.t = REST; }
      else { active = true; sp.t = clamp(Math.atan2(dy, dx), AMIN, AMAX); }
      paint();
    },
    leave: () => { active = false; sp.t = REST; paint(); },
  }));
  bag.add(() => svg.replaceChildren());
  paint();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "meterbox",
  means: "A meter cabinet whose hinged door swings to face the pointer, uncovering three meters; at rest it stands ajar.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[244, 299], [111, 291], [93, 258], null],
  mount,
});
