/**
 * Marionette: a wooden puppet hanging on strings from a cross-shaped control
 * bar. The pointer tips the control bar left or right, on a spring: one end
 * dips, the puppet swings under it, the hand on the high side lifts and the
 * legs trail. At rest the bar hangs tipped a little, bright. The slider is
 * how far the bar may tip.
 *
 * The pattern: a continuous aim read from the pointer's screen x.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rad, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const BZ = 128, BL = 34, REST = rad(-12);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 18], [0, 0, BZ + 6], [-45, 0, 80], [45, 0, 80]], 200, 174);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const strings = mk("path", { class: "nf lo" }, g);
  const legs = mk("path", { class: "nf" }, g);
  const body = mk("path", { class: "sil" }, g), head = mk("path", { class: "sil" }, g);
  const arms = mk("path", { class: "nf" }, g);
  const cross = mk("path", { class: "sil" }, g), bar = mk("path", { class: "sil hi" }, g);
  const sa = spring(REST);
  let last = NaN, over = null;

  const blob = (cx, cy, cz, rx, ry, rz, n = 12) => {
    const pts = [];
    for (let i = 0; i < n; i++) for (let j = 0; j <= n / 2; j++) {
      const t = (i / n) * 2 * Math.PI, f = (j / (n / 2)) * Math.PI - Math.PI / 2;
      pts.push(P(cx + rx * Math.cos(f) * Math.cos(t), cy + ry * Math.cos(f) * Math.sin(t), cz + rz * Math.sin(f)));
    }
    return poly(hull(pts));
  };
  const beam = (a, b, w, h) => {
    const pts = [];
    for (const p of [a, b]) for (const dy of [-w, w]) for (const dz of [-h, h]) pts.push(P(p[0], p[1] + dy, p[2] + dz));
    return poly(hull(pts));
  };

  function draw() {
    const a = sa.x;
    if (Math.abs(a - last) < 0.0005) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const L = [-BL * c, 0, BZ - BL * s], R = [BL * c, 0, BZ + BL * s];
    const dx = -46 * s, sw = 0.6 * a;
    const hz = 82, bz0 = 52, bz1 = 76;
    const hl = [dx - 18, 0, 62 - 16 * s], hr = [dx + 18, 0, 62 + 16 * s];
    bar.setAttribute("d", beam(L, R, 3, 2.4));
    cross.setAttribute("d", beam([0, -20, BZ], [0, 20, BZ], 2.4, 2));
    head.setAttribute("d", blob(dx, 0, hz + 9, 8, 8, 9));
    body.setAttribute("d", blob(dx, 0, (bz0 + bz1) / 2, 10, 7, 13));
    arms.setAttribute("d", seg(P(dx - 9, 0, 72), P(...hl)) + seg(P(dx + 9, 0, 72), P(...hr)));
    const foot = (sx) => P(dx + sx + 40 * sw, 0, 20);
    legs.setAttribute("d", seg(P(dx - 5, 0, bz0 + 2), foot(-7)) + seg(P(dx + 5, 0, bz0 + 2), foot(7)));
    strings.setAttribute("d", seg(P(...L), P(...hl)) + seg(P(...R), P(...hr)) +
      seg(P(0, -20, BZ), P(dx, -4, hz + 14)) + seg(P(0, 20, BZ), P(dx, 4, hz + 14)));
  }

  const B = register(stage, (dt) => { const m = stepS(sa, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const lim = rad(12 + 26 * reach);
    sa.t = over === null ? REST : clamp(over, -1, 1) * lim;
    read.textContent = over === null ? "rest" : "tilt " + Math.round((sa.t * 180) / Math.PI);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = p[1] < 10 || p[1] > 310 ? null : (p[0] - 200) / 110; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "puppetstage",
  means: "A marionette on strings from a control bar: the pointer tips the bar and the puppet swings and lifts a hand.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[320, 160], [90, 160], [250, 170], null],
  mount,
});
