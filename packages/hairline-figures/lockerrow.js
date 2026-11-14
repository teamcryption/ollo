/**
 * School lockers: a row of tall lockers on a plinth, each door with three vent
 * slots and a handle. The pointer picks a locker by where it stands and its
 * door swings open on its hinge; the doors beside it crack open a little,
 * staggered from it. At rest one door stands ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, LW = 14, D = 15, H = 62, Z0 = 6, Z1 = 60, DW = 12.4, FAV = 2, OPEN = 105;
const X1 = N * LW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-3, -3, 0], [X1 + 3, D + 3 + DW, 0], [X1 + 3, -3, 0], [-3, D + 3 + DW, 0], [-3, -3, H + 3], [X1 + 3, D + 3, H + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-3, -3, X1 + 3, D + 3, 3, 1.4);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [br, bi] = rings(0, 0, X1, D, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, 4, H));
  for (let k = 1; k < N; k++) {
    const x = k * LW;
    mk("path", { d: "M" + P(x, D, Z0 - 1).join(" ") + "L" + P(x, D, Z1 + 1).join(" "), class: "nf lo" }, g);
  }

  const doors = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), det = mk("path", { class: "nf lo" }, grp);
    doors.push({ k, hx: k * LW + 0.8, sil, det, a: tween(k === FAV ? 26 : 0), last: NaN });
  }
  function draw(dr, a) {
    if (a === dr.last) return;
    dr.last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const q = (d, z) => P(dr.hx + d * c, D + 0.2 + d * s, z);
    dr.sil.setAttribute("d", poly([q(0, Z0), q(DW, Z0), q(DW, Z1), q(0, Z1)]));
    let d = "";
    for (const z of [53, 50, 47]) d += "M" + q(3, z).join(" ") + "L" + q(DW - 3, z).join(" ");
    d += "M" + q(DW - 2, 30).join(" ") + "L" + q(DW - 2, 36).join(" ");
    dr.det.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) { draw(d, tval(d.a, now)); if (!tdone(d.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = doors.map((d) => P(d.k * LW + LW / 2, D, 33));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 75 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    doors.forEach((d, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 26 : 0) : dd === 0 ? OPEN : dd === 1 ? 24 : 0;
      tset(d.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "locker " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockerrow",
  means: "A row of school lockers: the door under the pointer swings open on its hinge, and the doors beside it crack open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[148, 141], [186, 160], [234, 184], null],
  mount,
});
