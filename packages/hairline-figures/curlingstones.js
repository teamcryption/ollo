/**
 * Curling stones: four granite stones waiting at the near end of a short
 * sheet of ice, the house drawn as rings at the far end. The pointer picks a
 * stone by where it stands: it slides up the ice toward the house, its handle
 * turning as it goes, and the stones beside it creep a little after it,
 * staggered from it. At rest one stone is already part-way out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), sliding.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, R = 12, Y0 = 46, SLIDE = 56, FAV = 2, IZ = 3;
const REST = [6, 0, 24, 3];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, x, y, a) => ring.map((q) => {
  const c = Math.cos(a), s = Math.sin(a);
  return { ...q, u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c };
});

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const X0 = -R - 6, X1 = (N - 1) * STEP + R + 6, YA = -42, YB = Y0 + R + 6;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[X0, YA, 0], [X1, YA, 0], [X0, YB, 0], [X1, YB, 0], [X1, YA, 20]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ir, ii] = rings(X0, YA, X1, YB, 6, 2);
  put(solid(g), prism(P, front, ir, ii, 0, IZ));
  // the house: rings on the ice at the far end, and the hog line across it
  const HX = (N - 1) * STEP / 2, HY = -14;
  for (const r of [22, 14, 6]) mk("path", { d: poly(ringAt(P, disc(HX, HY, r, 48), IZ)), class: "nf lo" }, g);
  mk("path", { d: poly([P(X0 + 4, 20, IZ), P(X1 - 4, 20, IZ)]), class: "nf dash" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const body = solid(grp), band = mk("path", { class: "nf lo" }, grp), handle = solid(grp);
    items.push({ k, x: k * STEP, grp, body, band, handle, s: tween(REST[k]), last: NaN });
  }
  const hbar = rrect(-7, -2, 7, 2, 2, 3), hin = rrect(-6, -1, 6, 1, 1, 3);

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const y = Y0 - s, a = rad(-20 + s * 2.2);
    put(it.body, prism(P, front, disc(it.x, y, R), disc(it.x, y, R - 2), IZ, IZ + 9));
    it.band.setAttribute("d", poly(ringAt(P, disc(it.x, y, R - 0.2, 36), IZ + 5)));
    const ring = turn(hbar, it.x, y, a), inner = turn(hin, it.x, y, a);
    const pts = ringAt(P, disc(it.x, y, 3, 12), IZ + 9).concat(ringAt(P, ring, IZ + 13));
    it.handle.sil.setAttribute("d", poly(hull(pts)));
    it.handle.cr.setAttribute("d", poly(ringAt(P, inner, IZ + 13)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    // paint order: farther (smaller x + y) first
    const order = items.slice().sort((p, q) => (p.x + Y0 - p.last) - (q.x + Y0 - q.last));
    for (const it of order) g.appendChild(it.grp);
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y0, IZ + 6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && sy > mids[best][1] - 90 && sy < mids[best][1] + 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? REST[k] : dd === 0 ? SLIDE : dd === 1 ? 14 : 4;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stone " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "curlingstones",
  means: "Four curling stones on the ice: the stone under the pointer slides toward the house, handle turning, and its neighbours creep after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[90, 143], [131, 164], [214, 205], null],
  mount,
});
