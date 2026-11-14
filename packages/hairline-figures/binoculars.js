/**
 * Binoculars: a pair standing on their objectives, two barrels stepping in
 * to eyepieces, joined by a hinge bridge with a focus wheel on top. The
 * pointer's place across the ground opens or closes the hinge: the barrels
 * swing apart or together on a spring, and the read-out gives the eye width.
 * At rest the focus wheel is bright. The slider is how far the hinge opens.
 *
 * The pattern: one continuous value from the pointer (spring).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, lerp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 9, ER = 6, OZ = 24, EZ = 36, BZ0 = 13, BZ1 = 19, DMIN = 10.5, DMAX = 21, REST = 13;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 4.5);
  fit(C, [[-R, -DMAX - R, 0], [R, DMAX + R, 0], [R, -DMAX - R, 0], [-R, DMAX + R, 0], [0, -DMAX, EZ + 2], [0, DMAX, EZ + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const barrel = () => ({ o: solid(mk("g", {}, g)), e: null });
  const far = barrel(); far.e = solid(far.o.g);
  const bridge = solid(g), wheel = solid(g);
  const near = barrel(); near.e = solid(near.o.g);
  const d = spring(REST);
  let last = NaN;

  function drawBarrel(b, y) {
    put(b.o, prism(P, front, disc(0, y, R), disc(0, y, R - 1.5), 0, OZ));
    put(b.e, prism(P, front, disc(0, y, ER), disc(0, y, ER - 1.2), OZ, EZ));
  }
  function draw(v) {
    if (v === last) return;
    last = v;
    drawBarrel(far, -v);
    const [br, bi] = rings(-3, -v, 3, v, 2, 1);
    put(bridge, prism(P, front, br, bi, BZ0, BZ1));
    put(wheel, prism(P, front, disc(0, 0, 3.4, 20), disc(0, 0, 2.4, 20), BZ1, BZ1 + 3));
    drawBarrel(near, v);
  }
  // knurl marks round the focus wheel's top
  const knurl = mk("path", { class: "nf lo" }, g);

  const B = register(stage, (dt) => {
    const m = stepS(d, dt);
    draw(d.x);
    knurl.setAttribute("d", poly(ringAt(P, disc(0, 0, 1.2, 12), BZ1 + 3)));
    return m;
  });
  bag.add(B.unregister);

  function setTarget(t, on) {
    d.t = t;
    near.o.sil.classList.toggle("hi", on);
    near.e.sil.classList.toggle("hi", on);
    wheel.sil.classList.toggle("hi", !on);
    read.textContent = on ? Math.round(2 * t + 34) + " mm" : "rest";
    B.wake();
  }
  setTarget(REST, false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [, wy] = unproj(C, sx, sy, 0);
      const f = clamp(Math.abs(wy) / (DMAX + R + 10), 0, 1);
      setTarget(lerp(DMIN, lerp(DMIN + 2, DMAX, reach), f), true);
    },
    leave: () => setTarget(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "binoculars",
  means: "Binoculars standing on their lenses: the pointer's distance from the hinge swings the barrels apart or together.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[168, 246], [105, 277], [232, 120], null],
  mount,
});
