/**
 * Deed box: a tall japanned metal box with a hinged lid, a folding handle on
 * top and a keyhole plate on the front. Over the box the lid swings open on its
 * back hinge, showing the tied bundle of deeds inside. At rest the lid sits
 * just ajar, bright. The slider is how far the lid opens.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 92, Y1 = 58, H = 50, T = 6, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let openDeg = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, -T, H + Y1 + 4], [X1, -T, H + Y1 + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // inside: floor and a tied bundle of deeds, painted before the body that frames them
  mk("path", { class: "lo", d: poly(ringAt(P, rrect(3, 3, X1 - 3, Y1 - 3, 3, 4), 4)) }, g);
  const [dr, di] = rings(14, 12, X1 - 18, Y1 - 14, 3, 1.2);
  put(solid(g), prism(P, front, dr, di, 4, H - 12));
  mk("path", { class: "nf lo", d: open([P(X1 / 2, 12, H - 12), P(X1 / 2, Y1 - 14, H - 12), P(X1 / 2, Y1 - 14, 4)]) + seg(P(14, Y1 / 2, H - 12), P(X1 - 18, Y1 / 2, H - 12)) + seg(P(X1 - 18, Y1 / 2, H - 12), P(X1 - 18, Y1 / 2, 4)) }, g);

  // the body, opening cut through its top
  const [br, bi] = rings(0, 0, X1, Y1, 4, 1.4);
  const bp = prism(P, front, br, bi, 0, H);
  mk("path", { class: "sil", "fill-rule": "evenodd", d: bp.sil + " " + poly(ringAt(P, rrect(3, 3, X1 - 3, Y1 - 3, 3, 4), H)) }, g);
  mk("path", { class: "nf lo", d: seg(P(0, Y1, 6), P(X1, Y1, 6)) + seg(P(X1, 0, 6), P(X1, Y1, 6)) }, g);
  // keyhole plate on the front face
  const kx = X1 / 2, kz = H - 12;
  mk("path", { class: "lo", d: poly([P(kx - 7, Y1, kz - 8), P(kx + 7, Y1, kz - 8), P(kx + 7, Y1, kz + 6), P(kx - 7, Y1, kz + 6)]) }, g);
  mk("path", { class: "nf lo", d: seg(P(kx, Y1, kz - 4), P(kx, Y1, kz + 1)) }, g);
  // end handle on the right side
  mk("path", { class: "nf lo", d: open([P(X1, Y1 / 2 - 12, H - 14), P(X1 + 3, Y1 / 2 - 10, H - 20), P(X1 + 3, Y1 / 2 + 10, H - 20), P(X1, Y1 / 2 + 12, H - 14)]) }, g);

  // the lid, turning about its back edge, with its folding handle
  const lidG = mk("g", {}, g), lid = solid(lidG);
  const handle = mk("path", { class: "nf lo" }, lidG);
  const lo = rrect(-1, -1, X1 + 1, Y1 + 1, 4, 4), li = rrect(2, 2, X1 - 2, Y1 - 2, 3, 4);
  const L = (u, v, d, a) => P(u, v * Math.cos(a) - d * Math.sin(a), H + 0.4 + v * Math.sin(a) + d * Math.cos(a));
  const ang = tween(REST);
  let lastA = NaN;

  function drawLid(deg) {
    if (deg === lastA) return;
    lastA = deg;
    const a = rad(deg), face = deg < 60 ? T : 0;
    lid.sil.setAttribute("d", poly(hull(lo.map((q) => L(q.u, q.v, 0, a)).concat(lo.map((q) => L(q.u, q.v, T, a))))));
    lid.cr.setAttribute("d", poly(li.map((q) => L(q.u, q.v, face, a))));
    lid.cr.setAttribute("class", "nf lo");
    const hy = Y1 / 2, hz = T + 4;
    handle.setAttribute("d", open([L(X1 / 2 - 22, hy, T, a), L(X1 / 2 - 18, hy, hz, a), L(X1 / 2 + 18, hy, hz, a), L(X1 / 2 + 22, hy, T, a)]));
  }

  const B = register(stage, (_dt, now) => {
    drawLid(tval(ang, now));
    return !tdone(ang, now);
  });
  bag.add(B.unregister);
  lid.sil.classList.add("hi");

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H / 2);
    return x > -16 && x < X1 + 16 && y > -16 && y < Y1 + 16;
  }
  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(ang, a ? openDeg : REST, performance.now(), 0);
    read.textContent = a ? Math.round(openDeg) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { openDeg = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "deedbox",
  means: "A metal deed box: over it the hinged lid swings open on its back edge to show the tied deeds; the slider sets how far it opens.",
  rules: [1, 4, 5, 6],
  range: [40, 100, 115],
  tour: [[196, 180], [214, 200], [180, 196], null],
  mount,
});
