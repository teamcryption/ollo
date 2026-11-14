/**
 * Kilns: three round top-loading kilns on a fired-brick pad, each with a
 * hinged lid and a banded wall. The pointer picks a kiln by where it stands:
 * its lid swings up on the back hinge, and the kilns beside it crack their
 * lids, staggered from it. At rest one lid is propped open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, R = 17, STEP = 44, H = 30, PZ = 4, OPEN = 72, FAV = 1;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-7, -7, 0], [X1 + 7, 2 * R + 7, 0], [X1 + 7, -7, 0], [-7, 2 * R + 7, 0], [R, 0, PZ + H + 2 * R], [X1 - R, 0, PZ + H + 2 * R]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-7, -7, X1 + 7, 2 * R + 7, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.6), PZ, PZ + H));
    // the bands round the wall and the peep hole on its face
    for (const z of [PZ + H * 0.35, PZ + H * 0.7]) mk("path", { d: open(ringAt(P, disc(x, y, R, 40), z).filter((_, i) => front(disc(x, y, R, 40)[i]))), class: "nf lo" }, grp);
    mk("path", { d: poly(ringAt(P, disc(x, y, R - 3.2, 36), PZ + H)), class: "nf lo" }, grp);
    const pp = P(x + R * 0.72, y + R * 0.7, PZ + H * 0.52);
    mk("ellipse", { cx: pp[0], cy: pp[1], rx: 2, ry: 1.4, class: "nf" }, grp);
    const lid = mk("path", { class: "sil" }, grp), lc = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, lid, lc, a: tween(k === FAV ? 34 : 0), last: NaN });
  }

  // the lid turns about a hinge on its back edge (y - R) at the rim
  function lidRing(it, ang, r, dz) {
    const c = Math.cos(rad(ang)), s = Math.sin(rad(ang)), top = PZ + H + 0.4, hy = it.y - R;
    return disc(it.x, it.y, r, 40).map((q) => { const d = q.v - hy; return P(q.u, hy + d * c - dz * s, top + d * s + dz * c); });
  }
  function draw(it, ang) {
    if (ang === it.last) return;
    it.last = ang;
    it.lid.setAttribute("d", poly(hull(lidRing(it, ang, R + 1, 0).concat(lidRing(it, ang, R + 1, 3.2)))));
    it.lc.setAttribute("d", poly(hull(lidRing(it, ang, 3, 3.2).concat(lidRing(it, ang, 3, 5.6)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, PZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? (k === FAV ? 34 : 0) : dd === 0 ? OPEN : dd === 1 ? 10 : 0;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "kiln " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kilns",
  means: "Three round kilns on a brick pad: the kiln under the pointer swings its lid up on the hinge, and its neighbours crack theirs.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[138, 135], [200, 166], [262, 197], null],
  mount,
});
