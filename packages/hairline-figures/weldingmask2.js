/**
 * Welding masks: three masks hang on pegs along a workshop rack. The pointer
 * picks a mask by where it stands: it lifts off its peg and its dark lens
 * flips up, and the masks beside it rise a little, staggered from it. At rest
 * one mask is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, W = 17, D = 14, H0 = 14, H1 = 58, LIFT = 12, FAV = 2;
const X1 = (N - 1) * STEP + 2 * W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -8, 0], [X1 + 6, -8, 0], [X1 + 6, D + 4, 0], [-6, D + 4, 0], [-6, -8, 78], [X1 + 6, -8, 78], [X1, D + 2, H1 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rack: a board on the wall and a shelf foot
  const [br, bi] = rings(-6, -8, X1 + 6, -3, 2, 1);
  put(solid(g), prism(P, front, br, bi, 0, 78));
  const [fr, fi] = rings(-6, -8, X1 + 6, D + 4, 4, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = W + k * STEP, grp = mk("g", {}, g);
    // the peg
    const [pr, pi] = rings(x - 2.5, -3, x + 2.5, 5, 2.4, 0.8);
    put(solid(grp), prism(P, front, pr, pi, H1 - 4, H1));
    const shell = solid(grp), lens = mk("path", { class: "" }, grp), band = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, shell, lens, band, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const x = it.x, z0 = H0 + lift, z1 = H1 + lift;
    const [sr, si] = rings(x - W, 0, x + W, D, 9, 1.8);
    put(it.shell, prism(P, front, sr, si, z0, z1));
    // the lens: a dark window on the front face, flipping up on its top hinge
    const f = lift / LIFT, a = f * 1.25, hz = z0 + 31, hy = D, L = 11;
    const ty = hy + L * Math.sin(a), tz = hz - L * Math.cos(a);
    it.lens.setAttribute("d", poly([P(x - 9, hy, hz), P(x + 9, hy, hz), P(x + 9, ty, tz), P(x - 9, ty, tz)]));
    it.band.setAttribute("d", poly([P(x - 12, D, z0 + 34), P(x + 12, D, z0 + 34), P(x + 12, D, z0 + 37), P(x - 12, D, z0 + 37)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, D / 2, (H0 + H1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.shell.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "mask " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "weldingmask2",
  means: "Welding masks on a rack: the mask under the pointer lifts off its peg and flips its dark lens up.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 143], [198, 172], [254, 200], null],
  mount,
});
