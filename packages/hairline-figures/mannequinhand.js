/**
 * Glove form: two hand forms stand on posts on one plinth. The pointer picks
 * a form by where it stands: that hand turns on its post to show its palm,
 * and the other turns back. At rest one hand stands turned, bright.
 * The slider is how far the hand turns.
 */
const { Cam, fit, hull, poly, proj, rings, prism, facing, circ, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const XS = [16, 54], Y = 12, FAV = 1, REST = [10, 35];
const FING = [[-6.3, 15], [-2.1, 18], [2.1, 17], [6.3, 13]];
const box = (u0, v0, z0, u1, v1, z1) => [[u0, v0, z0], [u1, v0, z0], [u0, v1, z0], [u1, v1, z0], [u0, v0, z1], [u1, v0, z1], [u0, v1, z1], [u1, v1, z1]];
const disc = (x, y, z, r) => circ(r, 20).map((q) => [x + q.u, y + q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let turn = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-2, -4, 0], [72, 28, 0], [16, Y, 64], [54, Y, 64]], 200, 160);
  const P = proj(C), front = facing(C);
  const hp = (pts) => poly(hull(pts.map((q) => P(...q))));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-2, -4, 72, 28, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  const items = XS.map((x, k) => {
    const grp = mk("g", {}, g);
    mk("path", { d: hp(disc(x, Y, 5, 1.8).concat(disc(x, Y, 22, 1.8))), class: "sil" }, grp);
    mk("path", { d: hp(disc(x, Y, 18, 4).concat(disc(x, Y, 24, 3.6))), class: "sil" }, grp);
    const thumbB = mk("path", { class: "sil" }, grp), palm = mk("path", { class: "sil" }, grp), thumbF = mk("path", { class: "sil" }, grp);
    const fingers = FING.map(() => mk("path", { class: "sil" }, grp));
    return { k, x, palm, fingers, thumbB, thumbF, a: tween(REST[k]), last: NaN };
  });
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const w = (pts) => hp(pts.map(([u, v, z]) => [it.x + u * c - v * s, Y + u * s + v * c, z]));
    it.palm.setAttribute("d", w(box(-8.5, -2.5, 24, 8.5, 2.5, 46)));
    it.fingers.forEach((f, i) => f.setAttribute("d", w(box(FING[i][0] - 1.9, -1.8, 45, FING[i][0] + 1.9, 1.8, 45 + FING[i][1]))));
    const th = w([[8, -1.6, 30], [8, 1.6, 30], [8, -1.6, 36], [8, 1.6, 36], [15, -1.6, 40], [15, 1.6, 40], [13, -1.6, 46], [13, 1.6, 46]]);
    const near = c + s > 0;
    it.thumbF.setAttribute("d", near ? th : "");
    it.thumbB.setAttribute("d", near ? "" : th);
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, Y, 36));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((it, k) => {
      tset(it.a, a < 0 ? REST[k] : k === a ? REST[k] + turn : REST[k] - 25, now, 0);
      it.palm.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a ? "right" : "left";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { turn = v; act = -3; }, destroy: bag.dispose };
}

hairline({
  name: "mannequinhand",
  means: "Two glove forms on posts: the hand under the pointer turns on its post to show its palm, and the other turns back.",
  rules: [1, 5, 6],
  range: [40, 70, 90],
  tour: [[164, 107], [236, 143], [200, 125], null],
  mount,
});
