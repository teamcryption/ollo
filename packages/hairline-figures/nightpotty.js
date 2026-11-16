/**
 * Potty: a child's potty with a round seat, two side grips and a lid hinged
 * at the back. The lid swings up and back as the pointer nears. At rest it
 * sits just ajar and its front tab is bright.
 */
const { Cam, clamp, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const rot = (hy, hz, a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => { const dy = y - hy, dz = z - hz; return [x, hy + dy * c - dz * s, hz + dy * s + dz * c]; }; };
const ring = (cx, cy, r, z, n = 32) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI), z]);

const R = 18, Z = 20, OPEN = 1.38, REST = 0.16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 5);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R, Z + 2 * R + 3], [-R, -R - 4, Z + R], [R, -R - 4, Z + R], [0, R + 4, Z + 3]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const hb = (pts) => poly(hull(pts.map((p) => P(...p))));
  mk("path", { class: "sil", d: hb(box(-R - 4, -4, Z - 9, -R + 2, 4, Z - 4)) }, g);
  const body = mk("path", { class: "sil", d: hb([...ring(0, 0, 13, 0), ...ring(0, 0, 14, 3), ...ring(0, 0, R, Z - 2), ...ring(0, 0, R, Z)]) }, g);
  mk("path", { class: "nf lo", d: poly(ring(0, 0, 12, Z).map((p) => P(...p))) }, g);
  mk("path", { class: "sil", d: hb(box(R - 2, -4, Z - 9, R + 4, 4, Z - 4)) }, g);
  const lg = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lg), lr = mk("path", { class: "nf lo" }, lg), tab = mk("path", { class: "sil hi" }, lg);
  const la = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const T = rot(-R, Z, a);
    lid.setAttribute("d", hb([...ring(0, 0, R, Z), ...ring(0, 0, R, Z + 2.5)].map(T)));
    lr.setAttribute("d", poly(ring(0, 0, 13, Z + 2.5).map(T).map((p) => P(...p))));
    tab.setAttribute("d", hb(box(-4, R - 1, Z, 4, R + 3, Z + 2.5).map(T)));
    if (a > 1.1) { if (lg.nextSibling !== body) g.insertBefore(lg, body); } else if (g.lastChild !== lg) g.appendChild(lg);
  }
  const mid = P(0, 0, Z / 2);
  const B = register(stage, (_dt, now) => { draw(tval(la, now)); return !tdone(la, now); });
  bag.add(B.unregister);
  function near(p) {
    const now = performance.now();
    const f = p ? clamp(1.4 - Math.hypot(p[0] - mid[0], p[1] - mid[1]) / 90, 0, 1) : 0;
    tset(la, REST + f * (OPEN - REST), now, lag);
    read.textContent = p && f > 0 ? Math.round(f * 100) + "%" : "rest";
    B.wake();
  }
  near(null);
  bag.add(pointer(stage, { move: (p) => near(p), leave: () => near(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "nightpotty",
  means: "A child's potty: the lid swings up and back on its rear hinge as the pointer comes near.",
  rules: [1, 2, 5, 6],
  range: [0, 0, 200],
  tour: [[193, 172], [66, 272], [250, 40], null],
  mount,
});
