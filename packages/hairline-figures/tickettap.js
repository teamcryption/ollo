/**
 * Contactless reader: a ticket validator on a post, its broad reader head on
 * a pivot at the top, a tap ring on its face. The pointer's place along the
 * ground tilts the head toward it on a spring. At rest the head leans toward
 * the viewer, bright. The slider is the tilt's far end, in degrees.
 *
 * The pattern: a continuous aim (terrain's spring, on an angle); the hit is
 * on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rrect, rad, unproj, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const H = 50, HU = 22, HV = 21, HW = 9, REST = 22, REACH = 70;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 2.75);
  const outer = rrect(-HU, -HV, HU, HV, 5, 4), inner = rrect(-HU + 2, -HV + 2, HU - 2, HV - 2, 3.5, 4);
  const tap = circ(9, 32), led = [-HU + 6, HV - 5];
  const W = (u, v, w, th) => [u * Math.cos(th) + w * Math.sin(th), v, H + w * Math.cos(th) - u * Math.sin(th)];
  const ext = [];
  for (const d of [-64, 64]) for (const [u, v] of [[-HU, -HV], [HU, HV], [HU, -HV], [-HU, HV]]) for (const w of [0, HW]) ext.push(W(u, v, w, rad(d)));
  fit(C, ext.concat([[-18, -18, 0], [18, 18, 0], [18, -18, 0], [-18, 18, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 18, 40), disc(0, 0, 15.5, 40), 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, 5.5), disc(0, 0, 4.3), 3, H - 4));
  put(solid(g), prism(P, front, disc(0, 0, 8), disc(0, 0, 6.5), H - 7, H - 2));
  const head = solid(g);
  head.sil.classList.add("hi");
  const ring = mk("path", { class: "nf lo" }, g), ring2 = mk("path", { class: "nf lo" }, g);
  const dot = mk("circle", { r: 2.2, class: "dot m" }, g);

  const th = spring(REST);
  // the face's winding at rest: when it flips, the face has turned away and its marks are hidden
  const area = (f) => f.reduce((s, p, i) => { const n = f[(i + 1) % f.length]; return s + p[0] * n[1] - n[0] * p[1]; }, 0);
  const sgn = Math.sign(area(inner.map((q) => P(...W(q.u, q.v, HW, 0)))));
  let last = NaN;
  function draw() {
    const a = th.x;
    if (a === last) return;
    last = a;
    const t = rad(a), at = (q, w) => P(...W(q.u, q.v, w, t));
    const pts = outer.map((q) => at(q, 0)).concat(outer.map((q) => at(q, HW)));
    head.sil.setAttribute("d", poly(hull(pts)));
    const fc = inner.map((q) => at(q, HW)), show = area(fc) * sgn > 0;
    head.cr.setAttribute("d", show ? poly(fc) : "");
    ring.setAttribute("d", show ? poly(tap.map((q) => at({ u: q.u + 4, v: q.v }, HW))) : "");
    ring2.setAttribute("d", show ? poly(tap.map((q) => at({ u: q.u * 0.45 + 4, v: q.v * 0.45 }, HW))) : "");
    place(dot, at({ u: led[0], v: led[1] }, HW));
    dot.setAttribute("r", show ? 2.2 : 0);
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let a = REST;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      a = clamp((x - y * 0.3) / REACH, -1, 1) * most;
    }
    th.t = a;
    read.textContent = p ? Math.round(a) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "tickettap",
  means: "A contactless ticket reader on a post: its broad reader head tilts on its pivot to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [15, 50, 64],
  tour: [[90, 140], [310, 210], [150, 150], null],
  mount,
});
