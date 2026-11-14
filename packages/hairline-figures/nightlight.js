/**
 * Mobile: a nursery mobile on a stand, an arm reaching out over four toys
 * hanging on strings at uneven lengths, balls and blocks in turn. The
 * pointer picks a toy by where it stands: its string winds up and the toy
 * rises toward the arm, and the toys beside it rise a little, staggered
 * from it. At rest one toy hangs high, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, Y = 20, ARM = 112, R = 10, FAV = 2, LIFT = 22;
const HANG = [38, 26, 44, 30];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const X1 = 30 + (N - 1) * STEP + 14;
  fit(C, [[-16, 2, 0], [24, 38, 0], [X1, Y, ARM + 4], [-4, Y, ARM + 4], [30 + 2 * STEP, Y, ARM - 44 - 2 * R - 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the stand: a weighted foot, a pole, an arm
  const [fr, fi] = rings(-16, 2, 24, 38, 8, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 5));
  const [pr, pi] = rings(-1, Y - 3, 5, Y + 3, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 5, ARM + 4));
  const [ar, ai] = rings(-4, Y - 2.5, X1, Y + 2.5, 2.5, 0.8);
  put(solid(g), prism(P, front, ar, ai, ARM, ARM + 4));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 30 + k * STEP, grp = mk("g", {}, g);
    const str = mk("path", { class: "nf lo" }, grp);
    const s = solid(grp);
    const eq = k % 2 === 0 ? mk("path", { class: "nf lo" }, grp) : null;
    const rest = k === FAV ? HANG[k] - LIFT * 0.7 : HANG[k];
    items.push({ k, x, ball: k % 2 === 0, str, s, eq, z: tween(rest), last: NaN });
  }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const top = ARM - h;
    it.str.setAttribute("d", seg(P(it.x, Y, ARM), P(it.x, Y, top)));
    if (it.ball) {
      const zc = top - R, pts = [];
      for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, Y, R * Math.cos(t)), zc + R * Math.sin(t))); }
      it.s.sil.setAttribute("d", poly(hull(pts)));
      it.eq.setAttribute("d", open(ringAt(P, disc(it.x, Y, R - 0.6).filter(front), zc)));
    } else {
      const [br, bi] = rings(it.x - 8, Y - 8, it.x + 8, Y + 8, 3, 1.4);
      put(it.s, prism(P, front, br, bi, top - 16, top));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, ARM - HANG[it.k] - R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a);
      const h = a < 0 ? (k === FAV ? HANG[k] - LIFT * 0.7 : HANG[k]) : HANG[k] - (dd === 0 ? LIFT : dd === 1 ? 6 : 0);
      tset(it.z, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "toy " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "nightlight",
  means: "A nursery mobile on a stand: the toy under the pointer winds up on its string toward the arm, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[157, 164], [194, 164], [268, 244], null],
  mount,
});
