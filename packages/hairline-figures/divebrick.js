/** divebrick */
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

const ZF = 24, B0 = -52, B1 = 92, REST = 2.5;
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[B0 - 6, -4, 0], [B1, 24, 0], [B0, 0, ZF + 14], [B1, 20, ZF + 22], [B1, 20, ZF - 24]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const path = (d, cls) => { const e = mk("path", { class: cls }, g); if (d) e.setAttribute("d", d); return e; };
  // the anchor block under the back end, the fulcrum stand and its roller
  path(shape(P, slab([B0 - 6, -2, 0], ...I3, 0, 0, 16, 24, 3, ZF - 3)), "sil");
  path(shape(P, slab([-9, -4, 0], ...I3, 0, 0, 18, 28, 4, 4)), "sil");
  path(shape(P, slab([-5, -2, 4], ...I3, 0, 0, 10, 24, 2, 13)), "sil");
  const roller = path(shape(P, rod([0, -4, ZF - 4], [0, 24, ZF - 4], 4, 4)), "sil");
  const board = path(null, "sil"), groove = path(null, "nf lo");
  const sp = spring(REST);
  let last = NaN;
  const draw = () => {
    if (sp.x === last) return;
    last = sp.x;
    const r = (sp.x * Math.PI) / 180, U = [Math.cos(r), 0, Math.sin(r)], W = [-Math.sin(r), 0, Math.cos(r)], o = [0, 0, ZF];
    board.setAttribute("d", shape(P, slab(o, U, [0, 1, 0], W, B0, 0, B1, 20, 4, 3.5)));
    groove.setAttribute("d", poly([at(o, U, [0, 1, 0], W, B1 - 30, 2.5, 3.5), at(o, U, [0, 1, 0], W, B1 - 3, 2.5, 3.5), at(o, U, [0, 1, 0], W, B1 - 3, 17.5, 3.5), at(o, U, [0, 1, 0], W, B1 - 30, 17.5, 3.5)].map((q) => P(...q))));
  };
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const aim = (p) => {
    let a = REST, on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], ZF + 3.5);
      if (y > -12 && y < 32 && x > B0 - 4 && x < B1 + 6) { on = true; a = x < 6 ? 3 : -clamp(1 + ((x - 6) / (B1 - 6)) * 13, 1, 14) * reach; }
    }
    sp.t = a;
    board.classList.toggle("hi", on);
    roller.classList.toggle("hi", !on);
    read.textContent = on ? Math.round(-a) + "°" : "rest";
    B.wake();
  };
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "divebrick",
  means: "A springboard on its fulcrum: the board tilts on the roller as the pointer walks out along it, dipping most at the tip.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[137, 109], [283, 182], [316, 198], null],
  mount,
});
