/**
 * Dog crate: a wire crate on a tray with a cushion inside and a barred door
 * on its front face. The door swings on its hinge to point at the pointer
 * on the ground, closing when the pointer is over the crate. At rest it
 * stands ajar, bright. The slider is how far it may open.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X = 84, Y = 56, H = 50, T = 3, D0 = 10, DW = 64, Z0 = T + 3, Z1 = H - 4, REST = 0.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X + 4, -4, 0], [X + 4, Y + 4, 0], [-4, Y + 4, H], [D0, Y + DW, 0], [D0 + 30, Y + 60, H], [X + 4, Y + 4, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, X + 4, Y + 4, 4, 1.5);
  put(solid(g), prism(P, front, tr, ti, 0, T));
  // the cushion inside
  const cush = circ(18, 36).map((q) => ({ ...q, u: q.u + X / 2, v: q.v * 0.75 + Y / 2 }));
  put(solid(g), prism(P, front, cush, cush.map((q) => ({ ...q, u: X / 2 + (q.u - X / 2) * 0.8, v: Y / 2 + (q.v - Y / 2) * 0.8 })), T, T + 7));
  // back wires, then the frame
  let d = "";
  for (let x = 6; x < X; x += 6) d += seg(P(x, 0, T), P(x, 0, H));
  for (let y = 6; y < Y; y += 6) d += seg(P(0, y, T), P(0, y, H));
  for (let x = 6; x < X; x += 12) d += seg(P(x, 0, H), P(x, Y, H));
  mk("path", { d, class: "nf lo" }, g);
  let e = "";
  const box = [[0, 0], [X, 0], [X, Y], [0, Y]];
  for (let i = 0; i < 4; i++) { const [a, b] = [box[i], box[(i + 1) % 4]]; e += seg(P(a[0], a[1], H), P(b[0], b[1], H)) + seg(P(a[0], a[1], T), P(b[0], b[1], T)); e += seg(P(a[0], a[1], T), P(a[0], a[1], H)); }
  for (let y = 6; y < Y; y += 6) e += seg(P(X, y, T), P(X, y, H));
  for (let x = 2; x <= D0; x += 4) e += seg(P(x, Y, T), P(x, Y, H));
  for (let x = D0 + DW; x < X; x += 4) e += seg(P(x, Y, T), P(x, Y, H));
  mk("path", { d: e, class: "nf" }, g);
  const opening = mk("path", { class: "nf dash", d: poly([P(D0, Y, Z0), P(D0 + DW, Y, Z0), P(D0 + DW, Y, Z1), P(D0, Y, Z1)]) }, g);
  const bars = mk("path", { class: "nf" }, g), door = mk("path", { class: "nf sil" }, g), latch = mk("path", { class: "nf" }, g);
  const ang = spring(REST, { k: 90, c: 15 });
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), at = (w, z) => P(D0 + w * c, Y + w * s, z);
    door.setAttribute("d", poly([at(0, Z0), at(DW, Z0), at(DW, Z1), at(0, Z1)]));
    let b = "";
    for (let w = 6; w < DW; w += 6) b += seg(at(w, Z0), at(w, Z1));
    for (const z of [Z0 + 13, Z1 - 13]) b += seg(at(0, z), at(DW, z));
    bars.setAttribute("d", b);
    latch.setAttribute("d", poly(hull([at(DW - 2, 24), at(DW + 5, 24), at(DW + 5, 30), at(DW - 2, 30)])));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { ang.t = Math.min(REST, maxA); read.textContent = "rest"; B.wake(); return; }
    const [qx, qy] = unproj(C, p[0], p[1], 0);
    const a = qy <= Y ? 0 : clamp(Math.atan2(qy - Y, qx - D0), 0, maxA);
    ang.t = a;
    read.textContent = a < 0.05 ? "shut" : Math.round((a * 180) / Math.PI) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = (v * Math.PI) / 180; }, destroy: bag.dispose };
}

hairline({
  name: "dogcrate",
  means: "A wire dog crate: its barred door swings on the hinge to point at the pointer, and shuts when the pointer is over the crate.",
  rules: [1, 3, 4, 5],
  range: [60, 100, 120],
  tour: [[227, 237], [52, 220], [15, 202], null],
  mount,
});
