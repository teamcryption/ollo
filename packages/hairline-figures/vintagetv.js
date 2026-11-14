/**
 * Vintage TV: a wooden cabinet set on four short legs, a rounded screen on
 * its front, a channel knob and a volume knob beside it, and a rabbit-ear
 * antenna on top. The pointer tunes it: where it is across the set picks the
 * channel, the knob turns to it, bright, and the antenna leans after the
 * pointer. At rest the screen is the bright mark and the ears stand apart,
 * leaning a little. The slider is the ears' spread.
 *
 * The pattern: one value along a row (riffle) on a fixed plane through the
 * cabinet; the lean is a spring, the knob a tween.
 */
const {
  Cam, clamp, facing, fit, lerp, hull, poly, prism, proj, rad, rings, ringAt, rrect, seg, spring, stepS, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 0, X1 = 44, Y0 = 0, Y1 = 30, Z0 = 9, Z1 = 42, AX = 22, AY = 15, AL = 30, NCH = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spread = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[X0, Y0, 0], [X1, Y1 + 3, 0], [X1, Y0, 0], [X0, Y1 + 3, 0], [AX - 24, AY, Z1 + 30], [AX + 24, AY, Z1 + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // legs, far to near
  [[4, 4], [X1 - 4, 4], [4, Y1 - 4], [X1 - 4, Y1 - 4]].forEach(([x, y]) => {
    const [r, i] = rings(x - 2, y - 2, x + 2, y + 2, 1.6, 0.6);
    put(solid(g), prism(P, front, r, i, 0, Z0 + 1));
  });
  // the cabinet, the screen on its front face (y = Y1) and a speaker grille
  const cab = solid(g);
  const [cr, ci] = rings(X0, Y0, X1, Y1, 4, 1.4);
  put(cab, prism(P, front, cr, ci, Z0, Z1));
  const face = (pts) => poly(pts.map(([x, z]) => P(x, Y1, z)));
  const scr = [];
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    scr.push([17 + 12.5 * Math.sign(c) * Math.pow(Math.abs(c), 0.45), 26 + 12 * Math.sign(s) * Math.pow(Math.abs(s), 0.45)]);
  }
  const screen = mk("path", { class: "nf sil", d: face(scr) }, cab.g);
  mk("path", { class: "nf lo", d: face(scr.map(([x, z]) => [17 + (x - 17) * 0.86, 26 + (z - 26) * 0.86])) }, cab.g);
  let gr = "";
  for (let k = 0; k < 4; k++) gr += seg(P(33, Y1, 14 + k * 2), P(41, Y1, 14 + k * 2));
  mk("path", { class: "nf lo", d: gr }, cab.g);

  // knobs: short cylinders standing out of the face along y
  function knob(cx, cz, R) {
    const kg = mk("g", {}, g), ring = (y) => { const o = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; o.push(P(cx + R * Math.cos(a), y, cz + R * Math.sin(a))); } return o; };
    const sil = mk("path", { class: "sil", d: poly(hull(ring(Y1).concat(ring(Y1 + 3)))) }, kg);
    mk("path", { class: "nf lo", d: poly(ring(Y1 + 3)) }, kg);
    const tick = mk("path", { class: "nf" }, kg);
    return { sil, tick, set(a) { tick.setAttribute("d", seg(P(cx, Y1 + 3, cz), P(cx + R * 0.8 * Math.cos(a), Y1 + 3, cz + R * 0.8 * Math.sin(a)))); } };
  }
  const chK = knob(37, 33, 3.6), volK = knob(37, 24.5, 2.6);
  volK.set(rad(130));

  // the antenna: a small base and two rods in the x–z plane
  const base = solid(g);
  const [br, bi] = rings(AX - 4, AY - 3, AX + 4, AY + 3, 3, 1);
  put(base, prism(P, front, br, bi, Z1, Z1 + 3));
  const rods = mk("path", { class: "nf" }, g);
  const tips = [mk("circle", { r: 1.6 }, g), mk("circle", { r: 1.6 }, g)];
  const lean = spring(8), kn = tween(rad(60));
  let last = "";
  function drawAnt(l) {
    const key = l.toFixed(2) + "," + spread;
    if (key === last) return;
    last = key;
    const o = P(AX, AY, Z1 + 3);
    let d = "";
    [-1, 1].forEach((s, i) => {
      const a = rad(l + s * spread), t = P(AX + AL * Math.sin(a), AY, Z1 + 3 + AL * Math.cos(a));
      d += seg(o, t);
      tips[i].setAttribute("cx", t[0]); tips[i].setAttribute("cy", t[1]);
    });
    rods.setAttribute("d", d);
  }

  const B = register(stage, (dt, now) => {
    const m = stepS(lean, dt);
    drawAnt(lean.x);
    chK.set(tval(kn, now));
    return m || !tdone(kn, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z1 * 0.6);
    if (x < X0 - 12 || x > X1 + 12 || y < Y0 - 12 || y > Y1 + 14) return null;
    return clamp((x - X0 + 12) / (X1 - X0 + 24), 0, 1);
  }
  let act = -2;
  function update(f) {
    const ch = f === null ? -1 : clamp(Math.round(f * (NCH - 1)), 0, NCH - 1);
    lean.t = f === null ? 8 : clamp(lerp(-38, 38, f), -38, 38);
    B.wake();
    if (ch === act) return;
    act = ch;
    tset(kn, ch < 0 ? rad(60) : rad(150 - ch * 25), performance.now(), 0);
    screen.classList.toggle("hi", ch < 0);
    chK.sil.classList.toggle("hi", ch >= 0);
    read.textContent = ch < 0 ? "rest" : "ch " + String(ch + 2).padStart(2, "0");
  }
  update(null);
  bag.add(pointer(stage, { move: (p) => update(hit(p)), leave: () => update(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { spread = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "vintagetv",
  means: "A vintage TV: the pointer across the set turns the channel knob to a channel, and the rabbit-ear antenna leans after it.",
  rules: [1, 3, 5, 8],
  range: [12, 26, 40],
  tour: [[130, 141], [156, 153], [277, 214], null],
  mount,
});
