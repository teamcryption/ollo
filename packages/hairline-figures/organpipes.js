/**
 * Organ pipes: a rank of round flue pipes standing on a wind chest, tallest
 * in the middle, each with its conical foot and a mouth cut in its front.
 * The pointer picks a pipe by where it stands: that pipe lifts in its hole as
 * if its stop were drawn, and the pipes beside it rise a little, staggered
 * from it. At rest one pipe stands raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 14, R = 5.5, CZ = 12, FOOT = 10, LIFT = 9, FAV = 2;
const H = [46, 60, 74, 88, 74, 60, 46];
const X1 = (N - 1) * STEP + 2 * R + 8, Y1 = 2 * R + 8;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.98);
  fit(C, [[-4, -4, 0], [X1 + 4, Y1 + 4, 0], [X1 + 4, -4, 0], [-4, Y1 + 4, 0], [X1 / 2, Y1 / 2, CZ + 88 + LIFT + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-4, -4, X1 + 4, Y1 + 4, 4, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, y = Y1 / 2, grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, R + 0.8), CZ)), class: "nf lo" }, grp);
    const foot = mk("path", { class: "" }, grp);
    const body = solid(grp);
    const mouth = mk("path", { class: "nf lo" }, grp);
    const rest = k === FAV ? LIFT * 0.7 : 0;
    items.push({ k, x, y, h: H[k], foot, body, mouth, z: tween(rest), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = CZ + lift - 3, zb = z0 + FOOT, zt = CZ + it.h + lift;
    it.foot.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 1.6, 16), z0).concat(ringAt(P, disc(it.x, it.y, R, 28), zb)))));
    put(it.body, prism(P, front, disc(it.x, it.y, R), disc(it.x, it.y, R - 1.1), zb, zt));
    const at = (a, z) => P(it.x + R * Math.cos(a), it.y + R * Math.sin(a), z);
    const a0 = Math.PI / 4, mz = zb + 3;
    it.mouth.setAttribute("d", open([at(a0 - 0.55, mz), at(a0 - 0.35, mz + 3), at(a0, mz + 5), at(a0 + 0.35, mz + 3), at(a0 + 0.55, mz)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const bands = items.map((it) => [P(it.x, it.y, CZ)[0], P(it.x, it.y, CZ + it.h)[1] - 6, P(it.x, it.y, CZ)[1] + 8]);
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    bands.forEach((b, k) => { const d = Math.abs(b[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && sy > bands[best][1] && sy < bands[best][2] ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : d === 0 ? LIFT : d === 1 ? 3.5 : d === 2 ? 1.2 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pipe " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "organpipes",
  means: "A rank of organ pipes on a wind chest: the pipe under the pointer lifts as its stop is drawn, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 99], [141, 87], [259, 146], null],
  mount,
});
