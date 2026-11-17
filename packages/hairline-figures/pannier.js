/**
 * Pannier: a bike bag hung on a rack rail by two hooks, its flap folded over
 * the top and down the front with a buckle strap. The pointer opens it: the
 * flap swings up and back on its hinge to show the bag's mouth. At rest the
 * flap is bright. The slider is how far the flap opens.
 *
 * The pattern: one part on a hinge, a discrete open or shut on the 700ms ease.
 */
const {
  Cam, fillet, fit, facing, poly, prism, proj, rad, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 26, H = 58, DROP = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-8, -4, 0], [W + 8, D + 4, 0], [W + 8, -4, 0], [-8, D + 4, 0], [0, -DROP, H + D + 8], [W, 0, H + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rack rail and its hooks, behind the bag
  const [rr, ri] = rings(-8, -2, W + 8, 2, 1.5, 0.6);
  put(solid(g), prism(P, front, rr, ri, H + 8, H + 11));
  for (const x of [12, W - 12]) mk("path", { class: "nf sil", d: seg(P(x, 1, H), P(x, 1, H + 10)) }, g);
  const [br, bi] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const mouth = mk("path", { class: "nf", d: poly(ringAt(P, rings(4, 4, W - 4, D - 4, 5, 1)[0], H)) }, g);
  const top = mk("path", { class: "sil" }, g), drop = mk("path", { class: "sil" }, g), strap = mk("path", { class: "nf" }, g);
  const open = tween(0.08);
  let last = NaN;

  // a point on the flap, (x, s) with s running from the hinge across the top and then down the front
  function flapPt(x, s, a) {
    const ly = Math.min(s, D + 1.5), lz = s > D + 1.5 ? -(s - D - 1.5) : 0;
    const c = Math.cos(a), n = Math.sin(a);
    return P(x, -1 + ly * c - (lz + 1.5) * n + 1.5 * n, H + 1.5 + ly * n + lz * c);
  }
  function draw(o) {
    if (o === last) return;
    last = o;
    const a = rad(118) * o * reach;
    const panel = (s0, s1) => poly(fillet([flapPt(-1, s0, a), flapPt(W + 1, s0, a), flapPt(W + 1, s1, a), flapPt(-1, s1, a)], [2, 2, 5, 5], 4));
    top.setAttribute("d", panel(0, D + 1.5));
    drop.setAttribute("d", panel(D + 1.5, D + 1.5 + DROP));
    strap.setAttribute("d", poly(fillet([flapPt(W / 2 - 5, D + 4, a), flapPt(W / 2 + 5, D + 4, a), flapPt(W / 2 + 5, D + DROP + 6, a), flapPt(W / 2 - 5, D + DROP + 6, a)], [1, 1, 1, 1], 3)));
    // a flap past upright paints behind the mouth
    if (a > rad(70)) mouth.after(top, drop, strap); else g.append(top, drop, strap);
  }

  const B = register(stage, (_dt, now) => { draw(tval(open, now)); return !tdone(open, now); });
  bag.add(B.unregister);

  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(open, v ? 1 : 0.08, performance.now(), 0);
    top.classList.toggle("hi", !v); drop.classList.toggle("hi", !v);
    mouth.classList.toggle("hi", v);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], H / 2); set(x > -20 && x < W + 20 && y > -30 && y < D + 40); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pannier",
  means: "A bike pannier hung on a rack rail: the pointer opens it, and the flap swings up and back to show the bag's mouth.",
  rules: [1, 5, 6, 8],
  range: [0.5, 1, 1],
  tour: [[189, 155], [230, 200], [160, 230], null],
  mount,
});
