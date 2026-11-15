/**
 * Mail drop box: a blue street collection box on four short feet, a domed
 * cap, and a wide pull-down chute on its front. The pointer is a hand coming
 * to post a letter: the nearer it comes to the front, the further the chute
 * swings down open on a spring, showing the slot behind it. At rest the chute
 * hangs a little ajar, its edge bright. The slider is how far it can open.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, facing, poly, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -14, X1 = 14, Y0 = -11, Y1 = 11, ZB = 7, ZT = 52, HZ = 31, H = 17, AJAR = 0.16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[X0, Y0, 0], [X1, Y1 + H, 0], [X0, Y1 + H, HZ], [X1, Y0, ZT + 6], [X0, Y0, ZT + 6], [X1, Y1, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [fx, fy] of [[X0 + 3, Y0 + 3], [X1 - 3, Y0 + 3], [X0 + 3, Y1 - 3], [X1 - 3, Y1 - 3]].sort((a, b) => a[0] + a[1] - b[0] - b[1])) {
    const [r] = rings(fx - 2, fy - 2, fx + 2, fy + 2, 0.8, 0.4);
    put(solid(g), prism(P, front, r, null, 0, ZB + 1));
  }
  const [bR, bI] = rings(X0, Y0, X1, Y1, 4, 1.4);
  put(solid(g), prism(P, front, bR, bI, ZB, ZT));
  const [cR, cI] = rings(X0 + 1, Y0 + 1, X1 - 1, Y1 - 1, 4, 1.6);
  put(solid(g), prism(P, front, cR, cI, ZT, ZT + 5));
  // the slot the chute uncovers, on the front face
  const slot = (a, b, z0, z1) => poly(fillet([P(a, Y1, z0), P(b, Y1, z0), P(b, Y1, z1), P(a, Y1, z1)], [1, 1, 1, 1]));
  mk("path", { class: "lo", d: slot(-10, 10, HZ + 3, HZ + H - 3) }, g);
  const flap = mk("path", { class: "sil" }, g);
  const lip = mk("path", { class: "lo nf" }, g);
  const sp = spring(AJAR, { k: 100, c: 18 });
  let drawn = NaN, top = value;

  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const th = t * 1.35, dy = H * Math.sin(th), dz = H * Math.cos(th);
    const A = [-12, Y1 + 0.2, HZ], B = [12, Y1 + 0.2, HZ], Cc = [12, Y1 + 0.2 + dy, HZ + dz], D = [-12, Y1 + 0.2 + dy, HZ + dz];
    flap.setAttribute("d", poly(fillet([A, B, Cc, D].map((q) => P(...q)), [1.2, 1.2, 1.2, 1.2])));
    const k = 0.78, E = [-8, Y1 + 0.2 + dy * k, HZ + dz * k], F = [8, Y1 + 0.2 + dy * k, HZ + dz * k];
    lip.setAttribute("d", "M" + P(...E).join(",") + "L" + P(...F).join(","));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let open = null;
  function retarget() {
    sp.t = open == null ? AJAR : Math.max(AJAR, open * top);
    flap.classList.toggle("hi", true);
    read.textContent = open == null ? "rest" : Math.round(sp.t * 100) + "%";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y - (Y1 + 6));
      open = d > 60 ? null : clamp(1.15 - d / 45, 0, 1);
      retarget();
    },
    leave: () => { open = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { top = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "postbox2",
  means: "A street mail drop box whose pull-down chute swings open as the pointer comes near its front, showing the slot.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[54, 254], [167, 283], [365, 269], null],
  mount,
});
