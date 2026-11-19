/**
 * Snow plough: a short cab truck with a wide curved blade on its nose. The
 * pointer's place across the frame angles the blade, left or right, lifting it
 * a little as it swings. At rest the blade sits angled, bright. The slider is
 * how far it can angle.
 *
 * The pattern: one hinged part (yaw about a pin).
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const L = 96, W = 48, Z0 = 9, PX = L + 14, BH = 30, BW = 92, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, W, 0], [PX + 30, W / 2 - 50, 0], [PX + 30, W / 2 + 50, 0], [0, 0, 56], [PX, W / 2 + 50, BH + 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t))); }
    return pts;
  };
  for (const x of [20, 74]) mk("path", { d: poly(wheel(x, 4)) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, 20));
  const [br, bi] = rings(2, 3, 52, W - 3, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 20, 40));
  const [cr, ci] = rings(56, 2, L, W - 2, 6, 1.6);
  put(solid(g), prism(P, front, cr, ci, 20, 56));
  mk("path", { d: seg(P(L, 8, 44), P(L, W - 8, 44)), class: "nf lo" }, g);
  for (const x of [20, 74]) mk("path", { d: poly(wheel(x, W - 4)) }, g);
  const arms = mk("path", { class: "nf" }, g);
  const blade = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST), lift = spring(4);
  let last = "";

  // blade point: s along its width (-1..1), curl c (0 at the face, depth by height), z height
  function bp(a, h, s, z, back) {
    const cu = 8 * Math.sin((z / BH) * Math.PI) + back;
    const lx = 12 - cu, ly = s * BW / 2;
    const c = Math.cos(rad(a)), sn = Math.sin(rad(a));
    return P(PX + lx * c - ly * sn, W / 2 + lx * sn + ly * c, z + h);
  }
  function draw() {
    const a = ang.x, h = lift.x, key = a.toFixed(2) + h.toFixed(2);
    if (key === last) return;
    last = key;
    const pts = [];
    for (const s of [-1, -0.5, 0, 0.5, 1]) for (const z of [2, BH / 2, BH]) for (const b of [0, 5]) pts.push(bp(a, h, s, z, b));
    blade.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", seg(bp(a, h, -0.97, 4, 0), bp(a, h, 0.97, 4, 0)) + seg(bp(a, h, -0.97, BH - 3, 0), bp(a, h, 0.97, BH - 3, 0)));
    arms.setAttribute("d", seg(P(L, 12, 16), bp(a, h, -0.25, 12, 6)) + seg(P(L, W - 12, 16), bp(a, h, 0.25, 12, 6)));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt), n = stepS(lift, dt); draw(); return m || n; });
  bag.add(B.unregister);

  function aim(a, r) { ang.t = a; lift.t = r ? 4 : 4 + 10 * Math.abs(a) / 45; read.textContent = r ? "rest" : (a < 0 ? "L " : "R ") + Math.abs(Math.round(a)) + "°"; B.wake(); }
  draw();
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((sx - 200) / 140, -1, 1) * max), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "snowplough",
  means: "A snow plough truck with a wide curved blade on its nose: the pointer angles the blade left or right, lifting it as it swings.",
  rules: [1, 3, 5, 6],
  range: [20, 35, 45],
  tour: [[80, 160], [320, 160], [200, 200], null],
  mount,
});
