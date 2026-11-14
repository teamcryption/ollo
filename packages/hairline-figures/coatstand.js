/**
 * Umbrella stand: a round bin by the door with three furled umbrellas
 * standing in it, tips down and hooked handles up. The pointer picks an
 * umbrella by its handle: it lifts out of the bin, and the others shift a
 * little, staggered. At rest one stands drawn up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), inside a container.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

const R = 24, BH = 34, LIFT = 22, FAV = 1;
const U = [[-12, 9, 1, -0.4], [-1, -8, 0.6, 0.8], [12, -1, -0.2, 1]], REST = [3, 12, 0];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [-12, 9, 66 + LIFT], [12, -1, 66 + LIFT], [-1, -8, 66 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ring = disc(0, 0, R, 48);
  const back = solid(g);
  back.sil.setAttribute("d", poly(hull(ringAt(P, ring, 0).concat(ringAt(P, ring, BH)))));
  mk("path", { d: poly(ringAt(P, disc(0, 0, R - 1.6, 48), BH)), class: "nf lo" }, back.g);

  const items = U.map(([x, y, dx, dy], k) => {
    const s = solid(g), hook = mk("path", { class: "nf sil" }, s.g);
    const n = Math.hypot(dx, dy);
    return { k, x, y, dx: dx / n, dy: dy / n, s, hook, z: tween(REST[k]), last: NaN };
  });
  const fr = ring.filter(front);
  const fw = mk("path", { d: poly(hull(ringAt(P, fr, 0).concat(ringAt(P, fr, BH)))), class: "sil" }, g);
  mk("path", { d: open(ringAt(P, fr, BH - 3)), class: "nf lo" }, g);

  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const b = 2 + z, pts = [];
    for (const [r, h] of [[0.8, 0], [1.6, 10], [4.4, 26], [5.4, 42], [3, 52], [1.2, 58]]) pts.push(...ringAt(P, disc(it.x, it.y, r, 16), b + h));
    it.s.sil.setAttribute("d", poly(hull(pts)));
    it.s.cr.setAttribute("d", open([P(it.x, it.y, b + 20), P(it.x, it.y, b + 42)]));
    const top = b + 58, cx = it.x + 6 * it.dx, cy = it.y + 6 * it.dy, hk = [];
    for (let i = 0; i <= 14; i++) { const t = Math.PI - (i / 14) * (Math.PI + 0.7); hk.push(P(cx + 6 * Math.cos(t) * it.dx, cy + 6 * Math.cos(t) * it.dy, top + 6 * Math.sin(t))); }
    it.hook.setAttribute("d", open(hk));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, 60));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && sy > mids[best][1] - 90 && sy < mids[best][1] + 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : 2;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.s.sil.classList.toggle("hi", on); it.hook.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "brolly " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren(), () => fw.remove());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coatstand",
  means: "An umbrella stand with three furled umbrellas: the one under the pointer lifts out of the bin by its hooked handle.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 90], [214, 60], [226, 104], null],
  mount,
});
