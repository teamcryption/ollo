/**
 * Weathervane: a vane on the ridge of a pitched roof, its arrow over a
 * compass cross. The arrow swings round to point where the pointer stands,
 * on a spring, and the read-out names the bearing. At rest it points
 * north-east, bright. The slider is how far the arrow swings toward the pointer.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, circ, fit, facing, fillet, hull, poly, prism, proj, rrect, ringAt, spring, stepS, unproj,
  clamp, disposer, mk, pointer, put, register, seg, solid,
} = HL;

const RZ = 30, PZ = 76, AZ = 70, CZ = 60, AL = 30, REST = -0.6;
const NAMES = ["E", "SE", "S", "SW", "W", "NW", "N", "NE"];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-36, -30, 0], [36, 30, 0], [36, -30, 0], [-36, 30, 0], [-AL, -AL, PZ + 4], [AL, AL, AZ], [AL, -AL, AZ], [-AL, AL, AZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the house: walls, then a roof whose ridge runs along x
  const [wr, wi] = [rrect(-30, -24, 30, 24, 3, 4), rrect(-28.4, -22.4, 28.4, 22.4, 1.4, 4)];
  put(solid(g), prism(P, front, wr, wi, 0, RZ - 2));
  const foot = rrect(-36, -30, 36, 30, 3, 4), top = rrect(-32, -1.5, 32, 1.5, 1.2, 4);
  const roof = solid(g);
  roof.sil.setAttribute("d", poly(hull(ringAt(P, foot, RZ - 2).concat(ringAt(P, top, RZ + 18)))));
  roof.cr.setAttribute("d", poly(ringAt(P, rrect(-31, -0.8, 31, 0.8, 0.6, 4), RZ + 17.4)));
  // the post and the compass cross under the arrow
  put(solid(g), prism(P, front, disc(0, 0, 3), disc(0, 0, 2), RZ + 18, RZ + 21));
  put(solid(g), prism(P, front, disc(0, 0, 1.2, 12), disc(0, 0, 0.8, 12), RZ + 21, AZ));
  mk("path", { d: seg(P(-16, 0, CZ), P(16, 0, CZ)) + seg(P(0, -16, CZ), P(0, 16, CZ)), class: "nf lo" }, g);
  for (const [x, y] of [[16, 0], [-16, 0], [0, 16], [0, -16]]) {
    const d = mk("circle", { r: 1.6, class: "dot m" }, g), p = P(x, y, CZ);
    d.setAttribute("cx", p[0]); d.setAttribute("cy", p[1]);
  }
  const arrow = mk("path", { class: "sil hi" }, g);
  put(solid(g), prism(P, front, disc(0, 0, 2.6, 16), disc(0, 0, 1.6, 16), AZ, PZ));

  // the arrow in its own frame: head at +u, a broad tail fin at -u
  const SHAPE = [[AL, 0], [AL - 9, 7], [AL - 9, 1.6], [-AL + 9, 1.6], [-AL + 2, 9], [-AL - 2, 9], [-AL + 3, 0], [-AL - 2, -9], [-AL + 2, -9], [-AL + 9, -1.6], [AL - 9, -1.6], [AL - 9, -7]];
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const pts = SHAPE.map(([u, v]) => P(u * c - v * s, u * s + v * c, AZ));
    arrow.setAttribute("d", poly(fillet(pts, pts.map(() => 0.8), 2)));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const m = stepS(ang, dt);
    draw(ang.x);
    return m;
  });
  bag.add(B.unregister);

  function aim(t) {
    const tt = ang.x + Math.atan2(Math.sin(t - ang.x), Math.cos(t - ang.x));
    ang.t = ang.x + (tt - ang.x) * clamp(amt, 0, 1);
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, AZ);
    if (Math.hypot(x, y) < 6) return;
    const t = Math.atan2(y, x);
    aim(t);
    const i = ((Math.round(t / (Math.PI / 4)) % 8) + 8) % 8;
    read.textContent = NAMES[i];
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { aim(REST); read.textContent = "rest"; } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}

hairline({
  name: "weathervane",
  means: "A weather vane on a roof ridge: its arrow swings round to point where the pointer stands, and the read-out names the bearing.",
  rules: [3, 4, 5, 8],
  range: [0.3, 1, 1],
  tour: [[139, 138], [261, 138], [139, 77], null],
  mount,
});
