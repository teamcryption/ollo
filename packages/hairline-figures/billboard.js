/**
 * Billboard: a roadside board on two posts, its face made of vertical
 * slats that turn like a tri-vision sign. The pointer picks a slat by its
 * screen x: it turns to show its other side, and the slats beside it turn
 * after it, staggered by distance. At rest one slat stands half turned,
 * bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, W = 15, H0 = 34, H = 46, FAV = 5, X1 = N * W;
const REST = [0.08, 0.04, 0, 0.05, 0.12, 0.55, 0.18, 0.06];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-6, -10, 0], [X1 + 6, 10, 0], [-6, 10, H0 + H], [X1 + 6, -10, H0 + H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const px of [W * 1.5, X1 - W * 1.5]) {
    const [r, i] = rings(px - 3, -6, px + 3, 0, 1.5, 0.8);
    put(solid(g), prism(P, front, r, i, 0, H0 - 3));
  }
  const [lr, li] = rings(-4, -7, X1 + 4, 7, 2, 1.2);
  put(solid(g), prism(P, front, lr, li, H0 - 4, H0 - 1));

  const items = [];
  for (let k = 0; k < N; k++) {
    const cx = W / 2 + k * W, grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), mid = mk("path", { class: "nf lo" }, grp);
    items.push({ k, cx, sil, mid, a: tween(REST[k]), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const h = W * 0.47, t = 1.2, ang = a * Math.PI, c = Math.cos(ang), s = Math.sin(ang), pts = [];
    const at = (u, v, z) => P(it.cx + u * c - v * s, u * s + v * c, z);
    for (const [u, v] of [[-h, -t], [h, -t], [h, t], [-h, t]]) pts.push(at(u, v, H0), at(u, v, H0 + H));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.mid.setAttribute("d", "M" + at(-h * 0.7, t, H0 + H * 0.5) + "L" + at(h * 0.7, t, H0 + H * 0.5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, 0, H0 + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), v = a < 0 ? REST[k] : d === 0 ? 1 : d === 1 ? 0.62 : d === 2 ? 0.3 : 0;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "billboard",
  means: "A roadside board of turning slats: the slat under the pointer turns over, and its neighbours follow, staggered.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[140, 100], [232, 145], [272, 165], null],
  mount,
});
