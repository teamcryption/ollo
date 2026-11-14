/**
 * Pendant lamps: four shades hung on cords from a ceiling rail, at uneven
 * heights. The pointer picks a lamp by where it stands: its cord pays out and
 * the shade lowers, and the lamps beside it drop a little, staggered from it.
 * At rest the lowest shade is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 38, TOP = 118, DROP = [34, 50, 28, 42], LOW = 20, FAV = 1, SR = 15, SH = 14;
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-SR, -SR, TOP + 6], [X1 + SR, SR, TOP + 6], [-SR, SR, TOP - 74 - SH], [X1 + SR, SR, TOP - 74 - SH], [X1 + SR, -SR, TOP + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-10, -4, X1 + 10, 4, 4, 1.2);
  put(solid(g), prism(P, front, rr, ri, TOP, TOP + 5));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    const cord = mk("path", { class: "nf lo" }, grp), shade = mk("path", { class: "sil" }, grp);
    const band = mk("path", { class: "nf lo" }, grp), cap = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, grp, cord, shade, band, cap, d: tween(DROP[k]), last: NaN });
  }

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const z1 = TOP - d, z0 = z1 - SH;
    it.cord.setAttribute("d", seg(P(it.x, it.y, TOP), P(it.x, it.y, z1 + 3)));
    const pts = ringAt(P, disc(it.x, it.y, 3.5, 20), z1).concat(ringAt(P, disc(it.x, it.y, SR), z0));
    it.shade.setAttribute("d", poly(hull(pts)));
    it.band.setAttribute("d", open(ringAt(P, run(disc(it.x, it.y, SR * 0.62), front), z0 + SH * 0.38)));
    it.cap.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 2.4, 16), z1).concat(ringAt(P, disc(it.x, it.y, 2.4, 16), z1 + 3)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, TOP - DROP[it.k] - SH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && sy > P(0, 0, TOP + 8)[1] - 40 && sy < mids[best][1] + 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = DROP[k] + (a < 0 ? 0 : dd === 0 ? LOW : dd === 1 ? 5 : 0);
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.shade.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lamp " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pendantlamps",
  means: "Four shades hung from a ceiling rail: the lamp under the pointer lowers on its cord, and its neighbours drop a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[131, 132], [223, 169], [269, 212], null],
  mount,
});
