/**
 * Rice dispenser: a tall bin with a lid, a level window down its front and a
 * measuring drawer at its foot. The pointer coming round to the front pulls
 * the drawer out on a spring, a measure of rice in it. At rest the drawer sits
 * just proud of the face and its pull is bright; drawn out, the drawer takes
 * the bright.
 *
 * The pattern: a continuous pull (spring) read from the ground plane, which
 * never moves.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, unproj, spring, stepS, clamp, fillet, poly,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 44, D = 36, H = 78, X0 = 7, X1 = 37, Z0 = 4, Z1 = 20, OUT = 30, REST = 0.08;
const GRAINS = [[0.3, 0.3], [0.5, 0.25], [0.7, 0.35], [0.4, 0.55], [0.6, 0.6], [0.25, 0.7], [0.75, 0.72], [0.5, 0.8]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT, 0], [W, D + OUT, 0], [0, 0, H + 4], [W, D, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ring, inner] = rings(0, 0, W, D, 6, 1.8);
  put(solid(g), prism(P, front, ring, inner, 0, H));
  const [lr, li] = rings(-1, -1, W + 1, D + 1, 7, 1.6);
  put(solid(g), prism(P, front, lr, li, H, H + 4));
  const face = (x, z) => P(x, D, z);
  mk("path", { class: "lo nf", d: poly(fillet([face(18, 30), face(26, 30), face(26, H - 10), face(18, H - 10)], [3, 3, 3, 3])) + seg(face(18, 50), face(26, 50)) }, g);
  mk("path", { class: "lo nf", d: poly(fillet([face(X0 - 1, Z0 - 1), face(X1 + 1, Z0 - 1), face(X1 + 1, Z1 + 1), face(X0 - 1, Z1 + 1)], [2, 2, 2, 2])) }, g);
  const drawer = solid(g);
  const grains = GRAINS.map(() => flatDot(g, C, 1.3, "dot off"));
  const pull = mk("path", { class: "nf sil" }, g);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const o = sp.x;
    if (Math.abs(o - drawn) < 1e-4) return;
    drawn = o;
    const y1 = D + 1.5 + o * OUT;
    const [dr, di] = rings(X0, D - 0.2, X1, y1, 1.6, 1.2);
    put(drawer, prism(P, front, dr, o > 0.15 ? di : null, Z0, Z1));
    GRAINS.forEach(([u, v], i) => {
      const y = D + v * (y1 - D - 4);
      if (o > 0.25) { if (!grains[i].isConnected) pull.before(grains[i]); place(grains[i], P(X0 + 3 + u * (X1 - X0 - 6), y, Z1 - 1)); } else grains[i].remove();
    });
    const mid = (X0 + X1) / 2;
    pull.setAttribute("d", seg(P(mid - 6, y1, 13), P(mid - 6, y1 + 3, 13)) + seg(P(mid - 6, y1 + 3, 13), P(mid + 6, y1 + 3, 13)) + seg(P(mid + 6, y1 + 3, 13), P(mid + 6, y1, 13)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(o) {
    sp.t = o;
    const lit = o > 0.6;
    pull.classList.toggle("hi", !lit);
    drawer.sil.classList.toggle("hi", lit);
    read.textContent = o > REST ? "cup " + Math.round(o * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -16 || x > W + 16 || y < -16 || y > D + OUT + 18) return set(REST);
      set(clamp((y - 4) / (D + 10), REST, 1));
    },
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  set(REST);
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ricebin",
  means: "A rice dispenser bin: the pointer coming round to the front pulls out its measuring drawer, a measure of rice in it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[180, 206], [257, 281], [143, 287], null],
  mount,
});
