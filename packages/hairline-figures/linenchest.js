/**
 * Blanket box: a long wooden chest on low feet, a folded blanket inside. The
 * pointer across the stage swings the lid up on its back hinge, along the long side,, on a spring,
 * to show the blanket. At rest the lid sits ajar, bright. The slider is how
 * far the lid may open.
 *
 * The pattern: a continuous aim (terrain's spring, on one hinge angle).
 */
const { Cam, fit, proj, poly, clamp, lerp, rad, spring, stepS, mk, pointer, register, disposer } = HL;

const FACES = [[4, 5, 7, 6], [0, 2, 3, 1], [1, 3, 7, 5], [0, 4, 6, 2], [2, 6, 7, 3], [0, 1, 5, 4]];
const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - a[1] * b[0]; } return s; };
const corners = (o, ex, ey, ez) => { const c = []; for (let i = 0; i < 8; i++) c.push([0, 1, 2].map((j) => o[j] + (i & 1 ? ex[j] : 0) + (i & 2 ? ey[j] : 0) + (i & 4 ? ez[j] : 0))); return c; };
const W = 46, D = 90, H = 34, F = 5, T = 4, WL = 3, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const lidC = (a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return corners([-1, -1, F + H], [(W + 2) * c, 0, (W + 2) * s], [0, D + 2, 0], [-T * s, 0, T * c]); };
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], ...lidC(0), ...lidC(110)], 200, 165);
  const P = proj(C);
  const sg = Math.sign(area([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((p) => P(...p))));
  const boxD = (c) => { const s = c.map((p) => P(...p)); return FACES.map((f) => f.map((i) => s[i])).filter((q) => area(q) * sg > 0).map(poly).join(""); };
  const quad = (pts) => poly(pts.map((p) => P(...p)));

  const g = mk("g", {}, svg);
  // feet, far ones first
  for (const [x, y] of [[0, 0], [W - 6, 0], [0, D - 6], [W - 6, D - 6]]) mk("path", { d: boxD(corners([x, y, 0], [6, 0, 0], [0, 6, 0], [0, 0, F])) }, g);
  const zt = F + H;
  const sideD = (c) => { const s = c.map((p) => P(...p)); return FACES.slice(1).map((f) => f.map((i) => s[i])).filter((q) => area(q) * sg > 0).map(poly).join(""); };
  // the open well: far inner walls and the blanket, then the outer faces and the rim
  mk("path", { d: quad([[WL, WL, zt], [W - WL, WL, zt], [W - WL, WL, zt - 14], [WL, WL, zt - 14]]) + quad([[WL, WL, zt], [WL, D - WL, zt], [WL, D - WL, zt - 14], [WL, WL, zt - 14]]), class: "lo" }, g);
  for (let k = 0; k < 3; k++) mk("path", { d: boxD(corners([WL + 1, WL + 2 + k * 27, zt - 14], [W - 2 * WL - 2, 0, 0], [0, 25, 0], [0, 0, 8 + (k % 2) * 3])) }, g);
  mk("path", { d: sideD(corners([0, 0, F], [W, 0, 0], [0, D, 0], [0, 0, H])), class: "sil" }, g);
  mk("path", { d: quad([[0, 0, zt], [W, 0, zt], [W, D, zt], [0, D, zt]]) + quad([[WL, WL, zt], [W - WL, WL, zt], [W - WL, D - WL, zt], [WL, D - WL, zt]]), class: "nf" }, g);
  mk("path", { d: quad([[W, 10, F + 8], [W, D - 10, F + 8], [W, D - 10, zt - 8], [W, 10, zt - 8]]), class: "nf lo" }, g);
  const lid = mk("path", { class: "hi" }, g);

  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    lid.setAttribute("d", boxD(lidC(a)));
  }
  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); read.textContent = sp.t === REST && !m ? "rest" : Math.round(sp.x) + "°"; return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => { sp.t = lerp(REST, max, clamp((sx - 100) / 200, 0, 1)); B.wake(); },
    leave: () => { sp.t = REST; B.wake(); },
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "linenchest",
  means: "A blanket box on low feet: the pointer swings its lid up on the back hinge to show the folded blanket inside.",
  rules: [3, 5, 6, 8],
  range: [50, 95, 110],
  tour: [[222, 173], [290, 180], [150, 170], null],
  mount,
});
