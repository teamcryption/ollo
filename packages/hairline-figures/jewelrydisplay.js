/**
 * Jewellery display: a two-tier tray with ring cones standing on each tier,
 * each cone holding a ring with a stone. The pointer picks a ring by where it
 * rests: it lifts off its cone and turns its face to the reader, and the
 * rings near it rise a little, staggered by distance. At rest one ring is
 * half lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many (riffle); the pick is the ring whose resting
 * centre on screen is nearest the pointer.
 */
const {
  Cam, circ, fit, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X = 72, TB = 12, TF = 5, CH = 18, CR0 = 6, CR1 = 1.8, RR = 4.3, RZ = 8.5, LIFT = 15, FAV = 1;
const SPOTS = [[13, 10, TB], [36, 10, TB], [59, 10, TB], [24, 31, TF], [48, 31, TF]];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const S2 = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [X, 42, 0], [X, 0, 0], [0, 42, 0], [13, 10, TB + RZ + LIFT + 6], [59, 10, TB + RZ + LIFT + 6]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const tier = (y0, y1, z) => { const [r, i] = rings(0, y0, X, y1, 4, 1.4); put(solid(g), prism(P, () => true, r, i, 0, z)); };
  const items = SPOTS.map(([x, y, z0], k) => ({ k, x, y, z0, lift: tween(k === FAV ? LIFT * 0.6 : 0), turn: tween(k === FAV ? 0.6 : 0), last: "" }));
  function build(it) {
    const grp = mk("g", {}, g);
    it.back = mk("path", { class: "nf sil" }, grp);
    it.stone = mk("circle", { r: 1.6, class: "dot off" }, grp);
    const foot = ringAt(P, disc(it.x, it.y, CR0), it.z0), top = ringAt(P, disc(it.x, it.y, CR1, 16), it.z0 + CH);
    mk("path", { d: poly(hull(foot.concat(top))), class: "sil" }, grp);
    mk("path", { d: poly(top), class: "nf lo" }, grp);
    it.frontP = mk("path", { class: "nf sil" }, grp);
  }
  tier(0, 21, TB);
  items.slice(0, 3).forEach(build);
  tier(21, 42, TF);
  items.slice(3).forEach(build);

  /** A ring turned about the screen-level axis by th, its far side rising toward the reader. */
  function draw(it, lift, th) {
    const key = lift.toFixed(2) + "," + th.toFixed(3);
    if (key === it.last) return;
    it.last = key;
    const cz = it.z0 + RZ + lift, ct = Math.cos(th), st = Math.sin(th);
    const at = (r, t) => { const a = r * Math.cos(t), b = r * Math.sin(t);
      return P(it.x + a * S2 + b * ct * S2, it.y - a * S2 + b * ct * S2, cz - b * st); };
    const half = (r, s) => Array.from({ length: 15 }, (_, i) => at(r, s + (i / 14) * Math.PI));
    it.back.setAttribute("d", open(half(RR, Math.PI)) + open(half(RR - 1.3, Math.PI)));
    it.frontP.setAttribute("d", open(half(RR, 0)) + open(half(RR - 1.3, 0)));
    const s = at(RR + 0.6, -Math.PI / 2);
    it.stone.setAttribute("cx", s[0]); it.stone.setAttribute("cy", s[1]);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.lift, now), tval(it.turn, now)); if (!tdone(it.lift, now) || !tdone(it.turn, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.z0 + RZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, (m[1] - sy) * 1.4); if (d < bd) { bd = d; best = k; } });
    return bd < 34 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const lit = k === (a < 0 ? FAV : a);
      const near = a < 0 ? 0 : Math.hypot(it.x - items[a].x, it.y - items[a].y);
      const lift = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : k === a ? LIFT : near < 30 ? 3 : 0;
      const delay = from < 0 ? 0 : (Math.hypot(it.x - items[from].x, it.y - items[from].y) / 23) * stag;
      tset(it.lift, lift, now, delay); tset(it.turn, a < 0 ? (k === FAV ? 0.6 : 0) : k === a ? 1.05 : 0, now, delay);
      it.back.classList.toggle("hi", lit); it.frontP.classList.toggle("hi", lit);
      it.stone.setAttribute("class", lit ? "dot" : "dot off");
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
  name: "jewelrydisplay",
  means: "A two-tier jewellery tray of ring cones: the ring under the pointer lifts off its cone and turns its face to you.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[174, 118], [275, 167], [204, 198], null],
  mount,
});
