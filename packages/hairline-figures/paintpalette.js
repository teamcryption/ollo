/**
 * Paint palette: an artist's board with a thumb hole and six dabs of paint
 * round its far rim. The pointer picks the nearest dab on the board: it
 * swells up into a tall blob, and the dabs beside it swell a little,
 * staggered from it. At rest the dabs sit at uneven heights and one is
 * bright. The slider is the stagger.
 *
 * The pattern: one of many on a plane (terrain), picked on the ground.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 130, D = 90, BZ = 4, FAV = 2, LIFT = 28;
const DABS = [[18, 16, 8], [44, 12, 9], [72, 14, 8], [100, 18, 9], [112, 44, 8], [104, 70, 7]];
const REST = [3, 5, 9, 4, 6, 3];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [W / 2, 10, BZ + LIFT + 10], [W, D / 2, BZ + LIFT + 10]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 30, 2.2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the thumb hole: its rim, cut through the board
  mk("path", { d: poly(ringAt(P, disc(28, 66, 9, 28), BZ)), class: "nf" }, g);

  const order = DABS.map((d, k) => k).sort((a, b) => DABS[a][0] + DABS[a][1] - DABS[b][0] - DABS[b][1]);
  const items = DABS.map(([x, y, r], k) => ({ k, x, y, r, z: tween(REST[k]), last: NaN }));
  for (const k of order) { const it = items[k]; it.s = mk("path", { class: "sil" }, g); it.c = mk("path", { class: "nf lo" }, g); }

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const pts = [], n = 6;
    for (let i = 0; i <= n; i++) {
      const t = i / n, rr = it.r * Math.sqrt(1 - t * t * 0.92);
      pts.push(...ringAt(P, disc(it.x + t * 2, it.y, rr, 20), BZ + h * t));
    }
    it.s.setAttribute("d", poly(hull(pts)));
    it.c.setAttribute("d", poly(ringAt(P, disc(it.x + 1, it.y, it.r * 0.55, 18), BZ + h * 0.62)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(it.x - x, it.y - y); if (d < bd) { bd = d; best = k; } });
    return bd < 20 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 9 : 2;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "dab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "paintpalette",
  means: "An artist's palette with six dabs of paint: the dab under the pointer swells up tall, its neighbours swell a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[173, 115], [294, 179], [221, 222], null],
  mount,
});
