/**
 * Bootjack: a boot jack, a long board with a V notch for the heel, resting
 * on a block. The pointer, read on the ground plane, presses the board: over
 * the notch end it tilts down, over the tail it tips back. At rest the
 * notch end is raised, its top bright. The slider is how far it may tilt.
 */
const { Cam, fit, proj, poly, clamp, spring, stepS, mk, pointer, register, disposer, unproj, hull } = HL;

const PX = 52, PZ = 12, T = 4;
const FOOT = [[0, 2], [4, 0], [86, 0], [86, 6], [66, 13], [86, 20], [86, 26], [4, 26], [0, 24]];
const REST = Math.asin(PZ / PX);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.75);
  fit(C, [[0, 0, 0], [86, 26, 0], [86, 0, 30], [0, 26, 30], [0, 0, 0], [86, 0, 0]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z1) => [[x0, y0, 0], [x1, y0, 0], [x1, y1, 0], [x0, y1, 0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
  const blk = mk("path", { d: poly(hull(box(PX - 6, 3, PX + 6, 23, PZ).map((p) => P(...p)))), class: "sil" }, g);
  const bot = mk("path", { class: "" }, g);
  const sides = FOOT.map(() => mk("path", { class: "lo" }, g));
  const top = mk("path", { class: "sil" }, g);
  const a = spring(REST);
  let last = NaN;
  const R = (x, y, z, th) => [PX + (x - PX) * Math.cos(th) - (z - PZ) * Math.sin(th), y, PZ + (x - PX) * Math.sin(th) + (z - PZ) * Math.cos(th)];
  function draw(th) {
    if (th === last) return;
    last = th;
    const b = FOOT.map(([x, y]) => P(...R(x, y, PZ, th))), t = FOOT.map(([x, y]) => P(...R(x, y, PZ + T, th)));
    bot.setAttribute("d", poly(b));
    // sides, far ones first
    const order = FOOT.map((_, i) => i).sort((i, j) => (FOOT[i][1] + FOOT[(i + 1) % FOOT.length][1]) - (FOOT[j][1] + FOOT[(j + 1) % FOOT.length][1]));
    order.forEach((i, k) => { const j = (i + 1) % FOOT.length; sides[k].setAttribute("d", poly([b[i], b[j], t[j], t[i]])); });
    top.setAttribute("d", poly(t));
  }
  // the block stands in front of the board where it shows
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);
  top.classList.add("hi");
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const inside = x > -20 && x < 106 && y > -30 && y < 56;
    const f = clamp((x - 10) / 70, 0, 1);
    const lo = -Math.asin(PZ / (86 - PX)) * reach;
    a.t = inside ? REST + f * (lo - REST) : REST;
    read.textContent = inside ? Math.round((a.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave: () => { a.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "bootjack",
  means: "A boot jack on its block: the pointer presses the board so the heel notch tilts down to the floor.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[298, 197], [205, 176], [112, 156], null],
  mount,
});
