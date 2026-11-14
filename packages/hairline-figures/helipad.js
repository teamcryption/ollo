/**
 * Helipad: a square pad on a low deck, a touchdown ring painted on it and a
 * helicopter parked in the middle, skids, boom and a two-blade rotor. The
 * nearer the pointer comes to the pad's centre, the higher the helicopter
 * lifts off, the rotor turning a little as it climbs. At rest it sits on the
 * pad, the ring bright. The slider is the ceiling.
 *
 * The pattern: one part answering where the pointer is (lift).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 46, DZ = 6, SK = 3;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ceil = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-W, -W, 0], [W, W, 0], [W, -W, 0], [-W, W, 0], [0, 0, DZ + 50 + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-W, -W, W, W, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, DZ));
  const ring = mk("path", { d: poly(ringAt(P, disc(0, 0, 30, 48), DZ)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, 27, 48), DZ)), class: "nf lo" }, g);
  for (const [x, y] of [[-W + 6, -W + 6], [W - 6, -W + 6], [-W + 6, W - 6], [W - 6, W - 6]]) {
    const d = mk("circle", { r: 1.6, class: "dot off" }, g), q = P(x, y, DZ);
    d.setAttribute("cx", q[0]); d.setAttribute("cy", q[1]);
  }
  const shadow = mk("path", { class: "nf dash" }, g);
  const heli = mk("g", {}, g);
  const skids = mk("path", { class: "nf" }, heli), boom = mk("path", { class: "sil" }, heli);
  const body = mk("path", { class: "sil" }, heli), glass = mk("path", { class: "nf lo" }, heli);
  const mast = mk("path", { class: "nf" }, heli), rotor = mk("path", { class: "nf" }, heli), hub = mk("circle", { r: 1.5, class: "dot m" }, heli);

  const lift = spring(0);
  let last = NaN;
  const ball = (c, rx, ry, rz) => {
    const out = [];
    for (let i = 0; i <= 6; i++) {
      const t = -Math.PI / 2 + (i / 6) * Math.PI;
      for (let j = 0; j < 16; j++) { const f = (j / 16) * 2 * Math.PI; out.push(P(c[0] + rx * Math.cos(t) * Math.cos(f), c[1] + ry * Math.cos(t) * Math.sin(f), c[2] + rz * Math.sin(t))); }
    }
    return out;
  };
  function draw(h) {
    if (h === last) return;
    last = h;
    const z = DZ + h, bz = z + SK + 8;
    let d = "";
    for (const y of [-7, 7]) {
      d += seg(P(-14, y, z), P(14, y, z)) + seg(P(14, y, z), P(16, y, z + 1.5));
      d += seg(P(-8, y, z), P(-6, y * 0.6, bz - 4)) + seg(P(8, y, z), P(6, y * 0.6, bz - 4));
    }
    skids.setAttribute("d", d);
    boom.setAttribute("d", poly(hull(ball([-4, 0, bz + 1], 3, 2.4, 2.4).concat(ball([-34, 0, bz + 3], 1.6, 1.4, 1.6), ball([-36, 0, bz + 8], 1.5, 0.8, 5)))));
    body.setAttribute("d", poly(hull(ball([2, 0, bz], 13, 8, 8))));
    glass.setAttribute("d", open([P(8, -7, bz + 3), P(13, 0, bz + 2.5), P(8, 7, bz + 3)]));
    mast.setAttribute("d", poly(hull(ringAt(P, disc(1, 0, 1.6, 12), bz + 7).concat(ringAt(P, disc(1, 0, 1.6, 12), bz + 11)))));
    const a = 0.6 + h * 0.05, R = 34, top = bz + 11;
    rotor.setAttribute("d", seg(P(1 + R * Math.cos(a), R * Math.sin(a), top), P(1 - R * Math.cos(a), -R * Math.sin(a), top)) + seg(P(1 - R * Math.sin(a), R * Math.cos(a), top), P(1 + R * Math.sin(a), -R * Math.cos(a), top)));
    const q = P(1, 0, top); hub.setAttribute("cx", q[0]); hub.setAttribute("cy", q[1]);
    shadow.setAttribute("d", h > 1 ? poly(ringAt(P, disc(0, 0, 10 + h * 0.15, 32), DZ)) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  function lit(on) { ring.classList.toggle("hi", !on); body.classList.toggle("hi", on); }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, DZ), r = Math.hypot(wx, wy);
    if (r > W * 1.6) return leave();
    lift.t = ceil * clamp(1 - r / (W * 1.4), 0.15, 1);
    lit(true);
    read.textContent = Math.round(lift.t) + " m";
    B.wake();
  }
  function leave() { lift.t = 0; lit(false); read.textContent = "rest"; B.wake(); }
  draw(0); leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ceil = v; }, destroy: bag.dispose };
}

hairline({
  name: "helipad",
  means: "A helicopter parked on a square pad: the nearer the pointer to the pad's centre, the higher it lifts off, rotor turning.",
  rules: [3, 4, 5, 8],
  range: [20, 40, 50],
  tour: [[200, 206], [102, 157], [200, 271], null],
  mount,
});
