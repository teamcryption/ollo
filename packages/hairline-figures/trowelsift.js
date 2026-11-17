/**
 * Finds tray: a shallow tray of three compartments on a pivot post, sherds
 * lying in it. At rest it sits almost level and one sherd is bright. The
 * pointer tips the tray toward whichever end it stands over, the rim taking
 * the bright. The slider is how far it tips.
 *
 * The pattern: one part tilting toward the pointer.
 */
const { Cam, fillet, fit, facing, hull, poly, prism, proj, rings, rrect, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, seg } = HL;

const V = [0.612, 0.612, 0.5], L = 104, D = 64, Z0 = 22, REST = 4;
const SH = [[18, 24, 0], [20, 44, 1.2], [52, 32, 2.2], [86, 22, 0.6], [84, 42, 3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, Z0 - 18], [L, D, Z0 - 18], [L, 0, Z0 + 26], [0, D, Z0 + 26], [36, 12, 0], [70, 52, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  function slab(s, ring, inner, f, w0, w1) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    const c0 = f(0, 0, w0), c1 = f(0, 0, w1), vis = (c1[0] - c0[0]) * V[0] + (c1[1] - c0[1]) * V[1] + (c1[2] - c0[2]) * V[2] > 0;
    if (inner) s.cr.setAttribute("d", poly(inner.map((q) => P(...f(q.u, q.v, vis ? w1 : w0)))));
  }
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(34, 14, 70, 50, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [qr, qi] = rings(46, 26, 58, 38, 4, 1.5);
  put(solid(g), prism(P, front, qr, qi, 4, Z0 - 1));
  const tray = solid(g), divs = mk("path", { class: "nf lo" }, g);
  const ring = rrect(0, 0, L, D, 7, 6), inner = rrect(4.5, 4.5, L - 4.5, D - 4.5, 4, 6);
  const sherds = SH.map(([x, y, k]) => {
    const pts = [0, 1, 2, 3, 4].map((i) => { const t = i * 1.257 + k, r = 6 + ((i * 7 + k * 3) % 4); return [x + r * Math.cos(t) * 1.2, y + r * Math.sin(t) * 0.8]; });
    return { s: mk("path", { class: "sil" }, g), pts: fillet(pts, pts.map(() => 1.6), 3) };
  });
  const ang = spring(REST);
  let last = NaN, act = false;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
    const f = (u, v, w) => { const d = u - L / 2; return [L / 2 + d * c - w * s, v, Z0 + d * s + w * c]; };
    slab(tray, ring, inner, f, 0, 9);
    divs.setAttribute("d", [36, 69].map((u) => seg(P(...f(u, 4.5, 9)), P(...f(u, D - 4.5, 9)))).join(""));
    for (const sh of sherds) sh.s.setAttribute("d", poly(hull(sh.pts.map(([u, v]) => P(...f(u, v, 2))).concat(sh.pts.map(([u, v]) => P(...f(u, v, 3.6)))))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function light(on) {
    act = on;
    tray.sil.classList.toggle("hi", on);
    sherds[2].s.classList.toggle("hi", !on);
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z0 + 9);
    const inside = x > -12 && x < L + 12 && y > -12 && y < D + 12;
    const t = Math.max(-1, Math.min(1, (x - L / 2) / (L / 2)));
    ang.t = inside ? -t * max : REST;
    if (inside !== act) light(inside);
    read.textContent = inside ? "tilt " + Math.round(Math.abs(t * max)) : "rest";
    B.wake();
  }
  function leave() { ang.t = REST; light(false); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "trowelsift",
  means: "A finds tray of sherds on a pivot post: the tray tips toward the end the pointer stands over.",
  rules: [1, 3, 5, 8],
  range: [6, 14, 20],
  tour: [[132, 100], [200, 136], [270, 166], null],
  mount,
});
