/**
 * Pen plotter: a flatbed with a sheet on it, a gantry bridge across the bed
 * on two uprights, and a pen carriage riding the bridge. The pointer over the
 * bed sends the bridge along the bed and the carriage along the bridge, on
 * springs, so the pen travels to the point. At rest the carriage is bright.
 * The slider is the reach: how far toward the pointer the pen travels.
 *
 * The pattern: a continuous aim (terrain's spring); the hit is on the bed's
 * top plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, poly, open, prism, proj, rings, ringAt, circ, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 100, BY = 70, BZ = 6, TOP = 30, REST = [26, 46];
const box = (P, front, x0, y0, x1, y1, z0, z1, r = 2, b = 1.2) => {
  const [o, i] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, o, i, z0, z1);
};
const disc = (x, y, r) => circ(r, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, -12, 0], [BX, -12, TOP], [BX, BY + 12, 0], [0, BY + 12, TOP], [0, 0, 0], [BX, BY, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = solid(g);
  put(solid(g), box(P, front, 0, 0, BX, BY, 0, BZ, 3, 1.6));
  const [po] = rings(10, 8, BX - 10, BY - 8, 1, 0.5);
  mk("path", { d: poly(ringAt(P, po, BZ + 0.3)), class: "nf lo" }, g);
  const trace = [];
  for (let i = 0; i <= 30; i++) { const t = i / 30; trace.push(P(18 + t * 60, 35 + 14 * Math.sin(t * Math.PI * 2.2) * (1 - t * 0.4), BZ + 0.3)); }
  mk("path", { d: open(trace), class: "nf lo" }, g);
  const bar = solid(g), pen = solid(g), carr = solid(g), fore = solid(g);
  carr.sil.classList.add("hi");

  const gx = spring(REST[0]), py = spring(REST[1]);
  let lx = NaN, ly = NaN;
  function draw() {
    const x = gx.x, y = py.x;
    if (x === lx && y === ly) return;
    lx = x; ly = y;
    put(back, box(P, front, x - 5, -12, x + 5, -3, 0, TOP));
    put(bar, box(P, front, x - 4, -10, x + 4, BY + 10, TOP - 7, TOP, 2, 1));
    put(fore, box(P, front, x - 5, BY + 3, x + 5, BY + 12, 0, TOP));
    put(pen, prism(P, front, disc(x + 9, y, 1.8), disc(x + 9, y, 1), BZ + 0.5, 16));
    put(carr, box(P, front, x + 4, y - 6, x + 14, y + 6, 13, TOP + 2, 2, 1));
  }
  draw();

  const B = register(stage, (dt) => { const a = stepS(gx, dt), b = stepS(py, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function aim(p) {
    const [x, y] = p ? unproj(C, p[0], p[1], BZ) : [NaN, NaN];
    const on = p && x > 0 && x < BX && y > 0 && y < BY;
    const tx = on ? clamp(REST[0] + (x - 9 - REST[0]) * reach, 6, BX - 16) : REST[0];
    const ty = on ? clamp(REST[1] + (y - REST[1]) * reach, 8, BY - 8) : REST[1];
    gx.t = tx; py.t = ty;
    read.textContent = on ? Math.round(tx) + "·" + Math.round(ty) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "penplotter",
  means: "A flatbed pen plotter: the pointer over the bed slides the gantry and its pen carriage over to that point on the sheet.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[221, 159], [278, 166], [200, 190], null],
  mount,
});
