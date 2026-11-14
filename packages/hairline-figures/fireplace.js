/**
 * Fireplace: a chimney breast with a mantel shelf and an arched opening,
 * three logs lying on the hearth in front of it. The pointer picks a log
 * by where it stands: it lifts off the hearth, its neighbours rise a little,
 * staggered from it. At rest the middle log is raised, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, XS = [26, 45, 64], R = 6, LIFT = 20, FAV = 1, HZ = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-8, -4, 0], [98, 64, 0], [98, -4, 80], [-8, 64, 0], [-8, -4, 80]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // chimney breast
  const [br, bi] = rings(0, 0, 90, 30, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 70));
  // the opening: an arch on the front face, a back line inside it
  const arch = [];
  for (let i = 0; i <= 16; i++) { const a = Math.PI * (i / 16); arch.push(P(45 - 26 * Math.cos(a), 30, 30 + 14 * Math.sin(a))); }
  mk("path", { d: poly([P(19, 30, HZ), ...arch, P(71, 30, HZ)]), class: "nf" }, g);
  mk("path", { d: open([P(23, 30, HZ), P(23, 22, HZ + 2), P(67, 22, HZ + 2), P(67, 30, HZ)]), class: "nf lo" }, g);
  // mantel shelf
  const [mr, mi] = rings(-8, -4, 98, 36, 2, 1);
  put(solid(g), prism(P, front, mr, mi, 70, 75));
  // hearth
  const [hr, hi] = rings(-6, 30, 96, 62, 3, 1.5);
  put(solid(g), prism(P, front, hr, hi, 0, HZ));

  const logs = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    logs.push({ k, x: XS[k], sil: mk("path", { class: "sil" }, grp), end: mk("path", { class: "nf lo" }, grp), ring: mk("path", { class: "nf lo" }, grp), z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }
  function circleAt(x, y, z, r, n = 28) { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(P(x + r * Math.cos(a), y, z + r * Math.sin(a))); } return o; }
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z = HZ + R + lift, a = circleAt(it.x, 34, z, R), b = circleAt(it.x, 58, z, R);
    it.sil.setAttribute("d", poly(hull(a.concat(b))));
    it.end.setAttribute("d", poly(b));
    it.ring.setAttribute("d", poly(circleAt(it.x, 58, z, R * 0.45, 16)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of logs) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = logs.map((it) => P(it.x, 46, HZ + R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 && Math.abs(mids[best][1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    logs.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : 4;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "log " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fireplace",
  means: "A fireplace with three logs on the hearth: the log under the pointer lifts off, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[153, 215], [179, 228], [204, 241], null],
  mount,
});
