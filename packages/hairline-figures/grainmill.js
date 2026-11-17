/**
 * Grain mill: a hand mill on a square block, a round grinding body with a
 * wide hopper on top, and a long crank arm on its axle with an upright grip.
 * The crank turns to point at the pointer, on a spring. At rest the crank
 * sits a quarter turn round, its grip bright. The slider is how quickly it
 * follows.
 *
 * The pattern: a continuous aim (a spring on an angle); the hit is the
 * pointer on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 2.2, ARM = 34, ZA = 50;

function moved(ring, dx, dy, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((p) => ({ u: dx + p.u * c - p.v * s, v: dy + p.u * s + p.v * c, nu: p.nu * c - p.nv * s, nv: p.nu * s + p.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.9);
  const ext = [[-18, -18, 0], [18, 18, 0], [18, -18, 0], [-18, 18, 0]];
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; ext.push([ARM * Math.cos(a), ARM * Math.sin(a), ZA + 26]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  const [br, bi] = rings(-18, -18, 18, 18, 4, 1.4);
  put(base, prism(P, front, br, bi, 0, 10));
  const body = solid(g);
  put(body, prism(P, front, circ(11, 40), circ(9.8, 40), 10, 34));
  const hop = solid(g);
  put(hop, prism(P, front, circ(17, 48), circ(15.4, 48), 34, 46));
  const axle = solid(g);
  put(axle, prism(P, front, circ(3, 20), circ(2.2, 20), 46, ZA));

  const arm = solid(g), hub = solid(g), grip = solid(g);
  grip.sil.classList.add("hi");
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw() {
    const a = sp.x;
    if (a === last) return;
    last = a;
    put(arm, prism(P, front, moved(rrect(-4, -3, ARM, 3, 3, 6), 0, 0, a), moved(rrect(-3, -2, ARM - 1, 2, 2, 6), 0, 0, a), ZA, ZA + 4));
    put(hub, prism(P, front, circ(4.5, 24), circ(3.4, 24), ZA + 4, ZA + 6));
    const gx = (ARM - 3) * Math.cos(a), gy = (ARM - 3) * Math.sin(a);
    put(grip, prism(P, front, moved(circ(3.2, 24), gx, gy, 0), moved(circ(2.2, 24), gx, gy, 0), ZA + 4, ZA + 26));
    // paint order: the grip behind the hub when the crank points away
    if (Math.cos(a) + Math.sin(a) < 0) grip.g.after(arm.g), hub.g.after(grip.g); else hub.g.after(arm.g), grip.g.after(hub.g);
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let t = REST;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.hypot(x, y) < 70) t = Math.atan2(y, x);
      else p = null;
    }
    // the nearest turn to where the spring is heading
    t += Math.round((sp.t - t) / (Math.PI * 2)) * Math.PI * 2;
    sp.t = t;
    const deg = ((Math.round((t * 180) / Math.PI) % 360) + 360) % 360;
    read.textContent = p ? deg + "°" : "rest";
    on = !!p;
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * clamp(v, 0.3, 3); sp.c = 18 * Math.sqrt(clamp(v, 0.3, 3)); }, destroy: bag.dispose };
}

hairline({
  name: "grainmill",
  means: "A hand grain mill: the long crank on top turns on its axle to point at the pointer, its upright grip swinging round.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.6],
  tour: [[282, 282], [262, 231], [221, 313], null],
  mount,
});
