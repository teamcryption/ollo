/**
 * Capsule hatch: a conical space capsule with a round hatch on its top,
 * a handwheel on the hatch. The pointer swings the hatch up on its hinge,
 * further the further right it goes, and turns the handwheel as it opens.
 * At rest the hatch is shut and its handwheel is bright.
 *
 * The pattern: one part tilts open on a hinge (tilt).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const RB = 24, RT = 15, ZT = 26, HR = 13, HT = 4, HX = -HR;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let spin = value;
  const C = Cam(45, 0.5, 4.4);
  fit(C, [[-RB, -RB, 0], [RB, RB, 0], [-RB, RB, 0], [RB, -RB, 0], [-2 * HR - 4, 0, ZT + 2 * HR], [HR, 0, ZT + 8]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const ring = (cx, cy, r, z, n = 36) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return o; };
  const pp = (list) => list.map((q) => P(q[0], q[1], q[2]));
  const H = (list) => poly(hull(pp(list)));
  mk("path", { class: "sil", d: H(ring(0, 0, RB, 0).concat(ring(0, 0, RB, 5), ring(0, 0, RT, ZT))) }, g);
  mk("path", { class: "nf", d: poly(pp(ring(0, 0, HR - 1, ZT + 0.1))) }, g);
  const lid = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g);
  const wheel = mk("path", { class: "nf hi" }, g), spokes = mk("path", { class: "nf hi" }, g);
  const ang = tween(0), wh = tween(0);
  let last = "";
  function draw(a, w) {
    const key = a.toFixed(4) + w.toFixed(4);
    if (key === last) return; last = key;
    const c = Math.cos(a), s = Math.sin(a);
    const W = (u, v, t) => [HX + u * c - t * s, v, ZT + u * s + t * c];
    const disc = (r, t, n = 36) => { const o = []; for (let i = 0; i < n; i++) { const q = (i / n) * Math.PI * 2; o.push(W(HR + r * Math.cos(q), r * Math.sin(q), t)); } return o; };
    lid.setAttribute("d", H(disc(HR, 0).concat(disc(HR, HT))));
    top.setAttribute("d", poly(pp(disc(HR - 2, HT + 0.1))));
    wheel.setAttribute("d", poly(pp(disc(7, HT + 4))));
    let d = "";
    const hub = P(...W(HR, 0, HT + 0.1));
    for (let k = 0; k < 3; k++) {
      const q = w + (k * 2 * Math.PI) / 3, e = P(...W(HR + 7 * Math.cos(q), 7 * Math.sin(q), HT + 4));
      d += "M" + hub[0].toFixed(1) + " " + hub[1].toFixed(1) + "L" + e[0].toFixed(1) + " " + e[1].toFixed(1);
    }
    spokes.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now), tval(wh, now)); return !(tdone(ang, now) && tdone(wh, now)); });
  bag.add(B.unregister);
  const L = P(0, -RB, 10)[0], R = P(0, RB, 10)[0], lo = Math.min(L, R), hi = Math.max(L, R);
  function act(p) {
    const now = performance.now();
    const f = p ? Math.max(0, Math.min(1, (p[0] - lo) / (hi - lo))) : 0;
    tset(wh, f * Math.PI * (1 + spin), now, 0);
    tset(ang, f * 1.95, now, f > 0 ? 200 : 0);
    read.textContent = p ? Math.round(f * 100) + "%" : "rest";
    B.wake();
  }
  act(null);
  bag.add(pointer(stage, { move: act, leave: () => act(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { spin = v; }, destroy: bag.dispose };
}

hairline({
  name: "capsulehatch",
  means: "A space capsule with a round hatch on top: the pointer turns the handwheel and swings the hatch up open on its hinge.",
  rules: [1, 2, 5, 6],
  range: [0, 1, 2],
  tour: [[125, 252], [200, 215], [275, 178], null],
  mount,
});
