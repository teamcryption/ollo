/**
 * Slide box: an open box of glass slides standing in slots, each with a
 * dim specimen mark. The pointer picks a slide by where it stands: it
 * slides up out of its slot, and the slides beside it rise a little,
 * staggered from it. At rest one slide is raised, bright. The slider is
 * the stagger.
 *
 * The pattern: items popping up from slots (toaster).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 14, T = 3, L = 52, SH = 40, BH = 28, LIFT = 30, FAV = 3;
const X1 = N * STEP + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [X1 + 4, L + 10, 0], [X1 + 4, -4, 0], [-4, L + 10, 0], [10, 3, SH + LIFT + 4], [X1 - 8, 3, SH + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, L + 10, 4, 1.6);
  const back = mk("g", {}, g);
  put(solid(back), prism(P, front, br, bi, 0, 3));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = 6 + k * STEP, grp = mk("g", {}, g), s = solid(grp), spot = mk("path", { class: "nf lo" }, grp);
    const [sr, si] = rings(x0, 3, x0 + T, 3 + L, 0.8, 0.5);
    items.push({ k, x0, s, sr, si, spot, z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN });
  }
  // the box's front wall, low, hiding the slides' feet
  const [fr, fi] = rings(-4, L + 4, X1 + 4, L + 10, 2, 1);
  put(solid(g), prism(P, front, fr, fi, 0, BH));
  const [er, ei] = rings(X1 - 2, -4, X1 + 4, L + 10, 2, 1);
  put(solid(g), prism(P, front, er, ei, 0, BH));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    put(it.s, prism(P, front, it.sr, it.si, 3 + lift, 3 + SH + lift));
    const a = P(it.x0 + T, 3 + L * 0.3, 3 + SH * 0.7 + lift), b = P(it.x0 + T, 3 + L * 0.55, 3 + SH * 0.78 + lift);
    const c = P(it.x0 + T, 3 + L * 0.55, 3 + SH * 0.6 + lift), d = P(it.x0 + T, 3 + L * 0.3, 3 + SH * 0.52 + lift);
    it.spot.setAttribute("d", poly([a, b, c, d]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + T / 2, 3 + L / 2, SH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 8 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slide " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "microscopeslides",
  means: "A box of glass slides in slots: the slide under the pointer slides up out of the box, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[145, 161], [188, 183], [249, 213], null],
  mount,
});
