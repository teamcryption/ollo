/**
 * Habitat dome: a round habitat on a landing pad, its shell over a low inner
 * module, an airlock tunnel on one side. The pointer over the pad opens it:
 * the shell rises off the module and the airlock reaches out, with the
 * nearness of the pointer setting how far. At rest the airlock is bright.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 38, CZ = 4, LIFT = 30, AL = 26, RIM = 52;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-RIM, -RIM, 0], [RIM, RIM, 0], [RIM + AL + 8, 0, 0], [0, 0, CZ + R * 0.85 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-RIM, -RIM, RIM, RIM, 18, 2);
  put(solid(g), prism(P, front, pr, pi, 0, CZ));
  put(solid(g), prism(P, front, disc(26), disc(23.5), CZ, CZ + 16));
  const shell = mk("path", { class: "sil" }, g), seam = mk("path", { class: "nf lo" }, g), hatch = mk("path", { class: "nf" }, g);
  const tube = solid(g);
  const op = spring(0), ex = spring(0);
  let last = NaN;

  function draw(o, e) {
    const k = r2(o) + "," + r2(e);
    if (k === last) return;
    last = k;
    const base = CZ + o * LIFT, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(R * Math.cos(t), 32), base + R * 0.85 * Math.sin(t))); }
    shell.setAttribute("d", poly(hull(pts)));
    seam.setAttribute("d", poly(ringAt(P, disc(R * 0.55, 32), base + R * 0.85 * 0.83)));
    const top = base + R * 0.85;
    hatch.setAttribute("d", poly(hull(ringAt(P, disc(5, 16), top).concat(ringAt(P, disc(5, 16), top + 2.5)))));
    const x1 = R - 6 + AL * (0.45 + 0.55 * e);
    const [tr, ti] = rings(R - 8, -9, x1, 9, 5, 1.6);
    put(tube, prism(P, front, tr, ti, CZ, CZ + 18));
  }
  const r2 = (n) => Math.round(n * 100) / 100;

  const B = register(stage, (dt) => {
    const a = stepS(op, dt), b = stepS(ex, dt);
    draw(op.x, ex.x);
    return a || b;
  });
  bag.add(B.unregister);

  function set(p) {
    let o = 0;
    if (p) { const [wx, wy] = unproj(C, p[0], p[1], 0); const d = Math.hypot(wx, wy); o = clamp(1.25 - d / (RIM * 1.6), 0, 1) * (0.4 + 0.6 * reach); }
    op.t = o; ex.t = p ? clamp(o * 1.4, 0, 1) : 0.15;
    shell.classList.toggle("hi", o > 0.05);
    tube.sil.classList.toggle("hi", o <= 0.05);
    read.textContent = o > 0.05 ? "open " + Math.round(o * 100) : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "marsdome",
  means: "A habitat dome on a pad: the pointer near it lifts the shell off the inner module and runs the airlock tunnel out.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[82, 157], [142, 188], [142, 241], null],
  mount,
});
