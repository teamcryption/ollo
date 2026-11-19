/**
 * Corker: a bench bottle corker, a post on a base plate with a head block
 * over the bottle's mouth and a long lever pivoting on the post's top. The
 * pointer over the corker pulls the lever down: it swings through its arc and
 * drives the plunger, which pushes the cork down into the neck. At rest the
 * lever stands raised, bright, with the cork waiting over the mouth. The
 * slider is how far the lever's stroke goes.
 *
 * The pattern: a continuous value on a spring, read against a fixed band.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -22, PZ = 90, LEN = 74, REST = 35, SWEEP = 52, ARM = 22;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-32, -16, 0], [30, 16, 0], [30, -16, 0], [-32, 16, 0], [PX - 6, 0, 132], [PX + LEN + 2, 0, 66]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.7) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(g, -32, -16, 30, 16, 0, 4, 5, 1.8);
  box(g, -28, -5, -18, 5, 4, PZ, 2, 0.8);
  // plunger below the head, and the cork: painted before the bottle, so the neck hides them
  const low = mk("g", {}, g), rodLo = solid(low), cork = solid(low);
  // the bottle: body, shoulder, neck and lip as one hull
  const bp = [];
  for (const [r, z] of [[11, 4], [11, 44], [8, 49], [4.2, 54], [4.2, 62], [5, 62.5], [5, 65]]) bp.push(...ringAt(P, disc(0, 0, r), z));
  mk("path", { d: poly(hull(bp)), class: "sil" }, g);
  mk("path", { d: open(ringAt(P, disc(0, 0, 11, 28).filter(front), 44)), class: "nf lo" }, g);
  box(g, -28, -7, 8, 7, 72, 84, 3, 1);
  const high = mk("g", {}, g), rodHi = solid(high);
  const lever = solid(g), grip = solid(g);
  lever.sil.classList.add("hi");

  /** A point on the lever: s along it, w across (y), h through its thickness. */
  const at = (a, s, w, h) => P(PX + s * Math.cos(a) - h * Math.sin(a), w, PZ + s * Math.sin(a) + h * Math.cos(a));
  const face = (a, ring, w) => ring.map((q) => at(a, q.u, w, q.v));
  let last = NaN, over = null;
  function draw(deg) {
    if (Math.abs(deg - last) < 0.01) return;
    last = deg;
    const a = rad(deg);
    const bar = rrect(-6, -3.2, LEN - 4, 3.2, 3, 4), barIn = rrect(-4.8, -2, LEN - 5.2, 2, 2, 4);
    put(lever, { sil: poly(hull(face(a, bar, -3).concat(face(a, bar, 3)))), crease: open(face(a, barIn, 3)) });
    const gr = circ(5, 20).map((q) => ({ u: q.u + LEN - 4, v: q.v })), gi = circ(4, 20).map((q) => ({ u: q.u + LEN - 4, v: q.v }));
    put(grip, { sil: poly(hull(face(a, gr, -8).concat(face(a, gr, 8)))), crease: open(face(a, gi, 8)) });
    const top = PZ + ARM * Math.sin(a) - 3, bot = top - 28;
    put(rodLo, prism(P, front, disc(0, 0, 2.4, 16), disc(0, 0, 1.6, 16), bot, Math.min(top, 72)));
    put(cork, prism(P, front, disc(0, 0, 4.4, 20), disc(0, 0, 3.4, 20), bot - 10, bot));
    if (top > 84) put(rodHi, prism(P, front, disc(0, 0, 2.4, 16), disc(0, 0, 1.6, 16), 84, top));
    else put(rodHi, { sil: "", crease: "" });
    read.textContent = deg >= REST - 0.5 && !over ? "rest" : "cork " + Math.round(Math.max(0, 65 - (bot - 10)));
  }

  const ang = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  // the hit: the corker's static box on screen; the pointer's height sets how hard
  const hiP = P(PX + 30, 0, 125), loP = P(0, 0, 30), L = P(-32, 16, 0)[0] - 20, R = P(PX + LEN, 0, 66)[0] + 20;
  function retarget() {
    const inside = over && over[0] > L && over[0] < R && over[1] > hiP[1] - 30 && over[1] < loP[1] + 70;
    if (inside) {
      const t = clamp((over[1] - hiP[1]) / (loP[1] - hiP[1]), 0, 1);
      ang.t = REST - SWEEP * reach * (0.6 + 0.4 * t);
    } else ang.t = REST;
    over = inside ? over : null;
    last = NaN;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "corker",
  means: "A bench bottle corker: the lever swings down and its plunger drives the cork into the bottle's neck.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.7, 1],
  tour: [[196, 108], [196, 160], [196, 206], null],
  mount,
});
