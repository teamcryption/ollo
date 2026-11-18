/**
 * Rotary evaporator: a heating bath on the bench, a lift post beside it,
 * and the head on the post: motor, angled vapour duct, round evaporating
 * flask, upright condenser and its receiving flask. Over the machine the
 * head tilts down on its pivot to dip the flask toward the bath; leaving
 * lifts it again. The slider is how far the head tilts.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, circ, ringAt, seg, tween, tset, tval, tdone, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PV = [96, 22, 72], REST = -6;
const rot = (p, a) => { const dx = p[0] - PV[0], dz = p[2] - PV[2], ca = Math.cos(a), sa = Math.sin(a); return [PV[0] + dx * ca - dz * sa, p[1], PV[2] + dx * sa + dz * ca]; };
function cyl(a, b, r, n = 20) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d), u = d.map((v) => v / l);
  const e1 = [0, 1, 0], e2 = [u[1] * 0 - u[2] * 1, u[2] * 0 - u[0] * 0, u[0] * 1 - u[1] * 0];
  const o = [];
  for (const c of [a, b]) for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, cs = Math.cos(t) * r, sn = Math.sin(t) * r; o.push([c[0] + e1[0] * cs + e2[0] * sn, c[1] + e1[1] * cs + e2[1] * sn, c[2] + e1[2] * cs + e2[2] * sn]); }
  return o;
}
function ball(c, r) {
  const o = [];
  for (let i = 0; i <= 8; i++) for (let j = 0; j < 16; j++) { const th = (i / 8) * Math.PI, ph = (j / 16) * Math.PI * 2; o.push([c[0] + r * Math.sin(th) * Math.cos(ph), c[1] + r * Math.sin(th) * Math.sin(ph), c[2] + r * Math.cos(th)]); }
  return o;
}
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value, on = false;
  const C = Cam(45, 0.5, 1.7);
  const FC = [30, 22, 62];
  const parts = {
    recv: ball([112, 22, 46], 10).concat(cyl([112, 22, 54], [112, 22, 62], 2.6)),
    cond: cyl([108, 22, 82], [112, 22, 128], 7),
    duct: cyl([88, 22, 70], [FC[0] + 12, 22, FC[2] + 3], 3),
    motor: box(84, 108, 12, 32, 62, 84),
    flask: ball(FC, 15).concat(cyl([FC[0] + 10, 22, FC[2] + 2], [FC[0] + 20, 22, FC[2] + 4], 4.5)),
  };
  const head = [].concat(...Object.values(parts));
  fit(C, [[0, 0, 0], [130, 44, 0], [0, 44, 0], [130, 0, 0]].concat(head.map((p) => rot(p, rad(REST))), head.map((p) => rot(p, rad(22)))), 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(28, 22, 28), disc(28, 22, 26), 0, 24));
  mk("path", { d: poly(ringAt(P, disc(28, 22, 24), 19)), class: "nf lo" }, g);
  const [br, bi] = rings(74, 0, 130, 44, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 7));
  put(solid(g), prism(P, front, disc(96, 22, 4.5, 20), disc(96, 22, 3, 20), 7, 104));
  const S = {};
  for (const k of ["recv", "cond", "duct", "motor", "flask"]) S[k] = solid(g);
  S.flask.sil.classList.add("hi");
  const ht = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), q = (p) => P(...rot(p, a));
    for (const k in S) S[k].sil.setAttribute("d", poly(hull(parts[k].map(q))));
    let cr = "";
    for (let z = 88; z < 124; z += 6) cr += seg(q([108 + (z - 82) * 0.087 - 4, 22, z]), q([108 + (z - 82) * 0.087 + 4, 22, z + 3]));
    S.cond.cr.setAttribute("d", cr);
    S.motor.cr.setAttribute("d", seg(q([108, 32, 84]), q([108, 12, 84])) + seg(q([108, 32, 84]), q([84, 32, 84])));
    S.flask.cr.setAttribute("d", seg(q([FC[0] - 9, 22, FC[2] - 6]), q([FC[0] + 4, 22, FC[2] - 12])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ht, now)); return !tdone(ht, now); });
  bag.add(B.unregister);

  const rest = head.map((p) => P(...rot(p, rad(REST)))).concat([[0, 0, 0], [130, 44, 0], [0, 44, 0], [130, 0, 0]].map((p) => P(...p)));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  const hit = ([sx, sy]) => sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3];
  function setOn(v) {
    on = v;
    tset(ht, on ? ang : REST, performance.now(), 0);
    read.textContent = on ? "dip " + Math.round(ang) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => { const h = hit(p); if (h !== on) setOn(h); }, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { ang = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "rotavap",
  means: "A rotary evaporator: over the machine its head tilts on the lift post, dipping the round flask down toward the heating bath.",
  rules: [1, 3, 5, 6],
  range: [8, 18, 22],
  tour: [[158, 98], [236, 130], [210, 215], null],
  mount,
});
