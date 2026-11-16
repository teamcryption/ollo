/**
 * Hurdle gate: a wooden sheep hurdle hung between two posts, with rails, two
 * stiles and a diagonal brace. The pointer over the gate swings it open on
 * its hinge post, toward the viewer; leaving lets it swing back ajar. At rest
 * the latch on the far post is bright. The slider is how far it opens.
 *
 * The pattern: one part swings about a hinge (spring on the angle).
 */
const { Cam, fit, hull, poly, proj, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const V = [0.61, 0.61, 0.5], L = 96, H = 46, REST = 14;
function R(p, o, ax, a) {
  const c = Math.cos(a), s = Math.sin(a);
  let x = p[0] - o[0], y = p[1] - o[1], z = p[2] - o[2];
  if (ax === "z") [x, y] = [x * c - y * s, x * s + y * c];
  else if (ax === "x") [y, z] = [y * c - z * s, y * s + z * c];
  else [x, z] = [x * c + z * s, -x * s + z * c];
  return [x + o[0], y + o[1], z + o[2]];
}
function box(P, a, b, tf = (p) => p) {
  const c = [];
  for (let i = 0; i < 8; i++) c.push(tf([i & 1 ? b[0] : a[0], i & 2 ? b[1] : a[1], i & 4 ? b[2] : a[2]]));
  let n = 0, bs = -Infinity;
  c.forEach((p, i) => { const s = p[0] * V[0] + p[1] * V[1] + p[2] * V[2]; if (s > bs) { bs = s; n = i; } });
  const s = c.map((p) => P(...p));
  let cr = "";
  for (const m of [1, 2, 4]) cr += `M${s[n][0].toFixed(2)},${s[n][1].toFixed(2)}L${s[n ^ m][0].toFixed(2)},${s[n ^ m][1].toFixed(2)}`;
  return { sil: poly(hull(s)), crease: cr };
}
const draw = (el, d) => { el.sil.setAttribute("d", d.sil); el.cr.setAttribute("d", d.crease); };

// the gate in its own frame: hinge at the origin, running along +x
const BR = Math.atan2(H - 12, L - 12);
const BARS = [
  [[6, -1, 6], [6 + Math.hypot(L - 12, H - 12), 1, 9], (p) => R(p, [6, 0, 6], "y", -BR)],
  [[2, -1.6, 4], [L, 1.6, 8]],
  [[2, -1.6, 18], [L, 1.6, 22]],
  [[2, -1.6, 31], [L, 1.6, 35]],
  [[2, -1.6, H - 4], [L, 1.6, H]],
  [[2, -2, 1], [6, 2, H + 3]],
  [[L - 4, -2, 1], [L, 2, H + 3]],
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.25);
  const ext = [[-5, -5, 0], [L + 12, 4, 0], [-5, L, 0], [-5, -5, 56], [L + 12, 4, 56], [-5, L, H]];
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  draw(solid(g), box(P, [-5, -4, 0], [1, 2, 56]));
  draw(solid(g), box(P, [L + 4, -3, 0], [L + 10, 3, 54]));
  const latch = solid(g);
  draw(latch, box(P, [L + 1, -1.5, 36], [L + 6, 1.5, 40]));
  latch.sil.classList.add("hi");
  const gate = mk("g", {}, g), bars = BARS.map(() => solid(gate));

  let last = NaN;
  function pose(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), tf = (f) => (p) => R(f ? f(p) : p, [0, 0, 0], "z", a);
    BARS.forEach(([lo, hi, f], i) => draw(bars[i], box(P, lo, hi, tf(f))));
  }
  const sp = spring(REST);
  pose(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); pose(sp.x); return m; });
  bag.add(B.unregister);

  const scr = ext.map((p) => P(...p));
  const xs = scr.map((p) => p[0]), ys = scr.map((p) => p[1]);
  const box2 = [Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) + 8, Math.max(...ys) + 8];
  const inside = ([x, y]) => x > box2[0] && x < box2[2] && y > box2[1] && y < box2[3];

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? amt : REST;
    bars.forEach((b) => b.sil.classList.toggle("hi", v));
    latch.sil.classList.toggle("hi", !v);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sheepgate",
  means: "A wooden sheep hurdle between two posts: the pointer swings the gate open on its hinge, and leaving lets it fall back ajar.",
  rules: [1, 4, 5, 8],
  range: [45, 70, 88],
  tour: [[277, 124], [240, 150], [300, 140], null],
  mount,
});
