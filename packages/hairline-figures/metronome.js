/**
 * Metronome: a pyramid case on a plinth, a scale of ticks up its front face,
 * a pendulum arm pivoting low on that face and a weight that slides along it.
 * The pointer conducts: the arm leans toward it, and the weight slides with
 * the pointer's height, higher for a slower beat. At rest the arm stands at
 * the end of a swing, the weight bright. The slider is how far the arm leans.
 *
 * The pattern: a continuous aim (a spring on the lean, one on the weight); the
 * pointer is read in screen space against the case, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, ringAt, rings, rrect, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BW = 20, BD = 15, PL = 5, TOPZ = 72, TW = 5, TD = 4, PIV = 14, ARM = 64, LEAN = 26;
const REST_A = -14, REST_W = 0.667;
const faceY = (z) => BD - ((BD - TD) * (z - PL)) / (TOPZ - PL);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-BW - 3, -BD - 3, 0], [BW + 3, BD + 3, 0], [-BW - 3, BD + 3, 0], [BW + 3, -BD - 3, 0], [0, 0, TOPZ + 4], [-30, 12, PIV + ARM], [30, 12, PIV + ARM]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // plinth, then the tapered case written from its foot and top rings
  const [pr, pi] = rings(-BW - 3, -BD - 3, BW + 3, BD + 3, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, PL));
  const foot = rrect(-BW, -BD, BW, BD, 3, 6), top = rrect(-TW, -TD, TW, TD, 1.6, 6), inner = rrect(-TW + 1, -TD + 1, TW - 1, TD - 1, 0.8, 6);
  const caseEl = solid(g);
  put(caseEl, { sil: poly(hull(ringAt(P, foot, PL).concat(ringAt(P, top, TOPZ)))), crease: open(ringAt(P, run(inner, front), TOPZ)) });

  // the tempo scale: ticks up the front face, behind the arm
  let ticks = "";
  for (let k = 0; k < 9; k++) { const z = PIV + 18 + k * 5, y = faceY(z) + 0.2, w = k % 2 ? 1.6 : 3; ticks += seg(P(-w, y, z), P(w, y, z)); }
  mk("path", { class: "nf lo", d: ticks }, g);
  put(solid(g), prism(P, front, rings(-3, faceY(PIV) - 1, 3, faceY(PIV) + 2.5, 1.4, 0.5)[0], null, PIV - 3, PIV + 3));

  const arm = mk("path", { class: "nf sil", d: "" }, g);
  const wEl = solid(g);
  const [wr, wi] = rings(-4.5, -2.6, 4.5, 2.6, 1.4, 0.7);
  const sa = spring(REST_A), sw = spring(REST_W, { eps: 0.002 });
  let drawn = "";

  function draw() {
    const a = rad(sa.x), w = clamp(sw.x, 0, 1), key = a.toFixed(4) + w.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const at = (t) => { const z = PIV + Math.cos(a) * ARM * t; return [Math.sin(a) * ARM * t, faceY(z) + 2.2, z]; };
    const b = at(0), e = at(1);
    arm.setAttribute("d", seg(P(b[0] - 0.5, b[1], b[2]), P(e[0] - 0.5, e[1], e[2])) + seg(P(b[0] + 0.5, b[1], b[2]), P(e[0] + 0.5, e[1], e[2])));
    const m = at(0.38 + w * 0.5), sh = (r) => r.map((q) => ({ ...q, u: q.u + m[0], v: q.v + m[1] + 0.6 }));
    put(wEl, prism(P, front, sh(wr), sh(wi), m[2] - 3.5, m[2] + 3.5));
  }
  const B = register(stage, (dt) => { const m1 = stepS(sa, dt), m2 = stepS(sw, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  const pv = P(0, faceY(PIV), PIV), tp = P(0, faceY(PIV + ARM), PIV + ARM);
  function set(p) {
    if (p) {
      sa.t = clamp(Math.atan2(p[0] - pv[0], pv[1] - p[1]) * (180 / Math.PI), -LEAN * reach, LEAN * reach);
      sw.t = clamp((pv[1] - 10 - p[1]) / (pv[1] - 10 - tp[1]), 0, 1);
    } else { sa.t = REST_A; sw.t = REST_W; }
    wEl.sil.classList.add("hi");
    read.textContent = p ? "tempo " + Math.round(208 - 168 * sw.t) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => set(Math.abs(p[0] - 200) < 130 && p[1] > 20 && p[1] < 300 ? p : null),
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "metronome",
  means: "A pyramid metronome: the arm leans toward the pointer and its weight slides with the pointer's height.",
  rules: [3, 5, 8, 9],
  range: [0.4, 1, 1.4],
  tour: [[160, 110], [231, 115], [250, 200], null],
  mount,
});
