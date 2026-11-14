/**
 * Chew toys: a low basket holding four dog toys, a ball, a bone, a tug ring
 * and a knotted rope. The pointer picks a toy by where it stands: that toy
 * lifts up out of the basket, and its neighbours stir a little, staggered
 * from it. At rest the bone sits half out, bright. The slider is the lift.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 27, X0 = 20, Y = 22, BW = 122, BD = 44, BH = 12, FAV = 1;
const NAMES = ["ball", "bone", "ring", "rope"];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let LIFT = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-2, -2, 0], [BW + 2, BD + 2, 0], [BW + 2, -2, 0], [-2, BD + 2, 0], [X0 + STEP, Y, BH + 30 + 34], [X0 + 3 * STEP, Y, BH + 30 + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BW, BD, 9, 2.4);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  // the basket's inside: its floor line seen through the open top
  mk("path", { d: open(ringAt(P, run(bi, (s) => !front(s)), BH)), class: "nf lo" }, g);

  const sphere = (x, y, zc, r) => {
    const pts = [];
    for (let i = -4; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, r * Math.cos(t) + 0.01, 20), zc + r * Math.sin(t))); }
    return poly(hull(pts));
  };
  const cyl = (x, y, r, z0, z1) => poly(hull(ringAt(P, disc(x, y, r, 18), z0).concat(ringAt(P, disc(x, y, r, 18), z1))));
  const hoop = (x, y, zc, R) => {
    const pts = [];
    for (let i = 0; i < 40; i++) { const t = (i / 40) * 2 * Math.PI; pts.push(P(x + R * Math.cos(t), y, zc + R * Math.sin(t))); }
    return poly(pts);
  };

  const shapes = [
    (x, z) => [sphere(x, Y, z + 10, 10), open([P(x - 7, Y, z + 13), P(x, Y + 2, z + 8), P(x + 7, Y, z + 13)])],
    (x, z) => [cyl(x, Y, 3, z, z + 26), sphere(x - 3.6, Y, z + 27, 4.6), sphere(x + 3.6, Y, z + 27, 4.6)],
    (x, z) => [hoop(x, Y, z + 12, 12), hoop(x, Y, z + 12, 7)],
    (x, z) => [cyl(x, Y, 3.4, z, z + 22), sphere(x, Y, z + 24, 6)],
  ];
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const paths = shapes[k](x, 0).map((_, i) => mk("path", { class: i === 0 ? "sil" : k === 2 || (k === 0 && i === 1) ? "lo" : "sil" }, grp));
    if (k === 0) paths[1].setAttribute("class", "nf lo");
    items.push({ k, x, grp, paths, z: tween(k === FAV ? 14 : [5, 0, 7, 3][k]), last: NaN });
  }
  // the basket's front wall, over the toys' feet
  const fr = run(br, front), fi = run(bi, front);
  mk("path", { d: poly(ringAt(P, fr, BH).concat(ringAt(P, fr, 0).reverse())), class: "sil" }, g);
  mk("path", { d: open(ringAt(P, fi, BH)), class: "nf lo" }, g);

  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    shapes[it.k](it.x, 4 + z).forEach((d, i) => it.paths[i].setAttribute("d", d));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, BH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 14 : [5, 0, 7, 3][k]) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * 40);
      it.paths.forEach((p) => { if (p.classList.contains("sil")) p.classList.toggle("hi", k === (a < 0 ? FAV : a)); });
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { LIFT = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "pettoys",
  means: "A basket of four chew toys: the toy under the pointer lifts out of the basket, and its neighbours stir.",
  rules: [1, 2, 5, 6],
  range: [14, 26, 34],
  tour: [[180, 163], [258, 203], [141, 143], null],
  mount,
});
