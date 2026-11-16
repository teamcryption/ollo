/**
 * Seed packet: a paper seed packet standing on a low tray, its top flap
 * folded up and a label window on its face. The pointer over the packet
 * tips it forward to pour and folds the flap open behind; leaving stands it
 * back up. At rest the flap is bright. The slider is how far it tips.
 *
 * The pattern: one part tilts and its flap swings (springs on the angles).
 */
const { Cam, fit, hull, poly, proj, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const V = [0.61, 0.61, 0.5], W = 56, T = 6, H = 74, F = 22, REST = 4;
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

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.2);
  const ext = [[-10, -14, 0], [W + 10, -14, 0], [W + 10, 30, 0], [-10, 30, 0], [0, 0, H + F], [W, 0, H + F], [0, 60, 30], [W, 60, 30]];
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  draw(solid(g), box(P, [-10, -14, 0], [W + 10, 30, 5]));
  const flap = solid(g), body = solid(g), win = mk("path", { class: "nf lo" }, g);
  flap.sil.classList.add("hi");

  let last = NaN;
  function pose(deg) {
    if (deg === last) return;
    last = deg;
    const tip = (p) => R(p, [0, T, 5], "x", rad(deg));
    const fold = rad(-20 - deg * 3.2);
    draw(flap, box(P, [0, 0, H], [W, 1.2, H + F], (p) => tip(R(p, [0, 0, H], "x", fold))));
    draw(body, box(P, [0, 0, 5], [W, T, H], tip));
    const q = [[8, 14], [W - 8, 14], [W - 8, 44], [8, 44]].map(([x, z]) => P(...tip([x, T, z])));
    win.setAttribute("d", poly(q));
  }
  const sp = spring(REST);
  pose(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); pose(sp.x); return m; });
  bag.add(B.unregister);

  const scr = ext.slice(0, 6).map((p) => P(...p));
  const xs = scr.map((p) => p[0]), ys = scr.map((p) => p[1]);
  const bx = [Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) + 8, Math.max(...ys) + 8];
  const inside = ([x, y]) => x > bx[0] && x < bx[2] && y > bx[1] && y < bx[3];

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? amt : REST;
    body.sil.classList.toggle("hi", v);
    read.textContent = v ? "pour" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "plantlabel",
  means: "A paper seed packet on a tray: the pointer tips it forward to pour and folds its flap open, and leaving stands it back up.",
  rules: [1, 4, 5, 8],
  range: [20, 32, 42],
  tour: [[219, 126], [200, 150], [240, 110], null],
  mount,
});
