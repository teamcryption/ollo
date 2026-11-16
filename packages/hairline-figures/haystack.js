/**
 * Pitchfork rack: a wooden tool rack, two uprights and a top rail on a base
 * plank, with a pitchfork standing tines-up against the rail. The pointer
 * over the rack tilts the fork off the rail toward the viewer, on its foot;
 * leaving lets it lean back. At rest the fork's head is bright. The slider is
 * how far it tilts.
 *
 * The pattern: one part tilts about its foot (spring on the angle).
 */
const { Cam, fit, hull, poly, proj, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const V = [0.61, 0.61, 0.5], REST = 20, FX = 34, FY = 26;
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

// the fork in its own frame: foot at the origin, handle up +z, head on top
const HANDLE = [[-1.6, -1.6, 0], [1.6, 1.6, 62]];
const HEAD = [[[-12, -1.8, 62], [12, 1.8, 66]], ...[-11, -4, 3, 10].map((x) => [[x, -1, 66], [x + 1.8, 1, 86]])];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.3);
  const ext = [[-4, -4, 0], [72, -4, 0], [72, 34, 0], [-4, 34, 0], [0, 0, 74], [70, 0, 74], [FX, FY + 52, 50], [FX, -8, 86]];
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  draw(solid(g), box(P, [-4, -4, 0], [72, 34, 4]));
  draw(solid(g), box(P, [0, 0, 4], [5, 5, 72]));
  draw(solid(g), box(P, [63, 0, 4], [68, 5, 72]));
  draw(solid(g), box(P, [-2, 0, 60], [70, 4, 66]));
  draw(solid(g), box(P, [-2, 0, 22], [70, 3, 26]));
  const fork = mk("g", {}, g), handle = solid(fork), head = HEAD.map(() => solid(fork));

  let last = NaN;
  function pose(deg) {
    if (deg === last) return;
    last = deg;
    const tf = (p) => R([p[0] + FX, p[1] + FY, p[2] + 4], [FX, FY, 4], "x", rad(deg));
    draw(handle, box(P, ...HANDLE, tf));
    HEAD.forEach(([lo, hi], i) => draw(head[i], box(P, lo, hi, tf)));
  }
  const sp = spring(REST);
  pose(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); pose(sp.x); return m; });
  bag.add(B.unregister);

  const scr = ext.slice(0, 6).map((p) => P(...p));
  const xs = scr.map((p) => p[0]), ys = scr.map((p) => p[1]);
  const bx = [Math.min(...xs) - 8, Math.min(...ys) - 30, Math.max(...xs) + 8, Math.max(...ys) + 8];
  const inside = ([x, y]) => x > bx[0] && x < bx[2] && y > bx[1] && y < bx[3];

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? REST - amt : REST;
    head.forEach((h) => h.sil.classList.toggle("hi", !v));
    handle.sil.classList.toggle("hi", v);
    head.forEach((h) => v && h.sil.classList.add("hi"));
    read.textContent = v ? "tilt" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = REST - v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "haystack",
  means: "A wooden tool rack with a pitchfork leaning on its rail: the pointer tilts the fork off the rail, and leaving lets it lean back.",
  rules: [1, 4, 5, 8],
  range: [20, 38, 50],
  tour: [[220, 53], [200, 120], [240, 140], null],
  mount,
});
