/**
 * Cuckoo clock: a house-shaped clock hung on a wall board, a peaked roof, a
 * round face, a little door for the bird, two weights on chains and a
 * pendulum under the case. The pointer's x swings the pendulum toward it on
 * a spring; leaving lets it settle back to a slight rest swing. The bob is
 * the bright mark. The slider is the largest swing.
 *
 * The pattern: one part answering a continuous input (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, seg,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const PX = 30, PY = 12, PZ = 45, L = 34, BR = 6, REST = -14;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  const sw = (a) => [PX + (L + BR) * Math.sin(rad(a)), PY, PZ - (L + BR) * Math.cos(rad(a))];
  fit(C, [[-10, -6, 0], [70, -2, 0], [-10, -6, 122], [70, -2, 122], [54, 23, 88], [6, 23, 88], [30, 23, 104], sw(40), sw(-40)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const vc = (x, y, z, r, n = 28) => { const pts = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; pts.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); } return pts; };

  // the wall board
  const [wr, wi] = rings(-10, -6, 70, -2, 1.5, 0.8);
  put(solid(g), prism(P, front, wr, wi, 0, 122));

  // weights on chains, behind the pendulum
  for (const [wx, wz] of [[19, 14], [41, 22]]) {
    mk("path", { d: seg(P(wx, 6, PZ), P(wx, 6, wz + 12)), class: "lo nf" }, g);
    put(solid(g), prism(P, front, disc(wx, 6, 3), disc(wx, 6, 2), wz, wz + 12));
  }

  // the case
  const [cr, ci] = rings(10, 0, 50, 20, 3, 1.5);
  put(solid(g), prism(P, front, cr, ci, PZ, 88));
  mk("path", { d: poly(vc(30, 20.05, 64, 11)), class: "nf" }, g);
  mk("path", { d: seg(P(30, 20.1, 64), P(30, 20.1, 72)) + seg(P(30, 20.1, 64), P(35, 20.1, 61)), class: "nf" }, g);
  mk("path", { d: poly([P(26, 20.05, 78), P(34, 20.05, 78), P(34, 20.05, 85), P(26, 20.05, 85)]), class: "nf lo" }, g);

  // the roof: a ridge narrower than its eaves
  const foot = rrect(6, -3, 54, 23, 2, 4), top = rrect(28, -3, 32, 23, 1, 4), inner = rrect(29, -2, 31, 22, 0.5, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 88).concat(ringAt(P, top, 104)))), crease: open(ringAt(P, run(inner, front), 104)) });

  // the pendulum
  const rod = mk("path", { class: "nf" }, g), bob = mk("path", { class: "sil hi" }, g);
  const th = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const ex = PX + L * s, ez = PZ - L * c, w = 0.8;
    rod.setAttribute("d", poly([P(PX - w * c, PY, PZ - w * s), P(PX + w * c, PY, PZ + w * s), P(ex + w * c, PY, ez + w * s), P(ex - w * c, PY, ez - w * s)]));
    bob.setAttribute("d", poly(vc(PX + (L + BR * 0.6) * s, PY + 0.1, PZ - (L + BR * 0.6) * c, BR)));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const moving = stepS(th, dt);
    draw(th.x);
    return moving;
  });
  bag.add(B.unregister);

  const cx = P(PX, PY, PZ)[0];
  function aim(t, label) {
    th.t = t;
    read.textContent = label ? (t >= 0 ? "+" : "") + Math.round(t) + "°" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx]) => aim(clamp((sx - cx) / 45, -1, 1) * amp, true),
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "cuckooclock",
  means: "A cuckoo clock on a wall board: the pendulum swings toward the pointer and settles back to a slight lean when it leaves.",
  rules: [1, 3, 5, 8],
  range: [10, 28, 40],
  tour: [[214, 282], [150, 276], [200, 150], null],
  mount,
});
