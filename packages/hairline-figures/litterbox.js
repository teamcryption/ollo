/**
 * Litter tray: a low cat tray with a hooded cover and a door in its front.
 * The pointer's distance along the tray lifts the hood off its base on a
 * spring, tilting back as it rises, to show the litter heaped inside. At rest
 * the hood sits a little ajar, its rim bright. The slider is the lift.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, clamp, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 90, D = 60, TZ = 14, HZ = 46, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxL = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, 0, TZ + HZ + 40], [W, 0, TZ + HZ + 40]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // tray base
  const [tr, ti] = rings(0, 0, W, D, 10, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  // litter heap inside the tray
  const heap = [];
  for (const [b, z] of [[5, 0], [14, 4], [26, 7]]) heap.push(...ringAt(P, rrect(b, b * 0.7, W - b, D - b * 0.7, 8, 4), TZ + z - 2));
  const lit = mk("path", { d: poly(hull(heap)), class: "nf lo" }, g);
  const grains = [[30, 26], [52, 34], [64, 22], [40, 40]].map(([x, y]) => { const p = P(x, y, TZ + 6); return mk("circle", { cx: p[0], cy: p[1], r: 1.4, class: "dot off" }, g); });
  // hood
  const hood = solid(g), door = mk("path", { class: "nf lo" }, g), vent = mk("path", { class: "nf lo" }, g);
  const foot = rrect(1, 1, W - 1, D - 1, 10, 4), top = rrect(12, 9, W - 12, D - 9, 12, 4), inner = rrect(14, 11, W - 14, D - 11, 10, 4);
  const lift = spring(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return; last = l;
    const tilt = l * 0.35; // back edge rises less: the hood hinges at the back (low y)
    const R = (ring, z) => ring.map((q) => { const zz = z + l - tilt * (1 - q.v / D); return P(q.u, q.v, zz); });
    const fp = R(foot, TZ), tp = R(top, TZ + HZ);
    hood.sil.setAttribute("d", poly(hull(fp.concat(tp))));
    hood.cr.setAttribute("d", open(R(run(inner, front), TZ + HZ)));
    // door: a rounded arch on the front face (+y)
    const dr = [];
    for (let i = 0; i <= 10; i++) { const a = Math.PI * i / 10; dr.push([W / 2 + 14 * Math.cos(a), D - 1 + 7 * (1 - Math.sin(a)) * 0, 4 + 22 * Math.sin(a)]); }
    const ty = (q) => P(q[0] - (q[2] / HZ) * 0, q[1] - (q[2] / HZ) * 7, TZ + q[2] + l - tilt);
    door.setAttribute("d", poly(dr.map(ty)));
    const vz = TZ + HZ + l - tilt * 0.5;
    vent.setAttribute("d", poly(ringAt(P, rrect(W / 2 - 12, D / 2 - 4, W / 2 + 12, D / 2 + 4, 4, 3), vz)));
  }
  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);
  let on = false;
  function setT(t, a) {
    lift.t = t;
    if (a !== on) { on = a; hood.sil.classList.toggle("hi", true); grains.forEach((c) => c.setAttribute("class", a ? "dot m" : "dot off")); }
    read.textContent = a ? "lid " + Math.round((t / maxL) * 100) : "rest";
    B.wake();
  }
  hood.sil.classList.add("hi");
  draw(REST); setT(REST, false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      const inside = x > -40 && x < W + 40 && y > -40 && y < D + 40;
      if (!inside) return setT(REST, false);
      const t = clamp(1 - Math.hypot(x - W / 2, y - D / 2) / 70, 0.15, 1);
      setT(Math.round(maxL * t), true);
    },
    leave: () => setT(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxL = v; }, destroy: bag.dispose };
}

hairline({
  name: "litterbox",
  means: "A hooded cat litter tray: the hood lifts and tips back off its base as the pointer nears the middle, showing the litter.",
  rules: [1, 3, 5, 8],
  range: [10, 34, 40],
  tour: [[94, 199], [200, 252], [285, 209], null],
  mount,
});
