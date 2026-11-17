/**
 * Earbud case: a pill-shaped charging case, hinged at the back, with two
 * earbuds standing in their wells. The pointer picks a bud by where it
 * stands: the lid swings open and that bud rises out of its well, the other
 * a little. At rest the lid sits ajar, bright. The slider is how far the lid
 * opens.
 */
const { Cam, fit, hull, open, poly, proj, rrect, ringAt, facing, prism, circ, run, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid, rad } = HL;

const L = 46, Dp = 24, H = 17, LT = 9, BX = [14, 32], BY = 13, REST = 14, FAV = -1;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (q, a) => { const c = Math.cos(a), s = Math.sin(a), dz = q[2] - H; return [q[0], q[1] * c - dz * s, H + q[1] * s + dz * c]; };
const at3 = (ring, z) => ring.map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let openA = value;
  const C = Cam(45, 0.5, 4.5);
  fit(C, [[0, 0, 0], [L, Dp, 0], [L, 0, 0], [0, Dp, 0], [0, -6, H + Dp + 2], [L, -6, H + Dp + 2], [0, Dp, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the body: narrower at the foot, full at the seam
  const base = solid(g);
  const foot = rrect(3, 2, L - 3, Dp - 2, 9, 10), seam = rrect(0, 0, L, Dp, 11, 10), sin = rrect(1.5, 1.5, L - 1.5, Dp - 1.5, 9.5, 10);
  base.sil.setAttribute("d", poly(hull(ringAt(P, foot, 0).concat(ringAt(P, seam, H)))));
  base.cr.setAttribute("d", open(ringAt(P, run(sin, front), H)));
  mk("path", { class: "nf lo", d: BX.map((x) => poly(ringAt(P, disc(x, BY, 5.2), H))).join("") + poly([P(L / 2 - 2, Dp, 8), P(L / 2 + 2, Dp, 8), P(L / 2 + 2, Dp, 9), P(L / 2 - 2, Dp, 9)]) }, base.g);
  // the buds: a rounded head on a short stem
  const buds = BX.map((x, k) => {
    const s = solid(g);
    return { k, x, s, z: tween(0), last: NaN };
  });
  // the lid: a dome-topped shell swinging about the back seam
  const lid = solid(g);
  const lidTop = rrect(4, 3, L - 4, Dp - 3, 8, 10), lidIn = rrect(6, 5, L - 6, Dp - 5, 6, 10);
  const lidA = tween(REST);
  let lastA = NaN;
  function drawLid(a) {
    if (a === lastA) return;
    lastA = a;
    const r = rad(a), pts = at3(seam, H).concat(at3(seam, H + 3), at3(lidTop, H + LT)).map((q) => P(...rot(q, r)));
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.cr.setAttribute("d", a < 70 ? poly(at3(lidIn, H + LT).map((q) => P(...rot(q, r)))) : poly(at3(seam, H).map((q) => P(...rot(q, r)))));
    if (a >= 28) g.insertBefore(lid.g, base.g.nextSibling); else g.appendChild(lid.g);
  }
  function drawBud(b, z) {
    if (z === b.last) return;
    b.last = z;
    const z0 = H + z, pts = [];
    for (const [r, dz] of [[3.2, -3], [4.4, 1], [5, 3.5], [4.4, 6], [2.6, 8]]) pts.push(...ringAt(P, disc(b.x, BY, r, 20), z0 + dz));
    const stem = ringAt(P, disc(b.x, BY + 4, 1.8, 12), z0 - 3).concat(ringAt(P, disc(b.x, BY + 6, 1.8, 12), z0 + 2));
    b.s.sil.setAttribute("d", poly(hull(pts)) + (z > 2 ? poly(hull(stem)) : ""));
    b.s.cr.setAttribute("d", poly(ringAt(P, disc(b.x + 0.6, BY + 0.6, 2, 14), z0 + 7.6)));
  }
  const B = register(stage, (_dt, now) => {
    let m = !tdone(lidA, now);
    drawLid(tval(lidA, now));
    buds.forEach((b) => { drawBud(b, tval(b.z, now)); if (!tdone(b.z, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);
  const mids = BX.map((x) => P(x, BY, H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, (m[1] - sy) * 1.3); if (d < bd) { bd = d; best = k; } });
    return bd < 70 ? best : -1;
  }
  let act = -2;
  function apply() {
    const now = performance.now(), a = act;
    tset(lidA, a < 0 ? REST : openA, now, 0);
    buds.forEach((b) => tset(b.z, a < 0 ? 0 : b.k === a ? 9 + openA / 12 : 2, now, a < 0 ? 0 : b.k === a ? 120 : 200));
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    apply();
    lid.sil.classList.toggle("hi", a < 0);
    buds.forEach((b) => b.s.sil.classList.toggle("hi", b.k === a));
    read.textContent = a < 0 ? "rest" : a === 0 ? "bud L" : "bud R";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { openA = v; if (act >= 0) { apply(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "earbuds",
  means: "An earbud charging case: pointing at a bud swings the lid open and lifts that bud out of its well.",
  rules: [1, 4, 5, 6],
  range: [60, 95, 110],
  tour: [[159, 176], [216, 204], [190, 190], null],
  mount,
});
