/**
 * Train platform: a raised platform under a canopy on three posts, rails
 * alongside, and a carriage standing at the platform. The pointer along the
 * platform draws the carriage to it, on a spring, so it slides in or out of
 * the station. At rest the carriage has stopped a little short, and the
 * canopy's edge is the bright mark. The slider is the carriage's reach.
 *
 * The pattern: one part following the pointer; the hit is on the ground plane.
 */
const {
  Cam, clamp, facing, fit, poly, prism, proj, rings, ringAt, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 90, PW = 22, PZ = 6, CZ = 34, TY0 = 28, TY1 = 42, TL = 50, TZ = 22, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -2, 0], [L + 14, TY1 + 4, 0], [L + 14, -2, 0], [-14, TY1 + 4, 0], [0, 0, CZ + 2], [L, 0, CZ + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the platform slab, its edge line, and the canopy on its posts
  const plat = solid(g);
  const [pr, pi] = rings(0, 0, L, PW, 2, 1);
  put(plat, prism(P, front, pr, pi, 0, PZ));
  mk("path", { class: "nf lo", d: seg(P(2, PW - 3, PZ), P(L - 2, PW - 3, PZ)) }, plat.g);
  [12, L / 2, L - 12].forEach((x) => {
    const [r, i] = rings(x - 1.4, 6, x + 1.4, 8.8, 1.2, 0.5);
    put(solid(g), prism(P, front, r, i, PZ, CZ));
  });
  const canopy = solid(g);
  const [cr, ci] = rings(-4, -3, L + 4, PW + 3, 3, 1.2);
  put(canopy, prism(P, front, cr, ci, CZ, CZ + 2));

  // the rails: two dim lines with sleepers
  let rails = seg(P(-14, TY0 + 3, 0), P(L + 14, TY0 + 3, 0)) + seg(P(-14, TY1 - 3, 0), P(L + 14, TY1 - 3, 0));
  for (let x = -12; x <= L + 12; x += 8) rails += seg(P(x, TY0 + 1, 0), P(x, TY1 - 1, 0));
  mk("path", { class: "nf lo", d: rails }, g);

  // the carriage: a rounded body, its roof crease, windows and two doors on the near side
  const car = solid(g);
  const marks = mk("path", { class: "nf lo" }, car.g);
  const x0 = spring(REST);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    const [r, i] = rings(x, TY0 + 1, x + TL, TY1 - 1, 5, 1.6);
    put(car, prism(P, front, r, i, 3, TZ));
    let d = "";
    for (let k = 0; k < 5; k++) {
      const wx = x + 5 + k * 9;
      if (k === 2) continue;
      d += poly([P(wx, TY1 - 1, 12), P(wx + 6, TY1 - 1, 12), P(wx + 6, TY1 - 1, 18), P(wx, TY1 - 1, 18)]);
    }
    d += poly([P(x + 23, TY1 - 1, 5), P(x + 29, TY1 - 1, 5), P(x + 29, TY1 - 1, 18), P(x + 23, TY1 - 1, 18)]);
    marks.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    const m = stepS(x0, dt);
    draw(x0.x);
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -14 || x > L + 14 || y < -6 || y > TY1 + 4) return null;
    return x;
  }
  let on = null;
  function setPointer(x) {
    if (x === null) {
      x0.t = REST;
      if (on !== null) read.textContent = "rest";
    } else {
      const c = L / 2 - TL / 2;
      x0.t = clamp(c + (x - L / 2) * reach, -12, L - TL + 12);
      read.textContent = "car " + Math.round(clamp((x0.t + 12) / (L - TL + 24), 0, 1) * 100) + "%";
    }
    car.sil.classList.toggle("hi", x !== null);
    canopy.sil.classList.toggle("hi", x === null);
    on = x;
    B.wake();
  }
  read.textContent = "rest";
  setPointer(null);
  bag.add(pointer(stage, { move: (p) => setPointer(hit(p)), leave: () => setPointer(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "trainplatform",
  means: "A train platform under a canopy: the carriage slides along the rails toward the pointer, and stops a little short at rest.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.9, 1.4],
  tour: [[217, 198], [110, 180], [300, 210], null],
  mount,
});
