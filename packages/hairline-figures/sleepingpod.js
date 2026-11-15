/**
 * Sleeping pod: a low bed plinth with a long shell hood hinged at its head.
 * The pointer along the pod swings the hood open about the hinge; nearer the
 * foot opens it wider. At rest the hood stands ajar, bright.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, clamp, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const L = 64, W = 28, BZ = 10, R = 14, REST = 0.35, MAX = 1.15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [0, W / 2, BZ + R + L * 0.6], [L * 0.5, W / 2, BZ + R + 6]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, W, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [mr, mi] = rings(3, 3, L - 3, W - 3, 4, 1.2);
  put(solid(g), prism(P, front, mr, mi, BZ, BZ + 3));
  const hood = mk("path", { class: "sil hi" }, g), lip = mk("path", { class: "nf" }, g), win = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  const arc = (x) => { const a = []; for (let i = 0; i <= 12; i++) { const t = (i / 12) * Math.PI; a.push([x, W / 2 - R * Math.cos(t), BZ + R * Math.sin(t)]); } return a; };
  const rot = ([x, y, z], a) => { const dz = z - BZ; return P(x * Math.cos(a) - dz * Math.sin(a), y, BZ + x * Math.sin(a) + dz * Math.cos(a)); };
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const head = arc(0).map((p) => rot(p, a)), foot = arc(L).map((p) => rot(p, a));
    hood.setAttribute("d", poly(hull(head.concat(foot))));
    lip.setAttribute("d", poly(foot));
    const w = []; for (const x of [L * 0.35, L * 0.75]) for (const t of [0.35, 0.65]) { const th = t * Math.PI; w.push([x, W / 2 - R * Math.cos(th), BZ + R * Math.sin(th)]); }
    win.setAttribute("d", poly([w[0], w[1], w[3], w[2]].map((p) => rot(p, a))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  function set(p) {
    const now = performance.now();
    if (!p) { tset(ang, REST, now, 0); read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (x < -20 || x > L + 30 || y < -30 || y > W + 30) return set(null);
    const t = clamp(x / L, 0, 1), a = clamp(0.2 + t * MAX * (0.4 + reach / 100), 0.2, MAX);
    tset(ang, a, now, 0);
    read.textContent = Math.round((a / MAX) * 100) + "% open";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "sleepingpod",
  means: "An airport sleeping pod: the shell hood swings open on its head hinge, wider as the pointer moves toward the foot.",
  rules: [1, 3, 4, 5],
  range: [0, 60, 100],
  tour: [[265, 210], [158, 192], [230, 200], null],
  mount,
});
