/**
 * Snow cannon: a fan drum on a column over a wheeled base. The pointer aims
 * it: its height tilts the drum up, its side pans it. Leaving lowers it to
 * a rest aim. At rest the drum's mouth is bright. The slider is how far the
 * drum may tilt.
 *
 * The pattern: one part aiming at the pointer (spring).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, clamp, rad, circ,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 24, PY = 24, PZ = 40, R = 14, BK = 16, FW = 26;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function frame(yaw, el) {
  const d = [Math.cos(el) * Math.cos(yaw), Math.cos(el) * Math.sin(yaw), Math.sin(el)];
  const u = [-Math.sin(yaw), Math.cos(yaw), 0];
  const v = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
  return { d, u, v };
}
function circle(f, s, r, n = 32) {
  const o = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI, c = Math.cos(t) * r, q = Math.sin(t) * r;
    o.push([PX + f.d[0] * s + f.u[0] * c + f.v[0] * q, PY + f.d[1] * s + f.u[1] * c + f.v[1] * q, PZ + f.d[2] * s + f.u[2] * c + f.v[2] * q]);
  }
  return o;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxEl = value;
  const C = Cam(45, 0.5, 2.85);
  const ext = [[0, 0, 0], [48, 48, 0], [0, 48, 0], [48, 0, 0]];
  for (const yw of [0, 45, 90]) for (const e of [0, 80]) ext.push(...circle(frame(rad(yw), rad(e)), FW, R, 8), ...circle(frame(rad(yw), rad(e)), -BK, R, 8));
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const pr = (pts) => pts.map((q) => P(q[0], q[1], q[2]));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(2, 2, 46, 46, 6, 2);
  put(solid(g), prism(P, front, br, bi, 3, 9));
  for (const [wx, wy] of [[6, 46], [46, 6], [44, 44]]) put(solid(g), prism(P, front, disc(wx, wy, 4), disc(wx, wy, 2.5), 0, 4));
  put(solid(g), prism(P, front, disc(PX, PY, 4), disc(PX, PY, 2.5), 9, PZ));
  const drumG = mk("g", {}, g);
  const drum = mk("path", { class: "sil" }, drumG), mouth = mk("path", { class: "sil hi" }, drumG);
  const lip = mk("path", { class: "nf lo" }, drumG), grille = mk("path", { class: "nf" }, drumG);

  const yaw = spring(rad(45), { k: 70, c: 15 }), el = spring(rad(18), { k: 70, c: 15 });
  let ly = NaN, le = NaN;
  function draw() {
    if (yaw.x === ly && el.x === le) return;
    ly = yaw.x; le = el.x;
    const f = frame(yaw.x, el.x);
    const fr = circle(f, FW, R), bk = circle(f, -BK, R);
    drum.setAttribute("d", poly(hull(pr(fr.concat(bk)))));
    mouth.setAttribute("d", poly(pr(fr)));
    lip.setAttribute("d", poly(pr(circle(f, FW - 3, R - 3))));
    const hub = circle(f, FW - 3, 2.5, 6), rim = circle(f, FW - 3, R - 3, 6);
    let d = poly(pr(hub));
    for (let k = 0; k < 6; k++) d += seg(P(...hub[k]), P(...rim[k]));
    grille.setAttribute("d", d);
  }
  const B = register(stage, (dt) => {
    const m = stepS(yaw, dt) | stepS(el, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);
  draw();
  read.textContent = "rest";

  const piv = P(PX, PY, PZ);
  function move([sx, sy]) {
    const fx = clamp((sx - piv[0] + 160) / 320, 0, 1), fy = clamp((piv[1] + 40 - sy) / 160, 0, 1);
    yaw.t = rad(90 - 90 * fx);
    el.t = rad(maxEl * fy);
    read.textContent = Math.round(maxEl * fy) + "°";
    B.wake();
  }
  function leave() { yaw.t = rad(45); el.t = rad(18); read.textContent = "rest"; B.wake(); }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxEl = v; }, destroy: bag.dispose };
}

hairline({
  name: "snowmaker",
  means: "A snow cannon on its stand: the pointer tilts the fan drum up and pans it to aim; leaving lowers it back.",
  rules: [1, 3, 5],
  range: [30, 60, 80],
  tour: [[200, 29], [103, 227], [297, 29], null],
  mount,
});
