/**
 * Cake dome: a cake on a footed stand under a glass dome hinged at its left.
 * The nearer the pointer comes to the cake's middle, the further the dome
 * swings open on its hinge, up and back. At rest the dome sits a crack ajar,
 * bright. The slider is how far it can open.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 34, PZ = 18, DR = 29, DH = 34, REST = 0.08;
const disc = (r, n = 40) => circ(r, n);
const E0 = Math.SQRT1_2, FMAX = 1.05;
function rotW(x, y, z, f) {
  const u = (y - x) * E0, v = (x + y) * E0, du = u - DR, dz = z - PZ;
  const u2 = DR + du * Math.cos(f) + dz * Math.sin(f), z2 = PZ + dz * Math.cos(f) - du * Math.sin(f);
  return [E0 * (v - u2), E0 * (u2 + v), z2];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let span = value;
  const C = Cam(45, 0.5, 2.85);
  const E = Math.SQRT1_2;
  const ext = [[-PR, -PR, 0], [PR, PR, 0], [PR, -PR, 0], [-PR, PR, 0], [0, 0, PZ + DH + 4]];
  for (const [x, y, z] of [[-DR, 0, PZ], [DR, 0, PZ], [0, DR, PZ], [0, -DR, PZ], [0, 0, PZ + DH + 4], [DR * E, DR * E, PZ], [DR * E, DR * E, PZ + DH * 0.7]]) ext.push(rotW(x, y, z, FMAX));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(16), disc(14), 0, 2.4));
  put(solid(g), prism(P, front, disc(4.5), disc(3.5), 2.4, PZ - 2));
  put(solid(g), prism(P, front, disc(PR, 48), disc(PR - 3, 48), PZ - 2, PZ));
  const cake = solid(g);
  put(cake, prism(P, front, disc(22), disc(20.5), PZ, PZ + 15));
  const ch = P(4, -3, PZ + 16.5);
  mk("circle", { cx: ch[0], cy: ch[1], r: 2.4, class: "dot m" }, g);
  const dome = mk("path", { class: "sil nf" }, g), rim = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  // the dome, rotated about a hinge at its far edge (toward -x, -y)
  const rot = (x, y, z, f) => P(...rotW(x, y, z, f));
  const ringR = (r, z, f, n = 36) => circ(r, n).map((q) => rot(q.u, q.v, z, f));

  const o = spring(REST);
  let last = NaN;
  function draw() {
    if (o.x === last) return;
    last = o.x;
    const f = o.x * FMAX * (0.5 + span / 160), pts = [];
    for (let i = 0; i <= 7; i++) { const t = (i / 7) * (Math.PI / 2); pts.push(...ringR(DR * Math.cos(t) + 0.01, PZ + 0.3 + DH * Math.sin(t), f)); }
    dome.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringR(DR, PZ + 2, f, 48)));
    knob.setAttribute("d", poly(hull(ringR(3, PZ + DH, f, 16).concat(ringR(3, PZ + DH + 4, f, 16)))));
  }

  const B = register(stage, (dt) => { const m = stepS(o, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(p) {
    const w = p ? unproj(C, p[0], p[1], PZ) : null;
    const dd = w ? Math.hypot(w[0], w[1]) : Infinity, act = dd < PR + 14;
    o.t = act ? clamp(1.15 - dd / (PR + 6), 0.2, 1) : REST;
    dome.classList.toggle("hi", !act);
    cake.sil.classList.toggle("hi", act);
    read.textContent = act ? Math.round(o.t * 100) + "%" : "rest";
    B.wake();
  }
  set(null);
  draw();
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { span = v; last = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "cakestand2",
  means: "A cake dome: the nearer the pointer comes to the cake, the further the glass dome swings open on its hinge at the left.",
  rules: [1, 3, 4, 8],
  range: [20, 50, 80],
  tour: [[200, 177], [99, 167], [200, 217], null],
  mount,
});
