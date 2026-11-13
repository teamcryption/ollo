/**
 * Crop field: four raised beds of soil, each with a row of six seedlings, a
 * stem and two leaves apiece. The pointer is the sun and the rain: the plants
 * near it grow tall and open their leaves, the farther the less, each on its
 * own spring. At rest the field is young, a little taller toward the back.
 * The slider is the reach, in plants.
 *
 * The pattern: a continuous field (terrain), on plants; the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, open, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 6, NY = 4, SX = 18, SY = 24, BEDW = 12, BEDH = 5, HMAX = 34;
const EX = NX * SX, EY = NY * SY;
const falloff = (u) => (u <= 0.4 ? 1 : u <= 1 ? 1 - ((u - 0.4) / 0.6) * 0.78 : 0.22);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * SX, over = null;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, -3], [EX + 6, EY + 6, -3], [EX + 6, -6, -3], [-6, EY + 6, -3], [0, 0, BEDH + HMAX + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-6, -6, EX + 6, EY + 6, 8, 2);
  put(solid(g), prism(P, front, gr, gi, -3, 0));

  const plants = [];
  for (let j = 0; j < NY; j++) {
    // the bed for row j, then its plants back to front
    const y0 = j * SY + (SY - BEDW) / 2;
    const [br, bi] = rings(2, y0, EX - 2, y0 + BEDW, 4, 1.4);
    put(solid(g), prism(P, front, br, bi, 0, BEDH));
    for (let i = 0; i < NX; i++) {
      const cx = (i + 0.5) * SX, cy = j * SY + SY / 2;
      const h0 = 7 + (NY - 1 - j) * 2.5 + ((i * 5 + j * 3) % 4);
      const stem = mk("path", { class: "nf sil" }, g), leaves = mk("path", { class: "nf" }, g);
      plants.push({ i, j, cx, cy, h0, stem, leaves, sp: spring(h0, { eps: 0.04 }), drawn: NaN });
    }
  }

  /** A seedling h tall: a stem, and two leaves that open wider as it grows. */
  function draw(p) {
    const h = Math.max(3, p.sp.x);
    if (h === p.drawn) return;
    p.drawn = h;
    const z0 = BEDH, top = z0 + h, s = clamp(h / HMAX, 0.25, 1), L = 6 + 9 * s;
    p.stem.setAttribute("d", open([P(p.cx, p.cy, z0), P(p.cx + 0.6, p.cy, z0 + h * 0.5), P(p.cx, p.cy, top)]));
    const zl = top - h * 0.35, leaf = (dx, dz) => open([P(p.cx, p.cy, zl), P(p.cx + dx * 0.45, p.cy, zl + dz + 3.5), P(p.cx + dx, p.cy, zl + dz), P(p.cx + dx * 0.5, p.cy, zl + dz - 2.2), P(p.cx, p.cy, zl)]);
    p.leaves.setAttribute("d", leaf(-L, 2 + 4 * s) + leaf(L, 1 + 4 * s));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const p of plants) { if (stepS(p.sp, dt)) m = true; draw(p); }
    return m;
  });
  bag.add(B.unregister);

  const tallest = plants.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  function retarget() {
    let mark = tallest;
    for (const p of plants) p.sp.t = over ? HMAX * falloff(Math.hypot(p.cx - over[0], p.cy - over[1]) / RAD) : p.h0;
    if (over) {
      const i = clamp(Math.floor(over[0] / SX), 0, NX - 1), j = clamp(Math.floor(over[1] / SY), 0, NY - 1);
      mark = plants.find((p) => p.i === i && p.j === j);
      read.textContent = `row ${j + 1}·${i + 1}`;
    } else read.textContent = "rest";
    for (const p of plants) { p.stem.setAttribute("class", p === mark ? "nf hi" : "nf sil"); }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (pt) => { const q = unproj(C, pt[0], pt[1], BEDH); over = [clamp(q[0], 0, EX), clamp(q[1], 0, EY)]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * SX; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cropfield",
  means: "Four beds of seedlings: the plants near the pointer grow tall and open their leaves, the farther ones less.",
  rules: [1, 3, 5, 8],
  range: [1.5, 2.5, 4],
  tour: [[150, 190], [250, 170], [210, 235], null],
  mount,
});
