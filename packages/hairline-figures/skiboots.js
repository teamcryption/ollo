/**
 * Ski boots: four boots standing on a drying rack, each a sole and toe box
 * with a tall cuff. The pointer picks a boot by where it stands: it lifts
 * off its peg, the boots beside it lift a little, staggered from it. At
 * rest one boot hangs raised, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, hull, poly, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const N = 4, STEP = 30, RZ = 6, LIFT = 26, FAV = 1, X1 = (N - 1) * STEP + 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-6, -8, 0], [X1 + 6, 44, 0], [X1 + 6, -8, 0], [-6, 44, 0], [10, 10, RZ + 48 + LIFT], [X1 - 10, 10, RZ + 48 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -8, X1 + 6, 44, 5, 2);
  const base = solid(g);
  base.sil.setAttribute("d", poly(hull(ringAt(P, br, 0).concat(ringAt(P, br, RZ)))));
  base.cr.setAttribute("d", poly(ringAt(P, bi, RZ)));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 6 + k * STEP, grp = mk("g", {}, g);
    const foot = solid(grp), cuff = solid(grp), buckle = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, foot, cuff, buckle, z: tween(k === FAV ? LIFT * 0.7 : k === 3 ? 4 : 0), last: NaN });
  }
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const z0 = RZ + h, x = it.x;
    // the shell: a long toe box under a tall cuff at the heel
    const [fr, fi] = rings(x, 0, x + 20, 36, 7, 1.6);
    it.foot.sil.setAttribute("d", poly(hull(ringAt(P, fr, z0).concat(ringAt(P, fr, z0 + 12)))));
    it.foot.cr.setAttribute("d", poly(ringAt(P, fi, z0 + 12)));
    const [cr, ci] = rings(x + 1, 0, x + 19, 18, 6, 1.6);
    it.cuff.sil.setAttribute("d", poly(hull(ringAt(P, cr, z0 + 12).concat(ringAt(P, cr, z0 + 44)))));
    it.cuff.cr.setAttribute("d", poly(ringAt(P, ci, z0 + 44)));
    const a = P(x + 20, 4, z0 + 22), b = P(x + 20, 14, z0 + 22), c = P(x + 20, 4, z0 + 32), d = P(x + 20, 14, z0 + 32);
    it.buckle.setAttribute("d", "M" + a + "L" + b + "M" + c + "L" + d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + 10, 18, RZ + 22));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : k === 3 ? 4 : 0) : dd === 0 ? LIFT : dd === 1 ? 7 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.foot.sil.classList.toggle("hi", on); it.cuff.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "boot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "skiboots",
  means: "Four ski boots on a drying rack: the boot under the pointer lifts off its peg, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[130, 141], [264, 209], [185, 165], null],
  mount,
});
