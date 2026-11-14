/**
 * Pallet racking: a cantilever rack, three shelves on posts at the back,
 * three bays of loaded pallets on each shelf. The pointer picks a bay by
 * where it is along the rack: every pallet in that bay slides out to the
 * aisle, the other bays push back, staggered from it. At rest the loads sit
 * unevenly on the shelves, one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; nearest rest centre by screen x.
 */
const {
  Cam, clamp, facing, fit, open, prism, proj, rings, ringAt, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BAYS = 3, BW = 22, D = 18, LV = [0, 22, 44], TH = 2.4, OUT = 20, W = BAYS * BW;
const H = [[12, 9, 14], [10, 15, 8], [13, 7, 11]];
const REST = [[1, 4, 0], [3, 0, 5], [0, 2, 1]];
const FAV = [1, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-2, -3, -TH], [W + 2, D + OUT, 0], [-2, -3, LV[2] + 20], [W + 2, D + OUT, LV[2] + 15], [-2, D + OUT, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the posts at the back, then each shelf with its pallets, bottom to top
  for (let b = 0; b <= BAYS; b++) {
    const [r, i] = rings(b * BW - 1.6, -3, b * BW + 1.6, 0, 0.8, 0.5);
    put(solid(g), prism(P, front, r, i, -TH, LV[2] + 20));
  }
  const pallets = [];
  LV.forEach((z, l) => {
    const [r, i] = rings(-2, -1, W + 2, D, 1.6, 0.8);
    put(solid(g), prism(P, front, r, i, z - TH, z));
    for (let b = 0; b < BAYS; b++) {
      const s = solid(g), board = mk("path", { class: "nf lo" }, s.g);
      pallets.push({ l, b, z, s, board, y: tween(REST[l][b]), last: NaN });
    }
  });

  function draw(p, y) {
    if (y === p.last) return;
    p.last = y;
    const [r, i] = rings(p.b * BW + 2, 1 + y, (p.b + 1) * BW - 2, D - 1 + y, 1.4, 0.8);
    put(p.s, prism(P, front, r, i, p.z, p.z + H[p.l][p.b]));
    p.board.setAttribute("d", open(ringAt(P, run(r, front), p.z + 2.2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    pallets.forEach((p) => { draw(p, tval(p.y, now)); if (!tdone(p.y, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: inside the rack's box, the bay whose rest centre is nearest on screen x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, LV[1] + 6);
    if (x < -8 || x > W + 8 || y < -30 || y > D + OUT + 24) return -1;
    let best = -1, bd = 1e9;
    for (let b = 0; b < BAYS; b++) {
      const d = Math.abs(P((b + 0.5) * BW, D / 2, LV[1] + 6)[0] - sx);
      if (d < bd) { bd = d; best = b; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pallets.forEach((p) => {
      const y = a < 0 ? REST[p.l][p.b] : p.b === a ? OUT : 0;
      tset(p.y, y, now, from < 0 ? 0 : Math.abs(p.b - from) * stag + p.l * 40);
      p.s.sil.classList.toggle("hi", a < 0 ? p.l === FAV[0] && p.b === FAV[1] : p.b === a && p.l === 1);
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "pallettruck",
  means: "Pallet racking: every pallet in the bay under the pointer slides out to the aisle, the other bays push back after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[213, 147], [253, 167], [294, 187], null],
  mount,
});
