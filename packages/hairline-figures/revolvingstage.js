/**
 * Revolving stage: a round turntable set into the stage, carrying a set of
 * two walls in a T, one with a door, one with a window. The pointer across
 * the stage turns the revolve on a spring, further the further out it is.
 * At rest the set stands a quarter turned, its long wall bright. The
 * slider is how far the revolve can turn.
 *
 * The pattern: a continuous turn, hit on the ground plane (unproj).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 72, D = 5, HW = 48, REST = 30;
const disc = (r, n = 64) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.1);
  const ext = [];
  for (let k = 0; k < 16; k++) { const a = (k / 16) * 2 * Math.PI; ext.push([R * Math.cos(a), R * Math.sin(a), 0], [58 * Math.cos(a), 58 * Math.sin(a), D + HW + 2]); }
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(R), disc(R - 3), 0, D));
  mk("path", { d: poly(disc(9, 32).map((q) => P(q.u, q.v, D))), class: "nf dash" }, g);
  const seams = mk("path", { class: "lo" }, g);
  const set = mk("g", {}, g);
  // the pieces, in the revolve's own frame: [u0, v0, u1, v1, height, opening]
  const defs = [
    { b: [-58, -1.6, 58, 1.6], h: HW, hole: [14, 34, 0, 34], cls: "sil hi" },
    { b: [-1.6, 1.6, 1.6, 50], h: HW - 6, hole: [16, 34, 16, 30], cls: "sil", side: 1 },
    { b: [-40, -22, -16, -2], h: 8, cls: "sil" },
  ];
  const parts = defs.map((d) => ({ ...d, grp: mk("g", {}, set) }));
  for (const p of parts) { p.sil = mk("path", { class: p.cls }, p.grp); p.top = mk("path", { class: "nf lo" }, p.grp); p.op = mk("path", { class: "nf" }, p.grp); }

  const th = spring(REST);
  let last = NaN;
  function draw() {
    if (th.x === last) return;
    last = th.x;
    const a = rad(th.x), c = Math.cos(a), s = Math.sin(a);
    const W = (u, v, z) => P(u * c - v * s, u * s + v * c, z);
    seams.setAttribute("d", [-48, -24, 24, 48].map((u) => { const h = Math.sqrt(R * R - u * u) - 4; return seg(W(u, -h, D), W(u, h, D)); }).join(""));
    const order = [];
    for (const p of parts) {
      const [u0, v0, u1, v1] = p.b, z0 = D, z1 = D + p.h, pts = [];
      const corners = [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
      for (const [u, v] of corners) pts.push(W(u, v, z0), W(u, v, z1));
      p.sil.setAttribute("d", poly(hull(pts)));
      p.top.setAttribute("d", poly(corners.map(([u, v]) => W(u, v, z1))));
      if (p.hole) {
        const [o0, o1, zA, zB] = p.hole;
        let ops = "";
        if (!p.side) {
          // the door, on whichever long face looks at the camera
          const vf = W(0, v1, z0)[1] > W(0, v0, z0)[1] ? v1 : v0;
          ops = poly([[o0, zA], [o1, zA], [o1, zB], [o0, zB]].map(([u, z]) => W(u, vf, z0 + z)));
        } else {
          const uf = W(u1, 25, z0)[1] > W(u0, 25, z0)[1] ? u1 : u0;
          ops = poly([[o0, 14], [o1, 14], [o1, zB], [o0, zB]].map(([v, z]) => W(uf, v, z0 + z)));
        }
        p.op.setAttribute("d", ops);
      }
      order.push([W((u0 + u1) / 2, (v0 + v1) / 2, 0)[1], p]);
    }
    order.sort((x, y) => x[0] - y[0]).forEach(([, p]) => set.appendChild(p.grp));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(p) {
    let on = false, x = 0;
    if (p) { const q = unproj(C, p[0], p[1], 0); x = q[0] - q[1]; on = Math.hypot(q[0], q[1]) < R * 1.5; }
    th.t = on ? REST + clamp(x / R, -1, 1) * 150 * reach : REST;
    read.textContent = on ? Math.round(th.t - REST) + "\u00b0" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "revolvingstage",
  means: "A revolving stage carrying a set of walls: it turns as the pointer moves across it, further the further out it goes.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[378, 211], [22, 211], [200, 211], null],
  mount,
});
