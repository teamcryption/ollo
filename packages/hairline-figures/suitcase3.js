/**
 * Carry-on case: a hard-shell cabin case on two wheels, a zip seam round
 * its shell and a telescoping handle at the back. The pointer over the
 * case tips it back onto its wheels, ready to roll, and the handle slides
 * up to meet the hand. At rest it stands nearly upright, the handle a
 * little out, the grip bright. The slider is how far it tips.
 *
 * The pattern: one object answering as a whole; the hit is on the ground
 * plane under the case, which never moves.
 */
const { Cam, clamp, fit, hull, open, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 24, D = 15, H = 38, R = 4, HX = [5, W - 5], HMAX = 18, REST_T = 0.06, REST_H = 5;

function prof(x0, z0, x1, z1, r) {
  const pts = [];
  const cs = [[x1 - r, z1 - r, 0], [x0 + r, z1 - r, 1], [x0 + r, z0 + r, 2], [x1 - r, z0 + r, 3]];
  for (const [cx, cz, q] of cs) for (let i = 0; i <= 4; i++) {
    const a = (q + i / 4) * Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cz + r * Math.sin(a)]);
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tmax = value;
  const C = Cam(45, 0.5, 4.65);
  const rot = (t) => ([x, y, z]) => { const dx = x - W, c = Math.cos(t), s = Math.sin(t); return [W + dx * c + z * s, y, -dx * s + z * c]; };
  const ext = [];
  for (const t of [0, 0.55]) for (const p of [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0], [0, 0, H + HMAX + 3], [W, D, H + HMAX + 3], [0, D, H], [W, 0, H]]) ext.push(rot(t)(p));
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shadow = mk("path", { class: "nf lo dash" }, g);
  const hgrp = mk("g", {}, g);
  const rods = mk("path", { class: "nf" }, hgrp);
  const grip = mk("path", { class: "sil" }, hgrp);
  const cgrp = mk("g", {}, g);
  const sil = mk("path", { class: "sil" }, cgrp);
  const det = mk("path", { class: "nf lo" }, cgrp);
  const wheels = mk("path", { class: "nf" }, cgrp);
  const tilt = tween(REST_T), hz = tween(REST_H);
  let last = "";

  const body = prof(0, 2.5, W, H, R), seam = prof(1.6, 4.5, W - 1.6, H - 2, R - 1.4);
  function draw(t, h) {
    const key = t.toFixed(4) + h.toFixed(3);
    if (key === last) return;
    last = key;
    const T = rot(t), Q = (p) => P(...T(p));
    const near = body.map(([x, z]) => [x, D, z]), far = body.map(([x, z]) => [x, 0, z]);
    sil.setAttribute("d", poly(hull(near.concat(far).map(Q))));
    let d = poly(near.map(Q)) + poly(seam.map(([x, z]) => Q([x, D, z])));
    for (const x of [W * 0.33, W * 0.66]) d += open([Q([x, D, 6]), Q([x, D, H - 4])]);
    det.setAttribute("d", d);
    let w = "";
    for (const y of [2.5, D - 2.5]) {
      const c = [];
      for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; c.push(Q([W - 3 + 2.5 * Math.cos(a), y, 2.5 + 2.5 * Math.sin(a)])); }
      w += poly(c);
    }
    wheels.setAttribute("d", w);
    let r = "";
    for (const x of HX) r += open([Q([x, 1.5, H - 1]), Q([x, 1.5, H + h])]);
    rods.setAttribute("d", r);
    const gp = [];
    for (const x of [HX[0] - 1.5, HX[1] + 1.5]) for (const z of [H + h, H + h + 3]) for (const y of [0.3, 2.7]) gp.push(Q([x, y, z]));
    grip.setAttribute("d", poly(hull(gp)));
    const sh = [[W, 0, 0], [W, D, 0], [0, D, 0], [0, 0, 0]].map((p) => { const q = T(p); return P(q[0], q[1], 0); });
    shadow.setAttribute("d", poly(sh));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tilt, now), tval(hz, now)); return !tdone(tilt, now) || !tdone(hz, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -6 && x < W + 30 && y > -6 && y < D + 6 ? 1 : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(tilt, a < 0 ? REST_T : (tmax * Math.PI) / 180, now, 0);
    tset(hz, a < 0 ? REST_H : HMAX, now, a < 0 ? 0 : 60);
    grip.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "roll " + Math.round(tmax) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tmax = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "suitcase3",
  means: "A carry-on case: the pointer tips it back onto its wheels, ready to roll, and its handle slides up to meet the hand.",
  rules: [1, 3, 5, 6],
  range: [10, 22, 30],
  tour: [[169, 278], [116, 252], [231, 299], null],
  mount,
});
