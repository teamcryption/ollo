/**
 * X-ray machine: a ceiling-hung X-ray unit over a patient table, a column
 * dropping from a rail, and on it an arm carrying the tube head and its
 * collimator. Bring the pointer near and the arm swings the tube head round
 * the column. At rest it is parked off to one side, the tube head bright. The
 * slider is how far it swings.
 *
 * The pattern: a discrete swing (a 700ms tween); the hit is a fixed box round
 * the rest pose, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZA = 108, ARM = 46, REST = -150, MAX = 110;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-74, 0, 180], [74, 0, 180], [-22, -56, 0], [32, 56, 0], [62, 62, 84], [-62, -62, 84], [62, -62, 84], [-62, 62, 84]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let v = value;
  const [pr, pi] = rings(-8, -22, 8, 22, 4, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 46));
  const [tr, ti] = rings(-24, -56, 32, 56, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 46, 54));
  const [rr, ri] = rings(-74, -4, 74, 4, 2, 0.8);
  put(solid(g), prism(P, front, rr, ri, 174, 180));
  const col = solid(g);
  put(col, prism(P, front, circ(5.5, 24), circ(4.5, 24), ZA - 4, 174));
  const mov = mk("g", {}, g);
  const arm = mk("path", { class: "sil" }, mov), coll = mk("path", { class: "sil" }, mov), head = mk("path", { class: "sil hi" }, mov);
  const swing = tween(0);
  let over = false, last = "", behind = null;

  const sub = (a, b) => a.map((x, i) => x - b[i]), add = (a, b, k) => a.map((x, i) => x + b[i] * k);
  const norm = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const ring = (c, d, r) => {
    const u = norm(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), w = cross(u, d);
    return Array.from({ length: 24 }, (_, i) => {
      const t = (i / 24) * Math.PI * 2;
      return P(...c.map((x, j) => x + r * (Math.cos(t) * u[j] + Math.sin(t) * w[j])));
    });
  };
  const tube = (a, b, r0, r1) => { const d = norm(sub(b, a)); return poly(hull(ring(a, d, r0).concat(ring(b, d, r1)))); };

  function draw(now) {
    const a = rad(REST + MAX * v * tval(swing, now)), key = a.toFixed(4);
    if (key === last) return;
    last = key;
    const d = [Math.cos(a), Math.sin(a), 0], s = [-Math.sin(a), Math.cos(a), 0];
    const E = [d[0] * ARM, d[1] * ARM, ZA];
    arm.setAttribute("d", tube([0, 0, ZA], E, 3.5, 3.5));
    head.setAttribute("d", tube(add(E, s, -20), add(E, s, 20), 11, 11));
    coll.setAttribute("d", tube([E[0], E[1], ZA - 8], [E[0], E[1], ZA - 26], 8, 11));
    const back = d[0] + d[1] < 0;
    if (back !== behind) { behind = back; if (back) col.g.before(mov); else col.g.after(mov); }
  }

  const B = register(stage, (dt, now) => { draw(now); return !tdone(swing, now); });
  bag.add(B.unregister);
  const retarget = () => {
    tset(swing, over ? 1 : 0, performance.now(), 0);
    read.textContent = over ? `swing ${Math.round(MAX * v)}°` : "rest";
    B.wake();
  };
  bag.add(pointer(stage, {
    move: (q) => { over = q[0] > 60 && q[0] < 340 && q[1] > 20 && q[1] < 300; retarget(); },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (x) => { v = x; last = ""; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "xrayarm",
  means: "A ceiling-hung X-ray unit over a table: bring the pointer near and the arm swings the tube head round the column.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.4],
  tour: [[200, 82], [221, 221], [150, 150], null],
  mount,
});
