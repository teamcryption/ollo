/**
 * Pet carrier: a rounded travel crate with a carry handle, vent slots and a
 * barred door on its front. The pointer swings the door open on its hinge,
 * further the further right it goes; once the door is well open two eyes
 * show in the dark of the doorway. At rest the door stands ajar, bright.
 * The slider is how far the door may open.
 *
 * The pattern: one part following the pointer on a spring (aim).
 */
const {
  Cam, clamp, fit, facing, fillet, open, poly, prism, proj, rad, rings, ringAt, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, D = 40, H = 36, HY = 34, DW = 26, DZ0 = 6, DZ1 = 30, REST = 32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W + DW, HY, 0], [W + DW, HY, DZ1], [0, 0, H + 12], [W, 0, H], [0, D, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the shell: lower tub and upper hood with a seam between them
  const [ring, inner] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, ring, inner, 0, H));
  mk("path", { d: open(ringAt(P, run(ring, front), 15)), class: "nf lo" }, g);
  // carry handle: posts and a grip arching over the hood
  const hp = [];
  for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; hp.push(P(W / 2 - 13 * Math.cos(t), D / 2, H + 9 * Math.sin(t))); }
  mk("path", { d: open(hp), class: "nf" }, g);
  mk("path", { d: open(hp.map(([x, y]) => [x, y + 2.4])), class: "nf lo" }, g);
  // vent slots on the left side (y = D)
  let vd = "";
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) vd += seg(P(10 + c * 14, D, 20 + r * 4), P(18 + c * 14, D, 20 + r * 4));
  mk("path", { d: vd, class: "nf lo" }, g);
  // the doorway on the right side (x = W)
  const opening = fillet([P(W, HY, DZ0), P(W, HY - DW, DZ0), P(W, HY - DW, DZ1), P(W, HY, DZ1)], [3, 3, 3, 3]);
  mk("path", { d: poly(opening), class: "lo" }, g);
  const eyes = [P(W, HY - 9, 19), P(W, HY - 16, 19)].map((p) => mk("circle", { cx: p[0], cy: p[1], r: 1.6, class: "dot off" }, g));
  // the door: a barred plate turning about the hinge at y = HY
  const door = mk("path", { class: "sil hi" }, g), bars = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (t, z) => P(W + t * DW * s, HY - t * DW * c, z);
    door.setAttribute("d", poly(fillet([at(0, DZ0), at(1, DZ0), at(1, DZ1), at(0, DZ1)], [3, 3, 3, 3])));
    let bd = "";
    for (let i = 1; i < 6; i++) bd += seg(at(i / 6, DZ0 + 2), at(i / 6, DZ1 - 2));
    bd += seg(at(0.06, (DZ0 + DZ1) / 2), at(0.94, (DZ0 + DZ1) / 2));
    bars.setAttribute("d", bd);
    eyes.forEach((e) => e.setAttribute("class", a > 60 ? "dot m" : "dot off"));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const x0 = P(0, D, 0)[0], x1 = P(W + DW, HY, 0)[0];
  let on = false;
  function aim([sx]) {
    on = true;
    const a = Math.round(clamp((sx - x0) / (x1 - x0), 0, 1) * maxA);
    ang.t = a;
    read.textContent = a < 4 ? "shut" : "door " + a + "°";
    B.wake();
  }
  function leave() { on = false; ang.t = Math.min(REST, maxA); read.textContent = "rest"; B.wake(); }
  draw(REST);
  leave();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (!on) leave(); }, destroy: bag.dispose };
}

hairline({
  name: "petcarrier",
  means: "A travel crate with a barred door: the pointer swings the door open on its hinge, and two eyes show in the doorway.",
  rules: [1, 3, 5, 8],
  range: [60, 110, 140],
  tour: [[160, 170], [260, 170], [320, 170], null],
  mount,
});
