/**
 * Prism: a triangular glass prism standing on a bench, a small lamp behind
 * it sending one beam in, and a fan of three rays leaving the far side. The
 * pointer turns the prism to face it, on a spring, and the fan swings as
 * the prism turns. At rest the prism stands a little turned, bright. The
 * slider is the fan's spread.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, Z0 = 3, Z1 = 34, BZ = 16, REST = 0.8, LEN = 74, TAU = Math.PI * 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = clamp(value, 0, 100) / 100 * 0.22;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-70, -44, 0], [96, 40, 0], [96, -44, 0], [-70, 40, 0], [0, 0, Z1 + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-70, -44, 96, 40, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const [lr, li] = rings(-64, -7, -48, 7, 3, 1.4);
  put(solid(g), prism(P, front, lr, li, Z0, BZ + 8));
  mk("path", { d: seg(P(-48, 0, BZ), P(-R * 0.5 - 1, 0, BZ)), class: "nf" }, g);
  const body = solid(g);
  body.sil.classList.add("hi");
  const rays = [0, 1, 2].map((i) => mk("path", { class: i === 1 ? "nf" : "nf lo" }, g));

  const tri = (th, r) => fillet([0, 1, 2].map((i) => [r * Math.cos(th + i * TAU / 3), r * Math.sin(th + i * TAU / 3)]), [3, 3, 3], 4).map(([u, v]) => ({ u, v }));
  const sp = spring(REST);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const foot = ringAt(P, tri(th, R), Z0), top = ringAt(P, tri(th, R), Z1);
    put(body, { sil: poly(hull(foot.concat(top))), crease: poly(ringAt(P, tri(th, R - 2.2), Z1)) });
    const base = -0.42 - 0.22 * Math.sin(3 * th);
    rays.forEach((el, i) => {
      const a = base + (i - 1) * spread, dx = Math.cos(a), dy = Math.sin(a);
      el.setAttribute("d", seg(P(dx * (R + 1), dy * (R + 1), BZ), P(dx * LEN, dy * LEN, BZ)));
    });
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -74 || x > 100 || y < -48 || y > 44 || Math.hypot(x, y) < 6) return null;
    let t = Math.atan2(y, x);
    while (t - sp.t > Math.PI / 3) t -= TAU / 3;
    while (t - sp.t < -Math.PI / 3) t += TAU / 3;
    return t;
  }
  function setT(t) {
    const rest = t === null;
    sp.t = rest ? REST : t;
    const deg = Math.round(((sp.t * 180 / Math.PI) % 120 + 120) % 120);
    read.textContent = rest ? "rest" : deg + "°";
    B.wake();
  }
  setT(null);
  bag.add(pointer(stage, { move: (p) => setT(aim(p)), leave: () => setT(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { spread = clamp(v, 0, 100) / 100 * 0.22; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "prism",
  means: "A glass prism on a bench with a lamp behind it: the prism turns to face the pointer and the fan of rays leaving it swings.",
  rules: [1, 3, 5, 6],
  range: [0, 50, 100],
  tour: [[97, 158], [179, 200], [262, 172], null],
  mount,
});
