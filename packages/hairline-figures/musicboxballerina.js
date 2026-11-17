/**
 * Locket: a round locket lying on its back, its domed lid hinged along the
 * far edge and a bail ring at the side. The pointer over the locket swings
 * the lid up on its hinge to show the empty frame inside. The slider is how
 * far it opens.
 */
const { Cam, fit, proj, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const A = (a, b, s = 1) => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
const N3 = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
const X3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const ring3 = (c, u, v, r, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return A(A(c, u, r * Math.cos(t)), v, r * Math.sin(t)); });
const rot = (q, o, k, a) => {
  const p = [q[0] - o[0], q[1] - o[1], q[2] - o[2]], c = Math.cos(a), s = Math.sin(a), d = p[0] * k[0] + p[1] * k[1] + p[2] * k[2], x = X3(k, p);
  return [0, 1, 2].map((i) => o[i] + p[i] * c + x[i] * s + k[i] * d * (1 - c));
};
const Z = [0, 0, 1], X = [1, 0, 0], Y = [0, 1, 0], E = N3([1, -1, 0]), D = N3([1, 1, 0]);
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const R = 30, H = 6, OPEN = 1.62;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-R, -R, 0], [R, R, 0], A([0, 0, 0], E, R + 12), A([0, 0, 0], E, -R), A([0, 0, H + 2 * R], D, -R), A([0, 0, 0], D, R + 2)], 200, 168);
  const P = proj(C);
  const sh = (pts) => poly(hull(pts.map((q) => P(q[0], q[1], q[2]))));
  const g = mk("g", {}, svg);
  const lidBack = mk("g", {}, g);
  const bc = A([0, 0, 0], E, R + 7);
  mk("path", { class: "sil", d: sh(ring3(bc, X, Y, 7, 24).concat(ring3(A(bc, Z, 3), X, Y, 7, 24))) }, g);
  mk("path", { class: "nf lo", d: poly(ring3(A(bc, Z, 3), X, Y, 3.6, 24).map((q) => P(...q))) }, g);
  mk("path", { class: "sil", d: sh(ring3([0, 0, 0], X, Y, R, 48).concat(ring3([0, 0, H], X, Y, R, 48))) }, g);
  mk("path", { class: "nf lo", d: poly(ring3([0, 0, H], X, Y, R - 4, 48).map((q) => P(...q))) }, g);
  mk("path", { class: "nf lo", d: poly(ring3([0, 0, H], X, Y, R - 10, 40).map((q) => P(...q))) }, g);
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil hi" }, lidG), lidLo = mk("path", { class: "nf lo" }, lidG);
  const piv = A([0, 0, H], D, -R);
  const tw = tween(0.38);
  let last = NaN, behind = false;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = OPEN * t, T = (q) => rot(q, piv, E, a);
    lid.setAttribute("d", sh([[0, R], [2, R - 1], [4, R - 6], [5.5, R - 14]].flatMap(([z, r]) => ring3([0, 0, H + z], X, Y, r, 48)).map(T)));
    lidLo.setAttribute("d", a > 1.2 ? poly(ring3([0, 0, H], X, Y, R - 4, 48).map(T).map((q) => P(...q))) : poly(ring3([0, 0, H + 2], X, Y, R - 3, 48).map(T).map((q) => P(...q))));
    const b = a > 1.45;
    if (b !== behind) { behind = b; if (b) lidBack.after(lidG); else g.appendChild(lidG); }
  }
  draw(0.38);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const c0 = P(0, 0, H), l = P(...A([0, 0, 0], E, -R)), r = P(...A([0, 0, 0], E, R + 14));
  const inside = ([x, y]) => x > l[0] && x < r[0] && Math.abs(y - c0[1]) < R * C.S * 0.62;
  let act = null;
  function setA(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 0.45 + 0.55 * amt : 0.38, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setA(false);
  bag.add(pointer(stage, { move: (p) => setA(inside(p)), leave: () => setA(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (act) { act = null; setA(true); } }, destroy: bag.dispose };
}

hairline({
  name: "musicboxballerina",
  means: "A round locket lying open-faced: the pointer swings its domed lid up on the hinge to show the frame inside.",
  rules: [1, 4, 5, 8],
  range: [0, 100, 100],
  tour: [[181, 216], [150, 214], [214, 206], null],
  mount,
});
