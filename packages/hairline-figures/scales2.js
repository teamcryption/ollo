/**
 * Kitchen scale: a mixing bowl on a weighing platform over a rounded base
 * with a dial on its front face. The pointer's place across the frame is the
 * load: the bowl sinks on the platform and the needle swings round the dial.
 * At rest a little load sits in the bowl and the needle is bright.
 * The slider is the bowl's travel.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 60, Y1 = 60, BZ = 20, CX = 30, CY = 30, REST = 0.3;
const disc = (r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + CX, v: q.v + CY }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [CX - 30, CY, BZ + 42], [CX + 30, CY, BZ + 42], [CX, CY - 30, BZ + 42], [CX, CY + 30, BZ + 42]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the dial on the front face (y = Y1), a ring of tick dots and a needle
  const DZ = 10, DR = 7.5, dial = [];
  for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; dial.push(P(CX + DR * Math.sin(a), Y1, DZ + DR * Math.cos(a))); }
  mk("path", { d: poly(dial), class: "nf" }, g);
  for (let i = 0; i <= 6; i++) {
    const a = -2.2 + (i / 6) * 4.4, p = P(CX + (DR - 1.6) * Math.sin(a), Y1, DZ + (DR - 1.6) * Math.cos(a));
    mk("circle", { cx: p[0], cy: p[1], r: 0.9, class: "dot off" }, g);
  }
  const needle = mk("path", { class: "sil nf" }, g);
  const hubP = P(CX, Y1, DZ);
  mk("circle", { cx: hubP[0], cy: hubP[1], r: 1.4, class: "dot m" }, g);
  const plat = solid(g), bowl = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf lo" }, g);
  const load = mk("path", { class: "nf lo" }, g);

  const w = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const dz = -v * 10 * (travel / 50);
    const z0 = BZ + 6 + dz;
    put(plat, prism(P, front, disc(18), disc(16), BZ + 1 + dz, BZ + 3 + dz));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(...ringAt(P, disc(12 + 17 * (1 - (1 - t) * (1 - t)), 40), z0 - 3 + 22 * t)); }
    bowl.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringAt(P, disc(27.5, 48), z0 + 18.6)));
    load.setAttribute("d", poly(ringAt(P, disc(14 + 10 * v, 40), z0 + 4 + 12 * v)));
    const a = -2.2 + 4.4 * v;
    needle.setAttribute("d", open([hubP, P(CX + (DR - 1) * Math.sin(a), Y1, DZ + (DR - 1) * Math.cos(a))]));
  }

  const B = register(stage, (dt) => { const m = stepS(w, dt); draw(w.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function set(p) {
    act = p ? clamp((p[0] - 70) / 260, 0, 1) : null;
    w.t = act === null ? REST : act;
    bowl.classList.toggle("hi", act !== null);
    needle.classList.toggle("hi", act === null);
    read.textContent = act === null ? "rest" : Math.round(act * 2000) + " g";
    B.wake();
  }
  set(null);
  draw(REST);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v; last = NaN; draw(w.x); }, destroy: bag.dispose };
}

hairline({
  name: "scales2",
  means: "A kitchen scale: the pointer across the frame is the load, so the bowl sinks on its platform and the dial's needle swings round.",
  rules: [3, 4, 5, 8],
  range: [20, 50, 80],
  tour: [[200, 113], [90, 203], [310, 226], null],
  mount,
});
