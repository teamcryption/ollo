/**
 * T-bar lift: a haul cable with its grip, a spring rod hanging from it and
 * the T-shaped bar at the rod's foot. The pointer over the bar swings it on
 * its grip, the way a skier takes it, and the bar turns bright. At rest it
 * hangs tipped back, the grip bright. The slider is how far it swings.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 90, REST = -8, L = 62, W = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-50, 0, H + 8], [50, 0, H + 8], [0, -W, H - L - 6], [0, W, H - L - 6], [-30, 0, H - L], [30, 0, H - L]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the cable: a long thin bar along x, and the grip clamped on it
  const [cr, ci] = rings(-56, -1.2, 56, 1.2, 1.2, 0.4);
  put(solid(g), prism(P, front, cr, ci, H + 3, H + 5));
  const grip = solid(g);
  const [gr, gi] = rings(-7, -4, 7, 4, 2.5, 1);
  put(grip, prism(P, front, gr, gi, H - 4, H + 9));
  const rod = mk("path", { class: "sil" }, g), bar = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST, { k: 60, c: 8 });

  // a local point (x, y, z below the pin) swung by a degrees
  const R = (x, y, z, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return P(x * c - z * s, y, H - 4 + x * s + z * c); };
  const tube = (y, r, z, a, n = 16) => circ(r, n).map((q) => R(q.u, y, z + q.v, a));
  let last = NaN;
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    const rp = [];
    for (const z of [0, -L]) rp.push(...circ(1.8, 16).map((q) => R(q.u, q.v, z, a)));
    rod.setAttribute("d", poly(hull(rp)));
    bar.setAttribute("d", poly(hull([...tube(-W, 3, -L, a), ...tube(W, 3, -L, a), ...tube(-W + 2, 2.4, -L + 4, a), ...tube(W - 2, 2.4, -L + 4, a)])));
    cap.setAttribute("d", poly(hull(circ(4, 16).map((q) => R(q.u, q.v, -L + 4, a)).concat(circ(4, 16).map((q) => R(q.u, q.v, -L + 1, a))))));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  const mid = P(0, 0, H - L * 0.6);
  let on = null;
  function set(p) {
    const hov = !!p && Math.abs(p[0] - mid[0]) < 80 && Math.abs(p[1] - mid[1]) < 90;
    const t = hov ? clamp(amp + (p[0] - mid[0]) * 0.2, -45, 45) : REST;
    ang.t = t;
    if (hov !== on) {
      on = hov;
      bar.classList.toggle("hi", hov);
      grip.sil.classList.toggle("hi", !hov);
    }
    read.textContent = hov ? Math.round(Math.abs(t)) + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "skilift",
  means: "A T-bar lift: the pointer takes the bar and swings it forward on its grip under the haul cable.",
  rules: [1, 3, 4, 5],
  range: [12, 30, 42],
  tour: [[200, 219], [228, 238], [174, 202], null],
  mount,
});
