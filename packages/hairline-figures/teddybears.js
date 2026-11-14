/**
 * Teddy bears: five soft bears of mixed sizes sitting along a wall shelf,
 * each a round body, legs out front, a head with two ears and a muzzle. The
 * pointer picks a bear by where it stands: that bear hops up off the shelf,
 * and the bears beside it bob a little, staggered from it. At rest one bear
 * sits up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 27, SZ = [0.9, 1.1, 0.8, 1.0, 0.85], LIFT = 16, FAV = 1, SZ0 = 4;
const X1 = (N - 1) * STEP + 24;
const D = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -10, 0], [X1 + 4, 28, 0], [X1 + 4, -10, 58], [-4, -10, 58], [12, 12, SZ0 + 40 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const unit = (() => { const a = P(0, 0, 0), b = P(0, 0, 1); return Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.866; })();
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-4, -10, X1 + 4, -6, 1.5, 1);
  put(solid(g), prism(P, front, wr, wi, 0, 58));
  const [sr, si] = rings(-4, -6, X1 + 4, 28, 3, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ0));

  const circle = (q, R) => {
    const c = P(q[0], q[1], q[2]), r = R * unit, pts = [];
    for (let a = 0; a < 28; a++) { const t = (a / 28) * Math.PI * 2; pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); }
    return poly(pts);
  };

  const items = [];
  for (let k = 0; k < N; k++) {
    const s = SZ[k], x = 12 + k * STEP, y = 10, grp = mk("g", {}, g);
    const parts = {};
    for (const [n, cls] of [["body", "sil"], ["legL", "sil"], ["legR", "sil"], ["earL", "sil"], ["earR", "sil"], ["head", "sil"], ["muz", "lo"]]) parts[n] = mk("path", { class: cls }, grp);
    items.push({ k, s, x, y, parts, z: tween(k === FAV ? LIFT * 0.5 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { s, x, y, parts } = it, z = SZ0 + lift;
    const at = (f, sd, dz) => [x + (f + sd) * D, y + (f - sd) * D, z + dz];
    parts.body.setAttribute("d", circle(at(0, 0, 9 * s), 9 * s));
    parts.legL.setAttribute("d", circle(at(8 * s, -5 * s, 3 * s), 3.4 * s));
    parts.legR.setAttribute("d", circle(at(8 * s, 5 * s, 3 * s), 3.4 * s));
    const hz = 9 * s + 14 * s;
    parts.earL.setAttribute("d", circle(at(0, -5.5 * s, hz + 5 * s), 2.8 * s));
    parts.earR.setAttribute("d", circle(at(0, 5.5 * s, hz + 5 * s), 2.8 * s));
    parts.head.setAttribute("d", circle(at(0, 0, hz), 7 * s));
    parts.muz.setAttribute("d", circle(at(5 * s, 0, hz - 2 * s), 2.6 * s));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ0 + 16 * it.s));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.5 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const n of ["body", "legL", "legR", "earL", "earR", "head"]) it.parts[n].classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "bear " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "teddybears",
  means: "Five teddy bears of mixed sizes on a shelf: the bear under the pointer hops up, and its neighbours bob a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[97, 126], [175, 169], [254, 204], null],
  mount,
});
