/**
 * Bumper car: one car on a square of rink floor, a thick rubber bumper round
 * its body, a seat back, a steering wheel at the front and a tall pole rising
 * from the tail to the ceiling grid. The pointer's angle round the car steers
 * it: the car turns on the floor to face the pointer, the pole sweeping round
 * behind it. At rest it sits at a slant, its bumper bright. The slider is how
 * far it can turn.
 *
 * The pattern: one part turning to face the pointer (spring).
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, rrect, ringAt, circ, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const F = 36, REST = 0.5, PH = 66;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
const shift = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const RB = [rrect(-25, -17, 25, 17, 12, 6), rrect(-23, -15, 23, 15, 10, 6)];
const BD = [rrect(-20, -13, 21, 13, 9, 5), rrect(-18.5, -11.5, 19.5, 11.5, 7.5, 5)];
const ST = [rrect(-18, -10, -11, 10, 3, 4), rrect(-16.8, -8.8, -12.2, 8.8, 1.8, 4)];
const PO = [shift(circ(1.5, 16), -21, 0), shift(circ(0.8, 16), -21, 0)];
const SH = [rrect(-25, -3, -17, 3, 1.5, 4), rrect(-24, -2, -18, 2, 0.8, 4)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-F, -F, 0], [F, F, 0], [F, -F, 0], [-F, F, 0], [-21, -21, PH + 4], [21, 21, PH + 4], [21, -21, PH + 4], [-21, 21, PH + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-F, -F, F, F, 8, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  const bump = solid(g), body = solid(g);
  bump.sil.classList.add("hi");
  const seatG = mk("g", {}, g), seat = solid(seatG);
  const wheelG = mk("g", {}, g), col = mk("path", { class: "nf" }, wheelG), wheel = mk("path", { class: "nf" }, wheelG);
  const poleG = mk("g", {}, g), pole = solid(poleG), shoe = solid(poleG);

  const th = spring(REST);
  let last = NaN;
  const R = (pair, a) => [rot(pair[0], a), rot(pair[1], a)];
  function draw(a) {
    if (Math.abs(a - last) < 0.002) return;
    last = a;
    let r = R(RB, a); put(bump, prism(P, front, r[0], r[1], 3, 10));
    r = R(BD, a); put(body, prism(P, front, r[0], r[1], 10, 16));
    r = R(ST, a); put(seat, prism(P, front, r[0], r[1], 16, 29));
    r = R(PO, a); put(pole, prism(P, front, r[0], r[1], 16, PH));
    r = R(SH, a); put(shoe, prism(P, front, r[0], r[1], PH, PH + 3));
    const c = Math.cos(a), s = Math.sin(a), wx = 9 * c, wy = 9 * s;
    col.setAttribute("d", open([P(wx, wy, 16), P(wx - 2 * c, wy - 2 * s, 23)]));
    wheel.setAttribute("d", poly(ringAt(P, shift(circ(4.5, 24), wx - 2 * c, wy - 2 * s), 23)));
    if (c + s > 0) { g.append(poleG, seatG, wheelG); } else { g.append(wheelG, seatG, poleG); }
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  let lastP = null;
  function aim(p) {
    const w = p && unproj(C, p[0], p[1], 0);
    const d = w && Math.hypot(w[0], w[1]);
    if (!w || d > F + 30 || d < 6) { th.t = REST; read.textContent = "rest"; }
    else {
      th.t = REST + clamp(wrap(Math.atan2(w[1], w[0]) - REST), -maxT, maxT);
      read.textContent = "dir " + Math.round((((th.t * 180) / Math.PI) % 360 + 360) % 360);
    }
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => { lastP = p; aim(p); }, leave: () => { lastP = null; aim(null); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = (v * Math.PI) / 180; if (lastP) aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "bumpercar",
  means: "A bumper car on its rink floor: the car turns to face the pointer, its pole sweeping round behind it.",
  rules: [1, 3, 5, 8],
  range: [45, 150, 180],
  tour: [[230, 187], [276, 249], [129, 211], null],
  mount,
});
