/**
 * Solar street light: a tall pole on a footing, a lamp head on an arm, and a
 * solar panel on top. The panel turns and tilts to face the pointer like a
 * panel tracking the sun. At rest it leans aside and its rim is bright.
 * The slider is how steep the panel tilts.
 */
const { Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, rrect, seg, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PZ = 72, PW = 46, PD = 30, REST = [-0.9, 0.3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 2.98);
  fit(C, [[-PW / 2, -PW / 2, 0], [PW / 2, PW / 2, 0], [PW / 2, -PW / 2, PZ + 14], [-PW / 2, PW / 2, PZ + 14], [0, 0, PZ + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-6, -6, 6, 6, 2.5, 1);
  put(solid(g), prism(P, front, fr, fi, 0, 4));
  const [pr, pi] = rings(-1.8, -1.8, 1.8, 1.8, 1.8, 0.6);
  put(solid(g), prism(P, front, pr, pi, 4, PZ));
  const [ar, ai] = rings(0, -3.2, 24, 3.2, 3, 1);
  put(solid(g), prism(P, front, ar, ai, PZ - 14, PZ - 10));
  mk("path", { d: seg(P(10, 3.2, PZ - 14), P(22, 3.2, PZ - 14)), class: "nf lo" }, g);
  const pan = solid(g);
  const cells = mk("path", { class: "nf lo" }, pan.g);
  const outer = rrect(-PW / 2, -PD / 2, PW / 2, PD / 2, 2.4, 3), inner = rrect(-PW / 2 + 1.6, -PD / 2 + 1.6, PW / 2 - 1.6, PD / 2 - 1.6, 1.2, 3);
  const yaw = spring(REST[0]), tl = spring(REST[1]);
  let ly = NaN, lt = NaN;
  function draw(a, t) {
    const ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(t), st = Math.sin(t);
    const at = (u, v, w) => {
      const y1 = v * ct - w * st, z1 = v * st + w * ct;
      return P(u * ca - y1 * sa, u * sa + y1 * ca, PZ + 6 + z1);
    };
    const top = outer.map((q) => at(q.u, q.v, 1)), bot = outer.map((q) => at(q.u, q.v, -1));
    pan.sil.setAttribute("d", poly(hull(top.concat(bot))));
    pan.cr.setAttribute("d", poly(inner.map((q) => at(q.u, q.v, 1))));
    let k = "";
    for (const u of [-PW / 6, PW / 6]) k += seg(at(u, -PD / 2 + 1.6, 1), at(u, PD / 2 - 1.6, 1));
    k += seg(at(-PW / 2 + 1.6, 0, 1), at(PW / 2 - 1.6, 0, 1));
    cells.setAttribute("d", k);
  }
  pan.sil.classList.add("hi");
  const L = register(stage, (dt) => {
    const m = stepS(yaw, dt) | stepS(tl, dt);
    if (yaw.x !== ly || tl.x !== lt) { draw(yaw.x, tl.x); ly = yaw.x; lt = tl.x; }
    return !!m;
  });
  bag.add(L.unregister);
  function aim(p) {
    if (!p) { yaw.t = REST[0]; tl.t = REST[1]; read.textContent = "rest"; L.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    let a = Math.atan2(y, x) - Math.PI / 2;
    while (a - yaw.x > Math.PI) a -= 2 * Math.PI;
    while (a - yaw.x < -Math.PI) a += 2 * Math.PI;
    yaw.t = a;
    tl.t = clamp(Math.hypot(x, y) / 60, 0.15, 1) * tilt;
    read.textContent = `${Math.round((tl.t * 180) / Math.PI)}°`;
    L.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; }, destroy: bag.dispose };
}

hairline({
  name: "solarlamp",
  means: "A solar street light: the panel on top of the pole turns and tilts to face the pointer, like a panel tracking the sun.",
  rules: [1, 3, 4, 5],
  range: [0.3, 0.7, 0.9],
  tour: [[221, 305], [74, 284], [326, 284], null],
  mount,
});
