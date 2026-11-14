/**
 * Waffle iron: a square iron on a low base, its lid hinged along the back
 * edge, a grid of waffle pockets on the lower plate. The pointer opens the
 * lid: the higher it stands over the iron, the wider the lid swings up on its
 * hinge, on a spring. At rest the lid sits ajar, bright. The slider is how
 * far the lid may open.
 *
 * The pattern: one part following the pointer (aim).
 */
const {
  Cam, clamp, fit, facing, hull, lerp, open, poly, prism, proj, rad, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 58, H = 12, T = 7, REST = 16, G = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, -8, H + D + 4], [W, -8, H + D + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the base and its lower plate
  const [br, bi] = rings(-4, -4, W + 4, D + 4, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(rrect(4, 4, W - 4, D - 4, 6, 4).map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  let gd = "";
  for (let i = 1; i < G; i++) {
    const x = 4 + ((W - 8) * i) / G, y = 4 + ((D - 8) * i) / G;
    gd += seg(P(x, 6, H), P(x, D - 6, H)) + seg(P(6, y, H), P(W - 6, y, H));
  }
  mk("path", { d: gd, class: "nf lo" }, g);
  // the hinge knuckles at the back
  for (const x of [10, W - 10]) {
    const [hr, hi] = rings(x - 5, -6, x + 5, 2, 3, 1);
    put(solid(g), prism(P, front, hr, hi, H - 2, H + 4));
  }
  // the lid: a thick plate turning on the hinge line y = 0, z = H
  const lid = mk("g", {}, g);
  const lsil = mk("path", { class: "sil hi" }, lid), lcr = mk("path", { class: "nf lo" }, lid), hdl = mk("path", {}, lid);
  const outer = rrect(-2, 0, W + 2, D + 2, 10, 4), inner = rrect(3, 5, W - 3, D - 3, 7, 4);
  const handle = rrect(W / 2 - 9, D + 1, W / 2 + 9, D + 9, 3, 3);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const L = (u, v, w) => P(u, v * c - w * s, H + 1 + v * s + w * c);
    const at = (ring, w) => ring.map((q) => L(q.u, q.v, w));
    lsil.setAttribute("d", poly(hull(at(outer, 0).concat(at(outer, T)))));
    lcr.setAttribute("d", poly(at(inner, a < 90 ? T : 0)));
    hdl.setAttribute("d", poly(hull(at(handle, T * 0.3).concat(at(handle, T * 0.8)))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const top = P(W / 2, D / 2, H)[1];
  function move([sx, sy]) {
    const t = clamp((top - sy + 40) / 120, 0, 1);
    ang.t = lerp(REST + 4, maxA, t);
    read.textContent = Math.round(ang.t) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "waffleiron",
  means: "A waffle iron on its base: the higher the pointer stands over it, the wider the lid swings up on its back hinge.",
  rules: [3, 5, 6, 8],
  range: [60, 95, 110],
  tour: [[200, 230], [200, 130], [200, 40], null],
  mount,
});
