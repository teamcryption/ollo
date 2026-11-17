/**
 * Barometer: a round aneroid dial on its case, a ring of graduation ticks and
 * a long needle. The pointer is the weather: the needle swings on its spring
 * to point at it, clamped to the dial's arc, and the read-out gives the
 * pressure. At rest the needle leans to "fair", bright. The slider is how
 * stiff the needle's spring is.
 */
const {
  Cam, fit, hull, poly, proj, seg, spring, stepS, clamp,
  disposer, mk, pointer, register, solid,
} = HL;

const R = 40, Z0 = 52, D = 9, ARC = 2.2, REST = 0.62, N = 64;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.65);
  const at = (t, r, y) => [r * Math.sin(t), y, Z0 + r * Math.cos(t)];
  const ext = [];
  for (let k = 0; k < 16; k++) { const t = (k / 16) * Math.PI * 2; ext.push(at(t, R + 2, 0), at(t, R + 2, -D)); }
    fit(C, ext, 200, 160);
  const P = proj(C);
  const ring = (r, y) => Array.from({ length: N }, (_, k) => P(...at((k / N) * Math.PI * 2, r, y)));
  const g = mk("g", {}, svg);
  const cs = solid(g);
  cs.sil.setAttribute("d", poly(hull([...ring(R + 2, 0), ...ring(R + 2, -D)])));
  cs.cr.setAttribute("d", poly(ring(R + 2, 0)));
  const ticks = [];
  for (let k = 0; k <= 6; k++) {
    const t = -ARC + (k / 6) * 2 * ARC, L = k % 3 === 0 ? 6 : 3;
    ticks.push(seg(P(...at(t, R - 6, 0)), P(...at(t, R - 6 - L, 0))));
  }
  mk("path", { class: "nf sil", d: ticks.join("") }, g);
  const nd = mk("path", { class: "sil", d: "" }, g);
  const cap = mk("path", { class: "sil", d: "" }, g);
  const capPts = Array.from({ length: 20 }, (_, k) => { const a = (k / 20) * Math.PI * 2; return P(...at(a, 3.4, 0.6)); });
  cap.setAttribute("d", poly(capPts));
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const t = sp.x, n = t + Math.PI / 2, w = 8;
    const pts = [at(t, R - 7, 0.4), [w * Math.sin(n), 0.4, Z0 + w * Math.cos(n)], at(t + Math.PI, 18, 0.4), [-w * Math.sin(n), 0.4, Z0 - w * Math.cos(n)]];
    nd.setAttribute("d", poly(pts.map((q) => P(...q))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const o = P(0, 0, Z0), ex = P(1, 0, Z0), ez = P(0, 0, Z0 + 1);
  const ax = [ex[0] - o[0], ex[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ax[0] * az[1] - ax[1] * az[0];

  let over = false;
  function retarget(p) {
    if (p) {
      const sx = p[0] - o[0], sy = p[1] - o[1];
      const dx = (sx * az[1] - sy * az[0]) / det, dz = (ax[0] * sy - ax[1] * sx) / det;
      over = Math.hypot(dx, dz) < R + 30 && Math.hypot(dx, dz) > 2;
      if (over) sp.t = clamp(Math.atan2(dx, dz), -ARC, ARC);
    } else over = false;
    if (!over) sp.t = REST;
    nd.classList.toggle("hi", true);
    read.textContent = over ? String(Math.round(1000 + (sp.t / ARC) * 40)) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => retarget(p), leave: () => retarget(null) }));
  bag.add(() => svg.replaceChildren());
  retarget(null);
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "barometer",
  means: "An aneroid barometer: its long needle swings to point at the pointer, clamped to the dial, and the read-out gives the pressure.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.6],
  tour: [[139, 166], [248, 128], [200, 110], null],
  mount,
});
