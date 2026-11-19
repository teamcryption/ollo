/**
 * Dragster: a long wedge of a car on fat rear slicks, tiny front wheels, a
 * rear wing up on struts and a drogue parachute packed at its tail. The
 * pointer over the car throws the chute: it streams back on its tether and
 * blooms open. At rest the chute is just out of its pack, bright. The slider
 * is how far it deploys.
 *
 * The pattern: one part sliding out and opening.
 */
const { Cam, fit, hull, poly, open, seg, proj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const REST = 0.14, TAIL = [-2, 0, 18];
const chute = (d) => ({ x: -6 - 60 * d, r: 3 + 25 * d, z: 18 + 9 * d });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.85);
  const car = [[-4, -24, 0], [130, 0, 0], [22, 24, 0], [0, -20, 44], [0, 20, 44], [130, 0, 11]];
  const big = chute(1);
  fit(C, car.concat([[big.x - big.r, 0, big.z + big.r], [big.x, -big.r, 0], [big.x, big.r, big.z + big.r]]), 200, 166);
  const P = proj(C), H = (pts) => poly(hull(pts.map((p) => P(...p))));
  const g = mk("g", {}, svg);
  mk("path", { d: open([P(-70, 0, 0), P(140, 0, 0)]), class: "dash nf" }, g);
  // the chute, its shroud lines and tether
  const dome = mk("path", { class: "sil hi" }, g), mouth = mk("path", { class: "nf lo" }, g), lines = mk("path", { class: "nf lo" }, g);
  const ringYZ = (x, r, z, n = 16) => { const o = []; for (let j = 0; j < n; j++) { const a = (j / n) * Math.PI * 2; o.push([x, r * Math.cos(a), z + r * Math.sin(a)]); } return o; };
  const wheel = (x, R, y0, y1, face) => { const a = ringYZ(0, 0, 0, 1); a.length = 0; for (let j = 0; j < 20; j++) { const t = (j / 20) * Math.PI * 2; a.push([x + R * Math.cos(t), y0, R + R * Math.sin(t)], [x + R * Math.cos(t), y1, R + R * Math.sin(t)]); }
    mk("path", { d: H(a), class: "sil" }, g);
    const f = []; for (let j = 0; j <= 20; j++) { const t = (j / 20) * Math.PI * 2; f.push(P(x + R * 0.62 * Math.cos(t), face, R + R * 0.62 * Math.sin(t))); }
    mk("path", { d: open(f), class: "nf lo" }, g); };
  wheel(22, 14, -24, -12, -12);
  wheel(118, 5, -10, -7, -7);
  // the body: a wedge from the engine bay to the needle nose
  mk("path", { d: H([[6, -9, 6], [40, -9, 6], [6, 9, 6], [40, 9, 6], [6, -9, 20], [6, 9, 20], [40, -8, 19], [40, 8, 19], [130, -3, 7], [130, 3, 7], [130, -2, 11], [130, 2, 11]]), class: "sil" }, g);
  mk("path", { d: poly([[9, -7, 19.4], [126, -1.6, 10.6], [126, 1.6, 10.6], [9, 7, 19.4]].map((p) => P(...p))), class: "nf lo" }, g);
  mk("path", { d: H([[44, -5, 17], [56, -5, 15], [44, 5, 17], [56, 5, 15], [46, -4, 27], [50, -4, 27], [46, 4, 27], [50, 4, 27]]), class: "sil" }, g);
  mk("path", { d: seg(P(6, -8, 19), P(4, -8, 42)) + seg(P(6, 8, 19), P(4, 8, 42)), class: "nf" }, g);
  mk("path", { d: H([[-2, -20, 41], [14, -20, 43], [-2, 20, 41], [14, 20, 43], [-2, -20, 44], [14, -20, 45], [-2, 20, 44], [14, 20, 45]]), class: "sil" }, g);
  mk("path", { d: seg(P(-1, -18, 44), P(-1, 18, 44)), class: "nf lo" }, g);
  wheel(118, 5, 7, 10, 10);
  wheel(22, 14, 12, 24, 24);
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const { x, r, z } = chute(d), cap = [];
    for (let i = 0; i <= 4; i++) { const f = (i / 4) * Math.PI / 2; cap.push(...ringYZ(x - r * 0.75 * Math.sin(f), r * Math.cos(f) + 0.3, z)); }
    dome.setAttribute("d", H(cap));
    const rim = ringYZ(x, r, z, 24);
    mouth.setAttribute("d", poly(rim.map((p) => P(...p))));
    const cf = [x + r * 1.5, 0, z], L = ringYZ(x, r, z, 8);
    lines.setAttribute("d", L.map((p) => seg(P(...p), P(...cf))).join("") + seg(P(...cf), P(...TAIL)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = car.map((p) => P(...p)), xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 8, Math.max(...xs) + 8, Math.min(...ys) - 8, Math.max(...ys) + 8];
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? max : REST, performance.now(), 0);
    read.textContent = a ? "chute " + Math.round(max * 100) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "dragster",
  means: "A dragster on its slicks under the rear wing: the pointer throws the drogue chute, which streams back on its tether and blooms open.",
  rules: [1, 3, 5, 6],
  range: [0.6, 0.8, 1],
  tour: [[268, 222], [203, 115], [340, 264], null],
  mount,
});
