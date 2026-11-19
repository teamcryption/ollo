/**
 * Hook-a-duck: a water trough at the fair with one duck afloat on it, and a
 * fishing pole leaning over it from the side, its line ending in a hook
 * that just touches the duck's head. The pointer hooks the duck: the pole
 * swings up and lifts the duck clear of the water, dangling on the line.
 * At rest the duck is bright. The slider is how high the pole lifts.
 *
 * The pattern: one part turning about a hinge (swing) carrying a load.
 */
const { Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const WZ = 16, HD = [54, -46, 30], L = 26, D0 = [4, 6];
const ell = (x, y, a, b, n = 24) => circ(1, n).map((q) => { const u = q.u * a, v = q.v * b; return { u: x + (u - v) * 0.707, v: y + (-u - v) * 0.707 }; });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.12);
  fit(C, [[-42, -26, 0], [42, 26, 0], [42, -26, 0], [-42, 26, 0], [58, -50, 30], [10, 0, 134], [4, 6, 48]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-42, -26, 42, 26, 12, 3);
  put(solid(g), prism(P, front, tr, ti, 0, WZ));
  // ripples on the water, round where the duck floats
  mk("path", { d: poly(ell(D0[0], D0[1], 20, 14, 36).map((q) => P(q.u, q.v, WZ))), class: "nf lo" }, g);
  const body = mk("path", { class: "sil" }, g), head = mk("path", { class: "sil" }, g), beak = mk("path", { class: "nf" }, g);
  const line = mk("path", { class: "nf lo" }, g), pole = mk("path", { class: "sil" }, g);

  function cyl(a, b, r) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d), e = d.map((x) => x / n);
    let u = [e[1], -e[0], 0]; const un = Math.hypot(...u) || 1; u = u.map((x) => x / un);
    const v = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]];
    const ring = (p) => Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * Math.PI * 2; return P(...[0, 1, 2].map((j) => p[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]))); });
    return poly(hull(ring(a).concat(ring(b))));
  }

  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    const key = t * 7 + amp;
    if (key === last) return;
    last = key;
    const lift = t * amp * 74, sw = Math.sin(t * Math.PI) * 6;
    const dz = WZ + lift, dx = D0[0] + sw * 0.5, dy = D0[1] - sw * 0.5;
    const bp = [];
    for (const [s, h] of [[0.6, 0], [1, 3], [0.9, 6]]) bp.push(...ell(dx, dy, 13 * s, 8 * s).map((q) => P(q.u, q.v, dz + h)));
    bp.push(P(dx - 10 * 0.707, dy + 10 * 0.707, dz + 10));
    body.setAttribute("d", poly(hull(bp)));
    const hx = dx + 6, hy = dy - 6, hp = [];
    for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI; hp.push(...ell(hx, hy, 5.5 * Math.sin(a) + 0.01, 5.5 * Math.sin(a) + 0.01, 16).map((q) => P(q.u, q.v, dz + 9 - 5.5 * Math.cos(a)))); }
    head.setAttribute("d", poly(hull(hp)));
    beak.setAttribute("d", poly(hull([P(hx + 3.5, hy - 3.5, dz + 10), P(hx + 3.5, hy - 3.5, dz + 7.5), P(hx + 8, hy - 8, dz + 8.6)])));
    const top = [hx, hy, dz + 15], tip = [hx, hy, top[2] + L];
    line.setAttribute("d", open([P(...tip), P(...top), P(top[0] + 1.5, top[1] + 1.5, top[2] - 3)]));
    const ex = tip.map((x, j) => x + (tip[j] - HD[j]) * 0.08);
    pole.setAttribute("d", cyl(HD, ex, 2));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(10, -10, 30);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 1 : 0, performance.now(), 0);
    body.classList.toggle("hi", true);
    head.classList.toggle("hi", true);
    read.textContent = on ? "hooked" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 110;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hookaduck",
  means: "A hook-a-duck trough: over it, the pole swings up and lifts the hooked duck clear of the water on its line.",
  rules: [1, 4, 5, 8],
  range: [0.3, 1, 1],
  tour: [[167, 222], [272, 244], [200, 180], null],
  mount,
});
