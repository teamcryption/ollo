/**
 * Dental drill: a dentist's unit console with a long handpiece resting on its
 * holder, joined to the console by a hose. Bring the pointer near and the
 * handpiece lifts out of its holder, head and bur rising, the hose following.
 * At rest it lies in the holder, bright. The slider is how far it lifts.
 *
 * The pattern: a discrete lift (a 700ms tween); the hit is on the floor's
 * plane, which never moves.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = [2, 0, 56], LEN = 86, REST = 8, MAX = 62;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-46, -28, 0], [4, 28, 0], [92, 0, 40], [60, 0, 140], [-46, 28, 60]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let v = value;
  const [cr, ci] = rings(-46, -26, 2, 26, 7, 1.8);
  put(solid(g), prism(P, front, cr, ci, 0, 52));
  const [hr, hi] = rings(-4, -7, 8, 7, 3, 1);
  put(solid(g), prism(P, front, hr, hi, 52, 56));
  const hose = mk("path", { class: "nf" }, g);
  const body = mk("path", { class: "sil hi" }, g), head = mk("path", { class: "sil" }, g), bur = mk("path", { class: "nf sil" }, g);
  const lift = tween(0);
  let over = false, last = "";

  const ring = (c, d, r) => {
    let u = [d[1], -d[0], 0]; const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const w = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    return Array.from({ length: 20 }, (_, i) => {
      const t = (i / 20) * Math.PI * 2, q = (j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * w[j]);
      return P(q(0), q(1), q(2));
    });
  };
  const tube = (a, b, r0, r1) => poly(hull(ring(a, norm(sub(b, a)), r0).concat(ring(b, norm(sub(b, a)), r1))));
  const sub = (a, b) => a.map((x, i) => x - b[i]), add = (a, b, k) => a.map((x, i) => x + b[i] * k);
  const norm = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };

  function draw(now) {
    const p = rad(REST + MAX * v * tval(lift, now)), key = p.toFixed(4);
    if (key === last) return;
    last = key;
    const d = [Math.cos(p), 0, Math.sin(p)], n = [-Math.sin(p), 0, Math.cos(p)];
    const E = add(H, d, LEN);
    body.setAttribute("d", tube(H, E, 4.2, 3.4));
    head.setAttribute("d", tube(add(E, n, 3), add(E, n, -11), 5.6, 5.6));
    const b0 = add(E, n, -11);
    bur.setAttribute("d", open([P(...b0), P(...add(b0, n, -9))]));
    const pts = [];
    const c0 = add(H, d, -2), c1 = add(H, d, -30), c2 = [-36, 12, 74], c3 = [-34, 10, 52];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, m = (1 - t) ** 3, a = 3 * (1 - t) ** 2 * t, b = 3 * (1 - t) * t * t, c = t ** 3;
      pts.push(P(...[0, 1, 2].map((j) => m * c0[j] + a * c1[j] + b * c2[j] + c * c3[j])));
    }
    hose.setAttribute("d", open(pts));
  }

  const B = register(stage, (dt, now) => { draw(now); return !tdone(lift, now); });
  bag.add(B.unregister);
  const retarget = () => {
    tset(lift, over ? 1 : 0, performance.now(), 0);
    read.textContent = over ? `lift ${Math.round(MAX * v)}°` : "rest";
    B.wake();
  };
  bag.add(pointer(stage, {
    move: (q) => { over = q[0] > 70 && q[0] < 340 && q[1] > 50 && q[1] < 280; retarget(); },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (x) => { v = x; last = ""; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "dentaldrill",
  means: "A dental unit's handpiece on its holder: bring the pointer near and the drill lifts out, hose and all.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.3],
  tour: [[244, 181], [180, 150], [300, 230], null],
  mount,
});
