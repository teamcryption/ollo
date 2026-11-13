/**
 * Rowing machine: a long rail on two feet, a round flywheel housing at the
 * front, footrests by it, a seat on the rail and a handle on its chain. The
 * pointer is the stroke: the seat slides along the rail to stand under it and
 * the handle comes back with it, the chain paying out from the housing. At
 * rest the seat sits near the catch and the handle is bright. The
 * slider is the length of the stroke.
 *
 * The pattern: one part follows the pointer along a line (a spring on where),
 * picked on the plane of the rail top, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RZ = 13, S0 = 38, REST = 0.1, DC = [10, 23], DR = 13;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-2, -16, 0], [124, 16, 0], [124, -16, 0], [-2, 16, 0], [10, 0, 37], [S0 + 80, 0, 20]], 200, 172);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, par = g) => { const [ri, ii] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, ri, ii, z0, z1)); return s; };
  box(-2, -15, 24, 15, 3, 1.2, 0, 4);
  box(5, -4, 15, 4, 1.5, 0.6, 4, 12);
  // the housing: a drum on its side, the hull of its two faces
  const face = (y, r) => Array.from({ length: 40 }, (_v, i) => { const t = (i / 40) * Math.PI * 2; return P(DC[0] + r * Math.cos(t), y, DC[1] + r * Math.sin(t)); });
  const drum = solid(g);
  drum.sil.setAttribute("d", poly(hull(face(-9, DR).concat(face(9, DR)))));
  drum.cr.setAttribute("d", poly(face(9, DR - 1.4)) + poly(face(9, 3.5)));
  box(16, -3, 122, 3, 1.4, 0.6, RZ - 4, RZ);
  box(112, -14, 124, 14, 2.5, 1, 0, RZ - 4);
  box(26, -13, 32, -4, 1.2, 0.5, RZ, RZ + 7);
  box(26, 4, 32, 13, 1.2, 0.5, RZ, RZ + 7);

  const chain = mk("path", { class: "dash nf" }, g);
  const handle = solid(g), seat = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    const key = t.toFixed(4) + "," + len;
    if (key === last) return;
    last = key;
    const s = S0 + t * len, h = lerp(30, S0 + len - 16, t), hz = 24;
    chain.setAttribute("d", seg(P(DC[0] + DR - 1, 0, hz), P(h, 0, hz)));
    const [hr, hi] = rings(h - 1.3, -11, h + 1.3, 11, 1.2, 0.5);
    put(handle, prism(P, front, hr, hi, hz - 1.3, hz + 1.3));
    const [sr, si] = rings(s - 7, -8, s + 7, 8, 3, 1.3);
    put(seat, prism(P, front, sr, si, RZ, RZ + 5));
  }

  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    draw(clamp(sp.x, -0.05, 1.05));
    return moving;
  });
  bag.add(B.unregister);

  let on;
  function setT(t) {
    sp.t = t === null ? REST : t;
    if ((t === null) !== (on === null) || t !== on) {
      seat.sil.classList.toggle("hi", t !== null);
      handle.sil.classList.toggle("hi", t === null);
      read.textContent = t === null ? "rest" : "stroke " + Math.round(t * 100) + "%";
    }
    on = t;
    B.wake();
  }
  /** The pointer on the rail's top plane: its x along the rail is the stroke. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, RZ);
    if (Math.abs(y) > 34 || x < S0 - 22 || x > S0 + len + 22) return null;
    return clamp((x - S0) / len, 0, 1);
  }
  setT(null);
  bag.add(pointer(stage, { move: (p) => setT(hit(p)), leave: () => setT(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "rowingmachine",
  means: "A rowing machine: the seat slides along the rail to follow the pointer and the handle comes back with it on its chain.",
  rules: [1, 3, 5, 8],
  range: [44, 62, 76],
  tour: [[167, 155], [222, 182], [276, 210], null],
  mount,
});
