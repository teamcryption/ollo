/**
 * Dollhouse: a toy house on a low base, door and windows on its face. The
 * pointer over the house lifts its gable roof off to show the rooms inside;
 * at rest the roof sits a little raised, bright. The slider is the lift.
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 64, Y0 = 0, Y1 = 44, BZ = 4, H = 40, RH = 22, OV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const LIFT = 26;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[X0 - 8, Y0 - 8, 0], [X1 + 8, Y1 + 8, 0], [X1 + 8, Y0 - 8, 0], [X0 - 8, Y1 + 8, 0], [X0, (Y0 + Y1) / 2, BZ + H + RH + LIFT], [X1, (Y0 + Y1) / 2, BZ + H + RH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0 - 8, Y0 - 8, X1 + 8, Y1 + 8, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [hr, hi] = rings(X0, Y0, X1, Y1, 2, 1.4);
  put(solid(g), prism(P, front, hr, hi, BZ, BZ + H));
  // the rooms: the open top, a floor and a party wall seen when the roof is off
  const top = BZ + H;
  mk("path", { d: poly(ringAt(P, hi, top)), class: "nf lo" }, g);
  mk("path", { d: seg(P(X1 / 2, Y0 + 1.4, top), P(X1 / 2, Y1 - 1.4, top)) + seg(P(X1 / 2, Y0 + 1.4, top), P(X1 / 2, Y0 + 1.4, top - 14)), class: "nf lo" }, g);
  // the face: a door and two windows on the near (+y) wall
  const fy = Y1;
  const rect = (u0, u1, z0, z1) => open([P(u0, fy, z0), P(u0, fy, z1), P(u1, fy, z1), P(u1, fy, z0)]);
  mk("path", { d: rect(26, 38, BZ, BZ + 18), class: "nf lo" }, g);
  mk("path", { d: poly([P(8, fy, BZ + 22), P(8, fy, BZ + 32), P(18, fy, BZ + 32), P(18, fy, BZ + 22)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(46, fy, BZ + 22), P(46, fy, BZ + 32), P(56, fy, BZ + 32), P(56, fy, BZ + 22)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(X1, 14, BZ + 22), P(X1, 14, BZ + 32), P(X1, 30, BZ + 32), P(X1, 30, BZ + 22)]), class: "nf lo" }, g);
  const knob = mk("circle", { r: 1.6, class: "dot off" }, g);
  const kp = P(35, fy, BZ + 9); knob.setAttribute("cx", kp[0]); knob.setAttribute("cy", kp[1]);

  const rg = mk("g", {}, g);
  const roof = mk("path", { class: "sil" }, rg), ridge = mk("path", { class: "nf lo" }, rg);
  const REST = 6, z = tween(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const b = top + l, ym = (Y0 + Y1) / 2;
    const pts = [[X0 - OV, Y0 - OV, b], [X1 + OV, Y0 - OV, b], [X1 + OV, Y1 + OV, b], [X0 - OV, Y1 + OV, b], [X0 - OV, ym, b + RH], [X1 + OV, ym, b + RH],
      [X0 - OV, Y0 - OV, b + 2], [X1 + OV, Y0 - OV, b + 2], [X1 + OV, Y1 + OV, b + 2], [X0 - OV, Y1 + OV, b + 2]].map((q) => P(...q));
    const h = hull(pts);
    roof.setAttribute("d", poly(fillet(h, h.map(() => 2), 3)));
    ridge.setAttribute("d", seg(P(X0 - OV + 1, ym, b + RH - 1.5), P(X1 + OV - 1, ym, b + RH - 1.5)) + seg(P(X1 + OV - 1, ym, b + RH - 1.5), P(X1 + OV - 1, Y1 + OV - 1, b + 2)) + seg(P(X0 - OV + 1, Y1 + OV - 1, b + 2), P(X1 + OV - 1, Y1 + OV - 1, b + 2)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  // hit against the house at rest: its box on screen never moves
  const box = [P(X0, Y0, BZ), P(X1, Y1, BZ), P(X1, Y0, BZ + H + RH), P(X0, Y1, BZ + H + RH), P(X1, Y1, 0), P(X0, Y0, BZ + H + RH)];
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? LIFT * (0.5 + 0.5 * amt) : REST, performance.now(), 0);
    knob.setAttribute("class", on ? "dot" : "dot off");
    roof.classList.toggle("hi", !on);
    ridge.setAttribute("class", "nf lo");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "dollhouse",
  means: "A toy house on a base: the pointer over it lifts the gable roof off to show the rooms inside.",
  rules: [1, 4, 5, 6],
  range: [0, 100, 100],
  tour: [[200, 184], [176, 150], [226, 206], null],
  mount,
});
