/**
 * Salt box: a wooden salt box with a hinged lid on the back edge. The
 * pointer over the box swings the lid up to show the salt inside; at rest
 * the lid sits a little ajar, bright. The slider is how far it opens.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const W = 56, D = 44, H = 30, T = 5, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + D + 4], [W, 0, H + D + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the opening and the salt in it
  const mouth = rrect(4, 4, W - 4, D - 4, 4, 4);
  mk("path", { d: poly(mouth.map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  const salt = [];
  for (const [r, z] of [[1, 0], [0.7, 3], [0.35, 5]]) {
    rrect(W / 2 - (W / 2 - 6) * r, D / 2 - (D / 2 - 6) * r, W / 2 + (W / 2 - 6) * r, D / 2 + (D / 2 - 6) * r, 5 * r, 3).forEach((q) => salt.push(P(q.u, q.v, H - 4 + z)));
  }
  mk("path", { d: poly(hull(salt)), class: "lo" }, g);

  const lid = mk("g", {}, g);
  const sil = mk("path", { class: "sil" }, lid), cr = mk("path", { class: "nf lo" }, lid), knob = mk("path", { class: "nf" }, lid);
  const ring = rrect(-1, -1, W + 1, D + 1, 7, 5), inner = rrect(2, 2, W - 2, D - 2, 5, 5);
  const ang = tween(REST);
  let last = NaN;
  function L(x, y, dz, a) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return P(x, y * c - dz * s, H + y * s + dz * c);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = ring.map((q) => L(q.u, q.v, 0, a)).concat(ring.map((q) => L(q.u, q.v, T, a)));
    sil.setAttribute("d", poly(hull(pts)));
    const face = a < 80 ? T : 0;
    cr.setAttribute("d", poly(inner.map((q) => L(q.u, q.v, face, a))));
    const kn = rrect(W / 2 - 6, D - 9, W / 2 + 6, D - 4, 2, 3);
    knob.setAttribute("d", poly(hull(kn.map((q) => L(q.u, q.v, face, a)).concat(kn.map((q) => L(q.u, q.v, a < 80 ? T + 3 : -3, a))))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? open : REST, performance.now(), 0);
    sil.classList.add("hi");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -8 && x < W + 8 && y > -8 && y < D + 8;
  };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "saltbox",
  means: "A wooden salt box: the pointer over it swings the hinged lid up off the back edge to show the salt inside.",
  rules: [1, 5, 6, 8],
  range: [60, 100, 115],
  tour: [[200, 194], [232, 205], [176, 214], null],
  mount,
});
