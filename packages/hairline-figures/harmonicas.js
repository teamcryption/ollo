/**
 * Harmonica case: an open case, its lid standing up behind, holding five
 * harmonicas side by side, each with its row of holes along the near side.
 * The pointer picks a harmonica by where it stands: it lifts out of the
 * case and the ones beside it rise a little, staggered from it. At rest one
 * harmonica sits half lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 14, W = 9, LEN = 44, HH = 7, LIFT = 26, FAV = 2, CZ = 5;
const X1 = (N - 1) * STEP + W + 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, -4, 0], [X1, LEN + 8, 0], [X1, -4, 0], [-4, LEN + 8, 0], [-8, -4, 42], [-8, LEN + 8, 42], [X1 - 8, LEN + 4, CZ + HH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the lid, standing up along the back edge
  const [lr, li] = rings(-8, -4, -4, LEN + 8, 1.6, 0.8);
  put(solid(g), prism(P, front, lr, li, 2, 42));
  const [cr, ci] = rings(-4, -4, X1, LEN + 8, 4, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + k * STEP, grp = mk("g", {}, g);
    const s = solid(grp), holes = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, s, holes, z: tween(k === FAV ? LIFT * 0.5 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = CZ + lift, [r, i] = rings(it.x, 2, it.x + W, 2 + LEN, 2, 1);
    put(it.s, prism(P, front, r, i, z0, z0 + HH));
    // the row of holes along the near side
    let d = "";
    for (let h = 0; h < 10; h++) {
      const y = 6 + h * ((LEN - 8) / 9);
      d += open([P(it.x + W, y, z0 + 2.4), P(it.x + W, y + 1.6, z0 + 2.4), P(it.x + W, y + 1.6, z0 + 4.4), P(it.x + W, y, z0 + 4.4), P(it.x + W, y, z0 + 2.4)]);
    }
    it.holes.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, 2 + LEN / 2, CZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.5 : 0) : dd === 0 ? LIFT : dd === 1 ? 7 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "harmonicas",
  means: "An open case of five harmonicas: the one under the pointer lifts out, its neighbours rise a little, staggered.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 164], [232, 201], [257, 214], null],
  mount,
});
