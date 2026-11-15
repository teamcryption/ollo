/**
 * Camera slider: a rail on two feet with a carriage and a camera on it. The
 * pointer's place along the rail is where the carriage dollies to, on a
 * spring, the lens turning out toward the viewer. At rest the carriage is
 * parked a third of the way along, the camera body bright. The slider is
 * the parking spot.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, clamp, lerp, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const L = 150, RY0 = 0, RY1 = 16, RZ0 = 18, RZ1 = 25, CW = 20, BZ0 = 31, BZ1 = 55;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let park = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -6, 0], [L + 4, RY1 + 20, 0], [L + 4, -6, 0], [-4, RY1 + 20, 0], [CW, 8, BZ1 + 2], [L - CW, 8, BZ1 + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const x0 of [0, L - 14]) {
    const [fr, fi] = rings(x0 - 2, RY0 - 6, x0 + 16, RY1 + 6, 4, 1.2);
    put(solid(g), prism(P, front, fr, fi, 0, 4));
    const [lr, li] = rings(x0 + 3, RY0 + 3, x0 + 11, RY1 - 3, 3, 1);
    put(solid(g), prism(P, front, lr, li, 4, RZ0));
  }
  const [rr, ri] = rings(-4, RY0, L + 4, RY1, 3, 1.6);
  put(solid(g), prism(P, front, rr, ri, RZ0, RZ1));

  const cg = mk("g", {}, g);
  const plate = solid(cg), post = solid(cg), body = solid(cg), top = solid(cg);
  const lens = mk("path", { class: "sil" }, cg), glass = mk("path", { class: "nf lo" }, cg);
  body.sil.classList.add("hi");
  const sp = spring(lerp(CW, L - CW, park / 100));
  let last = NaN;

  function draw(x) {
    x = Math.round(x * 10) / 10;
    if (x === last) return;
    last = x;
    let a, b;
    [a, b] = rings(x - CW, RY0 - 5, x + CW, RY1 + 5, 4, 1.4); put(plate, prism(P, front, a, b, RZ1, RZ1 + 3));
    [a, b] = rings(x - 5, 3, x + 5, 13, 3, 1); put(post, prism(P, front, a, b, RZ1 + 3, BZ0));
    [a, b] = rings(x - CW + 2, RY0 - 2, x + CW - 2, RY1 - 2, 4, 1.6); put(body, prism(P, front, a, b, BZ0, BZ1));
    [a, b] = rings(x - 8, RY0 + 1, x + 6, RY1 - 6, 2.5, 1); put(top, prism(P, front, a, b, BZ1, BZ1 + 4));
    const zc = (BZ0 + BZ1) / 2, pts = [], ring = [];
    for (let i = 0; i < 24; i++) {
      const t = (i / 24) * Math.PI * 2, u = x + 3 + 9 * Math.cos(t), w = zc + 9 * Math.sin(t);
      pts.push(P(u, RY1 - 2, w), P(u, RY1 + 16, w));
      ring.push(P(x + 3 + 7 * Math.cos(t), RY1 + 16, zc + 7 * Math.sin(t)));
    }
    lens.setAttribute("d", poly(hull(pts)));
    glass.setAttribute("d", poly(ring));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(sp.x);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, RZ1);
    if (wy < -60 || wy > 80 || wx < -40 || wx > L + 40) return leave();
    sp.t = clamp(wx, CW, L - CW);
    read.textContent = "pos " + Math.round(((sp.t - CW) / (L - 2 * CW)) * 100);
    B.wake();
  }
  function leave() { sp.t = lerp(CW, L - CW, park / 100); read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { park = v; leave(); }, destroy: bag.dispose };
}

hairline({
  name: "cameraslider",
  means: "A camera on a slider rail: the carriage dollies along the rail to where the pointer is, on a spring.",
  rules: [1, 3, 5, 8],
  range: [0, 30, 100],
  tour: [[136, 125], [207, 160], [277, 195], null],
  mount,
});
