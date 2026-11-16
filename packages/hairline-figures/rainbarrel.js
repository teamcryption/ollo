/**
 * Rain barrel: a hooped barrel on a block stand with a tap near its foot.
 * The pointer over the barrel tilts it forward on the stand's front edge, as
 * if tipped to pour from the tap; leaving stands it back up. At rest the tap
 * is bright. The slider is how far it tilts.
 *
 * The pattern: one part tilts about an edge (spring on the angle).
 */
const { Cam, fit, hull, poly, proj, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const V = [0.61, 0.61, 0.5], RB = 24, HB = 58, ZS = 14, CX = 30, CY = 30, REST = 0;
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
const ring = (z, r, n = 48) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [CX + r * Math.cos(t), CY + r * Math.sin(t), z, Math.cos(t), Math.sin(t)]; });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.15);
  const ext = [[2, 2, 0], [58, 2, 0], [58, 58, 0], [2, 58, 0], [CX, CY, ZS + HB + 4], [CX + 46, CY, ZS + 40], [CX - RB, CY - RB, ZS + HB]];
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  draw(solid(g), box(P, [2, 2, 0], [58, 58, ZS]));
  const barrel = solid(g), hoops = mk("path", { class: "nf lo" }, g), lid = mk("path", { class: "nf" }, g), tap = solid(g), spout = solid(g);
  tap.sil.classList.add("hi");

  let last = NaN;
  function pose(deg) {
    if (deg === last) return;
    last = deg;
    const tf = (p) => R(p, [CX + RB, CY, ZS], "y", rad(deg));
    const pts = [];
    for (const z of [ZS, ZS + HB / 2, ZS + HB]) for (const q of ring(z, z === ZS + HB / 2 ? RB + 2 : RB)) pts.push(P(...tf(q)));
    barrel.sil.setAttribute("d", poly(hull(pts)));
    barrel.cr.setAttribute("d", "");
    let d = "";
    for (const z of [ZS + 10, ZS + HB - 10]) {
      const rr = ring(z, RB + 1.4);
      for (let i = 0; i < rr.length; i++) {
        const a = rr[i], b = rr[(i + 1) % rr.length], n = tf([a[3], a[4], 0]), o = tf([0, 0, 0]);
        if ((n[0] - o[0]) * V[0] + (n[1] - o[1]) * V[1] + (n[2] - o[2]) * V[2] <= 0) continue;
        const s = P(...tf(a)), e = P(...tf(b));
        d += `M${s[0].toFixed(2)},${s[1].toFixed(2)}L${e[0].toFixed(2)},${e[1].toFixed(2)}`;
      }
    }
    hoops.setAttribute("d", d);
    lid.setAttribute("d", poly(ring(ZS + HB, RB - 2).map((q) => P(...tf(q)))));
    draw(tap, box(P, [CX + RB - 2, CY - 2.5, ZS + 8], [CX + RB + 9, CY + 2.5, ZS + 13], tf));
    draw(spout, box(P, [CX + RB + 5, CY - 2, ZS + 3], [CX + RB + 9, CY + 2, ZS + 8], tf));
  }
  const sp = spring(REST);
  pose(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); pose(sp.x); return m; });
  bag.add(B.unregister);

  const scr = ext.map((p) => P(...p));
  const xs = scr.map((p) => p[0]), ys = scr.map((p) => p[1]);
  const bx = [Math.min(...xs) - 8, Math.min(...ys) - 8, Math.max(...xs) + 8, Math.max(...ys) + 8];
  const inside = ([x, y]) => x > bx[0] && x < bx[2] && y > bx[1] && y < bx[3];

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? amt : REST;
    barrel.sil.classList.toggle("hi", v);
    read.textContent = v ? "pour" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "rainbarrel",
  means: "A hooped rain barrel on a block stand: the pointer tips it forward to pour from its tap, and leaving stands it back up.",
  rules: [1, 4, 5, 8],
  range: [12, 22, 30],
  tour: [[200, 90], [190, 150], [230, 170], null],
  mount,
});
