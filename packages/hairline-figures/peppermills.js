/**
 * Pepper mills: four mills of different heights standing in a row on a
 * board, each a round body, a tapered neck, a grinding cap and a knob. The
 * pointer picks a mill by where it stands: it lifts off the board, ready to
 * grind, and the mills beside it rise a little, staggered from it. At rest
 * one mill is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register, put, solid,
} = HL;

const N = 4, STEP = 30, R = 9, BZ = 4, LIFT = 18, FAV = 2;
const HS = [30, 40, 26, 36];
const X1 = (N - 1) * STEP + 2 * R + 8;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [X1, 2 * R + 8, 0], [X1, -4, 0], [-4, 2 * R + 8, 0], [R + 4, R + 4, BZ + 54 + LIFT], [X1 - R, R + 4, BZ + 54 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1, 2 * R + 8, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, y = R + 4, grp = mk("g", {}, g), h = HS[k];
    const body = mk("path", { class: "sil" }, grp), crease = mk("path", { class: "nf lo" }, grp);
    const neck = mk("path", { class: "sil" }, grp), cap = mk("path", { class: "sil" }, grp);
    const groove = mk("path", { class: "nf lo" }, grp), knob = mk("path", { class: "sil" }, grp);
    items.push({ k, x, y, h, body, crease, neck, cap, groove, knob, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  const at = (it, r, z) => ringAt(P, disc(it.x, it.y, r), z);
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + lift, z1 = z0 + it.h, z2 = z1 + 7, z3 = z2 + 8;
    it.body.setAttribute("d", poly(hull(at(it, R, z0).concat(at(it, R, z1)))));
    it.crease.setAttribute("d", poly(at(it, R - 2, z1 - 4)));
    it.neck.setAttribute("d", poly(hull(at(it, R, z1).concat(at(it, 5.5, z2)))));
    it.cap.setAttribute("d", poly(hull(at(it, 7, z2).concat(at(it, 7, z3)))));
    it.groove.setAttribute("d", poly(at(it, 5, z3)));
    it.knob.setAttribute("d", poly(hull(at(it, 2.2, z3).concat(at(it, 2.2, z3 + 3.5)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, BZ + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const el of [it.body, it.neck, it.cap, it.knob]) el.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "mill " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "peppermills",
  means: "Four pepper mills on a board: the mill under the pointer lifts off to grind, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 160], [178, 173], [265, 225], null],
  mount,
});
