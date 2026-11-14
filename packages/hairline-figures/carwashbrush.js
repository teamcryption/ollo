/**
 * Pressure washer: a wheeled pump unit, a hose and a long lance on a stand.
 * The lance swings on its pivot to aim at the pointer, its dashed spray fan
 * following, clamped to the arc a hand would sweep. At rest it aims across
 * the yard, bright. The slider is how far the lance dips.
 *
 * The pattern: one part turns to face the pointer (aim).
 */
const {
  Cam, clamp, fit, facing, hull, poly, open, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 62, PY = 14, PZ = 30, LEN = 56, REST = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dip = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [PX + LEN, PY + LEN, 0], [PX + LEN, PY - LEN, 0], [-4, 32, 0], [0, 0, 46], [PX, PY, PZ + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const disc = (xc, y, zc, r, n = 20) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push(P(xc + r * Math.cos(t), y, zc + r * Math.sin(t))); } return o; };
  const wheel = (xc, y) => { const w = solid(g); w.sil.setAttribute("d", poly(hull(disc(xc, y - 3, 8, 8).concat(disc(xc, y + 3, 8, 8))))); w.cr.setAttribute("d", poly(disc(xc, y + 3, 8, 2.5, 12))); };
  wheel(12, -2);
  const [ur, ui] = rings(0, 0, 40, 28, 6, 2);
  put(solid(g), prism(P, front, ur, ui, 6, 40));
  const [hr, hi] = rings(14, 10, 26, 18, 2, 0.8);
  put(solid(g), prism(P, front, hr, hi, 40, 45));
  wheel(12, 30);
  mk("path", { d: open([P(40, 18, 14), P(48, 24, 2), P(56, 18, 1), P(PX, PY + 3, 4)]), class: "nf" }, g);
  const [sr, si] = rings(PX - 3, PY - 3, PX + 3, PY + 3, 1.5, 0.7);
  put(solid(g), prism(P, front, sr, si, 0, PZ));
  const [br, bi] = rings(PX - 8, PY - 8, PX + 8, PY + 8, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, 2));
  const spray = mk("path", { class: "nf dash" }, g);
  const lance = mk("path", { class: "sil hi" }, g), grip = mk("path", { class: "nf lo" }, g);

  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const a = rad(ang.x), d = rad(dip), key = ang.x + "," + dip;
    if (key === last) return;
    last = key;
    const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, dz = -Math.sin(d);
    const at = (s, o, h) => P(PX + ux * s + nx * o, PY + uy * s + ny * o, PZ + dz * s + h);
    const pts = [];
    for (const s of [-10, LEN]) for (const o of [-1.8, 1.8]) for (const h of [-1.8, 1.8]) pts.push(at(s, o, h));
    lance.setAttribute("d", poly(hull(pts)));
    const gp = [];
    for (const s of [-10, 6]) for (const o of [-3.2, 3.2]) for (const h of [-3.2, 3.2]) gp.push(at(s, o, h));
    grip.setAttribute("d", poly(hull(gp)));
    let sd = "";
    for (const o of [-9, 0, 9]) sd += open([at(LEN + 3, 0, 0), at(LEN + 30, o, -8)]);
    spray.setAttribute("d", sd);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    const deg = clamp((Math.atan2(wy - PY, wx - PX) * 180) / Math.PI, -50, 80);
    ang.t = deg;
    read.textContent = "aim " + Math.round(deg) + "°";
    B.wake();
  }
  read.textContent = "rest";
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dip = v; last = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "carwashbrush",
  means: "A pressure washer lance on its stand: it swings to aim its spray at the pointer, clamped to the arc a hand would sweep.",
  rules: [1, 3, 4, 8],
  range: [0, 12, 25],
  tour: [[328, 218], [183, 262], [81, 255], null],
  mount,
});
