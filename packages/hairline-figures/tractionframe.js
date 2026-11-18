/**
 * Traction frame: a hospital bed under an overhead beam on two uprights, a leg
 * splint on the mattress, and a cord from the splint up over two pulleys to a
 * weight hanging past the foot of the bed. At rest the weight is bright; the
 * pointer on the bed lets the weight drop, and the cord lifts the splint. The
 * slider is how far the weight falls.
 */
const { Cam, fit, hull, poly, proj, tween, tset, tval, tdone, disposer, mk, pointer, register, rad, rrect } = HL;

const slab = (x0, y0, x1, y1, z0, z1, r) => rrect(x0, y0, x1, y1, r, 4).flatMap((q) => [[q.u, q.v, z0], [q.u, q.v, z1]]);
const tube = (a, b, r, n = 8) => {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], m = Math.hypot(...d), e = d.map((v) => v / m);
  const k = Math.abs(e[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [e[1] * k[2] - e[2] * k[1], e[2] * k[0] - e[0] * k[2], e[0] * k[1] - e[1] * k[0]];
  const um = Math.hypot(...u); u = u.map((v) => v / um);
  const v = [e[1] * u[2] - e[2] * u[1], e[2] * u[0] - e[0] * u[2], e[0] * u[1] - e[1] * u[0]], out = [];
  for (const o of [a, b]) for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, c = Math.cos(t) * r, s = Math.sin(t) * r;
    out.push([o[0] + u[0] * c + v[0] * s, o[1] + u[1] * c + v[1] * s, o[2] + u[2] * c + v[2] * s]);
  }
  return out;
};
const wheel = (x, z, r) => {
  const out = [];
  for (const dy of [17.5, 22.5]) for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; out.push([x + Math.cos(a) * r, dy, z + Math.sin(a) * r]); }
  return out;
};
const ZB = 100, AX = 84, BX = 102, SX = 48, SZ = 41;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const lift = (p, f) => {
    const a = rad(32 * f), c = Math.cos(a), s = Math.sin(a), dx = p[0] - SX, dz = p[2] - SZ;
    return [SX + dx * c - dz * s, p[1], SZ + dx * s + dz * c];
  };
  const wtop = (f) => 62 - 38 * f;
  const shapes = [
    { pts: tube([-6, 20, 26], [-6, 20, ZB], 1.8) },
    { pts: slab(-8, 0, -2, 40, 18, 56, 3) },
    ...[[4, 4], [86, 4], [4, 36], [86, 36]].map(([x, y]) => ({ pts: tube([x, y, 0], [x, y, 24], 1.8) })),
    { pts: slab(0, 0, 90, 40, 22, 30, 4) },
    { pts: slab(2, 2, 88, 38, 30, 37, 6) },
    { pts: slab(SX, 13, 88, 27, 37, 45, 5), mv: (p, f) => lift(p, f), splint: true },
    { mv: (_p, f) => null, cord: (f) => tube(lift([86, 20, 45], f), [AX, 20, ZB - 3], 0.5, 4) },
    { pts: tube([94, 20, 26], [94, 20, ZB], 1.8) },
    { pts: tube([-6, 20, ZB], [BX + 3, 20, ZB], 2) },
    { pts: wheel(AX, ZB - 3, 3.5) },
    { pts: wheel(BX, ZB - 3, 3.5) },
    { mv: () => null, cord: (f) => tube([BX + 3.5, 20, ZB - 3], [BX + 3.5, 20, wtop(f)], 0.5, 4) },
    { pts: slab(BX - 2, 14, BX + 9, 26, 48, 62, 3), mv: (p, f) => [p[0], p[1], p[2] - 38 * f], mark: true },
  ];
  const pts = (s, t) => (s.cord ? s.cord(t * amp) : s.mv ? s.pts.map((p) => s.mv(p, t * amp)) : s.pts);
  const C = Cam(45, 0.5, 1.95);
  const all = [];
  for (const s of shapes) for (const f of [0, 1.2]) all.push(...(s.cord ? s.cord(f) : s.mv ? s.pts.map((p) => s.mv(p, f)) : s.pts));
  fit(C, all, 200, 164);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const path = (s, t) => poly(hull(pts(s, t).map((p) => P(...p))));
  for (const s of shapes) { s.el = mk("path", { class: s.cord ? "sil nf" : "sil" }, g); s.el.setAttribute("d", path(s, 0)); }
  const rest = shapes.flatMap((s) => (s.cord ? s.cord(0) : s.pts).map((p) => P(...p)));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const hb = [Math.min(...xs) - 6, Math.min(...ys) - 6, Math.max(...xs) + 6, Math.max(...ys) + 6];
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    for (const s of shapes) if (s.mv) s.el.setAttribute("d", path(s, t));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    for (const s of shapes) s.el.classList.toggle("hi", a ? !!s.splint : !!s.mark);
    read.textContent = a ? "pull" : "rest";
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
  name: "tractionframe",
  means: "A traction frame over a bed: the weight drops on its cord over the pulleys and lifts the leg splint.",
  rules: [1, 3, 4, 5, 6],
  range: [0.4, 1, 1.2],
  tour: [[232, 187], [283, 192], [155, 102], null],
  mount,
});
