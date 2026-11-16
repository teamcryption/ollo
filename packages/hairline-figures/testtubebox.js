/**
 * Specimen jar: a squat glass jar with a deep cap hinged at its back rim and
 * a knob on top. The pointer's x swings the cap open about the hinge, on a
 * spring. At rest the cap is cracked open, bright. The slider is how far
 * the cap can open.
 */
const {
  Cam, fit, proj, facing, prism, circ, hull, poly, clamp, lerp, rad,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const R = 22, H = 36, LR = 25, LH = 16, REST = 22, PY = -LR, PZ = H;
const cyl = (r, z0, z1, cz = 0) => [z0, z1].flatMap((z) => circ(r, 32).map((s) => [s.u, s.v, z + cz]));
const CAP = cyl(LR, H, H + LH).concat(cyl(7, H + LH, H + LH + 7));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-LR, -LR - 30, 0], [LR, LR, 0], [-LR, -LR - 30, H + 60], [LR, LR, H + 60]], 200, 124);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R, 40), circ(R - 3, 40), 0, H));
  mk("path", { d: poly(circ(R - 6, 32).map((s) => P(s.u, s.v, H))), class: "nf lo" }, g);
  const cap = mk("path", { class: "sil hi" }, g);
  const band = mk("path", { class: "nf lo" }, g);

  const swing = (pts, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return pts.map(([x, y, z]) => { const dy = y - PY, dz = z - PZ; return P(x, PY + dy * c - dz * s, PZ + dy * s + dz * c); }); };
  const BAND = circ(LR, 32).map((s) => [s.u, s.v, H + LH]);
  function draw(a) {
    cap.setAttribute("d", poly(hull(swing(CAP, a))));
    band.setAttribute("d", poly(swing(BAND, a)));
  }
  const sp = spring(REST);
  let last = NaN;
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); if (sp.x !== last) { last = sp.x; draw(sp.x); } return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (sx < 50 || sx > 350 || sy < 20 || sy > 300) return leave();
    const a = lerp(0, amp, clamp((sx - 110) / 180, 0, 1));
    sp.t = a;
    read.textContent = "lid " + Math.round(a);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "testtubebox",
  means: "A specimen jar with a hinged cap: the pointer swings the cap open about its back rim.",
  rules: [1, 3, 5, 8],
  range: [0, 80, 100],
  tour: [[151, 118], [220, 102], [121, 152], null],
  mount,
});
