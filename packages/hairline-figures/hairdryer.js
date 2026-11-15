/**
 * Salon dryer: a salon chair with a hood dryer on a stand behind it. The
 * pointer's height swings the hood on its pivot: low brings it down over
 * the seat, high tilts it back and up. At rest it hangs half raised, its
 * shell bright. The slider is how far back it tilts.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PV = [0, -26, 60], HR = 17, ARM = 24, REST = 30;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-20, -34, 0], [20, 20, 0], [20, -34, 0], [-20, 20, 0], [0, -26, 90], [0, 10, 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // stand, behind the chair
  put(solid(g), prism(P, front, disc(PV[0], PV[1], 12), disc(PV[0], PV[1], 10.5), 0, 2));
  put(solid(g), prism(P, front, disc(PV[0], PV[1], 2.2, 16), disc(PV[0], PV[1], 1.4, 16), 2, PV[2]));
  // the chair
  put(solid(g), prism(P, front, disc(0, 0, 16), disc(0, 0, 14.5), 0, 2));
  put(solid(g), prism(P, front, disc(0, 0, 4, 16), disc(0, 0, 3, 16), 2, 14));
  const [br, bi] = rings(-15, -18, 15, -13, 2.5, 1.2);
  put(solid(g), prism(P, front, br, bi, 14, 46));
  const [sr, si] = rings(-15, -15, 15, 15, 5, 1.6);
  put(solid(g), prism(P, front, sr, si, 14, 21));
  const hood = mk("g", {}, g);
  const arm = mk("path", { class: "nf" }, hood), shell = mk("path", { class: "sil" }, hood), lip = mk("path", { class: "nf lo" }, hood);

  // a hood point in local space (pivot at origin, hood centre at y = ARM), turned by a about the x axis
  const W = (x, y, z, a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return P(PV[0] + x, PV[1] + y * c - z * s, PV[2] + y * s + z * c);
  };
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), pts = [], rim = [];
    for (let i = 0; i <= 5; i++) {
      const t = (i / 5) * (Math.PI / 2), r = HR * Math.cos(t), z = -8 + HR * 0.85 * Math.sin(t);
      for (const q of circ(r, 32)) pts.push(W(q.u, ARM + q.v, z, a));
    }
    for (const q of circ(HR, 40)) rim.push(W(q.u, ARM + q.v, -8, a));
    shell.setAttribute("d", poly(hull(pts.concat(rim))));
    lip.setAttribute("d", poly(rim));
    arm.setAttribute("d", open([W(0, 0, -1, a), W(0, ARM - HR, 4, a)]) + open([W(0, 0, 1, a), W(0, ARM - HR, 6, a)]));
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const seat = P(0, 0, 21)[1];
  function aim(p) {
    sp.t = p ? clamp((seat + 20 - p[1]) / 150, 0, 1) * maxA : REST;
    shell.classList.add("hi");
    read.textContent = p ? Math.round(sp.t) + "°" : "rest";
    B.wake();
  }
  draw(REST);
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "hairdryer",
  means: "A salon chair under a hood dryer: the pointer's height swings the hood down over the seat or tilts it back up.",
  rules: [3, 5, 6, 8],
  range: [40, 70, 80],
  tour: [[186, 73], [186, 218], [238, 145], null],
  mount,
});
