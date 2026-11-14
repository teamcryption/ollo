/**
 * Thermometer case: a slim clinic case with a hinged half-shell lid and a
 * digital thermometer lying in its well. The pointer over the case swings
 * the lid back on its long hinge and the thermometer rises out of the well,
 * bright. At rest the lid sits cracked open, bright. The slider is how far
 * the lid swings.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween, rad, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, D = 26, H = 9, T = 7, REST = 22, RISE = 7;
const lidRing = rrect(0, 0, L, D, 9, 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [0, -T, H + D + 2], [L, -T, H + D + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, L, D, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [wr] = rings(5, 5, L - 5, D - 5, 6, 1);
  mk("path", { d: poly(ringAt(P, wr, H)), class: "nf lo" }, g);

  const lidPt = (u, s, t, a) => {
    const c = Math.cos(rad(a)), n = Math.sin(rad(a));
    return P(u, s * c - t * n, H + s * n + t * c);
  };
  const therm = mk("g", {}, g), lid = mk("g", {}, g);
  const tSil = mk("path", { class: "sil" }, therm), tCr = mk("path", { class: "nf lo" }, therm);
  const tWin = mk("path", { class: "nf lo" }, therm), tTip = mk("path", { class: "sil" }, therm);
  const lSil = mk("path", { class: "sil" }, lid), lCr = mk("path", { class: "nf lo" }, lid), lCatch = mk("path", { class: "nf lo" }, lid);
  const ang = tween(REST);
  let lastA = NaN, back = false;
  const [thr, thi] = rings(10, 9, 74, 17, 4, 1.2), [tpr, tpi] = rings(72, 11.2, 88, 14.8, 1.8, 0.6), [wn] = rings(20, 10.5, 40, 15.5, 1.5, 0.5);

  function draw(a) {
    if (a === lastA) return;
    lastA = a;
    const lift = Math.max(0, (a - REST) / (110 - REST)) * RISE, z0 = H - 3 + lift;
    const t = prism(P, front, thr, thi, z0, z0 + 5), tp = prism(P, front, tpr, tpi, z0 + 1, z0 + 3.4);
    tSil.setAttribute("d", t.sil); tCr.setAttribute("d", t.crease);
    tTip.setAttribute("d", tp.sil);
    tWin.setAttribute("d", poly(ringAt(P, wn, z0 + 5)));
    const pts = [], top = [];
    for (const q of lidRing) { pts.push(lidPt(q.u, q.v, 0, a), lidPt(q.u, q.v, T, a)); }
    for (const q of rrect(2, 2, L - 2, D - 2, 7, 6)) top.push(lidPt(q.u, q.v, T, a));
    lSil.setAttribute("d", poly(hull(pts)));
    lCr.setAttribute("d", poly(top));
    lCatch.setAttribute("d", poly([lidPt(L / 2 - 7, D, 1, a), lidPt(L / 2 - 6, D + 2.4, 1, a), lidPt(L / 2 + 6, D + 2.4, 1, a), lidPt(L / 2 + 7, D, 1, a)]));
    const nb = a > 70;
    if (nb !== back) { back = nb; if (back) therm.before(lid); else lid.before(therm); }
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -6 && x < L + 6 && y > -14 && y < D + 6;
  }
  let on = null;
  function setActive(a) {
    if (a === on) return;
    on = a;
    tset(ang, a ? 70 + swing * 0.45 : REST, performance.now(), 0);
    lSil.classList.toggle("hi", !a);
    tSil.classList.toggle("hi", a); tTip.classList.toggle("hi", a);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (on) { tset(ang, 70 + v * 0.45, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "earthermometer",
  means: "A clinic thermometer case: the pointer swings its lid back on the hinge and the thermometer rises out of the well.",
  rules: [1, 5, 6, 8],
  range: [0, 70, 90],
  tour: [[99, 150], [193, 196], [271, 250], null],
  mount,
});
