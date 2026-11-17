/**
 * Carriage clock: a tall glass-sided case on a moulded base, a cornice on
 * top, a round dial behind the front glass and a loop handle hinged on two
 * posts. The pointer's x swings the handle on a spring, from folded back
 * flat to upright and over toward the front. At rest it lies folded back,
 * bright. The slider is how far forward it can fold.
 *
 * The pattern: one part answering a continuous input (aim).
 */
const {
  Cam, clamp, fit, facing, lerp, poly, prism, proj, rad, rings, seg,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const HW = 15, HD = 12, Z1 = 52, ZT = 57, ZH = 61, HU = 14, HH = 28, BAND = 4, REST = -78;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.15);
  const hp = (u, h, a) => [u, h * Math.sin(rad(a)), ZH + h * Math.cos(rad(a))];
  const fp = [[-HW - 4, -HD - 4, 0], [HW + 4, HD + 4, 0], [-HW - 4, HD + 4, 0], [HW + 4, -HD - 4, 0]];
  for (const a of [-80, -40, 0, 40, 80]) fp.push(hp(-HU, HH, a), hp(HU, HH, a), hp(0, HH + 4, a));
  fit(C, fp, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };

  // base, case and cornice
  box(-HW - 4, -HD - 4, HW + 4, HD + 4, 2.5, 1.2, 0, 4);
  box(-HW - 2, -HD - 2, HW + 2, HD + 2, 2, 1, 4, 8);
  box(-HW, -HD, HW, HD, 1.5, 1, 8, Z1);
  box(-HW - 2, -HD - 2, HW + 2, HD + 2, 2, 1, Z1, ZT);
  // glass panels: the front
  const fy = HD + 0.05;
  mk("path", { d: poly([P(-HW + 3, fy, 11), P(HW - 3, fy, 11), P(HW - 3, fy, Z1 - 3), P(-HW + 3, fy, Z1 - 3)]), class: "nf lo" }, g);
  // the dial and its hands
  const dial = []; for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; dial.push(P(9 * Math.cos(t), fy, 36 + 9 * Math.sin(t))); }
  mk("path", { d: poly(dial), class: "nf" }, g);
  mk("path", { d: seg(P(0, fy, 36), P(0, fy, 42)) + seg(P(0, fy, 36), P(5, fy, 34)), class: "nf" }, g);
  // the hinge posts
  for (const x of [-HU, HU]) box(x - 1.6, -1.6, x + 1.6, 1.6, 0.8, 0.5, ZT, ZH + 1);

  // the handle: a flat strap bent into a loop
  const out = [], inn = [];
  for (let i = 0; i <= 16; i++) {
    const t = Math.PI - (i / 16) * Math.PI, c = Math.cos(t), s = Math.sin(t);
    out.push([HU * c, HH - HU + HU * s]);
    inn.push([(HU - BAND) * c, HH - HU + (HU - BAND) * s]);
  }
  const loop = [[-HU, 0]].concat(out, [[HU, 0], [HU - BAND, 0]], inn.reverse(), [[-HU + BAND, 0]]);
  const handle = mk("path", { class: "sil hi" }, g);
  const th = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    handle.setAttribute("d", poly(loop.map(([u, h]) => P(...hp(u, h, a)))));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const moving = stepS(th, dt);
    draw(th.x);
    return moving;
  });
  bag.add(B.unregister);

  const cx = P(0, 0, ZH)[0];
  function aim(t, label) {
    th.t = t;
    read.textContent = label ? (t >= 0 ? "+" : "") + Math.round(t) + "°" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(lerp(-80, amp, clamp((sx - cx + 60) / 120, 0, 1)), true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "carriageclock",
  means: "A carriage clock: its loop handle swings up from folded back to upright and over toward the pointer, then folds back down.",
  rules: [1, 3, 5, 8],
  range: [20, 50, 80],
  tour: [[215, 80], [140, 100], [270, 110], null],
  mount,
});
