/**
 * Cargotrain: four flat wagons on a rail line, each carrying a container.
 * The pointer picks a wagon by where it stands: its container is hoisted off
 * the deck, and the containers beside it rise a little, staggered from it.
 * At rest one container is half lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 46, L = 40, W = 18, DZ = 8, CH = 16, LIFT = 26, FAV = 2;
const X1 = (N - 1) * STEP + L;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-8, -6, 0], [X1 + 8, W + 6, 0], [X1 + 8, -6, 0], [-8, W + 6, 0], [0, 0, DZ + CH + LIFT + 2], [X1, W, DZ + CH + LIFT + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // rails and sleepers
  let rd = "";
  for (let x = -8; x <= X1 + 8; x += 8) rd += seg(P(x, 1, 0), P(x, W - 1, 0));
  mk("path", { d: rd, class: "nf lo" }, g);
  mk("path", { d: seg(P(-8, 4, 0.5), P(X1 + 8, 4, 0.5)) + seg(P(-8, W - 4, 0.5), P(X1 + 8, W - 4, 0.5)), class: "nf" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    for (const bx of [x0 + 5, x0 + L - 13]) {
      const [br, bi] = rings(bx, 3, bx + 8, W - 3, 2, 1);
      put(solid(grp), prism(P, front, br, bi, 0.5, DZ - 2));
    }
    const [dr, di] = rings(x0, 0, x0 + L, W, 2, 1.2);
    put(solid(grp), prism(P, front, dr, di, DZ - 2, DZ));
    const box = solid(grp);
    box.sil.classList.add("sil");
    const [cr, ci] = rings(x0 + 2, 1, x0 + L - 2, W - 1, 2.5, 1.6);
    items.push({ k, x0, grp, box, cr, ci, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    put(it.box, prism(P, front, it.cr, it.ci, DZ + lift, DZ + CH + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + L / 2, W / 2, DZ + CH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.box.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "wagon " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cargotrain",
  means: "Four flat wagons with containers: the wagon under the pointer has its container hoisted, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[120, 140], [174, 167], [280, 215], null],
  mount,
});
