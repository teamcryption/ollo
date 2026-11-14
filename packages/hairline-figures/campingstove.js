/**
 * Camping stove: a two-burner stove case with a squat pot and a tall pot on
 * its grates, each with a lid and knob, and a dial at the front for each
 * burner. The pointer picks a pot by where it stands: its lid lifts off to
 * let the steam out, and the other lid rises a little after it. At rest the
 * squat pot's lid sits ajar, bright. The slider is the lift.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SZ = 10, GZ = 12, FAV = 0, STAG = 40;
const POTS = [{ x: 28, y: 24, r: 19, h: 18 }, { x: 80, y: 24, r: 14, h: 27 }];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cyl = (P, front, x, y, r, z0, z1, b = 1.6) => prism(P, front, disc(x, y, r), disc(x, y, r - b), z0, z1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = clamp(value, 8, 26);
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [108, 48, 0], [108, 0, 0], [0, 48, 0], [28, 24, GZ + 18 + 30], [80, 24, GZ + 27 + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, 108, 48, 7, 2);
  put(solid(g), prism(P, front, cr, ci, 0, SZ));
  // burner grates: a low ring plate under each pot
  for (const p of POTS) put(solid(g), cyl(P, front, p.x, p.y, p.r + 3, SZ, GZ, 2));
  // dials on the front edge
  for (const p of POTS) put(solid(g), cyl(P, front, p.x, 44, 3.2, SZ, SZ + 3, 1));

  const items = POTS.map((p, k) => {
    const grp = mk("g", {}, g);
    put(solid(grp), cyl(P, front, p.x, p.y, p.r, GZ, GZ + p.h, 2));
    // the handle stub on the near side
    put(solid(grp), prism(P, front, ...rings(p.x - 3, p.y + p.r - 1, p.x + 3, p.y + p.r + 6, 1.5, 0.8), GZ + p.h - 6, GZ + p.h - 3));
    const lid = solid(grp), knob = solid(grp);
    return { k, p, grp, lid, knob, z: tween(k === FAV ? 5 : 0), last: NaN };
  });

  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    const { x, y, r, h } = it.p, base = GZ + h + z;
    put(it.lid, cyl(P, front, x, y, r + 1, base, base + 2, 2.2));
    put(it.knob, cyl(P, front, x, y, 2.6, base + 2, base + 5, 1));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.p.x, it.p.y, GZ + it.p.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 60 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const z = a < 0 ? (k === FAV ? 5 : 0) : k === a ? lift : 3;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * STAG);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "pot" : "tall pot";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = clamp(v, 8, 26); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "campingstove",
  means: "A two-burner camping stove with two pots: the lid of the pot under the pointer lifts off, the other rises a little after.",
  rules: [1, 2, 5, 6],
  range: [8, 18, 26],
  tour: [[160, 140], [238, 152], [200, 192], null],
  mount,
});
