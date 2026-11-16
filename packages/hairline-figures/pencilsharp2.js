/**
 * Eraser: a battery electric eraser standing in its charging dock, a slim
 * barrel with a collar and the eraser strip poking from its tip. Over the dock
 * the eraser tilts out towards you, ready to pick up. At rest it leans a
 * little in the dock and the eraser tip is bright. The slider is the tilt.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const DX = 26, DY = 26, DZ = 7, CX = 13, CY = 11, R = 5.5, BL = 40, CL = 8, TL = 6, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = 20 + value / 3;
  const C = Cam(45, 0.5, 4.2);
  const ex = (a, d) => [CX, CY + d * Math.sin(rad(a)), DZ + d * Math.cos(rad(a))];
  fit(C, [[0, 0, 0], [DX, 0, 0], [0, DY, 0], [DX, DY, 0], ex(REST, BL + TL), ex(50, BL + TL + 4)], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const dock = solid(g);
  const [dr, di] = rings(0, 0, DX, DY, 6, 1.5);
  put(dock, prism(P, front, dr, di, 0, DZ));
  const body = solid(g), collar = solid(g), tip = solid(g);

  // a circle of the barrel at distance d along it, tilted by a about the dock's x axis
  function circle(a, d, r) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), out = [];
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2, u = r * Math.cos(t), v = r * Math.sin(t);
      out.push(P(CX + u, CY + v * c + d * s, DZ - v * s + d * c));
    }
    return out;
  }
  const tube = (el, a, d0, d1, r0, r1) => {
    const top = circle(a, d1, r1);
    el.sil.setAttribute("d", poly(hull(circle(a, d0, r0).concat(top))));
    el.cr.setAttribute("d", poly(top));
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    tube(body, a, -4, BL, R, R);
    tube(collar, a, BL, BL + CL, R, 3.2);
    tube(tip, a, BL + CL, BL + CL + TL, 1.6, 1.6);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the ground plane over the dock's footprint, which never moves
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, DZ);
    return x > -8 && x < DX + 8 && y > -8 && y < DY + 20;
  }

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? tilt : REST, performance.now(), 0);
    tip.sil.classList.toggle("hi", !on);
    body.sil.classList.toggle("hi", on);
    read.textContent = on ? "lift" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = clamp(20 + v / 3, 20, 50); if (act) { tset(ang, tilt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "pencilsharp2",
  means: "An electric eraser in its charging dock: over the dock the eraser tilts out towards you, ready to pick up.",
  rules: [1, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[195, 219], [215, 200], [205, 250], null],
  mount,
});
