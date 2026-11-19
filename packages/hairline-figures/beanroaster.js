/**
 * Bean roaster: a shop drum roaster, a cabinet holding a horizontal drum
 * with a hopper on top and a round door on its front, and a round cooling
 * tray in front with a stirring arm. The pointer over the roaster opens the
 * door and sweeps the stirring arm round the tray, further the more to the
 * right the pointer stands. At rest the door is shut and the arm, bright,
 * waits across the tray. The slider is how far the arm sweeps.
 *
 * The pattern: a continuous value on a spring, read against a fixed band.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DZ = 60, DR = 17, TX = 36, TR = 27, TZ = 24, REST = 20, SWEEP = 150;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-42, -22, 0], [TX + TR, TR, 0], [TX + TR, -TR, 0], [-42, 22, 0], [-20, 0, DZ + DR + 20], [20, -20, DZ + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.7) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(g, -42, -20, 0, 20, 0, 42, 4, 1.4);
  // the drum: a cylinder along x, as a hull of its two end rings
  const endRing = (x, r, n = 36) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x, r * Math.cos(t), DZ + r * Math.sin(t)); });
  mk("path", { d: poly(hull(endRing(-38, DR).concat(endRing(4, DR)))), class: "sil" }, g);
  mk("path", { d: poly(endRing(4, DR - 2)), class: "nf lo" }, g);
  // the hopper: a cone, wide at the top
  const hp = ringAt(P, disc(-20, 0, 4, 24), DZ + DR - 2).concat(ringAt(P, disc(-20, 0, 12, 24), DZ + DR + 16));
  mk("path", { d: poly(hull(hp)), class: "sil" }, g);
  mk("path", { d: open(ringAt(P, disc(-20, 0, 10.5, 24), DZ + DR + 16)), class: "nf lo" }, g);
  // the cooling tray on its stand
  box(g, TX - 5, -5, TX + 5, 5, 0, TZ - 6, 4, 1.2);
  put(solid(g), prism(P, front, disc(TX, 0, TR, 56), disc(TX, 0, TR - 2, 56), TZ - 6, TZ));
  const arm = solid(g), pads = mk("path", { class: "nf" }, g), hub = solid(g), door = solid(g);
  arm.sil.classList.add("hi");
  put(hub, prism(P, front, disc(TX, 0, 3.4, 20), disc(TX, 0, 2.4, 20), TZ - 6, TZ + 8));

  const rot = (ring, th, x, y) => ring.map((q) => ({ u: x + q.u * Math.cos(th) - q.v * Math.sin(th), v: y + q.u * Math.sin(th) + q.v * Math.cos(th) }));
  const slab = (ring, z0, z1) => poly(hull(ringAt(P, ring, z0).concat(ringAt(P, ring, z1))));
  let last = NaN;
  function draw(deg) {
    if (Math.abs(deg - last) < 0.01) return;
    last = deg;
    const th = rad(deg), k = clamp((deg - REST) / SWEEP, 0, 1);
    const bar = rrect(-TR + 4, -1.8, TR - 4, 1.8, 1.8, 3), barIn = rrect(-TR + 5, -0.8, TR - 5, 0.8, 0.8, 3);
    put(arm, { sil: slab(rot(bar, th, TX, 0), TZ - 4, TZ - 1), crease: open(ringAt(P, rot(barIn, th, TX, 0), TZ - 1)) });
    let d = "";
    for (const s of [-1, 1]) for (const off of [10, 19]) d += slab(rot(rrect(s * off - 1, -4, s * off + 1, 4, 1, 2), th, TX, 0), TZ - 5, TZ + 1);
    pads.setAttribute("d", d);
    // the door: hinged on the drum's front at its +y edge, swinging out
    const phi = rad(100 * k), dpt = (y, z, t) => { const dy = y - DR + 3; return P(4 + t - dy * Math.sin(phi), DR - 3 + dy * Math.cos(phi), z); };
    const ringD = (t, r) => Array.from({ length: 32 }, (_, i) => { const a = (i / 32) * Math.PI * 2; return dpt(r * Math.cos(a), DZ + r * Math.sin(a), t); });
    put(door, { sil: poly(hull(ringD(0, DR - 3).concat(ringD(2.5, DR - 3)))), crease: poly(ringD(2.5, DR - 6)) });
    read.textContent = over ? "stir " + Math.round(deg - REST) : "rest";
  }

  const ang = spring(REST);
  let over = null;
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  // the hit: the roaster's static box on screen; the pointer's x sets the sweep
  const L = P(-42, 22, 0)[0] - 20, R = P(TX + TR, -TR, 0)[0] + 20, T = P(-20, 0, DZ + DR + 16)[1] - 30, Bt = P(TX + TR, TR, 0)[1] + 20;
  function retarget() {
    over = over && over[0] > L && over[0] < R && over[1] > T && over[1] < Bt ? over : null;
    ang.t = over ? REST + SWEEP * reach * (0.5 + 0.5 * clamp((over[0] - L) / (R - L), 0, 1)) : REST;
    last = NaN;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "beanroaster",
  means: "A drum coffee roaster: the door swings open and the stirring arm sweeps round the cooling tray.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.7, 1],
  tour: [[150, 200], [233, 210], [300, 240], null],
  mount,
});
