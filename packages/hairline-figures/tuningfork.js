/**
 * Tuning fork: a steel fork standing in a wooden resonator block. The pointer
 * strikes it: the fork swings toward the side the pointer is on, the farther
 * out the wider the swing, and its tines stay bright. At rest it leans a
 * little to the left. The slider is how far it can swing.
 */
const { Cam, clamp, fit, hull, poly, proj, unproj, spring, stepS, disposer, mk, pointer, register, rad } = HL;

const REST = -8, MAX = 34;
// boxes: [cx, cy, cz, hx, hy, hz]; z measured from the pivot on the block top
const FORK = [[0, 0, 14, 3, 3, 14], [0, 0, 31, 15, 3.5, 3], [-12, 0, 70, 3, 3, 38], [12, 0, 70, 3, 3, 38]];
const TOP = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-40, -30, 0], [40, 30, 0], [-70, 0, TOP + 100], [70, 0, TOP + 100], [0, -30, TOP + 110]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (c, h, a) => {
    const pts = [];
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      const x = c[0] + sx * h[0], y = c[1] + sy * h[1], z = c[2] + sz * h[2];
      const ca = Math.cos(a), sa = Math.sin(a);
      pts.push(P(x * ca + z * sa, y, TOP - x * sa + z * ca));
    }
    return poly(hull(pts));
  };
  const blockEl = mk("path", { class: "sil" }, g);
  blockEl.setAttribute("d", box([0, 0, -11], [36, 26, 11], 0));
  const holeEl = mk("path", { class: "nf lo" }, g);
  holeEl.setAttribute("d", box([0, 0, 0.1], [5, 5, 0.05], 0));
  const els = FORK.map((b, i) => mk("path", { class: i >= 2 ? "sil hi" : "sil" }, g));
  const ang = spring(REST, { k: 120, c: 12 });
  let lim = MAX * value, last = "";
  function draw() {
    const key = ang.x.toFixed(2);
    if (key === last) return;
    last = key;
    FORK.forEach((b, i) => els[i].setAttribute("d", box(b.slice(0, 3), b.slice(3), rad(ang.x))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    ang.t = t;
    read.textContent = t === REST ? "rest" : `${Math.round(Math.abs(t))}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      const s = x - y;
      aim(Math.abs(s) < 4 ? REST : clamp(s * 0.5, -lim, lim));
    },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST);
  return { set: (v) => { lim = MAX * v; }, destroy: bag.dispose };
}

hairline({
  name: "tuningfork",
  means: "A tuning fork in its block: it swings toward the pointer's side, wider the farther out, and its tines ring bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[215, 93], [113, 246], [290, 200], null],
  mount,
});
