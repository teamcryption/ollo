/**
 * Yoga mats: five rolled mats standing in a floor rack with a back rail.
 * The pointer picks a mat by where it stands: it tips forward out of the
 * rack, and the mats beside it lean a little, staggered from it. At rest
 * one mat leans, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, tilted on its foot.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, R = 8.5, H = 62, STEP = 20, FAV = 3, TIP = 30, LEAN = 9, REST_T = 16, BZ = 4;
const X1 = (N - 1) * STEP + 2 * R + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -R - 10, BZ + H + 8], [X1, -R - 10, 0], [-4, R + 6, 0], [X1, R + 6, 0], [0, H * 0.55, BZ + H * 0.85]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // back rail: two posts and a bar
  for (const px of [0, X1 - 6]) { const [pr, pi] = rings(px, -R - 8, px + 4, -R - 4, 1, 0.8); put(solid(g), prism(P, front, pr, pi, 0, H * 0.7)); }
  const [rr, ri] = rings(-2, -R - 8, X1 - 0, -R - 4, 1.5, 0.8);
  put(solid(g), prism(P, front, rr, ri, H * 0.7 - 5, H * 0.7));
  const [tr, ti] = rings(-4, -R - 4, X1, R + 6, 3, 1.4);
  put(solid(g), prism(P, front, tr, ti, 0, BZ));

  const circle = (x, a, z, r, n = 32) => {
    const o = [], s = Math.sin(a), c = Math.cos(a);
    for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI, cu = Math.cos(t) * r, cv = Math.sin(t) * r; o.push(P(x + cu, z * s + cv * c, BZ + z * c - cv * s)); }
    return o;
  };
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), end = mk("path", { class: "nf lo" }, grp), band = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x: R + 3 + k * STEP, body, end, band, a: tween(k === FAV ? REST_T : 0), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = rad(deg), top = circle(it.x, a, H, R);
    it.body.setAttribute("d", poly(hull(circle(it.x, a, 0, R).concat(top))));
    it.end.setAttribute("d", poly(top) + poly(circle(it.x, a, H, R * 0.55, 24)) + poly(circle(it.x, a, H, R * 0.2, 12)));
    const s = Math.sin(a), c = Math.cos(a), bz = H * 0.3, at = (u, z) => P(it.x + u, z * s + R * c, BZ + z * c - R * s);
    it.band.setAttribute("d", seg(at(-R * 0.6, bz), at(R * 0.6, bz)) + seg(at(-R * 0.6, bz + 4), at(R * 0.6, bz + 4)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? (k === FAV ? REST_T : 0) : dd === 0 ? TIP : dd === 1 ? LEAN : 0;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "mat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "yogamats",
  means: "Rolled yoga mats standing in a rack: the mat under the pointer tips forward out of it, and the mats beside it lean.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[154, 144], [183, 158], [268, 201], null],
  mount,
});
