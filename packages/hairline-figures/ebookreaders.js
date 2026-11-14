/**
 * E-readers: four thin reading slates standing in the slots of a desk stand,
 * each with an inset screen and a page button. The pointer picks a slate by
 * where it stands: it slides up out of its slot, and the slates beside it
 * rise a little, staggered from it. At rest one slate is half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 17, T = 3.4, W = 34, H = 46, LIFT = 20, FAV = 2, BZ = 8;
const X0 = 6, X1 = X0 + (N - 1) * STEP + T + 6;
const REST = [3, 0, LIFT * 0.6, 1.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, -4, 0], [X1, W + 4, 0], [X1, -4, 0], [0, W + 4, 0], [X0, 0, BZ + H + LIFT], [X1, W, BZ + H + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the stand: a low block with one slot per slate
  const [br, bi] = rings(0, -4, X1, W + 4, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const slots = mk("path", { class: "nf lo" }, g);
  let sd = "";
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    sd += poly([P(x - 0.8, 1, BZ), P(x + T + 0.8, 1, BZ), P(x + T + 0.8, W - 1, BZ), P(x - 0.8, W - 1, BZ)]);
  }
  slots.setAttribute("d", sd);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g), s = solid(grp);
    const scr = mk("path", { class: "nf lo" }, grp), btn = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, s, scr, btn, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ - 6 + lift, z1 = z0 + H, x = it.x, f = x + T;
    const [r, ri] = rings(x, 0, f, W, 1.6, 0.7);
    put(it.s, prism(P, front, r, ri, z0, z1));
    it.scr.setAttribute("d", poly([P(f, 4, z0 + 9), P(f, W - 4, z0 + 9), P(f, W - 4, z1 - 4), P(f, 4, z1 - 4)]));
    it.btn.setAttribute("d", seg(P(f, W / 2 - 4, z0 + 4.5), P(f, W / 2 + 4, z0 + 4.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + T, W / 2, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ebookreaders",
  means: "Four e-readers in a desk stand: the slate under the pointer slides up out of its slot, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[152, 115], [187, 132], [249, 161], null],
  mount,
});
