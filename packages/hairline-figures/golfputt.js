/** golfputt */
const {
  Cam, fit, proj, rrect, hull, poly, unproj, spring, stepS, tween, tset, tval, tdone, clamp,
  disposer, mk, pointer, register,
} = HL;

const at = (o, U, V, W, u, v, w) => [0, 1, 2].map((i) => o[i] + U[i] * u + V[i] * v + W[i] * w);
const slab = (o, U, V, W, u0, v0, u1, v1, r, t) => {
  const p = [];
  for (const q of rrect(u0, v0, u1, v1, r, 4)) p.push(at(o, U, V, W, q.u, q.v, 0), at(o, U, V, W, q.u, q.v, t));
  return p;
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return a.map((x) => x / l); };
const rod = (a, b, r0, r1) => {
  const d = nrm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
  const e = nrm(Math.abs(d[2]) > 0.9 ? cross(d, [1, 0, 0]) : cross(d, [0, 0, 1])), f = cross(d, e), p = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
    p.push(a.map((x, j) => x + (e[j] * c + f[j] * s) * r0), b.map((x, j) => x + (e[j] * c + f[j] * s) * r1));
  }
  return p;
};
const shape = (P, pts) => poly(hull(pts.map((q) => P(q[0], q[1], q[2]))));
const along = (o, D, s) => [o[0] + D[0] * s, o[1] + D[1] * s, o[2] + D[2] * s];

const R = 46, SL = 84, LEAN = [0.1, -0.06];
const disc = (x, y, r, z, n = 14) => rrect(x - r, y - r, x + r, y + r, r, n).map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-R, -R, 0], [R, R, 0], [-R, R, 0], [R, -R, 0], [0, 0, SL], [-30, 0, SL - 10], [0, 30, SL - 10]], 200, 150);
  const P = proj(C), g = mk("g", {}, svg);
  const path = (d, cls) => { const e = mk("path", { class: cls }, g); if (d) e.setAttribute("d", d); return e; };
  path(shape(P, disc(0, 0, R, 0).concat(disc(0, 0, R, 3))), "sil");
  path(poly(disc(0, 0, R - 2, 3).map((q) => P(...q))), "nf lo");
  path(poly(disc(0, 0, 6, 3, 8).map((q) => P(...q))), "nf");
  path(poly(disc(0.6, 0.6, 4.8, 3, 8).map((q) => P(...q))), "nf lo");
  path(shape(P, rod([22, 12, 3], [22, 12, 6.6], 2.2, 2.2).concat(rod([22, 12, 4], [22, 12, 5.6], 3, 3))), "sil");
  const stick = path(null, "sil"), flag = path(null, "sil hi"), fold = path(null, "nf lo");
  const tx = spring(LEAN[0]), ty = spring(LEAN[1]);
  let lx = NaN, ly = NaN;
  const draw = () => {
    if (tx.x === lx && ty.x === ly) return;
    lx = tx.x; ly = ty.x;
    const D = nrm([tx.x, ty.x, 1]), b = [0, 0, 1], top = along(b, D, SL);
    stick.setAttribute("d", shape(P, rod(b, top, 1.1, 0.9)));
    const F = nrm(cross(D, [0.5, 1, 0])), o = along(b, D, SL - 20), E = cross(D, F);
    flag.setAttribute("d", shape(P, slab(o, F, D, E, 0.8, 0, 28, 19, 1, 0.5)));
    fold.setAttribute("d", "M" + P(...at(o, F, D, E, 14, 0.5, 0)).join(",") + "L" + P(...at(o, F, D, E, 14, 18.5, 0)).join(","));
  };
  const B = register(stage, (dt) => { const m = stepS(tx, dt) | stepS(ty, dt); draw(); return !!m; });
  bag.add(B.unregister);
  const aim = (p) => {
    let a = LEAN, on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 3), d = Math.hypot(x, y);
      if (d < R + 10 && d > 1) { const m = (clamp(d / R, 0, 1) * 0.5) * reach / d; a = [x * m, y * m]; on = true; }
    }
    tx.t = a[0]; ty.t = a[1];
    read.textContent = on ? Math.round((Math.atan(Math.hypot(a[0], a[1])) * 180) / Math.PI) + "°" : "rest";
    B.wake();
  };
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "golfputt",
  means: "A flagstick in the cup on a putting green: the pin tilts toward the pointer, further the further out it is.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[138, 169], [214, 221], [269, 165], null],
  mount,
});
