/**
 * Lunar lander: a descent stage on four splayed legs with round foot pads,
 * the ascent stage seated on top with its docking port. The nearer the
 * pointer comes to the lander, the higher the ascent stage lifts off the
 * descent stage, on a spring. At rest it sits on the stage, bright. The
 * slider is the reach.
 *
 * The pattern: one continuous reading (gauge).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, seg, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LIFT = 38, Z0 = 32, F = 34;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-F - 5, -F - 5, 0], [F + 5, F + 5, 0], [F + 5, -F - 5, 0], [-F - 5, F + 5, 0], [0, 0, Z0 + 22 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  function leg(sx, sy) {
    const lg = mk("g", {}, g);
    const top = P(sx * 18, sy * 18, Z0 - 6), foot = P(sx * F, sy * F, 1.5), mid = P(sx * 18, sy * 18, 16);
    mk("path", { d: seg(top, foot) + seg(mid, foot), class: "nf sil" }, lg);
    put(solid(lg), prism(P, front, disc(sx * F, sy * F, 5), disc(sx * F, sy * F, 3.6), 0, 1.6));
  }
  leg(-1, -1); leg(1, -1); leg(-1, 1);
  // descent stage, with a dim band of panels
  const [dr, di] = rings(-20, -20, 20, 20, 7, 1.6);
  put(solid(g), prism(P, front, dr, di, 14, Z0));
  let band = ""; for (const t of [-8, 8]) band += seg(P(20, t, 15.5), P(20, t, Z0 - 1.5)) + seg(P(t, 20, 15.5), P(t, 20, Z0 - 1.5));
  mk("path", { d: band, class: "nf lo" }, g);
  leg(1, 1);

  // ascent stage: a cabin with a docking port on top
  const asc = mk("g", {}, g);
  const cab = solid(asc), port = solid(asc);
  cab.sil.classList.add("hi");
  const win = mk("path", { class: "nf lo" }, asc);
  const [ar, ai] = rings(-15, -12, 13, 14, 6, 1.6);
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const z = Z0 + 0.4 + LIFT * f;
    put(cab, prism(P, front, ar, ai, z, z + 18));
    put(port, prism(P, front, disc(-1, 1, 5), disc(-1, 1, 3.4), z + 18, z + 22));
    win.setAttribute("d", seg(P(13, 2, z + 13), P(13, 9, z + 9)) + seg(P(4, 14, z + 13), P(10, 14, z + 9)));
  }
  const sp = spring(0);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(0);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const f = clamp(1 - Math.hypot(x, y) / reach, 0, 1);
    sp.t = f;
    read.textContent = f > 0 ? Math.round(f * 120) + " m" : "rest";
    B.wake();
  }
  function leave() { sp.t = 0; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "lunarlander",
  means: "A lunar lander on splayed legs: bring the pointer near it and the ascent stage lifts off the descent stage, higher the closer it comes.",
  rules: [3, 5, 8],
  range: [50, 90, 130],
  tour: [[200, 218], [248, 196], [160, 240], null],
  mount,
});
