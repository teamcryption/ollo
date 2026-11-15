/**
 * Star tracker: a small spacecraft camera on a mounting plate, its body
 * carrying a long flared baffle that shades the lens. The pointer steers
 * it: the camera pans and tilts to point its baffle at the pointer. At
 * rest it looks up and the baffle's aperture is bright.
 *
 * The pattern: one part aims at the pointer (aim).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const PV = [0, 0, 16];
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let flare = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-22, -22, 0], [22, 22, 0], [-22, 22, 0], [22, -22, 0], [-30, -30, 50], [30, 30, 50], [0, 0, 56]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pp = (list) => list.map((q) => P(q[0], q[1], q[2]));
  const H = (list) => poly(hull(pp(list)));
  const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
  mk("path", { class: "sil", d: H(box(-20, -20, 0, 20, 20, 3)) }, g);
  mk("path", { class: "sil", d: H(box(-3, -10, 3, 3, 10, 7)) }, g);
  mk("path", { class: "sil", d: H(box(-2, -10, 7, 2, -8, 17)) }, g);
  const body = mk("path", { class: "sil" }, g), baffle = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "nf hi" }, g);
  mk("path", { class: "sil", d: H(box(-2, 8, 7, 2, 10, 17)) }, g);
  const az = tween(-0.8), el = tween(0.9);
  let last = "";
  function draw(a, e) {
    const key = a.toFixed(4) + e.toFixed(4);
    if (key === last) return; last = key;
    const d = [Math.cos(e) * Math.cos(a), Math.cos(e) * Math.sin(a), Math.sin(e)];
    const e1 = [-Math.sin(a), Math.cos(a), 0], e2 = [d[1] * e1[2] - d[2] * e1[1], d[2] * e1[0] - d[0] * e1[2], d[0] * e1[1] - d[1] * e1[0]];
    const at = (l, u, v) => [PV[0] + d[0] * l + e1[0] * u + e2[0] * v, PV[1] + d[1] * l + e1[1] * u + e2[1] * v, PV[2] + d[2] * l + e1[2] * u + e2[2] * v];
    const ring = (l, r, n = 32) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push(at(l, r * Math.cos(t), r * Math.sin(t))); } return o; };
    const bp = []; for (const l of [-7, 6]) for (const u of [-7, 7]) for (const v of [-7, 7]) bp.push(at(l, u, v));
    body.setAttribute("d", H(bp));
    const R2 = 9 + 3 * flare;
    baffle.setAttribute("d", H(ring(6, 5.5).concat(ring(30, R2))));
    mouth.setAttribute("d", poly(pp(ring(30, R2 - 0.2))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(az, now), tval(el, now)); return !(tdone(az, now) && tdone(el, now)); });
  bag.add(B.unregister);
  const pv = P(PV[0], PV[1], PV[2]);
  function aim(p) {
    const now = performance.now();
    if (!p) { tset(az, -0.8, now, 0); tset(el, 0.9, now, 0); read.textContent = "rest"; B.wake(); return; }
    const dx = (p[0] - pv[0]) / 100, dy = (pv[1] - p[1]) / 100;
    const a = Math.atan2(-dx - dy * 0.6, dx - dy * 0.6), e = Math.max(0.05, Math.min(1.45, 1.5 - Math.hypot(dx, dy) * 1.6));
    tset(az, a, now, 0); tset(el, e, now, 0);
    read.textContent = Math.round((a * 180) / Math.PI) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { flare = v; }, destroy: bag.dispose };
}

hairline({
  name: "starcamera",
  means: "A star tracker camera on its mount: it pans and tilts to aim its long flared baffle at the pointer, the aperture bright.",
  rules: [1, 2, 5, 6],
  range: [0, 0.5, 1],
  tour: [[56, 237], [200, 309], [368, 249], null],
  mount,
});
