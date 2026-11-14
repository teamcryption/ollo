/**
 * Music stands: three stands in a row, each a round foot, a pole and a desk
 * with a ledge and a sheet on it. The pointer picks a stand by where it
 * stands and its desk tilts back toward reading, the neighbours following a
 * little, staggered from it. At rest the desks lean unevenly and the middle
 * one is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 48, PH = 44, DW = 17, DH = 24, FAV = 1, REST = [14, 30, 20], UP = 58;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const X1 = (N - 1) * STEP;
  fit(C, [[-DW, -DH, 0], [X1 + DW, 12, 0], [-DW, -DH, PH + DH], [X1 + DW, 12, PH + DH], [-DW, 12, 0], [X1 + DW, -DH, PH + DH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, 0, 10), disc(x, 0, 8.4), 0, 1.6));
    put(solid(grp), prism(P, front, disc(x, 0, 1.3, 12), disc(x, 0, 0.6, 12), 1.6, PH));
    const desk = mk("path", { class: "sil" }, grp), sheet = mk("path", { class: "nf lo" }, grp), ledge = mk("path", { class: "nf" }, grp);
    items.push({ k, x, desk, sheet, ledge, a: tween(REST[k]), last: NaN });
  }

  const at = (x, a, u, s, t = 0) => {
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    return P(x + u, -s * sa + t * ca, PH + s * ca + t * sa);
  };
  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = [];
    for (const u of [-DW, DW]) for (const s of [0, DH]) for (const t of [0, 1.4]) pts.push(at(it.x, a, u, s, t));
    it.desk.setAttribute("d", poly(hull(pts)));
    it.sheet.setAttribute("d", poly([at(it.x, a, -DW + 4, 4, 1.4), at(it.x, a, DW - 4, 4, 1.4), at(it.x, a, DW - 4, DH - 2, 1.4), at(it.x, a, -DW + 4, DH - 2, 1.4)]));
    it.ledge.setAttribute("d", poly(hull([at(it.x, a, -DW, 0, 1.4), at(it.x, a, DW, 0, 1.4), at(it.x, a, DW, 0, 4), at(it.x, a, -DW, 0, 4), at(it.x, a, DW, 2, 4), at(it.x, a, -DW, 2, 4)])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, PH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? UP : dd === 1 ? 26 : 12;
      tset(it.a, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.desk.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "desk " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "musicstands",
  means: "Three music stands in a row: the desk under the pointer tilts back toward reading, its neighbours following a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[133, 92], [203, 125], [273, 160], null],
  mount,
});
