/**
 * Ski binding: a length of ski with its binding, the toe piece forward and
 * the heel piece behind on its long release lever. The pointer works the
 * heel: it flips up about its hinge on a spring, the lever rising nearly
 * upright, and goes bright. At rest the toe piece is bright.
 * The slider is how far the heel flips.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SK = 4, XH = 16, ZH = SK + 4, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-70, -14, 0], [80, 14, 0], [-70, 14, 0], [80, -14, 0], [30, 0, 70], [70, 0, 50]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-70, -11, 80, 11, 10, 2);
  put(solid(g), prism(P, front, sr, si, 0, SK));
  const [pr, pi] = rings(-50, -8, 50, 8, 3, 1.4);
  put(solid(g), prism(P, front, pr, pi, SK, SK + 2));
  const [tr, ti] = rings(-48, -10, -26, 10, 6, 2);
  const toe = solid(g);
  put(toe, prism(P, front, tr, ti, SK + 2, SK + 16));
  const heel = mk("path", { class: "sil" }, g), cup = mk("path", { class: "nf lo" }, g), lever = mk("path", { class: "sil" }, g);
  const sw = spring(REST);
  let last = NaN;
  const box = (x0, x1, y0, y1, z0, z1) => {
    const out = [];
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) out.push([x, y, z]);
    return out;
  };

  function draw() {
    const a = rad(sw.x);
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = ([x, y, z]) => { const dx = x - XH, dz = z - ZH; return P(XH + dx * c - dz * s, y, ZH + dx * s + dz * c); };
    heel.setAttribute("d", poly(hull(box(16, 44, -10, 10, SK + 2, SK + 18).map(T))));
    cup.setAttribute("d", poly([[17, -7, SK + 15], [17, 7, SK + 15], [24, 7, SK + 17], [24, -7, SK + 17]].map(T)));
    lever.setAttribute("d", poly(hull(box(36, 72, -5, 5, SK + 18, SK + 22).map(T))));
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);

  const mid = P(20, 0, 10);
  function setOver(p) {
    const on = !!p && Math.hypot(p[0] - mid[0], p[1] - mid[1]) < 160;
    sw.t = on ? reach : REST;
    toe.sil.classList.toggle("hi", !on);
    lever.classList.toggle("hi", on);
    read.textContent = on ? "heel" : "rest";
    B.wake();
  }
  setOver(null);
  bag.add(pointer(stage, { move: setOver, leave: () => setOver(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "skijump",
  means: "A ski binding on a length of ski: the heel piece flips up on its hinge and the release lever rises.",
  rules: [3, 4, 5, 8],
  range: [30, 60, 75],
  tour: [[253, 181], [120, 150], [300, 230], null],
  mount,
});
