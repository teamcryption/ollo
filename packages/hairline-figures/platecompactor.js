/**
 * Plate compactor: a heavy steel plate with its engine on top and a long
 * guide handle hinged at the back. The pointer over the machine lowers the
 * handle to its working angle, the grip swinging down and back. At rest the
 * handle stands raised and the fuel tank is bright. The slider is how far
 * the handle drops.
 *
 * The pattern: one arm tilting on a pivot (tilt).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rad, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const PX = 8, PZ = 16, L = 74, Y0 = 4, Y1 = 46, REST = 64, S = 2.15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let drop = 10 + value * 0.42;
  const C = Cam(45, 0.5, S);
  fit(C, [[-68, 0, 0], [84, 0, 0], [84, 50, 0], [-68, 50, 0], [-30, 0, 86], [66, 42, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the plate, and the hinge brackets at its back
  const [pr, pi] = rings(0, 0, 84, 50, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 6));
  for (const y of [Y0, Y1]) { const [r, i] = rings(PX - 5, y - 3, PX + 5, y + 3, 2, 0.8); put(solid(g), prism(P, front, r, i, 6, PZ + 2)); }

  // the handle: two bars and a grip, drawn as capsules
  const bars = [solid(g), solid(g)], grip = solid(g);
  const R = 2.4 * S;
  const cap = (a, b, r) => {
    const pts = [];
    for (const c of [a, b]) for (let k = 0; k < 16; k++) { const t = (k / 16) * Math.PI * 2; pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); }
    return poly(hull(pts));
  };
  // the engine and its tank, nearest the viewer
  const [er, ei] = rings(26, 8, 66, 42, 7, 2);
  put(solid(g), prism(P, front, er, ei, 6, 32));
  const tank = solid(g);
  const [tr, ti] = rings(32, 13, 58, 37, 6, 1.6);
  put(tank, prism(P, front, tr, ti, 32, 40));

  const ang = tween(REST);
  let last = NaN;
  function draw(phi) {
    if (Math.abs(phi - last) < 0.02) return;
    last = phi;
    const a = rad(phi), ex = PX - L * Math.cos(a), ez = PZ + L * Math.sin(a);
    const mx = PX - 0.25 * L * Math.cos(a), mz = PZ + 0.25 * L * Math.sin(a);
    bars[0].sil.setAttribute("d", cap(P(PX, Y0, PZ), P(ex, Y0, ez), R));
    bars[1].sil.setAttribute("d", cap(P(PX, Y1, PZ), P(ex, Y1, ez), R));
    grip.sil.setAttribute("d", cap(P(ex, Y0 - 4, ez), P(ex, Y1 + 4, ez), R * 1.35));
    bars[0].cr.setAttribute("d", cap(P(mx, Y0, mz), P(mx, Y1, mz), R * 0.7));
  }

  const B = register(stage, (dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit against the rest pose: the machine's box on screen
  const top = P(-30, 0, 86)[1], bot = P(84, 50, 0)[1] + 4, left = P(-68, 50, 0)[0], right = P(84, 0, 0)[0] + 4;
  let act = null, lastP = null;
  function setActive(p) {
    lastP = p;
    const on = !!p && p[0] > left && p[0] < right && p[1] > top && p[1] < bot;
    tset(ang, on ? REST - drop : REST, performance.now(), 0);
    if (on !== act) { act = on; grip.sil.classList.toggle("hi", on); tank.sil.classList.toggle("hi", !on); }
    read.textContent = on ? "tilt " + Math.round(REST - drop) : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(p), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { drop = 10 + v * 0.42; setActive(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "platecompactor",
  means: "A plate compactor: the pointer over the machine lowers its long guide handle from raised to the working angle.",
  rules: [1, 4, 5, 8],
  range: [0, 100, 100],
  tour: [[256, 185], [140, 150], [278, 280], null],
  mount,
});
