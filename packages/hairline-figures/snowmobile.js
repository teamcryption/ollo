/**
 * Snowmobile: a tracked tunnel under a long seat, a tapered hood with a
 * windshield and handlebars, and two skis on struts at the front. The pointer
 * over the sled throttles it: the whole machine pitches up onto the back of
 * its track, nose and skis in the air, higher the nearer the pointer is to the
 * nose. At rest it sits almost level, its windshield bright. The slider is how
 * far the nose lifts.
 *
 * The pattern: one continuous pitch on a spring; the hit is on the ground plane.
 */
const {
  Cam, facing, fit, hull, open, poly, proj, rrect, run, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, register, solid,
} = HL;

const MAX = 22, REST = 3, PX = -36;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.45);
  const tfA = (a) => (x, y, z) => { const c = Math.cos(a), s = Math.sin(a), dx = x - PX; return [PX + dx * c - z * s, y, dx * s + z * c]; };
  const box = [];
  for (const a of [0, rad(MAX * 1.5)]) for (const [x, z] of [[-36, 0], [38, 0], [38, 10], [-36, 18], [0, 30]]) for (const y of [-16, 16]) box.push(tfA(a)(x, y, z));
  fit(C, box, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const parts = [];
  // [foot, top, inner, z0, z1]: tapered solids, back to front
  const S = (x0, y0, x1, y1, r, tx0, ty0, tx1, ty1, tr, z0, z1) => ({
    foot: rrect(x0, y0, x1, y1, r, 4), top: rrect(tx0, ty0, tx1, ty1, tr, 4), inner: rrect(tx0 + 1, ty0 + 1, tx1 - 1, ty1 - 1, Math.max(0.5, tr - 1), 4), z0, z1, el: null,
  });
  const skiF = S(8, -16, 34, -11, 2.2, 8, -16, 34, -11, 2.2, 0, 1.6);
  const track = S(-36, -9, 6, 9, 4.5, -36, -9, 6, 9, 4.5, 0, 9);
  const seat = S(-34, -7, -6, 7, 3, -33, -6, -7, 6, 2.6, 9, 15);
  const hood = S(-10, -12, 28, 12, 6, -6, -9, 18, 9, 5, 7, 19);
  const shield = S(-2, -9, 4, 9, 2, -6, -8, -3, 8, 1.4, 19, 28);
  const skiN = S(8, 11, 34, 16, 2.2, 8, 11, 34, 16, 2.2, 0, 1.6);
  const order = [skiF, track, seat, hood, shield, skiN];
  const struts = mk("path", { class: "nf sil" }, g);
  for (const p of order) { p.el = solid(g); if (p === hood) p.bars = mk("path", { class: "nf sil" }, g); }
  struts.remove(); skiN.el.g.before(struts);
  let drawn = NaN;

  function draw(a) {
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const T = tfA(a), Q = (x, y, z) => P(...T(x, y, z)), at = (ring, z) => ring.map((q) => Q(q.u, q.v, z));
    for (const p of order) {
      p.el.sil.setAttribute("d", poly(hull(at(p.foot, p.z0).concat(at(p.top, p.z1)))));
      p.el.cr.setAttribute("d", open(at(run(p.inner, front), p.z1)));
    }
    let d = "";
    for (const y of [-13.5, 13.5]) d += seg(Q(20, y, 1.6), Q(14, y * 0.6, 9)) + seg(Q(34, y, 1.6), Q(38, y, 6));
    struts.setAttribute("d", d);
    hood.bars.setAttribute("d", seg(Q(-6, -12, 25), Q(-4, 12, 25)) + seg(Q(-3, 0, 19), Q(-5, 0, 25)));
  }

  const sp = spring(rad(REST));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let last = null;
  function aim(near) {
    const on = near !== null;
    sp.t = rad(on ? REST + (MAX - REST) * amp * (0.6 + 0.4 * near) : REST);
    shield.el.sil.classList.toggle("hi", !on);
    hood.el.sil.classList.toggle("hi", on);
    read.textContent = on ? Math.round((sp.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      last = x > -48 && x < 50 && Math.abs(y) < 30 ? clampN((x + 36) / 74) : null;
      aim(last);
    },
    leave: () => { last = null; aim(null); },
  }));
  const clampN = (v) => Math.max(0, Math.min(1, v));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { amp = v; aim(last); }, destroy: bag.dispose };
}

hairline({
  name: "snowmobile",
  means: "A snowmobile: the pointer over it throttles up and the sled pitches onto its track, skis in the air.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[258, 195], [136, 191], [285, 250], null],
  mount,
});
