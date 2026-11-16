/**
 * Sinkcaddy: a dish drying rack, a low tray with six plates standing in its
 * slots. The pointer picks a plate by where it stands: the plates before it
 * tilt back and the plates from it tilt forward, opening a gap at the chosen
 * plate, staggered from it. At rest the row leans in a loose fan, one plate
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 15, R = 24, Z0 = 5, YC = R + 4, FAV = 2, LEAN = 24;
const X1 = (N - 1) * STEP;
const D = Math.PI / 180;
const restA = (j) => (j < FAV ? -8 - 3 * (FAV - 1 - j) : 5 + 3 * (j - FAV));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-26, -2, 0], [X1 + 26, 2 * YC + 2, 0], [X1 + 26, -2, 0], [-26, 2 * YC + 2, 0], [-22, YC, 2 * R + Z0 + 4], [X1 + 22, YC, 2 * R + Z0 + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-24, 0, X1 + 24, 2 * YC, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, Z0 - 1));
  // the drain lip at the tray's front
  mk("path", { d: poly([P(X1 + 24, 8, 0), P(X1 + 30, 10, -1), P(X1 + 30, 2 * YC - 10, -1), P(X1 + 24, 2 * YC - 8, 0)]), class: "nf lo" }, g);

  const items = [];
  for (let j = 0; j < N; j++) {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    items.push({ j, x0: j * STEP, sil, cr, a: tween(restA(j)), last: NaN });
  }

  function pt(it, th, t, r, off) {
    const y = YC + r * Math.cos(t), h = R + r * Math.sin(t);
    return P(it.x0 + h * Math.sin(th) + off * Math.cos(th), y, Z0 + h * Math.cos(th) - off * Math.sin(th));
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const th = deg * D, out = [], inn = [];
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * 2 * Math.PI;
      out.push(pt(it, th, t, R, 0), pt(it, th, t, R, 1.8));
      inn.push(pt(it, th, t, R - 5, 1.8));
    }
    it.sil.setAttribute("d", poly(hull(out)));
    it.cr.setAttribute("d", poly(inn));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0, YC, Z0 + R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), ang = a < 0 ? restA(k) : k < a ? -LEAN + dd * 2 : LEAN - dd * 2;
      tset(it.a, ang, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "sinkcaddy",
  means: "A dish rack of standing plates: the plates part at the one under the pointer, tilting back and forward from it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 125], [188, 148], [258, 183], null],
  mount,
});
