/**
 * Ear thermometer: a handheld thermometer standing in its dock, a short
 * probe on top and a screen on its face. The pointer turns it in the dock to
 * face it and tips the probe toward it. At rest it is turned a little, the
 * screen bright. The slider is how far it tips.
 */
const {
  Cam, circ, rrect, fit, facing, poly, prism, proj, rings, unproj, clamp, rad, hull,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 8, Z1 = 70;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-26, -26, 0], [26, 26, 0], [0, 0, Z1 + 20], [-20, 20, 60], [20, -20, 60]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [d0, d1] = rings(-24, -24, 24, 24, 12, 2);
  put(solid(g), prism(P, front, d0, d1, 0, Z0));
  const body = mk("path", { class: "" }, g), seam = mk("path", { class: "nf lo" }, g);
  const probe = mk("path", { class: "" }, g), tip = mk("path", { class: "nf lo" }, g);
  const scr = mk("path", { class: "sil" }, g), btn = mk("path", { class: "nf lo" }, g);
  const yaw = spring(rad(20)), tip0 = spring(rad(8));
  const shape = rrect(-9, -15, 9, 15, 8, 6);

  function draw() {
    const y = yaw.x, t = tip0.x, c = Math.cos(y), s = Math.sin(y);
    const R = (u, v, z) => { const lean = (z - Z0) * Math.tan(t); return P(c * (u + lean) - s * v, s * (u + lean) + c * v, z); };
    const ringZ = (z, sc = 1) => shape.map((q) => R(q.u * sc, q.v * sc, z));
    body.setAttribute("d", poly(hull(ringZ(Z0).concat(ringZ(Z1 - 6), ringZ(Z1, 0.85)))));
    seam.setAttribute("d", poly(ringZ(Z1, 0.85)));
    const pr = (z, r, off) => circ(r, 20).map((q) => R(q.u + off, q.v, z));
    probe.setAttribute("d", poly(hull(pr(Z1, 7, 2).concat(pr(Z1 + 12, 4, 6)))));
    tip.setAttribute("d", poly(pr(Z1 + 12, 4, 6)));
    const vis = Math.cos(y) + Math.sin(y) > -0.2;
    scr.setAttribute("d", vis ? poly([R(9.2, -7, 40), R(9.2, 7, 40), R(9.2, 7, 54), R(9.2, -7, 54)]) : "");
    btn.setAttribute("d", vis ? poly(circ(3, 14).map((q) => R(9.2, q.u, 30 + q.v))) : "");
  }
  draw();
  scr.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(yaw, dt) | stepS(tip0, dt); draw(); return !!m; });
  bag.add(B.unregister);
  function aim(wx, wy) {
    const a = Math.atan2(wy, wx);
    let dd = a - yaw.t; dd = Math.atan2(Math.sin(dd), Math.cos(dd));
    yaw.t += dd;
    const k = clamp(Math.hypot(wx, wy) / 70, 0, 1);
    tip0.t = rad(reach) * k;
    read.textContent = (36.4 + 1.2 * k).toFixed(1) + "°";
    B.wake();
  }
  function rest() { yaw.t = rad(20) + Math.round((yaw.t - rad(20)) / (2 * Math.PI)) * 2 * Math.PI; tip0.t = rad(8); read.textContent = "rest"; B.wake(); }
  rest();
  bag.add(pointer(stage, { move: ([sx, sy]) => { const [wx, wy] = unproj(C, sx, sy, 0); aim(wx, wy); }, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "earthermo",
  means: "An ear thermometer in its dock: it turns to face the pointer and tips its probe toward it, the screen lit.",
  rules: [1, 3, 5, 6],
  range: [0, 15, 30],
  tour: [[340, 230], [60, 230], [200, 300], null],
  mount,
});
