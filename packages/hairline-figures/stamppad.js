/**
 * Rubber stamps: four stamps standing on a wooden rack, each a rubber sole,
 * a block, a neck and a round knob, with an ink pad in front. The pointer
 * picks a stamp by where it stands: it lifts off the rack to show its sole,
 * and the stamps beside it rise a little, staggered from it. At rest one
 * stamp is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, RZ = 4, LIFT = 18, FAV = 2, Y = 15;
const X1 = (N - 1) * STEP + 30;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [X1, 72, 0], [X1, 0, 0], [0, 72, 0], [15, Y, RZ + LIFT + 32], [X1 - 15, Y, RZ + LIFT + 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ro, ri] = rings(0, 0, X1, 30, 4, 1.6);
  put(solid(g), prism(P, front, ro, ri, 0, RZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 15 + k * STEP, grp = mk("g", {}, g);
    items.push({ k, x, grp, sole: solid(grp), block: solid(grp), neck: solid(grp), knob: mk("path", { class: "sil" }, grp), z: tween(k === FAV ? LIFT * 0.7 : k === 0 ? 3 : 0), last: NaN });
  }
  // the ink pad: a shallow tin with the inked felt set into its top
  const [po, pi] = rings(12, 40, X1 - 12, 72, 4, 1.5);
  put(solid(g), prism(P, front, po, pi, 0, 6));
  const [fo] = rings(17, 45, X1 - 17, 67, 2.5, 1);
  mk("path", { d: poly(ringAt(P, fo, 6)), class: "nf lo" }, g);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const x = it.x, z = RZ + lift;
    let [o, i] = rings(x - 9.5, Y - 6.5, x + 9.5, Y + 6.5, 1.5, 1);
    put(it.sole, prism(P, front, o, i, z, z + 1.6));
    [o, i] = rings(x - 11, Y - 8, x + 11, Y + 8, 2.5, 1.4);
    put(it.block, prism(P, front, o, i, z + 1.6, z + 9));
    put(it.neck, prism(P, front, disc(x, Y, 3.2), disc(x, Y, 2.4), z + 9, z + 19));
    const pts = [];
    for (let j = -3; j <= 3; j++) { const t = (j / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, Y, 6.5 * Math.cos(t) + 0.5, 24), z + 25 + 6 * Math.sin(t))); }
    it.knob.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, RZ + 15));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : k === 0 ? 3 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.block.sil.classList.toggle("hi", on);
      it.knob.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "stamp " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "stamppad",
  means: "Four rubber stamps on a rack by an ink pad: the stamp under the pointer lifts to show its sole, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[169, 130], [208, 149], [284, 187], null],
  mount,
});
