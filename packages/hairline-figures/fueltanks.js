/**
 * Fuel tanks: three upright tanks on a concrete pad, a pipe running along
 * their feet, each with a filler hatch on its crown. The pointer picks a tank
 * by where it stands: its hatch lifts open, and the hatches beside it rise a
 * little, staggered from it. At rest one hatch stands open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 44, TR = 18, TH = [44, 52, 40], LIFT = 12, FAV = 1, CZ = 3;
const X1 = (N - 1) * STEP + 2 * TR + 8;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [X1, 2 * TR + 12, 0], [X1, -4, 0], [-4, 2 * TR + 12, 0], [TR + 4 + STEP, TR, CZ + 52 + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, X1, 2 * TR + 12, 5, 2);
  put(solid(g), prism(P, front, pr, pi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = TR + 4 + k * STEP, y = TR, h = CZ + TH[k], grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, TR), disc(x, y, TR - 1.6), CZ, h));
    // a band round the shell where its two courses meet
    mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, y, TR, 40).filter(front), h * 0.5)).replace(/Z$/, "") }, grp);
    const neck = solid(grp);
    put(neck, prism(P, front, disc(x + 6, y + 4, 4, 20), disc(x + 6, y + 4, 3, 20), h, h + 2));
    const lid = mk("path", { class: "sil" }, grp);
    items.push({ k, x, y, h, grp, lid, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }
  // the pipe along the tanks' feet, in front of them
  const pipe = solid(g);
  put(pipe, prism(P, front, rings(4, 2 * TR + 4, X1 - 4, 2 * TR + 8, 2, 0.6)[0], rings(4, 2 * TR + 4, X1 - 4, 2 * TR + 8, 2, 0.6)[1], CZ, CZ + 4));

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    // the hatch hinges at its back edge: it tilts up as it lifts
    const cx = it.x + 6, cy = it.y + 4, a = lift / LIFT, pts = [];
    for (const q of disc(cx, cy, 5, 24)) {
      const z = it.h + 2 + (q.v - (cy - 5)) * a * 1.6 + 0.2;
      pts.push(P(q.u, q.v, z), P(q.u, q.v, z + 1.4));
    }
    it.lid.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tank " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fueltanks",
  means: "Three fuel tanks on a pad: the tank under the pointer opens its filler hatch, and its neighbours' hatches lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [250, 180], null],
  mount,
});
