const { Cam, fit, proj, unproj, hull, poly, spring, stepS, disposer, mk, pointer, register, clamp } = HL;
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul = (a, s) => a.map((x) => x * s);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
// a cylinder from its centre, axis, radius and half length: [end ring, end ring]
function cyl(c, a, r, h, n = 20) {
  a = norm(a);
  const u = norm(cross(a, Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(a, u), e0 = [], e1 = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2, o = add(mul(u, r * Math.cos(t)), mul(v, r * Math.sin(t)));
    e0.push(add(add(c, mul(a, -h)), o)); e1.push(add(add(c, mul(a, h)), o));
  }
  return [e0, e1];
}
// a box from its centre and half sizes: [bottom face, top face]
const box = (c, hx, hy, hz) => [-1, 1].map((k) => [[-1, -1], [-1, 1], [1, 1], [1, -1]].map(([i, j]) => [c[0] + i * hx, c[1] + j * hy, c[2] + k * hz]));
const rz = (a, o = [0, 0, 0]) => (p) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - o[0], y = p[1] - o[1]; return [o[0] + x * c - y * s, o[1] + x * s + y * c, p[2]]; };
const rx = (a, o = [0, 0, 0]) => (p) => { const c = Math.cos(a), s = Math.sin(a), y = p[1] - o[1], z = p[2] - o[2]; return [p[0], o[1] + y * c - z * s, o[2] + y * s + z * c]; };
const ry = (a, o = [0, 0, 0]) => (p) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - o[0], z = p[2] - o[2]; return [o[0] + x * c + z * s, p[1], o[2] - x * s + z * c]; };
const depth = (q) => q[0] + q[1] + q[2] * 0.6;

// draws parts: each a pair of rings [a, b] (in local space) moved by T, as a hull with the nearer ring as its face
function painter(g, P) {
  const els = [];
  return (parts) => {
    while (els.length < parts.length) { const e = mk("g", {}, g); els.push({ g: e, s: mk("path", { class: "sil" }, e), f: mk("path", { class: "lo" }, e) }); }
    const items = parts.map((pt, i) => {
      const [a, b] = pt.rings.map((r) => r.map(pt.T || ((p) => p)));
      const da = a.reduce((s, q) => s + depth(q), 0) / a.length, db = b.reduce((s, q) => s + depth(q), 0) / b.length;
      return { i, a, b, d: (da + db) / 2 + (pt.bias || 0), face: da > db ? a : b, hi: pt.hi };
    }).sort((p, q) => p.d - q.d);
    items.forEach((it, n) => {
      const e = els[n];
      e.s.setAttribute("d", poly(hull([...it.a, ...it.b].map((q) => P(...q)))));
      e.s.setAttribute("class", it.hi ? "sil hi" : "sil");
      e.f.setAttribute("d", poly(it.face.map((q) => P(...q))));
    });
  };
}

const A = [5, 0, 60], REST = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.4);
  fit(C, [[-16, -14, 0], [26, 14, 0], [-16, -14, 68], [26, 14, 68]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg), draw = painter(g, P);
  const sp = spring(REST, { k: 80 * value, c: 14 });
  const fixed = [
    { rings: box([0, 0, 1], 16, 3, 1), bias: -60 },
    { rings: box([-1, 0, 1.5], 3, 14, 1.5), bias: -50 },
    { rings: box([0, 0, 31], 2.5, 3.5, 29), bias: -20 },
    { rings: box([0, 0, 58], 5, 7, 8) },
    { rings: cyl([0, 8, 58], [0, 1, 0], 9, 1.4, 36) },
  ];
  function frame() {
    const t = sp.x, parts = [...fixed];
    for (const s of [-1, 1]) {
      const a = [A[0], s * 4, A[2]], h = [A[0] + 4 + t * 16, s * (5 + t * 5), A[2] - 6 - t * 36];
      const d = [h[0] - a[0], h[1] - a[1], h[2] - a[2]], l = Math.hypot(...d);
      parts.push({ rings: cyl(mul(add(a, h), 0.5), d, 0.4, l / 2, 6), bias: 30 });
      parts.push({ rings: cyl([h[0], h[1], h[2] - 4], [0, 0, 1], 1.8, 4.5, 14), hi: s > 0, bias: 30 });
    }
    draw(parts);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); frame(); return m; });
  bag.add(B.unregister);
  function aim(w) {
    sp.t = w ? clamp((w[0] + w[1] + 10) / 50, 0, 1) : REST;
    read.textContent = w ? Math.round(sp.t * 100) + "%" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const w = unproj(C, p[0], p[1], 0); aim(Math.hypot(w[0], w[1]) > 70 ? null : w); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  frame(); aim(null);
  return { set: (v) => { sp.k = 80 * v; }, destroy: bag.dispose };
}

hairline({
  name: "skiergym",
  means: "A ski erg tower: its two handles pull down and out on their cords as the pointer comes near, one handle bright.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.6],
  tour: [[230, 280], [186, 50], [150, 280], null],
  mount,
});
