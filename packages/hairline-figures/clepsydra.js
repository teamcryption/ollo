/**
 * Water clock: an inflow clepsydra, a tall vessel with a float drum riding
 * the water inside it. A rod stands on the float and a pointer arm reaches
 * from it to a ticked scale post behind. The pointer over the clock lets the
 * water in: the float climbs out of the vessel and the arm rides up the
 * scale. At rest the float sits low, its rim bright. The slider is how far
 * the float climbs.
 *
 * The pattern: one part sliding on a discrete tween; the hit is a fixed box
 * round the rest pose.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, run, seg, tween, tset, tval, tdone,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 26, H = 50, FR = 21, FH = 40, REST = 6, LIFT = 34, ROD = 26, PX = -6, PY = -46, PH = 132;
const disc = (x, y, r, n = 48) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.92);
  fit(C, [[R, R, 0], [-R, -R, 0], [R, -R, 0], [-R, R, 0], [PX, PY, PH + 4], [0, 0, H + REST + LIFT * 1.3 + ROD]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the scale post, farthest, with its ticks
  put(solid(g), prism(P, front, disc(PX, PY, 3.2, 20), disc(PX, PY, 2.2, 20), 0, PH));
  put(solid(g), prism(P, front, disc(PX, PY, 8, 28), disc(PX, PY, 6.6, 28), 0, 3));
  const ticks = [];
  for (let i = 0; i < 6; i++) {
    const d = flatDot(g, C, 1.6, "dot off");
    place(d, P(PX + 4, PY + 4, H + 4 + i * 14));
    ticks.push(d);
  }
  // the vessel: base, body, its open rim
  put(solid(g), prism(P, front, disc(0, 0, R + 4), disc(0, 0, R + 2.6), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 1.6), 4, H));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(0, 0, R - 1.6), H)) }, g);
  // the float, its rod and arm, then the vessel's front wall over them
  const fl = solid(g), rod = solid(g);
  const arm = mk("path", { class: "nf sil" }, g);
  fl.sil.classList.add("hi");
  const wall = mk("path", { class: "sil" }, g);
  const fr = run(disc(0, 0, R), front);
  wall.setAttribute("d", poly(ringAt(P, fr, H).concat(ringAt(P, fr, 4).reverse())));

  const lift = tween(0);
  let drawn = NaN;
  function draw(t) {
    const z = H - FH + REST + t * LIFT * amp;
    if (Math.abs(z - drawn) < 1e-3) return;
    drawn = z;
    put(fl, prism(P, front, disc(0, 0, FR), disc(0, 0, FR - 1.8), z, z + FH));
    put(rod, prism(P, front, disc(0, 0, 1.8, 16), null, z + FH, z + FH + ROD));
    const top = z + FH + ROD;
    arm.setAttribute("d", seg(P(0, 0, top - 2), P(PX + 2, PY + 2, top - 2)) + seg(P(PX + 2, PY + 2, top - 2), P(PX + 5, PY + 5, top - 5)));
    const lvl = Math.round((top - 2 - (H + 4 + FH + ROD - FH)) / 14);
    ticks.forEach((d, i) => d.setAttribute("class", i === lvl ? "dot m" : "dot off"));
  }
  const B = register(stage, (dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  // hit: a fixed box round the rest pose
  const a = P(-R - 6, R + 6, 0), b = P(R + 6, -R - 6, 0), top = P(PX, PY, PH);
  const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = top[1], y1 = P(R, R, 0)[1] + 6;
  function set(on) {
    tset(lift, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "inflow" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => set(p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { amp = v; drawn = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "clepsydra",
  means: "A water clock: the pointer lets the water in, the float climbs out of the vessel and its arm rides up the scale.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[200, 159], [200, 240], [254, 90], null],
  mount,
});
