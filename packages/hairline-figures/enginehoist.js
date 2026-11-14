/**
 * Engine hoist: a workshop crane on two wheeled rails, a mast, a boom pushed
 * up by a ram, and an engine block hanging from the boom's hook. The pointer's
 * height is the ram's stroke: the boom swings up or down and the engine rises
 * or sinks with it. At rest the block hangs low, the hook bright. The slider
 * is the rest angle.
 *
 * The pattern: one arm lifting by the pointer's height (lever).
 */
const {
  Cam, circ, fit, hull, open, poly, prism, proj, rings, ringAt, seg, clamp, rad,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing, flatDot, place,
} = HL;

const MZ = 62, BL = 66, EW = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-14, -16, 0], [72, 16, 0], [BL * Math.cos(rad(42)), 0, MZ + BL * Math.sin(rad(42)) + 4], [BL, 12, MZ - BL * 0.4 - 40], [-14, 0, MZ + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const rail = (y) => { const [r, i] = rings(-12, y - 2.5, 70, y + 2.5, 2.5, 0.8); put(solid(g), prism(P, front, r, i, 2, 5)); for (const x of [-8, 64]) { const [w, wi] = rings(x - 2.4, y - 2.4, x + 2.4, y + 2.4, 2.4, 0.7); put(solid(g), prism(P, front, w, wi, 0, 2)); } };
  rail(-13);
  const [mr, mi] = rings(-3, -3, 3, 3, 1.5, 0.8);
  put(solid(g), prism(P, front, mr, mi, 5, MZ + 3));
  const ram = mk("path", { class: "nf" }, g);
  const boom = solid(g), chain = mk("path", { class: "nf lo" }, g), eng = solid(g), cover = mk("path", { class: "nf lo" }, g);
  const hook = flatDot(g, C, 2.6, "dot");
  rail(13);
  const [er, ei] = rings(-EW, -9, EW, 9, 3, 1.4), [cr] = rings(-EW + 3, -6, EW - 3, 6, 2, 1);
  const A = spring(restA);
  let last = NaN, act = false;

  function draw() {
    const a = A.x;
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const tx = BL * c, tz = MZ + BL * s;
    const bar = (x0, z0, x1, z1, r) => hull(circ(r, 12).flatMap((q) => [P(x0, q.u, z0 + q.v), P(x1, q.u, z1 + q.v)]));
    boom.sil.setAttribute("d", poly(bar(-6 * c, MZ - 6 * s, tx, tz, 2.4)));
    ram.setAttribute("d", seg(P(0, 0, 22), P(30 * c, 0, MZ + 30 * s)));
    const top = tz - 16, bot = top - 22;
    chain.setAttribute("d", open([P(tx, 0, tz - 2), P(tx, 0, top + 6)]) + " " + seg(P(tx, 0, top + 6), P(tx - 8, 0, top)) + seg(P(tx, 0, top + 6), P(tx + 8, 0, top)));
    const ring = er.map((q) => ({ ...q, u: q.u + tx })), inner = ei.map((q) => ({ ...q, u: q.u + tx }));
    put(eng, prism(P, front, ring, inner, bot, top));
    cover.setAttribute("d", poly(ringAt(P, cr.map((q) => ({ ...q, u: q.u + tx })), top + 2.5)));
    place(hook, P(tx, 0, tz - 2));
    read.textContent = act ? Math.round(a) + "°" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);
  function setActive(on, a) {
    act = on; A.t = a;
    eng.sil.classList.toggle("hi", on);
    hook.setAttribute("class", on ? "dot off" : "dot");
    last = NaN; B.wake();
  }
  setActive(false, restA);
  draw();
  bag.add(pointer(stage, {
    move: ([, sy]) => setActive(true, clamp(42 - ((sy - 50) / 220) * 64, -22, 42)),
    leave: () => setActive(false, restA),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (!act) setActive(false, v); }, destroy: bag.dispose };
}

hairline({
  name: "enginehoist",
  means: "A workshop engine hoist: the boom swings up or down with the pointer's height, lifting the hanging engine block.",
  rules: [1, 3, 4, 5],
  range: [-15, -5, 10],
  tour: [[246, 48], [230, 215], [246, 9], null],
  mount,
});
