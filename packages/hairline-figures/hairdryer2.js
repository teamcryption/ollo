/**
 * Hair dryer: a handheld dryer, a round barrel with a grilled intake at the
 * back and a flat concentrator nozzle at the front, and a handle hinged
 * under the barrel. Over the dryer the handle unfolds, swinging down from
 * along the barrel to hang below it, ready to hold. At rest the handle is
 * folded nearly flat, bright. The slider is how far it swings open.
 *
 * The pattern: one hinged part on a spring; the hit is a fixed screen box.
 */
const { Cam, fit, poly, open, hull, proj, rrect, rad, spring, stepS, mk, solid, register, pointer, disposer } = HL;
const R = 13, L = 70, HL_ = 40, ZB = R + HL_ + 3, HX = 40, FOLD = 82;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-6, -R - 2, ZB + R], [L + 16, R + 2, ZB - R], [HX, -6, 0], [HX, 6, 0], [-4, 0, ZB - R - 10], [L + 16, -R, ZB + R]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const ring = (x, r, rz, n = 32) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push(P(x, r * Math.cos(t), ZB + rz * Math.sin(t))); } return o; };
  const handle = solid(g);
  const sec = rrect(-7, -6, 7, 6, 4.5, 4);
  const cap = mk("path", { class: "sil" }, g), grille = mk("path", { class: "nf lo", d: poly(ring(-5, R - 4, R - 4)) + poly(ring(-5, R - 8, R - 8)) }, g);
  cap.setAttribute("d", poly(hull(ring(-5, R + 1, R + 1).concat(ring(2, R + 1, R + 1)))));
  const barrel = mk("path", { class: "sil", d: poly(hull(ring(2, R, R).concat(ring(L, R - 2, R - 2)))) }, g);
  mk("path", { class: "nf lo", d: open(ring(8, R, R).filter((_, i) => i < 17)) }, g);
  const slot = (x, w, h) => rrect(-w, -h, w, h, Math.min(h, 3), 3).map((q) => P(x, q.u, ZB + q.v));
  mk("path", { class: "sil", d: poly(hull(ring(L - 2, R - 2, R - 2).concat(slot(L + 16, R - 1, 3.2)))) }, g);
  mk("path", { class: "nf lo", d: poly(slot(L + 16, R - 3, 1.4)) }, g);
  const th = spring(FOLD);
  let last = NaN;
  function draw(a) {
    if (a === last) return; last = a;
    const t = rad(a), d = [-Math.sin(t), 0, -Math.cos(t)], n = [Math.cos(t), 0, -Math.sin(t)], h0 = [HX, 0, ZB - R + 4], pts = [];
    for (const s of [0, HL_]) for (const q of sec) pts.push(P(h0[0] + s * d[0] + q.u * n[0], q.v, h0[2] + s * d[2] + q.u * n[2]));
    handle.sil.setAttribute("d", poly(hull(pts)));
    handle.cr.setAttribute("d", seg3(h0, d, n));
  }
  function seg3(h0, d, n) {
    const a = P(h0[0] + 10 * d[0] - 7 * n[0], 6, h0[2] + 10 * d[2] - 7 * n[2]), e = P(h0[0] + (HL_ - 4) * d[0] - 7 * n[0], 6, h0[2] + (HL_ - 4) * d[2] - 7 * n[2]);
    return open([a, e]);
  }
  handle.cr.setAttribute("class", "nf lo");
  draw(FOLD);
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);
  const box = [P(-6, R, ZB + R), P(L + 16, R, ZB), P(L + 16, -R, ZB + R), P(-6, -R, ZB + R), P(HX, 0, 0), P(-6, R, ZB - R)];
  const bx0 = Math.min(...box.map((p) => p[0])), bx1 = Math.max(...box.map((p) => p[0])), by0 = Math.min(...box.map((p) => p[1])), by1 = Math.max(...box.map((p) => p[1]));
  let on = null;
  function set(v) {
    if (v === on) return; on = v;
    th.t = v ? FOLD - swing : FOLD;
    handle.sil.classList.toggle("hi", true);
    read.textContent = v ? Math.round(swing) + "°" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx0 - 6 && x < bx1 + 6 && y > by0 - 6 && y < by1 + 6), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (on) { th.t = FOLD - v; B.wake(); } }, destroy: bag.dispose };
}
hairline({
  name: "hairdryer2",
  means: "A handheld hair dryer: over it the folded handle swings down from under the barrel to hang ready to hold.",
  rules: [1, 3, 4, 5],
  range: [50, 70, 82],
  tour: [[184, 106], [140, 104], [236, 150], null],
  mount,
});
