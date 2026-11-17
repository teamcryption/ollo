/**
 * Kitchen timer cube: a flip timer, a rounded cube with a small display on
 * its side and a pip code on its top face. At rest it sits square, one pip
 * bright. The pointer over it tips the cube onto its edge, as a hand flips
 * it to start a count; the slider sets how far it tips.
 *
 * The pattern: one solid tilting about a ground edge.
 */
const {
  Cam, fit, hull, open, poly, proj, rrect, circ, unproj, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, register,
} = HL;

const S = 46, R = 9, B = 2.2, REST = 0;
const PIPS = [[13, 13], [23, 23], [33, 33]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-2, -2, 0], [S + 30, S + 2, 0], [S + 2, -2, S + 20], [-2, S + 2, S], [S + 40, S + 2, 30]], 200, 172);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const sil = mk("path", { class: "sil" }, g);
  const top = mk("path", { class: "nf lo" }, g);
  const disp = mk("path", { class: "nf lo" }, g);
  const pips = PIPS.map((_, i) => mk("path", { class: i === 1 ? "dot" : "dot off" }, g));

  const foot = rrect(0, 0, S, S, R, 5), inner = rrect(B, B, S - B, S - B, R - B, 5);
  const screen = rrect(9, 9, S - 9, S * 0.5, 3, 4); // on the +y face: u along x, v along z
  const pipRing = circ(2.2, 14);
  const tilt = tween(REST);
  let last = NaN;

  function draw(th) {
    if (th === last) return;
    last = th;
    const c = Math.cos(rad(th)), s = Math.sin(rad(th));
    const W = (x, y, z) => { const dx = x - S; return P(S + dx * c + z * s, y, -dx * s + z * c); };
    const pts = [];
    for (const q of foot) pts.push(W(q.u, q.v, 0), W(q.u, q.v, S));
    sil.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly(inner.map((q) => W(q.u, q.v, S - 0.4))));
    disp.setAttribute("d", poly(screen.map((q) => W(q.u, S, S - q.v))));
    PIPS.forEach(([x, y], i) => pips[i].setAttribute("d", poly(pipRing.map((q) => W(x + q.u, y + q.v, S)))));
  }

  const L = register(stage, (_dt, now) => { draw(tval(tilt, now)); return !tdone(tilt, now); });
  bag.add(L.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tilt, v ? maxT : REST, performance.now(), 0);
    sil.classList.toggle("hi", v);
    pips[1].setAttribute("class", v ? "dot off" : "dot");
    read.textContent = v ? "flip" : "rest";
    L.wake();
  }
  function hit([sx, sy]) {
    const inA = ([x, y]) => x > -20 && x < S + 40 && y > -20 && y < S + 20;
    return inA(unproj(C, sx, sy, 0)) || inA(unproj(C, sx, sy, S));
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { maxT = v; if (on) { tset(tilt, maxT, performance.now(), 0); L.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "kitchenscale2",
  means: "A flip kitchen timer cube: the pointer tips the cube up onto its edge, the way a hand flips it to start the count.",
  rules: [1, 3, 5, 8],
  range: [25, 50, 70],
  tour: [[200, 97], [126, 189], [250, 170], null],
  mount,
});
