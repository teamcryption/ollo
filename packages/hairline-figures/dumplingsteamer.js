/**
 * Bamboo steamer: a woven basket with a domed lid hinged at the back. The pointer tips the lid up and back to show three dumplings. At rest the lid sits just lifted, bright.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const TAU = Math.PI * 2;
const cyl = (cx, cy, r, z0, z1, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); o.push([x, y, z0], [x, y, z1]); } return o; };
const ring = (cx, cy, r, z, n = 32) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
const arc = (cx, cy, r, z, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (-0.25 + 0.5 * i / n) * Math.PI * 2 * 0.5 + Math.PI / 4 - Math.PI / 4; const b = -Math.PI / 4 + (i / n) * Math.PI; return [cx + r * Math.cos(b), cy + r * Math.sin(b), z]; });
const blk = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotZ = (p, ox, oy, a) => { const dx = p[0] - ox, dy = p[1] - oy; return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a), p[2]]; };
const rotX = (p, oy, oz, a) => { const dy = p[1] - oy, dz = p[2] - oz; return [p[0], oy + dy * Math.cos(a) - dz * Math.sin(a), oz + dy * Math.sin(a) + dz * Math.cos(a)]; };

const L = (p, t) => rotX(p, -24, 22, t * 1.5);
const dump = (x, y) => ({ k: 'h', late: 7, p: [...ring(x, y, 6, 15, 16), ...ring(x, y, 4, 19, 12), ...ring(x, y, 1.5, 22, 8)] });
const parts = [
  { k: 'h', p: cyl(0, 0, 24, 0, 22, 40) },
  { k: 'a', c: 'nf lo', p: arc(0, 0, 24, 7, 20) },
  { k: 'a', c: 'nf lo', p: arc(0, 0, 24, 14, 20) },
  { k: 'r', c: 'nf', p: ring(0, 0, 21.5, 22, 40) },
  dump(-6, 6), dump(8, 4), dump(2, -9),
  { k: 'h', c: 'sil', p: (t) => [...ring(0, 0, 24.5, 22, 40), ...ring(0, 0, 24.5, 28, 40), ...ring(0, 0, 17, 34, 32), ...ring(0, 0, 8, 38, 24)].map((q) => L(q, t)) },
  { k: 'h', p: (t) => cyl(0, 0, 3, 38, 42, 12).map((q) => L(q, t)) }
];
const READ = ["rest","open"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 3.5);
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
  name: "dumplingsteamer",
  means: "A bamboo steamer: the pointer tips its domed lid up and back to show the dumplings inside; the slider sets how far it opens.",
  rules: [1, 3, 4, 5],
  range: [50, 75, 100],
  tour: [[178,193],[200,210],[160,225], null],
  mount,
});
