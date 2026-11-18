/**
 * Heliostat: a faceted mirror on a two-axis head atop a slim pedestal. The
 * pointer is the sun: the mirror tilts and swings to face it, on a spring,
 * and comes back to a gentle lean toward the viewer when the pointer leaves.
 * The mirror's rim is the one bright mark. The slider is how far it may tilt.
 */
const {
  Cam, circ, clamp, fillet, fit, facing, hull, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const A = 36, Bh = 23, TK = 2.2, PZ = 48, OFF = 6, REST = [0.62, 0.12];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-40, -40, 0], [40, 40, 0], [-40, 40, 0], [40, -40, 0], [0, 0, PZ + 26], [-30, 30, PZ + 24], [30, -30, PZ + 24]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const stand = mk("g", {}, g);
  put(solid(stand), prism(P, front, circ(14, 40), circ(12.6, 40), 0, 3));
  put(solid(stand), prism(P, front, circ(3.6, 24), circ(2.8, 24), 3, PZ - 4));
  const [gr, gi] = rings(-5, -5, 5, 5, 2, 1);
  put(solid(stand), prism(P, front, gr, gi, PZ - 5, PZ + 4));
  const pg = mk("g", {}, g), arm = mk("path", { class: "nf" }, pg), panel = solid(pg), facets = mk("path", { class: "nf lo" }, pg);
  panel.sil.classList.add("hi");

  const hx = spring(REST[0]), hy = spring(REST[1]);
  let last = "", over = null;
  function draw() {
    const key = hx.x.toFixed(3) + "," + hy.x.toFixed(3);
    if (key === last) return;
    last = key;
    const s = clamp(Math.hypot(hx.x, hy.x), 0.05, 0.97), az = Math.atan2(hy.x, hx.x), c = Math.sqrt(1 - s * s);
    const n = [s * Math.cos(az), s * Math.sin(az), c], u = [-Math.sin(az), Math.cos(az), 0];
    const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
    const o = [n[0] * OFF, n[1] * OFF, PZ + n[2] * OFF];
    const W = (a, b, t) => [o[0] + a * u[0] + b * v[0] + t * n[0], o[1] + a * u[1] + b * v[1] + t * n[1], o[2] + a * u[2] + b * v[2] + t * n[2]];
    const Q = (a, b, t) => P(...W(a, b, t));
    const corners = [];
    for (const a of [-A, A]) for (const b of [-Bh, Bh]) for (const t of [-TK / 2, TK / 2]) corners.push(Q(a, b, t));
    // which face looks at the camera: compare the screen order of a face's corners
    const p0 = Q(-A, -Bh, 0), p1 = Q(A, -Bh, 0), p2 = Q(-A, Bh, 0);
    const cross = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0]);
    const t = cross < 0 ? TK / 2 : -TK / 2, i = 2;
    { const h = hull(corners); panel.sil.setAttribute("d", poly(fillet(h, h.map(() => 2.5)))); }
    panel.cr.setAttribute("d", poly([Q(-A + i, -Bh + i, t), Q(A - i, -Bh + i, t), Q(A - i, Bh - i, t), Q(-A + i, Bh - i, t)]));
    let f = "";
    for (const a of [-A / 3, A / 3]) f += seg(Q(a, -Bh + i, t), Q(a, Bh - i, t));
    f += seg(Q(-A + i, 0, t), Q(A - i, 0, t));
    facets.setAttribute("d", f);
    arm.setAttribute("d", open([P(0, 0, PZ), P(...W(0, 0, -TK / 2))]));
    // the mirror's lower edge behind the pedestal: paint it first
    const lo = v[2] > 0 ? W(0, -Bh, 0) : W(0, Bh, 0);
    if (lo[0] + lo[1] < -3) g.prepend(pg); else g.append(pg);
  }
  const B = register(stage, (dt) => { const a = stepS(hx, dt), b = stepS(hy, dt); draw(); return a || b; });
  bag.add(B.unregister);

  function retarget() {
    let tx = REST[0], ty = REST[1];
    if (over) {
      const [x, y] = over, r = Math.hypot(x, y) || 1, s = clamp(r / 70, 0.3, 1) * 0.94 * reach;
      tx = (x / r) * s; ty = (y / r) * s;
      read.textContent = "tilt " + Math.round((Math.asin(clamp(Math.hypot(tx, ty), 0, 1)) * 180) / Math.PI);
    } else read.textContent = "rest";
    hx.t = tx; hy.t = ty;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) > 120 ? null : [x, y]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "heliostat",
  means: "A faceted mirror on a pedestal: the pointer is the sun, and the mirror tilts and swings round to face it.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1],
  tour: [[64, 202], [300, 180], [220, 262], null],
  mount,
});
