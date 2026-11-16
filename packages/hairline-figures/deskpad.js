/**
 * Mouse mat: a thin mat with a padded wrist rest along its front edge and a
 * mouse on it. The pointer on the desk turns the mat toward it and slides
 * the mouse to where it points. At rest the mat sits a little askew, the
 * mouse bright to one side. The slider is how far the mat may turn.
 */
const { Cam, fit, proj, unproj, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const D = Math.PI / 180, cl = (v, a, b) => Math.max(a, Math.min(b, v));
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const ell = (cx, cy, rx, ry, n = 24) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * 2 * Math.PI), cy + ry * Math.sin((i / n) * 2 * Math.PI)]);
// a convex solid: two rings of the same count, bottom then top
const slab = (b, z0, z1, t = b) => b.map(([x, y]) => [x, y, z0]).concat(t.map(([x, y]) => [x, y, z1]));
function turn(pts, u, a, p) {
  const n = Math.hypot(...u), [ux, uy, uz] = u.map((v) => v / n), c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y, z]) => {
    const vx = x - p[0], vy = y - p[1], vz = z - p[2], d = (ux * vx + uy * vy + uz * vz) * (1 - c);
    return [p[0] + vx * c + (uy * vz - uz * vy) * s + ux * d, p[1] + vy * c + (uz * vx - ux * vz) * s + uy * d, p[2] + vz * c + (ux * vy - uy * vx) * s + uz * d];
  });
}
const area = (q) => q.reduce((s, a, i) => { const b = q[(i + 1) % q.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
function part(parent, cls = "sil") {
  const g = mk("g", {}, parent);
  return { g, s: mk("path", { class: cls }, g), c: mk("path", { class: "nf" }, g) };
}
function paint(P, so, pts, ref) {
  const q = pts.map((p) => P(...p)), n = q.length / 2, f = [];
  f.push(q.slice(n), q.slice(0, n).reverse());
  for (let i = 0; i < n; i++) { const j = (i + 1) % n; f.push([q[i], q[j], q[n + j], q[n + i]]); }
  so.s.setAttribute("d", poly(hull(q)));
  so.c.setAttribute("d", f.filter((x) => area(x) * ref > 1e-6).map(poly).join(""));
}
const refOf = (P) => Math.sign(area([[0, 0], [10, 0], [10, 10], [0, 10]].map(([x, y]) => P(x, y, 0))));

const W = 120, H = 90, CX = W / 2, CY = H / 2, REST = [-9, 30, -14];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-22, -22, 0], [W + 22, H + 22, 0], [W + 22, -22, 0], [-22, H + 22, 0], [CX, CY, 14]], 200, 166);
  const P = proj(C), ref = refOf(P);
  const g = mk("g", {}, svg);
  const mat = part(g, ""), rest = part(g, ""), mouse = part(g), btn = mk("path", { class: "nf lo" }, g);
  const yaw = tween(REST[0] * D), mx = tween(REST[1]), my = tween(REST[2]);
  const chamf = (x0, y0, x1, y1, r) => [[x0 + r, y0], [x1 - r, y0], [x1, y0 + r], [x1, y1 - r], [x1 - r, y1], [x0 + r, y1], [x0, y1 - r], [x0, y0 + r]];
  const matR = chamf(0, 0, W, H, 8), restB = chamf(6, H - 24, W - 6, H - 4, 6), restT = chamf(9, H - 21, W - 9, H - 7, 5);
  const loc = (pts, a) => turn(pts, [0, 0, 1], a, [CX, CY, 0]);
  let last = "";
  function draw(now) {
    const a = tval(yaw, now), x = CX + tval(mx, now), y = CY + tval(my, now), key = a + "," + x + "," + y;
    if (key === last) return;
    last = key;
    paint(P, mat, loc(slab(matR, 0, 2.2), a), ref);
    paint(P, rest, loc(slab(restB, 2.2, 7, restT).concat([]), a), ref);
    paint(P, mouse, loc(slab(ell(x, y, 10, 15, 28), 2.2, 9.5, ell(x, y - 1.5, 6.5, 10, 28)), a), ref);
    btn.setAttribute("d", poly(loc([[x - 6.5, y - 4, 9.5], [x + 6.5, y - 4, 9.5], [x, y - 4, 9.5], [x, y - 11, 9.5]], a).map((p) => P(...p))).replace("Z", ""));
  }
  const B = register(stage, (_dt, now) => { draw(now); return !(tdone(yaw, now) && tdone(mx, now) && tdone(my, now)); });
  bag.add(B.unregister);

  let act = null;
  function setActive(p) {
    const now = performance.now();
    mouse.s.classList.add("hi");
    if (!p) {
      if (act === null) return;
      act = null;
      tset(yaw, REST[0] * D, now, 0); tset(mx, REST[1], now, 40); tset(my, REST[2], now, 40);
      read.textContent = "rest";
    } else {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      const deg = Math.round(cl((wx - wy) / 90, -1, 1) * reach);
      const lx = cl(wx - CX, -W / 2 + 14, W / 2 - 14), ly = cl(wy - CY, -H / 2 + 18, H / 2 - 42);
      if (act === deg + "," + Math.round(lx / 8) + "," + Math.round(ly / 8)) return;
      act = deg + "," + Math.round(lx / 8) + "," + Math.round(ly / 8);
      tset(yaw, deg * D, now, 0); tset(mx, Math.round(lx / 8) * 8, now, 40); tset(my, Math.round(ly / 8) * 8, now, 40);
      read.textContent = (deg > 0 ? "+" : "") + deg + "°";
    }
    B.wake();
  }
  act = 0; setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(p), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskpad",
  means: "A mouse mat with a wrist rest: the pointer turns the mat toward it and slides the mouse to where it points.",
  rules: [1, 3, 5, 6],
  range: [8, 20, 28],
  tour: [[294, 161], [110, 150], [330, 175], null],
  mount,
});
