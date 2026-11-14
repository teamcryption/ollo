/**
 * Skeleton model: a teaching skeleton on a stand, skull, ribcage, spine,
 * pelvis, arms and legs. It turns on its stand to face the pointer, held
 * to a clamped arc. At rest it stands a little turned away, its skull
 * bright. The slider is how far it may turn.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, seg, unproj, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 18, FACE = 45, ZB = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-24, -24, 0], [24, 24, 0], [24, -24, 0], [-24, 24, 0], [0, 0, 124]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-22, -22, 22, 22, 22, 2);
  put(solid(g), prism(P, front, br, bi, 0, ZB));
  const skel = mk("g", {}, g);
  const pole = mk("path", { class: "sil nf" }, skel);
  const legs = mk("path", { class: "sil nf" }, skel), pelvis = mk("path", { class: "sil" }, skel);
  const spine = mk("path", { class: "sil nf" }, skel), armB = mk("path", { class: "sil nf" }, skel);
  const cage = mk("path", { class: "sil" }, skel), ribs = mk("path", { class: "lo nf" }, skel);
  const armF = mk("path", { class: "sil nf" }, skel), skull = mk("path", { class: "sil" }, skel), jaw = mk("path", { class: "lo nf" }, skel);
  skull.classList.add("hi");

  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const th = rad(sp.x);
    if (th === last) return;
    last = th;
    const f = [Math.cos(th), Math.sin(th)], s = [-Math.sin(th), Math.cos(th)];
    const L = (a, b, z) => P(a * s[0] + b * f[0], a * s[1] + b * f[1], z);
    const ell = (rs, rf, z, t0 = 0, t1 = 2 * Math.PI, n = 20) => { const o = []; for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * (i / n); o.push(L(rs * Math.cos(t), rf * Math.sin(t), z)); } return o; };
    pole.setAttribute("d", seg(L(0, -9, ZB), L(0, -9, 52)) + seg(L(0, -9, 52), L(0, -2, 52)));
    let d = "";
    for (const k of [-1, 1]) d += open([L(7 * k, 0, 46), L(8 * k, 1, 25), L(8 * k, 0, ZB + 3), L(8 * k, 7, ZB + 1)]);
    legs.setAttribute("d", d);
    const pv = [];
    for (const [rs, rf, z] of [[6, 3, 44], [11, 5, 49], [10, 4, 53]]) pv.push(...ell(rs, rf, z));
    pelvis.setAttribute("d", poly(hull(pv)));
    spine.setAttribute("d", open([L(0, -3, 54), L(0, -4, 62), L(0, -3, 70)]) + open([L(0, -2, 96), L(0, -1, 102)]));
    const arm = (k) => open([L(15 * k, 0, 93), L(18 * k, 2, 72), L(19 * k, 6, 55), L(19 * k, 8, 49)]);
    const nearR = s[0] + s[1] > 0; // +side faces the viewer
    armB.setAttribute("d", arm(nearR ? -1 : 1));
    armF.setAttribute("d", arm(nearR ? 1 : -1));
    const cg = [];
    for (const [rs, rf, z] of [[10, 7, 68], [13, 9, 78], [14, 9, 88], [11, 7, 96]]) cg.push(...ell(rs, rf, z));
    cage.setAttribute("d", poly(hull(cg)));
    let rb = "";
    for (const [rs, rf, z] of [[12, 8.5, 75], [13.5, 9, 81], [13.5, 9, 87], [12, 8, 92]]) rb += open(ell(rs - 0.5, rf - 0.5, z, 0.25, Math.PI - 0.25, 12));
    rb += seg(L(0, 7, 70), L(0, 8.5, 93));
    ribs.setAttribute("d", rb);
    const sk = [];
    for (let i = 0; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI; sk.push(...ell(9 * Math.cos(a), 10 * Math.cos(a), 112 + 9 * Math.sin(a), 0, 2 * Math.PI, 16)); }
    sk.push(...ell(5, 4, 101, 0, 2 * Math.PI, 12).map((q, i) => q), L(0, 8, 101));
    skull.setAttribute("d", poly(hull(sk)));
    jaw.setAttribute("d", open(ell(6, 7.5, 104, 0.2, Math.PI - 0.2, 10)) + open(ell(3, 9.6, 110, 0.9, 1.3, 3)) + open(ell(3, 9.6, 110, 1.85, 2.25, 3)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    let a = (Math.atan2(y, x) * 180) / Math.PI - FACE;
    a = ((a + 540) % 360) - 180;
    const lim = 40 + reach;
    sp.t = FACE + clamp(a, -lim, lim);
    read.textContent = Math.round(sp.t - FACE) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "anatomymodel",
  means: "A teaching skeleton on its stand turns to face the pointer, skull first, held to a clamped arc.",
  rules: [1, 3, 5, 8],
  range: [0, 30, 60],
  tour: [[300, 266], [100, 266], [200, 290], null],
  mount,
});
