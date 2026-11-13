/**
 * Ceiling fan: a canopy on the ceiling, a down-rod, a motor housing with five
 * long blades and a light bowl under it, seen from below and to the side.
 * The pointer is a hand on the switch: the nearer it comes to the fan, the
 * faster the blades turn, the rate easing on a spring, and the blade nearest
 * the pointer is bright. Away, the fan winds down and stops; at rest one
 * blade is bright. The slider is the top speed.
 *
 * The pattern: a continuous rate (terrain's spring, on one number); the hit is
 * on the blades' plane, which never moves. It turns only while the rate is up.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, ringAt, rrect, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, BZ = 41, RB = 62, REST = 17, FAV = 0;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, -0.4, 2.25);
  fit(C, [[RB, RB, BZ], [-RB, -RB, BZ], [RB, -RB, BZ], [-RB, RB, BZ], [0, 0, 80], [0, 0, 27]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // seen from below, the crease runs round each part's underside: prism gets z1 below z0
  put(solid(g), prism(P, front, circ(8, 32), circ(7, 32), 80, 75));
  put(solid(g), prism(P, front, circ(1.6, 16), null, 74, 47));
  const motor = solid(g);
  put(motor, prism(P, front, circ(11, 40), circ(10, 40), 47, 37));
  mk("path", { class: "nf lo", d: open(ringAt(P, run(circ(11, 40), front), 43)) }, motor.g);
  const bowl = solid(g), bfoot = circ(9, 40), btop = circ(4, 24), binner = circ(3.2, 24);
  put(bowl, { sil: poly(hull(ringAt(P, bfoot, 37).concat(ringAt(P, btop, 28)))), crease: open(ringAt(P, run(binner, front), 28)) });
  const blade = rrect(13, -7.5, RB, 7.5, 6, 6), bin = rrect(14, -6.5, RB - 1, 6.5, 5, 6);
  const blades = Array.from({ length: N }, (_, i) => ({ i, el: solid(g) }));

  let spin = rad(REST), drawn = NaN, order = "", hiB = -2;
  const rate = spring(0);
  function draw() {
    if (Math.abs(spin - drawn) < 1e-4) return;
    drawn = spin;
    const keys = [];
    for (const b of blades) {
      const a = spin + (b.i * 2 * Math.PI) / N;
      put(b.el, prism(P, front, turn(blade, a), turn(bin, a), BZ + 1.2, BZ));
      keys.push([b, Math.cos(a) + Math.sin(a)]);
    }
    keys.sort((p, q) => p[1] - q[1]);
    const key = keys.map((k) => k[0].i).join();
    if (key !== order) {
      order = key;
      for (const [b, d] of keys) if (d < 0) g.appendChild(b.el.g);
      g.appendChild(motor.g);
      for (const [b, d] of keys) if (d >= 0) g.appendChild(b.el.g);
      g.appendChild(bowl.g);
    }
  }

  let over = null;
  function bright() {
    let near = FAV;
    if (over) {
      const pa = Math.atan2(over[1], over[0]); let bd = Infinity;
      for (const b of blades) { const d = Math.abs(Math.atan2(Math.sin(pa - spin - (b.i * 2 * Math.PI) / N), Math.cos(pa - spin - (b.i * 2 * Math.PI) / N))); if (d < bd) { bd = d; near = b.i; } }
    }
    if (near !== hiB) { hiB = near; for (const b of blades) b.el.sil.classList.toggle("hi", b.i === near); }
  }

  const B = register(stage, (dt) => {
    const m = stepS(rate, dt);
    spin += rate.x * 2 * Math.PI * dt;
    draw(); bright();
    return m || Math.abs(rate.x) > 1e-3;
  });
  bag.add(B.unregister);

  function retarget() {
    const f = over ? clamp(1.15 - Math.hypot(over[0], over[1]) / 90, 0.2, 1) : 0;
    rate.t = f * 1.2 * top;
    read.textContent = over ? "speed " + Math.max(1, Math.ceil(f * 5)) : "rest";
    bright();
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], BZ); over = Math.hypot(x, y) < 100 ? [x, y] : null; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); retarget();
  return { set: (v) => { top = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "ceilingfan",
  means: "A ceiling fan seen from below: its five blades spin faster the nearer the pointer comes, and wind down when it leaves.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[140, 175], [200, 141], [262, 160], null],
  mount,
});
