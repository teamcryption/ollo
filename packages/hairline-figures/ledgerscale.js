/**
 * Balance beam: a merchant's scale, a post on a foot with a beam across it
 * and a pan hung from each end. The pointer picks a side: the beam tilts
 * that way and its pan drops, bright. At rest the beam leans a little left.
 * The slider is the tilt.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer, rad } = HL;
const L = 55, H = 70, D = 32, R = 17;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-L - R, -R, 14], [L + R, R, 14], [-L - R, R, 64], [L + R, -R, 64], [0, 0, H + 6], [-30, -20, 0], [30, 20, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -20, 30, 20, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const panL = solid(g), strL = mk("path", { class: "nf" }, g);
  const [pr, pi] = rings(-3.5, -3.5, 3.5, 3.5, 2, 0.8);
  put(solid(g), prism(P, front, pr, pi, 6, H - 2));
  const beam = mk("path", { class: "sil" }, g), cap = mk("path", { class: "nf" }, g);
  const panR = solid(g), strR = mk("path", { class: "nf" }, g);
  const th = tween(-7);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const tf = ([x, y, z]) => P(x * c + z * s, y, H - x * s + z * c);
    const pts = [];
    for (const x of [-L - 3, L + 3]) for (const y of [-2.5, 2.5]) for (const z of [-2.5, 2.5]) pts.push(tf([x, y, z]));
    beam.setAttribute("d", poly(hull(pts)));
    cap.setAttribute("d", poly([[-L - 3, -2.5, 2.5], [L + 3, -2.5, 2.5], [L + 3, 2.5, 2.5], [-L - 3, 2.5, 2.5]].map(tf)));
    for (const [sd, pan, str] of [[-1, panL, strL], [1, panR, strR]]) {
      const ex = sd * L * c, ez = H - sd * L * s, z0 = ez - D;
      put(pan, prism(P, front, disc(ex, 0, R), disc(ex, 0, R - 3), z0, z0 + 4));
      const top = P(ex, 0, ez);
      let d = "";
      for (const [dx, dy] of [[-R + 1, 0], [R - 1, 0], [0, R - 1], [0, -R + 1]]) { const b = P(ex + dx, dy, z0 + 4); d += `M${top[0]},${top[1]}L${b[0]},${b[1]}`; }
      str.setAttribute("d", d);
    }
  }

  const B = register(stage, (_dt, now) => { draw(tval(th, now)); return !tdone(th, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, H)[0];
  let act = 0;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(th, a === 0 ? -7 : a * amp, performance.now(), 0);
    const lit = a === 0 ? -1 : a;
    panL.sil.classList.toggle("hi", lit < 0);
    panR.sil.classList.toggle("hi", lit > 0);
    read.textContent = a === 0 ? "rest" : a < 0 ? "left" : "right";
    B.wake();
  }
  act = 2; setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid) < 12 || Math.abs(sx - mid) > 170 || sy < 10 || sy > 310 ? 0 : sx < mid ? -1 : 1), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { tset(th, act * amp, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "ledgerscale",
  means: "A merchant's balance beam: the pointer picks a side and the beam tilts, dropping that pan.",
  rules: [1, 3, 4, 5],
  range: [6, 16, 22],
  tour: [[280, 186], [120, 97], [280, 186], null],
  mount,
});
