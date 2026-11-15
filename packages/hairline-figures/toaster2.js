/**
 * Toaster oven: a boxy oven on four feet, a glass door hinged along its
 * bottom edge, two dials beside it. The pointer coming round to the front
 * swings the door down on a spring and, once it is low enough, the rack tray
 * slides out over it. At rest the door hangs a little ajar and its handle is
 * the bright mark; open, the tray takes the bright.
 *
 * The pattern: a continuous pull (spring) read from the ground plane, which
 * never moves.
 */
const {
  Cam, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, clamp, fillet, poly,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 64, D = 40, H = 36, X0 = 4, X1 = 46, Z0 = 6, DH = 25, REST = 0.12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + DH, 0], [W, D, 0], [0, 0, H], [W, D, H], [X0, D + DH, Z0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const [x, y] of [[5, 4], [W - 5, 4], [5, D - 4], [W - 5, D - 4]]) place(flatDot(g, C, 1.6, "dot off"), P(x, y, 0));
  const [ring, inner] = rings(0, 0, W, D, 5, 1.6);
  put(solid(g), prism(P, front, ring, inner, 2.5, H));
  // the oven's mouth on the front face, and the dials beside it
  const face = (x, z) => P(x, D, z);
  mk("path", { class: "lo nf", d: poly(fillet([face(X0, Z0), face(X1, Z0), face(X1, Z0 + DH), face(X0, Z0 + DH)], [2, 2, 2, 2])) }, g);
  mk("path", { class: "lo nf", d: seg(P(X0 + 2, D - 6, Z0 + 9), P(X1 - 2, D - 6, Z0 + 9)) + seg(P(X0 + 2, D - 30, Z0 + 9), P(X0 + 2, D - 6, Z0 + 9)) }, g);
  for (const z of [26, 15]) {
    const pts = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push(P(55 + 4 * Math.cos(a), D + 0.4, z + 4 * Math.sin(a))); }
    mk("path", { d: poly(pts) }, g);
  }
  mk("path", { class: "lo nf", d: seg(P(51, D + 0.4, 8), P(59, D + 0.4, 8)) }, g);
  const door = mk("path", { class: "sil" }, g);
  const glass = mk("path", { class: "lo nf" }, g);
  const handle = mk("path", { class: "nf sil" }, g);
  const tray = mk("path", { class: "sil" }, g);
  const rack = mk("path", { class: "lo nf" }, g);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const o = sp.x;
    if (Math.abs(o - drawn) < 1e-4) return;
    drawn = o;
    const a = o * Math.PI / 2, s = Math.sin(a), c = Math.cos(a);
    const Q = (x, h, out = 0) => P(x, D + h * s + out * c, Z0 + h * c - out * s);
    door.setAttribute("d", poly(fillet([Q(X0, 0), Q(X1, 0), Q(X1, DH), Q(X0, DH)], [2, 2, 3, 3])));
    glass.setAttribute("d", poly(fillet([Q(X0 + 5, 4), Q(X1 - 5, 4), Q(X1 - 5, DH - 6), Q(X0 + 5, DH - 6)], [1.5, 1.5, 1.5, 1.5])));
    handle.setAttribute("d", seg(Q(X0 + 6, DH - 2.5, 0), Q(X0 + 6, DH - 2.5, 3)) + seg(Q(X0 + 6, DH - 2.5, 3), Q(X1 - 6, DH - 2.5, 3)) + seg(Q(X1 - 6, DH - 2.5, 3), Q(X1 - 6, DH - 2.5, 0)));
    const t = clamp((o - 0.55) / 0.45, 0, 1) * 22, z = Z0 + 9;
    if (t <= 0.3) { tray.setAttribute("d", ""); rack.setAttribute("d", ""); }
    if (t > 0.3) {
      const T = (x, y, zz = z) => P(x, D + y, zz);
      tray.setAttribute("d", poly(fillet([T(X0 + 2, 0), T(X1 - 2, 0), T(X1 - 2, t), T(X1 - 2, t, z - 1.6), T(X0 + 2, t, z - 1.6), T(X0 + 2, t)], [1, 1, 1, 1, 1, 1])));
      let d = "";
      for (let x = X0 + 7; x < X1 - 4; x += 5) d += seg(T(x, 0), T(x, t - 2));
      rack.setAttribute("d", d);
    }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(o, lit) {
    sp.t = o;
    handle.classList.toggle("hi", !lit);
    tray.classList.toggle("hi", lit);
    read.textContent = o > REST ? "door " + Math.round(o * 90) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -16 || x > W + 16 || y < -16 || y > D + DH + 18) return set(REST, false);
      const o = clamp((y - 6) / (D + 6), REST, 1);
      set(o, o > 0.6);
    },
    leave: () => set(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  set(REST, false);
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "toaster2",
  means: "A toaster oven: the pointer coming round to the front swings its door down, and the rack tray slides out over it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[141, 168], [241, 259], [126, 246], null],
  mount,
});
