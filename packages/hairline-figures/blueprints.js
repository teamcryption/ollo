/**
 * Blueprint rolls: four rolled plans standing on a low tray, each a tube
 * with its coiled end showing on top and a band round its waist. The
 * pointer picks a roll by where it stands: it slides up out of the group,
 * and the rolls beside it rise a little, staggered from it. At rest one
 * roll is half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 26, R = 10, TZ = 3, LIFT = 26, FAV = 2;
const LEN = [52, 62, 46, 56], OFF = [0, 7, 2, 8];
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const Y1 = 2 * R + 8;
  fit(C, [[-6, -6, 0], [X1 + 6, Y1 + 6, 0], [X1 + 6, -6, 0], [-6, Y1 + 6, 0], [R + STEP, R + 7, TZ + 62 + LIFT + 2], [R, R, TZ + 52 + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-6, -6, X1 + 6, Y1 + 6, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R + OFF[k], grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, R + 1.5), TZ)), class: "nf dash" }, grp);
    const tube = solid(grp), band = mk("path", { class: "nf lo" }, grp), coil = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, len: LEN[k], tube, band, coil, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y, len } = it, z0 = TZ + lift, z1 = z0 + len;
    put(it.tube, prism(P, front, disc(x, y, R), disc(x, y, R - 1.4), z0, z1));
    const fr = run(disc(x, y, R + 0.2), front);
    it.band.setAttribute("d", open(ringAt(P, fr, z0 + len * 0.42)) + open(ringAt(P, fr, z0 + len * 0.42 + 3)));
    // the coiled sheet seen on the open end: an off-centre spiral of rings
    let d = "";
    for (const [r, o] of [[6.2, 0.8], [3.6, 1.4]]) d += poly(ringAt(P, disc(x + o, y - o * 0.5, r, 24), z1));
    it.coil.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TZ + it.len / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.tube.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roll " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "blueprints",
  means: "Four rolled plans standing on a tray: the roll under the pointer slides up out of the group, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 140], [200, 165], [250, 190], null],
  mount,
});
