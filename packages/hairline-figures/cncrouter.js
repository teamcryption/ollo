/**
 * CNC router: a bed with a workpiece, a gantry riding rails along the bed and
 * a spindle carriage running along the gantry's beam. The pointer is where to
 * cut: the gantry rolls to it on one axis and the spindle slides to it on the
 * other, both on springs. At rest the spindle waits over a corner of the
 * work, bright. The slider is how far of the way the machine travels.
 *
 * The pattern: a continuous aim on the bed's plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 50, BY = 40, BZ = 10, UX = 45, BEAM = 40, REST = [16, -14];
const box = (x0, y0, x1, y1, r, b) => rings(x0, y0, x1, y1, r, b);
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-BX, -BY, 0], [BX, BY, 0], [BX, -BY, 0], [-BX, BY, 0], [-UX, -30, BEAM + 9], [UX, 30, BEAM + 9]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = box(-BX, -BY, BX, BY, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  for (const s of [-1, 1]) {
    const [rr, ri] = box(s * UX - 3, -BY + 2, s * UX + 3, BY - 2, 1.5, 0.8);
    put(solid(g), prism(P, front, rr, ri, BZ, BZ + 2));
  }
  const [wr, wi] = box(-32, -26, 32, 26, 2, 1.2);
  put(solid(g), prism(P, front, wr, wi, BZ, BZ + 4));
  mk("path", { d: poly([[-22, -16], [10, -16], [22, -4], [22, 16], [-22, 16]].map(([x, y]) => P(x, y, BZ + 4))), class: "nf dash" }, g);

  const gan = mk("g", {}, g);
  const parts = { up: [solid(gan), solid(gan)], beam: solid(gan), car: solid(gan), spin: solid(gan) };
  const bit = mk("path", { class: "nf" }, gan);
  parts.spin.sil.classList.add("hi");
  const gx = spring(REST[0]), gy = spring(REST[1]);
  let lastKey = "", over = null;

  function draw() {
    const x = gx.x, y = gy.x, key = x.toFixed(2) + "," + y.toFixed(2);
    if (key === lastKey) return;
    lastKey = key;
    [-1, 1].forEach((s, k) => {
      const [ur, ui] = box(s * UX - 4, y - 5, s * UX + 4, y + 5, 2, 1);
      put(parts.up[k], prism(P, front, ur, ui, BZ + 2, BEAM));
    });
    const [mr, mi] = box(-UX - 5, y - 4, UX + 5, y + 4, 2, 1);
    put(parts.beam, prism(P, front, mr, mi, BEAM, BEAM + 9));
    const [cr, ci] = box(x - 7, y + 4, x + 7, y + 10, 2, 1);
    put(parts.car, prism(P, front, cr, ci, BEAM - 8, BEAM + 13));
    put(parts.spin, prism(P, front, disc(x, y + 7, 5), disc(x, y + 7, 3.6), BZ + 13, BEAM - 8));
    bit.setAttribute("d", seg(P(x, y + 7, BZ + 13), P(x, y + 7, BZ + 6)));
  }

  const B = register(stage, (dt) => { const a = stepS(gx, dt), b = stepS(gy, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    const [x, y] = over ?? REST;
    gx.t = clamp(REST[0] + (x - REST[0]) * reach, -30, 30);
    gy.t = clamp(REST[1] + (y - REST[1]) * reach, -BY + 8, BY - 16);
    read.textContent = over ? `${Math.round(gx.t)}·${Math.round(gy.t)}` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], BZ + 4);
      const inside = Math.abs(x) < BX + 10 && Math.abs(y) < BY + 10;
      over = inside ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  retarget();
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0.2, 1); retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cncrouter",
  means: "A CNC router: the gantry rolls along the bed and the spindle slides along its beam to stand over the point the pointer picks.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.9, 1],
  tour: [[126, 183], [250, 200], [230, 130], null],
  mount,
});
