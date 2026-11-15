/**
 * Wheel stretcher: a trolley on four casters, a deck, a foot mattress and a
 * hinged back section. The pointer along the trolley is how far the back is
 * raised: toward the head end it tilts up on a spring, toward the foot it lies
 * flat. At rest the back sits a little raised and is the one bright part.
 * The slider is how quickly the back follows.
 *
 * The pattern: a continuous value on one angle; the hit is the floor plane.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, run, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const ZD = 34, BL = 50, MAXT = 1.2, REST = 0.32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-54, -22, 0], [54, 22, 0], [54, -22, 0], [-54, 22, 0], [-54, -20, ZD + 6], [-BL * Math.cos(MAXT) - 5, 20, ZD + 6 + BL * Math.sin(MAXT)], [-BL * Math.cos(MAXT) - 5, -20, ZD + 6 + BL * Math.sin(MAXT)]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  for (const [x, y] of [[-46, -14], [46, -14], [-46, 14], [46, 14]]) {
    place(flatDot(g, C, 1.6, "dot off"), P(x, y, 0));
    const [r, i] = rings(x - 3, y - 2.5, x + 3, y + 2.5, 2.4, 0.8);
    put(solid(g), prism(P, front, r, i, 0.8, 5));
    const [pr] = rings(x - 1.6, y - 1.6, x + 1.6, y + 1.6, 1.5, 0.5);
    put(solid(g), prism(P, front, pr, null, 5, ZD - 4));
  }
  const [dr, di] = rings(-52, -20, 52, 20, 5, 1.6);
  put(solid(g), prism(P, front, dr, di, ZD - 4, ZD));
  const back = solid(g);
  const [fr, fi] = rings(1, -18, 50, 18, 5, 1.6);
  put(solid(g), prism(P, front, fr, fi, ZD, ZD + 6));

  // the back section, in its own (u along the back from the hinge, v across) frame
  const RING = rrect(0, -18, BL, 18, 5, 4), INNER = rrect(1.6, -16.4, BL - 1.6, 16.4, 3.4, 4);
  const at = (q, w, th) => {
    const c = Math.cos(th), s = Math.sin(th);
    return P(-q.u * c + w * s, q.v, ZD + q.u * s + w * c);
  };
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const th = sp.x;
    if (Math.abs(th - drawn) < 1e-4) return;
    drawn = th;
    const pts = RING.map((q) => at(q, 0, th)).concat(RING.map((q) => at(q, 6, th)));
    back.sil.setAttribute("d", poly(hull(pts)));
    const face = (q) => ({ ...q, nu: -q.nu * Math.cos(th), nv: q.nv });
    const keep = INNER.map(face).filter(front).length ? run(INNER.map(face), front) : [];
    back.cr.setAttribute("d", keep.length ? open(keep.map((q) => at(q, 6, th))) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over === null ? REST : clamp((20 - over) / 70, 0, 1) * MAXT;
    back.sil.classList.add("hi");
    read.textContent = over === null ? "rest" : Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) > 80 || Math.abs(y) > 60 ? null : x;
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
  name: "ventilator",
  means: "A wheeled stretcher: the hinged back section tilts up as the pointer moves toward the head end, and lies flat at the foot.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[258, 260], [186, 224], [128, 195], null],
  mount,
});
