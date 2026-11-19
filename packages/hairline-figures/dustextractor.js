/**
 * Dust extractor: a drum on four casters with a hose port on its side and a
 * lid on top carrying the motor dome. The lid is hinged at the back; the
 * pointer's height over the extractor tips it open on a spring, the motor
 * dome riding with it. At rest the lid sits a little ajar, its rim bright.
 *
 * The pattern: one part following a continuous input (hinge).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.15, R = 26, CX = 30, CY = 30, DZ = 50, HX = CX - R - 1, MAXA = 62;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [60, 60, 0], [60, 0, 0], [0, 60, 0], [-20, 30, 92], [30, 30, 100], [70, 70, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const caster = (x, y) => put(solid(g), prism(P, front, disc(x, y, 3.5, 16), disc(x, y, 2.5, 16), 0, 6));
  caster(CX - 18, CY - 18); caster(CX + 18, CY - 18); caster(CX - 18, CY + 18);
  put(solid(g), prism(P, front, disc(CX, CY, R, 40), disc(CX, CY, R - 2.4, 40), 6, DZ));
  caster(CX + 18, CY + 18);
  const pc = [CX + R * 0.62, CY + R * 0.85, 30], px = 0.62, py = 0.85;
  const port = [];
  for (const L of [-2, 12]) for (let i = 0; i < 20; i++) {
    const a = (i / 20) * 2 * Math.PI, c = 6 * Math.cos(a), s = 6 * Math.sin(a);
    port.push(P(pc[0] + px * L + py * c * 0.8, pc[1] + py * L - px * c * 0.8, pc[2] + s));
  }
  mk("path", { d: poly(hull(port)), class: "sil" }, g);
  const ring12 = [];
  for (let i = 0; i < 20; i++) { const a = (i / 20) * 2 * Math.PI; ring12.push(P(pc[0] + px * 12 + py * 4.4 * Math.cos(a) * 0.8, pc[1] + py * 12 - px * 4.4 * Math.cos(a) * 0.8, pc[2] + 4.4 * Math.sin(a))); }
  mk("path", { d: poly(ring12), class: "nf lo" }, g);
  const lid = solid(g), dome = solid(g), cap = solid(g);
  const sp = spring(REST);
  let last = NaN;
  const tilt = (ring, z, a) => ring.map((q) => { const dx = q.u - HX, dz = z - DZ; return P(HX + dx * Math.cos(a) - dz * Math.sin(a), q.v, DZ + dx * Math.sin(a) + dz * Math.cos(a)); });
  const body = (s, r, z0, z1, a) => { s.sil.setAttribute("d", poly(hull(tilt(disc(CX, CY, r), z0, a).concat(tilt(disc(CX, CY, r), z1, a))))); s.cr.setAttribute("d", poly(tilt(disc(CX, CY, r - 2), z1, a))); };
  function draw() {
    const v = sp.x;
    if (v === last) return;
    last = v;
    const a = rad(v * MAXA * reach / 100);
    body(lid, R + 1.5, DZ, DZ + 7, a);
    body(dome, 18, DZ + 7, DZ + 26, a);
    body(cap, 9, DZ + 26, DZ + 30, a);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const yT = P(CX, CY, DZ + 40)[1], yB = P(CX, CY, 10)[1], xs = [P(0, 60, 0)[0] - 10, P(60, 0, 0)[0] + 20];
  let state = "";
  function set(p) {
    let t = REST, on = false;
    if (p && p[0] > xs[0] && p[0] < xs[1] && p[1] > yT - 40 && p[1] < yB + 30) { t = clamp((yB - p[1]) / (yB - yT), 0, 1); on = true; }
    sp.t = t;
    const s = on ? Math.round(t * MAXA * reach / 100) + "°" : "rest";
    if (s !== state) { state = s; read.textContent = s; }
    B.wake();
  }
  lid.sil.classList.add("hi");
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dustextractor",
  means: "A dust extractor drum on casters: the pointer's height tips the hinged lid and motor dome open off the drum.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 100],
  tour: [[200, 200], [200, 140], [200, 108], null],
  mount,
});
