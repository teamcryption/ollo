/**
 * Tortilla press: two round plates hinged at the back with a long lever. The pointer swings the top plate and lever up to show the dough ball. At rest the plate sits just open, bright.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const TAU = Math.PI * 2;
const cyl = (cx, cy, r, z0, z1, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); o.push([x, y, z0], [x, y, z1]); } return o; };
const ring = (cx, cy, r, z, n = 32) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
const arc = (cx, cy, r, z, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (-0.25 + 0.5 * i / n) * Math.PI * 2 * 0.5 + Math.PI / 4 - Math.PI / 4; const b = -Math.PI / 4 + (i / n) * Math.PI; return [cx + r * Math.cos(b), cy + r * Math.sin(b), z]; });
const blk = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotZ = (p, ox, oy, a) => { const dx = p[0] - ox, dy = p[1] - oy; return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a), p[2]]; };
const rotX = (p, oy, oz, a) => { const dy = p[1] - oy, dz = p[2] - oz; return [p[0], oy + dy * Math.cos(a) - dz * Math.sin(a), oz + dy * Math.sin(a) + dz * Math.cos(a)]; };

const H = (p, t) => rotX(p, 2, 7, t * 1.15);
const parts = [
  { k: 'h', p: cyl(25, 26, 24, 0, 5, 36) },
  { k: 'h', p: blk(20, -4, 0, 30, 4, 12) },
  { k: 'h', c: 'nf', p: [...ring(25, 30, 7, 5, 18), ...ring(25, 30, 4, 8.5, 14)] },
  { k: 'h', c: 'sil', p: (t) => cyl(25, 26, 23, 7, 11, 36).map((q) => H(q, t)) },
  { k: 'h', p: (t) => blk(22, -2, 11, 28, 56, 14).map((q) => H(q, t)) },
  { k: 'h', p: (t) => blk(21, 48, 10, 29, 58, 15).map((q) => H(q, t)) }
];
const READ = ["rest","open"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 4.6);
  const ext = [];
  for (const pt of parts) for (const t of [0, 1]) ext.push(...(typeof pt.p === "function" ? pt.p(t) : pt.p));
  fit(C, ext, 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const dOf = (pt, t) => {
    const q = (typeof pt.p === "function" ? pt.p(t) : pt.p).map((v) => P(v[0], v[1], v[2]));
    if (pt.k === "h") return poly(hull(q));
    if (pt.k === "r") return poly(q);
    return "M" + q.map((v) => v[0].toFixed(1) + "," + v[1].toFixed(1)).join("L");
  };
  const els = parts.map((pt) => { const e = mk("path", { class: pt.c || "", d: dOf(pt, 0.15) }, g); return e; });
  const live = parts.map((pt, i) => [pt, els[i]]).filter(([pt]) => typeof pt.p === "function");
  const late = parts.map((pt, i) => [pt, els[i]]).filter(([pt]) => pt.late);
  const T = tween(0.15);
  let last = NaN, front = false;
  const B = register(stage, (_dt, now) => {
    const t = tval(T, now);
    if (t !== last) {
      last = t;
      for (const [pt, e] of live) e.setAttribute("d", dOf(pt, t));
      const f = t > 0.45;
      if (f !== front) { front = f; for (const [pt, e] of late) (f ? g.append(e) : els[pt.late].before(e)); }
    }
    return !tdone(T, now);
  });
  bag.add(B.unregister);
  for (const [pt, e] of parts.map((pt, i) => [pt, els[i]])) if (pt.c === "sil") e.classList.add("hi");
  let on = null;
  function go(o) {
    if (o === on) return;
    on = o;
    tset(T, o ? Math.max(0.15 + 0.1, amp) : 0.15, performance.now(), 0);
    read.textContent = o ? READ[1] : READ[0];
    B.wake();
  }
  go(false);
  bag.add(pointer(stage, { move: () => go(true), leave: () => go(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (on) { on = null; go(true); } }, destroy: bag.dispose };
}

hairline({
  name: "tortillapress",
  means: "A tortilla press: the pointer swings the top plate and its lever up on the back hinge, showing the dough ball; the slider sets how far.",
  rules: [1, 3, 4, 5],
  range: [50, 75, 100],
  tour: [[144,244],[170,230],[120,255], null],
  mount,
});
