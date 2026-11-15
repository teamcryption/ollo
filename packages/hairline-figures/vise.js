/**
 * Bench vise: a fixed jaw on its rail and a sliding jaw driven by the screw,
 * with the tommy bar at the end. The pointer is where the jaw slides to: its
 * x along the rail opens or closes the jaws on a spring. At rest the jaws stand
 * a little open, the sliding jaw bright.
 */
const {
  Cam, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const J0 = 14, JMIN = 3, JMAX = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-44, -20, 0], [-44, 20, 0], [88, -22, 30], [88, 22, 30], [-44, -18, 36], [0, 18, 36], [88, 0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  put(solid(g), prism(P, front, ...rings(-44, -14, 12, 14, 3, 1.2), 0, 4));
  put(solid(g), prism(P, front, ...rings(-36, -9, 8, 9, 2.5, 1), 4, 10));
  put(solid(g), prism(P, front, ...rings(-42, -18, -30, 18, 2.5, 1), 10, 36));
  const mv = mk("g", {}, g);
  const slide = solid(mv), jaw = solid(mv), boss = solid(mv);
  const rod = mk("path", { class: "nf sil" }, mv);
  const bar = mk("path", { class: "nf sil" }, mv);
  const k1 = flatDot(mv, C, 1.6, "dot m"), k2 = flatDot(mv, C, 1.6, "dot m");
  jaw.sil.classList.add("hi");

  const sp = spring(J0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const j = sp.x;
    if (Math.abs(j - drawn) < 1e-3) return;
    drawn = j;
    const x0 = -30 + j;
    put(slide, prism(P, front, ...rings(x0, -7, x0 + 34, 7, 2, 0.8), 10, 18));
    put(jaw, prism(P, front, ...rings(x0, -18, x0 + 12, 18, 2.5, 1), 10, 36));
    put(boss, prism(P, front, ...rings(x0 + 34, -5, x0 + 40, 5, 2, 0.8), 14, 26));
    rod.setAttribute("d", seg(P(x0 + 40, -1.4, 20), P(x0 + 56, -1.4, 20)) + seg(P(x0 + 40, 1.4, 20), P(x0 + 56, 1.4, 20)));
    const hx = x0 + 56;
    bar.setAttribute("d", seg(P(hx, -20, 21), P(hx, 20, 21)) + seg(P(hx, -20, 19), P(hx, 20, 19)));
    place(k1, P(hx, -21, 20)); place(k2, P(hx, 21, 20));
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t) {
    sp.t = t;
    read.textContent = t === J0 && !live ? "rest" : Math.round(t) + " mm";
    B.wake();
  }
  let live = false;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(y) > 50 || x < -70 || x > 110) { live = false; aim(J0); return; }
      live = true; aim(clamp(Math.round(x - 4), JMIN, JMAX));
    },
    leave: () => { live = false; aim(J0); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "vise",
  means: "A bench vise: the sliding jaw follows the pointer along the rail, opening and closing on its screw.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[121, 176], [231, 231], [268, 250], null],
  mount,
});
