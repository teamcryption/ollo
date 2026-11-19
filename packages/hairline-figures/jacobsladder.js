/**
 * Jacob's ladder toy: a hanging chain of six flat wooden blocks laced
 * together by crossing ribbons, held by the top block. The pointer over the
 * toy sets off the cascade: from the top down, each block tips on its
 * ribbons, alternately forward and back, and the chain folds into a zigzag.
 * At rest the chain hangs almost straight and the held top block is bright.
 * The slider is how far each block tips.
 *
 * The pattern: one object, a cascade staggered by distance from the top.
 */
const {
  Cam, fit, hull, open, poly, proj, tdone, tset, tval, tween, clamp, rad,
  disposer, mk, pointer, register,
} = HL;

const N = 6, BW = 64, H = 15, T = 3.4, Z0 = 96, STEP = 55, TIP = 52;
const REST = [10, -6, 5, -4, 3, -2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, -16, Z0 + 4], [BW, -16, Z0 + 4], [0, 16, 0], [BW, 16, 0], [0, 16, Z0], [BW, -16, 0]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const blocks = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    blocks.push({ grp, sil: mk("path", { class: "sil" + (i === 0 ? " hi" : "") }, grp), rib: mk("path", { class: "nf lo" }, grp), t: tween(0), y: 0 });
  }
  let last = "";
  function draw(now) {
    const ts = blocks.map((b) => tval(b.t, now));
    const key = ts.join() + amp;
    if (key === last) return;
    last = key;
    let y = 0, z = Z0;
    blocks.forEach((b, i) => {
      const th = rad(REST[i] * (1 - ts[i]) + (i % 2 ? -1 : 1) * TIP * amp * ts[i]);
      const dy = Math.sin(th) * H, dz = -Math.cos(th) * H, ny = Math.cos(th) * T, nz = Math.sin(th) * T;
      const pts = [];
      for (const x of [0, BW]) for (const [a, bb] of [[0, 0], [dy, dz]]) { pts.push(P(x, y + a, z + bb)); pts.push(P(x, y + a - ny, z + bb - nz)); }
      b.sil.setAttribute("d", poly(hull(pts)));
      // two ribbons running down the face, one across it
      const f = (x, s) => P(x, y + dy * s, z + dz * s);
      b.rib.setAttribute("d", [open([f(14, 0), f(14, 1)]), open([f(BW - 14, 0), f(BW - 14, 1)]), open([f(28, 0.08), f(36, 0.92)])].join(" "));
      b.y = y + dy / 2 - ny / 2;
      y += dy; z += dz;
    });
    // nearer blocks (larger y) paint later
    [...blocks].sort((a, c) => a.y - c.y).forEach((b) => g.appendChild(b.grp));
  }
  const B = register(stage, (_dt, now) => { draw(now); return blocks.some((b) => !tdone(b.t, now)); });
  bag.add(B.unregister);

  const pa = P(0, 0, Z0), pb = P(BW, 0, Z0), pc = P(0, 0, Z0 - N * H), pd = P(BW, 0, Z0 - N * H);
  const hit = ([sx, sy]) => sx > pa[0] - 10 && sx < pb[0] + 10 && sy > pa[1] - 10 && sy < pd[1] + 10;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    blocks.forEach((b, i) => tset(b.t, a ? 1 : 0, now, i * 50));
    read.textContent = a ? "flip" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v / 100, 0, 1); last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "jacobsladder",
  means: "A Jacob's ladder toy: the pointer sets its wooden blocks tumbling, each tipping on its ribbons into a zigzag.",
  rules: [1, 2, 5, 6],
  range: [30, 80, 100],
  tour: [[190, 95], [200, 147], [215, 205], null],
  mount,
});
