/**
 * Bass cabinet: a tall bass cabinet with two big cones on its face, standing
 * on a low dolly. The pointer is where the player stands: the cabinet tilts
 * back on its rear edge to fire up at them, further the higher the pointer, on
 * a spring. At rest it leans back a little, bright. The slider is how quickly
 * it follows (a stiffer or softer spring).
 *
 * The pattern: a continuous tilt (a spring on one angle); the hit is the
 * pointer's screen y, which never moves with the drawing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, lerp, poly, prism, proj, rings, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 20, D = 15, Z0 = 4, H = 66, REST = 0.12;
const FOOT = rrect(-W, -D, W, D, 4, 4), INNER = rrect(-W + 1.6, -D + 1.6, W - 1.6, D - 1.6, 2.6, 4);
const CONES = [[0, 22, 11], [0, 48, 11]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-24, -20, 0], [24, 20, 0], [-W, -D - 28, H + 4], [W, D, H + 4], [W, D + 4, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-24, -20, 24, 20, 5, 1.4);
  put(solid(g), prism(P, front, dr, di, 0, Z0));
  const cab = solid(g);
  cab.sil.classList.add("hi");
  const cones = CONES.map(() => [mk("path", { class: "nf" }, g), mk("path", { class: "nf lo" }, g)]);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const c = Math.cos(t), s = Math.sin(t);
    const at = (x, y, z) => { const dy = y + D, dz = z - Z0; return P(x, -D + dy * c - dz * s, Z0 + dy * s + dz * c); };
    const pts = [];
    for (const q of FOOT) pts.push(at(q.u, q.v, Z0), at(q.u, q.v, Z0 + H));
    put(cab, { sil: poly(hull(pts)), crease: poly(INNER.map((q) => at(q.u, q.v, Z0 + H))) });
    CONES.forEach(([x, z, r], k) => {
      cones[k][0].setAttribute("d", poly(circ(r, 32).map((q) => at(x + q.u, D + 0.2, z + q.v))));
      cones[k][1].setAttribute("d", poly(circ(r * 0.38, 24).map((q) => at(x + q.u, D + 0.2, z + q.v))));
    });
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    sp.t = over == null ? REST : over;
    read.textContent = over == null ? "rest" : "tilt " + Math.round((over * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp(lerp(0.42, 0, (p[1] - 60) / 200), 0, 0.42); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bassamp",
  means: "A bass cabinet on a dolly: it tilts back on its rear edge to aim its cones up at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[183, 97], [190, 250], [174, 66], null],
  mount,
});
