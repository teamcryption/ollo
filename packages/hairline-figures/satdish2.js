/**
 * Ground antenna: a big dish on a turret over a concrete pad. The pointer is
 * the satellite: the dish slews on its turret and tips its elevation to aim at
 * the point on the pad's plane, on a spring. At rest it looks up and left.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PAD = 56, HUB = 54, RIM = 40, BACK = 12, DEPTH = 16;
const REST = [-0.9, 0.75];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-PAD, -PAD, 0], [PAD, PAD, 0], [PAD, -PAD, 0], [-PAD, PAD, 0], [0, 0, HUB + RIM + 4], [-RIM, -RIM, HUB + 20]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-PAD, -PAD, PAD, PAD, 10, 2);
  put(solid(g), prism(P, front, pr, pi, -6, 0));
  const [br, bi] = rings(-16, -16, 16, 16, 5, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, 10));
  put(solid(g), prism(P, front, circ(9, 32), circ(7.6, 32), 10, HUB - 8));
  const turret = solid(g);
  const dishG = mk("g", {}, g);
  const body = mk("path", { class: "sil" }, dishG), rim = mk("path", { class: "nf" }, dishG);
  const struts = mk("path", { class: "nf lo" }, dishG), feed = mk("circle", { class: "dot", r: 2.6 }, dishG);
  const az = spring(REST[0], { k: 100 * value, c: 18 * Math.sqrt(value) }), el = spring(REST[1], { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "", over = null;

  function draw() {
    const key = az.x.toFixed(3) + el.x.toFixed(3);
    if (key === last) return; last = key;
    const d = [Math.cos(el.x) * Math.cos(az.x), Math.cos(el.x) * Math.sin(az.x), Math.sin(el.x)];
    let u = [-Math.sin(az.x), Math.cos(az.x), 0];
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    const c = [0, 0, HUB];
    const ring = (off, r, n) => Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, q = (j) => c[j] + d[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const back = ring(-2, BACK, 24), lip = ring(DEPTH, RIM, 56), mid = ring(DEPTH - 1.4, RIM - 1.6, 56);
    const tring = circ(11, 24).map((q) => P(q.u, q.v, HUB - 8)).concat(circ(11, 24).map((q) => P(q.u, q.v, HUB - 2)));
    turret.sil.setAttribute("d", poly(hull(tring)));
    const toFront = d[0] + d[1] > 0;
    body.setAttribute("d", poly(hull(back.concat(lip))));
    rim.setAttribute("d", poly(toFront ? mid : lip));
    const tip = [0, 1, 2].map((j) => c[j] + d[j] * (DEPTH + 26)), tp = P(...tip);
    struts.setAttribute("d", [0, 14, 28, 42].map((i) => seg(lip[i], tp)).join(""));
    feed.setAttribute("cx", tp[0]); feed.setAttribute("cy", tp[1]);
  }

  const B = register(stage, (dt) => { const a = stepS(az, dt), b = stepS(el, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    if (over) {
      const [x, y] = over, r = Math.hypot(x, y);
      let a = Math.atan2(y, x); while (a - az.t > Math.PI) a -= 2 * Math.PI; while (a - az.t < -Math.PI) a += 2 * Math.PI;
      az.t = a; el.t = Math.max(0.15, Math.min(1.25, 1.35 - r / 90));
    } else { az.t = REST[0]; el.t = REST[1]; }
    body.classList.toggle("hi", !!over);
    feed.setAttribute("class", over ? "dot off" : "dot");
    read.textContent = over ? `az ${((Math.round(az.t * 57.3) % 360) + 360) % 360}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) > 120 ? null : [x, y]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { az.k = el.k = 100 * v; az.c = el.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "satdish2",
  means: "A ground station dish on its turret: it slews and tips to aim where the pointer is, like tracking a pass overhead.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[212, 268], [52, 212], [336, 218], null],
  mount,
});
