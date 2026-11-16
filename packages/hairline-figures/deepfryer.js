/**
 * Deep fryer: a squared body with a control dial on the front, a hinged lid
 * with a viewing window and a handle, and the basket's hook resting on the
 * rim. The pointer over the fryer swings the lid up on its back hinge; how
 * far it opens follows the pointer from back to front. At rest the lid sits
 * ajar, bright.
 *
 * The pattern: one part swinging on a hinge, hit on the ground plane.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 30, D = 26, H = 26, LH = 7, REST = 0.2, MAXA = 1.7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-W, -D, 0], [W, D, 0], [W, -D, 0], [-W, D, 0], [0, -D - 10, H + 2 * D], [0, 0, H + LH + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-W, -D, W, D, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const dial = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; dial.push(P(W, 10 + 4 * Math.cos(a), 13 + 4 * Math.sin(a))); }
  mk("path", { class: "nf lo", d: poly(dial) + seg(P(W, 10, 13), P(W, 10, 16)) + seg(P(W, -14, 8), P(W, -14, 18)) }, g);
  const lid = mk("path", { class: "sil" }, g), win = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const yh = -D, zh = H;
  function rot([x, y, z], a) {
    const dy = y - yh, dz = z - zh;
    return [x, yh + dy * Math.cos(a) - dz * Math.sin(a), zh + dy * Math.sin(a) + dz * Math.cos(a)];
  }
  const slab = [];
  for (const q of rrect(-W, -D, W, D, 6, 6)) { slab.push([q.u, q.v, H + 0.5]); }
  for (const q of rrect(-W + 3, -D + 2, W - 3, D - 3, 5, 6)) { slab.push([q.u, q.v, H + LH]); }
  const glass = rrect(-W + 9, -D + 7, W - 9, D - 9, 4, 6).map((q) => [q.u, q.v, H + LH]);
  const hd = [];
  for (const q of rrect(-9, D - 6, 9, D - 1, 2, 4)) { hd.push([q.u, q.v, H + LH]); hd.push([q.u, q.v, H + LH + 3]); }
  const ang = spring(REST, { k: 90, c: 16 });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.setAttribute("d", poly(hull(slab.map((p) => P(...rot(p, a))))));
    win.setAttribute("d", poly(glass.map((p) => P(...rot(p, a)))));
    knob.setAttribute("d", poly(hull(hd.map((p) => P(...rot(p, a))))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.abs(x) > W + 12 || Math.abs(y) > D + 12) return leave();
    const t = clamp((y + D) / (2 * D), 0, 1);
    ang.t = REST + (0.35 + 0.65 * t) * (MAXA - REST) * (0.4 + 0.6 * reach);
    lid.classList.add("hi");
    read.textContent = Math.round((ang.t * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; lid.classList.add("hi"); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "deepfryer",
  means: "A deep fryer: the windowed lid swings up on its back hinge, wider as the pointer moves toward the front of the fryer.",
  rules: [1, 3, 5, 8],
  range: [0, 100, 100],
  tour: [[241, 235], [200, 255], [163, 274], null],
  mount,
});
