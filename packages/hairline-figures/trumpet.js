/**
 * Trumpet: one trumpet on its side, the lead pipe looping round to three
 * piston valves and back out to a flared bell. The pointer picks a valve by
 * where it stands: its piston draws up out of the casing, and its
 * neighbours rise a little, staggered. At rest the middle piston stands
 * half out, bright. The slider is how far a piston draws.
 *
 * The pattern: one of many in a single row (keys).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const VX = [-12, 0, 12], ZC = 46, FAV = 1, S = 2.2;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function tube(P, line) {
  const pts = line.map(([x, z]) => P(x, 0, z)), L = [], R = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], d = Math.hypot(tx, ty) || 1, w = line[i][2] * S;
    L.push([p[0] - (ty / d) * w, p[1] + (tx / d) * w]); R.push([p[0] + (ty / d) * w, p[1] - (tx / d) * w]);
  });
  return poly(L.concat(R.reverse()));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-74, 0, 26], [74, -16, 40], [74, 16, 40], [0, 0, 6], [0, 0, ZC + 58], [74, 0, 56], [74, 0, 24]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // lead pipe from the mouthpiece round the front bow, and the rear bow up to the bell pipe
  mk("path", { d: tube(P, [[-72, 27, 3.2], [-67, 27, 1.4], [36, 27, 1.9], [43, 25, 1.9], [46, 20, 1.9], [43, 15, 1.9], [36, 13, 1.9], [12, 13, 1.9]]) }, g);
  mk("path", { d: tube(P, [[-12, 13, 1.9], [-28, 13, 1.9], [-35, 17, 1.9], [-37, 26, 1.9], [-35, 35, 1.9], [-28, 40, 2], [12, 40, 2]]) }, g);

  const items = VX.map((x, k) => {
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, 0, 4.6), disc(x, 0, 3.6), 6, ZC));
    put(solid(grp), prism(P, front, disc(x, 0, 5.4), disc(x, 0, 4.4), ZC, ZC + 2.2));
    const body = solid(grp), stem = solid(grp), btn = solid(grp);
    return { k, x, body, stem, btn, z: tween(k === FAV ? 12 : 0), last: NaN };
  });

  // the bell pipe and its flare, nearest the viewer
  const bell = [];
  for (let i = 0; i <= 14; i++) { const x = 14 + i * 4.2; bell.push([x, 40, 2 + 14 * Math.pow(i / 14, 2.6)]); }
  mk("path", { d: tube(P, bell) }, g);
  const rim = circ(16, 40).map((q) => P(73, q.u, 40 + q.v));
  mk("path", { d: poly(rim), class: "sil" }, g);
  mk("path", { d: poly(circ(13.5, 40).map((q) => P(73, q.u, 40 + q.v))), class: "nf lo" }, g);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = ZC + 2.2, x = it.x;
    put(it.body, lift > 0.3 ? prism(P, front, disc(x, 0, 3.6), disc(x, 0, 2.8), z0, z0 + lift) : { sil: "", crease: "" });
    put(it.stem, prism(P, front, disc(x, 0, 1.3, 12), disc(x, 0, 0.8, 12), z0 + lift, z0 + lift + 5));
    put(it.btn, prism(P, front, disc(x, 0, 4.4), disc(x, 0, 3.4), z0 + lift + 5, z0 + lift + 7.5));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, ZC));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 14 && sy > mids[best][1] - 100 && sy < mids[best][1] + 80 ? best : -1;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act, top = 22 + 26 * amt;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? 12 : 0) : d === 0 ? top : d === 1 ? top * 0.6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      it.btn.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "valve " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "trumpet",
  means: "A trumpet on its side: the piston under the pointer draws up out of its valve casing, its neighbours rise a little after it.",
  rules: [1, 2, 3, 5],
  range: [0, 0.5, 1],
  tour: [[188, 152], [207, 162], [169, 142], null],
  mount,
});
