/**
 * Letter opener: a sealed envelope lying flat, its flap folded over the back,
 * and a letter opener lying on it, a rounded handle and a long tapering blade.
 * At rest the opener lies at the envelope's left end, its handle bright. The
 * pointer over the envelope slits it: the opener slides along and the flap
 * swings open behind it. The slider is how far the flap opens.
 *
 * The pattern: one gesture answering (a slide and a tilt on one tween); the
 * hit is on the ground plane, which never moves.
 */
const {
  Cam, clamp, fillet, fit, hull, lerp, poly, proj, rings, prism, facing, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 92, Y1 = 58, EZ = 3, BY = 40, SLIDE = 34, FLAP = 30, OPEN = 64;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [0, Y1, 0], [X1, 0, 0], [0, 0, 26], [X1, 0, 26], [X1 + 12, BY, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the envelope: a thin rounded plate, its sealed-side folds on top
  const [er, ei] = rings(0, 0, X1, Y1, 3, 1);
  put(solid(g), prism(P, front, er, ei, 0, EZ));
  mk("path", { class: "nf lo", d: poly([P(1.5, Y1 - 1.5, EZ), P(X1 / 2, Y1 * 0.42, EZ), P(X1 - 1.5, Y1 - 1.5, EZ)]).replace(/Z$/, "") }, g);

  // the flap: a rounded triangle hinged along the back edge
  const flap = mk("path", { class: "sil" }, g);
  const FL = fillet([[1, 0], [X1 - 1, 0], [X1 / 2, FLAP]], [1, 1, 4], 4);
  // the opener: handle and blade, both thin plates
  const opener = mk("g", {}, g);
  const hand = mk("path", { class: "sil" }, opener), blade = mk("path", { class: "sil" }, opener);
  const HP = fillet([[0, -4.5], [26, -4.5], [26, 4.5], [0, 4.5]], [4, 1, 1, 4], 4);
  const BP = fillet([[26, -3.2], [70, -0.6], [74, 0.4], [26, 3.2]], [0.5, 1, 1, 0.5], 4);
  const t = tween(0);
  let last = NaN;
  function plate(pts, x0, z0, z1) {
    const ring = (z) => pts.map(([u, v]) => P(x0 + u, BY + v, z));
    return poly(hull(ring(z0).concat(ring(z1))));
  }
  function draw(k) {
    if (k === last) return;
    last = k;
    const a = (lerp(0, OPEN * clamp(amt, 0, 1), k) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    flap.setAttribute("d", poly(FL.map(([u, v]) => P(u, v * c, EZ + v * s + 0.4))));
    const x0 = 4 + SLIDE * k;
    hand.setAttribute("d", plate(HP, x0, EZ, EZ + 4.5));
    blade.setAttribute("d", plate(BP, x0, EZ, EZ + 1.4));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    hand.classList.add("hi");
    read.textContent = on ? "slit" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, EZ);
    return x > -4 && x < X1 + 14 && y > -10 && y < Y1 + 4;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "letteropener",
  means: "A letter opener on a sealed envelope: the pointer over it slides the blade along and swings the flap open.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[133, 164], [200, 160], [270, 180], null],
  mount,
});
