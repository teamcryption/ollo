/**
 * Butter churn: a tall tapered barrel with hooped bands and a lid on a plunger with a cross handle. The pointer lifts the plunger and turns its handle. At rest the lid sits a little raised, bright.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const TAU = Math.PI * 2;
const cyl = (cx, cy, r, z0, z1, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); o.push([x, y, z0], [x, y, z1]); } return o; };
const ring = (cx, cy, r, z, n = 32) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
const arc = (cx, cy, r, z, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (-0.25 + 0.5 * i / n) * Math.PI * 2 * 0.5 + Math.PI / 4 - Math.PI / 4; const b = -Math.PI / 4 + (i / n) * Math.PI; return [cx + r * Math.cos(b), cy + r * Math.sin(b), z]; });
const blk = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotZ = (p, ox, oy, a) => { const dx = p[0] - ox, dy = p[1] - oy; return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a), p[2]]; };
const rotX = (p, oy, oz, a) => { const dy = p[1] - oy, dz = p[2] - oz; return [p[0], oy + dy * Math.cos(a) - dz * Math.sin(a), oz + dy * Math.sin(a) + dz * Math.cos(a)]; };

const U = (p, t) => { const q = rotZ(p, 0, 0, t * 1.4); return [q[0], q[1], q[2] + t * 17]; };
const parts = [
  { k: 'h', p: [...ring(0, 0, 21, 0), ...ring(0, 0, 15, 54)] },
  { k: 'a', c: 'nf lo', p: arc(0, 0, 20.2, 10) },
  { k: 'a', c: 'nf lo', p: arc(0, 0, 16, 44) },
  { k: 'r', c: 'nf', p: ring(0, 0, 11, 54) },
  { k: 'h', p: (t) => cyl(0, 0, 2, 54, 92, 12).map((q) => U(q, t)) },
  { k: 'h', c: 'sil', p: (t) => cyl(0, 0, 16.5, 55, 59, 32).map((q) => U(q, t)) },
  { k: 'h', p: (t) => cyl(0, 0, 2, 59, 92, 12).map((q) => U(q, t)) },
  { k: 'h', p: (t) => blk(-14, -2, 90, 14, 2, 94).map((q) => U(q, t)) }
];
const READ = ["rest","up"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.75);
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
  name: "butterchurn",
  means: "A butter churn: the pointer lifts the plunger, lid and cross handle out of the barrel and turns them a quarter; the slider sets how far.",
  rules: [1, 3, 4, 5],
  range: [50, 75, 100],
  tour: [[200,165],[200,110],[200,200], null],
  mount,
});
