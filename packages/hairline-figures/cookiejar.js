/**
 * Cookie jars: three round jars of different heights on a counter, each with
 * a flat lid and a knob. The pointer picks a jar by where it stands: its lid
 * lifts off and a cookie rises out of the mouth. At rest one lid sits a
 * little raised, bright. The slider is the lift.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const JR = 16, STEP = 46, HS = [34, 46, 28], FAV = 1, CZ = 4;
const X1 = 2 * STEP + 2 * JR + 4;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.0);
  const top = CZ + 46 + 34 + 8;
  fit(C, [[-8, -8, 0], [X1 + 8, 2 * JR + 12, 0], [X1 + 8, -8, 0], [-8, 2 * JR + 12, 0], [JR + 2 + STEP, JR + 2, top]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-8, -8, X1 + 8, 2 * JR + 12, 7, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));

  const jars = HS.map((h, k) => {
    const x = JR + 2 + k * STEP, y = JR + 2, grp = mk("g", {}, g), z1 = CZ + h;
    put(solid(grp), prism(P, front, disc(x, y, JR), disc(x, y, JR - 1.5), CZ, z1));
    // a raised band round the shoulder
    const band = ringAt(P, disc(x, y, JR, 40).filter(front), z1 - 7);
    mk("path", { d: band.length ? "M" + band.map((p) => p.join(",")).join("L") : "", class: "nf lo" }, grp);
    const treat = solid(grp), lid = solid(grp), knob = solid(grp);
    return { k, x, y, z1, treat, lid, knob, z: tween(k === FAV ? 0.25 : 0), last: NaN };
  });

  function draw(j, t) {
    if (t === j.last) return;
    j.last = t;
    const L = lift * t, lz = j.z1 + L, cz = j.z1 - 3 + L * 0.5;
    if (t > 0.3) put(j.treat, prism(P, front, disc(j.x, j.y, 11, 28), disc(j.x, j.y, 9.5, 28), cz, cz + 2.4));
    else put(j.treat, { sil: "", crease: "" });
    put(j.lid, prism(P, front, disc(j.x, j.y, JR + 1.5), disc(j.x, j.y, JR - 1), lz, lz + 3));
    put(j.knob, prism(P, front, disc(j.x, j.y, 3.2, 20), disc(j.x, j.y, 2, 20), lz + 3, lz + 7));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const j of jars) { draw(j, tval(j.z, now)); if (!tdone(j.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = jars.map((j) => P(j.x, j.y, j.z1 / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    jars.forEach((j, k) => {
      tset(j.z, a < 0 ? (k === FAV ? 0.25 : 0) : k === a ? 1 : 0, now, 0);
      j.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      j.knob.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; jars.forEach((j) => { j.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cookiejar",
  means: "Three cookie jars on a counter: the jar under the pointer lifts its lid and a cookie rises out of the mouth.",
  rules: [1, 4, 5, 6],
  range: [14, 26, 34],
  tour: [[135, 146], [200, 161], [265, 211], null],
  mount,
});
