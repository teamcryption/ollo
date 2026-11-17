/**
 * Mantel clock: a tambour case with an arched top on a plinth, a round dial
 * on its front and a glass door in a bezel, hinged on the dial's left. The
 * pointer's x swings the door open on a spring, the further right the wider.
 * At rest the door stands a little ajar, bright. The slider is the widest
 * swing.
 *
 * The pattern: one part answering a continuous input (aim).
 */
const {
  Cam, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, seg,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const W = 46, D = 26, ZS = 30, ZC = 34, R = 19, BW = 3.5, REST = 28;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.15);
  const doorPt = (u, w, a, r0) => [-r0 + (u + r0) * Math.cos(rad(a)), D + (u + r0) * Math.sin(rad(a)), ZC + w];
  const fp = [[-W - 6, -4, 0], [W + 6, D + 6, 0], [-W - 6, D + 6, 0], [W + 6, -4, 0], [0, D / 2, ZS + 32]];
  for (const a of [0, 60, 100, 140]) fp.push(doorPt(R, 0, a, R), doorPt(R, 0, a, R).map((q, i) => i === 2 ? q + R : q), doorPt(0, -R, a, R));
  fit(C, fp, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const vc = (x, y, z, r, n = 40) => { const pts = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); } return pts; };

  // the plinth
  const [pr, pi] = rings(-W - 6, -4, W + 6, D + 6, 3, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 6));

  // the case: an arch-topped profile drawn out along y
  const prof = [[-W, 6], [W, 6]];
  for (let i = 0; i <= 24; i++) { const x = W - (2 * W * i) / 24; prof.push([x, ZS + 32 * Math.sqrt(Math.max(0, 1 - (x / W) ** 2))]); }
  const at = (y) => prof.map(([x, z]) => P(x, y, z));
  const body = solid(g);
  body.sil.setAttribute("d", poly(hull(at(0).concat(at(D)))));
  body.cr.setAttribute("d", open(prof.slice(2).map(([x, z]) => P(x * 0.97, D, z - 1.2))));

  // the dial, its hands and twelve ticks
  mk("path", { d: poly(vc(0, D, ZC, R + 0.8)), class: "nf lo" }, g);
  mk("path", { d: poly(vc(0, D, ZC, R - 4)), class: "nf" }, g);
  let ticks = "";
  for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t); ticks += seg(P(c * (R - 6), D, ZC + s * (R - 6)), P(c * (R - 8), D, ZC + s * (R - 8))); }
  mk("path", { d: ticks, class: "nf lo" }, g);
  mk("path", { d: seg(P(0, D, ZC), P(-6, D, ZC + 7)) + seg(P(0, D, ZC), P(10, D, ZC + 3)), class: "nf" }, g);
  // the hinge
  mk("path", { d: poly(vc(-R - 1.5, D, ZC, 1.6, 12)), class: "nf" }, g);

  // the door: a bezel ring with a hole for the glass
  const door = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf lo" }, g);
  const th = spring(REST);
  let last = NaN;
  function ring(r, a, rev) {
    const pts = [];
    for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2 * (rev ? -1 : 1); pts.push(P(...doorPt(r * Math.cos(t), r * Math.sin(t), a, R))); }
    return pts;
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    door.setAttribute("d", poly(ring(R, a, false)) + poly(ring(R - BW, a, true)));
    edge.setAttribute("d", poly(ring(R - BW + 0.9, a, false)));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const moving = stepS(th, dt);
    draw(th.x);
    return moving;
  });
  bag.add(B.unregister);

  const cx = P(0, D, ZC)[0];
  function aim(t, label) {
    th.t = t;
    read.textContent = label ? Math.round(t) + "°" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(lerp(4, amp, clamp((sx - cx + 70) / 140, 0, 1)), true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "mantelclock",
  means: "A tambour mantel clock: the glass door over its dial swings open toward the pointer and eases back to ajar when it leaves.",
  rules: [1, 3, 5, 8],
  range: [60, 120, 140],
  tour: [[254, 174], [150, 172], [300, 214], null],
  mount,
});
