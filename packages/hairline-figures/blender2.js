/**
 * Juice press: a lever citrus press. A base plate, a ribbed cone in its cup,
 * a post at the back and a long lever hinged on it, carrying the press bowl.
 * The pointer moving down across the press brings the lever down on a spring
 * until the bowl closes over the cone. At rest the lever stands raised and its
 * knob is bright; pressed home, the bowl takes the bright.
 *
 * The pattern: a continuous pull (spring) read from the ground plane, which
 * never moves; the arm and bowl turn about the hinge in the x–z plane.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS, clamp, hull, poly, open, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 25, HZ = 42, ARM = 52, CUP = 25, UP = 60;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  const ue = rad => [HX - ARM * Math.cos(rad), 0, HZ + ARM * Math.sin(rad)];
  fit(C, [[-26, -16, 0], [32, 16, 0], [-14, 14, 0], ue(UP * Math.PI / 180), [HX - ARM - 4, 0, HZ], [HX - CUP + 14, 14, HZ + CUP * Math.sin(UP * Math.PI / 180) + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [bR, bI] = rings(-24, -16, 32, 16, 6, 1.6);
  put(solid(g), prism(P, front, bR, bI, 0, 3.5));
  put(solid(g), prism(P, front, disc(0, 0, 15, 40), disc(0, 0, 13.6, 40), 3.5, 13));
  // the ribbed cone
  const cone = solid(g), base = circ(9, 32).map((q) => P(q.u, q.v, 13)), apex = P(0, 0, 25);
  cone.sil.setAttribute("d", poly(hull(base.concat([apex]))));
  let ribs = ""; for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + 0.3; if (Math.cos(a) + Math.sin(a) > -0.3) ribs += seg(P(9 * Math.cos(a), 9 * Math.sin(a), 13), apex); }
  cone.cr.setAttribute("d", ribs);
  put(solid(g), prism(P, front, rings(HX - 4, -5, HX + 5, 5, 2.5, 0.8)[0], rings(HX - 4, -5, HX + 5, 5, 2.5, 0.8)[1], 3.5, HZ + 3));
  const lever = mk("g", {}, g);
  const bowl = solid(lever), arm = solid(lever), knob = solid(lever);

  // local shapes, in (along the arm from the hinge, y, height above the arm)
  const ringPts = (cx, r, h, n = 28) => circ(r, n).map((q) => [cx + q.u, q.v, h]);
  const box = (a0, a1, w, h0, h1) => { const o = []; for (const h of [h0, h1]) for (const [a, y] of [[a0, -w], [a1, -w], [a1, w], [a0, w]]) o.push([a, y, h]); return o; };
  const sp = spring(1, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const th = t * UP * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
    const W = ([a, y, h]) => P(HX - a * c + h * s, y, HZ + a * s + h * c);
    const S = (pts) => poly(hull(pts.map(W)));
    arm.sil.setAttribute("d", S(box(-3, ARM, 3, -1.5, 2.5)));
    arm.cr.setAttribute("d", open([[2, 0, 2.5], [ARM - 4, 0, 2.5]].map(W)));
    bowl.sil.setAttribute("d", S(ringPts(CUP, 13, -1.5).concat(ringPts(CUP, 10, -13))));
    bowl.cr.setAttribute("d", poly(ringPts(CUP, 10, -13).map(W)));
    knob.sil.setAttribute("d", S(ringPts(ARM, 4.5, -2, 16).concat(ringPts(ARM, 4.5, 4, 16))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(t) {
    sp.t = t;
    const home = t < 0.2;
    knob.sil.classList.toggle("hi", !home);
    bowl.sil.classList.toggle("hi", home);
    read.textContent = t < 1 ? "press " + Math.round((1 - t) * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -60 || x > 50 || y < -60 || y > 40) return set(1);
      set(clamp(1 - (x + y + 40) / 60, 0, 1));
    },
    leave: () => set(1),
  }));
  bag.add(() => svg.replaceChildren());
  set(1);
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "blender2",
  means: "A lever citrus press: the pointer moving down across it pulls the lever down until the bowl closes over the cone.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[213, 169], [204, 226], [213, 275], null],
  mount,
});
