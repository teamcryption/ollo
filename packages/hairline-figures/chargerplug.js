/**
 * Charger plug: a charging pedestal with four round sockets along its top,
 * each holding a plug. The plug under the pointer lifts out of its socket to
 * show the pin holes, its neighbours rise a little, staggered from it. At
 * rest one plug is half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, SR = 13, PR = 9.5, LIFT = 26, FAV = 2, H = 14, PL = 22;
const X1 = (N - 1) * STEP + 2 * SR;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * SR + 6, 0], [X1 + 6, -6, 0], [-6, 2 * SR + 6, 0], [SR, SR, H + 4 + PL + LIFT], [X1 - SR, SR, H + 4 + PL + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, 2 * SR + 6, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = SR + k * STEP, y = SR, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, SR), disc(x, y, SR - 2), H, H + 4));
    // pin holes on the socket face: a ring of five round holes and one in the middle
    const top = H + 4;
    for (let j = 0; j < 6; j++) {
      const a = (j / 5) * Math.PI * 2, rr = j === 5 ? 0 : 5.5;
      mk("path", { d: poly(ringAt(P, disc(x + rr * Math.cos(a), y + rr * Math.sin(a), 1.6, 12), top)), class: "nf lo" }, grp);
    }
    const body = solid(grp), grip = mk("path", { class: "nf" }, grp);
    items.push({ k, x, y, body, grip, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = H + 4.2 + lift, z1 = z0 + PL;
    put(it.body, prism(P, front, disc(it.x, it.y, PR), disc(it.x, it.y, PR - 1.6), z0, z1));
    // the handle: a flat loop standing on the plug's back
    const hz = z1, pts = [];
    for (const [u, v, z] of [[-PR + 3, 0, hz], [PR - 3, 0, hz], [PR - 4, 0, hz + 9], [-PR + 4, 0, hz + 9]]) pts.push(P(it.x + u * 0.7, it.y + u * 0.7, z));
    for (const [u, z] of [[-PR + 3, hz], [PR - 3, hz], [PR - 4, hz + 9], [-PR + 4, hz + 9]]) pts.push(P(it.x + u * 0.7 + 1.5, it.y + u * 0.7 - 1.5, z));
    it.grip.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H + PL / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "port " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "chargerplug",
  means: "A charging pedestal with four sockets: the plug under the pointer lifts out to show its pin holes, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[128, 106], [176, 130], [272, 179], null],
  mount,
});
