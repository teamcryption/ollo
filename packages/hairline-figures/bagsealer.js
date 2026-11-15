/**
 * Bag sealer: a long base with a hinged jaw along its back edge and a bag
 * lying with its mouth across the heat strip. The pointer over the sealer
 * swings the jaw open on its hinge; along the jaw, the nearer the pointer is
 * to the front the wider it opens. At rest the heat strip is bright. The
 * slider is how far the jaw can open.
 */
const { Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const L = 70, Y0 = 0, Y1 = 16, TOP = 9, JH = 6, YM = 11;
const PROF = fillet([[0, 0], [Y1, 0], [Y1, JH], [0, JH]], [0.8, 2, 2.5, 1.5], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, Y0, 0], [L, Y1 + 30, 0], [L, Y0, 0], [0, Y1 + 30, 0], [0, Y0, TOP + 20], [L, Y0, TOP + 20]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g), [br, bi] = rings(0, Y0, L, Y1, 3, 1);
  put(base, prism(P, front, br, bi, 0, TOP));
  const strip = mk("path", { class: "sil", d: poly([P(4, YM - 1, TOP), P(L - 4, YM - 1, TOP), P(L - 4, YM + 1, TOP), P(4, YM + 1, TOP)]) }, g);
  const x0 = 14, x1 = L - 14, yf = Y1 + 12, ye = Y1 + 30;
  mk("path", { class: "sil", d: poly([P(x0, YM + 1.6, TOP), P(x1, YM + 1.6, TOP), P(x1, Y1 + 0.5, TOP), P(x1 + 2, yf, 0), P(x1 + 2, ye, 0), P(x0 - 2, ye, 0), P(x0 - 2, yf, 0), P(x0, Y1 + 0.5, TOP)]) }, g);
  mk("path", { class: "nf lo", d: open([P(x0 - 2, yf, 0), P(x1 + 2, yf, 0)]) + open([P(x0, Y1 + 0.5, TOP), P(x1, Y1 + 0.5, TOP)]) }, g);

  const jaw = mk("g", {}, g), sil = mk("path", { class: "sil" }, jaw), cr = mk("path", { class: "nf lo" }, jaw);
  const ang = tween(16);
  let last = NaN;
  function pt(x, y, z, a) { const c = Math.cos(a), s = Math.sin(a); return P(x, Y0 + y * c - z * s, TOP + y * s + z * c); }
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = (deg * Math.PI) / 180, near = PROF.map(([y, z]) => pt(L - 1, y, z, a)), far = PROF.map(([y, z]) => pt(1, y, z, a));
    sil.setAttribute("d", poly(hull(near.concat(far))));
    cr.setAttribute("d", poly(near) + open([pt(4, YM, 0, a), pt(L - 4, YM, 0, a)]) + open([pt(1, Y1 - 1, JH, a), pt(L - 1, Y1 - 1, JH, a)]));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the ground, which never moves; how far forward it is sets the opening
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    if (x < -6 || x > L + 6 || y < Y0 - 30 || y > Y1 + 30) return -1;
    return clamp((y - Y0 + 30) / (Y1 + 30), 0.4, 1);
  }

  let act = -2;
  function setActive(f) {
    const q = f < 0 ? -1 : Math.round(f * 4) / 4;
    if (q === act) return;
    act = q;
    const deg = q < 0 ? 16 : max * q;
    tset(ang, deg, performance.now(), 0);
    sil.classList.toggle("hi", q >= 0);
    strip.classList.toggle("hi", q < 0);
    read.textContent = q < 0 ? "rest" : Math.round(deg) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; const f = act; act = -2; setActive(f); }, destroy: bag.dispose };
}

hairline({
  name: "bagsealer",
  means: "A heat bag sealer: the pointer over it swings the hinged jaw open off the heat strip, wider the nearer the front.",
  rules: [1, 3, 4, 5],
  range: [30, 60, 80],
  tour: [[249, 139], [221, 153], [216, 155], null],
  mount,
});
