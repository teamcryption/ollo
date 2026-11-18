/**
 * Bench shear: a cast body bolted to a base plate, a fixed lower blade along
 * its front and a long lever pinned at the back that carries the upper blade.
 * Over the shear the lever swings down and the upper blade closes past the
 * lower one. At rest the lever stands raised, bright. The slider is how far
 * the lever travels.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

function box(g) { const grp = mk("g", {}, g); return { g: grp, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp) }; }
function drawBox(P, el, b, T) {
  const [x0, x1, y0, y1, z0, z1] = b, pts = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(...T([x, y, z])));
  el.sil.setAttribute("d", poly(hull(pts)));
  el.cr.setAttribute("d", poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map((p) => P(...T(p)))));
}
const ID = (p) => p;
const PX = 8, PZ = 30, UP = 42, L = 86;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = 14 + 30 * value;
  const C = Cam(45, 0.5, 2.5);
  const tip = (a) => [PX + L * Math.cos(rad(a)), 0, PZ + L * Math.sin(rad(a))];
  fit(C, [[-4, -2, 0], [62, 36, 0], [PX + L * Math.cos(rad(UP)), 18, PZ + 4 + L * Math.sin(rad(UP))], [PX + L, 18, PZ], [PX + 64, 36, 0]], 200, 165);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const base = solid(g);
  const [br, bi] = rings(-4, -2, 62, 36, 5, 1.6);
  put(base, prism(P, front, br, bi, 0, 5));
  const body = box(g), arm = box(g), blade = box(g), lower = box(g), sheet = box(g);
  drawBox(P, body, [0, 18, 8, 24, 5, PZ + 2], ID);
  drawBox(P, lower, [10, 52, 22, 25, 5, 20], ID);
  drawBox(P, sheet, [30, 58, 25, 34, 5, 6.2], ID);
  const T = (a) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return ([dx, y, dz]) => [PX + dx * c - dz * s, y, PZ + dx * s + dz * c];
  };
  const ang = tween(UP);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const t = T(a);
    drawBox(P, blade, [4, 44, 19, 22, -14, 0], t);
    drawBox(P, arm, [-6, L, 15, 21, 0, 5], t);
  }
  draw(UP);
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -10 && x < 100 && y > -10 && y < 44;
  }
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? UP - travel : UP, performance.now(), 0);
    arm.sil.classList.toggle("hi", true);
    read.textContent = on ? "cut" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = clamp(14 + 30 * v, 14, 44); if (act) { tset(ang, UP - travel, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "metalshear",
  means: "A bench shear: over it the long lever swings down on its pin and the upper blade closes past the fixed one.",
  rules: [1, 3, 5],
  range: [0, 0.6, 1],
  tour: [[188, 250], [170, 208], [135, 177], null],
  mount,
});
