/**
 * Pumpkins: four ribbed pumpkins of different sizes along a soil bed, each
 * with a stalk. The pointer picks a pumpkin by where it stands: it lifts off
 * the bed as if harvested, and the ones beside it rock up a little, staggered
 * from it. At rest the largest sits a little raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, extremes, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SIZES = [[13, 15], [17, 20], [11, 13], [14, 16]], STEP = 34, Y = 20, BZ = 5, LIFT = 22, FAV = 1;
const X1 = 20 + (SIZES.length - 1) * STEP + 20;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -2, 0], [X1 + 4, 2 * Y + 2, 0], [X1 + 4, -2, 0], [-4, 2 * Y + 2, 0], [54, Y, BZ + 2 * 20 + LIFT + 6], [20, Y, BZ + 30 + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -2, X1 + 4, 2 * Y + 2, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const near = extremes(P, circ(1, 64))[2], phi0 = Math.atan2(near.v, near.u);

  const items = SIZES.map(([R, H], k) => {
    const x = 20 + k * STEP, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp);
    const ribs = [0, 1, 2].map(() => mk("path", { class: "nf lo" }, grp));
    const stalk = mk("path", { class: "nf" }, grp);
    return { k, x, R, H, body, ribs, stalk, z: tween(k === FAV ? 8 : 0), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, R, H } = it, z0 = BZ + lift, pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = -Math.PI / 2 + (i / 8) * Math.PI;
      pts.push(...ringAt(P, disc(x, Y, R * Math.cos(t) + 0.3, 28), z0 + H * (1 + Math.sin(t)) / 2));
    }
    it.body.setAttribute("d", poly(hull(pts)));
    [-0.6, 0, 0.6].forEach((o, j) => {
      const f = phi0 + o * 1.1, line = [];
      for (let i = 1; i < 12; i++) {
        const t = -Math.PI / 2 + (i / 12) * Math.PI, rr = R * Math.cos(t) * 0.97;
        line.push(P(x + rr * Math.cos(f), Y + rr * Math.sin(f), z0 + H * (1 + Math.sin(t)) / 2));
      }
      it.ribs[j].setAttribute("d", open(line));
    });
    it.stalk.setAttribute("d", poly(hull(ringAt(P, disc(x, Y, 1.8, 12), z0 + H - 1).concat(ringAt(P, disc(x + 1.5, Y, 1.4, 12), z0 + H + 5)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, BZ + it.H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 8 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pick " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pumpkins",
  means: "Four pumpkins on a soil bed: the one under the pointer lifts as if harvested, and its neighbours rock up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 150], [176, 165], [272, 222], null],
  mount,
});
