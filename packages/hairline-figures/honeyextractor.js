/**
 * Honey extractor: an open drum on a low stand, a lid on top and a basket of
 * comb frames on a spindle inside. Pointing at the drum lifts the lid and
 * draws the frames up out of it on their crank. At rest the lid sits a little
 * proud, bright, with the frames' tops just showing. The slider is the lift.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, put, rings, ringAt, run, solid, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const R = 40, Z0 = 8, Z1 = 64, FZ = 22, FH = 38;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-30, -30, 0], [30, 30, 0], [-30, 30, 0], [30, -30, 0], [0, 0, Z1 + 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = [disc(R - 10), disc(R - 12)];
  put(solid(g), prism(P, front, sr, si, 0, Z0));
  const D = disc(R);
  mk("path", { d: poly(ringAt(P, D, Z0)), class: "lo" }, g);
  mk("path", { d: poly(ringAt(P, D, Z1)), class: "nf" }, g);
  // the basket: two comb frames either side of a spindle, a crank on top
  const basket = mk("g", {}, g);
  const plate = (y) => rings(-18, y - 1.5, 18, y + 1.5, 1, 0.5);
  const fA = solid(basket), sp = solid(basket), fB = solid(basket), crank = solid(basket);
  const wall = mk("path", { class: "sil" }, g);
  const fr = run(D, front);
  wall.setAttribute("d", poly(ringAt(P, fr, Z1).concat(ringAt(P, fr, Z0).reverse())));
  const lid = solid(g);
  const [lr, li] = [disc(R + 2), disc(R - 1)];
  const lift = tween(10);
  let last = NaN;

  function draw(h) {
    if (h === last) return;
    last = h;
    const z = FZ + h;
    for (const [s, y] of [[fA, -11], [fB, 11]]) { const [a, b] = plate(y); put(s, prism(P, front, a, b, z, z + FH)); }
    const [pa, pb] = rings(-2, -2, 2, 2, 1.8, 0.6);
    put(sp, prism(P, front, pa, pb, z - 6, z + FH + 8));
    const [ca, cb] = rings(-2, -2, 22, 2, 2, 0.6);
    put(crank, prism(P, front, ca, cb, z + FH + 8, z + FH + 11));
    const lz = Z1 + 1 + h * 1.3;
    put(lid, prism(P, front, lr, li, lz, lz + 3));
  }

  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, Z1 / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(lift, a ? top : 10, performance.now(), 0);
    lid.sil.classList.toggle("hi", !a);
    fB.sil.classList.toggle("hi", a);
    read.textContent = a ? "lift " + Math.round(top) : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < R * 1.6 && Math.abs(sy - mid[1]) < 90;
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; if (act) { act = -2; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "honeyextractor",
  means: "A honey extractor drum: pointing at it lifts the lid and draws the basket of comb frames up out of the drum on its crank.",
  rules: [1, 3, 5, 6],
  range: [30, 42, 50],
  tour: [[149, 179], [200, 205], [251, 230], null],
  mount,
});
