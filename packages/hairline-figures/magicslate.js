/**
 * Magic slate: a board with a clear film held by a band along its far edge,
 * a doodle pressed into the film. The pointer over it lifts the film up off
 * the board, further the nearer the pointer comes to the near edge, as when
 * you peel it to wipe the drawing. At rest the film is just raised, bright.
 * The slider is how far the film can lift.
 *
 * The pattern: one part tilting toward the pointer (spring).
 */
const { Cam, clamp, fit, hull, open, poly, proj, rrect, spring, stepS, unproj, disposer, mk, pointer, register, solid } = HL;

const W = 84, D = 104, HB = 6, BAND = 14;
const DOODLE = [];
for (let i = 0; i <= 40; i++) { const t = (i / 40) * Math.PI * 2; DOODLE.push([W / 2 + 20 * Math.sin(t), 58 + 14 * Math.sin(2 * t)]); }

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.98);
  const film = (a) => (u, v, w) => [u, BAND + (v - BAND) * Math.cos(a) - w * Math.sin(a), HB + 0.6 + (v - BAND) * Math.sin(a) + w * Math.cos(a)];
  const ext = [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0]];
  for (const a of [0.2, 1.35]) { const f = film(a); for (const u of [0, W]) ext.push(f(u, D - 2, 0)); }
  fit(C, ext, 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const board = solid(g), slate = solid(g), sheet = solid(g), band = solid(g);
  const doodle = mk("path", { class: "nf lo" }, g);
  const R = rrect(0, 0, W, D, 6, 6), RI = rrect(2, 2, W - 2, D - 2, 4, 6);
  const S = rrect(8, BAND + 4, W - 8, D - 8, 3, 6);
  const F = rrect(3, BAND, W - 3, D - 3, 3, 6), FI = rrect(5, BAND + 2, W - 5, D - 5, 2, 6);
  const BR = rrect(0, 0, W, BAND + 2, 4, 6), BI = rrect(2, 2, W - 2, BAND, 3, 6);
  const Q = (x, y, z) => P(x, y, z);
  board.sil.setAttribute("d", poly(hull(R.map((q) => Q(q.u, q.v, 0)).concat(R.map((q) => Q(q.u, q.v, HB))))));
  board.cr.setAttribute("d", poly(RI.map((q) => Q(q.u, q.v, HB))));
  slate.sil.setAttribute("d", poly(S.map((q) => Q(q.u, q.v, HB + 0.2))));
  slate.sil.setAttribute("class", "nf lo");
  sheet.sil.classList.add("hi");
  const lift = spring(0.2);
  let last = NaN;

  function draw() {
    if (lift.x === last) return;
    last = lift.x;
    const f = film(lift.x), T = (u, v, w) => P(...f(u, v, w));
    sheet.sil.setAttribute("d", poly(hull(F.map((q) => T(q.u, q.v, 0)).concat(F.map((q) => T(q.u, q.v, 0.8))))));
    sheet.cr.setAttribute("d", poly(FI.map((q) => T(q.u, q.v, 0.8))));
    doodle.setAttribute("d", open(DOODLE.map(([u, v]) => T(u, v, 0.9))));
  }
  band.sil.setAttribute("d", poly(hull(BR.map((q) => Q(q.u, q.v, HB)).concat(BR.map((q) => Q(q.u, q.v, HB + 3))))));
  band.cr.setAttribute("d", poly(BI.map((q) => Q(q.u, q.v, HB + 3))));

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  function onMove(p) {
    const [x, y] = unproj(C, p[0], p[1], HB);
    if (x < -10 || x > W + 10 || y < -10 || y > D + 15) return onLeave();
    const s = clamp((y - 10) / (D - 20), 0, 1);
    lift.t = 0.35 + s * reach;
    read.textContent = "lift " + Math.round(s * 9);
    B.wake();
  }
  function onLeave() { lift.t = 0.2; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: onMove, leave: onLeave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "magicslate",
  means: "A magic slate: the pointer peels its clear film up off the board, higher the nearer it comes to the near edge.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[147, 250], [231, 208], [133, 257], null],
  mount,
});
