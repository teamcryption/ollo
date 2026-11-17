/**
 * Pie bird: a little ceramic bird funnel standing up through the crust of a
 * round pie, its beak open to let the steam out. The pointer over the pie
 * makes the bird rise out of the crust and tip its beak up to the sky; at
 * rest it sits low and leaning a little, bright. The slider is how far it
 * rises and tips.
 *
 * The pattern: one part answering the pointer, a body lifted and tilted.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 40, DZ = 8, CZ = 13, H2 = Math.SQRT1_2;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-PR, -PR, 0], [PR, PR, 0], [-PR, PR, 0], [PR, -PR, 0], [0, 0, CZ + 58], [16, -16, CZ + 44]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [dr, di] = rings(-PR, -PR, PR, PR, PR, 2.4);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  // the crust: a low dome inside the rim, with vent slits
  const dome = [];
  for (const [r, z] of [[PR - 3, DZ], [PR - 8, DZ + 3.5], [PR - 18, CZ], [8, CZ + 0.6]]) dome.push(...ringAt(P, disc(0, 0, r), z));
  mk("path", { d: poly(hull(dome)) }, g);
  let slits = "";
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; slits += open([P(19 * Math.cos(a), 19 * Math.sin(a), CZ - 1.2), P(27 * Math.cos(a), 27 * Math.sin(a), DZ + 3)]); }
  mk("path", { d: slits, class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, 9.5, 28), CZ)), class: "nf lo" }, g);

  const body = mk("path", { class: "sil hi" }, g), wing = mk("path", { class: "nf lo" }, g);
  const head = mk("path", { class: "sil hi" }, g), beak = mk("path", { class: "nf" }, g), eye = mk("path", { class: "nf" }, g);

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(-8 + 30 * amp * t), lift = 14 * amp * t, ca = Math.cos(a), sa = Math.sin(a);
    // local (f forward toward the beak, s sideways, h up) turned back about the base, then lifted
    const B = (f, s, h) => { const ff = f * ca - h * sa, hh = f * sa + h * ca; return P(ff * H2 - s * H2, -ff * H2 - s * H2, CZ - 4 + lift + hh); };
    const ring = (r, h, f0 = 0, n = 24) => circ(r, n).map((q) => B(f0 + q.u, q.v, h));
    body.setAttribute("d", poly(hull([...ring(8.5, 0), ...ring(8, 8), ...ring(6.5, 18), ...ring(4.5, 26, 1)])));
    wing.setAttribute("d", open([B(-2, 7.4, 16), B(-7, 6.5, 9), B(-9, 6, 4)]));
    const hp = [];
    for (let i = -3; i <= 3; i++) { const h = 33 + 6.5 * (i / 3), r = 6.5 * Math.sqrt(1 - (i / 3) ** 2) + 0.2; hp.push(...ring(r, h, 2)); }
    head.setAttribute("d", poly(hull(hp)));
    beak.setAttribute("d", poly([B(7.5, 0, 35), B(16, 0, 33.5), B(7.8, 0, 31), B(13, 0, 33.3)]));
    eye.setAttribute("d", poly(circ(1, 10).map((q) => B(4.5 + q.u * 0.4, -5.6, 36 + q.v))));
  }
  const tw = tween(0);
  const Bk = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(Bk.unregister);

  const mid = P(0, 0, CZ + 10);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "steam" : "rest";
    Bk.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 120 && Math.abs(sy - mid[1]) < 100), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; Bk.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cakepop",
  means: "A pie bird funnel standing up through a pie crust: the pointer makes the bird rise from the crust and tip its open beak up.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 133], [160, 150], [240, 192], null],
  mount,
});
