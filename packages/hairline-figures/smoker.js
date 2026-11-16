/**
 * Smoker box: a barbecue smoker on its firebox with a chimney. The pointer swings its big front door open on the right hinge to show the grates. At rest the door stands ajar, bright.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const TAU = Math.PI * 2;
const cyl = (cx, cy, r, z0, z1, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); o.push([x, y, z0], [x, y, z1]); } return o; };
const ring = (cx, cy, r, z, n = 32) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
const arc = (cx, cy, r, z, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (-0.25 + 0.5 * i / n) * Math.PI * 2 * 0.5 + Math.PI / 4 - Math.PI / 4; const b = -Math.PI / 4 + (i / n) * Math.PI; return [cx + r * Math.cos(b), cy + r * Math.sin(b), z]; });
const blk = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotZ = (p, ox, oy, a) => { const dx = p[0] - ox, dy = p[1] - oy; return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a), p[2]]; };
const rotX = (p, oy, oz, a) => { const dy = p[1] - oy, dz = p[2] - oz; return [p[0], oy + dy * Math.cos(a) - dz * Math.sin(a), oz + dy * Math.sin(a) + dz * Math.cos(a)]; };

const D = (p, t) => rotZ(p, 46, 32, -t * 1.9);
const parts = [
  { k: 'h', p: blk(-14, 6, 0, 0, 28, 24) },
  { k: 'h', p: cyl(6, 8, 3.5, 50, 72, 16) },
  { k: 'h', p: blk(0, 0, 0, 46, 32, 50) },
  ...[16, 24, 32, 40].map((z) => ({ k: 'l', c: 'nf lo', p: [[4, 32, z], [42, 32, z]] })),
  { k: 'r', c: 'nf lo', p: [[3, 32, 6], [43, 32, 6], [43, 32, 46], [3, 32, 46]] },
  { k: 'h', c: 'sil', p: (t) => blk(2, 32, 5, 46, 34, 47).map((q) => D(q, t)) },
  { k: 'h', p: (t) => blk(6, 34, 22, 9, 38, 30).map((q) => D(q, t)) }
];
const READ = ["rest","open"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 3);
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
  const els = parts.map((pt) => { const e = mk("path", { class: pt.c || "", d: dOf(pt, 0.18) }, g); return e; });
  const live = parts.map((pt, i) => [pt, els[i]]).filter(([pt]) => typeof pt.p === "function");
  const late = parts.map((pt, i) => [pt, els[i]]).filter(([pt]) => pt.late);
  const T = tween(0.18);
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
    tset(T, o ? Math.max(0.18 + 0.1, amp) : 0.18, performance.now(), 0);
    read.textContent = o ? READ[1] : READ[0];
    B.wake();
  }
  go(false);
  bag.add(pointer(stage, { move: () => go(true), leave: () => go(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (on) { on = null; go(true); } }, destroy: bag.dispose };
}

hairline({
  name: "smoker",
  means: "A barbecue smoker: the pointer swings its front door open on its hinge to show the grates inside; the slider sets how far.",
  rules: [1, 3, 4, 5],
  range: [50, 75, 100],
  tour: [[177,140],[200,180],[160,215], null],
  mount,
});
