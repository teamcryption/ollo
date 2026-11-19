/**
 * Milkshake mixer: a diner spindle mixer, a heavy base, a column at the back,
 * a rounded motor head reaching forward, the spindle hanging from it with its
 * agitator disc, and a tall steel cup pushed up around the spindle. The
 * pointer over the mixer tilts the cup off the spindle on its front bottom
 * edge, showing the spindle and disc. At rest the cup leans a little, bright.
 * The slider is how far the cup tilts.
 *
 * The pattern: one part tilts on a pivot; the hit is the rest pose's box.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 5, CX = 15, CY = 27, RB = 6.5, RT = 9, CH = 34, HZ0 = 52, HZ1 = 62, REST = 5;
const YP = CY + RB;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 3.3);
  const ext = [[0, 0, 0], [30, 0, 0], [0, 46, 0], [30, 46, 0], [6, 0, HZ1], [24, 37, HZ1], [CX, 66, 22], [CX - RT, 62, 32], [CX + RT, 62, 32]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the base, the column at the back and the motor head reaching forward
  const [br, bi] = rings(0, 0, 30, 46, 7, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [cr, ci] = rings(10, 2, 20, 11, 4, 1.2);
  put(solid(g), prism(P, front, cr, ci, BZ, HZ0 + 2));
  const [hr, hi] = rings(5, 1, 25, 37, 8, 1.6);
  const head = solid(g);
  put(head, prism(P, front, hr, hi, HZ0, HZ1));
  mk("path", { class: "nf lo", d: seg(P(25, 18, HZ0 + 3), P(25, 30, HZ0 + 3)) }, head.g);

  // the spindle and its agitator disc
  const disc = circ(2.6, 20).map((q) => P(CX + q.u, CY + q.v, BZ + 20));
  const spin = solid(g);
  spin.sil.setAttribute("d", poly(hull(disc.concat(circ(2.6, 20).map((q) => P(CX + q.u, CY + q.v, BZ + 21.4))))));
  mk("path", { class: "nf", d: seg(P(CX, CY, HZ0), P(CX, CY, BZ + 21.4)) }, g);

  // the cup: a tapered steel tumbler, tilting on its front bottom edge
  const cup = solid(g);
  cup.sil.classList.add("hi");
  const ringPts = (r, z, t) => circ(r, 28).map((q) => {
    const dy = CY + q.v - YP, dz = z;
    return P(CX + q.u, YP + dy * Math.cos(t) + dz * Math.sin(t), BZ - dy * Math.sin(t) + dz * Math.cos(t));
  });
  let last = NaN;
  function drawCup(deg) {
    if (deg === last) return;
    last = deg;
    const t = (deg * Math.PI) / 180;
    cup.sil.setAttribute("d", poly(hull(ringPts(RB, 0, t).concat(ringPts(RT, CH, t)))));
    cup.cr.setAttribute("d", poly(ringPts(RT - 1, CH, t)));
  }

  const tilt = tween(REST);
  const B = register(stage, (_dt, now) => { drawCup(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(B.unregister);

  // the hit: the screen box of the mixer's rest and tilted poses, which never moves
  const sp = ext.map((p) => P(...p));
  const bx = [Math.min(...sp.map((p) => p[0])), Math.max(...sp.map((p) => p[0])), Math.min(...sp.map((p) => p[1])), Math.max(...sp.map((p) => p[1]))];
  const hit = ([x, y]) => x > bx[0] - 4 && x < bx[1] + 4 && y > bx[2] - 4 && y < bx[3] + 4;

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tilt, on ? clamp(maxT, 0, 60) : REST, performance.now(), 0);
    read.textContent = on ? "tilt" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "milkshakemixer",
  means: "A diner spindle mixer: over it, the steel cup tilts off the spindle on its front edge, baring the agitator.",
  rules: [1, 4, 5, 8],
  range: [20, 40, 60],
  tour: [[181, 155], [236, 82], [258, 240], null],
  mount,
});
