/**
 * Ring holder: three cones of different heights on a dish, each wearing a
 * ring. The pointer picks a cone by where it stands: it tips forward to
 * offer its ring, and the cones beside it tip a little, staggered from it.
 * At rest one cone leans, bright. The slider is the stagger.
 */
const { Cam, fit, hull, poly, open, proj, rings, prism, facing, circ, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const XS = [14, 42, 70], HS = [40, 54, 34], R = 9, Y = 12, Z0 = 4, FAV = 0, TIP = 30;
const disc = (x, y, z, r, n = 28) => circ(r, n).map((q) => [x + q.u, y + q.v, z]);
const rot = (q, a) => { const c = Math.cos(a), s = Math.sin(a), dy = q[1] - Y, dz = q[2] - Z0; return [q[0], Y + dy * c - dz * s, Z0 + dy * s + dz * c]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [88, 28, 0], [42, Y, 58], [42, Y + 30, 40]], 200, 162);
  const P = proj(C), front = facing(C);
  const hp = (pts) => poly(hull(pts.map((q) => P(...q))));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, 88, 28, 12, 2.5);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    const cone = mk("path", { class: "sil" }, grp), ring = mk("path", { class: "nf" }, grp), gem = mk("path", {}, grp);
    return { k, x, h: HS[k], cone, ring, gem, a: tween(k === FAV ? 14 : 0), last: NaN };
  });
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const r = (q) => rot(q, rad(a)), x = it.x, h = it.h, rz = Z0 + h * 0.45, rr = R * 0.55 + 1;
    it.cone.setAttribute("d", hp(disc(x, Y, Z0, R).concat(disc(x, Y, Z0 + h, 1.2, 10)).map(r)));
    const half = (z, q0) => { const o = []; for (let i = 0; i <= 18; i++) { const t = -Math.PI / 4 + (i / 18) * Math.PI; o.push(P(...r([x + q0 * Math.cos(t), Y + q0 * Math.sin(t), z]))); } return open(o); };
    it.ring.setAttribute("d", half(rz, rr) + half(rz + 2.2, rr - 0.6));
    const gq = [x + rr * 0.7, Y + rr * 0.7, rz + 1];
    it.gem.setAttribute("d", hp(disc(gq[0], gq[1], gq[2], 2.2, 10).concat(disc(gq[0], gq[1], gq[2] + 3, 1, 8)).map(r)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, Y, Z0 + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 14 : 0) : dd === 0 ? TIP : dd === 1 ? 10 : 4;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cone.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ring " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jewelrytree",
  means: "Three ring cones on a dish: the cone under the pointer tips forward to offer its ring, and its neighbours tip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 119], [200, 129], [251, 177], null],
  mount,
});
