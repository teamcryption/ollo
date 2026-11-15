/**
 * Rover arm: a six-wheeled rover deck with a jointed arm on a turret at
 * its front corner. The arm swings on the turret to follow the pointer and
 * its elbow reaches out; the tool at its tip is bright at rest.
 *
 * The pattern: one part aims at the pointer (aim).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const PIV = [14, 0, 14];
const pts3 = (P, list) => list.map((q) => P(q[0], q[1], q[2]));
const blob = (a, b, w) => { const o = []; for (const p of [a, b]) for (const dx of [-w, w]) for (const dy of [-w, w]) for (const dz of [-w, w]) o.push([p[0] + dx, p[1] + dy, p[2] + dz]); return o; };
const wheel = (x, y, r, w) => { const o = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; for (const dy of [-w, w]) o.push([x + r * Math.cos(t), y + dy, r + r * Math.sin(t)]); } return o; };
const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-30, -24, 0], [30, 24, 0], [-30, 24, 0], [30, -24, 0], [50, 30, 40], [50, -30, 40], [-30, 0, 30]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shape = (cls, list) => mk("path", { class: cls, d: poly(hull(pts3(P, list))) }, g);
  for (const x of [-20, 0, 20]) shape("sil", wheel(x, 20, 6, 2.5));
  shape("sil", box(-26, -16, 9, 26, 16, 17));
  shape("sil", box(-14, -8, 17, -2, 8, 22));
  shape("sil", blob([-22, -6, 18], [-22, 6, 30], 1.5));
  for (const x of [-20, 0, 20]) shape("sil", wheel(x, -20, 6, 2.5));
  const turret = mk("path", { class: "sil" }, g), upper = mk("path", { class: "sil" }, g),
    fore = mk("path", { class: "sil" }, g), tool = mk("path", { class: "sil" }, g);
  const yaw = tween(-0.5), ext = tween(0.6);
  let last = "";

  function draw(a, e) {
    const key = a.toFixed(4) + e.toFixed(4);
    if (key === last) return; last = key;
    const c = Math.cos(a), s = Math.sin(a);
    const W = (r, z) => [PIV[0] + r * c, PIV[1] + r * s, z];
    const el = W(22 * (0.5 + 0.5 * e), PIV[2] + 22 - 10 * e), tip = W(22 * (0.5 + 0.5 * e) + 18 + 12 * e, PIV[2] + 6 + 6 * e);
    const set = (el2, list) => el2.setAttribute("d", poly(hull(pts3(P, list))));
    set(turret, blob([PIV[0], PIV[1], 17], [PIV[0], PIV[1], 21], 5));
    set(upper, blob([PIV[0], PIV[1], 21], el, 2));
    set(fore, blob(el, tip, 1.6));
    set(tool, blob([tip[0], tip[1], tip[2] - 3], [tip[0], tip[1], tip[2] - 9], 3.5));
  }
  const B = register(stage, (_dt, now) => { draw(tval(yaw, now), tval(ext, now)); return !(tdone(yaw, now) && tdone(ext, now)); });
  bag.add(B.unregister);
  const pv = P(PIV[0], PIV[1], PIV[2]);
  function aim(p) {
    const now = performance.now();
    if (!p) { tset(yaw, -0.5, now, 0); tset(ext, 0.6, now, 0); tool.classList.add("hi"); read.textContent = "rest"; B.wake(); return; }
    const dx = (p[0] - pv[0]) / 90, dy = (p[1] - pv[1]) / 90;
    const a = Math.max(-1.6, Math.min(1.6, Math.atan2(dy + dx, dx - dy)));
    const e = Math.max(0, Math.min(1, Math.hypot(dx, dy) * (0.6 + reach)));
    tset(yaw, a, now, 0); tset(ext, e, now, 0);
    tool.classList.add("hi");
    read.textContent = Math.round((a * 180) / Math.PI) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "roverarm",
  means: "A rover with a jointed arm on a turret: the arm swings round to follow the pointer and reaches out, tool tip bright.",
  rules: [1, 2, 5, 6],
  range: [0, 0.5, 1],
  tour: [[193, 298], [57, 185], [352, 168], null],
  mount,
});
