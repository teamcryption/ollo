/**
 * Theodolite: a surveyor's instrument on a tripod over a station mark, a
 * plumb line hanging to the ground. The pointer is a point on the site: the
 * alidade turns to face it and the telescope dips toward it, the nearer the
 * steeper. At rest it sights a peg standing in the ground, bright. The
 * slider is how far the telescope may dip.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, unproj, clamp, rad, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const H = 58, TZ = H + 19, PEG = [56, -14];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-36, -36, 0], [-34, 30, 0], [30, -34, 0], [0, 0, TZ + 8], [PEG[0], PEG[1], 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // station mark and plumb line, behind everything that stands
  const mark = flatDot(g, C, 2.4, "dot off");
  place(mark, P(0, 0, 0));
  mk("path", { d: open([P(0, 0, H - 1), P(0, 0, 3)]), class: "dash" }, g);

  // the peg, rest target
  const pegG = mk("g", {}, g);
  put(solid(pegG), prism(P, front, disc(PEG[0], PEG[1], 1.6, 12), disc(PEG[0], PEG[1], 0.8, 12), 0, 10));
  const pegDot = flatDot(pegG, C, 2, "dot");
  place(pegDot, P(PEG[0], PEG[1], 10));

  // three legs, far to near
  const feet = [rad(-135), rad(-15), rad(105)].map((a) => [34 * Math.cos(a), 34 * Math.sin(a), a])
    .sort((p, q) => p[0] + p[1] - (q[0] + q[1]));
  for (const [fx, fy, a] of feet) {
    const tx = 5 * Math.cos(a), ty = 5 * Math.sin(a), s = solid(g);
    s.sil.setAttribute("d", poly(hull(ringAt(P, disc(fx, fy, 1.4, 12), 0).concat(ringAt(P, disc(tx, ty, 2.4, 12), H)))));
    s.cr.setAttribute("d", open([P(fx * 0.55 + tx * 0.45, fy * 0.55 + ty * 0.45, H * 0.45), P(fx * 0.5 + tx * 0.5, fy * 0.5 + ty * 0.5, H * 0.5)]));
    s.cr.setAttribute("class", "nf lo");
  }
  // head plate and tribrach
  const [hr, hi] = rings(-9, -9, 9, 9, 9, 1.4);
  put(solid(g), prism(P, front, hr, hi, H, H + 2.5));
  put(solid(g), prism(P, front, disc(0, 0, 6.5), disc(0, 0, 5.2), H + 2.5, H + 5));

  const body = solid(g), scope = mk("path", { class: "sil" }, g), lens = mk("path", { class: "nf lo" }, g);
  const az = spring(Math.atan2(PEG[1], PEG[0])), pit = spring(0);
  let last = "";

  function draw() {
    const a = az.x, p = pit.x, key = a.toFixed(4) + p.toFixed(4);
    if (key === last) return;
    last = key;
    const [br, bi] = [rot(rrect(-8, -6, 8, 6, 3, 4), a), rot(rrect(-6.6, -4.6, 6.6, 4.6, 1.8, 4), a)];
    put(body, prism(P, front, br, bi, H + 5, H + 15));
    const d = [Math.cos(a) * Math.cos(p), Math.sin(a) * Math.cos(p), Math.sin(p)];
    const e1 = [-Math.sin(a), Math.cos(a), 0], e2 = [-Math.cos(a) * Math.sin(p), -Math.sin(a) * Math.sin(p), Math.cos(p)];
    const ring = (off, r) => { const o = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI, c = Math.cos(t) * r, s = Math.sin(t) * r; o.push(P(d[0] * off + e1[0] * c + e2[0] * s, d[1] * off + e1[1] * c + e2[1] * s, TZ + d[2] * off + e1[2] * c + e2[2] * s)); } return o; };
    const obj = ring(17, 4.6);
    scope.setAttribute("d", poly(hull(obj.concat(ring(-13, 3.2)))));
    lens.setAttribute("d", front({ nu: Math.cos(a), nv: Math.sin(a) }) ? poly(ring(16, 3.4)) : poly(ring(4, 4.1)));
  }

  const B = register(stage, (dt) => { const m = stepS(az, dt) | stepS(pit, dt); draw(); return !!m; });
  bag.add(B.unregister);

  function aim(w) {
    const t = Math.atan2(w[1], w[0]);
    let dt = t - az.t; dt -= Math.round(dt / (2 * Math.PI)) * 2 * Math.PI;
    az.t += dt;
    pit.t = -clamp(Math.atan2(TZ, Math.hypot(w[0], w[1]) + 1) * 0.6, 0, rad(reach));
  }
  function setActive(w) {
    const on = !!w;
    aim(on ? w : PEG);
    if (!on) pit.t = -rad(Math.min(reach, 8));
    scope.classList.toggle("hi", on);
    pegDot.setAttribute("class", on ? "dot off" : "dot");
    const deg = ((Math.round((az.t * 180) / Math.PI) % 360) + 360) % 360;
    read.textContent = on ? String(deg).padStart(3, "0") + "°" : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const w = unproj(C, sx, sy, 0); setActive(Math.hypot(w[0], w[1]) < 140 ? w : null); },
    leave: () => setActive(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "theodolite",
  means: "A surveyor's theodolite on a tripod: it turns to face the point under the pointer and dips its telescope toward it.",
  rules: [1, 3, 5, 6],
  range: [0, 20, 40],
  tour: [[59, 247], [304, 250], [330, 120], null],
  mount,
});
