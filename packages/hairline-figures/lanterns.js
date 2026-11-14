/**
 * Lanterns: four camping lanterns of different heights standing on a plank,
 * each a base, a glass with its flame, a peaked cap and a wire bail. The
 * pointer picks a lantern by where it stands: it is lifted by its bail, and
 * the lanterns beside it rise a little, staggered from it. At rest one
 * lantern hangs raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, R = 10, LIFT = 22, FAV = 2, CZ = 4, HS = [1, 0.84, 1.12, 0.92];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-8, -8, 0], [X1 + 8, 2 * R + 8, 0], [X1 + 8, -8, 0], [-8, 2 * R + 8, 0], [R, R, CZ + 38 + LIFT], [X1 - R, R, CZ + 38 + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-8, -8, X1 + 8, 2 * R + 8, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), lines = mk("path", { class: "nf lo" }, grp), bail = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, h: HS[k], body, lines, bail, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  const restZ = (k) => (k === FAV ? LIFT * 0.7 : 0);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y, h } = it, b = CZ + lift, gt = b + 3 + 15 * h, ct = gt + 6 * h;
    const base = disc(x, y, 9), glass = disc(x, y, 7), brim = disc(x, y, 9.5), cap = disc(x, y, 3, 16);
    it.body.setAttribute("d", poly(hull([].concat(ringAt(P, base, b), ringAt(P, base, b + 3), ringAt(P, glass, gt), ringAt(P, brim, gt), ringAt(P, cap, ct)))));
    const fl = disc(x, y, 1.6, 12), fz = b + 3 + 6 * h;
    let d = open(ringAt(P, run(base, front), b + 3)) + " " + open(ringAt(P, run(brim, front), gt));
    for (const a of [-0.55, 0.55]) {
      const u = x + 7 * Math.cos(Math.PI / 4 + a), v = y + 7 * Math.sin(Math.PI / 4 + a);
      d += " " + open([P(u, v, b + 3), P(u, v, gt)]);
    }
    d += " " + poly(hull(ringAt(P, fl, fz).concat(ringAt(P, disc(x, y, 0.4, 6), fz + 5 * h))));
    it.lines.setAttribute("d", d);
    const arc = [];
    for (let i = 0; i <= 16; i++) { const t = Math.PI * (i / 16); arc.push(P(x - 7 * Math.cos(t), y, ct - 3 + 10 * Math.sin(t))); }
    it.bail.setAttribute("d", open(arc));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + 12));
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
      const dd = Math.abs(k - a), z = a < 0 ? restZ(k) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lamp " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lanterns",
  means: "Four camping lanterns on a plank: the one under the pointer is lifted by its bail, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 150], [223, 192], [267, 214], null],
  mount,
});
