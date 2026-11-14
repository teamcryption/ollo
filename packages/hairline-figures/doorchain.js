/**
 * Door chain: a door hinged on the left, a jamb on the right, a chain guard
 * from the door's edge to a keeper on the jamb. The pointer's place along
 * the floor opens the door; the chain sags while slack and pulls straight
 * as the door reaches its limit. At rest the door stands ajar, chain bright.
 * The slider is how far the chain lets it go.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, unproj, clamp, lerp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, H = 104, T = 4, CZ = 66, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-14, -48, 0], [W + 18, 14, 0], [-14, 14, H + 6], [W + 18, -48, H + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-14, -48, W + 18, 14, 4, 1.6);
  put(solid(g), prism(P, front, fr, fi, -4, 0));
  // the hinge-side post, behind the door
  const [hr, hi_] = rings(-12, -6, -4, 6, 1.5, 1);
  put(solid(g), prism(P, front, hr, hi_, 0, H + 4));
  const door = solid(g);
  const knob = mk("path", { class: "nf" }, g);
  const [jr, ji] = rings(W + 4, -6, W + 14, 5, 1.5, 1);
  const jamb = solid(g);
  put(jamb, prism(P, front, jr, ji, 0, H + 4));
  const keeper = mk("path", { class: "nf" }, g);
  const chain = mk("path", { class: "nf hi" }, g);
  const KX = W + 6, KY = 7;
  keeper.setAttribute("d", open([P(KX + 2, KY, CZ - 3), P(KX + 2, KY, CZ + 3), P(KX - 3, KY, CZ + 3), P(KX - 3, KY, CZ - 3), P(KX + 2, KY, CZ - 3)]));

  const turn = (q, a, ox, oy) => {
    const c = Math.cos(a), s = Math.sin(a), u = q.u - ox, v = q.v - oy;
    return { u: ox + c * u - s * v, v: oy + s * u + c * v, nu: c * q.nu - s * q.nv, nv: s * q.nu + c * q.nv };
  };
  const at = (a, d, off) => [Math.cos(a) * d - Math.sin(a) * off, Math.sin(a) * d + Math.cos(a) * off];
  const ang = spring(REST);
  let last = NaN, L = 0;
  const tip = (a) => at(rad(-a), W - 26, T / 2 + 1);
  const setLen = () => { const [x, y] = tip(maxA); L = Math.hypot(KX - x, KY - y) + 2; };
  setLen();

  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(-a), [dr, di] = rings(0, -T / 2, W, T / 2, 1.2, 0.8);
    put(door, prism(P, front, dr.map((q) => turn(q, r, 0, 0)), di.map((q) => turn(q, r, 0, 0)), 0, H));
    const [kx, ky] = at(r, W - 7, T / 2 + 3);
    knob.setAttribute("d", open([P(kx, ky, 50), P(kx + 1, ky + 2, 50), P(kx + 1, ky + 2, 54), P(kx, ky, 54), P(kx, ky, 50)]));
    const [x0, y0] = tip(a), d = Math.hypot(KX - x0, KY - y0), sag = Math.sqrt(Math.max(0, L * L - d * d)) * 0.55, pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(P(lerp(x0, KX, t), lerp(y0, KY, t), CZ - sag * 4 * t * (1 - t))); }
    chain.setAttribute("d", open(pts));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(v) {
    ang.t = v;
    read.textContent = v === REST ? "rest" : Math.round(v) + "°";
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(y < -60 || y > 30 ? REST : Math.round(clamp((x + 6) / (W + 6), 0, 1) * maxA)); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; setLen(); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "doorchain",
  means: "A door on a chain guard: the pointer opens the door, and the chain sags slack until it pulls straight at its limit.",
  rules: [1, 3, 5, 8],
  range: [20, 32, 44],
  tour: [[142, 216], [210, 250], [233, 261], null],
  mount,
});
