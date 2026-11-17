/**
 * Truffle box: a shallow box of twelve truffles in a grid, its lid hinged
 * along the back edge. The pointer over the box swings the lid up to show
 * the truffles; leaving lowers it to rest just ajar. At rest the lid is
 * bright. The slider is how far the lid opens.
 *
 * The pattern: one plate turned about a fixed hinge; the hit is the box's
 * rest footprint, which never moves. The lid is painted behind the truffles
 * once it stands past upright.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, rrect, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BW = 92, BD = 64, H = 14, LT = 3, REST = 12;
const disc = (x, y, r, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [BW, BD, 0], [BW, 0, 0], [0, BD, 0], [0, -8, H + BD + 2], [BW, -8, H + BD + 2], [0, BD, H + 12]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g), boxG = mk("g", {}, g);
  const [br, bi] = rings(0, 0, BW, BD, 5, 1.6);
  put(solid(boxG), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(ringAt(P, rrect(3, 3, BW - 3, BD - 3, 3, 4), H)), class: "lo" }, boxG);
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) {
    const x = 14 + i * 21.3, y = 13 + j * 19, pts = [];
    for (const [r, z] of [[7, 0], [6.4, 2.6], [4.6, 4.6], [2, 5.8]]) pts.push(...ringAt(P, disc(x, y, r), H - 1 + z));
    mk("path", { d: poly(hull(pts)) }, boxG);
  }
  const lid = mk("path", { class: "sil hi" }, lidG), lidIn = mk("path", { class: "nf lo" }, lidG);
  const outer = rrect(-1, 0, BW + 1, BD + 1, 5, 4), inner = rrect(5, 6, BW - 5, BD - 5, 3, 4);
  const ang = tween(REST);
  let last = NaN, behind = false;

  // a lid point: x along the hinge, y away from it, d up through the plate
  const L = (a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return (x, y, d) => P(x, y * c - d * s, H + y * s + d * c); };

  function draw(a) {
    if (a === last) return;
    last = a;
    const f = L(a), pts = [];
    for (const q of outer) pts.push(f(q.u, q.v, 0), f(q.u, q.v, LT));
    lid.setAttribute("d", poly(hull(pts)));
    lidIn.setAttribute("d", poly(inner.map((q) => f(q.u, q.v, a > 90 ? 0 : LT))));
    const b = a > 70;
    if (b !== behind) { behind = b; if (b) boxG.after(lidG); else lidG.after(boxG); }
  }
  boxG.after(lidG);

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? max : REST, performance.now(), 0);
    read.textContent = v ? "open " + Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); setOn(x > -12 && x < BW + 12 && y > -12 && y < BD + 12); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "truffletray",
  means: "A box of twelve truffles: the pointer swings its hinged lid up to show them, and leaving lowers it back ajar.",
  rules: [1, 3, 5, 6],
  range: [70, 100, 115],
  tour: [[194, 215], [215, 250], [175, 170], null],
  mount,
});
