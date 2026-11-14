/**
 * Birdhouse: a wooden box on a post, a round entry hole and a perch on its
 * front, under a gabled roof. The pointer over the house lifts the roof off
 * to look inside; the roof turns bright. At rest the roof sits a little ajar
 * and the entry hole is the bright mark. The slider is how far the roof lifts.
 *
 * The pattern: one part opening (lid).
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, ringAt, rrect, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H0 = 30, H1 = 62, W = 16, OV = 21, RH = 18, AJAR = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-26, -26, 0], [26, 26, 0], [-OV, -OV, H1 + RH + 30], [OV, OV, H1 + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // ground plate and post
  const [gr, gi] = rings(-24, -24, 24, 24, 8, 2);
  put(solid(g), prism(P, front, gr, gi, 0, 3));
  const [pr, pi] = rings(-4, -4, 4, 4, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 3, H0));
  // the box
  const [br, bi] = rings(-W, -W, W, W, 3, 1.6);
  put(solid(g), prism(P, front, br, bi, H0, H1));
  // entry hole on the +y face, perch below it
  const hole = [];
  for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; hole.push(P(5 * Math.cos(t), W, H0 + 20 + 5 * Math.sin(t))); }
  const holeEl = mk("path", { d: poly(hole), class: "nf" }, g);
  const pz = H0 + 9;
  mk("path", { d: poly(hull([P(-1.2, W, pz - 1), P(1.2, W, pz + 1), P(-1.2, W + 10, pz - 1), P(1.2, W + 10, pz + 1), P(1.2, W + 10, pz - 1), P(-1.2, W + 10, pz + 1)])) }, g);
  // the roof: a gable, foot wider than the box, ridge along x
  const roof = solid(g);
  roof.sil.classList.add("sil");
  const foot = rrect(-OV, -OV, OV, OV, 3, 4), top = rrect(-OV, -1.5, OV, 1.5, 1.2, 4), inner = rrect(-OV + 1.2, -0.3, OV - 1.2, 0.3, 0.2, 4);
  const eave = mk("path", { class: "lo nf" }, roof.g);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const z0 = H1 + z, z1 = z0 + RH;
    roof.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1), ringAt(P, foot, z0 + 2)))));
    roof.cr.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
    eave.setAttribute("d", open(ringAt(P, run(foot, front), z0 + 2)));
  }
  const zt = tween(AJAR);
  const B = register(stage, (_dt, now) => { draw(tval(zt, now)); return !tdone(zt, now); });
  bag.add(B.unregister);

  // hit: the rest pose of the house, fixed on screen
  const pts = ringAt(P, foot, H1 + RH).concat(ringAt(P, br, H0));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys) - 6, by1 = Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(zt, v ? lift : AJAR, performance.now(), 0);
    roof.sil.classList.toggle("hi", v);
    holeEl.setAttribute("class", v ? "nf" : "nf hi");
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > bx0 && sx < bx1 && sy > by0 && sy < by1),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (on) { tset(zt, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "birdhouse",
  means: "A birdhouse on a post: the pointer over it lifts the gabled roof off to look inside.",
  rules: [1, 4, 5, 8],
  range: [10, 22, 30],
  tour: [[200, 164], [172, 199], [200, 87], null],
  mount,
});
