/**
 * Water table: a kids' tub on four legs, filled near the brim, a toy boat
 * afloat in it. The pointer steers the boat: it glides across the water
 * towards the pointer, its ripples going with it. At rest the boat sits off
 * centre, bright. The slider is how wide the ripples spread.
 *
 * The pattern: one object answering the pointer's position (follow).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, circ, unproj, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const X = 44, Y = 26, ZB = 24, ZT = 38, ZW = 36.5, RX = -16, RY = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-X, -Y, 0], [X, Y, 0], [X, -Y, 0], [-X, Y, 0], [0, 0, ZT + 8], [-X, -Y, ZT], [X, Y, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [lx, ly] of [[-X + 6, -Y + 6], [X - 6, -Y + 6], [-X + 6, Y - 6], [X - 6, Y - 6]]) {
    const [r, i] = rings(lx - 2.5, ly - 2.5, lx + 2.5, ly + 2.5, 1.5, 0.8);
    put(solid(g), prism(P, front, r, i, 0, ZB));
  }
  const [tr, ti] = rings(-X, -Y, X, Y, 8, 2.2);
  put(solid(g), prism(P, front, tr, ti, ZB, ZT));
  const wl = rrect(-X + 4, -Y + 4, X - 4, Y - 4, 6, 4);
  mk("path", { d: poly(wl.map((q) => P(q.u, q.v, ZW))), class: "nf lo" }, g);
  const rip = [0, 1, 2].map(() => mk("path", { class: "nf lo" }, g));
  const boat = solid(g), cabin = solid(g);
  boat.sil.classList.add("hi");

  const bx = spring(RX), by = spring(RY);
  let last = "";
  function draw(x, y) {
    const key = x.toFixed(2) + "," + y.toFixed(2);
    if (key === last) return;
    last = key;
    rip.forEach((el, k) => {
      const R = 13 + k * spread;
      el.setAttribute("d", poly(circ(R, 40).map((q) => P(clamp(x + q.u * 1.3, -X + 5, X - 5), clamp(y + q.v, -Y + 5, Y - 5), ZW))));
    });
    const hullR = rrect(x - 9, y - 4.5, x + 9, y + 4.5, 4.5, 4), deck = rrect(x - 10, y - 5.5, x + 10, y + 5.5, 5.5, 4);
    const foot = hullR.map((q) => P(q.u, q.v, ZW - 1)), top = deck.map((q) => P(q.u, q.v, ZW + 4));
    boat.sil.setAttribute("d", poly(hull(foot.concat(top))));
    boat.cr.setAttribute("d", poly(rrect(x - 8.6, y - 4, x + 8.6, y + 4, 4, 4).map((q) => P(q.u, q.v, ZW + 4))));
    const [cr, ci] = rings(x - 5, y - 3, x + 2, y + 3, 1.5, 0.8);
    put(cabin, prism(P, front, cr, ci, ZW + 4, ZW + 10));
  }

  let act = false;
  const B = register(stage, (dt) => {
    const m = stepS(bx, dt) | stepS(by, dt);
    draw(bx.x, by.x);
    read.textContent = act ? "boat " + Math.round(bx.x) + "·" + Math.round(by.x) : "rest";
    return !!m;
  });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, ZW);
    act = true;
    bx.t = clamp(wx, -X + 15, X - 15);
    by.t = clamp(wy, -Y + 10, Y - 10);
    B.wake();
  }
  function leave() { act = false; bx.t = RX; by.t = RY; B.wake(); }
  draw(RX, RY);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { spread = v; last = ""; draw(bx.x, by.x); }, destroy: bag.dispose };
}

hairline({
  name: "sandtable",
  means: "A kids' water table with a toy boat afloat: the boat glides towards the pointer and its ripples go with it.",
  rules: [3, 5, 6, 8],
  range: [4, 7, 10],
  tour: [[122, 114], [278, 142], [228, 167], null],
  mount,
});
