/**
 * Tablets: four tablets leaning back on a display stand, each propped behind
 * a lip on a shared base, each with its screen inset from the bezel. The
 * pointer picks a tablet by where it stands: it swings upright to face the
 * viewer, and the tablets beside it lift a little, staggered from it. At rest
 * the angles differ and one tablet is up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, TW = 28, TH = 38, T = 2, Y0 = 10, PZ = 4, UP = 84, FAV = 2;
const REST = [52, 58, 74, 48];
const X1 = (N - 1) * STEP + TW;
const face = rrect(0, 0, TW, TH, 4, 4), scr = rrect(2.5, 2.5, TW - 2.5, TH - 2.5, 2, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -TH, 0], [X1 + 4, Y0 + 10, 0], [X1 + 4, -6, 0], [-4, Y0 + 10, 0], [0, Y0, PZ + TH], [X1, Y0, PZ + TH]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, Y0 + 10, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, PZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), screen = mk("path", { class: "nf lo" }, grp);
    const [lr, li] = rings(x0 + 2, Y0 + T + 0.5, x0 + TW - 2, Y0 + T + 4, 1.5, 0.8);
    put(solid(grp), prism(P, front, lr, li, PZ, PZ + 4));
    items.push({ k, x0, body, screen, a: tween(k === FAV ? UP : REST[k]), last: NaN });
  }

  // a point on the tablet: u across, s up the plate, o out of the face
  function pt(x0, th, u, s, o) {
    const c = Math.cos(rad(th)), sn = Math.sin(rad(th));
    return P(x0 + u, Y0 - s * c + o * sn, PZ + s * sn + o * c);
  }

  function draw(it, th) {
    if (th === it.last) return;
    it.last = th;
    const pts = [];
    for (const q of face) pts.push(pt(it.x0, th, q.u, q.v, 0), pt(it.x0, th, q.u, q.v, T));
    it.body.setAttribute("d", poly(hull(pts)));
    it.screen.setAttribute("d", poly(scr.map((q) => pt(it.x0, th, q.u, q.v, T))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + TW / 2, Y0, PZ + TH / 2));
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
      const dd = Math.abs(k - a), th = a < 0 ? (k === FAV ? UP : REST[k]) : dd === 0 ? UP : dd === 1 ? 60 : 46;
      tset(it.a, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tablets",
  means: "Four tablets leaning on a stand: the tablet under the pointer swings upright to face you, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 126], [173, 149], [264, 194], null],
  mount,
});
