/**
 * Commode chair: four legs, a seat with its pan opening, a backrest, two arm
 * rails, and a hinged lid over the seat. The pointer near the chair lifts the
 * lid on a spring, more the closer it comes; away it settles back. At rest the
 * lid stands slightly ajar and is the one bright part.
 * The slider is how quickly the lid follows.
 *
 * The pattern: a continuous value on one angle; the hit is the floor plane.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, run, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const ZS = 26, LL = 31.5, MAXT = 1.5, REST = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-20, -20, 0], [20, 20, 0], [20, -20, 0], [-20, 20, 0], [-20, -20, 58], [-20, 20, 58], [18, -18, 48], [18, 18, 48]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  for (const [x, y] of [[-15, -15], [15, -15], [-15, 15], [15, 15]]) {
    place(flatDot(g, C, 1.2, "dot off"), P(x, y, 0));
    const [r] = rings(x - 1.6, y - 1.6, x + 1.6, y + 1.6, 1.5, 0.5);
    put(solid(g), prism(P, front, r, null, 0, ZS));
  }
  const [br, bi] = rings(-19, -17, -16, 17, 1.4, 0.6);
  put(solid(g), prism(P, front, br, bi, ZS, ZS + 30));
  const [sr, si] = rings(-17, -17, 17, 17, 4, 1.4);
  put(solid(g), prism(P, front, sr, si, ZS - 3, ZS));
  mk("path", { class: "nf lo", d: poly(circ(9, 32).map((q) => P(q.u + 1, q.v, ZS))) }, g);
  const arm = (y0, y1) => {
    const [pr] = rings(11, y0 + 0.5, 14, y1 - 0.5, 1.2, 0.5);
    put(solid(g), prism(P, front, pr, null, ZS, ZS + 16));
    const [ar, ai] = rings(-16, y0, 16, y1, 1.6, 0.7);
    put(solid(g), prism(P, front, ar, ai, ZS + 16, ZS + 19));
  };
  arm(-18, -14.5);
  const lid = solid(g);
  arm(14.5, 18);

  const RING = rrect(0, -14, LL, 14, 6, 4), INNER = rrect(1.4, -12.6, LL - 1.4, 12.6, 4.6, 4);
  const at = (q, w, th) => {
    const c = Math.cos(th), s = Math.sin(th);
    return P(-14 + q.u * c - w * s, q.v, ZS + q.u * s + w * c);
  };
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const th = sp.x;
    if (Math.abs(th - drawn) < 1e-4) return;
    drawn = th;
    lid.sil.setAttribute("d", poly(hull(RING.map((q) => at(q, 0, th)).concat(RING.map((q) => at(q, 4.2, th))))));
    const face = INNER.map((q) => ({ ...q, nu: q.nu * Math.cos(th) }));
    lid.cr.setAttribute("d", face.some(front) ? open(run(face, front).map((q) => at(q, 4.2, th))) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over === null ? REST : clamp(1.25 - over / 40, 0, 1) * MAXT;
    lid.sil.classList.add("hi");
    read.textContent = over === null ? "rest" : Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > 70 ? null : r;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "wheelchair2",
  means: "A bedside commode chair: its hinged lid swings up as the pointer comes near, and settles back ajar as it leaves.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[58, 249], [222, 277], [211, 249], null],
  mount,
});
