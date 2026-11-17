/**
 * Map case: a flat rounded case lying on the ground, a window on its face
 * with the folds of a map behind it, and a flap hinged along its far edge.
 * At rest the flap sits ajar, bright. The pointer over the case swings the
 * flap right back and the folded map slides out after it. The slider is the
 * map's lag behind the flap.
 */
const { Cam, fit, hull, open, poly, prism, proj, rings, rrect, facing, tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const L = 56, D = 40, H = 5, FL = 30, LT = 1.6, OPEN = 168, AJAR = 9, SLIDE = 22;

function rotY(p, c, a) {
  const s = Math.sin(a), co = Math.cos(a), x = p[0] - c[0], z = p[2] - c[2];
  return [c[0] + x * co + z * s, p[1], c[2] - x * s + z * co];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lag = value;
  const C = Cam(45, 0.5, 3.75);
  fit(C, [[-FL, 0, 0], [L, D, 0], [L, 0, 0], [-FL, D, 0], [0, 0, 26], [0, D, 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g);
  const box = solid(g);
  put(box, prism(P, front, ...rings(0, 0, L, D, 5, 1.6), 0, H));
  // the window and the map's folds behind it
  const win = rrect(FL + 4, 5, L - 5, D - 5, 3, 4).map((s) => P(s.u, s.v, H));
  mk("path", { class: "nf lo", d: poly(win) + open([P(FL + 4 + (L - FL - 9) / 2, 5, H), P(FL + 4 + (L - FL - 9) / 2, D - 5, H)]) + open([P(FL + 4, D / 2, H), P(L - 5, D / 2, H)]) }, box.g);
  const map = solid(g), fr = mk("g", {}, g), flap = solid(fr);
  const [fr0, fi0] = rings(0, 0, FL, D, 5, 1.4);
  const ang = tween(AJAR), sl = tween(0);
  let lastA = NaN, lastS = NaN;

  function drawFlap(deg) {
    if (deg === lastA) return;
    lastA = deg;
    const a = -deg * Math.PI / 180, c = [0, 0, H], T = (u, v, z) => P(...rotY([u, v, z], c, a));
    const pts = [];
    fr0.forEach((s) => { pts.push(T(s.u, s.v, H), T(s.u, s.v, H + LT)); });
    flap.sil.setAttribute("d", poly(hull(pts)));
    flap.cr.setAttribute("d", poly(fi0.map((s) => T(s.u, s.v, deg > 90 ? H : H + LT))));
    const par = deg > 90 ? back : fr;
    if (flap.g.parentNode !== par) par.appendChild(flap.g);
  }
  function drawMap(d) {
    if (d === lastS) return;
    lastS = d;
    const x0 = 3 - d, x1 = FL + 2 - d * 0.4;
    const r = rrect(x0, 4, x1, D - 4, 1, 3), pts = [];
    r.forEach((s) => { pts.push(P(s.u, s.v, H), P(s.u, s.v, H + 0.8)); });
    map.sil.setAttribute("d", poly(hull(pts)));
    const xm = (x0 + x1) / 2;
    map.cr.setAttribute("d", open([P(xm, 4, H + 0.8), P(xm, D - 4, H + 0.8)]) + open([P(x0, D / 2, H + 0.8), P(x1, D / 2, H + 0.8)]));
  }
  const B = register(stage, (_dt, now) => {
    drawFlap(tval(ang, now));
    drawMap(tval(sl, now));
    return !tdone(ang, now) || !tdone(sl, now);
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(ang, a ? OPEN : AJAR, now, a ? 0 : lag);
    tset(sl, a ? SLIDE : 0, now, a ? lag : 0);
    flap.sil.classList.toggle("hi", !a);
    map.sil.classList.toggle("hi", a);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -6 && x < L + 4 && y > -4 && y < D + 4;
  }
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gaiter",
  means: "A map case: the pointer swings the flap right back and the folded map slides out after it.",
  rules: [4, 5, 6, 8],
  range: [0, 160, 400],
  tour: [[205, 177], [256, 244], [219, 141], null],
  mount,
});
