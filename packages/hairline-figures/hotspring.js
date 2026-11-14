/**
 * Water bottles: three hiking bottles of different heights standing on a
 * flat stone. The pointer picks a bottle by where it stands: its cap lifts
 * off the neck, and the caps beside it lift a little, staggered from it. At
 * rest the middle cap sits loose and bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BS = [{ x: 0, h: 30, r: 7 }, { x: 22, h: 40, r: 8 }, { x: 44, h: 26, r: 6.5 }];
const FAV = 1, LIFT = 22, SZ = 4, NR = 3.4, CH = 6;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-14, -14, 0], [58, 14, 0], [-14, 14, 0], [58, -14, 0], [22, 0, SZ + 40 + 12 + LIFT + CH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-14, -14, 58, 14, 9, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = BS.map((b, k) => {
    const grp = mk("g", {}, g), z0 = SZ, zs = z0 + b.h, zn = zs + 6;
    const body = solid(grp);
    put(body, prism(P, front, disc(b.x, 0, b.r), disc(b.x, 0, b.r - 1.2), z0, zs));
    // shoulder tapering to the neck
    const sh = solid(grp);
    sh.sil.setAttribute("d", poly(hull(ringAt(P, disc(b.x, 0, b.r), zs).concat(ringAt(P, disc(b.x, 0, NR), zn)))));
    sh.cr.setAttribute("d", open(ringAt(P, run(disc(b.x, 0, NR - 0.8), front), zn)));
    // a sleeve band round the body
    mk("path", { d: open(ringAt(P, run(disc(b.x, 0, b.r), front), z0 + b.h * 0.35)), class: "nf lo" }, grp);
    mk("path", { d: open(ringAt(P, run(disc(b.x, 0, b.r), front), z0 + b.h * 0.7)), class: "nf lo" }, grp);
    const cap = solid(grp);
    return { k, b, zn, cap, z: tween(k === FAV ? 4 : 0), last: NaN };
  });

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = it.zn + lift, x = it.b.x;
    put(it.cap, prism(P, front, disc(x, 0, NR + 0.9, 24), disc(x, 0, NR, 24), z0, z0 + CH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.b.x, 0, SZ + it.b.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 4 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cap.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hotspring",
  means: "Three hiking bottles on a stone: the bottle under the pointer has its cap lifted off, and its neighbours loosen a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 103], [153, 121], [247, 178], null],
  mount,
});
