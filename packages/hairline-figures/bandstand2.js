/**
 * Lamp bracket: a wall plate with a braced iron arm on a pivot and a lantern
 * hanging from its end. The pointer near the lamp swings the arm out round
 * its pivot, carrying the lantern with it; at rest the arm stands angled
 * off the wall, the lantern bright. The slider is how far it swings.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, circ, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 64, ZA = 100, REST = 14;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const sq = (x, y, h, r = 2) => rrect(x - h, y - h, x + h, y + h, Math.min(r, h - 0.2), 3);

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.9);
  const ends = [10, 40, 70, 110].map((d) => [L * Math.cos((d * Math.PI) / 180), L * Math.sin((d * Math.PI) / 180)]);
  fit(C, [[-14, -4, 44], [14, -4, 122], ...ends.flatMap(([x, y]) => [[x, y, ZA + 4], [x - 12, y + 12, 50], [x + 12, y - 12, 50]])], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the wall plate, with a pivot knuckle
  const [pr, pi] = rings(-12, -4, 12, 0, 2, 0.8);
  put(solid(g), prism(P, front, pr, pi, 52, 118));
  for (const z of [62, 108]) mk("path", { d: poly(ringAt(P, disc(0, -4.2, 1.4, 10), z)), class: "nf lo" }, g);
  const [kr, ki] = [disc(0, 2, 3, 16), disc(0, 2, 2, 16)];
  put(solid(g), prism(P, front, kr, ki, 66, ZA + 6));

  const brace = mk("path", { class: "nf" }, g), arm = mk("path", { class: "nf" }, g), scroll = mk("path", { class: "nf lo" }, g);
  const hook = mk("path", { class: "nf" }, g);
  const lamp = mk("path", { class: "sil hi" }, g), brim = mk("path", { class: "nf lo" }, g), glass = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const t = (d * Math.PI) / 180, ux = Math.cos(t), uy = Math.sin(t) ;
    const at = (s) => [s * ux, 2 + s * uy];
    const [ex, ey] = at(L), [mx, my] = at(L * 0.6);
    arm.setAttribute("d", poly(hull(ringAt(P, disc(0, 2, 2.2), ZA).concat(ringAt(P, disc(0, 2, 2.2), ZA + 3.5), ringAt(P, disc(ex, ey, 2), ZA), ringAt(P, disc(ex, ey, 2), ZA + 3.5)))));
    brace.setAttribute("d", poly(hull(ringAt(P, disc(0, 2, 1.6), 70).concat(ringAt(P, disc(mx, my, 1.6), ZA), ringAt(P, disc(0, 2, 1.6), 72)))));
    const [cx, cy] = at(L * 0.3);
    scroll.setAttribute("d", poly(ringAt(P, disc(cx, cy, 5, 20).map((q) => q), ZA - 6)));
    const zl = ZA - 12;
    hook.setAttribute("d", seg(P(ex, ey, ZA), P(ex, ey, zl + 2)));
    const parts = [[sq(ex, ey, 5), zl - 42], [sq(ex, ey, 7), zl - 38], [sq(ex, ey, 10), zl - 16], [sq(ex, ey, 12.5), zl - 13], [sq(ex, ey, 12.5), zl - 11], [sq(ex, ey, 3, 1), zl - 2], [sq(ex, ey, 1.6, 1), zl + 1]];
    lamp.setAttribute("d", poly(hull(parts.flatMap(([r, z]) => ringAt(P, r, z)))));
    brim.setAttribute("d", poly(ringAt(P, sq(ex, ey, 11.5), zl - 12)) + poly(ringAt(P, sq(ex, ey, 6.4), zl - 37)));
    glass.setAttribute("d", seg(P(ex + 6.6, ey + 6.6, zl - 36), P(ex + 9.4, ey + 9.4, zl - 17)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? REST + 45 + 45 * reach : REST, performance.now(), 0);
    read.textContent = a ? "swung" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 80); return Math.hypot(x, y) < L + 22 && y > -8; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "bandstand2",
  means: "A wall lamp bracket: the pointer near it swings the braced arm out round its pivot, carrying the hanging lantern.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[323, 213], [210, 184], [290, 230], null],
  mount,
});
