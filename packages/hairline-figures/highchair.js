/**
 * High chair: a seat with a tall back and side panels on four splayed legs,
 * and a wide tray hinged at the front of the arms. The pointer over the chair
 * swings the tray up on its hinge to let the child in; at rest the tray sits
 * tipped a little, its edge bright. The slider is how far it swings.
 *
 * The pattern: one part answering (hinge).
 */
const {
  Cam, fit, facing, prism, proj, rings, rrect, ringAt, poly, hull, open, run, clamp, unproj, rad,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const SW = 32, SZ = 44, AZ = 56, HX = 34, TU = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = 45 + value * 40;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-12, -12, 0], [SW + 12, SW + 12, 0], [SW + 12, -12, 0], [-12, SW + 12, 0], [0, 0, 92], [HX, -6, AZ + TU + 2], [HX + TU, SW + 6, AZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const leg = (fx, fy, tx, ty) => {
    const foot = rrect(fx - 2.4, fy - 2.4, fx + 2.4, fy + 2.4, 2.4, 3), top = rrect(tx - 2, ty - 2, tx + 2, ty + 2, 2, 3);
    put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, SZ - 4)))), crease: "" });
  };

  // legs splay out, back to front; a footrest bar between the front pair
  leg(-10, -10, 3, 3);
  leg(SW + 10, -10, SW - 3, 3); leg(-10, SW + 10, 3, SW - 3);
  leg(SW + 10, SW + 10, SW - 3, SW - 3);
  box(SW + 2, 2, SW + 6, SW - 2, 16, 19, 1.5, 0.6);
  // back, seat, side panels
  box(0, 0, 4, SW, SZ, 92, 3, 1.2);
  box(0, 0, SW, SW, SZ - 6, SZ, 4, 1.6);
  box(4, -2, HX, 2, SZ, AZ, 2, 0.8);
  box(4, SW - 2, HX, SW + 2, SZ, AZ, 2, 0.8);

  // the tray: a thick plate hinged along x = HX at height AZ
  const tray = solid(g), lip = mk("path", { class: "lo nf" }, g);
  tray.sil.classList.add("hi");
  const ring = rrect(0, -8, TU, SW + 8, 5, 6), inner = rrect(2.5, -5.5, TU - 2.5, SW + 5.5, 3, 6);
  const at = (q, a, h) => {
    const c = Math.cos(a), s = Math.sin(a);
    return P(HX + q.u * c - h * s, q.v, AZ + q.u * s + h * c);
  };
  const sp = spring(0.15);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const a = rad(p * amax);
    const bot = ring.map((q) => at(q, a, 0)), top = ring.map((q) => at(q, a, 2.5));
    tray.sil.setAttribute("d", poly(hull(bot.concat(top))));
    tray.cr.setAttribute("d", poly(top));
    lip.setAttribute("d", poly(inner.map((q) => at(q, a, 3.6))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(sp.x);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SZ);
    const inside = x > -10 && x < HX + TU + 4 && y > -12 && y < SW + 12;
    sp.t = inside ? clamp(0.6 + (x / (HX + TU)) * 0.4, 0.6, 1) : 0.15;
    read.textContent = inside ? "tray up" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0.15; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = 45 + v * 40; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "highchair",
  means: "A high chair on splayed legs: over it, the wide tray at the front of the arms swings up on its hinge to let the child in.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[243, 159], [224, 185], [205, 172], null],
  mount,
});
