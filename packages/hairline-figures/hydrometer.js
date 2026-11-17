/**
 * Hydrometer: three tall glass jars of liquid on a bench, a hydrometer float
 * in each, bulb down, stem up. The pointer picks a jar by where it stands:
 * its float rises out of the liquid, and the floats beside it bob up a
 * little, staggered. At rest one float rides high, bright. The slider is
 * the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, R = 13, H = 62, LIFT = 40, FAV = 0, CZ = 3;
const X1 = (N - 1) * STEP + 2 * (R + 4);
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -4, 0], [X1 + 4, 2 * R + 12, 0], [X1 + 4, -4, 0], [-4, 2 * R + 12, 0], [R + 4, R + 4, H + LIFT + 20], [X1 - R - 4, R + 4, H + LIFT + 20]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, 2 * R + 12, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));
  const cyl = (x, y, r, z0, z1) => poly(hull(ringAt(P, disc(x, y, r), z0).concat(ringAt(P, disc(x, y, r), z1))));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, y = R + 4, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R + 3), disc(x, y, R + 1), CZ, CZ + 3));
    const fl = mk("g", {}, grp);
    const bulb = mk("path", { class: "nf" }, fl), stem = mk("path", { class: "nf" }, fl);
    mk("path", { d: cyl(x, y, R, CZ + 3, CZ + H), class: "sil nf" }, grp);
    mk("path", { d: poly(ringAt(P, disc(x, y, R), CZ + H - 14)), class: "nf lo" }, grp);
    mk("path", { d: poly(ringAt(P, disc(x, y, R), CZ + H)), class: "nf" }, grp);
    items.push({ k, x, y, bulb, stem, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const b = CZ + 14 + lift, pts = [];
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; pts.push(...ringAt(P, disc(it.x, it.y, 6 * Math.sin(t) + 1.6, 20), b + 22 * (1 - Math.cos(t)) / 2)); }
    it.bulb.setAttribute("d", poly(hull(pts)));
    it.stem.setAttribute("d", cyl(it.x, it.y, 1.8, b + 21, b + H - 6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 22 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.bulb.classList.toggle("hi", k === (a < 0 ? FAV : a));
      it.stem.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hydrometer",
  means: "Three tall jars on a bench, a hydrometer float in each: the float under the pointer rises out, its neighbours bob up a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[145, 140], [255, 190], [200, 165], null],
  mount,
});
