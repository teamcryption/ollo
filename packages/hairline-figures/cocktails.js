/**
 * Cocktails: five glasses in a row on a bar top, a martini, a coupe, a
 * highball, a tumbler and a flute, each with its rim and the line of the
 * drink inside. The pointer picks a glass by where it stands: it lifts and
 * its drink rises toward the rim, and the glasses beside it lift a little,
 * staggered from it. At rest one glass is raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many in a single row (cloches); the pick is the glass
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const STEP = 34, X0 = 18, GY = 20, TZ = 5, LIFT = 13, FAV = 2;
const coupe = []; for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); coupe.push([0.8 + 10.5 * Math.sin(t), 7 * (1 - Math.cos(t))]); }
// each glass: a stem height (0 for none), a foot radius, and the bowl's profile [r, z] from its bottom up
const GL = [
  { stem: 12, foot: 6.5, prof: [[0.8, 0], [13, 11]] },
  { stem: 11, foot: 6.5, prof: coupe },
  { stem: 0, foot: 0, prof: [[6.5, 0], [6.5, 1.5], [7, 31]] },
  { stem: 0, foot: 0, prof: [[8.5, 0], [8.5, 1.5], [9, 15]] },
  { stem: 10, foot: 5.5, prof: [[1.4, 0], [4.4, 6], [5, 24]] },
];
const X1 = X0 * 2 + STEP * 4;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rAt = (prof, z) => { for (let i = 1; i < prof.length; i++) { const [r0, z0] = prof[i - 1], [r1, z1] = prof[i]; if (z <= z1) return r0 + ((r1 - r0) * (z - z0)) / (z1 - z0 || 1); } return prof[prof.length - 1][0]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [X1, 40, 0], [X1, 0, 0], [0, 40, 0], [X0 + 2 * STEP, GY, TZ + 32 + LIFT], [X0, GY, TZ + 24 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, 40, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, TZ));

  const items = GL.map((gl, k) => {
    const grp = mk("g", {}, g), it = { k, ...gl, x: X0 + k * STEP, top: gl.prof[gl.prof.length - 1][1] };
    if (gl.stem) { it.footS = solid(grp); it.stemS = solid(grp); }
    it.bowl = mk("path", { class: "sil" }, grp);
    it.rim = mk("path", { class: "nf lo" }, grp);
    it.drink = mk("path", { class: "nf lo" }, grp);
    it.z = tween(k === FAV ? LIFT * 0.6 : 0); it.f = tween(0.5); it.last = "";
    return it;
  });

  function draw(it, lift, f) {
    const key = lift.toFixed(2) + "," + f.toFixed(3);
    if (key === it.last) return;
    it.last = key;
    const x = it.x, z0 = TZ + lift;
    if (it.stem) {
      put(it.footS, prism(P, front, disc(x, GY, it.foot, 36), null, z0, z0 + 0.8));
      put(it.stemS, prism(P, front, disc(x, GY, 0.8, 12), null, z0 + 0.8, z0 + it.stem));
    }
    const b = z0 + it.stem, pts = [];
    for (const [r, z] of it.prof) pts.push(...ringAt(P, disc(x, GY, r, 36), b + z));
    it.bowl.setAttribute("d", poly(hull(pts)));
    it.rim.setAttribute("d", poly(ringAt(P, disc(x, GY, it.prof[it.prof.length - 1][0] - 0.6, 36), b + it.top)));
    const dz = it.top * f;
    it.drink.setAttribute("d", poly(ringAt(P, disc(x, GY, rAt(it.prof, dz) - 0.8, 36), b + dz)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now), tval(it.f, now)); if (!tdone(it.z, now) || !tdone(it.f, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, GY, TZ + (it.stem + it.top) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : d === 0 ? LIFT : d === 1 ? 3 : 0;
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.z, z, now, delay); tset(it.f, a === k ? 0.85 : 0.5, now, delay);
      it.bowl.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "glass " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cocktails",
  means: "Five cocktail glasses on a bar top: the glass under the pointer lifts and its drink rises, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[153, 140], [247, 178], [294, 201], null],
  mount,
});
