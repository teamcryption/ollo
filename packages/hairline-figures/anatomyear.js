/**
 * Lab burette: a tall glass tube held in a clamp on a stand rod, with a
 * stopcock near its tip. The pointer's place along the bench sets how far the
 * burette rises through its clamp. At rest it sits a little lowered,
 * bright. The slider is the reach of the slide.
 */
const { Cam, fit, facing, proj, rings, prism, put, solid, mk, circ, hull, poly, ringAt, spring, stepS, register, pointer, disposer, unproj, clamp } = HL;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [64, 44, 0], [64, 0, 0], [0, 44, 0], [36, 22, 190], [12, 22, 132]], 200, 156);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 64, 44, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  put(solid(g), prism(P, front, disc(12, 22, 2.4), disc(12, 22, 1.4), 5, 128));
  const clampS = solid(g), [kr, ki] = rings(10, 19, 34, 25, 2, 0.8);
  const tube = solid(g), tip = mk("path", { class: "nf" }, g), cock = mk("path", { class: "nf" }, g);
  const marks = mk("path", { class: "nf lo" }, g);
  tube.sil.classList.add("hi");
  const s = spring(4);
  let last = NaN;
  function draw(dz) {
    if (dz === last) return; last = dz;
    put(clampS, prism(P, front, kr, ki, 66 + dz, 71 + dz));
    put(tube, prism(P, front, disc(36, 22, 5.5), disc(36, 22, 4.5), 30 + dz, 128 + dz));
    tip.setAttribute("d", poly(hull(ringAt(P, disc(36, 22, 5.5, 20), 30 + dz).concat(ringAt(P, disc(36, 22, 1.2, 12), 16 + dz)))));
    const c = ringAt(P, disc(36, 22, 3, 12), 24 + dz), a = P(28, 22, 24 + dz), b = P(44, 22, 24 + dz), a2 = P(28, 22, 27 + dz), b2 = P(44, 22, 27 + dz);
    cock.setAttribute("d", poly(hull(c.concat([a, b, a2, b2]))));
    let d = "";
    for (let k = 0; k < 9; k++) { const z = 44 + k * 9 + dz, p = P(36 + 4, 22 + 3.8, z), q = P(36 + 1.6, 22 + 5.4, z); d += `M${p[0].toFixed(1)},${p[1].toFixed(1)}L${q[0].toFixed(1)},${q[1].toFixed(1)}`; }
    marks.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { s.t = 4; read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    const f = clamp(0.6 + (wx + wy) / 300, 0.6, 1);
    s.t = 4 + f * 60 * reach;
    read.textContent = Math.round(f * 50) + " ml";
    B.wake();
  }
  draw(4); aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "anatomyear",
  means: "A burette in its clamp on a stand: the pointer along the bench raises the tube up through the clamp, stopcock and all.",
  rules: [1, 3, 5, 6],
  range: [20, 70, 100],
  tour: [[205, 101], [205, 160], [205, 226], null],
  mount,
});
