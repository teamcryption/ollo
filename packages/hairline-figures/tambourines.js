/**
 * Tambourines: four frame drums lying in a row, each with pairs of jingles
 * set into its rim. The pointer picks a tambourine by where it stands: it
 * lifts and tips up toward the viewer as if raised to shake, and the ones
 * beside it rise a little, staggered from it. At rest one is raised, bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, proj, ringAt, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const N = 4, STEP = 42, R = 18, H = 7, LIFT = 24, TIP = 10, FAV = 2;
const X1 = (N - 1) * STEP + 2 * R;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [X1, 2 * R, 0], [X1, 0, 0], [0, 2 * R, 0], [R, R, LIFT + TIP + H + 4], [X1 - R, R, LIFT + TIP + H + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + k * STEP, y = R, grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp), jn = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, sil, cr, jn, ring: disc(x, y, R), inner: disc(x, y, R - 2.2), z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const tip = (lift / LIFT) * TIP;
    // tip toward the viewer: the far side rises with the lift
    const at = (ring, z) => ring.map((q) => P(q.u, q.v, z + lift + tip * ((it.x + it.y - q.u - q.v) / (2 * R))));
    it.sil.setAttribute("d", poly(hull(at(it.ring, 0).concat(at(it.ring, H)))));
    it.cr.setAttribute("d", poly(at(it.inner, H)));
    let d = "";
    for (const a of [0.35, 0.95, 1.55, 2.15]) {
      const q = { u: it.x + R * Math.cos(a + 0.3), v: it.y + R * Math.sin(a + 0.3) };
      const [p] = at([q], H / 2), c = Math.cos(a + 0.3), s = Math.sin(a + 0.3);
      const [p2] = at([{ u: q.u - 3 * s, v: q.v + 3 * c }], H / 2);
      d += seg([p[0], p[1] - 1.6], [p2[0], p2[1] - 1.6]) + seg([p[0], p[1] + 1.6], [p2[0], p2[1] + 1.6]);
    }
    it.jn.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drum " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tambourines",
  means: "Four tambourines in a row: the one under the pointer lifts and tips up as if to shake, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[110, 150], [228, 210], [290, 240], null],
  mount,
});
