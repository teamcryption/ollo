/**
 * Mutoscope: a cabinet on a pedestal with a viewing hood, a round window on
 * its side showing the reel of flip cards, and a big crank on its front. The
 * pointer picks one of three spots and the crank turns to it, the reel of
 * cards turning with it. At rest the crank stands a little past upright,
 * bright. The slider is how far the crank turns.
 */
const {
  Cam, circ, fillet, fit, facing, hull, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const AX = 15, AZ = 52, AY = 31, ARM = 30, REST = 20, WY = 15, WZ = 58, WR = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [34, 34, 0], [-10, 6, 90], [AX + ARM + 4, AY + 12, AZ], [AX - ARM - 4, AY + 12, AZ], [AX, AY + 12, AZ + ARM + 4], [AX, AY + 12, AZ - ARM - 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-4, -4, 34, 34, 8, 1.6, 0, 4);
  box(10, 10, 20, 20, 3, 1, 4, 30);
  box(-10, 6, 6, 24, 4, 1.4, 70, 84);
  box(0, 0, 30, 30, 4, 1.6, 30, 82);
  box(-2, -2, 32, 32, 5, 1.6, 82, 86);
  mk("path", { d: poly(circ(WR + 2, 28).map((q) => P(30, WY + q.u, WZ + q.v))), class: "nf lo" }, g);
  const cards = mk("path", { class: "nf lo" }, g);
  const arm = mk("path", { class: "sil hi" }, g), hub = mk("path", { class: "nf" }, g), knob = mk("path", {}, g);

  const at = (u, v, th, y) => P(AX + u * Math.cos(th) - v * Math.sin(th), y, AZ + u * Math.sin(th) + v * Math.cos(th));
  const shape = fillet([[-5, -4], [ARM + 4, -3], [ARM + 4, 3], [-5, 4]], [3, 3, 3, 3]);
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(90 + deg);
    arm.setAttribute("d", poly(hull(shape.map(([u, v]) => at(u, v, th, AY)).concat(shape.map(([u, v]) => at(u, v, th, AY + 3))))));
    hub.setAttribute("d", poly(circ(3, 16).map((q) => at(q.u, q.v, th, AY + 3))));
    const tip = circ(3, 16);
    knob.setAttribute("d", poly(hull(tip.map((q) => at(ARM + q.u, q.v, th, AY + 3)).concat(tip.map((q) => at(ARM + q.u, q.v, th, AY + 12))))));
    let d = "";
    for (let k = 0; k < 8; k++) {
      const a = rad(deg * 2 + k * 45);
      d += seg(P(30, WY + 2.5 * Math.cos(a), WZ + 2.5 * Math.sin(a)), P(30, WY + WR * Math.cos(a), WZ + WR * Math.sin(a)));
    }
    cards.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const H = P(AX, AY, AZ);
  function hit([sx, sy]) {
    const dx = sx - H[0], dy = sy - H[1];
    if (Math.abs(dx) > 130 || Math.abs(dy) > 150) return -1;
    return dx < -25 ? 0 : dx < 25 ? 1 : 2;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(ang, a < 0 ? REST : REST + (travel * (a + 1)) / 3, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "turn " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "mutoscope",
  means: "A mutoscope: the pointer picks a spot and the big crank on the cabinet turns there, spinning the reel of flip cards.",
  rules: [1, 3, 5, 6],
  range: [90, 200, 300],
  tour: [[165, 150], [222, 163], [275, 190], null],
  mount,
});
