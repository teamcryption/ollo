/**
 * Bike lock: a hoop rack on a slab, a U-lock hung over its top bar. The
 * pointer's place along the rack slides the lock there, and its place across
 * swings the lock round the bar. At rest the lock hangs off centre, its body
 * bright. The slider is how far it swings.
 *
 * The pattern: continuous values read from the pointer (spring).
 */
const {
  Cam, fit, hull, poly, proj, rings, prism, facing, unproj, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BY = 40, BZ = 62, X0 = 12, X1 = 108;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-4, 18, 0], [124, 62, 0], [124, 18, 0], [-4, 62, 0], [X0, BY, BZ + 12], [X1, BY, BZ + 12], [60, BY + 40, 30], [60, BY - 40, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ra, ri] = rings(-4, 18, 124, 62, 6, 2); put(solid(g), prism(P, front, ra, ri, 0, 3));
  const cap = (a, b, r) => {
    const pts = [];
    for (const q of [P(...a), P(...b)]) for (let i = 0; i < 16; i++) pts.push([q[0] + Math.cos(i * Math.PI / 8) * r * 2.1, q[1] + Math.sin(i * Math.PI / 8) * r * 2.1]);
    return poly(hull(pts));
  };
  const tube = [[X0, BY, 3], [X0, BY, BZ - 10], [X0 + 10, BY, BZ], [X1 - 10, BY, BZ], [X1, BY, BZ - 10], [X1, BY, 3]];
  const rack = mk("g", {}, g);
  for (let i = 0; i < tube.length - 1; i++) mk("path", { d: cap(tube[i], tube[i + 1], 2.4) }, rack);
  const lk = mk("g", {}, g);
  const band = mk("path", { class: "sil" }, lk), body = mk("path", { class: "sil" }, lk), key = mk("circle", { r: 2.2, class: "dot off" }, lk);

  const xs = spring(78), ph = spring(22);
  let last = "";
  function draw(x, f) {
    const k = r2(x) + "," + r2(f);
    if (k === last) return;
    last = k;
    const c = Math.cos(rad(f)), s = Math.sin(rad(f));
    const W = (v, w) => [x, BY + v * c - w * s, BZ + v * s + w * c];
    const pts = [];
    for (let i = 0; i <= 12; i++) { const t = Math.PI - (i / 12) * Math.PI; pts.push(P(...W(8.6 * Math.cos(t), 8.6 * Math.sin(t) - 3))); }
    pts.push(P(...W(8.6, -36)), P(...W(5.2, -36)));
    for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; pts.push(P(...W(5.2 * Math.cos(t), 5.2 * Math.sin(t) - 3))); }
    pts.push(P(...W(-5.2, -36)), P(...W(-8.6, -36)));
    band.setAttribute("d", poly(pts));
    body.setAttribute("d", cap(W(-13, -38), W(13, -38), 5.5));
    const q = P(...W(9, -38)); key.setAttribute("cx", q[0]); key.setAttribute("cy", q[1]);
  }
  const r2 = (n) => Math.round(n * 10) / 10;
  const B = register(stage, (dt) => { const a = stepS(xs, dt), b = stepS(ph, dt); draw(xs.x, ph.x); return a || b; });
  bag.add(B.unregister);

  // the ground never moves: read both values from the pointer on it
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x < -10 || x > 130 || y < -20 || y > 100 ? null : [clamp(x, 30, 92), clamp((y - BY) / 40, -1, 1)];
  }
  let act = null;
  function set(h) {
    act = h;
    xs.t = h ? h[0] : 78; ph.t = h ? h[1] * reach : 22;
    body.classList.toggle("hi", !h);
    band.classList.toggle("hi", !!h);
    read.textContent = h ? Math.round(ph.t) + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) set(act); }, destroy: bag.dispose };
}

hairline({
  name: "bikelock",
  means: "A U-lock hung on a hoop bike rack: it slides along the bar to the pointer and swings round it toward the pointer's side.",
  rules: [1, 3, 5, 8],
  range: [20, 60, 80],
  tour: [[304, 212], [200, 219], [103, 230], null],
  mount,
});
