/**
 * Shower head: a round head on a ball joint at the end of a short arm from a
 * wall plate. The head swivels to aim at the pointer, turning and tipping on
 * its ball. At rest it hangs a little to the right and tipped down, its spray
 * face bright. The slider is how far it may swivel.
 *
 * The pattern: one part aiming; the aim is picked from target poses, never
 * from the pose on screen.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register, solid, rad } = HL;

const PZ = 40, PY = 16, HR = 16, YAW0 = rad(18), PIT0 = rad(42);

function frame(yaw, pit) {
  const d = [Math.sin(yaw) * Math.cos(pit), Math.cos(yaw) * Math.cos(pit), -Math.sin(pit)];
  const u = [Math.cos(yaw), -Math.sin(yaw), 0];
  const v = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
  return { d, u, v };
}
function ring(f, off, r, n = 32) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, c = r * Math.cos(a), s = r * Math.sin(a);
    out.push([0, 1, 2].map((k) => (k === 1 ? PY : k === 2 ? PZ : 0) + f.d[k] * off + f.u[k] * c + f.v[k] * s));
  }
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 5.2);
  fit(C, [[-20, 0, PZ + 14], [20, 0, PZ - 30], [-22, PY + 26, PZ - 26], [22, PY + 26, PZ - 26], [0, PY + 30, PZ + 4]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const plate = solid(g), arm = solid(g), head = solid(g), jets = mk("path", { class: "nf lo" }, g);
  plate.sil.setAttribute("d", poly(hull([[-8, 0, PZ - 9], [8, 0, PZ - 9], [8, 0, PZ + 9], [-8, 0, PZ + 9], [-8, -2, PZ - 9], [8, -2, PZ + 9]].map((p) => P(...p)))));
  plate.cr.setAttribute("d", poly([[-6, 0, PZ - 7], [6, 0, PZ - 7], [6, 0, PZ + 7], [-6, 0, PZ + 7]].map((p) => P(...p))));
  const tube = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; tube.push([2.4 * Math.cos(a), 0, PZ + 2.4 * Math.sin(a)], [2.4 * Math.cos(a), PY, PZ + 2.4 * Math.sin(a)]); }
  arm.sil.setAttribute("d", poly(hull(tube.map((p) => P(...p)))));
  const yaw = tween(YAW0), pit = tween(PIT0);
  let ly = NaN, lp = NaN;

  function draw(y, p) {
    if (y === ly && p === lp) return;
    ly = y; lp = p;
    const f = frame(y, p), Q = (q) => P(...q);
    const pts = ring(f, 3, 3.5, 12).concat(ring(f, 8, HR), ring(f, 13, HR));
    head.sil.setAttribute("d", poly(hull(pts.map(Q))));
    head.cr.setAttribute("d", poly(ring(f, 13, HR).map(Q)) + poly(ring(f, 13, HR - 3.5).map(Q)));
    let j = "";
    [5, 9].forEach((r, k) => ring(f, 13, r, k ? 12 : 6).forEach((q) => { const a = Q(q); j += seg(a, [a[0] + 0.8, a[1] + 0.4]); }));
    jets.setAttribute("d", j);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(yaw, now), tval(pit, now));
    return !tdone(yaw, now) || !tdone(pit, now);
  });
  bag.add(B.unregister);

  const piv = P(0, PY, PZ);
  function aim([sx, sy]) {
    if (Math.hypot(sx - piv[0], sy - piv[1]) > 210) return null;
    const M = rad(clamp(20 + reach * 0.5, 15, 65));
    let best = null, bd = Infinity;
    for (let i = -8; i <= 8; i++) for (let k = 0; k <= 6; k++) {
      const y = (i / 8) * M, p = rad(15 + k * 10), f = frame(y, p);
      const c = P(f.d[0] * 30, PY + f.d[1] * 30, PZ + f.d[2] * 30), dd = Math.hypot(c[0] - sx, c[1] - sy);
      if (dd < bd) { bd = dd; best = [y, p]; }
    }
    return best;
  }

  function setAim(a) {
    const now = performance.now();
    tset(yaw, a ? a[0] : YAW0, now, 0);
    tset(pit, a ? a[1] : PIT0, now, a ? 40 : 0);
    head.sil.classList.toggle("hi", !!a);
    head.cr.classList.toggle("hi", !a);
    read.textContent = a ? Math.round((a[0] * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  setAim(null);
  bag.add(pointer(stage, { move: (p) => setAim(aim(p)), leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "plungercup",
  means: "A shower head on a ball joint: it swivels on its arm to aim its spray face at the pointer.",
  rules: [1, 3, 4, 5],
  range: [0, 45, 90],
  tour: [[104, 205], [222, 241], [119, 189], null],
  mount,
});
