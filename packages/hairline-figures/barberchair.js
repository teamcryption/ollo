/**
 * Barber chair: a seat on a round pedestal with arms and a footrest, the
 * tall back and headrest hinged at the seat. The pointer's place along the
 * chair reclines the back; at rest it leans a little and is bright. The
 * slider is the deepest recline.
 */
const { Cam, fit, hull, poly, proj, rrect, rings, prism, facing, circ, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-70, -6, 40], [70, 40, 0], [-6, 40, 105], [-6, -6, 105], [40, 40, 0], [-40, 40, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(18, 17, 24), disc(18, 17, 22), 0, 3));
  put(solid(g), prism(P, front, disc(18, 17, 8), disc(18, 17, 6.5), 3, 26));
  const back = mk("path", { class: "sil" }, g), head = mk("path", { class: "nf" }, g);
  const [sr, si] = rings(-2, 0, 40, 34, 6, 1.6);
  put(solid(g), prism(P, front, sr, si, 26, 36));
  const [ar, ai] = rings(6, 34, 38, 39, 2.5, 1);
  put(solid(g), prism(P, front, ar, ai, 46, 50));
  mk("path", { d: poly(hull([P(10, 36, 36), P(12, 36, 36), P(10, 36, 46), P(12, 36, 46)])), class: "lo" }, g);
  const [fr, fi] = rings(46, 4, 66, 30, 4, 1.4);
  put(solid(g), prism(P, front, fr, fi, 8, 12));
  mk("path", { d: poly(hull([P(40, 15, 28), P(40, 19, 28), P(48, 15, 10), P(48, 19, 10)])), class: "lo" }, g);
  const bring = rrect(-7, 1, 0, 33, 4, 4), hring = rrect(-6, 8, 0, 26, 4, 4);
  const tilt = (ring, t, w0, w1) => {
    const c = Math.cos(rad(t)), s = Math.sin(rad(t)), pts = [];
    for (const w of [w0, w1]) for (const q of ring) pts.push(P(q.u * c - w * s, q.v, 36 + q.u * s + w * c));
    return poly(hull(pts));
  };
  const REST = 18, sp = spring(REST);
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    back.setAttribute("d", tilt(bring, sp.x, 0, 52));
    head.setAttribute("d", tilt(hring, sp.x, 55, 66));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  back.classList.add("hi");
  read.textContent = "rest";
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -90 || wx > 90 || wy < -40 || wy > 80) return leave();
    const t = clamp((70 - wx) * 0.9, 0, maxA);
    sp.t = t;
    read.textContent = Math.round(t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "barberchair",
  means: "A barber chair on its pedestal: the back and headrest recline as the pointer moves along the chair, and sit up at rest.",
  rules: [1, 3, 5, 8],
  range: [40, 75, 80],
  tour: [[294, 274], [220, 235], [156, 205], null],
  mount,
});
