/**
 * RC car: a chunky remote control buggy on four fat wheels, a domed shell on
 * a low chassis and a whip antenna at the back. The pointer is where the car
 * is steered to: it turns on the spot, on a spring, to point its nose there.
 * At rest it sits angled to the left, its chassis bright. The slider is how
 * far the car may turn.
 *
 * The pattern: a continuous aim on the ground plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WR = 8, WW = 7, REST = rad(-35);
const WHEELS = [[-17, -17], [17, -17], [-17, 17], [17, 17]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-38, -38, 0], [38, 38, 0], [38, -38, 0], [-38, 38, 0], [0, 0, 46]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const farG = mk("g", {}, g), bodyG = mk("g", {}, g), nearG = mk("g", {}, g);
  const wheels = WHEELS.map(() => mk("path", { class: "sil" }, farG));
  const chassis = solid(bodyG), shell = solid(bodyG), wing = solid(bodyG);
  const ant = mk("path", { class: "nf" }, bodyG);
  chassis.sil.classList.add("hi");
  const sa = spring(REST);
  let last = NaN, over = null;

  const turn = (ring, a) => ring.map((q) => ({
    u: q.u * Math.cos(a) - q.v * Math.sin(a), v: q.u * Math.sin(a) + q.v * Math.cos(a),
    nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a),
  }));
  const box = (x0, y0, x1, y1, r, b, a, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return prism(P, front, turn(o, a), turn(i, a), z0, z1); };

  function draw() {
    const a = sa.x;
    if (Math.abs(a - last) < 0.0005) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), W = (u, v, z) => P(u * c - v * s, u * s + v * c, z);
    WHEELS.forEach(([u, v], k) => {
      const pts = [];
      for (let i = 0; i < 18; i++) { const t = (i / 18) * Math.PI * 2; for (const dv of [-WW / 2, WW / 2]) pts.push(W(u + WR * Math.cos(t), v + Math.sign(v) * dv, WR + WR * Math.sin(t))); }
      wheels[k].setAttribute("d", poly(hull(pts)));
      const wx = u * c - v * s, wy = u * s + v * c;
      (wx + wy > 0 ? nearG : farG).appendChild(wheels[k]);
    });
    put(chassis, box(-30, -12, 30, 12, 8, 2, a, 6, 13));
    put(shell, box(-14, -11, 14, 11, 9, 2, a, 13, 22));
    put(wing, box(-30, -13, -24, 13, 2, 0.8, a, 22, 24));
    ant.setAttribute("d", seg(W(-20, 8, 13), W(-24, 9, 44)));
    const rx = -22 * c - 8 * s, ry = -22 * s + 8 * c;
    if (rx + ry < 0) bodyG.insertBefore(ant, chassis.g); else bodyG.appendChild(ant);
  }

  const B = register(stage, (dt) => { const m = stepS(sa, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const lim = rad(40 + 130 * reach);
    sa.t = over === null ? REST : clamp(over, -lim, lim);
    read.textContent = over === null ? "rest" : "steer " + Math.round((sa.t * 180) / Math.PI);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r > 130 || r < 6 ? null : Math.atan2(y, x);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "rcar",
  means: "A remote control buggy on fat wheels: it turns on the spot to point its nose at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[200, 290], [60, 190], [340, 190], null],
  mount,
});
