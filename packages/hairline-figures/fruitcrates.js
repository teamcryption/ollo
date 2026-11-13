/**
 * Fruit crates: three slatted market crates in a row, apples in the first,
 * oranges in the second, pears in the third, six to a crate. The pointer is a
 * field: the fruit near it bounce up on their springs, the one under it
 * highest and bright, the lift falling off with distance. At rest a few sit
 * proud of the heap, one orange bright. The slider is the field's reach.
 *
 * The pattern: a field of springs (terrain); the hit unprojects onto each
 * fruit's own rest top, so a raised one never hides the one behind it.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CW = 42, CD = 30, CH = 13, PITCH = 48, YOFF = [0, 7, -2], R = 6.2, LIFT = 17, HIT = 8;
const REST = [[1, 0, 2.5, 0, 0.5, 0], [0, 3, 1, 0, 6, 0.5], [0.5, 0, 0, 2, 0, 1]], FAV = [1, 4];
const disc = (x, y, r, n = 20) => circ(Math.max(r, 0.05), n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  const X1 = 2 * PITCH + CW;
  fit(C, [[0, -2, 0], [X1, -2, 0], [0, CD + 7, 0], [X1, CD + 7, 0], [7, 6, CH + R * 2 + LIFT], [X1 - 7, 6, CH + R * 2 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const fruit = [];
  for (let c = 0; c < 3; c++) {
    const x0 = c * PITCH, y0 = YOFF[c];
    const [o, i] = rings(x0, y0, x0 + CW, y0 + CD, 2.5, 1.6);
    const box = solid(g);
    put(box, prism(P, front, o, i, 0, CH));
    mk("path", { class: "nf lo", d: poly(ringAt(P, i, CH)) }, box.g);
    const mine = [];
    for (let k = 0; k < 6; k++) {
      const col = k % 3, row = Math.floor(k / 3);
      const f = { c, k, x: x0 + 7.5 + col * 13.5, y: y0 + 8 + row * 14, sp: spring(REST[c][k]), last: NaN };
      mine.push(f); fruit.push(f);
    }
    mine.sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((f) => {
      const grp = mk("g", {}, g);
      f.sil = mk("path", { class: "sil" }, grp);
      f.mk = mk("path", { class: "nf lo" }, grp);
    });
    // the near walls again, over the fruit's feet, with their slat gaps
    const nr = run(o, front), lip = ringAt(P, nr, 0).concat(ringAt(P, nr, CH).reverse());
    const wall = mk("g", {}, g);
    mk("path", { class: "fo", d: poly(lip) }, wall);
    const slat = (z) => open(ringAt(P, nr, z));
    mk("path", { class: "nf lo", d: slat(CH) + slat(CH * 0.55) + slat(CH * 0.45) }, wall);
    mk("path", { class: "nf sil", d: open(ringAt(P, nr, 0)) }, wall);
  }

  function ball(x, y, z, r, rz) {
    const pts = [];
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI - Math.PI / 2; pts.push(...ringAt(P, disc(x, y, r * Math.cos(a)), z + rz + rz * Math.sin(a))); }
    return pts;
  }
  function draw(f) {
    const lift = f.sp.x;
    if (Math.abs(lift - f.last) < 1e-3) return;
    f.last = lift;
    const z = CH - 4 + lift, { x, y } = f;
    if (f.c === 0) { // apple: a squat ball, a stem in its dimple
      f.sil.setAttribute("d", poly(hull(ball(x, y, z, R, R * 0.9))));
      f.mk.setAttribute("d", seg(P(x, y, z + R * 1.6), P(x + 1, y - 1, z + R * 1.8 + 2.4)) + open(ringAt(P, run(disc(x, y, 2), front), z + R * 1.7)));
    } else if (f.c === 1) { // orange: a full ball, a navel on top
      f.sil.setAttribute("d", poly(hull(ball(x, y, z, R, R))));
      f.mk.setAttribute("d", poly(ringAt(P, disc(x, y, 1, 10), z + R * 2)));
    } else { // pear: a body and a neck, a stem
      f.sil.setAttribute("d", poly(hull(ball(x, y, z, R * 0.95, R * 0.85).concat(ball(x - 0.6, y - 0.6, z + R * 1.2, R * 0.55, R * 0.6)))));
      f.mk.setAttribute("d", seg(P(x - 0.6, y - 0.6, z + R * 2.4), P(x - 1.6, y - 1.6, z + R * 2.4 + 3)));
    }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const f of fruit) { if (stepS(f.sp, dt)) m = true; draw(f); }
    return m;
  });
  bag.add(B.unregister);

  // the hit: each fruit tests the pointer on its own rest top, the nearest middle wins
  let pt = null;
  function retarget() {
    const ds = fruit.map((f) => {
      if (!pt) return Infinity;
      const [wx, wy] = unproj(C, pt[0], pt[1], CH - 4 + REST[f.c][f.k] + R * 2);
      return Math.hypot(wx - f.x, wy - f.y);
    });
    let a = -1;
    ds.forEach((d, k) => { if (d < HIT && (a < 0 || d < ds[a])) a = k; });
    fruit.forEach((f, k) => {
      const w = a < 0 ? 0 : k === a ? 1 : clamp(0.65 * Math.exp(-((ds[k] / reach) ** 2)), 0.06, 0.65);
      f.sp.t = a < 0 ? REST[f.c][f.k] : LIFT * w;
      f.sil.classList.toggle("hi", a < 0 ? f.c === FAV[0] && f.k === FAV[1] : k === a);
    });
    read.textContent = a < 0 ? "rest" : "crate " + (fruit[a].c + 1);
    B.wake();
  }
  retarget();
  bag.add(pointer(stage, { move: (p) => { pt = p; retarget(); }, leave: () => { pt = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "fruitcrates",
  means: "Three market crates of apples, oranges and pears: the fruit near the pointer bounce up, the one under it highest.",
  rules: [1, 3, 5, 6],
  range: [10, 20, 34],
  tour: [[121, 109], [183, 158], [251, 177], null],
  mount,
});
