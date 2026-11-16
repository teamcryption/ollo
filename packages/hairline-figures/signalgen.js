/**
 * Logic analyser: the probe clip box, a flat case with a hinged lid and a
 * row of hook clips standing in its foam. The pointer over the case swings
 * the lid open on its back hinge, and the clip under it goes bright. At
 * rest the lid sits ajar, one clip peeking out bright. The slider is how
 * far the lid swings.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, L = 76, D = 40, H = 13, T = 3, X0 = 10, STEP = 14, REST = 24, FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [0, -6, H + D], [L, -6, H + D]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, D, 6, 1.6);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, H));
  mk("path", { class: "nf lo", d: poly(rrect(3, 3, L - 3, D - 3, 4, 4).map((q) => P(q.u, q.v, H))) }, body.g);
  // the clips: a hook body and a plunger cap, standing in the foam
  const clips = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP + (k % 2) * 1.5, y = 15 + (k % 3) * 4;
    const el = solid(g), [r, i] = rings(x, y, x + 6, y + 6, 3, 1);
    put(el, prism(P, front, r, i, H - 2, H + 6 + (k === FAV ? 5 : (k * 7) % 4)));
    clips.push(el);
  }
  const lid = solid(g), ang = tween(REST);
  let last = NaN;
  const ring = rrect(0, 0, L, D, 6, 4);
  function lidAt(a, w) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return ring.map((q) => P(q.u, q.v * c - w * s, H + q.v * s + w * c));
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.sil.setAttribute("d", poly(hull(lidAt(a, 0).concat(lidAt(a, T)))));
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    lid.cr.setAttribute("d", poly(rrect(4, 4, L - 4, D - 4, 4, 4).map((q) => P(q.u, q.v * c - T * s, H + q.v * s + T * c))));
    if (a > 80) body.g.before(lid.g); else g.append(lid.g);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -4 || x > L + 4 || y < -4 || y > D + 4) return -1;
    return clamp(Math.round((x - X0 - 3) / STEP), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? REST : 70 + open * 0.5, performance.now(), 0);
    clips.forEach((el, k) => el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a)));
    read.textContent = a < 0 ? "rest" : "ch " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act >= 0) { act = -3; } }, destroy: bag.dispose };
}

hairline({
  name: "signalgen",
  means: "A logic analyser's probe clip box: the lid swings open on its hinge over the pointer, and the clip under it goes bright.",
  rules: [1, 3, 5, 6],
  range: [0, 60, 100],
  tour: [[119, 184], [198, 223], [238, 243], null],
  mount,
});
