/**
 * Shawlpin: a ring brooch lying flat, its band open at the front between two
 * knobbed terminals, a long pin hinged on the band's far side and laid across
 * it. The pin swings round its hinge toward the pointer on a spring. At rest
 * it lies a little off the centre line and is bright. The slider is how far
 * it may swing either way.
 *
 * The pattern: a continuous aim (a spring on one angle), read on the ground
 * plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, ringAt, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RO = 52, RI = 40, T = 4.5, L = 106, BASE = 45, REST = 64;
const HX = -46 * Math.SQRT1_2, HY = -46 * Math.SQRT1_2;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  const ext = [[-RO, -RO, 0], [RO, RO, 0], [RO, -RO, 0], [-RO, RO, 0]];
  for (let a = BASE - 50; a <= BASE + 50; a += 10) ext.push([HX + L * Math.cos(rad(a)), HY + L * Math.sin(rad(a)), T + 3]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the band: a flat ring, its hole drawn as the far inner wall showing through
  put(solid(g), prism(P, front, circ(RO, 64), circ(RO - 1.5, 64), 0, T));
  mk("path", { d: poly(ringAt(P, circ(RI, 64), T)) }, g);
  mk("path", { d: poly(ringAt(P, circ(RI, 64), 0)), class: "nf lo" }, g);
  // the gap at the front, and its two knobbed terminals
  for (const s of [-1, 1]) {
    const a = rad(BASE + s * 16), cx = (RO + RI) / 2 * Math.cos(a), cy = (RO + RI) / 2 * Math.sin(a);
    put(solid(g), prism(P, front, disc(cx, cy, 6.5), disc(cx, cy, 5), 0, T + 3));
  }
  mk("path", { d: poly(ringAt(P, disc(HX, HY, 6), T + 3).concat(ringAt(P, disc(HX, HY, 6), T)).reverse()), class: "nf lo" }, g);
  const pin = mk("path", { class: "sil hi" }, g);
  const loop = mk("path", { class: "nf" }, g);
  const sp = spring(REST);
  let last = NaN;

  function draw() {
    const a = sp.x;
    if (a === last) return;
    last = a;
    const ux = Math.cos(rad(a)), uy = Math.sin(rad(a)), z = T + 2;
    const head = ringAt(P, disc(HX, HY, 3.4, 16), z).concat(ringAt(P, disc(HX, HY, 3.4, 16), z + 2));
    const tip = [P(HX + L * ux, HY + L * uy, z), P(HX + L * ux, HY + L * uy, z + 1.2)];
    pin.setAttribute("d", poly(hull(head.concat(tip))));
    loop.setAttribute("d", poly(ringAt(P, disc(HX, HY, 1.6, 12), z + 2)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const a = clamp(Math.atan2(y - HY, x - HX) * 180 / Math.PI, BASE - reach, BASE + reach);
    sp.t = a;
    read.textContent = (a >= BASE ? "+" : "") + Math.round(a - BASE) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "shawlpin",
  means: "A ring brooch lying flat: its long pin swings round the hinge on the far side of the band to point at the pointer.",
  rules: [1, 3, 5, 8],
  range: [20, 45, 50],
  tour: [[361, 179], [39, 179], [200, 262], null],
  mount,
});
