/**
 * Apple corer: a round slicer, a ring of eight blades around a coring tube,
 * with a handle out to each side, held over an apple on a round board. The
 * pointer over the apple presses the slicer down onto it; leaving lifts it
 * again. At rest the slicer hangs high above the fruit, its ring bright.
 * The slider is how far it comes down.
 *
 * The pattern: one part answering hover with a press (tween), hit on the ground.
 */
const {
  Cam, fit, hull, open, poly, proj, seg, unproj, tset, tval, tween, tdone,
  disposer, mk, pointer, register,
} = HL;

const disc = (r, n = 32, cx = 0, cy = 0) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cy + r * Math.sin((i / n) * 2 * Math.PI)]);
const BZ = 4, AH = 34, RR = 23, UP = 74, TH = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let press = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [-50, 0, UP + TH], [50, 0, UP + TH], [0, -50, UP + TH]], 200, 168);
  const P = proj(C);
  const at = (pts, z) => pts.map(([x, y]) => P(x, y, z));
  const g = mk("g", {}, svg);

  // the board, then the apple: stacked rings hulled into a round fruit, a dimple and a stem
  mk("path", { class: "sil", d: poly(hull(at(disc(40, 48), 0).concat(at(disc(40, 48), BZ)))) }, g);
  mk("path", { class: "nf lo", d: open(at(disc(38, 48), BZ).concat([at(disc(38, 48), BZ)[0]])) }, g);
  const fruit = [];
  for (let i = 0; i <= 8; i++) { const t = -0.35 + (i / 8) * 1.75; fruit.push(...at(disc(20 * Math.cos(t - 0.35) + 2, 24), BZ + AH * (0.5 + 0.5 * Math.sin(t - 0.35)))); }
  mk("path", { class: "sil", d: poly(hull(fruit)) }, g);
  mk("path", { class: "nf lo", d: poly(at(disc(5, 16), BZ + AH - 2)) + seg(P(0, 0, BZ + AH - 2), P(1.5, -1, BZ + AH + 6)) }, g);

  // the slicer: handles, the ring band, the blades and the coring tube
  const hands = mk("path", { class: "sil" }, g), ring = mk("path", { class: "sil hi" }, g);
  const hole = mk("path", { class: "nf lo" }, g), blades = mk("path", { class: "nf" }, g), core = mk("path", { class: "sil" }, g);
  const z = tween(UP);
  let last = NaN;
  function draw(z0) {
    if (z0 === last) return;
    last = z0;
    const bar = (s) => poly(hull(at(disc(3.2, 12, s * 30, 0), z0 + 1).concat(at(disc(3.2, 12, s * 46, 0), z0 + 1), at(disc(3.2, 12, s * 46, 0), z0 + 4), at(disc(3.2, 12, s * 30, 0), z0 + 4))));
    hands.setAttribute("d", bar(-1) + bar(1));
    ring.setAttribute("d", poly(hull(at(disc(RR, 40), z0).concat(at(disc(RR, 40), z0 + TH)))));
    hole.setAttribute("d", poly(at(disc(RR - 2.2, 40), z0 + TH)));
    let b = "";
    for (let k = 0; k < 8; k++) { const a = (k / 8) * 2 * Math.PI + 0.2; b += seg(P(5 * Math.cos(a), 5 * Math.sin(a), z0 + TH), P((RR - 2.2) * Math.cos(a), (RR - 2.2) * Math.sin(a), z0 + TH)); }
    blades.setAttribute("d", b);
    core.setAttribute("d", poly(hull(at(disc(5, 20), z0 - 2).concat(at(disc(5, 20), z0 + TH + 1)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? UP - press : UP, performance.now(), 0);
    read.textContent = a ? "press" : "rest";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ + AH / 2);
    set(Math.hypot(x, y) < 40);
  }
  set(false);
  bag.add(pointer(stage, { move, leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { press = v; if (act) { act = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "appleslicer",
  means: "An apple corer over an apple on a board: the pointer presses the ring of blades down onto the fruit.",
  rules: [1, 3, 5, 6],
  range: [20, 34, 36],
  tour: [[200, 195], [218, 210], [185, 185], null],
  mount,
});
