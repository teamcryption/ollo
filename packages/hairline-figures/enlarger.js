/**
 * Enlarger: a darkroom photo enlarger, a baseboard with a print easel, a
 * tall column at the back, and the lamp head on its arm with the lens and
 * bellows below. The pointer over the enlarger cranks the head up the
 * column, the bellows stretching under it. At rest the head sits low, its
 * lens rim bright over the easel. The slider is how far it climbs.
 *
 * The pattern: one part sliding on a fixed track; the hit is the rest box.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 4, CH = 104, H0 = 36, HX = 18, HY = 8, HW = 30, HD = 28, HH = 20;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.95);
  const ext = [[-4, -4, 0], [62, 54, 0], [62, -4, 0], [-4, 54, 0], [4, 16, CH + 4], [HX + HW, HY + HD, H0 + 40 + HH], [HX, HY, H0 + 40 + HH]];
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, 62, 54, 4, 1.4);
  const board = solid(g);
  put(board, prism(P, front, br, bi, 0, BZ));
  // the easel: a frame lying on the board, with its blades
  const [er, ei] = rings(HX - 2, HY + 4, HX + HW + 6, HY + HD + 10, 1.5, 4);
  mk("path", { class: "nf lo", d: poly(ringAt(P, er, BZ)) + poly(ringAt(P, ei, BZ)) }, g);
  // the column, standing at the back
  const [cr, ci] = rings(0, 14, 8, 22, 3, 1);
  put(solid(g), prism(P, front, cr, ci, BZ, CH));
  const head = mk("g", {}, g);
  const arm = solid(head), bel = mk("path", { class: "nf" }, head), lens = solid(head), box = solid(head), lamp = solid(head);
  const LX = HX + HW / 2 + 2, LY = HY + HD / 2 + 2;
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const [ar, ai] = rings(6, 14, HX + 2, 22, 1.5, 0.6);
    put(arm, prism(P, front, ar, ai, z + 6, z + 14));
    const top = ringAt(P, disc(LX, LY, 10), z), bot = ringAt(P, disc(LX, LY, 8), z - 10 - (z - H0) * 0.25);
    bel.setAttribute("d", poly(hull(top.concat(bot))));
    const lz = z - 10 - (z - H0) * 0.25;
    put(lens, prism(P, front, disc(LX, LY, 6), disc(LX, LY, 4.6), lz - 8, lz));
    const [hr, hi] = rings(HX, HY, HX + HW, HY + HD, 6, 1.8);
    put(box, prism(P, front, hr, hi, z, z + HH));
    put(lamp, prism(P, front, disc(LX, LY, 9), disc(LX, LY, 7.4), z + HH, z + HH + 6));
  }
  const hz = tween(H0);
  const B = register(stage, (_dt, now) => { draw(tval(hz, now)); return !tdone(hz, now); });
  bag.add(B.unregister);

  const box0 = hull(ext.map((p) => P(...p)));
  const xs = box0.map((p) => p[0]), ys = box0.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(hz, a > 0 ? H0 + lift : H0, performance.now(), 0);
    lens.sil.classList.toggle("hi", a <= 0);
    box.sil.classList.toggle("hi", a > 0);
    read.textContent = a > 0 ? "head +" + Math.round(lift) : "rest";
    B.wake();
  }
  setActive(0);
  const hit = ([sx, sy]) => (sx > x0 && sx < x1 && sy > y0 && sy < y1 ? 1 : 0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "enlarger",
  means: "A darkroom photo enlarger: with the pointer over it, the lamp head climbs its column and the bellows stretch under it.",
  rules: [1, 5, 6],
  range: [10, 28, 40],
  tour: [[210, 149], [206, 250], [175, 90], null],
  mount,
});
