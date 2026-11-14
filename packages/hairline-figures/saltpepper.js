/**
 * Salt and pepper: two shakers on a small tray, a tall one and a squat one,
 * each with a domed cap and pour holes. The pointer picks a shaker by where
 * it stands and that shaker tips forward on its front edge, as if to pour.
 * At rest the tall shaker leans a little, bright.
 */
const {
  Cam, circ, fit, facing, hull, poly, proj, rings, prism, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const TZ = 3, TIP = 28, FAV = 0;
const SH = [{ x: 14, y: 14, r: 10, h: 38 }, { x: 44, y: 18, r: 11, h: 28 }];
const disc = (r, n = 32) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-2, 0, 0], [62, 34, 0], [62, 0, 0], [-2, 34, 0], [14, 14, TZ + 52], [56, 18, TZ + 44], [14, 52, TZ + 30], [44, 48, TZ + 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-2, 0, 62, 34, 8, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = SH.map((s, k) => {
    const grp = mk("g", {}, g), body = solid(grp), holes = [];
    for (let i = 0; i < 3; i++) holes.push(mk("ellipse", { class: "dot off", rx: 1.1, ry: 0.6 }, grp));
    return { ...s, k, body, holes, a: tween(k === FAV ? 8 : 0), last: NaN };
  });

  // tip about the shaker's front edge (+y side, toward the viewer), angle a in degrees
  function pt(s, u, v, z, a) {
    const py = s.y + s.r, c = Math.cos(rad(a)), sn = Math.sin(rad(a));
    const dv = s.y + v - py;
    return P(s.x + u, py + dv * c + z * sn, TZ + z * c - dv * sn);
  }
  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const pts = [];
    for (const [rr, z] of [[s.r, 0], [s.r, s.h], [s.r * 0.85, s.h + 5], [s.r * 0.55, s.h + 8]])
      for (const q of disc(rr)) pts.push(pt(s, q.u, q.v, z, a));
    s.body.sil.setAttribute("d", poly(hull(pts)));
    s.body.cr.setAttribute("d", poly(disc(s.r - 1.2).map((q) => pt(s, q.u, q.v, s.h, a))));
    [[-2.5, -1], [2, -2], [0, 2.5]].forEach(([u, v], i) => {
      const [x, y] = pt(s, u, v, s.h + 8, a);
      s.holes[i].setAttribute("cx", x); s.holes[i].setAttribute("cy", y);
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of items) { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((s) => P(s.x, s.y, TZ + s.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((s, k) => {
      tset(s.a, a < 0 ? (k === FAV ? 8 : 0) : k === a ? TIP * reach / 100 : 0, now, 0);
      s.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "salt" : "pepper";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = -2; }, destroy: bag.dispose };
}

hairline({
  name: "saltpepper",
  means: "Salt and pepper shakers on a tray: the shaker under the pointer tips forward on its edge, as if to pour.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[176, 154], [224, 196], [176, 176], null],
  mount,
});
