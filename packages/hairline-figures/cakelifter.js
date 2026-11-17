/**
 * Cake leveler: a round cake and a U-shaped frame strung with one wire at
 * the cut height. At rest the frame stands at the back of the cake, its wire
 * bright. The pointer over the cake slides the frame through it, and the
 * cut top layer slides off with it. The slider is how far the layer goes.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const CX = 40, CY = 40, R = 32, Z1 = 18, Z2 = 32, FH = 48, FY = R + 9;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let far = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[CX - R - 14, CY - FY, 0], [CX + R + 30, CY + FY, 0], [CX - R - 14, CY - FY, FH], [CX + R + 30, CY + FY, FH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const backLeg = mk("path", { class: "nf" }, g);
  put(solid(g), prism(P, front, disc(CX, CY, R), disc(CX, CY, R - 2), 0, Z1));
  const wire = mk("path", { class: "nf hi" }, g);
  const top = solid(g);
  const frontLeg = mk("path", { class: "nf" }, g), bar = mk("path", { class: "sil" }, g);
  const tw = tween(0);
  let last = NaN;
  const rod = (x, y, z0, z1) => poly(hull(ringAt(P, disc(x, y, 1.6, 10), z0).concat(ringAt(P, disc(x, y, 1.6, 10), z1))));
  function draw(t) {
    if (t === last) return;
    last = t;
    const x = lerp(CX - R - 10, CX + R + 10, t), off = t * far;
    backLeg.setAttribute("d", rod(x, CY - FY, Z1, FH));
    wire.setAttribute("d", "M" + P(x, CY - FY, Z1) + "L" + P(x, CY + FY, Z1));
    put(top, prism(P, front, disc(CX + off, CY, R), disc(CX + off, CY, R - 2), Z1 + 0.5, Z2));
    frontLeg.setAttribute("d", rod(x, CY + FY, Z1, FH));
    bar.setAttribute("d", poly(hull(ringAt(P, disc(x, CY - FY, 2.2, 10), FH).concat(ringAt(P, disc(x, CY + FY, 2.2, 10), FH), ringAt(P, disc(x, CY - FY, 2.2, 10), FH + 4), ringAt(P, disc(x, CY + FY, 2.2, 10), FH + 4)))));
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "cut" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0), [u, v] = unproj(C, sx, sy, Z2); set(Math.hypot(x - CX, y - CY) < R + 14 || Math.hypot(u - CX, v - CY) < R + 6); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { far = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cakelifter",
  means: "A cake leveler: its wire frame slides through the cake when the pointer comes near, and the cut top layer slides off.",
  rules: [1, 3, 5, 6],
  range: [0, 14, 24],
  tour: [[187, 138], [136, 226], [238, 226], null],
  mount,
});
