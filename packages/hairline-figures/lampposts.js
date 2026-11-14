/**
 * Street lamps: four lamp posts along a kerb, each with an arm carrying a
 * shade. The pointer picks a post by where it stands: its arm swings round
 * to hang the shade out over the street, and the arms beside it turn a
 * little, staggered from it. At rest one arm is swung out, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, PH = 64, L = 24, FAV = 1, KZ = 4;
const REST = [20, 95, 40, 10];
const X1 = (N - 1) * STEP + 12;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, 0], [X1 + 6, 30, 0], [X1 + 6, -6, 0], [-6, 30, 0], [6, 6, PH + 8], [X1 - 6, 6, PH + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [kr, ki] = rings(-6, -6, X1 + 6, 30, 5, 2);
  put(solid(g), prism(P, front, kr, ki, 0, KZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 6 + k * STEP, y = 6, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, 4.5), disc(x, y, 3.2), KZ, KZ + 6));
    put(solid(grp), prism(P, front, disc(x, y, 2), disc(x, y, 1.2), KZ + 6, KZ + PH));
    const arm = mk("path", { class: "nf" }, grp), shade = mk("path", { class: "sil" }, grp), lip = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, arm, shade, lip, a: tween(REST[k]), last: NaN });
  }

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const zt = KZ + PH, ex = it.x + L * Math.cos(rad(a)), ey = it.y + L * Math.sin(rad(a));
    it.arm.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, 1.3, 12), zt).concat(ringAt(P, disc(ex, ey, 1.3, 12), zt), ringAt(P, disc(it.x, it.y, 1.3, 12), zt + 2), ringAt(P, disc(ex, ey, 1.3, 12), zt + 2)))));
    it.shade.setAttribute("d", poly(hull(ringAt(P, disc(ex, ey, 2.5), zt + 1).concat(ringAt(P, disc(ex, ey, 7.5, 32), zt - 7)))));
    it.lip.setAttribute("d", poly(ringAt(P, disc(ex, ey, 6, 32), zt - 7)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y + 8, KZ + PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 85 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? 155 : dd === 1 ? 70 : 25;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
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
  name: "lampposts",
  means: "Four lamp posts on a kerb: the arm of the post under the pointer swings its shade out over the street, its neighbours turn a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[176, 149], [261, 200], [134, 137], null],
  mount,
});
