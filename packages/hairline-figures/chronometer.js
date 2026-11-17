/**
 * Chronometer: a marine chronometer's square wooden box, its dial set in a
 * gimbal ring under a hinged lid. The pointer over the box swings the lid up
 * and back on its hinge to show the dial; leaving lets it settle ajar. At
 * rest the lid stands slightly open, bright. The slider is how far it opens.
 *
 * The pattern: one hinged part on a spring; the hit is the whole stage.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 56, H = 30, T = 7, REST = 26;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, -T - 4, 0], [W, D, 0], [W, -T - 4, H + D + 2], [0, D, 0], [0, 0, H + D + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), panel = mk("path", { class: "nf lo" }, lidG);
  const boxG = mk("g", {}, g);
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(boxG), prism(P, front, br, bi, 0, H));
  const cx = W / 2, cy = D / 2;
  mk("path", { class: "nf", d: poly(ringAt(P, disc(cx, cy, 22), H)) }, boxG);
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(cx, cy, 18), H + 0.5)) }, boxG);
  const ticks = [];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    ticks.push(seg(P(cx + 15 * Math.cos(t), cy + 15 * Math.sin(t), H + 0.5), P(cx + 17 * Math.cos(t), cy + 17 * Math.sin(t), H + 0.5)));
  }
  ticks.push(seg(P(cx, cy, H + 0.5), P(cx - 10, cy + 3, H + 0.5)), seg(P(cx, cy, H + 0.5), P(cx + 4, cy - 13, H + 0.5)));
  mk("path", { class: "nf", d: ticks.join("") }, boxG);
  // the lid's top edge, in front: drawn after when the lid is down
  const a = spring(REST, { k: 90, c: 16 });
  let last = NaN, behind = null;

  function rot(x, y, z, A) {
    const dy = y, dz = z - H, c = Math.cos(rad(A)), s = Math.sin(rad(A));
    return P(x, dy * c - dz * s, H + dy * s + dz * c);
  }
  function draw() {
    const A = a.x;
    if (A === last) return;
    last = A;
    const pts = [];
    for (const x of [0, W]) for (const y of [0, D]) for (const z of [H, H + T]) pts.push(rot(x, y, z, A));
    lid.setAttribute("d", poly(hull(pts)));
    const m = 6;
    panel.setAttribute("d", A > 12 ? poly([rot(m, m, H, A), rot(W - m, m, H, A), rot(W - m, D - m, H, A), rot(m, D - m, H, A)]) : "");
    const back = A > 90;
    if (back !== behind) { behind = back; if (back) boxG.after(lidG); else lidG.after(boxG); }
  }
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(); return m; });
  bag.add(B.unregister);

  function setOpen(on) {
    a.t = on ? clamp(maxA, 40, 112) : REST;
    lid.classList.add("hi");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  draw();
  setOpen(false);
  bag.add(pointer(stage, { move: () => setOpen(true), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (a.t !== REST) setOpen(true); }, destroy: bag.dispose };
}

hairline({
  name: "chronometer",
  means: "A marine chronometer box: the pointer swings its hinged lid up and back to show the dial in its gimbal ring.",
  rules: [1, 3, 5, 6],
  range: [60, 105, 112],
  tour: [[191, 180], [120, 230], [280, 196], null],
  mount,
});
