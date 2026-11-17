/**
 * Van sliding door: a panel van, cab and box body, with a sliding door on
 * its near side running on a rail. The pointer's place across the frame
 * slides the door back along the body to open the doorway. At rest the door
 * stands a hand's width open, bright. The slider is how far it can slide.
 *
 * The pattern: one part sliding on a track.
 */
const { Cam, clamp, facing, fillet, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 140, W = 56, Z0 = 9, ZT = 64, DX0 = 56, DX1 = 96, DZ0 = 13, DZ1 = 56, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [0, 0, ZT], [0, W, ZT], [L - 30, W, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 10 * Math.cos(t), y, 10 + 10 * Math.sin(t))); }
    return pts;
  };
  for (const x of [24, 116]) mk("path", { d: poly(wheel(x, 2)) }, g);
  // the bonnet: a low nose ahead of the box
  const [nr, ni] = rings(L - 40, 2, L, W - 2, 8, 2);
  put(solid(g), prism(P, front, nr, ni, Z0, 34));
  // the box body with its sloped windscreen
  const foot = rrect(0, 0, L - 26, W, 8, 6), top = rrect(0, 2, L - 44, W - 2, 7, 6);
  const box = solid(g);
  box.sil.setAttribute("d", poly(hull(ringAt(P, foot, Z0).concat(ringAt(P, foot, 34), ringAt(P, top, ZT)))));
  mk("path", { d: seg(P(L - 26, W - 4, 36), P(L - 42, W - 4, ZT - 4)) + seg(P(L - 42, W - 4, ZT - 4), P(L - 42, 4, ZT - 4)), class: "nf lo" }, g);
  for (const x of [24, 116]) mk("path", { d: poly(wheel(x, W)) }, g);
  // doorway and the rail it slides on
  const side = (x, z) => P(x, W + 0.2, z);
  mk("path", { d: poly(fillet([side(DX0, DZ0), side(DX1, DZ0), side(DX1, DZ1), side(DX0, DZ1)], [2, 2, 2, 2])), class: "nf lo" }, g);
  mk("path", { d: seg(P(DX0 - 46, W + 0.4, DZ1 - 6), P(DX1, W + 0.4, DZ1 - 6)), class: "nf lo" }, g);
  const door = mk("path", { class: "sil hi" }, g), win = mk("path", { class: "nf lo" }, g), handle = mk("path", { class: "nf" }, g);
  const off = spring(REST);
  let last = NaN;

  function draw(s) {
    if (s === last) return;
    last = s;
    const out = Math.min(s, 3);
    const q = (x, z) => P(x - s, W + 0.6 + out, z);
    door.setAttribute("d", poly(fillet([q(DX0, DZ0), q(DX1, DZ0), q(DX1, DZ1), q(DX0, DZ1)], [2, 2, 2, 2])));
    win.setAttribute("d", poly(fillet([q(DX0 + 6, DZ1 - 22), q(DX1 - 6, DZ1 - 22), q(DX1 - 6, DZ1 - 5), q(DX0 + 6, DZ1 - 5)], [2, 2, 2, 2])));
    handle.setAttribute("d", seg(q(DX1 - 4, 32), q(DX1 - 4, 38)));
  }
  const B = register(stage, (dt) => { const m = stepS(off, dt); draw(off.x); return m; });
  bag.add(B.unregister);

  function aim(s, r) { off.t = s; read.textContent = r ? "rest" : Math.round((s / (DX1 - DX0)) * 100) + "%"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((340 - sx) / 260, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "slidingvan",
  means: "A panel van with a sliding side door: the pointer slides the door back along its rail to open the doorway.",
  rules: [1, 3, 5, 6],
  range: [20, 34, 44],
  tour: [[252, 275], [172, 176], [148, 57], null],
  mount,
});
