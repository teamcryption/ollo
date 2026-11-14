/**
 * Headphones: three pairs hung on stands in a row, each a band arched over
 * its post with a cup at either end. The pointer picks a pair by where it
 * stands: it lifts off its stand, and the pairs beside it rise a little,
 * staggered from it. At rest one pair is raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 44, SH = 44, R = 13, CR = 7, LIFT = 18, FAV = 1;
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-14, -R - 8, 0], [X1 + 14, R + 8, 0], [X1 + 14, -R - 8, 0], [-14, R + 8, 0], [0, 0, SH + LIFT + 4], [X1, 0, SH + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -12, X1 + 14, 12, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));

  const items = [];
  for (let k = 0; k < N; k++) {
    const cx = k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(cx, 0, 2.2, 16), disc(cx, 0, 1.4, 16), 3, SH));
    const far = mk("path", {}, grp), band = mk("path", { class: "sil" }, grp), near = mk("path", {}, grp);
    items.push({ k, cx, far, band, near, z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN });
  }

  const cup = (cx, y0, y1, zc) => {
    const pts = [];
    for (const y of [y0, y1]) for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push(P(cx + CR * Math.cos(a), y, zc + CR * 1.15 * Math.sin(a))); }
    return poly(hull(pts));
  };

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const zc = SH - R + lift + 1.5, out = [], inn = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI;
      out.push(P(it.cx, -(R + 1.5) * Math.cos(a), zc + (R + 1.5) * Math.sin(a)));
      inn.push(P(it.cx, -(R - 1) * Math.cos(a), zc + (R - 1) * Math.sin(a)));
    }
    it.band.setAttribute("d", poly(out.concat(inn.reverse())));
    it.far.setAttribute("d", cup(it.cx, -R - 4, -R + 1, zc - 4));
    it.near.setAttribute("d", cup(it.cx, R - 1, R + 4, zc - 4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, 0, SH * 0.6));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 36 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.band.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pair " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "headphones",
  means: "Three pairs of headphones on stands: the pair under the pointer lifts off its stand, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 130], [200, 166], [272, 201], null],
  mount,
});
