/**
 * Ring light: a round weighted base, a slim pole and, on top, a ring lamp
 * with a phone clipped in its middle. The ring and phone turn together on
 * the pole to face the pointer, wherever it is over the ground. At rest the
 * head is turned a little aside, the phone lit; while it follows, the ring
 * takes the bright. The slider is how far it may turn.
 *
 * The pattern: turn to face; the hit is the pointer on the ground plane.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rad, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZH = 74, RO = 22, RI = 17, TH = 2.6, REST = 18, VIEW = 45;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-18, -18, 0], [18, 18, 0], [-RO, 0, ZH], [RO, 0, ZH], [0, -RO, ZH], [0, RO, ZH], [0, 0, ZH + RO]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = circ(16, 24), baseIn = circ(14.8, 24);
  put(solid(g), prism(P, front, base, baseIn, 0, 4));
  const [po, pi] = rings(-1.6, -1.6, 1.6, 1.6, 1.6, 0.5);
  put(solid(g), prism(P, front, po, pi, 4, ZH - RO + 1));

  const ring = solid(g), phone = solid(g);
  const th = spring(REST);
  let last = NaN;

  function disc(r, t, f, h, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, u = r * Math.cos(a), v = r * Math.sin(a);
      pts.push(P(h[0] * u + f[0] * t, h[1] * u + f[1] * t, ZH + v));
    }
    return pts;
  }
  function area(p) { let s = 0; p.forEach((a, i) => { const b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; }); return s; }
  function draw(deg) {
    const d = Math.round(deg * 10) / 10;
    if (d === last) return;
    last = d;
    const f = [Math.cos(rad(d)), Math.sin(rad(d))], h = [-f[1], f[0]];
    const out = hull(disc(RO, TH / 2, f, h, 40).concat(disc(RO, -TH / 2, f, h, 40)));
    // the hole: the side of the ring facing the camera shows its inner rim
    const toCam = Math.cos(rad(d - VIEW)) >= 0 ? 1 : -1;
    let hole = disc(RI, toCam * TH / 2, f, h, 32);
    if (Math.sign(area(hole)) === Math.sign(area(out))) hole = hole.reverse();
    ring.sil.setAttribute("d", poly(out) + poly(hole));
    ring.cr.setAttribute("d", poly(disc(RI + 2.2, toCam * TH / 2, f, h, 32)));
    // the phone: a thin plate standing in the ring's plane
    const corners = [];
    [-0.7, 0.7].forEach((t) => [[-5, -9], [5, -9], [5, 9], [-5, 9]].forEach(([u, v]) => corners.push(P(h[0] * u + f[0] * t, h[1] * u + f[1] * t, ZH + v))));
    phone.sil.setAttribute("d", poly(hull(corners)));
    const scr = [[-4, -8], [4, -8], [4, 8], [-4, 8]].map(([u, v]) => P(h[0] * u + f[0] * toCam * 0.7, h[1] * u + f[1] * toCam * 0.7, ZH + v));
    phone.cr.setAttribute("d", poly(scr));
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    if (!p) { th.t = REST; on = null; }
    else {
      const [x, y] = unproj(C, p[0], p[1], 0);
      let a = (Math.atan2(y, x) * 180) / Math.PI;
      if (a < VIEW - 180) a += 360;
      th.t = clamp(a, VIEW - reach, VIEW + reach);
      on = true;
    }
    ring.sil.classList.toggle("hi", !!on);
    phone.sil.classList.toggle("hi", !on);
    read.textContent = on ? "turn " + Math.round(th.t - VIEW) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "vlogcam",
  means: "A ring light with a phone in its middle: the ring and phone turn on the pole to face the pointer.",
  rules: [1, 3, 4, 5],
  range: [30, 70, 110],
  tour: [[290, 250], [110, 250], [200, 300], null],
  mount,
});
