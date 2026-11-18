/**
 * Low loader: a heavy-haul trailer with a raised gooseneck at the front, a
 * low deck and two loading ramps hinged at the tail. At rest the ramps stand
 * stowed upright, the near one bright; the pointer over the trailer lowers
 * them back onto the ground. The slider is how far they come down.
 */
const {
  Cam, fit, hull, poly, proj, rings, prism, facing, rrect, rad, clamp, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, register, solid, put,
} = HL;

const E = 166, L = 112, W = 56, DZ = 12, TZ = 18, RL = 46, RT = 3, UP = 78, LOW = -Math.asin(TZ / RL) * 180 / Math.PI;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxD = value;
  const C = Cam(45, 0.5, 1.62);
  // a ramp point: u along the ramp from the hinge, y across, w down through its thickness
  const rp = (u, y, w, th) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return [E + u * c + w * s, y, TZ + u * s - w * c]; };
  fit(C, [[E + RL, 0, 0], [E + RL, W, 0], [E, 0, TZ + RL], [-2, 0, 0], [-2, W, 0], [-2, 0, 40], [E - L, W, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent) => { const s = solid(parent); const [rg, inn] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, rg, inn, z0, z1)); return s; };
  const wheel = (x, y0, y1) => {
    const pts = [];
    for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; for (const y of [y0, y1]) pts.push(P(x + 8 * Math.cos(t), y, 8 + 8 * Math.sin(t))); }
    mk("path", { d: poly(hull(pts)), class: "sil" }, g);
  };
  const ramp = (y0, y1) => {
    const e = mk("g", {}, g);
    return { y0, y1, sil: mk("path", { class: "sil" }, e), cr: mk("path", { class: "nf lo" }, e), rib: mk("path", { class: "nf lo" }, e) };
  };
  // gooseneck at the far end, neck, far wheels, deck, near wheels, then the tail ramps
  box(6, 14, 16, W - 14, 3, 1, 22, 32, g);
  box(0, 2, E - L + 2, W - 2, 6, 1.8, 32, 40, g);
  box(E - L - 10, 4, E - L + 6, W - 4, 4, 1.4, DZ, 40, g);
  for (const x of [130, 150]) wheel(x, -2, 8);
  box(E - L, 0, E, W, 4, 1.6, DZ, TZ, g);
  for (const x of [130, 150]) wheel(x, W - 8, W + 2);
  const rA = ramp(4, 22), rB = ramp(34, 52);
  const ring = rrect(0, 0, RL, 1, 1.5, 3);
  function drawRamp(R, th) {
    const top = rrect(0, R.y0, RL, R.y1, 1.5, 3), inn = rrect(1.4, R.y0 + 1.4, RL - 1.4, R.y1 - 1.4, 1, 3);
    const pts = top.map((q) => P(...rp(q.u, q.v, 0, th))).concat(top.map((q) => P(...rp(q.u, q.v, RT, th))));
    R.sil.setAttribute("d", poly(hull(pts)));
    R.cr.setAttribute("d", poly(inn.map((q) => P(...rp(q.u, q.v, 0, th)))));
    let d = "";
    for (const u of [12, 24, 36]) d += "M" + P(...rp(u, R.y0 + 2, 0, th)).join(",") + "L" + P(...rp(u, R.y1 - 2, 0, th)).join(",");
    R.rib.setAttribute("d", d);
  }
  void ring;
  const tw = tween(UP);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    drawRamp(rA, th);
    drawRamp(rB, th);
  }
  const target = () => clamp(UP - maxD, LOW, UP);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? target() : UP, performance.now(), 0);
    rB.sil.classList.toggle("hi", true);
    rA.sil.classList.toggle("hi", on);
    read.textContent = on ? "ramp " + Math.round(UP - target()) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ);
    return x > -2 && x < E + 12 && y > -2 && y < W + 2;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { maxD = v; if (act) { tset(tw, target(), performance.now(), 0); read.textContent = "ramp " + Math.round(UP - target()) + "°"; } B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "lowloader",
  means: "A low loader trailer: the pointer lowers its two stowed tail ramps from upright down onto the ground for loading.",
  rules: [1, 3, 5, 6],
  range: [40, 98, 98],
  tour: [[180, 160], [203, 173], [224, 191], null],
  mount,
});
