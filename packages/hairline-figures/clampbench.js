/**
 * Folding workbench: a split top of two long jaws, the front one on screws,
 * standing on two crossed pairs of legs. The pointer's nearness unfolds it:
 * the legs scissor wide, the top rises, and the front jaw winds open from
 * the back one. At rest it stands half folded, the front jaw bright. The
 * slider is how far it unfolds.
 *
 * The pattern: one part answering the pointer's nearness (spring).
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, ringAt, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 74, L = 46, H0 = 20, H1 = 42, J0 = 1, J1 = 12, REST = 0.15, XS = [8, W - 8];
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, -32, 0], [W, -32, 0], [0, 50, 0], [W, 50, 0], [0, 0, H1 + 5], [W, 24, H1 + 5]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const backLegs = mk("path", { class: "sil" }, g), frontLegs = mk("path", { class: "sil" }, g);
  const ties = mk("path", { class: "nf lo" }, g);
  const back = solid(g), jaw = solid(g), screws = mk("path", { class: "nf lo" }, g);
  jaw.sil.classList.add("hi");
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(b[0], b[1], r), b[2]))));

  const sp = spring(REST);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const h = lerp(H0, H1, p), f = Math.sqrt(L * L - h * h) * 0.6, j = lerp(J0, J1, p), mid = 11;
    let bl = "", fl = "", t = "";
    for (const x of XS) {
      bl += rod([x, mid + f, h], [x, mid - f, 0], 1.8);
      fl += rod([x, mid - f, h], [x, mid + f, 0], 1.8);
    }
    t += seg(P(XS[0], mid - f, 1), P(XS[1], mid - f, 1)) + seg(P(XS[0], mid + f, 1), P(XS[1], mid + f, 1));
    backLegs.setAttribute("d", bl);
    frontLegs.setAttribute("d", fl);
    ties.setAttribute("d", t);
    put(back, prism(P, front, rrect(0, 0, W, 10, 2.5, 4), rrect(1.2, 1.2, W - 1.2, 8.8, 1.5, 4), h, h + 6));
    put(jaw, prism(P, front, rrect(0, 10 + j, W, 20 + j, 2.5, 4), rrect(1.2, 11.2 + j, W - 1.2, 18.8 + j, 1.5, 4), h, h + 6));
    screws.setAttribute("d", seg(P(4, 20 + j, h + 3), P(-6, 20 + j, h + 3)) + seg(P(W - 4, 20 + j, h + 3), P(W + 6, 20 + j, h + 3)));
    read.textContent = Math.round(p * 100) + "%";
  }
  draw(sp.x);
  read.textContent = "rest";

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const c = P(W / 2, 11, 25);
  let here = false, near = 0;
  function aim([sx, sy]) { here = true; near = clamp(1 - Math.hypot(sx - c[0], (sy - c[1]) * 1.6) / 240, 0, 1); sp.t = REST + (reach - REST) * near; B.wake(); }
  function leave() { here = false; sp.t = REST; B.wake(); }
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (here) { sp.t = REST + (reach - REST) * near; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "clampbench",
  means: "A folding workbench: the nearer the pointer, the wider its legs scissor open, the higher its top and the wider its jaw.",
  rules: [3, 5, 8, 9],
  range: [0.4, 1, 1],
  tour: [[186, 138], [145, 91], [244, 188], null],
  mount,
});
