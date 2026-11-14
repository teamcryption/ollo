/**
 * Pet feeders: three gravity feeders on a mat, each a tall hopper with a
 * bowl at its foot. The pointer picks a feeder by where it stands: its bowl
 * slides out from under the hopper and the kibble in it heaps up; the bowls
 * beside it ease out a little, staggered. At rest one bowl stands half out,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, HW = 13, HD = 9, HH = 44, BR = 11, OUT = 16, CZ = 3, FAV = 2;
const X1 = (N - 1) * STEP + 2 * HW + 8;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X1 + 4, 64, 0], [X1 + 4, -4, 0], [-4, 64, 0], [X1 - HW, 4, CZ + HH + 4], [HW + 4, 4, CZ + HH + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-4, -4, X1 + 4, 64, 7, 2);
  put(solid(g), prism(P, front, mr, mi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = HW + 4 + k * STEP, y = 4 + HD;
    // the hopper: a tall rounded bin with a lid plate and a window crease
    const [hr, hi] = rings(x - HW, y - HD, x + HW, y + HD, 5, 1.6);
    put(solid(g), prism(P, front, hr, hi, CZ, CZ + HH));
    const [lr, li] = rings(x - HW - 1.5, y - HD - 1.5, x + HW + 1.5, y + HD + 1.5, 6, 1.2);
    put(solid(g), prism(P, front, lr, li, CZ + HH, CZ + HH + 2.5));
    mk("path", { d: poly([P(x - 6, y + HD, CZ + 14), P(x + 6, y + HD, CZ + 14), P(x + 6, y + HD, CZ + HH - 8), P(x - 6, y + HD, CZ + HH - 8)]), class: "nf lo" }, g);
    items.push({ k, x, y: y + HD + BR - 4, last: NaN, s: tween(k === FAV ? OUT * 0.55 : 0) });
  }
  // bowls go in front of every hopper, near to far does not cross on screen
  for (const it of items) {
    it.grp = mk("g", {}, g);
    it.bowl = mk("path", { class: "sil" }, it.grp);
    it.rim = mk("path", { class: "nf lo" }, it.grp);
    it.heap = mk("path", { class: "nf" }, it.grp);
  }

  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const y = it.y + s, top = CZ + 6.5, f = s / OUT;
    it.bowl.setAttribute("d", poly(hull(ringAt(P, disc(it.x, y, BR - 3), CZ).concat(ringAt(P, disc(it.x, y, BR), top)))));
    it.rim.setAttribute("d", poly(ringAt(P, disc(it.x, y, BR - 1.4), top)));
    const pts = [];
    for (const [r, z] of [[BR - 2, -1], [7, 1 + 2 * f], [4, 2.5 + 3 * f], [1.5, 3 + 4 * f]]) pts.push(...ringAt(P, disc(it.x, y, r, 20), top + z));
    it.heap.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // each feeder's rest axis, bowl to hopper top: fixed, so the hit never moves
  const axes = items.map((it) => [P(it.x, it.y, CZ + 3), P(it.x, 13, CZ + HH)]);
  function hit([sx, sy]) {
    let best = -1, bd = 26;
    axes.forEach(([a, b], k) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((sx - a[0]) * dx + (sy - a[1]) * dy) / (dx * dx + dy * dy)));
      const dd = Math.hypot(sx - a[0] - t * dx, sy - a[1] - t * dy);
      if (dd < bd) { bd = dd; best = k; }
    });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 4 : 0;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.bowl.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bowl " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "petfeeders",
  means: "Three gravity pet feeders on a mat: the bowl under the pointer slides out and its kibble heaps up; neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[143, 162], [186, 197], [257, 218], null],
  mount,
});
