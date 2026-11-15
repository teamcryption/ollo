/**
 * Tile cutter: a manual tile cutter, a long bed with end blocks and twin
 * rails, a tile laid on it and a scoring carriage with a tall handle. The
 * carriage slides along the rails to the pointer, the handle leaning into
 * the cut. At rest it waits near the start, handle bright. The slider is how
 * far it may travel.
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
const REST = -20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, on = false;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-46, -16, 0], [46, 16, 0], [-30, 0, 52], [34, 0, 52]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const bed = box(g), back = box(g), tile = box(g);
  drawBox(P, bed, [-46, 46, -16, 16, 0, 5], ID);
  drawBox(P, back, [-46, -38, -16, 16, 5, 16], ID);
  drawBox(P, tile, [-32, 32, -13, 13, 5, 7], ID);
  mk("path", { class: "dash", d: seg(P(-32, 0, 7), P(32, 0, 7)) }, g);
  const rails = [box(g), box(g)];
  rails.forEach((r, i) => drawBox(P, r, [-38, 38, (i ? 7 : -9), (i ? 9 : -7), 12, 14], ID));
  const car = box(g), handle = box(g), knob = box(g), front = box(g);
  drawBox(P, front, [38, 46, -16, 16, 5, 16], ID);
  handle.sil.classList.add("hi");
  const cx = spring(REST);
  function draw() {
    const lean = clamp((cx.x - REST) / 50, -1, 1) * 18;
    drawBox(P, car, [-6, 6, -12, 12, 0, 6], xf([cx.x, 0, 10], 0, 0, 0));
    const T = xf([cx.x, 0, 16], 0, rad(-20 - lean), 0);
    drawBox(P, handle, [-2.2, 2.2, -2.2, 2.2, 0, 30], T);
    drawBox(P, knob, [-4, 4, -4, 4, 30, 38], T);
    read.textContent = !on ? "rest" : Math.round(cx.t + 32) + "mm";
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(cx, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    on = true;
    const [x] = unproj(C, sx, sy, 10);
    cx.t = clamp(x, REST - 10 * reach, REST + 52 * reach);
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { on = false; cx.t = REST; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "tilecutter",
  means: "A manual tile cutter: the scoring carriage slides along its rails to the pointer, the tall handle leaning into the cut.",
  rules: [1, 3, 5],
  range: [0.2, 1, 1],
  tour: [[180, 172], [237, 199], [246, 203], null],
  mount,
});
