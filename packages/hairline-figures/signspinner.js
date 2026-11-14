/**
 * Arrow sign: a signpost with two arrow boards. The upper board swings on
 * the post to point at where the pointer stands on the ground, and the lower
 * board follows half way. At rest the boards point apart, the upper one
 * bright. The slider is how far the lower board follows.
 *
 * The pattern: a part turning to face the pointer (spring on an angle).
 */
const {
  Cam, circ, fit, facing, fillet, hull, open, poly, prism, proj, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PH = 112, BL = 46, BT = 30, BH = 22, HD = 16, TH = 1.8;
const BOARDS = [{ z: 58, rest: 110, hi: false }, { z: 86, rest: -20, hi: true }];
const disc = (r, n = 20) => circ(r, n);
const ARROW = fillet([[-BT, 0], [BL - HD, 0], [BL, BH / 2], [BL - HD, BH], [-BT, BH]], [1.5, 1, 1.5, 1, 1.5], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let follow = value / 100;
  const C = Cam(45, 0.5, 2.0);
  const ext = [];
  for (let a = 0; a < 360; a += 30) { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); ext.push([BL * c, BL * s, 58], [BL * c, BL * s, 86 + BH]); }
  fit(C, ext.concat([[0, 0, PH + 2], [-14, -14, 0], [14, 14, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(14, 32), disc(12, 32), 0, 4));
  put(solid(g), prism(P, front, disc(3.2), disc(2.2), 4, PH));
  put(solid(g), prism(P, front, disc(4.4), disc(3.4), PH, PH + 3));

  const boards = BOARDS.map((b) => ({ ...b, s: solid(g), a: spring(b.rest), last: NaN }));
  boards.forEach((b) => b.s.sil.classList.toggle("hi", b.hi));

  function draw(b) {
    const ang = b.a.x;
    if (ang === b.last) return;
    b.last = ang;
    const r = ang * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), nx = -s * TH / 2, ny = c * TH / 2;
    const face = (k) => ARROW.map(([u, v]) => P(u * c + k * nx, u * s + k * ny, b.z + v));
    const A = face(1), Bf = face(-1);
    const near = (A[0][1] + A[1][1]) > (Bf[0][1] + Bf[1][1]) ? A : Bf;
    put(b.s, { sil: poly(hull(A.concat(Bf))), crease: open(near.concat([near[0]])) });
  }

  const loop = register(stage, (dt) => {
    let moving = false;
    for (const b of boards) { if (stepS(b.a, dt)) moving = true; draw(b); }
    return moving;
  });
  bag.add(loop.unregister);

  const near = (from, to) => from + ((((to - from) % 360) + 540) % 360) - 180;
  const NAMES = ["E", "SE", "S", "SW", "W", "NW", "N", "NE"];
  function aim(p) {
    if (!p) {
      boards.forEach((b) => { b.a.t = near(b.a.t, b.rest); });
      read.textContent = "rest";
    } else {
      const [x, y] = unproj(C, p[0], p[1], 0), deg = Math.atan2(y, x) * 180 / Math.PI;
      const up = boards[1], lo = boards[0];
      up.a.t = near(up.a.t, deg);
      lo.a.t = near(lo.a.t, lo.rest + follow * (((deg - lo.rest + 540) % 360) - 180));
      read.textContent = NAMES[((Math.round(deg / 45) % 8) + 8) % 8];
    }
    loop.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { follow = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "signspinner",
  means: "A signpost with two arrow boards: the upper board swings to point where the pointer stands, the lower follows half way.",
  rules: [1, 3, 5, 8],
  range: [0, 50, 100],
  tour: [[59, 272], [200, 300], [341, 272], null],
  mount,
});
