/**
 * Rocking chair: a slatted rocking chair with a cushion on a porch deck, a
 * small round side table with a cup beside it. The pointer is the side the
 * chair should lean to: it rocks on its runners toward the pointer's side on
 * a spring, further the further out the pointer is, and its cushion is
 * bright. At rest the chair sits a little tipped back and the cup is the
 * bright mark. The slider is how quickly it follows.
 *
 * The pattern: a continuous angle (terrain's spring, on one number); the hit
 * is on the deck's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 70, MAX = 14, REST = -3, TX = 0, TY = -44;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-62, -62, -4], [56, 30, -4], [56, -62, -4], [-62, 30, -4], [-34, 0, 66], [30, 0, 66]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-62, -62, 56, 30, 3, 1.5);
  put(solid(g), prism(P, front, dr, di, -4, 0));
  mk("path", { class: "nf lo", d: [-44, -26, -8, 10].map((y) => seg(P(-60, y, 0), P(54, y, 0))).join("") }, g);
  // the side table and its cup, behind the chair
  const at = (r) => r.map((q) => ({ ...q, u: q.u + TX, v: q.v + TY }));
  put(solid(g), prism(P, front, at(circ(6, 32)), at(circ(5, 32)), 0, 1.5));
  put(solid(g), prism(P, front, at(circ(1.6, 16)), null, 1.5, 28));
  put(solid(g), prism(P, front, at(circ(12, 48)), at(circ(10.8, 48)), 28, 30));
  const cup = solid(g);
  put(cup, prism(P, front, at(circ(3, 24)).map((q) => ({ ...q, u: q.u + 3, v: q.v + 2 })), at(circ(2.3, 24)).map((q) => ({ ...q, u: q.u + 3, v: q.v + 2 })), 30, 35));

  const farL = mk("path", { class: "nf sil" }, g), back = solid(g), seat = solid(g), cush = solid(g), nearL = mk("path", { class: "nf sil" }, g);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });

  function draw(deg) {
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
    const T = (x, y, z) => { const dz = z - R; return P(R * a + x * c + dz * s, y, R - x * s + dz * c); };
    const lines = (y) => {
      const arc = (r) => open(Array.from({ length: 17 }, (_, i) => { const t = -0.5 + i / 16; return T(r * Math.sin(t), y, R - r * Math.cos(t)); }));
      const foot = (x) => R - Math.sqrt(R * R - x * x) + 2.5;
      return arc(R) + arc(R - 2.5) + seg(T(10, y, foot(10)), T(10, y, 38)) + seg(T(-12, y, foot(-12)), T(-12, y, 24))
        + seg(T(-13, y, 24), T(-21, y, 64)) + seg(T(-15, y, 39), T(13, y, 38));
    };
    farL.setAttribute("d", lines(-12));
    nearL.setAttribute("d", lines(12));
    const box = (el, x0, x1, y0, y1, z0, z1, r, lean = 0) => {
      const pts = [];
      for (const z of [z0, z1]) for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]) pts.push(T(x - lean * (z - z0), y, z));
      const h = hull(pts);
      el.sil.setAttribute("d", poly(fillet(h, h.map(() => r), 3)));
      return T;
    };
    box(back, -16, -13, -11, 11, 28, 62, 2, 0.2);
    back.cr.setAttribute("d", [40, 51].map((z) => seg(T(-13 - 0.2 * (z - 28), -10, z), T(-13 - 0.2 * (z - 28), 10, z))).join(""));
    box(seat, -14, 12, -13, 13, 21, 24, 2);
    box(cush, -12, 10, -11, 11, 24, 28, 4);
    cush.cr.setAttribute("d", open([T(10, -9, 28), T(10, 9, 28), T(-10, 9, 28)]));
  }

  let drawn = NaN;
  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    if (!(Math.abs(sp.x - drawn) <= 0.01)) { drawn = sp.x; draw(sp.x); }
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over == null ? REST : clamp(over / 40, -1, 1) * MAX;
    cush.sil.classList.toggle("hi", over != null);
    cup.sil.classList.toggle("hi", over == null);
    read.textContent = over == null ? "rest" : "rock " + Math.round(Math.abs(sp.t)) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.hypot(x, y + 10) < 90 ? x : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "rockingchair",
  means: "A rocking chair on a porch beside a side table: it rocks toward the side the pointer is on.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[110, 165], [183, 200], [245, 230], null],
  mount,
});
