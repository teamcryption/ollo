/**
 * Bouncy castle: an inflated floor with puffy walls along its back and a
 * turret at each corner, every turret a fat column with a round cap. The
 * pointer picks the nearest corner: that turret bounces up tall, its
 * neighbours dip a little, staggered from it. At rest the turrets stand at
 * uneven heights, the front one bright. The slider is how high it bounces.
 *
 * The pattern: one of a few parts picked by its rest pose on screen.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 64, Y1 = 52, FZ = 7, TR = 8, REST = [34, 26, 28, 22], FAV = 3;
const CORN = [[0, 0], [X1, 0], [0, Y1], [X1, Y1]];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-TR, -TR, 0], [X1 + TR, Y1 + TR, 0], [X1 + TR, -TR, 0], [-TR, Y1 + TR, 0], [0, 0, 34 + 30 + 10], [X1, Y1, 22 + 30 + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-2, -2, X1 + 2, Y1 + 2, 10, 2);
  put(solid(g), prism(P, front, fr, fi, 0, FZ));
  const make = () => { const s = mk("g", {}, g); return { g: s, sil: mk("path", { class: "sil" }, s), cr: mk("path", { class: "nf lo" }, s) }; };
  const tur = [make()];
  // the puffy back walls, between the far turrets
  const [w1, w1i] = rings(0, -3, X1, 3, 3, 1.2), [w2, w2i] = rings(-3, 0, 3, Y1, 3, 1.2);
  put(solid(g), prism(P, front, w2, w2i, FZ, FZ + 16));
  put(solid(g), prism(P, front, w1, w1i, FZ, FZ + 16));
  tur.push(make(), make(), make());
  const items = tur.map((t, k) => ({ ...t, x: CORN[k][0], y: CORN[k][1], h: tween(REST[k]), last: NaN }));

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const ring = disc(it.x, it.y, TR), pts = ringAt(P, ring, FZ).concat(ringAt(P, ring, FZ + h));
    for (let i = 1; i <= 4; i++) { const t = (i / 4) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, (TR + 1.5) * Math.cos(t)), FZ + h + 2 + 7 * Math.sin(t))); }
    pts.push(...ringAt(P, disc(it.x, it.y, TR + 1.5), FZ + h + 2));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.cr.setAttribute("d", open(ringAt(P, run(disc(it.x, it.y, TR + 1.2), front), FZ + h + 1.5)) + open(ringAt(P, run(disc(it.x, it.y, TR), front), FZ + h * 0.5)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.h, now)); if (!tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it, k) => P(it.x, it.y, FZ + REST[k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, (m[1] - sy) * 0.6); if (d < bd) { bd = d; best = k; } });
    return bd < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = k === a ? 0 : (k ^ a) === 3 ? 2 : 1;
      const h = a < 0 ? REST[k] : d === 0 ? REST[k] + lift : REST[k] - 6 + d * 2;
      tset(it.h, clamp(h, 12, 70), now, from < 0 ? 0 : d * 45);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "turret " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; const a = act; act = -3; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "bouncycastle",
  means: "An inflatable bouncy castle: the corner turret nearest the pointer bounces up tall while the others dip a little.",
  rules: [1, 2, 5, 9],
  range: [10, 22, 30],
  tour: [[296, 158], [190, 95], [205, 215], null],
  mount,
});
