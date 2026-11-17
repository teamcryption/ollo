/**
 * Bath rack: the two rims of a tub with a slatted tray laid across them, a
 * bar of soap on the tray, the tray bright at rest. The tray slides along the
 * rims to sit where the pointer is, and tips a little as it travels. The
 * slider is how far it tips.
 *
 * The pattern: one part that slides along a track (spring).
 */
const { Cam, fit, hull, poly, proj, rings, prism, facing, put, solid, rrect, ringAt, unproj, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const L = 150, W = 56, RW = 30, RZ = 8, REST = 48;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -8, 0], [L, W + 8, 0], [0, W + 8, 0], [L, -8, 0], [L / 2, W / 2, RZ + 14]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const y of [-8, W]) { const [a, b] = rings(0, y, L, y + 8, 4, 1.2); put(solid(g), prism(P, front, a, b, 0, RZ)); }
  const tray = mk("path", { class: "sil hi" }, g), slots = mk("path", { class: "nf lo" }, g), soap = mk("path", { class: "sil" }, g);
  const x = spring(REST);
  let last = NaN;
  function draw(cx) {
    if (cx === last) return;
    last = cx;
    const tip = clamp((cx - x.t) * 0.04 * amt, -6, 6);
    const Z = (px, z) => z + (px - cx) * tip * 0.05;
    const ring = rrect(cx - RW / 2, -12, cx + RW / 2, W + 12, 4, 4);
    const pts = ring.map((q) => P(q.u, q.v, Z(q.u, RZ))).concat(ring.map((q) => P(q.u, q.v, Z(q.u, RZ + 3))));
    tray.setAttribute("d", poly(hull(pts)));
    let d = "";
    for (let i = 0; i < 5; i++) { const y0 = 2 + i * 11; d += poly(rrect(cx - RW / 2 + 4, y0, cx + RW / 2 - 4, y0 + 5, 2.4, 3).map((q) => P(q.u, q.v, Z(q.u, RZ + 3)))); }
    slots.setAttribute("d", d);
    const s = rrect(cx - 9, W / 2 - 14, cx + 7, W / 2 + 10, 6, 4);
    soap.setAttribute("d", poly(hull(s.map((q) => P(q.u, q.v, Z(q.u, RZ + 3))).concat(s.map((q) => P(q.u, q.v, Z(q.u, RZ + 10)))))));
  }
  const B = register(stage, (dt) => { const m = stepS(x, dt); draw(x.x); return m; });
  bag.add(B.unregister);
  function to(v, label) {
    x.t = v;
    read.textContent = label;
    B.wake();
  }
  to(REST, "rest");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [wx, wy] = unproj(C, sx, sy, RZ);
      if (wy < -30 || wy > W + 30) return to(REST, "rest");
      const v = clamp(wx, RW / 2 + 2, L - RW / 2 - 2);
      to(v, Math.round(v) + "cm");
    },
    leave: () => to(REST, "rest"),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bathrack",
  means: "A slatted bath tray across a tub's two rims: it slides along the rims to sit under the pointer, tipping a little as it goes.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 2],
  tour: [[262, 178], [146, 70], [262, 178], null],
  mount,
});
