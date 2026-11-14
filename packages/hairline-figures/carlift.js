/**
 * Car lift: a two-post garage lift with a car on its platform. The pointer's
 * height over the lift sets how high the platform rides, on a spring; the car
 * rises with it. At rest the car sits a little off the floor, the platform
 * bright. The slider is the lift's top.
 *
 * The pattern: one part following a continuous input (spring).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 12, TOP = 60;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-54, -40, 0], [54, 30, 0], [54, -40, 0], [-54, 30, 0], [-40, -34, 82], [0, 0, TOP + 36]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-54, -40, 54, 30, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  for (const x of [-42, 42]) {
    const [r, i] = rings(x - 5, -38, x + 5, -28, 3, 1);
    put(solid(g), prism(P, front, r, i, 3, 82));
  }
  const arms = [-42, 42].map(() => solid(g));
  const plat = solid(g), body = solid(g), cab = solid(g);
  const wheels = [[-26, 20], [26, 20]].map(() => mk("path", { class: "nf" }, g));
  plat.sil.classList.add("hi");
  const [pr, pi] = rings(-48, -24, 48, 24, 4, 1.4);
  const [cr, ci] = rings(-42, -18, 42, 18, 9, 2);
  const [ar, ai] = rings(-4, -30, 4, -22, 1.5, 0.8);
  const foot = rrect(-24, -16, 18, 16, 6, 4), cTop = rrect(-16, -14, 10, 14, 5, 4), cIn = rrect(-15, -13, 9, 13, 4, 4);

  const h = spring(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    arms.forEach((s, k) => { const x = k ? 42 : -42; put(s, prism(P, front, ar.map((q) => ({ ...q, u: q.u + x })), ai.map((q) => ({ ...q, u: q.u + x })), 3 + z, 6 + z)); });
    put(plat, prism(P, front, pr, pi, 3 + z, 6 + z));
    put(body, prism(P, front, cr, ci, 9 + z, 21 + z));
    put(cab, { sil: poly(hull(ringAt(P, foot, 21 + z).concat(ringAt(P, cTop, 32 + z)))), crease: open(ringAt(P, run(cIn, front), 32 + z)) });
    wheels.forEach((w, k) => {
      const x = k ? 26 : -26, pts = [];
      for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push(P(x + 6 * Math.cos(a), 18.5, 12 + z + 6 * Math.sin(a))); }
      w.setAttribute("d", poly(pts));
    });
  }

  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(h.x); return m; });
  bag.add(B.unregister);

  const yLo = P(0, 0, 0)[1], yHi = P(0, 0, top + 30)[1];
  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 120) return leave();
    h.t = clamp(((yLo - sy) / (yLo - yHi)) * top, 0, top);
    read.textContent = "lift " + Math.round((h.t / top) * 100) + "%";
    B.wake();
  }
  function leave() { h.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; }, destroy: bag.dispose };
}

hairline({
  name: "carlift",
  means: "A two-post lift with a car on its platform: the platform follows the pointer's height and the car rises with it.",
  rules: [3, 5, 8],
  range: [30, 45, 60],
  tour: [[194, 212], [194, 110], [194, 164], null],
  mount,
});
