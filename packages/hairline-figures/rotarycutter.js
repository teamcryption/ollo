/**
 * Rotary cutter: a fabric rotary cutter standing on a cutting mat, a long
 * handle raked back from a round blade, the blade half covered by its guard.
 * The pointer over it swings the guard back off the blade and rolls the
 * cutter forward along the mat. At rest the guard is bright. The slider is
 * how far it rolls.
 */
const { Cam, fit, hull, poly, proj, rrect, seg, tween, tset, tval, tdone, unproj, disposer, mk, pointer, register } = HL;

const rz = (a) => ([x, y, z]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const pitch = (a) => ([x, y, z]) => [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
const tr = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];
const chain = (...fs) => (p) => fs.reduce((q, f) => f(q), p);
const D = Math.PI / 180, BASE = -12 * D, R = 17, H = R + 1.5;
const arc = (r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * D; return [r * Math.cos(a), r * Math.sin(a)]; });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let roll = value;
  const C = Cam(45, 0.5, 2.25);
  const W = rz(BASE);
  fit(C, [[-80, -30, 0], [70, 30, 0], [-80, 30, 0], [70, -30, 0], [-60, 0, 56], [40, 0, 56]].map(W), 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const mat = mk("path", { class: "sil" }, g), matCr = mk("path", { class: "nf lo" }, g), cut = mk("path", { class: "nf dash" }, g);
  const mring = rrect(-80, -30, 70, 30, 6), mi = rrect(-78, -28, 68, 28, 4);
  mat.setAttribute("d", poly(hull(mring.map((q) => P(...W([q.u, q.v, -2]))).concat(mring.map((q) => P(...W([q.u, q.v, 0])))))));
  matCr.setAttribute("d", poly(mi.map((q) => P(...W([q.u, q.v, 0])))));
  const handle = mk("path", { class: "sil" }, g), hcr = mk("path", { class: "nf lo" }, g);
  const blade = mk("path", { class: "sil" }, g), hub = mk("path", { class: "nf lo" }, g);
  const guard = mk("path", { class: "sil hi" }, g), knob = mk("path", { class: "nf" }, g);
  const pose = tween(0);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const x0 = -30 + roll * o, at = (p) => P(...W(tr(x0, 0, H)(p)));
    cut.setAttribute("d", o > 0.01 ? seg(P(...W([-30, 7, 0.1])), P(...W([x0, 7, 0.1]))) : "");
    // handle: a rounded bar raked back and up from the hub
    const hr = rrect(-68, -5.5, 2, 5.5, 5.5), Th = (q, z) => at(pitch(-38 * D)([q.u, q.v, z]));
    handle.setAttribute("d", poly(hull(hr.map((q) => Th(q, -5)).concat(hr.map((q) => Th(q, 5))))));
    hcr.setAttribute("d", poly(rrect(-65, -3.5, -14, 3.5, 3.5).map((q) => Th(q, 5))));
    const disk = (r, y, a0 = 0, a1 = 360, n = 40) => arc(r, a0, a1, n).map(([u, v]) => at([u, y, v]));
    blade.setAttribute("d", poly(hull(disk(R, 6).concat(disk(R, 7.2)))));
    hub.setAttribute("d", poly(disk(5, 7.2, 0, 360, 20)));
    // guard: a half cover over the blade, swung back round the hub
    const ga = 15 + 130 * o, gpts = arc(R + 2, ga, ga + 180, 24).concat(arc(4, ga + 180, ga, 8));
    guard.setAttribute("d", poly(hull(gpts.map(([u, v]) => at([u, 8, v])).concat(gpts.map(([u, v]) => at([u, 10, v]))))));
    knob.setAttribute("d", poly(hull(disk(3.5, 10, 0, 360, 16).concat(disk(3.5, 12.5, 0, 360, 16)))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(pose, now)); return !tdone(pose, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(pose, a ? 1 : 0, performance.now(), 0);
    guard.classList.toggle("hi", !a);
    blade.classList.toggle("hi", a);
    read.textContent = a ? "cut " + Math.round(roll) : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), [u, v] = rz(-BASE)([x, y, 0]);
    return u > -90 && u < 75 && Math.abs(v) < 40;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { roll = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "rotarycutter",
  means: "A rotary cutter on a cutting mat: the pointer over it swings the guard back off the round blade and rolls the cutter forward.",
  rules: [1, 3, 5, 8],
  range: [30, 50, 66],
  tour: [[154, 144], [190, 160], [120, 136], null],
  mount,
});
