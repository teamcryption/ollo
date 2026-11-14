/**
 * Car mats: four rubber floor mats in a stepped stack, each one set a little
 * back from the one under it, ribs across their tops. The mat under the
 * pointer slides out of the stack toward the viewer, the mats beside it
 * shift a little, staggered from it. At rest one mat is half out, bright.
 * The slider is the stagger.
 *
 * The pattern: stepped parts picked on their own rest tops.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 72, D = 44, T = 4, BACK = 11, OUT = 30, FAV = 1, R = 9;
const mats = Array.from({ length: N }, (_, k) => ({ k, x: [0, 3, -2, 2][k], y: -k * BACK, z: k * T }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -N * BACK, 0], [W + 4, D + OUT, 0], [W + 4, -N * BACK, N * T], [-4, D + OUT, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = mats.map((m) => {
    const grp = mk("g", {}, g), body = solid(grp), ribs = mk("path", { class: "nf lo" }, grp), heel = mk("path", { class: "nf lo" }, grp);
    return { ...m, body, ribs, heel, s: tween(m.k === FAV ? OUT * 0.55 : 0), last: NaN };
  });

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const y0 = it.y + s, z1 = it.z + T, x0 = it.x;
    const [ring, inner] = rings(x0, y0, x0 + W, y0 + D, R, 2);
    put(it.body, prism(P, front, ring, inner, it.z, z1));
    let d = "";
    for (let j = 1; j <= 6; j++) d += seg(P(x0 + 6 + j * 8, y0 + 7, z1), P(x0 + 6 + j * 8, y0 + D - 7, z1));
    it.ribs.setAttribute("d", d);
    it.heel.setAttribute("d", open([P(x0 + 8, y0 + 8, z1), P(x0 + 8, y0 + D - 8, z1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // pick on each mat's own rest top, highest first
  function hit([sx, sy]) {
    for (let k = N - 1; k >= 0; k--) {
      const m = mats[k], [wx, wy] = unproj(C, sx, sy, m.z + T);
      if (wx > m.x - 2 && wx < m.x + W + 2 && wy > m.y - 2 && wy < m.y + D + 2) return k;
    }
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "mat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "carmats",
  means: "A stepped stack of four ribbed car mats: the mat under the pointer slides out toward you, its neighbours shift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[154, 180], [176, 160], [283, 89], null],
  mount,
});
