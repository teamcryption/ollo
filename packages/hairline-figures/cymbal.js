/**
 * Hi-hat: two cymbals on a tripod stand, a foot pedal at its base. The
 * pointer over the stand presses the pedal: the footboard tips down and the
 * top cymbal drops onto the bottom one, closing them. At rest the pedal is
 * bright; when the pointer plays, the top cymbal is. The slider is how far
 * the pedal goes down.
 *
 * The pattern: one part sliding along an axis, driven by a hinge (press).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rad, seg, lerp, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const CR = 46, ZB = 84, GAP = 26, LEG = 40, HEEL = 14, TOE = 50, PW = 8;
const D = [0.94, 0.34], N = [-0.34, 0.94];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-CR, -CR, ZB], [CR, CR, ZB], [CR, -CR, ZB], [-CR, CR, ZB], [0, 0, ZB + GAP + 18], [TOE * D[0], TOE * D[1], 0], [-LEG, -LEG, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const at = (x, y, r) => circ(r, 14).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
  const legs = mk("path", { class: "nf" }, g);
  legs.setAttribute("d", [90, 210, 330].map((a) => seg(P(0, 0, 30), P(LEG * Math.cos(rad(a + 45)), LEG * Math.sin(rad(a + 45)), 0))).join(" "));
  put(solid(g), prism(P, front, at(0, 0, 2.6), at(0, 0, 1.6), 4, ZB));
  const cym = (z, r = CR) => {
    const pts = circ(r, 48).map((q) => P(q.u, q.v, z)).concat(circ(r * 0.9, 40).map((q) => P(q.u, q.v, z + 2.5)), circ(10, 24).map((q) => P(q.u, q.v, z + 6)));
    return poly(hull(pts));
  };
  mk("path", { d: cym(ZB), class: "sil" }, g);
  mk("path", { d: poly(circ(10, 24).map((q) => P(q.u, q.v, ZB + 2.5))), class: "nf lo" }, g);
  const rod = mk("path", { class: "nf" }, g);
  const top = mk("path", { class: "sil" }, g), bell = mk("path", { class: "nf lo" }, g), clutch = mk("path", { class: "nf" }, g);
  const link = mk("path", { class: "nf" }, g), board = mk("path", { class: "sil" }, g);
  put(solid(g), prism(P, front, at(HEEL * D[0], HEEL * D[1], 4), at(HEEL * D[0], HEEL * D[1], 3), 0, 4));

  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z = ZB + 4 + GAP * (1 - t);
    rod.setAttribute("d", poly(hull(at(0, 0, 1.2).map((q) => P(q.u, q.v, ZB)).concat(at(0, 0, 1.2).map((q) => P(q.u, q.v, z + 22))))));
    top.setAttribute("d", cym(z));
    bell.setAttribute("d", poly(circ(10, 24).map((q) => P(q.u, q.v, z + 2.5))));
    clutch.setAttribute("d", poly(hull(at(0, 0, 3.4).map((q) => P(q.u, q.v, z + 6)).concat(at(0, 0, 3.4).map((q) => P(q.u, q.v, z + 12))))));
    const tilt = rad(lerp(22, 2, t)), L = TOE - HEEL, pts = [];
    for (const s of [0, 1]) for (const w of [-PW, PW]) for (const h of [0, 2]) {
      const d = HEEL + L * s * Math.cos(tilt), zz = 4 + L * s * Math.sin(tilt) + h;
      pts.push(P(d * D[0] + w * N[0], d * D[1] + w * N[1], zz));
    }
    board.setAttribute("d", poly(hull(pts)));
    const toe = TOE - 6, zt = 4 + (toe - HEEL) * Math.sin(tilt);
    link.setAttribute("d", seg(P(toe * D[0], toe * D[1], zt), P(0, 0, 6)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, ZB / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? amp : 0, performance.now(), 0);
    top.classList.toggle("hi", on);
    board.classList.toggle("hi", !on);
    read.textContent = on ? "closed" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 100 && Math.abs(sy - mid[1]) < 130;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cymbal",
  means: "A hi-hat stand: over it, the foot pedal presses down and the top cymbal drops to close onto the bottom one.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 146], [170, 110], [228, 200], null],
  mount,
});
