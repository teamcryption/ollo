/**
 * Rollator: two side frames on four wheels, grips with brake levers, a seat
 * slung between the frames. At rest it stands open, the near grip bright; the
 * pointer on it folds it: the seat flips up against the far frame and the near
 * frame closes in toward it. The slider is how far it folds.
 */
const { Cam, fit, hull, poly, proj, tween, tset, tval, tdone, disposer, mk, pointer, register, rad, rrect } = HL;

const L = 46, W = 40, H = 70, ZS = 36;
const perp = (d) => {
  const a = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = [d[1] * a[2] - d[2] * a[1], d[2] * a[0] - d[0] * a[2], d[0] * a[1] - d[1] * a[0]];
  const m = Math.hypot(...u); return u.map((v) => v / m);
};
const tube = (a, b, r, n = 8) => {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], m = Math.hypot(...d), e = d.map((v) => v / m);
  const u = perp(e), v = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]], out = [];
  for (const o of [a, b]) for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, c = Math.cos(t) * r, s = Math.sin(t) * r;
    out.push([o[0] + u[0] * c + v[0] * s, o[1] + u[1] * c + v[1] * s, o[2] + u[2] * c + v[2] * s]);
  }
  return out;
};
const wheel = (x, y) => {
  const out = [];
  for (const dy of [-1.8, 1.8]) for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; out.push([x + Math.cos(a) * 8, y + dy, 8 + Math.sin(a) * 8]); }
  return out;
};
const slab = (x0, y0, x1, y1, z0, z1, r) => rrect(x0, y0, x1, y1, r, 4).flatMap((q) => [[q.u, q.v, z0], [q.u, q.v, z1]]);

const side = (y, k, bright) => [
  { pts: wheel(2, y), k }, { pts: wheel(L, y), k },
  { pts: tube([2, y, 8], [L - 6, y, H - 4], 1.6), k },
  { pts: tube([L, y, 8], [L - 4, y, H], 1.6), k },
  { pts: tube([18, y, ZS - 2], [L - 1, y, ZS - 2], 1.3), k },
  { pts: tube([L + 2, y, H - 5], [L + 12, y, H - 2], 1.1), k, mark: bright },
  { pts: tube([L - 5, y, H], [L + 12, y, H + 2], 2.4), k, mark: bright },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const shapes = [
    ...side(0, 0, false),
    { pts: tube([L - 1, 0, 26], [L - 1, W, 26], 1.3), k: 1 },
    { pts: slab(18, 2, L - 2, W - 2, ZS - 1, ZS + 2, 4), k: 2, seat: true },
    ...side(W, 1, true),
  ];
  const X = (p, k, t, a) => {
    const f = t * a;
    if (k === 1 && p[1] > W / 2) return [p[0], p[1] - f * 0.5 * W, p[2]];
    if (k === 2) {
      const ang = rad(f * 80), c = Math.cos(ang), s = Math.sin(ang), dy = p[1] - 3, dz = p[2] - ZS;
      return [p[0], 3 + dy * c - dz * s, ZS + dy * s + dz * c];
    }
    return p;
  };
  const C = Cam(45, 0.5, 2.45);
  const all = [];
  for (const s of shapes) for (const p of s.pts) all.push(p, X(p, s.k, 1, 1.15));
  fit(C, all, 200, 164);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const path = (s, t) => poly(hull(s.pts.map((p) => P(...X(p, s.k, t, amp)))));
  for (const s of shapes) { s.el = mk("path", { class: "sil" }, g); s.el.setAttribute("d", path(s, 0)); }
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
    for (const s of shapes) s.el.classList.toggle("hi", a ? !!s.seat : !!s.mark);
    read.textContent = a ? "fold" : "rest";
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
  name: "rollator",
  means: "A rollator on four wheels: the seat flips up and the near frame folds in toward the far one.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 1, 1.15],
  tour: [[206, 158], [189, 174], [220, 124], null],
  mount,
});
