/**
 * Cat wheel: a tall spoked wheel standing on its base. The pointer over it
 * turns the wheel a part turn; at rest the wheel is bright. The slider is how
 * far it turns.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, rad, mk, solid, put, register, pointer, disposer } = HL;
const R = 44, WD = 16, CZ = R + 6;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R - 6, -8, 0], [R + 6, WD + 8, 0], [-R, 0, CZ + R], [R, WD, CZ + R], [-R, WD, CZ], [R, 0, CZ]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(-R + 6, -8, R - 6, WD + 8, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const [ur, ui] = rings(-3, -6, 3, -2, 1, 0.6);
  put(solid(g), prism(P, front, ur, ui, 4, CZ));
  const ring = (y, r, n = 48) => Array.from({ length: n }, (_, k) => { const t = (k / n) * 2 * Math.PI; return P(r * Math.cos(t), y, CZ + r * Math.sin(t)); });
  const sil = mk("path", { class: "sil", d: poly(hull(ring(0, R).concat(ring(WD, R)))) }, g);
  mk("path", { class: "nf", d: poly(ring(WD, R - 5)) }, g);
  const sp = mk("path", { class: "nf" }, g);
  const REST = 8, a = spring(REST);
  function draw(deg) {
    let d = "";
    for (let k = 0; k < 5; k++) for (const o of [-1.6, 1.6]) { const t = rad(deg + k * 72), ox = -Math.sin(t) * o, oz = Math.cos(t) * o; d += seg(P(ox, WD, CZ + oz), P((R - 5) * Math.cos(t) + ox, WD, CZ + (R - 5) * Math.sin(t) + oz)); }
    for (let k = 0; k < 18; k++) { const t = rad(deg + k * 20 + 10), r = R - 2.5; d += seg(P(r * Math.cos(t), WD, CZ + r * Math.sin(t)), P((R - 0.5) * Math.cos(t), WD, CZ + (R - 0.5) * Math.sin(t))); }
    sp.setAttribute("d", d);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);
  const cx = P(0, WD / 2, CZ);
  let on = null;
  function set(v) {
    if (v === on) return; on = v;
    a.t = v ? REST + turn : REST;
    sil.classList.toggle("hi", true);
    read.textContent = v ? "turn" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(Math.hypot(x - cx[0], y - cx[1]) < 120), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; if (on) { a.t = REST + v; B.wake(); } }, destroy: bag.dispose };
}
hairline({
  name: "catwheel",
  means: "A tall cat exercise wheel on its base: the pointer turns the spoked wheel part of a turn, and it rests still.",
  rules: [1, 3, 4, 5],
  range: [20, 36, 54],
  tour: [[236, 119], [200, 160], [160, 120], null],
  mount,
});
