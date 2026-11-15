/**
 * Mitre saw: a round table on its base, the fence behind it, and the arm
 * hinged on its post carrying the blade and handle. The pointer is how far the
 * arm comes down: further along the table, lower the blade swings, on a
 * spring. At rest the arm is raised, the blade bright.
 */
const {
  Cam, facing, fit, prism, proj, rings, unproj, spring, stepS, clamp, fillet, poly, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 28, AMIN = -14, AMAX = 40, PX = -30, PZ = 30, R = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-42, -32, 0], [32, 32, 0], [-42, 32, 0], [32, -32, 0], [0, 0, 74], [26, 0, 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-40, -30, 30, 30, 4, 1.5), 0, 5));
  put(solid(g), prism(P, front, ...rings(-16, -16, 16, 16, 16, 1.2), 5, 7));
  put(solid(g), prism(P, front, ...rings(-38, -26, -33, 26, 1.5, 0.8), 5, 14));
  put(solid(g), prism(P, front, ...rings(-38, -4, -26, 4, 2, 1), 5, PZ + 2));
  const blade = mk("path", { class: "sil hi" }, g);
  const hub = mk("path", { class: "lo nf" }, g);
  const arm = mk("path", { class: "sil" }, g);
  const grip = mk("path", { class: "sil" }, g);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  const circle = (cx, cz, r, y) => { const o = []; for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2; o.push(P(cx + r * Math.cos(t), y, cz + r * Math.sin(t))); } return o; };
  function draw() {
    const d = sp.x;
    if (Math.abs(d - drawn) < 1e-3) return;
    drawn = d;
    const t = (d * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const at = (u, w) => [PX + u * c - w * s, PZ + u * s + w * c];
    const [bx, bz] = at(30, 0);
    blade.setAttribute("d", poly(circle(bx, bz, R, 0)));
    hub.setAttribute("d", poly(circle(bx, bz, 4, 0)));
    const q = [[-4, -4], [50, -4], [50, 5], [-4, 5]].map(([u, w]) => { const [x, z] = at(u, w); return P(x, 5, z); });
    arm.setAttribute("d", poly(fillet(q, [2, 2, 2, 2])));
    const [h0x, h0z] = at(48, 4), [h1x, h1z] = at(48, 16), [h2x, h2z] = at(58, 16);
    const hq = [P(h0x - 2, 6, h0z), P(h1x, 6, h1z), P(h2x, 6, h2z), P(h2x, 6, h2z - 4), P(h1x + 4, 6, h1z - 4), P(h0x + 3, 6, h0z)];
    grip.setAttribute("d", poly(fillet(hq, [1, 1.5, 1.5, 1.5, 1, 1])));
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t, live) {
    sp.t = t;
    read.textContent = live ? Math.round(t) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(y) > 60 || x < -60 || x > 70) { aim(REST, false); return; }
      aim(clamp(Math.round(AMAX - ((x + 30) / 70) * (AMAX - AMIN)), AMIN, AMAX), true);
    },
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "circularsaw",
  means: "A mitre saw: the arm swings its blade down toward the table as the pointer moves along it, and lifts when it leaves.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[156, 191], [209, 236], [280, 253], null],
  mount,
});
