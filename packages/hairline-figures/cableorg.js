/**
 * Cable box: a long rounded box that hides a power strip, its lid hinged at
 * the back and a cable leaving through a notch at each end. The pointer
 * picks a plug by where it stands along the box: the lid swings open, that
 * plug rises from its socket and its neighbours a little, staggered from it.
 * At rest the lid sits just ajar, bright. The slider is how far it opens.
 */
const { Cam, clamp, fit, hull, open, poly, proj, rings, rrect, ringAt, facing, prism, run, unproj, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const L = 74, Dp = 30, H = 20, LT = 4, PX = [20, 37, 54], PY = 15, REST = 9;
const rot = (q, a) => { const c = Math.cos(a), s = Math.sin(a), dz = q[2] - H; return [q[0], q[1] * c - dz * s, H + q[1] * s + dz * c]; };
const at3 = (ring, z) => ring.map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let openA = value, stag = 50;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-14, -6, 0], [L + 16, Dp + 12, 0], [L, -6, 0], [-14, Dp + 6, 0], [0, -6, H + Dp + 2], [L, -6, H + Dp + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the cables, lying on the desk, leaving through the end notches
  const cable = (pts) => open(pts.map((q) => P(...q)));
  const curve = (x0, s) => { const o = []; for (let i = 0; i <= 12; i++) { const t = i / 12; o.push([x0 + s * 16 * t, PY + 13 * t * t - 3 * Math.sin(t * Math.PI), 1.6]); } return o; };
  mk("path", { class: "nf", d: cable(curve(0, -1)) }, g);
  const base = solid(g);
  const [br, bi] = rings(0, 0, L, Dp, 9, 1.8);
  put(base, prism(P, front, br, bi, 0, H));
  const notch = (x) => { const o = []; for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; o.push(P(x, PY + 4.5 * Math.cos(a), 4.5 * Math.sin(a))); } return open(o); };
  mk("path", { class: "nf lo", d: notch(L) }, base.g);
  mk("path", { class: "nf", d: cable(curve(L, 1)) }, g);
  // the strip inside: a low bar with three plugs standing in it
  const strip = solid(g);
  const [sr, si] = rings(10, PY - 6, L - 10, PY + 6, 4, 1.2);
  put(strip, prism(P, front, sr, si, H - 3, H + 1));
  const plugs = PX.map((x, k) => ({ k, x, s: solid(g), z: tween(0), last: NaN }));
  function drawPlug(p, z) {
    if (z === p.last) return;
    p.last = z;
    const [r, i] = rings(p.x - 4.5, PY - 4, p.x + 4.5, PY + 4, 2.2, 1);
    put(p.s, prism(P, front, r, i, H + 1 + z, H + 8 + z));
  }
  const lid = solid(g);
  const lo = rrect(-1, -1, L + 1, Dp + 1, 10, 10), lin = rrect(1, 1, L - 1, Dp - 1, 8, 10);
  const lidA = tween(REST);
  let lastA = NaN;
  function drawLid(a) {
    if (a === lastA) return;
    lastA = a;
    const r = rad(a);
    lid.sil.setAttribute("d", poly(hull(at3(lo, H).concat(at3(lo, H + LT)).map((q) => P(...rot(q, r))))));
    lid.cr.setAttribute("d", poly(at3(a < 80 ? lin : lin, a < 80 ? H + LT : H).map((q) => P(...rot(q, r)))));
    if (a >= 30) g.insertBefore(lid.g, strip.g); else g.appendChild(lid.g);
  }
  const B = register(stage, (_dt, now) => {
    let m = !tdone(lidA, now);
    drawLid(tval(lidA, now));
    plugs.forEach((p) => { drawPlug(p, tval(p.z, now)); if (!tdone(p.z, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -6 || x > L + 6 || y < -8 || y > Dp + 6) return -1;
    return clamp(Math.round((x - PX[0]) / (PX[1] - PX[0])), 0, 2);
  }
  let act = -2;
  function apply(from) {
    const now = performance.now(), a = act;
    tset(lidA, a < 0 ? REST : openA, now, 0);
    plugs.forEach((p) => tset(p.z, a < 0 ? 0 : p.k === a ? 6 + openA / 10 : 3, now, a < 0 ? 0 : 160 + Math.abs(p.k - from) * stag));
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    apply(a);
    lid.sil.classList.toggle("hi", a < 0);
    plugs.forEach((p) => p.s.sil.classList.toggle("hi", p.k === a));
    read.textContent = a < 0 ? "rest" : "plug " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { openA = v; if (act >= 0) { apply(act); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "cableorg",
  means: "A cable box hiding a power strip: the lid swings open and the plug under the pointer rises from its socket.",
  rules: [1, 2, 4, 5],
  range: [60, 95, 110],
  tour: [[181, 153], [214, 170], [247, 187], null],
  mount,
});
