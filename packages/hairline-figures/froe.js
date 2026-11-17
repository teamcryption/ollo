/**
 * Froe: a splitting froe driven into the top of a round log, its long blade
 * lying across the log's end grain and its handle standing up from the near
 * end of the blade. The pointer's side of the log sets the lean: the handle
 * levers over toward it, twisting the blade in the split. At rest it leans a
 * little, its handle bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous lever (a spring on an angle); the hit is the
 * pointer on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 20, TOP = 30, HY = 17, HL0 = 44, REST = 12, MAX = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.6);
  const s = Math.sin(rad(MAX)), c = Math.cos(rad(MAX));
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [HL0 * s, HY, TOP + HL0 * c], [-HL0 * s, HY, TOP + HL0 * c]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const log = solid(g);
  put(log, prism(P, front, circ(R, 56), circ(R - 1.6, 56), 0, TOP));
  // the end grain: two growth rings on the top
  const ring = (r) => poly(circ(r, 40).map((p) => P(p.u, p.v, TOP)));
  mk("path", { class: "nf lo", d: ring(12) + ring(5.5) }, log.g);

  const blade = solid(g), handle = solid(g);
  handle.sil.classList.add("hi");
  // a box tilted by th about the y axis through (0, *, TOP): across x from a0 to a1, along y y0..y1, up z0..z1
  function box(th, a0, a1, y0, y1, z0, z1) {
    const cs = Math.cos(th), sn = Math.sin(th), pts = [];
    for (const a of [a0, a1]) for (const z of [z0, z1]) for (const y of [y0, y1]) pts.push(P(a * cs + z * sn, y, TOP - a * sn + z * cs));
    return poly(hull(pts));
  }
  const sp = spring(rad(REST), { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw() {
    const th = sp.x;
    if (th === last) return;
    last = th;
    blade.sil.setAttribute("d", box(th, -0.9, 0.9, -R - 2, HY, -9, 3));
    handle.sil.setAttribute("d", box(th, -2.4, 2.4, HY - 2.4, HY + 2.4, 3, HL0));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let t = rad(REST), on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(x) < 60 && Math.abs(y) < 60) { on = true; t = rad(lerp(-MAX, MAX, clamp((x + 30) / 60, 0, 1))); }
    }
    sp.t = t;
    read.textContent = on ? Math.round((t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * clamp(v, 0.3, 3); sp.c = 18 * Math.sqrt(clamp(v, 0.3, 3)); }, destroy: bag.dispose };
}

hairline({
  name: "froe",
  means: "A froe in a log: its handle levers over toward the pointer's side, twisting the blade in the split end grain.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.6],
  tour: [[126, 205], [100, 218], [253, 294], null],
  mount,
});
