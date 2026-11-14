/**
 * Lunar habitat: three round modules on a landing pad, joined by short
 * tunnels, each capped with an observation dome. The pointer picks a module
 * by where it stands: its dome rises on a telescoping neck, and the domes
 * beside it rise a little, staggered from it. At rest one dome stands raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 44, MR = 16, PZ = 4, MH = 22, LIFT = 16, FAV = 0, Y = 22, DR = 11;
const X1 = (N - 1) * STEP + 2 * MR;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -2, 0], [X1 + 8, 2 * Y + 2, 0], [X1 + 8, -2, 0], [-8, 2 * Y + 2, 0], [MR, Y, PZ + MH + LIFT + DR + 4], [X1 - MR, Y, PZ + MH + LIFT + DR + 4]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-8, -2, X1 + 8, 2 * Y + 2, 10, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = MR + k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, Y, MR, 40), disc(x, Y, MR - 2, 40), PZ, PZ + MH));
    const neck = mk("path", { class: "sil" }, grp), dome = mk("path", { class: "sil" }, grp), rim = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, neck, dome, rim, z: tween(k === FAV ? LIFT * 0.8 : 0), last: NaN });
    if (k < N - 1) {
      const [tr, ti] = rings(x + MR - 3, Y - 5, x + STEP - MR + 3, Y + 5, 3, 1);
      put(solid(g), prism(P, front, tr, ti, PZ, PZ + 9));
    }
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const top = PZ + MH, base = top + lift, pts = [];
    it.neck.setAttribute("d", lift < 0.3 ? "" : poly(hull(ringAt(P, disc(it.x, Y, 5), top).concat(ringAt(P, disc(it.x, Y, 5), base)))));
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, Y, DR * Math.cos(t), 28), base + DR * Math.sin(t))); }
    it.dome.setAttribute("d", poly(hull(pts)));
    it.rim.setAttribute("d", poly(ringAt(P, disc(it.x, Y, DR, 40), base + 1.2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y, PZ + MH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.8 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.dome.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "module " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "moonbase",
  means: "Three habitat modules joined by tunnels on a lunar pad: the module under the pointer raises its dome on a neck, neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[146, 110], [200, 130], [254, 152], null],
  mount,
});
