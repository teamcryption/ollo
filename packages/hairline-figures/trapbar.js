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

const Z = 12, HEX = [[-24, 0], [-12, -13], [12, -13], [24, 0], [12, 13], [-12, 13]], REST = 0.5;
const rod = (a, b, r) => { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d); return cyl(mul(add(a, b), 0.5), d, r, l / 2, 12); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.75);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([50 * Math.cos(a), 50 * Math.sin(a), 0], [50 * Math.cos(a), 50 * Math.sin(a), 24]); }
  fit(C, ext, 200, 160);
  const P = proj(C), g = mk("g", {}, svg), draw = painter(g, P);
  const sp = spring(REST, { k: 80 * value, c: 15 });
  const local = [];
  for (const s of [-1, 1]) {
    local.push({ rings: cyl([s * 44, 0, Z], [1, 0, 0], 1.7, 7, 16) });
    local.push({ rings: cyl([s * 31, 0, Z], [1, 0, 0], 1.3, 7, 12) });
    local.push({ rings: cyl([s * 36, 0, Z], [1, 0, 0], 12, 2.2, 36) });
    local.push({ rings: cyl([s * 40, 0, Z], [1, 0, 0], 9, 1.4, 32) });
    local.push({ rings: rod([-6, s * 8, Z], [6, s * 8, Z], 1.8), hi: s > 0 });
    for (const x of [-6, 6]) local.push({ rings: rod([x, s * 8, Z], [x, s * 13, Z], 1) });
  }
  for (let i = 0; i < 6; i++) { const a = HEX[i], b = HEX[(i + 1) % 6]; local.push({ rings: rod([a[0], a[1], Z], [b[0], b[1], Z], 1.2) }); }
  function frame() { const T = rz(sp.x); draw(local.map((p) => ({ ...p, T }))); }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); frame(); return m; });
  bag.add(B.unregister);
  function aim(w) {
    if (w) { const a = Math.atan2(w[1], w[0]); sp.t = a - Math.PI * Math.round((a - sp.t) / Math.PI); } else sp.t = REST;
    read.textContent = w ? (((Math.round(sp.t * 57.3) % 180) + 180) % 180) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const w = unproj(C, p[0], p[1], 0), r = Math.hypot(w[0], w[1]); aim(r > 80 || r < 6 ? null : w); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  frame(); aim(null);
  return { set: (v) => { sp.k = 80 * v; }, destroy: bag.dispose };
}

hairline({
  name: "trapbar",
  means: "A hex trap bar loaded with plates: the bar turns on the floor to point at the pointer, one handle bright.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.6],
  tour: [[67, 265], [333, 226], [67, 94], null],
  mount,
});
