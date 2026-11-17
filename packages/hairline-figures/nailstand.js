/**
 * Nail lamp: a domed UV curing lamp on its base tray, with an arched opening
 * at the front for the hand. The pointer tilts the hood up on its back
 * hinge: the further it stands from the lamp, the higher the hood swings,
 * showing the cure pad under it. At rest the arched opening is bright.
 * The slider is how far the hood may tilt.
 */
const {
  Cam, fit, hull, poly, open, proj, rrect, rings, prism, facing, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 60, D = 52, BZ = 4, HZ = 24, MAXA = 0.62, REST = 0.06;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-18, -8, 0], [L + 8, D + 8, 0], [48, D, 60], [-16, 0, 26], [L + 8, D + 8, 26]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, L + 8, D + 6, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [pr, pi] = rings(10, 10, L - 6, D - 10, 8, 1.5);
  const pad = solid(g);
  put(pad, prism(P, front, pr, pi, BZ, BZ + 1.5));
  const hood = solid(g);
  const arch = mk("path", { class: "nf" }, g);
  const lens = mk("path", { class: "nf lo" }, g);
  const foot = rrect(0, 0, L, D, 14, 6), top = rrect(6, 5, L - 8, D - 5, 11, 6), inner = rrect(8, 7, L - 10, D - 7, 9, 6);
  const tilt = (a, x, y, z) => {
    const c = Math.cos(a), s = Math.sin(a), dz = z - BZ;
    return P(x * c - dz * s, y, BZ + x * s + dz * c);
  };
  const op = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = foot.map((q) => tilt(a, q.u, q.v, BZ)).concat(top.map((q) => tilt(a, q.u, q.v, HZ + BZ)));
    hood.sil.setAttribute("d", poly(hull(pts)));
    hood.cr.setAttribute("d", poly(inner.map((q) => tilt(a, q.u, q.v, HZ + BZ - 0.2))));
    const ap = [];
    for (let i = 0; i <= 16; i++) {
      const t = (i / 16) * Math.PI;
      const xx = L - 0.6 - 1.8 * Math.sin(t);
      ap.push(tilt(a, xx, D / 2 - 17 * Math.cos(t), BZ + 13 * Math.sin(t)));
    }
    arch.setAttribute("d", poly(ap));
    const lp = [];
    for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; lp.push(tilt(a, L / 2 + 6 * Math.cos(t), D / 2 + 6 * Math.sin(t), HZ + BZ - 0.1)); }
    lens.setAttribute("d", poly(lp));
  }
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);

  const mid = P(L / 2, D / 2, BZ + HZ / 2);
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - mid[0]) < 150 && Math.abs(p[1] - mid[1]) < 120;
    const o = inside ? clamp(Math.hypot(p[0] - mid[0], p[1] - mid[1]) / 60, 0.3, 1) : 0;
    op.t = inside ? Math.max(REST, o * MAXA * reach) : REST;
    const act = !!inside;
    if (act !== on) {
      on = act;
      arch.classList.toggle("hi", !act);
      hood.sil.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round((op.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "nailstand",
  means: "A UV nail lamp on its tray: the pointer tilts the domed hood up on its back hinge to show the cure pad beneath.",
  rules: [1, 3, 4, 5],
  range: [40, 80, 100],
  tour: [[219, 251], [150, 150], [290, 180], null],
  mount,
});
