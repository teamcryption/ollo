/**
 * Van loading ramp: a box van with a ramp hinged at the sill of its rear
 * opening. At rest the ramp leans just off the doorway, bright. Over the
 * van it folds down on its hinge toward the ground. The slider is how far
 * it lowers.
 */
const { Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const RX = 70, HZ = 10, L = 40, W = 15, T = 2.4, REST = 16;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-20, -22, 0], [RX, 26, 0], [-20, 22, 0], [RX, -22, 56], [0, 22, 56], [RX + L, 0, 0], [RX, 0, HZ + L + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  box(-20, -20, 4, 20, 8, 1.6, 8, 36);
  box(0, -22, RX, 22, 5, 1.6, 8, 56);
  // the doorway on the rear face
  mk("path", { d: poly(rrect(HZ + 1, -W - 1, 52, W + 1, 3, 6).map((q) => P(RX, q.v, q.u))), class: "nf lo" }, g);
  function wheel(cx) {
    const ring = circ(9, 28), hub = circ(4, 20), s = solid(g);
    const pts = [21, 25].flatMap((y) => ring.map((q) => P(cx + q.u, y, 9 + q.v)));
    put(s, { sil: poly(hull(pts)), crease: poly(hub.map((q) => P(cx + q.u, 25, 9 + q.v))) });
  }
  wheel(-6);
  wheel(54);
  const ramp = solid(g), treads = mk("path", { class: "nf lo" }, g);
  ramp.sil.classList.add("hi");
  const rr = rrect(0, -W, L, W, 3, 6), ri = rrect(1.5, -W + 1.5, L - 1.5, W - 1.5, 2, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const e = toR(90 - a), c = Math.cos(e), s = Math.sin(e);
    const Tf = (u, v, w) => P(RX + u * c - w * s, v, Math.max(0, HZ + u * s) + w * c);
    const pts = rr.map((q) => Tf(q.u, q.v, 0)).concat(rr.map((q) => Tf(q.u, q.v, T)));
    put(ramp, { sil: poly(hull(pts)), crease: poly(ri.map((q) => Tf(q.u, q.v, T))) });
    let d = "";
    for (let k = 1; k <= 5; k++) { const u = (k * L) / 6; d += "M" + Tf(u, -W + 3, T).join(",") + "L" + Tf(u, W - 3, T).join(","); }
    treads.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(40, 0, 24);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? clamp(reach, REST, 104) : REST, performance.now(), 0);
    read.textContent = on ? "down" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 160 && Math.abs(y - mid[1]) < 150; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "truckramp",
  means: "A box van with a loading ramp hinged at its rear sill: over the van, the ramp folds down toward the ground.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 104],
  tour: [[259, 125], [242, 173], [180, 120], null],
  mount,
});
