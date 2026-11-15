/**
 * Currency exchange: a kiosk booth with a canopy, a wide service window and
 * a slotted counter tray, the window closed by a ribbed roller shutter. The
 * pointer over the booth rolls the shutter up, as far as it is high up the
 * window. At rest the shutter is a little open over the tray, bright. The
 * slider is the shutter's speed.
 *
 * The pattern: one part sliding with the pointer; the hit is on the ground
 * plane, which never moves.
 */
const { Cam, clamp, fit, hull, open, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 44, D = 26, H = 52, WX0 = 4, WX1 = 40, WZ0 = 15, WZ1 = 46, RIB = 1.25, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dur = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-2, -2, 0], [W + 2, D + 8, 0], [-2, D + 8, H + 6], [W + 2, -2, H + 6], [W + 2, D + 8, 0], [-2, -2, 0]], 200, 160);
  const P = proj(C);
  const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(P(x, y, z)); return o; };
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(box(0, 0, 0, W, D, H))) }, g);
  mk("path", { class: "sil", d: poly(hull(box(-2, -2, H, W + 2, D + 6, H + 5))) }, g);
  const f = (x, z) => P(x, D, z);
  mk("path", { class: "nf lo", d: poly([f(WX0, WZ0), f(WX1, WZ0), f(WX1, WZ1), f(WX0, WZ1)]) + poly([f(WX0 + 10, WZ0 + 2), f(WX1 - 10, WZ0 + 2), f(WX1 - 10, WZ0 + 6), f(WX0 + 10, WZ0 + 6)]) + open([f(WX0 + 2, WZ0 + 10), f(WX1 - 2, WZ0 + 10)]) + open([f(3, 6), f(W - 3, 6)]) }, g);
  mk("path", { class: "sil", d: poly(hull(box(WX0 - 2, D, WZ0 - 2.5, WX1 + 2, D + 7, WZ0))) }, g);
  mk("path", { class: "nf lo", d: poly(hull(box(WX0 + 6, D, WZ1 + 2, WX1 - 6, D + 0.3, WZ1 + 5.5))) }, g);
  const shut = mk("path", { class: "sil hi" }, g), ribs = mk("path", { class: "nf lo" }, g);
  const up = tween(REST);
  let last = NaN;
  function draw(u) {
    if (u === last) return;
    last = u;
    const zb = WZ0 + u;
    shut.setAttribute("d", poly([f(WX0, zb), f(WX1, zb), f(WX1, WZ1), f(WX0, WZ1)]));
    let d = "";
    for (let z = WZ1 - RIB; z > zb + 0.5; z -= RIB) d += open([f(WX0 + 0.8, z), f(WX1 - 0.8, z)]);
    ribs.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(up, now)); return !tdone(up, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -4 || x > W + 4 || y < -4 || y > D + 30) return -1;
    return clamp(Math.round(((y - D + 4) / 30) * 4) / 4, 0.25, 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(up, a < 0 ? REST : a * (WZ1 - WZ0 - 1.5), performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "open " + Math.round(a * 100) + "%";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dur = v; }, destroy: bag.dispose };
}

hairline({
  name: "currencybooth",
  means: "A currency exchange booth: the pointer rolls up the ribbed shutter over its service window, further the closer it comes.",
  rules: [1, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[119, 261], [168, 236], [146, 247], null],
  mount,
});
