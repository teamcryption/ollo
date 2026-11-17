/**
 * Capstan: a ship's capstan, a drum on a round foot under a wide head with
 * six bars shipped in its sockets. The pointer is where the crew walks: the
 * head and its bars turn on a spring to put the bright first bar under the
 * pointer. At rest the bars sit at an angle, the first one bright. The slider
 * is how stiffly the capstan follows.
 *
 * The pattern: a continuous aim (officechairs' spring on an angle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, R0 = 14, R1 = 54, W = 3, HZ = 40, REST = 0.35;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-R1, -R1, 0], [R1, R1, 0], [R1, -R1, 0], [-R1, R1, 0], [-R1, R1, HZ + 10], [R1, -R1, HZ + 10], [0, 0, HZ + 10]], 200, 222);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(24), disc(21), 0, 5));
  put(solid(g), prism(P, front, disc(14), disc(12.5), 5, HZ - 8));
  put(solid(g), prism(P, front, disc(21), disc(18.5), HZ - 8, HZ));
  // the pawl on the foot
  put(solid(g), prism(P, front, circ(3, 12).map((q) => ({ ...q, u: q.u + 20, v: q.v - 8 })), circ(2, 12).map((q) => ({ ...q, u: q.u + 20, v: q.v - 8 })), 5, 8));
  const bars = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    bars.push({ k, grp, sil: mk("path", { class: "sil" + (k === 0 ? " hi" : "") }, grp), cr: mk("path", { class: "nf lo" }, grp) });
  }
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function bar(a, r, w) {
    const c = Math.cos(a), s = Math.sin(a), pts = [];
    for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * Math.PI; pts.push({ u: (r + w * Math.cos(t)) * c - w * Math.sin(t) * s, v: (r + w * Math.cos(t)) * s + w * Math.sin(t) * c }); }
    for (let i = 0; i <= 8; i++) { const t = Math.PI / 2 + (i / 8) * Math.PI; pts.push({ u: (R0 + w * Math.cos(t)) * c - w * Math.sin(t) * s, v: (R0 + w * Math.cos(t)) * s + w * Math.sin(t) * c }); }
    return pts;
  }
  function draw() {
    const a0 = sp.x;
    if (a0 === last) return;
    last = a0;
    const order = [];
    bars.forEach((b, k) => {
      const a = a0 + (k * 2 * Math.PI) / N, ring = bar(a, R1, W);
      b.sil.setAttribute("d", poly(hull(ringAt(P, ring, HZ).concat(ringAt(P, ring, HZ + 5)))));
      b.cr.setAttribute("d", poly(ringAt(P, bar(a, R1 - 1, W - 1), HZ + 5)));
      order.push([P(R1 * 0.6 * Math.cos(a), R1 * 0.6 * Math.sin(a), HZ)[1], b]);
    });
    order.sort((p, q) => p[0] - q[0]).forEach(([, b]) => g.appendChild(b.grp));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let on = false;
  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
    if (r > R1 + 30) return leave();
    let a = Math.atan2(y, x);
    while (a - sp.t > Math.PI) a -= 2 * Math.PI;
    while (a - sp.t < -Math.PI) a += 2 * Math.PI;
    sp.t = a; on = true;
    const deg = Math.round(((a * 180) / Math.PI % 360 + 360) % 360);
    read.textContent = String(deg).padStart(3, "0") + "°";
    B.wake();
  }
  function leave() { on = false; sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "capstan",
  means: "A ship's capstan: the head and its six bars turn on a spring to bring the bright bar round under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.6],
  tour: [[183, 169], [292, 191], [108, 191], null],
  mount,
});
