/**
 * Level crossing: a road crossing a railway, a barrier post on each side
 * with a lamp box. The pointer picks a side of the track: that barrier arm
 * swings down across the road and its lamps light, the other swings up.
 * At rest one arm hangs half down, bright. The slider is the rest lean.
 *
 * The pattern: one of two, a hinged arm turning about its pivot.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 26, L = 52, SZ = 4, REST = [40, 58];
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BAR = [{ x: 30, y: 12, dir: 1 }, { x: 92, y: 70, dir: -1 }];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [126, 86, 0], [126, -4, 0], [-4, 86, 0], [30, 12, PZ + L], [92, 70, PZ + L]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-4, -4, 126, 86, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // road edges along x
  mk("path", { d: seg(P(-4, 22, SZ), P(126, 22, SZ)) + seg(P(-4, 60, SZ), P(126, 60, SZ)), class: "nf lo" }, g);
  mk("path", { d: seg(P(4, 41, SZ), P(46, 41, SZ)) + seg(P(76, 41, SZ), P(118, 41, SZ)), class: "nf dash" }, g);

  function post(b, parent) {
    const grp = mk("g", {}, parent);
    put(solid(grp), prism(P, front, disc(b.x, b.y, 2.2), disc(b.x, b.y, 1.4), SZ, PZ + 6));
    const [lr, li] = rings(b.x - 3, b.y - 7 * b.dir - 3, b.x + 3, b.y - 7 * b.dir + 3, 1.5, 0.8);
    put(solid(grp), prism(P, front, lr, li, PZ - 8, PZ - 2));
    const lamps = [-1.6, 1.6].map((o) => mk("circle", { r: 1.6, class: "dot off" }, grp));
    lamps.forEach((d, i) => { const p = P(b.x + 3, b.y - 7 * b.dir + (i ? 1.6 : -1.6), PZ - 5); d.setAttribute("cx", p[0]); d.setAttribute("cy", p[1]); });
    const arm = mk("path", { class: "sil" }, grp);
    return { ...b, grp, arm, lamps, a: tween(BAR.indexOf(b) ? REST[1] : lean), last: NaN };
  }
  const items = [post(BAR[0], g)];
  // the track along y: sleepers then two rails
  const tg = mk("g", {}, g);
  for (let y = 2; y <= 80; y += 8) { const [r, i] = rings(52, y, 68, y + 3, 1, 0.6); put(solid(tg), prism(P, front, r, i, SZ, SZ + 1.2)); }
  for (const x of [55, 64]) { const [r, i] = rings(x, -2, x + 2, 84, 0.8, 0.4); put(solid(tg), prism(P, front, r, i, SZ + 1.2, SZ + 2.6)); }
  items.push(post(BAR[1], g));

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), pts = [];
    for (const t of [-4, L]) pts.push(...ringAt(P, disc(it.x, it.y + it.dir * t * c, 2.4, 12), PZ + t * s - 1.2), ...ringAt(P, disc(it.x, it.y + it.dir * t * c, 2.4, 12), PZ + t * s + 1.2));
    it.arm.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unprojG(sx, sy);
    if (x < -4 || x > 126 || y < -4 || y > 86) return -1;
    return x < 60 ? 0 : 1;
  }
  const unprojG = (sx, sy) => HL.unproj(C, sx, sy, SZ);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((it, k) => {
      tset(it.a, a < 0 ? (k ? REST[1] : lean) : k === a ? 0 : 90, now, 0);
      const on = k === (a < 0 ? 0 : a);
      it.arm.classList.toggle("hi", on);
      it.lamps.forEach((d) => d.setAttribute("class", a >= 0 && k === a ? "dot" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "west" : "east";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lean = v; if (act < 0) { act = -2; setActive(-1); } }, destroy: bag.dispose };
}

hairline({
  name: "trainhorn",
  means: "A level crossing: the barrier on the pointer's side of the track swings down across the road and its lamps light.",
  rules: [1, 4, 5, 8],
  range: [45, 72, 85],
  tour: [[172, 199], [257, 242], [150, 185], null],
  mount,
});
