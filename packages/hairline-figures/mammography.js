/**
 * Mammography unit: a column on a base, and on it a rotating arm that carries
 * the x-ray head at the top, the detector table below and the compression
 * paddle between them. At rest the paddle is bright, raised; the pointer on
 * the unit turns the arm to an oblique view and lowers the paddle onto the
 * table. The slider is how far the arm turns and the paddle comes down.
 */
const { Cam, fit, hull, poly, proj, tween, tset, tval, tdone, disposer, mk, pointer, register, rad, rrect } = HL;

const slab = (x0, y0, x1, y1, z0, z1, r) => rrect(x0, y0, x1, y1, r, 4).flatMap((q) => [[q.u, q.v, z0], [q.u, q.v, z1]]);
const PY = 15, PZ = 100;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const shapes = [
    { pts: slab(-16, -12, 34, 42, 0, 6, 8), k: 0 },
    { pts: slab(0, 3, 20, 27, 6, 152, 6), k: 0 },
    { pts: slab(18, 7, 27, 23, 48, 154, 3), k: 1 },
    { pts: slab(38, 8, 56, 22, 126, 134, 3), k: 1 },
    { pts: slab(20, 1, 70, 29, 132, 154, 8), k: 1 },
    { pts: slab(20, 0, 72, 30, 64, 73, 5), k: 1 },
    { pts: slab(22, 11, 30, 19, 96, 116, 2), k: 2 },
    { pts: slab(27, 3, 66, 27, 96, 99, 3), k: 2, mark: true },
  ];
  const X = (p, k, t, a) => {
    if (!k) return p;
    const f = t * a, z = k === 2 ? p[2] - 16 * f : p[2];
    const ang = rad(36 * f), c = Math.cos(ang), s = Math.sin(ang), dy = p[1] - PY, dz = z - PZ;
    return [p[0], PY + dy * c - dz * s, PZ + dy * s + dz * c];
  };
  const C = Cam(45, 0.5, 1.75);
  const all = [];
  for (const s of shapes) for (const p of s.pts) all.push(p, X(p, s.k, 1, 1.2));
  fit(C, all, 200, 162);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const path = (s, t) => poly(hull(s.pts.map((p) => P(...X(p, s.k, t, amp)))));
  for (const s of shapes) { s.el = mk("path", { class: "sil" + (s.mark ? " hi" : "") }, g); s.el.setAttribute("d", path(s, 0)); }
  const rest = shapes.flatMap((s) => s.pts.map((p) => P(...p)));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const hb = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    for (const s of shapes) if (s.k) s.el.setAttribute("d", path(s, t));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "oblique" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => set(x > hb[0] && x < hb[2] && y > hb[1] && y < hb[3]),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); }, destroy: bag.dispose };
}

hairline({
  name: "mammography",
  means: "A mammography unit: the arm turns to an oblique view and the compression paddle comes down onto the detector table.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 1, 1.2],
  tour: [[211, 141], [258, 64], [160, 250], null],
  mount,
});
