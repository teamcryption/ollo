/**
 * Laser level: a self-levelling laser head on a three-legged tripod. The head
 * turns on its mount to face the pointer and its beam sweeps round with it.
 * At rest it faces a little to the left, its lens bright. The slider is how
 * far the head may turn from its rest.
 */
const { Cam, clamp, fit, hull, poly, proj, unproj, seg, spring, stepS, disposer, mk, pointer, register, rad } = HL;

// T: local box points through a pivot, rotated about x (rx), then y (ry), then z (az)
function xf(pv, az, ry, rx) {
  const ca = Math.cos(az), sa = Math.sin(az), cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
  return ([x, y, z]) => {
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx, x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
    return [pv[0] + x2 * ca - y1 * sa, pv[1] + x2 * sa + y1 * ca, pv[2] + z2];
  };
}
const ID = xf([0, 0, 0], 0, 0, 0);
function box(g) { const grp = mk("g", {}, g); return { g: grp, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp) }; }
function drawBox(P, el, b, T) {
  const [x0, x1, y0, y1, z0, z1] = b, pts = [];
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) pts.push(P(...T([x, y, z])));
  el.sil.setAttribute("d", poly(hull(pts)));
  el.cr.setAttribute("d", poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map((p) => P(...T(p)))));
}
const H = 46, REST = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, on = false;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[-30, -30, 0], [30, 30, 0], [0, 0, H + 18], [62, 0, H + 6], [0, 62, H + 6], [-62, 0, H + 6]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const feet = [90, 210, 330].map((d) => [26 * Math.cos(rad(d + 45)), 26 * Math.sin(rad(d + 45)), 0]);
  mk("path", { d: feet.map((f) => seg(P(...f), P(f[0] * 0.15, f[1] * 0.15, H - 6))).join("") }, g);
  const hub = box(g);
  drawBox(P, hub, [-6, 6, -6, 6, H - 6, H], ID);
  const beam = mk("path", { class: "dash" }, g), body = box(g), lens = box(g);
  lens.sil.classList.add("hi");
  const az = spring(REST);
  function draw() {
    const T = xf([0, 0, H], rad(az.x), 0, 0);
    beam.setAttribute("d", seg(P(...T([14, 0, 8])), P(...T([60, 0, 8]))));
    const away = Math.cos(rad(az.x)) + Math.sin(rad(az.x)) < 0;
    if (away) { g.insertBefore(lens.g, body.g); g.insertBefore(beam, lens.g); } else { body.g.after(lens.g); lens.g.after(beam); }
    drawBox(P, body, [-10, 10, -8, 8, 0, 16], T);
    drawBox(P, lens, [10, 14, -4, 4, 4, 12], T);
    read.textContent = !on ? "rest" : Math.round(((az.t % 360) + 360) % 360) + "°";
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(az, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    on = true;
    const [x, y] = unproj(C, sx, sy, 0);
    const a = Math.atan2(y, x) * 180 / Math.PI, d = ((a - REST + 540) % 360) - 180;
    az.t = REST + clamp(d, -180 * reach, 180 * reach);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { on = false; az.t = REST; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "laserlevel",
  means: "A laser level on a tripod: the head turns on its mount to face the pointer and its beam sweeps round with it.",
  rules: [1, 3, 5],
  range: [0.2, 1, 1],
  tour: [[128, 178], [80, 202], [290, 190], null],
  mount,
});
