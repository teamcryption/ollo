/**
 * Oscilloscope: a bench scope with a screen, a trace and two knobs. The
 * pointer is a probe on the bench: the scope turns on its spot to face it,
 * and the trace tightens or loosens with the turn. At rest it sits turned a
 * little away, the trace bright. The slider is the trace's amplitude.
 *
 * The pattern: one object turning to face the pointer.
 */
const {
  Cam, fit, facing, fillet, open, poly, prism, proj, rrect, unproj, clamp, rad,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const W = 64, D = 40, H = 40, LIM = 40, REST = -22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.95);
  const ext = [];
  for (const sx of [-34, 34]) for (const sy of [-34, 34]) ext.push([sx, sy, 0], [sx, sy, H + 2]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const body = solid(g), feet = mk("path", { class: "nf lo" }, g);
  const scr = mk("path", {}, g), grat = mk("path", { class: "dash" }, g);
  const trace = mk("path", { class: "nf hi" }, g);
  const k1 = mk("path", {}, g), k2 = mk("path", {}, g), k3 = mk("path", { class: "nf lo" }, g);
  const th = spring(REST);
  let last = NaN;

  function rot(ring, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
  }

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
    // a point on the front face: u across, z up, standing out by o
    const F = (u, z, o = 0) => { const v = D / 2 + o; return P(u * c - v * s, u * s + v * c, z); };
    put(body, prism(P, front, rot(rrect(-W / 2, -D / 2, W / 2, D / 2, 5, 4), a), rot(rrect(-W / 2 + 1.8, -D / 2 + 1.8, W / 2 - 1.8, D / 2 - 1.8, 3.2, 4), a), 3, H));
    feet.setAttribute("d", open([F(-W / 2 + 6, 3), F(-W / 2 + 6, 0), F(-W / 2 + 12, 0), F(-W / 2 + 12, 3)]) + open([F(W / 2 - 12, 3), F(W / 2 - 12, 0), F(W / 2 - 6, 0), F(W / 2 - 6, 3)]));
    const u0 = -W / 2 + 5, u1 = 8, z0 = 9, z1 = H - 6;
    scr.setAttribute("d", poly(fillet([F(u0, z1), F(u1, z1), F(u1, z0), F(u0, z0)], [3, 3, 3, 3])));
    grat.setAttribute("d", open([F(u0 + 2, (z0 + z1) / 2), F(u1 - 2, (z0 + z1) / 2)]) + open([F((u0 + u1) / 2, z0 + 2), F((u0 + u1) / 2, z1 - 2)]));
    const cyc = 1.5 + (deg + LIM) / (2 * LIM) * 2.5, A = (z1 - z0) / 2 - 3, pts = [];
    for (let i = 0; i <= 48; i++) { const t = i / 48; pts.push(F(u0 + 3 + t * (u1 - u0 - 6), (z0 + z1) / 2 + A * amp * Math.sin(t * cyc * 2 * Math.PI), 0.2)); }
    trace.setAttribute("d", open(pts));
    const knob = (u, z, r) => { const q = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * 2 * Math.PI; q.push(F(u + r * Math.cos(t), z + r * Math.sin(t), 0.3)); } return poly(q); };
    k1.setAttribute("d", knob(19, z1 - 5, 5.5));
    k2.setAttribute("d", knob(19, z0 + 6, 4.2));
    const kz = z1 - 5, ka = rad(deg * 3);
    k3.setAttribute("d", open([F(19, kz, 0.4), F(19 + 4.5 * Math.cos(ka), kz + 4.5 * Math.sin(ka), 0.4)]));
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(Math.round(th.x * 10) / 10); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let deg = REST;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      deg = clamp(-Math.atan2(x, y) * 180 / Math.PI, -LIM, LIM);
    }
    th.t = deg;
    read.textContent = p ? (deg >= 0 ? "+" : "") + Math.round(deg) + "°" : "rest";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "oscilloscope",
  means: "A bench oscilloscope turns on its spot to face the pointer, and the trace on its screen tightens with the turn.",
  rules: [3, 5, 8, 9],
  range: [0.2, 0.7, 1],
  tour: [[304, 293], [96, 293], [200, 300], null],
  mount,
});
