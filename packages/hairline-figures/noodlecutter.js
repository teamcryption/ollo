/**
 * Noodle cutter: a ridged roller on a handle over a sheet of dough on a board. The pointer rolls the cutter along the sheet and the cut strands follow it. At rest the roller waits at the near end, bright.
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const TAU = Math.PI * 2;
const cyl = (cx, cy, r, z0, z1, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * TAU, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); o.push([x, y, z0], [x, y, z1]); } return o; };
const ring = (cx, cy, r, z, n = 32) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
const arc = (cx, cy, r, z, n = 16) => Array.from({ length: n + 1 }, (_, i) => { const a = (-0.25 + 0.5 * i / n) * Math.PI * 2 * 0.5 + Math.PI / 4 - Math.PI / 4; const b = -Math.PI / 4 + (i / n) * Math.PI; return [cx + r * Math.cos(b), cy + r * Math.sin(b), z]; });
const blk = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];
const rotZ = (p, ox, oy, a) => { const dx = p[0] - ox, dy = p[1] - oy; return [ox + dx * Math.cos(a) - dy * Math.sin(a), oy + dx * Math.sin(a) + dy * Math.cos(a), p[2]]; };
const rotX = (p, oy, oz, a) => { const dy = p[1] - oy, dz = p[2] - oz; return [p[0], oy + dy * Math.cos(a) - dz * Math.sin(a), oz + dy * Math.sin(a) + dz * Math.cos(a)]; };

const X = (t) => 14 + 60 * t, RZ = 14;
const rol = (t, y0, y1, r) => { const o = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; o.push([X(t) + r * Math.cos(a), y0, RZ + r * Math.sin(a)], [X(t) + r * Math.cos(a), y1, RZ + r * Math.sin(a)]); } return o; };
const blade = (y) => (t) => Array.from({ length: 13 }, (_, i) => { const b = -Math.PI / 2 + (i / 12) * Math.PI; return [X(t) + 10.5 * Math.cos(b), y, RZ + 10.5 * Math.sin(b)]; });
const parts = [
  { k: 'h', p: blk(0, 0, 0, 92, 52, 4) },
  { k: 'h', p: blk(6, 6, 4, 86, 46, 5) },
  ...[12, 18, 24, 30, 36, 42].map((y) => ({ k: 'l', c: 'nf lo', p: (t) => [[6, y, 5], [X(t), y, 5]] })),
  { k: 'h', p: (t) => rol(t, 6, 46, 9) },
  ...[10, 16, 22, 28, 34, 40].map((y) => ({ k: 'a', c: 'nf', p: blade(y) })),
  { k: 'h', c: 'sil', p: (t) => [[X(t), 2, RZ], [X(t), 50, RZ], [X(t) - 22, 24, RZ + 30], [X(t) - 22, 28, RZ + 30], [X(t) - 23, 24, RZ + 33], [X(t) - 23, 28, RZ + 33]].concat([[X(t), 4, RZ + 2], [X(t), 48, RZ + 2]]) },
  { k: 'h', p: (t) => cyl(0, 0, 2.5, 0, 22, 12).map((q) => [X(t) - 22 - q[2] * 0.6, 26 + q[1], RZ + 30 + q[2] * 0.8 + q[0] * 0]) }
];
const READ = ["rest","rolled"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.4);
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
  const els = parts.map((pt) => { const e = mk("path", { class: pt.c || "", d: dOf(pt, 0.12) }, g); return e; });
  const live = parts.map((pt, i) => [pt, els[i]]).filter(([pt]) => typeof pt.p === "function");
  const late = parts.map((pt, i) => [pt, els[i]]).filter(([pt]) => pt.late);
  const T = tween(0.12);
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
    tset(T, o ? Math.max(0.12 + 0.1, amp) : 0.12, performance.now(), 0);
    read.textContent = o ? READ[1] : READ[0];
    B.wake();
  }
  go(false);
  bag.add(pointer(stage, { move: () => go(true), leave: () => go(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (on) { on = null; go(true); } }, destroy: bag.dispose };
}

hairline({
  name: "noodlecutter",
  means: "A noodle cutter: the pointer rolls the ridged roller along the dough sheet, cutting strands behind it; the slider sets how far it rolls.",
  rules: [1, 3, 4, 5],
  range: [50, 75, 100],
  tour: [[146,146],[180,200],[210,240], null],
  mount,
});
