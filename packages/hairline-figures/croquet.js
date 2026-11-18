/**
 * Croquet set: a mallet standing over its ball, a hoop on the lawn beyond. The
 * pointer draws the mallet back on its swing, further the further left it is,
 * and the part nearest the pointer is named and bright. At rest the ball is
 * bright and the mallet hangs just off true. The slider is how far it swings.
 *
 * The pattern: one part swinging on a pivot, driven by a spring.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, spring, stepS, disposer, mk, pointer, register } = HL;

const REST = -10, PIV = [-10, 0, 74], HI = "ball";
const zcyl = (x, y, z0, z1, R, n = 24) => { const c = circ(R, n); return [c.map((p) => [x + p.u, y + p.v, z0]), c.map((p) => [x + p.u, y + p.v, z1])]; };
const xbar = (x0, x1, y, z, R, n = 28) => { const c = circ(R, n); return [c.map((p) => [x0, y + p.u, z + p.v]), c.map((p) => [x1, y + p.u, z + p.v])]; };
const ybar = (x, y0, y1, z, R, n = 20) => { const c = circ(R, n); return [c.map((p) => [x + p.u, y0, z + p.v]), c.map((p) => [x + p.u, y1, z + p.v])]; };
const ball = (x, y, R) => [0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9].map((f) => { const z = R + Math.cos(Math.PI * f) * -R, r = R * Math.sin(Math.PI * f); return circ(r, 32).map((p) => [x + p.u, y + p.v, z]); });
function PARTS() {
  return [
    { rings: zcyl(-10, 0, 12, 76, 1.8), name: "mallet", swing: true },
    { rings: xbar(-27, 7, 0, 6.5, 6.5), name: "mallet", swing: true, cr: 1 },
    { rings: ball(17, 0, 6.5), name: "ball", cr: 2 },
    { rings: zcyl(46, -12, 0, 22, 1.3), name: "hoop" },
    { rings: ybar(46, -12, 12, 22, 1.3), name: "hoop", cr: -1 },
    { rings: zcyl(46, 12, 0, 22, 1.3), name: "hoop" },
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const parts = PARTS();
  const rot = (p, deg) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), dx = p[0] - PIV[0], dz = p[2] - PIV[2];
    return [PIV[0] + dx * c - dz * s, p[1], PIV[2] + dx * s + dz * c];
  };
  const ext = [];
  for (let d = 0; d >= -76; d -= 8) for (const pt of parts) for (const r of pt.rings) for (const p of r) ext.push(pt.swing ? rot(p, d) : p);
  const C1 = Cam(45, 0.5, 1); fit(C1, ext, 200, 166);
  const P1 = proj(C1), sp = ext.map((p) => P1(...p));
  const w = Math.max(...sp.map((p) => p[0])) - Math.min(...sp.map((p) => p[0])), h = Math.max(...sp.map((p) => p[1])) - Math.min(...sp.map((p) => p[1]));
  const C = Cam(45, 0.5, Math.min(372 / w, 292 / h)); fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  for (const pt of parts) {
    pt.grp = mk("g", {}, g);
    pt.sil = mk("path", { class: "sil" }, pt.grp);
    pt.crp = pt.cr === -1 ? null : mk("path", { class: "nf lo" }, pt.grp);
  }
  const ang = spring(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    for (const pt of parts) {
      const pr = (p) => P(...(pt.swing ? rot(p, d) : p));
      pt.sil.setAttribute("d", poly(hull([].concat(...pt.rings).map(pr))));
      if (pt.crp) pt.crp.setAttribute("d", poly(pt.rings[pt.cr || 1].map(pr)));
    }
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(Math.round(ang.x * 100) / 100); return m; });
  bag.add(B.unregister);

  const mids = parts.map((pt) => { const all = [].concat(...pt.rings).map((p) => P(...(pt.swing ? rot(p, REST) : p))); return { pt, m: [all.reduce((s, p) => s + p[0], 0) / all.length, all.reduce((s, p) => s + p[1], 0) / all.length] }; });
  let cur = null;
  function choose(name, sx) {
    ang.t = name ? REST - 0.7 * reach * clamp(0.75 + (200 - sx) / 260, 0.35, 1) : REST;
    for (const pt of parts) pt.sil.classList.toggle("hi", pt.name === (name || HI));
    if (name !== cur) { cur = name; read.textContent = name || "rest"; }
    B.wake();
  }
  function hit([sx, sy]) {
    let best = null, bd = Infinity;
    for (const { pt, m } of mids) { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = pt.name; } }
    choose(bd < 110 ? best : null, sx);
  }
  choose(null, 200);
  bag.add(pointer(stage, { move: hit, leave: () => choose(null, 200) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "croquet",
  means: "A croquet mallet over its ball by a hoop: the mallet swings back on its handle, and the part under the pointer lights.",
  rules: [1, 3, 5, 8],
  range: [0, 70, 90],
  tour: [[208, 234], [258, 259], [312, 249], null],
  mount,
});
