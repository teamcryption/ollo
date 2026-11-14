/**
 * Grain sacks: four filled sacks on a pallet, each bellied, tied at the neck
 * with a tuft above the tie. The sack under the pointer is hoisted off the
 * pallet, its neighbours rise a little, staggered from it. At rest one sack
 * hangs a little raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, PZ = 5, LIFT = 22, FAV = 1, H = 30;
const REST = [0, 10, 1, 3];
const X1 = (N - 1) * STEP + 28;
const box = (x, y, w, d, r) => rrect(x - w, y - d, x + w, y + d, r, 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-3, -3, 0], [X1 + 3, 31, 0], [X1 + 3, -3, 0], [-3, 31, 0], [14, 14, PZ + H + 8 + LIFT], [X1 - 14, 14, PZ + H + 8 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-3, -3, X1 + 3, 31, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 14 + k * STEP, y = 14, grp = mk("g", {}, g);
    const body = solid(grp), tuft = solid(grp), tie = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, body, tuft, tie, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = PZ + lift, { x, y } = it;
    const foot = box(x, y, 11, 10, 7), belly = box(x, y, 13, 12, 9), neck = box(x, y, 3, 3, 3);
    const pts = ringAt(P, foot, z0).concat(ringAt(P, belly, z0 + 11), ringAt(P, box(x, y, 9, 8, 7), z0 + H - 6), ringAt(P, neck, z0 + H));
    put(it.body, { sil: poly(hull(pts)), crease: open(ringAt(P, run(box(x, y, 11.5, 10.5, 8), front), z0 + 11)) });
    put(it.tuft, { sil: poly(hull(ringAt(P, box(x, y, 2.2, 2.2, 2.2), z0 + H).concat(ringAt(P, box(x, y, 4.5, 4, 4), z0 + H + 7)))), crease: "" });
    it.tie.setAttribute("d", open(ringAt(P, run(box(x, y, 3.4, 3.4, 3.4), front), z0 + H + 1.2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, PZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.body.sil.classList.toggle("hi", on);
      it.tuft.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "sack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "grainsacks",
  means: "Four tied grain sacks on a pallet: the sack under the pointer is hoisted off, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[221, 173], [138, 131], [262, 194], null],
  mount,
});
