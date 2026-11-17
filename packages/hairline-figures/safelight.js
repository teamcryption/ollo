/**
 * Safelight: a darkroom safelight, a deep lamp housing with its filter
 * glass on the front, hung in a yoke on a post over a round foot. The
 * pointer over the lamp tips the housing down on its pivot, aiming the
 * filter at the bench. At rest it looks level, the filter rim bright.
 * The slider is how far it tips.
 *
 * The pattern: one part tilting on a pivot; the hit is the rest box.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rrect, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 52, HD = 12, HW = 22, HH = 17, T0 = 6;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.9);
  const ext = [[-20, -20, 0], [20, 20, 0], [20, -20, 0], [-20, 20, 0], [-HD, -HW, PZ + HH + 4], [HD + 8, HW, PZ - HH - 14], [-HD, HW, PZ + HH + 4]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 18), disc(0, 0, 16.4), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, 2.6, 16), disc(0, 0, 1.6, 16), 4, PZ - HH - 4));
  // the yoke: a bar across under the lamp, arms up to the pivots
  const yoke = rrect(-2.4, -HW - 4, 2.4, HW + 4, 2, 4);
  put(solid(g), prism(P, front, yoke, rrect(-1.4, -HW - 3, 1.4, HW + 3, 1.4, 4), PZ - HH - 6, PZ - HH - 3));
  const lamp = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf" }, g), glass = mk("path", { class: "nf lo" }, g);
  const pv = mk("path", { class: "nf" }, g);
  const ring = (x, inset) => rrect(-HW + inset, -HH + inset, HW - inset, HH + inset * 0 - inset, 5 - inset * 0.5, 6).map((q) => [x, q.u, q.v]);
  let last = NaN, sgn = 1;
  { const c0 = Math.cos(rad(T0)), s0 = Math.sin(rad(T0)), f0 = ring(HD, 0).map(([x, y, z]) => P(x * c0 + z * s0, y, PZ - x * s0 + z * c0));
    let A = 0;
    for (let i = 0; i < f0.length; i++) { const p = f0[i], q = f0[(i + 1) % f0.length]; A += p[0] * q[1] - q[0] * p[1]; }
    sgn = Math.sign(A); }
  function draw(t) {
    if (t === last) return;
    last = t;
    const th = rad(T0 + t * tip), c = Math.cos(th), s = Math.sin(th);
    const R = ([x, y, z]) => P(x * c + z * s, y, PZ - x * s + z * c);
    const back = ring(-HD, 0).map(R), fr = ring(HD, 0).map(R), gl = ring(HD, 3.5).map(R);
    lamp.setAttribute("d", poly(hull(back.concat(fr))));
    let A = 0;
    for (let i = 0; i < fr.length; i++) { const p = fr[i], q = fr[(i + 1) % fr.length]; A += p[0] * q[1] - q[0] * p[1]; }
    const shows = A * sgn > 0;
    face.setAttribute("d", shows ? poly(fr) : "");
    glass.setAttribute("d", shows ? poly(gl) : "");
    lamp.classList.toggle("hi", !shows);
    const a = R([0, HW + 0.5, 0]), b = R([0, -HW - 0.5, 0]);
    pv.setAttribute("d", poly(disc(0, 0, 2.2, 12).map((q) => [a[0] + q.u, a[1] + q.v * 0.8])) + poly(disc(0, 0, 2.2, 12).map((q) => [b[0] + q.u, b[1] + q.v * 0.8])));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const pts = ext.map((p) => P(...p)), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a > 0 ? 1 : 0, performance.now(), 0);
    face.classList.add("hi");
    read.textContent = a > 0 ? "tip " + Math.round(T0 + tip) + "°" : "rest";
    B.wake();
  }
  setActive(0);
  const hit = ([sx, sy]) => (sx > x0 && sx < x1 && sy > y0 && sy < y1 ? 1 : 0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "safelight",
  means: "A darkroom safelight on a post: with the pointer over it, the lamp housing tips down on its yoke to aim the filter at the bench.",
  rules: [1, 5, 6],
  range: [20, 40, 55],
  tour: [[200, 106], [200, 220], [230, 140], null],
  mount,
});
