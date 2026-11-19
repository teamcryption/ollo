/**
 * Dough sheeter: a bakery sheeter, the roller housing standing in the middle
 * with a long belt table hinged to each side of it. The pointer over a side
 * folds that table up towards the housing and lays the other one flat, on one
 * spring per table. At rest the far table stands half folded, the near one
 * lies flat, and the roller gap on top of the housing is bright. The slider
 * is how far a table may fold.
 *
 * The pattern: a choice of side, picked on the plane of the flat tables,
 * which never moves; each table's angle is a spring.
 */
const {
  Cam, clamp, fit, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid, hull, rad,
} = HL;

const W0 = 2, W1 = 30, H = 12, Z = 24, L = 52, RA = [58, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, -H - L, Z], [32, H + L, Z], [0, 0, 0], [32, 0, 0], [16, 0, Z + L]], 200, 166);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  const wingL = mk("g", {}, g), body = mk("g", {}, g), wingR = mk("g", {}, g);
  // the housing on its foot, with the roller gap across its top
  put(solid(body), prism(P, front, ...rings(-2, -H - 2, 34, H + 2, 3, 1.2), 0, 6));
  put(solid(body), prism(P, front, ...rings(0, -H, 32, H, 4, 1.4), 6, Z + 16));
  const gap = mk("path", { class: "nf sil", d: seg(P(3, -2, Z + 16), P(29, -2, Z + 16)) + seg(P(3, 2, Z + 16), P(29, 2, Z + 16)) }, body);
  mk("path", { class: "nf lo", d: seg(P(32, -H + 3, Z + 4), P(32, -H + 3, Z + 10)) }, body);
  function wing(grp, dir) {
    const s = { plate: mk("path", { class: "sil" }, grp), belt: mk("path", { class: "nf lo" }, grp), sp: spring(0), drawn: NaN };
    s.draw = (a) => {
      if (Math.abs(a - s.drawn) < 0.05) return;
      s.drawn = a;
      const c = Math.cos(rad(a)), n = Math.sin(rad(a));
      const at = (x, d, t) => P(x, dir * (H + d * c + t * n), Z + d * n - t * c);
      const pts = [];
      for (const x of [W0, W1]) for (const d of [0, L]) for (const t of [0, 3]) pts.push(at(x, d, t));
      s.plate.setAttribute("d", poly(hull(pts)));
      s.belt.setAttribute("d", seg(at(W0 + 2, 6, 0), at(W1 - 2, 6, 0)) + seg(at(W0 + 2, L - 6, 0), at(W1 - 2, L - 6, 0)) + seg(at(16, 10, 0), at(16, L - 10, 0)));
    };
    return s;
  }
  const ws = [wing(wingL, -1), wing(wingR, 1)];
  ws[0].sp = spring(RA[0]); ws[1].sp = spring(RA[1]);

  const Lp = register(stage, (dt) => {
    let m = false;
    for (const w of ws) { m = stepS(w.sp, dt) || m; w.draw(w.sp.x); }
    return m;
  });
  bag.add(Lp.unregister);

  function set(side) {
    const top = 30 + 58 * reach;
    ws[0].sp.t = side === null ? RA[0] : side === 0 ? top : 0;
    ws[1].sp.t = side === null ? RA[1] : side === 1 ? top : 0;
    gap.classList.toggle("hi", side === null);
    ws[0].plate.classList.toggle("hi", side === 0);
    ws[1].plate.classList.toggle("hi", side === 1);
    read.textContent = side === null ? "rest" : side === 0 ? "left" : "right";
    Lp.wake();
  }
  let cur = null;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], Z);
      cur = x > -12 && x < 44 && Math.abs(y) < H + L + 6 && Math.abs(y) > 3 ? (y < 0 ? 0 : 1) : null;
      set(cur);
    },
    leave: () => { cur = null; set(null); },
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { reach = v; set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "doughsheeter",
  means: "A bakery dough sheeter: the belt table on the side the pointer is over folds up beside the rollers, the other lays flat.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[124, 222], [276, 146], [110, 230], null],
  mount,
});
